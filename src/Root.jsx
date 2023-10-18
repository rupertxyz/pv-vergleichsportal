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
import deepEqual from './util/deepEqual';

async function clientLoader() {
  return await loadNinoxData();
}

function compareArrays(arr1, arr2) {
  const map1 = new Map(arr1.map((item) => [item.id, item]));
  const map2 = new Map(arr2.map((item) => [item.id, item]));

  const differentIds = [];

  for (const [id, item] of map1.entries()) {
    if (!map2.has(id) || !deepEqual(item, map2.get(id))) {
      differentIds.push(id);
    }
  }

  return differentIds;
}

const Root = () => {
  const [authUser, setAuthUser] = useState(null);
  const [userObject, setUserObject] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [clientDataFromNinox, setClientDataFromNinox] = useState([]);
  const loaderData = useLoaderData();
  const [offline, setOffline] = useState(false);
  const [dbDiff, setDbDiff] = useState([]);
  const [updatingNinox, setUpdatingNinox] = useState(false);

  const customers = useLiveQuery(() => indexDb.data.toArray(), []);

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

  // commented this out as it's better that data from ninox is always fetched manually
  // useEffect(() => {
  //   // add customers to indexedDB with Dexie
  //   if (customers && !customers.length && clientDataFromNinox.length) {
  //     indexDb.data.bulkPut(clientDataFromNinox);
  //   }
  // }, [clientDataFromNinox, customers]);

  useEffect(() => {
    // check if indexedDB is different from ninox data
    if (customers && customers.length) {
      const compareResult = compareArrays(customers, clientDataFromNinox);
      setDbDiff(compareResult);
    }
  }, [customers, clientDataFromNinox]);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setOffline(!navigator.onLine);
    };

    // Set initial status
    updateOnlineStatus();

    // Add event listeners
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  useEffect(() => {
    if (loaderData.length > 0) {
      setClientDataFromNinox(loaderData);
      localStorage.setItem(
        'savedClientDataFromNinox',
        JSON.stringify(loaderData)
      );
    } else if (offline) {
      const localData = localStorage.getItem('savedClientDataFromNinox');
      if (localData) {
        setClientDataFromNinox(JSON.parse(localData));
      }
    }
  }, [loaderData, offline]);

  async function updateNinox(customer) {
    setUpdatingNinox(true);
    if (!offline) {
      // find customer id in ninox
      const ninoxId = clientDataFromNinox.find(
        (ninoxCustomer) => ninoxCustomer.id === customer.id
      );
      // if customer does not exist in ninox, create it
      if (!ninoxId) {
        const { customerId } = await createClient(customer.id);
        // update indexedDB with new ninox id
        await indexDb.data.update(customer.id, { id: customerId });
        await saveToNinox(customer, customerId);
      }
      // if customer exists in ninox, update it
      else {
        await saveToNinox(customer, customer.id);
      }

      // // // delete customers in ninox that are not in indexedDB
      // for (const ninoxCustomer of clientDataFromNinox) {
      //   const indexedDbId = customers.find(
      //     (customer) => customer.id === ninoxCustomer.id
      //   );
      //   if (!indexedDbId) {
      //     await deleteClient(ninoxCustomer.id);
      //   }
      // }

      // update client data from ninox
      const ninoxData = await loadNinoxData();
      setClientDataFromNinox(ninoxData);
    } else {
      window.alert('Sync nicht möglich, da keine Internetverbindung besteht.');
    }
    setUpdatingNinox(false);
  }

  async function updateFromNinox() {
    if (!offline) {
      const ninoxData = await loadNinoxData();
      indexDb.data.bulkPut(ninoxData);
      // delete indexDb data that is not in ninox
      for (const customer of customers) {
        const ninoxId = ninoxData.find(
          (ninoxCustomer) => ninoxCustomer.id === customer.id
        );
        if (!ninoxId) {
          await indexDb.data.delete(customer.id);
        }
      }
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
            {offline && (
              <div
                className={`transform transition-transform duration-500 ease-in-out ${
                  offline ? 'scale-y-1' : 'scale-y-0'
                } origin-top`}
              >
                <p className="w-full bg-red-500 text-center text-white">
                  Keine Internetverbindung
                </p>
              </div>
            )}

            <Header
              {...{
                userObject,
                userSignOut,
                authUser,
              }}
            />
            <div className="flex flex-col space-y-12">
              <Outlet
                context={{
                  userObject,
                  customers,
                  offline,
                  updateNinox,
                  updatingNinox,
                  clientDataFromNinox,
                  updateFromNinox,
                  dbDiff,
                }}
              />
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
