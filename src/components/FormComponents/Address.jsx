import { useRef, useState } from 'react';
import { StandaloneSearchBox, LoadScript } from '@react-google-maps/api';
import './Address.css';

const libraries = ['places'];

export default function Input({
  label,
  placeholder,
  formContent,
  setFormContent,
  identifier,
}) {
  const inputRef = useRef();
  const value = formContent[identifier] || '';
  const [isFocused, setIsFocused] = useState(false);

  const handlePlaceChanged = () => {
    const [place] = inputRef.current.getPlaces();
    if (place) {
      console.log(place);
      console.log(place.formatted_address);
    }
  };

  return (
    <div className="w-full sm:w-1/2 p-2">
      <label className="block text-sm font-medium leading-6 text-gray-900 truncate">
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <LoadScript
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
          libraries={libraries}
        >
          <StandaloneSearchBox
            onLoad={(ref) => (inputRef.current = ref)}
            onPlacesChanged={handlePlaceChanged}
          >
            <input
              name={identifier}
              value={value}
              onChange={(e) =>
                setFormContent({ ...formContent, [identifier]: e.target.value })
              }
              className="input"
              style={{
                display: 'block',
                width: '100%',
                borderRadius: '.375rem',
                border: 'none',
                padding: '.5rem .75rem',
                color: '#000',
                boxShadow: isFocused
                  ? '0 0 0 2px #4b5563 inset' // focus:ring-2 focus:ring-inset focus:ring-gray-600
                  : '0 0 0 1px #d1d5db inset', // ring-1 ring-inset ring-gray-300
                fontSize: '.875rem',
                lineHeight: '1.5',
                outline: 'none',
              }}
              placeholder={placeholder}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </StandaloneSearchBox>
        </LoadScript>
        {/* <Autocomplete
          apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
          onPlaceSelected={(place) => {
            console.log(place);
          }}
          options={{
            types: ['address'],
            componentRestrictions: { country: 'de' },
          }}
          language="de"
          className="block w-full rounded-md border-0 p-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
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
        /> */}
      </div>
    </div>
  );
}
