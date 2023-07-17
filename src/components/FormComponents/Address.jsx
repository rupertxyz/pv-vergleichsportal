import Autocomplete from 'react-google-autocomplete';

export default function Input({
  label,
  placeholder,
  formContent,
  setFormContent,
  identifier,
}) {
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
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
          style={{ paddingLeft: '12px' }}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
