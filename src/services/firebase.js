import { storage } from '../config/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db } from '../config/firebase';
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore';

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
    await setDoc(customerDocRef, { ninoxId: ninoxCustomerId });
    await setDoc(projectDocRef, {
      ninoxId: ninoxProjectId,
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
  // const projectRef = collection('projects').doc(recordId);

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
  return true;
}
