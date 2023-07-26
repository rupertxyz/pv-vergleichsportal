import React, { useState, useEffect, useContext } from 'react';
import { useActionData } from 'react-router-dom';
import FormErrorMsg from '../FormErrorMsg';
import { FormContext } from '../../NewClient';

export default function Input({ label, placeholder, identifier }) {
  const { formContent, setFormContent } = useContext(FormContext);
  const value = formContent[identifier] || '';
  const data = useActionData();
  const [errorMessage, setErrorMessage] = useState();
  const [error, setError] = useState('');

  useEffect(() => {
    function validateEmail(email) {
      // display error if email is not empty and does not contain @
      if (value !== '' && !value.includes('@')) {
        setError('Bitte gültige E-Mail-Adresse eingeben');
        return;
      }
      setError('');
      return;
    }

    validateEmail(value);

    if (value) {
      setErrorMessage('');
    }
  }, [value]);

  useEffect(() => {
    if (data) {
      setErrorMessage(data.messages[identifier] || '');
    }
  }, [data]);

  return (
    <div className="w-full sm:w-1/2 p-2">
      <label className="block text-sm font-medium leading-6 text-gray-900 truncate">
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          type="email"
          name={identifier}
          value={value}
          onChange={(e) =>
            setFormContent({ ...formContent, [identifier]: e.target.value })
          }
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
          placeholder={placeholder}
        />
      </div>
      {error && <div className="text-red-500 shadow-none">{error}</div>}
      {errorMessage && <FormErrorMsg />}
    </div>
  );
}
