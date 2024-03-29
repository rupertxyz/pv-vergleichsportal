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
          Besuchstermin: data.besuchstermin ? data.besuchstermin : '',
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
  await projectUpdateResponse.json();
  if (clientUpdateResponse.ok && projectUpdateResponse.ok) {
    return true;
  } else {
    return false;
  }
}

export async function loadNinoxData() {
  try {
    // Fetch all client records
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

    // Fetch all project records at once
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
    const allProjectData = await projectResponse.json();

    // Map customerData with their respective project data
    return customerData.map((customer) => {
      const projectId = customer.fields.Projekte[0];
      const projectData = allProjectData.find(
        (project) => project.id === projectId
      );

      const data = { ...customer.fields, ...projectData.fields };

      return {
        id: data.Kunde || '',
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
        besuchstermin:
          data.Besuchstermin || new Date().toISOString().split('T')[0],
        waermepumpe: data.Wärmepumpe || false,
        eAutoPlanung: data['E-Auto in Planung'] || false,
        sonderbelegung: data['Sonderbelegung'] || false,
        anzahlModule: data['Anzahl Module'] || 24,
        anzahlOptimierer: data['Anzahl Optimierer'] || '',
        benoetigteKwp: data['Benötigte kWp'] || '',
        speicherGroesse: data['Speichergröße'] || 10,
        anzahlStockwerke: data['Anzahl Stockwerke'] || 2,
        anzahlDachseiten: data['Anzahl Dachseiten'] || 2,
        glasGlasModule: data['Glas-Glas-Module'] || false,
        fullBlackModule: data['Full-Black-Module'] || false,
        kabelweg: data['Kabelweg'] || '',
        ziegeldeckmassLaenge: data['Ziegeldeckmaß Länge'] || '',
        ziegeldeckmassBreite: data['Ziegeldeckmaß Breite'] || '',
        dachneigung: data['Dachneigung in Grad'] || '',
        sparrenmassAbstand: data['Sparrenmaße Abstand'] || '',
        sparrenmassHoehe: data['Sparrenmaße Höhe'] || '',
        sparrenmassBreite: data['Sparrenmaße Breite'] || '',
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
        anzahlZaehlerFelder: data['Anzahl Zählerfelder'] || '',
        standortZaehlerschrank: data['Standort Zählerschrank'] || '',
        standortHak: data['Standort HAK'] || '',
        laengeKabelwegHakZs: data['Länge Kabelweg von HAK zu ZS'] || '',
        otpWert: data['OTP-Wert'] || 0,
        notstromPlanen: data['Notstrom planen'] || false,
        internetanschlussVorhanden:
          data['Internetanschluss (LAN) am Wechselrichterplatz vorhanden'] ||
          false,
        abschlussTermin: data['Abschlusstermin'] || '',
        chart: data['Chart'] || '',
        signature: data['Signatur'] || '',
      };
    });
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function createClient(recordId) {
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

  const projectData = await projectResponse.json();
  return { customerId: data[0].id, projectId: projectData[0].id };
}

export async function deleteClient(recordId) {
  // get project id first
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
  const projectId = customerData.fields.Projekte[0];
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
  await response.json();
  // delete related project
  await fetch(
    `https://api.ninox.com/v1/teams/Q8echuakpXZB3BPyL/databases/iwraqzm2j58a/tables/A/records/${projectId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.REACT_APP_NINOX_API_KEY,
      },
    }
  );
  return true;
}
