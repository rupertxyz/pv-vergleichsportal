const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');

admin.initializeApp();

function updateClientInNinox(data, recordId) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `https://api.ninox.com/v1/teams/Q8echuakpXZB3BPyL/databases/iwraqzm2j58a/tables/B/records/${recordId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + functions.config().ninox.apikey, // Pulling from Firebase environment configuration,
          },
          body: JSON.stringify({
            fields: {
              Vorname: data['Vorname'],
              Nachname: data['Nachname'],
              Anrede: data['Anrede'],
              Titel: data['Titel'],
              Firma: data['Firma'],
              Adresse: data['Adresse'],
              Telefon: data['Telefon'],
              Email: data['Email'],
              Hausstromverbrauch: data['Hausstromverbrauch'],
              Nutzstromverbrauch: data['Nutzstromverbrauch'],
              'E-Auto Stromverbrauch': data['E-Auto Stromverbrauch'],
              'Arbeitspreis ct/kWh': data['Arbeitspreis'],
              'Grundgebühr pro Jahr': data['Grundgebühr pro Jahr'],
              Notizen: data['Notizen'],
              Leadquelle: data['Leadquelle'],
              Besuchstermin: data['Besuchstermin']
                ? data['Besuchstermin'].split('.').reverse().join('-')
                : '',
            },
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          `Ninox API returned error: ${JSON.stringify(responseData)}`
        );
      }

      resolve(true);
    } catch (error) {
      console.error('Error updating client in Ninox:', error);
      reject(false);
    }
  });
}

exports.updateNinox = functions.firestore
  .document('clients/{clientId}')
  .onUpdate((change, context) => {
    const id = context.params.clientId;
    console.log('userId', id);
    const data = change.after.data();
    console.log(data);

    return updateClientInNinox(data, id);
  });
