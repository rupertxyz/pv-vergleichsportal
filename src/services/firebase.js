import { storage } from '../config/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

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
