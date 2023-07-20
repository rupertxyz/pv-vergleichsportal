import { useEffect, useRef, useState } from 'react';
import './Address.css';
import { useActionData } from 'react-router-dom';

export default function Address({
  label,
  placeholder,
  formContent,
  setFormContent,
  identifier,
}) {
  const autocompleteInputRef = useRef(null);
  const value = formContent[identifier] || '';
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);
  const data = useActionData();
  const [errorMessage, setErrorMessage] = useState('');

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

  useEffect(() => {
    // Only load the script if it's not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places&language=de&callback=initMap`;
      script.async = true;
      script.defer = true;
      window.initMap = () => setGoogleMapsLoaded(true);
      document.body.appendChild(script);

      // Clean up on component unmount
      return () => {
        document.body.removeChild(script);
      };
    } else {
      setGoogleMapsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (
      googleMapsLoaded &&
      !autocomplete &&
      window.google.maps &&
      window.google.maps.places
    ) {
      const newAutocomplete = new window.google.maps.places.Autocomplete(
        autocompleteInputRef.current,
        {
          componentRestrictions: { country: 'de' },
          language: 'de',
        }
      );

      newAutocomplete.addListener('place_changed', () => {
        const place = newAutocomplete.getPlace();
        setFormContent((currentFormContent) => ({
          ...currentFormContent,
          [identifier]: place.formatted_address,
        }));
      });

      setAutocomplete(newAutocomplete);
    }
  }, [googleMapsLoaded, formContent, identifier]); // Add googleMapsLoaded dependency

  return (
    <div className="w-full sm:w-1/2 p-2">
      <label className="block text-sm font-medium leading-6 text-gray-900 truncate">
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          type="text"
          name={identifier}
          value={value}
          onChange={(e) =>
            setFormContent({ ...formContent, [identifier]: e.target.value })
          }
          ref={autocompleteInputRef}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
          placeholder={placeholder}
        />
      </div>
      {errorMessage && (
        <p className="text-red-500 pt-2">Bitte Wert eintragen</p>
      )}
    </div>
  );
}
