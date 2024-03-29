import React, { useEffect, useState, useContext } from 'react';
import Datepicker from 'react-tailwindcss-datepicker';
import { useActionData } from 'react-router-dom';
import FormErrorMsg from '../FormErrorMsg';
import { FormContext } from '../../Client';

const DatePicker = ({ label, identifier }) => {
  const { formContent, setFormContent } = useContext(FormContext);
  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });

  const data = useActionData();

  const handleValueChange = (newValue) => {
    setValue(newValue);
    setFormContent({
      ...formContent,
      [identifier]: newValue.startDate || '',
    });
  };

  useEffect(() => {
    if (formContent[identifier]) {
      let startDate = new Date(formContent[identifier]);
      let endDate = new Date(formContent[identifier]);

      setValue({
        startDate,
        endDate,
      });
    }
  }, [formContent[identifier]]);

  return (
    <div className="w-full sm:w-1/2 p-2">
      <label
        htmlFor="price"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <Datepicker
          value={value}
          onChange={handleValueChange}
          useRange={false}
          asSingle={true}
          inputClassName="w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
          placeholder="Datum auswählen"
          readOnly={true}
          i18n="de"
          displayFormat="DD.MM.YYYY"
          inputName={identifier}
        />
      </div>
    </div>
  );
};
export default DatePicker;
