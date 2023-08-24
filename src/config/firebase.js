import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

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

export { storage, app as default };