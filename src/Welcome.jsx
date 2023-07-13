import React from 'react';
import { NavLink } from 'react-router-dom';

const Welcome = () => {
  return (
    <>
      <div className="flex-1 p-6 text-center border-2 border-gray-300 rounded-md">
        <NavLink
          to="/new-client"
          className="text-lg sm:text-xl font-semibold text-gray-700"
        >
          Neuer Kunde
        </NavLink>
      </div>
      <div className="flex-1 p-6 text-center border-2 border-gray-300 rounded-md">
        <NavLink
          to="/clients"
          className="text-lg sm:text-xl font-semibold text-gray-700"
        >
          Bestehende Kunden
        </NavLink>
      </div>
    </>
  );
};

export default Welcome;
