import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Root from './Root';
import { Clients, dataLoader } from './Clients';
import { NewClient, saveNewClient } from './NewClient';
import Welcome from './Welcome';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';

if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw 'Missing Publishable Key';
}
const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index exact element={<Welcome />} />
      <Route path="clients" element={<Clients />} loader={dataLoader} />
      <Route path="new-client" element={<NewClient />} action={saveNewClient} />
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ClerkProvider publishableKey={clerkPubKey}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </ClerkProvider>
);
