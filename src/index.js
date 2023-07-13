import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Root from './Root';
import Clients from './Clients';
import NewClient from './NewClient';
import Welcome from './Welcome';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from 'react-router-dom';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index exact element={<Welcome />} />
      <Route path="clients" element={<Clients />} />
      <Route path="new-client" element={<NewClient />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
