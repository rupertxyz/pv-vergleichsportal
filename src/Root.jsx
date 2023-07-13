import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import {
  SignedIn,
  SignedOut,
  SignIn,
  useAuth,
  useUser,
} from '@clerk/clerk-react';

const Root = () => {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  console.log('is loaded', isLoaded);
  console.log('user id', userId);
  console.log('session id', sessionId);
  console.log('get token', getToken);
  const userObject = useUser();

  return (
    <>
      <SignedIn>
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
          <div className="w-full max-w-2xl mx-auto bg-white rounded-md shadow-md p-4">
            <Header {...{ userObject }} />
            <div className="flex flex-col sm:flex-row gap-4 p-4">
              <Outlet />
            </div>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen flex justify-center items-center">
          <SignIn
            afterSignInUrl="/"
            appearance={{
              elements: {
                footer: {
                  display: 'none',
                },
              },
            }}
          />
        </div>
      </SignedOut>
    </>
  );
};

export default Root;
