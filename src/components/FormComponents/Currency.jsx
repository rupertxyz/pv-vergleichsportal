import React from 'react';
import CurrencyInput from 'react-currency-input-field';

const Currency = ({ label, placeholder }) => {
  return (
    <div className="w-full sm:w-1/2 p-2">
      <label className="block text-sm font-medium leading-6 text-gray-900 truncate">
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <CurrencyInput
          id="input-example"
          name="input-name"
          placeholder={placeholder}
          decimalsLimit={2}
          onValueChange={(value, name) => console.log(value, name)}
          intlConfig={{ locale: 'de-DE', currency: 'EUR' }}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
};

export default Currency;
