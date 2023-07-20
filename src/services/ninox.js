export async function saveToNinox(data) {
  const customerResponse = await fetch(
    `https://api.ninox.com/v1/teams/Q8echuakpXZB3BPyL/databases/iwraqzm2j58a/tables/B/records`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.REACT_APP_NINOX_API_KEY,
      },
      body: JSON.stringify([
        {
          fields: {
            Vorname: data.vorname,
            Nachname: data.nachname,
            Anrede: data.anrede,
            Titel: data.titel,
            Firma: data.firma,
            Adresse: data.adresse,
            Telefon: data.telefon,
            Email: data.email,
          },
        },
      ]),
    }
  );
  const customerResponseData = await customerResponse.json();
  const projectResponse = await fetch(
    `https://api.ninox.com/v1/teams/Q8echuakpXZB3BPyL/databases/iwraqzm2j58a/tables/A/records`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.REACT_APP_NINOX_API_KEY,
      },
      body: JSON.stringify([
        {
          fields: {
            'Lead-Quelle': data.leadSource,
            Besuchstermin: data.besuchstermin
              ? data.besuchstermin.split('.').reverse().join('-')
              : '',
            Hausstromverbrauch: data.hausstromverbrauch,
            Nutzstromverbrauch: data.nutzstromverbrauch,
            'E-Auto Stromverbrauch': data.eAutoVerbrauch,
            Arbeitspreis: data.arbeitspreis,
            'Grundgebühr pro Jahr': data.grundgebuehr,
            Kunde: customerResponseData[0].id,
            Wärmepumpe: data.waermepumpe ? true : false,
            'E-Auto in Planung': data.eAutoPlanung ? true : false,
          },
        },
      ]),
    }
  );
  if (projectResponse.ok && customerResponse.ok) {
    return true;
  } else {
    return false;
  }
}

export async function loadNinoxData() {
  const response = await fetch(
    `https://api.ninox.com/v1/teams/Q8echuakpXZB3BPyL/databases/iwraqzm2j58a/tables/B/records`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.REACT_APP_NINOX_API_KEY,
      },
    }
  );
  const data = await response.json();
  return data.map((record) => {
    return {
      id: record.id,
      vorname: record.fields.Vorname,
      nachname: record.fields.Nachname,
      anrede: record.fields.Anrede,
      titel: record.fields.Titel,
      firma: record.fields.Firma,
      adresse: record.fields.Adresse,
      telefon: record.fields.Telefon,
      email: record.fields.Email,
    };
  });
}
