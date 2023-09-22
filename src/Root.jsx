import React, { useState, useEffect } from 'react';
import { Outlet, defer, useLoaderData } from 'react-router-dom';
import Header from './Header';
import { loadNinoxData } from './services/ninox';
import SignIn from './components/Auth/SignIn';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from './config/firebase';
import { doc, getDoc } from 'firebase/firestore';

async function clientLoader() {
  const data = loadNinoxData();
  return { customers: await data };
}

const Root = () => {
  const [authUser, setAuthUser] = useState(null);
  const [userObject, setUserObject] = useState(null);
  const { customers } = useLoaderData();

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
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
      const userDocRef = doc(db, 'users', authUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserObject(userDoc.data());
      } else {
        console.log('No such document!');
      }
    }

    if (authUser) {
      fetchUserDocument();
    }
  }, [authUser]);

  return (
    <>
      {authUser ? (
        <div className="flex flex-col min-h-screen justify-center items-center bg-gray-50">
          <div className="relative w-full max-w-4xl mx-auto bg-white rounded-md shadow-2xl">
            <Header {...{ userObject, userSignOut }} />
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
