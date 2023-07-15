import React, { useState } from 'react';
import { NavLink, useOutletContext } from 'react-router-dom';

const WelcomeItem = ({ link, content }) => {
  const { userObject } = useOutletContext();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const styles = {
    borderColor:
      isHovered &&
      Object.entries(userObject).length &&
      userObject.user.publicMetadata.color,
  };

  return (
    <NavLink
      to={link}
      className="flex flex-1 p-6 text-center items-center justify-center border-2 border-gray-300 rounded-md hover:border-gray-400"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={styles}
    >
      <div className="text-lg sm:text-xl font-semibold text-gray-700">
        {content}
      </div>
    </NavLink>
  );
};

export default WelcomeItem;
