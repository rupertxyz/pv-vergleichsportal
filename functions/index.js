const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');

admin.initializeApp();

function deleteClientFromNinox(recordId) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `https://api.ninox.com/v1/teams/Q8echuakpXZB3BPyL/databases/iwraqzm2j58a/tables/B/records/${recordId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + functions.config().ninox.apikey, // Adjusted to use Firebase environment configuration
          },
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
      console.error('Error deleting client from Ninox:', error);
      reject(false);
    }
  });
}

function deleteProjectFromNinox(recordId) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `https://api.ninox.com/v1/teams/Q8echuakpXZB3BPyL/databases/iwraqzm2j58a/tables/A/records/${recordId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + functions.config().ninox.apikey, // Adjusted to use Firebase environment configuration
          },
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
      console.error('Error deleting client from Ninox:', error);
      reject(false);
    }
  });
}

function updateClientInNinox(data, recordId) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `https://api.ninox.com/v1/teams/Q8echuakpXZB3BPyL/databases/iwraqzm2j58a/tables/B/records/${recordId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + functions.config().ninox.apikey,
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
function updateProjectInNinox(data, recordId) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `https://api.ninox.com/v1/teams/Q8echuakpXZB3BPyL/databases/iwraqzm2j58a/tables/A/records/${recordId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + functions.config().ninox.apikey,
          },
          body: JSON.stringify({
            fields: {
              Wärmepumpe: data['Wärmepumpe'],
              'E-Auto in Planung': data['E-Auto in Planung'],
              Sonderbelegung: data['Sonderbelegung'],
              'Anzahl Module': data['Anzahl Module'],
              'Anzahl Optimierer': data['Anzahl Optimierer'],
              'Benötigte kWp': data['Benötigte kWp'],
              Speichergröße: data['Speichergröße'],
              'Anzahl Stockwerke': data['Anzahl Stockwerke'],
              'Anzahl Dachseiten': data['Anzahl Dachseiten'],
              'Glas-Glas-Module': data['Glas-Glas-Module'],
              'Full-Black-Module': data['Full-Black-Module'],
              Kabelweg: data['Kabelweg'],
              'Ziegeldeckmaß Länge': data['Ziegeldeckmaß Länge'],
              'Ziegeldeckmaß Breite': data['Ziegeldeckmaß Breite'],
              'Dachneigung in Grad': data['Dachneigung in Grad'],
              'Sparrenmaße Abstand': data['Sparrenmaße Abstand'],
              'Sparrenmaße Höhe': data['Sparrenmaße Höhe'],
              'Sparrenmaße Breite': data['Sparrenmaße Breite'],
              'Aufsparrendämmung Stärke': data['Aufsparrendämmung Stärke'],
              'Trapezblech Stärke': data['Trapezblech Stärke'],
              Sandwichblech: data['Sandwichblech'],
              'Ziegel geklammert': data['Ziegel geklammert'],
              'Ziegel gemörtelt': data['Ziegel gemörtelt'],
              'Ziegelsanierung anbieten': data['Ziegelsanierung anbieten'],
              'POT Schiene': data['POT Schiene'],
              Staberder: data['Staberder'],
              Kaskade: data['Kaskade'],
              Zählerzusammenlegung: data['Zählerzusammenlegung'],
              ['Priv. Unterzähler']: data['Priv. Unterzähler'],
              Unterverteiler: data['Unterverteiler'],
              'Zählerschrank tauschen': data['Zählerschrank tauschen'],
              'Anzahl Zählerfelder': data['Anzahl Zählerfelder'] || '',
              'Standort Zählerschrank': data['Standort Zählerschrank'],
              'Standort HAK': data['Standort HAK'],
              'Länge Kabelweg von HAK zu ZS':
                data['Länge Kabelweg von HAK zu ZS'],
              'OTP-Wert': data['OTP-Wert'],
              'Notstrom planen': data['Notstrom planen'],
              'Internetanschluss (LAN) am Wechselrichterplatz vorhanden':
                data[
                  'Internetanschluss (LAN) am Wechselrichterplatz vorhanden'
                ],
              'Angebot PDF': data['Angebot PDF'] || '',
              Abschlusstermin: data['Abschlusstermin'],
              Chart: data['Chart'],
              Signatur: data['Signatur'],
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
      console.error('Error updating project in Ninox:', error);
      reject(false);
    }
  });
}

exports.updateNinoxClient = functions.firestore
  .document('clients/{clientId}')
  .onUpdate((change, context) => {
    const id = context.params.clientId;
    console.log('userId', id);
    const data = change.after.data();
    console.log(data);

    return updateClientInNinox(data, id);
  });

exports.updateNinoxProject = functions.firestore
  .document('projects/{projectId}')
  .onUpdate((change, context) => {
    const id = context.params.projectId;
    console.log('projectId', id);
    const data = change.after.data();
    console.log(data);

    return updateProjectInNinox(data, id);
  });

exports.deleteClientInNinox = functions.firestore
  .document('clients/{clientId}')
  .onDelete((snap, context) => {
    console.log(context);
    const id = context.params.clientId;
    console.log('Deleting client with ID:', id);

    return deleteClientFromNinox(id);
  });

exports.deleteProjectInNinox = functions.firestore
  .document('projects/{projectId}')
  .onDelete((snap, context) => {
    console.log(context);
    const id = context.params.projectId;
    console.log('Deleting client with ID:', id);

    return deleteProjectFromNinox(id);
  });
