import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

const Header = ({ userObject, userSignOut }) => {
  const [logo, setLogo] = useState('');
  const [subline, setSubline] = useState('');
  const [color, setColor] = useState('');
  const location = useLocation();
  const [backHover, setBackHover] = useState(false);

  useEffect(() => {
    setLogo(userObject?.logo);
    setSubline(userObject?.subline);
    setColor(userObject?.color);
  }, [userObject]);

  useEffect(() => {
    setBackHover(false);
  }, [location]);

  return (
    <div>
      {location.pathname === '/' && (
        <div className="absolute top-1 right-1 flex justify-end gap-1">
          <button onClick={userSignOut}>Sign out</button>
          <ArrowTopRightOnSquareIcon className="w-4" />
        </div>
      )}
      {location.pathname === '/clients' && (
        <NavLink
          to="/"
          className="absolute top-2 left-2 flex justify-start gap-1"
          onMouseEnter={() => setBackHover(true)}
          onMouseLeave={() => setBackHover(false)}
          style={(backHover && userObject && { color }) || {}}
        >
          <ArrowLeftIcon className="w-4" />
          <span>Zurück</span>
        </NavLink>
      )}
      <NavLink to="/" className="flex justify-center pt-4">
        <img src={logo} className="w-60" />
      </NavLink>
      <div className="flex justify-center text-sm text-center px-8">
        {subline}
      </div>
    </div>
  );
};

export default Header;
