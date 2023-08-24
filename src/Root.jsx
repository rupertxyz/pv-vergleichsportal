import React from 'react';
import { Outlet, defer, useLoaderData } from 'react-router-dom';
import Header from './Header';
import { SignedIn, SignedOut, SignIn, useUser } from '@clerk/clerk-react';
import { loadNinoxData } from './services/ninox';

async function clientLoader() {
  const data = loadNinoxData();
  return { customers: await data };
}

const Root = () => {
  const userObject = useUser();
  const userColor = userObject?.user?.publicMetadata.color;

  const { customers } = useLoaderData();

  return (
    <>
      <SignedIn>
        <div className="flex flex-col min-h-screen justify-center items-center bg-gray-50">
          <div className="relative w-full max-w-4xl mx-auto bg-white rounded-md shadow-2xl">
            <Header {...{ userObject }} />
            <div className="flex flex-col space-y-12">
              <Outlet context={{ userObject, userColor, customers }} />
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

export { Root, clientLoader };
