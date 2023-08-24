import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Root, clientLoader } from './Root';
import { Client, saveNewClient, getRecordData, clientActions } from './Client';
import Clients from './Clients';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  redirect,
} from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { deDe } from '@clerk/localizations';
import { createClient } from './services/ninox';
import { saveToNinox } from './services/ninox';

if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw 'Missing Publishable Key';
}
const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />} loader={clientLoader}>
      <Route
        index
        exact
        element={<Clients />}
        action={async () => {
          const newClientId = await createClient();
          return redirect(`/clients/${newClientId}`);
        }}
      />
      <Route
        path="clients/:id"
        action={async ({ request, params }) => {
          console.log('params', params);
          const data = Object.fromEntries(await request.formData());
          console.log('data', data);
          // save to Ninox
          await saveToNinox(data, params.id);
          return {};
        }}
      >
        <Route
          index
          element={<Client />}
          loader={getRecordData}
          action={clientActions}
        />
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ClerkProvider publishableKey={clerkPubKey} localization={deDe}>
    <React.StrictMode>
      <RouterProvider router={router} fallbackElement={<p>Loading</p>} />
    </React.StrictMode>
  </ClerkProvider>
);
