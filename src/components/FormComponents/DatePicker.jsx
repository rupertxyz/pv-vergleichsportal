import React, { useEffect, useState } from 'react';
import Datepicker from 'react-tailwindcss-datepicker';

const DatePicker = ({ label, formContent, setFormContent, identifier }) => {
  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });

  const handleValueChange = (newValue) => {
    setValue(newValue);
    setFormContent({
      ...formContent,
      [identifier]: newValue.startDate,
    });
  };

  useEffect(() => {
    let startDate;
    let endDate;

    if (formContent[identifier]) {
      startDate = new Date(formContent[identifier]);
      endDate = new Date(formContent[identifier]);
    } else {
      startDate = new Date();
      endDate = new Date();
    }

    setValue({
      startDate,
      endDate,
    });
  }, [formContent[identifier]]);

  return (
    <div className="w-full sm:w-1/2 p-2">
      <label
        htmlFor="price"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        <Datepicker
          value={value}
          onChange={handleValueChange}
          useRange={false}
          asSingle={true}
          inputClassName="w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
          placeholder="Datum auswählen"
          readOnly={true}
        />
      </div>
    </div>
  );
};
export default DatePicker;
