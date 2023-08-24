import React, { useContext, useState, useEffect } from 'react';
import { useActionData } from 'react-router-dom';
import FormErrorMsg from '../FormErrorMsg';
import { FormContext } from '../../Client';

export default function TextArea({
  label,
  placeholder,
  identifier,
  smWidth = 'w-1/2',
}) {
  const { formContent, setFormContent } = useContext(FormContext);

  const value = formContent[identifier] || '';
  const data = useActionData();
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
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
    <div className={`w-full sm:${smWidth} p-2`}>
      <label className="block text-sm font-medium leading-6 text-gray-900 truncate">
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <textarea
          name={identifier}
          value={value}
          onChange={(e) =>
            setFormContent({ ...formContent, [identifier]: e.target.value })
          }
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
          placeholder={placeholder}
        />
      </div>
      {errorMessage && <FormErrorMsg />}
    </div>
  );
}
