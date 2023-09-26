import { storage } from '../config/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db } from '../config/firebase';
import { doc, setDoc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';

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
    console.log('Customer document written with ID: ', customerDocRef.id);
    console.log('Project document written with ID: ', projectDocRef.id);
    return { customerId: customerDocRef.id, projectId: projectDocRef.id };
  } catch (error) {
    console.error('Error adding document: ', error);
  }
}

export async function updateClientAndProjectInFirebase(data, ninoxCustomerId) {
  // Define references for the client and project documents
  const customerDocRef = doc(db, 'clients', String(ninoxCustomerId));
  const projectId = await getDoc(customerDocRef).then((doc) => {
    return doc.data().projectId;
  });
  const projectDocRef = doc(db, 'projects', String(projectId));

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
    Hausstromverbrauch: data.hausstromverbrauch,
    Nutzstromverbrauch: data.nutzstromverbrauch,
    'E-Auto Stromverbrauch': data.eAutoVerbrauch,
    Arbeitspreis: data.arbeitspreis,
    'Grundgebühr pro Jahr': data.grundgebuehr,
    Notizen: data.bemerkungen,
    Leadquelle: data.leadSource,
    Besuchstermin: data.besuchstermin
      ? data.besuchstermin.split('.').reverse().join('-')
      : '',
  });
  console.log('Customer document updated with ID: ', customerDocRef.id);

  await updateDoc(projectDocRef, {
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
    'Angebot PDF': data.pdf || '',
    Abschlusstermin: data.abschlussTermin
      ? data.abschlussTermin.split('.').reverse().join('-')
      : '',
    Chart: data.chart,
    Signatur: data.signature,
  });
  console.log('Project document updated with ID: ', projectDocRef.id);
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

    console.log('Customer document deleted with ID: ', ninoxCustomerId);
    console.log('Project document deleted with ID: ', ninoxProjectId);

    return {
      deletedCustomerId: ninoxCustomerId,
      deletedProjectId: ninoxProjectId,
    };
  } catch (error) {
    console.error('Error deleting document: ', error);
  }
}
