import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

const Header = ({ userObject }) => {
  const [logo, setLogo] = useState('');
  const [subline, setSubline] = useState('');
  const { signOut } = useClerk();
  const location = useLocation();
  const [backHover, setBackHover] = useState(false);

  useEffect(() => {
    if (userObject.isLoaded && userObject.isSignedIn) {
      setLogo(userObject?.user?.publicMetadata?.logo);
      setSubline(userObject?.user?.publicMetadata?.subline);
    }
  }, [userObject]);

  useEffect(() => {
    setBackHover(false);
  }, [location]);

  return (
    <div>
      {location.pathname === '/' && (
        <div className="absolute top-1 right-1 flex justify-end gap-1">
          <button onClick={() => signOut()}>Sign out</button>
          <ArrowTopRightOnSquareIcon className="w-4" />
        </div>
      )}
      {location.pathname === '/clients' && (
        <NavLink
          to="/"
          className="absolute top-2 left-2 flex justify-start gap-1"
          onMouseEnter={() => setBackHover(true)}
          onMouseLeave={() => setBackHover(false)}
          style={
            (backHover &&
              userObject && { color: userObject.user.publicMetadata.color }) ||
            {}
          }
        >
          <ArrowLeftIcon className="w-4" />
          <span>Back</span>
        </NavLink>
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
