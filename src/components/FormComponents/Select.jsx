import React, { useContext } from 'react';
import { FormContext } from '../../Client';

export default function Select({ label, options, identifier }) {
  const { formContent, setFormContent } = useContext(FormContext);
  const value = formContent[identifier] || '';

  return (
    <div className="w-full sm:w-1/2 p-2">
      <label
        htmlFor="price"
        className="block text-sm font-medium leading-6 text-gray-900 truncate"
      >
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <select
          type="text"
          name={identifier}
          id="price"
          value={value}
          onChange={(e) =>
            setFormContent({ ...formContent, [identifier]: e.target.value })
          }
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm sm:leading-6"
        >
          <option value="">Bitte auswählen</option>
          {options &&
            options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}
