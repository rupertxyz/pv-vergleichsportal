import React from 'react';

const Checkbox = ({ label, name }) => {
  return (
    <div className="w-full sm:w-1/2 p-2">
      <label className="block text-sm font-medium leading-6 text-gray-900 truncate">
        {label}
      </label>
      <div className="relative mt-2 rounded-md">
        <input
          type="checkbox"
          name={name}
          id={name}
          className="block rounded-md p-4 text-gray-900 border-gray-600 focus:ring-0 focus:ring-offset-0 focus:ring-gray-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
};

export default Checkbox;
