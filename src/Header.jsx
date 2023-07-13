import React from 'react';
import solisLogo from './assets/solis_logo.png';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <NavLink to="/" className="flex justify-center p-4">
      <img src={solisLogo} />
    </NavLink>
  );
};

export default Header;
