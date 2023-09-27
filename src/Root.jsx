import React, { useState, useEffect } from 'react';
import { Outlet, useLoaderData } from 'react-router-dom';
import Header from './Header';
import SignIn from './components/Auth/SignIn';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from './config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Loading from './Loading';
import { loadClientsFromFirebase } from './services/firebase';

async function clientLoader() {
  const data = await loadClientsFromFirebase();
  return { customers: data };
}

const Root = () => {
  const [authUser, setAuthUser] = useState(null);
  const [userObject, setUserObject] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const { customers } = useLoaderData();
  const [offline, setOffline] = useState(false);

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
      if (!navigator.onLine) {
        setOffline(true);
      }
    }

    return () => {
      setUserObject(null);
    };
  }, [authUser]);

  if (loadingAuth) {
    return <Loading />;
  }

  return (
    <>
      {authUser ? (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
          <div className="relative w-full max-w-4xl mx-auto bg-white rounded-md shadow-2xl">
            {offline && (
              <p className="text-red-500">Keine Internetverbindung</p>
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
