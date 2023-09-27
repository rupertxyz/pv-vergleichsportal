import { storage } from '../config/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db } from '../config/firebase';
import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  collection,
} from 'firebase/firestore';

export async function uploadFile(type, data) {
  try {
    // create reference
    const storageRef = ref(
      storage,
      `${type}/${data.vorname}-${data.nachname}.png`
    );

    // upload file from data url
    await uploadString(storageRef, data[type], 'data_url');

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error:', error);
  }
}

// create new client in firestore
export async function createClientInFirebase(ninoxCustomerId, ninoxProjectId) {
  try {
    const customerDocRef = doc(db, 'clients', String(ninoxCustomerId));
    const projectDocRef = doc(db, 'projects', String(ninoxProjectId));
    await setDoc(customerDocRef, {
      ninoxId: ninoxCustomerId,
      projectId: ninoxProjectId,
    });
    await setDoc(projectDocRef, {
      ninoxId: ninoxProjectId,
      customerId: ninoxCustomerId,
    });
    return { customerId: customerDocRef.id, projectId: projectDocRef.id };
  } catch (error) {
    console.error('Error adding document: ', error);
  }
}

export async function updateClientAndProjectInFirebase(data, ninoxCustomerId) {
  const customerDocRef = doc(db, 'clients', String(ninoxCustomerId));
  // get project id from customer doc
  const customerDoc = await getDoc(customerDocRef);
  const ninoxProjectId = customerDoc.data().projectId;
  const projectDocRef = doc(db, 'projects', String(ninoxProjectId));

  // Define client and project data
  await updateDoc(customerDocRef, {
    Vorname: data.vorname,
    Nachname: data.nachname,
    Anrede: data.anrede,
    Titel: data.titel,
    Firma: data.firma,
    Adresse: data.adresse,
    Telefon: data.telefon,
    Email: data.email,
    Hausstromverbrauch: Number(data.hausstromverbrauch) || 0,
    Nutzstromverbrauch: Number(data.nutzstromverbrauch) || 0,
    'E-Auto Stromverbrauch': Number(data.eAutoVerbrauch) || 0,
    Arbeitspreis: Number(data.arbeitspreis),
    'Grundgebühr pro Jahr': Number(data.grundgebuehr),
    Notizen: data.bemerkungen,
    Leadquelle: data.leadSource,
    Besuchstermin: data.besuchstermin
      ? data.besuchstermin.split('.').reverse().join('-')
      : '',
  });

  await updateDoc(projectDocRef, {
    Wärmepumpe: data.waermepumpe ? true : false,
    'E-Auto in Planung': data.eAutoPlanung ? true : false,
    Sonderbelegung: data.sonderbelegung ? true : false,
    'Anzahl Module': Number(data.anzahlModule),
    'Anzahl Optimierer': Number(data.anzahlOptimierer),
    'Benötigte kWp': Number(data.benoetigteKwp),
    Speichergröße: Number(data.speicherGroesse),
    'Anzahl Stockwerke': Number(data.anzahlStockwerke),
    'Anzahl Dachseiten': Number(data.anzahlDachseiten),
    'Glas-Glas-Module': data.glasGlasModule ? true : false,
    'Full-Black-Module': data.fullBlackModule ? true : false,
    Kabelweg: data.kabelweg,
    'Ziegeldeckmaß Länge': Number(data.ziegeldeckmassLaenge),
    'Ziegeldeckmaß Breite': Number(data.ziegeldeckmassBreite),
    'Dachneigung in Grad': Number(data.dachneigung),
    'Sparrenmaße Abstand': Number(data.sparrenmassAbstand),
    'Sparrenmaße Höhe': Number(data.sparrenmassHoehe),
    'Sparrenmaße Breite': Number(data.sparrenmassBreite),
    'Aufsparrendämmung Stärke': Number(data.aufsparrendaemmungStaerke),
    'Trapezblech Stärke': Number(data.trapezblechStaerke),
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
    'Anzahl Zählerfelder': Number(data.anzahlZaehlerFelder) || '',
    'Standort Zählerschrank': data.standortZaehlerschrank,
    'Standort HAK': data.standortHak,
    'Länge Kabelweg von HAK zu ZS': Number(data.laengeKabelwegHakZs),
    'OTP-Wert': Number(data.otpWert),
    'Notstrom planen': data.notstromPlanen ? true : false,
    'Internetanschluss (LAN) am Wechselrichterplatz vorhanden':
      data.internetanschlussVorhanden ? true : false,
    'Angebot PDF': data.pdf || '',
    Abschlusstermin: data.abschlussTermin
      ? data.abschlussTermin.split('.').reverse().join('-')
      : '',
    Chart: data.chart,
    Signatur: data.signature,
  });
  return true;
}

// Delete client from Firestore
export async function deleteClientFromFirebase(ninoxCustomerId) {
  try {
    const customerDocRef = doc(db, 'clients', String(ninoxCustomerId));
    // get project id from customer doc
    const customerDoc = await getDoc(customerDocRef);
    const ninoxProjectId = customerDoc.data().projectId;
    const projectDocRef = doc(db, 'projects', String(ninoxProjectId));

    await deleteDoc(customerDocRef);
    await deleteDoc(projectDocRef);

    return {
      deletedCustomerId: ninoxCustomerId,
      deletedProjectId: ninoxProjectId,
    };
  } catch (error) {
    console.error('Error deleting document: ', error);
  }
}

// Load all clients from Firestore
export async function loadClientsFromFirebase() {
  try {
    const querySnapshot = await getDocs(collection(db, 'clients'));
    const clients = [];
    querySnapshot.forEach((doc) => {
      const client = doc.data();
      clients.push({
        id: doc.id,
        vorname: client.Vorname || '',
        nachname: client.Nachname || '',
        anrede: client.Anrede || '',
        titel: client.Titel || '',
        firma: client.Firma || '',
        adresse: client.Adresse || '',
        telefon: client.Telefon || '',
        email: client.Email || '',
        hausstromverbrauch: client.Hausstromverbrauch || '',
        nutzstromverbrauch: client.Nutzstromverbrauch || '',
        eAutoVerbrauch: client['E-Auto Stromverbrauch'] || '',
        arbeitspreis: client['Arbeitspreis'] || '',
        grundgebuehr: client['Grundgebühr pro Jahr'] || '',
        bemerkungen: client.Notizen || '',
        projectId: client.projectId || '',
      });
    });
    // add pdf from related project
    for (const client of clients) {
      const projectDocRef = doc(db, 'projects', String(client.projectId));
      const projectDoc = await getDoc(projectDocRef);
      client.pdf = projectDoc.data().pdf || '';
    }
    return clients;
  } catch (error) {
    console.error('Error getting documents: ', error);
  }
}

// Load single client from Firestore
export async function loadSingleClientAndProjectFromFirebase(customerId) {
  try {
    const customerDocRef = doc(db, 'clients', String(customerId));
    const customerDoc = await getDoc(customerDocRef);
    const client = customerDoc.data();
    const projectDocRef = doc(db, 'projects', String(client.projectId));
    const projectDoc = await getDoc(projectDocRef);
    const project = projectDoc.data();
    const data = { ...client, ...project };
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
      arbeitspreis: data['Arbeitspreis'] || 0.4,
      grundgebuehr: data['Grundgebühr pro Jahr'] || 120,
      bemerkungen: data.Notizen || '',
      leadSource: data.Leadquelle || '',
      besuchstermin: data.Besuchstermin || new Date(),
      waermepumpe: data.Wärmepumpe || '',
      eAutoPlanung: data['E-Auto in Planung'] || '',
      sonderbelegung: data['Sonderbelegung'] || false,
      anzahlModule: data['Anzahl Module'] || 24,
      anzahlOptimierer: data['Anzahl Optimierer'] || '',
      benoetigteKwp: data['Benötigte kWp'] || '',
      speicherGroesse: data['Speichergröße'] || 10,
      anzahlStockwerke: data['Anzahl Stockwerke'] || 2,
      anzahlDachseiten: data['Anzahl Dachseiten'] || 2,
      glasGlasModule: data['Glas-Glas-Module'] || true,
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
  } catch (error) {
    console.error('Error getting documents: ', error);
  }
}
