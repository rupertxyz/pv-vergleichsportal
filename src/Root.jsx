import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { SignedIn, SignedOut, SignIn, useUser } from '@clerk/clerk-react';

const Root = () => {
  const userObject = useUser();
  const userColor = userObject?.user?.publicMetadata.color;

  return (
    <>
      <SignedIn>
        <div className="flex flex-col min-h-screen justify-center items-center bg-gray-50">
          <div className="relative w-full max-w-3xl mx-auto bg-white rounded-md shadow-2xl">
            <Header {...{ userObject }} />
            <div className="flex flex-col sm:flex-row gap-4">
              <Outlet context={{ userObject, userColor }} />
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
