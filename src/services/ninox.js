export async function saveToNinox(data, recordId) {
  // update client record in Ninox
  const clientUpdateResponse = await fetch(
    `https://api.ninox.com/v1/teams/Q8echuakpXZB3BPyL/databases/iwraqzm2j58a/tables/B/records/${recordId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.REACT_APP_NINOX_API_KEY,
      },
      body: JSON.stringify({
        fields: {
          Vorname: data.vorname,
          Nachname: data.nachname,
          Anrede: data.anrede,
          Titel: data.titel,
          Firma: data.firma,
          Adresse: data.adresse,
          Telefon: data.telefon,
          Email: data.email,
          Hausstromverbrauch: data.hausstromverbrauch,
          Nutzstromverbrauch: data.nutzstromverbrauch,
          'E-Auto Stromverbrauch': data.eAutoVerbrauch,
          'Arbeitspreis ct/kWh': data.arbeitspreis,
          'Grundgebühr pro Jahr': data.grundgebuehr,
          Notizen: data.bemerkungen,
          Leadquelle: data.leadSource,
          Besuchstermin: data.besuchstermin
            ? data.besuchstermin.split('.').reverse().join('-')
            : '',
        },
      }),
    }
  );
  const clientData = await clientUpdateResponse.json();

  // update project record in Ninox
  const projectUpdateResponse = await fetch(
    `https://api.ninox.com/v1/teams/Q8echuakpXZB3BPyL/databases/iwraqzm2j58a/tables/A/records/${clientData.fields.Projekte[0]}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.REACT_APP_NINOX_API_KEY,
      },
      body: JSON.stringify({
        fields: {
          Wärmepumpe: data.waermepumpe ? true : false,
          'E-Auto in Planung': data.eAutoPlanung ? true : false,
          Sonderbelegung: data.sonderbelegung ? true : false,
          'Anzahl Module': data.anzahlModule,
          'Anzahl Optimierer': data.anzahlOptimierer,
          'Benötigte kWp': data.benoetigteKwp,
          Speichergröße: data.speicherGroesse,
          'Anzahl Stockwerke': data.anzahlStockwerke,
          'Anzahl Dachseiten': data.anzahlDachseiten,
          'Glas-Glas-Module': data.glasGlasModule ? true : false,
          'Full-Black-Module': data.fullBlackModule ? true : false,
          Kabelweg: data.kabelweg,
          'Ziegeldeckmaß Länge': data.ziegeldeckmassLaenge,
          'Ziegeldeckmaß Breite': data.ziegeldeckmassBreite,
          'Dachneigung in Grad': data.dachneigung,
          'Sparrenmaße Abstand': data.sparrenmassAbstand,
          'Sparrenmaße Höhe': data.sparrenmassHoehe,
          'Sparrenmaße Breite': data.sparrenmassBreite,
          'Aufsparrendämmung Stärke': data.aufsparrendaemmungStaerke,
          'Trapezblech Stärke': data.trapezblechStaerke,
          Sandwichblech: data.sandwichblech ? true : false,
          'Ziegel geklammert': data.ziegelgeklammert ? true : false,
          'Ziegel gemörtelt': data.ziegelgemoertelt ? true : false,
          'Ziegelsanierung anbieten': data.ziegelsanierung ? true : false,
          'POT Schiene': data.potSchiene ? true : false,
          Staberder: data.staberder ? true : false,
          Kaskade: data.kaskade ? true : false,
          Zählerzusammenlegung: data.zaehlerzusammenlegung ? true : false,
          'Priv. Unterzähler': data.privUnterzaehler ? true : false,
          Unterverteiler: data.unterverteiler ? true : false,
          'Zählerschrank tauschen': data.zaehlerschrankTauschen ? true : false,
          'Anzahl Zählerfelder': data.anzahlZaehlerFelder || '',
          'Standort Zählerschrank': data.standortZaehlerschrank,
          'Standort HAK': data.standortHak,
          'Länge Kabelweg von HAK zu ZS': data.laengeKabelwegHakZs,
          'OTP-Wert': data.otpWert,
          'Notstrom planen': data.notstromPlanen ? true : false,
          'Internetanschluss (LAN) am Wechselrichterplatz vorhanden':
            data.internetanschlussVorhanden,
          'Angebot PDF': data.pdf,
          Abschlusstermin: data.abschlussTermin
            ? data.abschlussTermin.split('.').reverse().join('-')
            : '',
          Chart: data.chart,
          Signatur: data.signature,
        },
      }),
    }
  );
  const projectData = await projectUpdateResponse.json();
  if (clientUpdateResponse.ok && projectUpdateResponse.ok) {
    return true;
  } else {
    return false;
  }
}

export async function loadNinoxData() {
  const customerResponse = await fetch(
    `https://api.ninox.com/v1/teams/Q8echuakpXZB3BPyL/databases/iwraqzm2j58a/tables/B/records`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.REACT_APP_NINOX_API_KEY,
      },
    }
  );
  const customerData = await customerResponse.json();

  // load project records
  const projectResponse = await fetch(
    `https://api.ninox.com/v1/teams/Q8echuakpXZB3BPyL/databases/iwraqzm2j58a/tables/A/records`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.REACT_APP_NINOX_API_KEY,
      },
    }
  );

  // find project record for each customer and add it to the customer object as a field
  const projectData = await projectResponse.json();
  customerData.map((customer) => {
    const project = projectData.find(
      (project) => project.id === customer.fields.Projekte[0]
    );
    customer.fields.Projekte.pdf = project.fields['Angebot PDF'];
    return customer;
  });
  return customerData.map((customer) => {
    return {
      id: customer.id,
      vorname: customer.fields.Vorname,
      nachname: customer.fields.Nachname,
      anrede: customer.fields.Anrede,
      titel: customer.fields.Titel,
      firma: customer.fields.Firma,
      pdf: customer.fields.Projekte.pdf,
    };
  });
}

export async function createClient() {
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
          fields: {},
        },
      ]),
    }
  );
  const data = await customerResponse.json();

  // create project record in Ninox
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
            Kunde: data[0].id,
          },
        },
      ]),
    }
  );
  return data[0].id;
}

export async function getNinoxRecord(recordId) {
  const customerResponse = await fetch(
    `https://api.ninox.com/v1/teams/Q8echuakpXZB3BPyL/databases/iwraqzm2j58a/tables/B/records/${recordId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.REACT_APP_NINOX_API_KEY,
      },
    }
  );
  const customerData = await customerResponse.json();

  // get project record in Ninox
  const projectResponse = await fetch(
    `https://api.ninox.com/v1/teams/Q8echuakpXZB3BPyL/databases/iwraqzm2j58a/tables/A/records/${customerData.fields.Projekte[0]}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.REACT_APP_NINOX_API_KEY,
      },
    }
  );

  const projectData = await projectResponse.json();

  const data = { ...customerData.fields, ...projectData.fields };

  return {
    id: data.id || '',
    vorname: data.Vorname || '',
    nachname: data.Nachname || '',
    anrede: data.Anrede || '',
    titel: data.Titel || '',
    firma: data.Firma || '',
    adresse: data.Adresse || '',
    telefon: data.Telefon || '',
    email: data.Email || '',
    hausstromverbrauch: data.Hausstromverbrauch || 5000,
    nutzstromverbrauch: data.Nutzstromverbrauch || '',
    eAutoVerbrauch: data['E-Auto Stromverbrauch'] || '',
    arbeitspreis: data['Arbeitspreis ct/kWh'] || 0.4,
    grundgebuehr: data['Grundgebühr pro Jahr'] || 120,
    bemerkungen: data.Notizen || '',
    leadSource: data.Leadquelle || '',
    besuchstermin: data.Besuchstermin || '',
    waermepumpe: data.Wärmepumpe || '',
    eAutoPlanung: data['E-Auto in Planung'] || '',
    sonderbelegung: data['Sonderbelegung'] || false,
    anzahlModule: data['Anzahl Module'] || 24,
    anzahlOptimierer: data['Anzahl Optimierer'] || '',
    benoetigteKwp: data['Benötigte kWp'] || '',
    speicherGroesse: data['Speichergröße'] || '',
    anzahlStockwerke: data['Anzahl Stockwerke'] || 2,
    anzahlDachseiten: data['Anzahl Dachseiten'] || 2,
    glasGlasModule: data['Glas-Glas-Module'] || false,
    fullBlackModule: data['Full-Black-Module'] || false,
    kabelweg: data['Kabelweg'] || '',
    ziegeldeckmassLaenge: data['Ziegeldeckmaß Länge'] || 0.42,
    ziegeldeckmassBreite: data['Ziegeldeckmaß Breite'] || 0.3,
    dachneigung: data['Dachneigung in Grad'] || '',
    sparrenmassAbstand: data['Sparrenmaße Abstand'] || 0.6,
    sparrenmassHoehe: data['Sparrenmaße Höhe'] || 0.12,
    sparrenmassBreite: data['Sparrenmaße Breite'] || 0.1,
    aufsparrendaemmungStaerke: data['Aufsparrendämmung Stärke'] || '',
    trapezblechStaerke: data['Trapezblech Stärke'] || '',
    sandwichblech: data['Sandwichblech'] || false,
    ziegelgeklammert: data['Ziegel geklammert'] || false,
    ziegelgemoertelt: data['Ziegel gemörtelt'] || false,
    ziegelsanierung: data['Ziegelsanierung anbieten'] || false,
    potSchiene: data['POT Schiene'] || false,
    staberder: data['Staberder'] || false,
    kaskade: data['Kaskade'] || false,
    zaehlerzusammenlegung: data['Zählerzusammenlegung'] || false,
    privUnterzaehler: data['Priv. Unterzähler'] || false,
    unterverteiler: data['Unterverteiler'] || false,
    zaehlerschrankTauschen: data['Zählerschrank tauschen'] || false,
    anzahlZaehlerfelder: data['Anzahl Zählerfelder'] || '',
    standortZaehlerschrank: data['Standort Zählerschrank'] || '',
    standortHak: data['Standort HAK'] || '',
    laengeKabelwegHakZs: data['Länge Kabelweg von HAK zu ZS'] || 5,
    otpWert: data['OTP-Wert'] || 0.25,
    notstromPlanen: data['Notstrom planen'] || false,
    internetanschlussVorhanden:
      data['Internetanschluss (LAN) am Wechselrichterplatz vorhanden'] || false,
    abschlussTermin: data['Abschlusstermin'] || '',
    chart: data['Chart'] || '',
    signature: data['Signatur'] || '',
  };
}

export async function deleteClient(recordId) {
  const response = await fetch(
    `https://api.ninox.com/v1/teams/Q8echuakpXZB3BPyL/databases/iwraqzm2j58a/tables/B/records/${recordId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.REACT_APP_NINOX_API_KEY,
      },
    }
  );
  const data = await response.json();
  return data;
}
