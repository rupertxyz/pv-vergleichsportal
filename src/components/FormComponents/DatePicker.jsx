import React, { useEffect, useState } from 'react';
import Datepicker from 'react-tailwindcss-datepicker';
import { useActionData } from 'react-router-dom';
import FormErrorMsg from '../FormErrorMsg';

const DatePicker = ({ label, formContent, setFormContent, identifier }) => {
  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });

  const data = useActionData();
  const [errorMessage, setErrorMessage] = useState();

  const handleValueChange = (newValue) => {
    setValue(newValue);
    setFormContent({
      ...formContent,
      [identifier]: newValue.startDate || '',
    });
  };

  // useEffect(() => {
  //   let startDate;
  //   let endDate;

  //   if (formContent[identifier]) {
  //     startDate = new Date(formContent[identifier]);
  //     endDate = new Date(formContent[identifier]);
  //   } else {
  //     startDate = new Date();
  //     endDate = new Date();
  //   }

  //   setValue({
  //     startDate,
  //     endDate,
  //   });
  // }, [formContent[identifier]]);

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
      {errorMessage && <FormErrorMsg />}
    </div>
  );
};
export default DatePicker;
