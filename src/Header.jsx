import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';

const Header = ({ userObject }) => {
  const [logo, setLogo] = useState('');
  const { signOut } = useClerk();
  const location = useLocation();

  useEffect(() => {
    if (userObject.isLoaded && userObject.isSignedIn) {
      setLogo(userObject?.user?.publicMetadata?.logo);
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
      <NavLink to="/" className="flex justify-center p-4">
        <img src={logo} />
      </NavLink>
    </div>
  );
};

export default Header;
