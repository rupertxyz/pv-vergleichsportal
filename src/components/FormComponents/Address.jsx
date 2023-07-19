import Autocomplete from 'react-google-autocomplete';
import { useState } from 'react';

export default function Input({
  label,
  placeholder,
  formContent,
  setFormContent,
  identifier,
}) {
  const [isFocused, setIsFocused] = useState(false);

  // const styles = {
  //   display: 'block',
  //   width: '100%',
  //   borderRadius: '.25rem',
  //   border: 'none',
  //   color: '#1a202c',
  //   boxShadow: isFocused
  //     ? '0 0 0 2px #4b5563 inset' // focus:ring-2 focus:ring-inset focus:ring-gray-600
  //     : '0 0 0 1px #d1d5db inset', // ring-1 ring-inset ring-gray-300
  //   fontSize: '.875rem',
  //   lineHeight: '1.5',
  //   paddingLeft: '12px',
  // };

  const value = formContent[identifier] || '';
  console.log(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
  return (
    <div className="w-full sm:w-1/2 p-2">
      <label className="block text-sm font-medium leading-6 text-gray-900 truncate">
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <Autocomplete
          apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
          onPlaceSelected={(place) => {
            console.log(place);
          }}
          options={{
            types: ['address'],
            componentRestrictions: { country: 'de' },
          }}
          language="de"
          className="block w-full rounded-md border-0 p-1.5 text-gray-900 placeholder:text-gray-400"
          style={{
            paddingLeft: '12px',
            outline: 'none',
            boxShadow: isFocused
              ? '0 0 0 2px #4b5563 inset'
              : '0 0 0 1px #d1d5db inset',
          }}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
    </div>
  );
}
