import React, { useContext } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { FormContext } from '../../NewClient';

const Currency = ({ label, identifier }) => {
  const { formContent, setFormContent } = useContext(FormContext);

  const value = formContent[identifier] || '';

  return (
    <div className="w-full sm:w-1/2 p-2">
      <label className="block text-sm font-medium leading-6 text-gray-900 truncate">
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <CurrencyInput
          id="input-example"
          name="input-name"
          decimalsLimit={2}
          decimalScale={2}
          value={value}
          onValueChange={(value, name) => {
            setFormContent({ ...formContent, [identifier]: value });
          }}
          intlConfig={{ locale: 'de-DE', currency: 'EUR' }}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
          autoComplete="off"
        />
      </div>
    </div>
  );
};

export default Currency;
