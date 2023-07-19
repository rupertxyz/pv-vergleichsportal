import React from 'react';

const Checkbox = ({ label, name, formContent, setFormContent, identifier }) => {
  const value = formContent[identifier] || '';

  return (
    <div className="w-1/2 sm:w-1/4 p-2">
      <label className="block text-sm font-medium leading-6 text-gray-900 truncate">
        {label}
      </label>
      <div className="relative mt-1 rounded-md">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) =>
            setFormContent({ ...formContent, [identifier]: e.target.checked })
          }
          className="block rounded-md p-4 text-gray-900 border-gray-600 focus:ring-0 focus:ring-offset-0 focus:ring-gray-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
};

export default Checkbox;
