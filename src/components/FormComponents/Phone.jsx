import React, { useState, useEffect } from 'react';

export default function Phone({
  label,
  placeholder,
  formContent,
  setFormContent,
  identifier,
}) {
  const value = formContent[identifier] || '';
  // const [error, setError] = useState('');

  // useEffect(() => {
  //   function validatePhoneNumber(phoneNumber) {
  //     // Only display an error if the input doesn't start with "+49"
  //     // or if something other than a space is typed after "+49 " and it's not a number greater than zero.
  //     if (value !== '' && !value.startsWith('+49') && value.length > 3) {
  //       setError('Bitte Nummer mit +49 eingeben');
  //       return;
  //     }
  //     // If the input starts with "+49" and is followed by a 0 or a space and a 0, give error
  //     if (value.startsWith('+49 0') || value.startsWith('+490')) {
  //       setError('Bitte Nummer mit +49 eingeben');
  //       return;
  //     }
  //     setError('');
  //     return;
  //   }

  //   validatePhoneNumber(value);
  // }, [value]);

  useEffect(() => {
    if (value === '') {
      setFormContent({ ...formContent, [identifier]: '+49 ' });
    }
  }, []);

  const handleChange = (e) => {
    setFormContent({ ...formContent, [identifier]: e.target.value });
  };

  return (
    <div className="w-full sm:w-1/2 p-2">
      <label className="block text-sm font-medium leading-6 text-gray-900 truncate">
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          type="text"
          name={identifier}
          value={value}
          onChange={handleChange}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
          placeholder={placeholder}
        />
      </div>
      {/* {error && <div className="text-red-500 shadow-none">{error}</div>} */}
    </div>
  );
}
