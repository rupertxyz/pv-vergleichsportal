import React from 'react';
import { NavLink } from 'react-router-dom';

const Welcome = () => {
  return (
    <>
      <NavLink
        to="/new-client"
        className="flex-1 p-6 text-center border-2 border-gray-300 rounded-md"
      >
        <div
          to="/new-client"
          className="text-lg sm:text-xl font-semibold text-gray-700"
        >
          Neuer Kunde
        </div>
      </NavLink>
      <NavLink
        to="/clients"
        className="flex-1 p-6 text-center border-2 border-gray-300 rounded-md"
      >
        <div className="text-lg sm:text-xl font-semibold text-gray-700">
          Bestehende Kunden
        </div>
      </NavLink>
    </>
  );
};

export default Welcome;
