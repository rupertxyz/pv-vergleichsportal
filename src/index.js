import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Root, clientLoader } from './Root';
import { Client, getRecordData, clientActions } from './Client';
import Clients from './Clients';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from 'react-router-dom';
import Loading from './Loading';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { clientsActions } from './Clients';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />} loader={clientLoader}>
      <Route index exact element={<Clients />} action={clientsActions} />
      <Route path="clients/:id">
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
  <React.StrictMode>
    <RouterProvider router={router} fallbackElement={<Loading />} />
  </React.StrictMode>
);

serviceWorkerRegistration.register();
