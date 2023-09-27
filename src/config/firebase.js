import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  enableIndexedDbPersistence,
  connectFirestoreEmulator,
  CACHE_SIZE_UNLIMITED,
} from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'pv-vergleichsportal.firebaseapp.com',
  projectId: 'pv-vergleichsportal',
  storageBucket: 'pv-vergleichsportal.appspot.com',
  messagingSenderId: '32551160353',
  appId: '1:32551160353:web:3a0153fd6ec759fc43b160',
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
const auth = getAuth(app);
const db = getFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
});

// if (process.env.REACT_APP_NODE_ENV === 'development') {
//   connectFirestoreEmulator(db, 'localhost', 8080);
// }

// Enable offline persistence
enableIndexedDbPersistence(db)
  .then(() => console.log('Persistence enabled!'))
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a a time.
      console.log('Persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      // The current browser does not support all of the features required to enable persistence.
      console.log('The current browser does not support offline persistence.');
    }
  });

export { storage, auth, db, app as default };
