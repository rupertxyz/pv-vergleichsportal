import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';

const Header = ({ userObject }) => {
  const [logo, setLogo] = useState('');
  const [subline, setSubline] = useState('');
  const { signOut } = useClerk();
  const location = useLocation();

  useEffect(() => {
    if (userObject.isLoaded && userObject.isSignedIn) {
      setLogo(userObject?.user?.publicMetadata?.logo);
      setSubline(userObject?.user?.publicMetadata?.subline);
    }
  }, [userObject]);

  return (
    <div>
      {location.pathname === '/' && (
        <div className="flex justify-end gap-1">
          <button onClick={() => signOut()}>Sign out</button>
          <ArrowTopRightOnSquareIcon className="w-4" />
        </div>
      )}
      <NavLink to="/" className="flex justify-center pt-4">
        <img src={logo} />
      </NavLink>
      <div className="flex justify-center text-sm text-center px-8">
        {subline}
      </div>
    </div>
  );
};

export default Header;
