import React, { useState, useEffect } from 'react';
import { Outlet, redirect, useLoaderData } from 'react-router-dom';
import Header from './Header';
import SignIn from './components/Auth/SignIn';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from './config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Loading from './Loading';
import {
  loadNinoxData,
  saveToNinox,
  createClient,
  deleteClient,
} from './services/ninox';
import { useLiveQuery } from 'dexie-react-hooks';
import indexDb from './config/dexie';

async function clientLoader() {
  return await loadNinoxData();
}

function areArraysDifferent(arr1 = [], arr2 = []) {
  // Check for different lengths first
  if (arr1.length !== arr2.length) return true;

  // Sort and stringify to make comparison easier
  const sortedStr1 = arr1.map(JSON.stringify).sort().join(',');
  const sortedStr2 = arr2.map(JSON.stringify).sort().join(',');

  return sortedStr1 !== sortedStr2;
}

const Root = () => {
  const [authUser, setAuthUser] = useState(null);
  const [userObject, setUserObject] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [clientDataFromNinox, setClientDataFromNinox] = useState([]);
  const loaderData = useLoaderData();
  const [offline, setOffline] = useState(false);
  const [isIndexedDbDiff, setIsIndexedDbDiff] = useState(false);

  const customers = useLiveQuery(() => indexDb.data.toArray(), []);
  console.log('client data from ninox', clientDataFromNinox);
  console.log('customers', customers);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
      setLoadingAuth(false);
    });

    return () => listen();
  }, []);

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('Sign-out successful.');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    async function fetchUserDocument() {
      try {
        const userDocRef = doc(db, 'users', authUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserObject(userDoc.data());
        } else {
          console.log('No such document!');
        }
      } catch (err) {
        console.error(err);
      }
    }

    if (authUser) {
      fetchUserDocument();
    }

    return () => {
      setUserObject(null);
    };
  }, [authUser]);

  useEffect(() => {
    // add customers to indexedDB with Dexie
    if (customers && !customers.length && clientDataFromNinox.length) {
      indexDb.data.bulkPut(clientDataFromNinox);
    }
  }, [clientDataFromNinox, customers]);

  useEffect(() => {
    // check if indexedDB is different from ninox data
    if (customers && customers.length && clientDataFromNinox.length) {
      if (areArraysDifferent(customers, clientDataFromNinox)) {
        setIsIndexedDbDiff(true);
      } else {
        setIsIndexedDbDiff(false);
      }
    }
  }, [customers, clientDataFromNinox]);

  useEffect(() => {
    if (!navigator.onLine) {
      setOffline(true);
    } else {
      setOffline(false);
    }
  });

  useEffect(() => {
    if (loaderData) {
      setClientDataFromNinox(loaderData);
    }
  }, [loaderData]);

  async function updateNinox() {
    if (!offline) {
      if (clientDataFromNinox.length) {
        // loop over customers in indexedDB and check if they exist in ninox
        for (const customer of customers) {
          // find customer id in ninox
          const ninoxId = clientDataFromNinox.find(
            (ninoxCustomer) => ninoxCustomer.id === customer.id
          );
          if (!ninoxId) {
            const { customerId } = await createClient(customer.id);
            // update indexedDB with new ninox id
            await indexDb.data.update(customer.id, { id: customerId });
            await saveToNinox(customer, customerId);
          } else {
            await saveToNinox(customer, customer.id);
          }
        }
        // delete customers in ninox that are not in indexedDB
        for (const ninoxCustomer of clientDataFromNinox) {
          const indexedDbId = customers.find(
            (customer) => customer.id === ninoxCustomer.id
          );
          if (!indexedDbId) {
            await deleteClient(ninoxCustomer.id);
          }
        }
      }
      if (areArraysDifferent(customers, clientDataFromNinox)) {
        setIsIndexedDbDiff(true);
      } else {
        setIsIndexedDbDiff(false);
      }
      // update client data from ninox
      const ninoxData = await loadNinoxData();
      setClientDataFromNinox(ninoxData);
    } else {
      window.alert('Sync nicht möglich, da keine Internetverbindung besteht.');
    }
  }

  async function updateFromNinox() {
    if (!offline) {
      const ninoxData = await loadNinoxData();
      indexDb.data.bulkPut(ninoxData);
      setClientDataFromNinox(ninoxData);
    } else {
      window.alert('Sync nicht möglich, da keine Internetverbindung besteht.');
    }
  }

  if (loadingAuth) {
    return <Loading />;
  }

  return (
    <>
      {authUser ? (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
          <div className="relative w-full max-w-4xl mx-auto bg-white rounded-md shadow-2xl">
            <button onClick={updateNinox} className="border-1 bg-slate-200">
              SYNC
            </button>
            <button
              className="block border-1 bg-slate-200"
              onClick={() => {
                let confirm = false;
                if (areArraysDifferent(customers, clientDataFromNinox)) {
                  confirm = window.confirm(
                    'Daten sind noch nicht gesynced und würden durch Ninox überschrieben.'
                  );
                } else {
                  updateFromNinox();
                }
                if (confirm) {
                  updateFromNinox();
                }
              }}
            >
              Re-sync from Ninox
            </button>
            {offline && (
              <p className="text-red-500">Keine Internetverbindung</p>
            )}
            {!offline && (
              <p className="text-green-500">Internetverbindung vorhanden</p>
            )}
            {isIndexedDbDiff ? (
              <p className="text-red-500">Update notwendig</p>
            ) : (
              <p className="text-green-500">In Sync</p>
            )}
            <Header {...{ userObject, userSignOut, authUser }} />
            <div className="flex flex-col space-y-12">
              <Outlet context={{ userObject, customers }} />
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex justify-center items-center">
          <SignIn />
        </div>
      )}
    </>
  );
};

export { Root, clientLoader };
