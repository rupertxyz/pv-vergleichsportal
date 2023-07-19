import React, { useEffect } from 'react';

const Number = ({
  label,
  defaultValue,
  step,
  formContent,
  setFormContent,
  identifier,
}) => {
  const value = formContent[identifier] || '';

  useEffect(() => {
    if (value === '') {
      setFormContent((prevFormContent) => {
        return { ...prevFormContent, [identifier]: defaultValue };
      });
    }
  }, []);

  return (
    <div className="w-full sm:w-1/2 p-2 truncate">
      <label>{label}</label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          type="number"
          value={value}
          onChange={(e) =>
            setFormContent({ ...formContent, [identifier]: e.target.value })
          }
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
          step={step}
        />
      </div>
    </div>
  );
};

export default Number;
