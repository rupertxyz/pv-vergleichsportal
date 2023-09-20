import { useContext, useState, useEffect, useRef } from 'react';
import { FormContext } from '../../Client';
import { useOutletContext } from 'react-router-dom';

export default function Input({ label, placeholder, identifier }) {
  const { formContent, setFormContent } = useContext(FormContext);
  const { customers } = useOutletContext();
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const value = formContent[identifier] || '';
  const containerRef = useRef(null);

  console.log('customers', customers);

  useEffect(() => {
    if ((label === 'Vorname' || label === 'Nachname') && value) {
      const filtered = customers.filter((customer) =>
        customer[label.toLowerCase()]
          .toLowerCase()
          .includes(value.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers([]);
    }
  }, [value, customers, label]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setFilteredCustomers([]);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full sm:w-1/2 p-2" ref={containerRef}>
      <label className="block text-sm font-medium leading-6 text-gray-900 truncate">
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          type="text"
          name={identifier}
          value={value}
          onChange={(e) => {
            setFormContent({ ...formContent, [identifier]: e.target.value });
            setHasInteracted(true);
          }}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
          placeholder={placeholder}
          autoComplete="off"
        />
        {(label === 'Vorname' || label === 'Nachname') &&
          hasInteracted &&
          value &&
          filteredCustomers.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="cursor-pointer p-2 hover:bg-gray-200"
                  onClick={() => {
                    setFormContent({
                      ...formContent,
                      anrede: customer.anrede,
                      titel: customer.titel,
                      vorname: customer.vorname,
                      nachname: customer.nachname,
                      firma: customer.firma,
                      adresse: customer.adresse,
                      telefon: customer.telefon,
                      email: customer.email,
                      hausstromverbrauch: customer.hausstromverbrauch,
                      nutzstromverbrauch: customer.nutzstromverbrauch,
                      eAutoVerbrauch: customer.eAutoVerbrauch,
                      arbeitspreis: customer.arbeitspreis,
                      grundpreis: customer.grundpreis,
                      bemerkungen: customer.bemerkungen,
                    });
                    setFilteredCustomers([]);
                  }}
                >
                  {customer.vorname} {customer.nachname}
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}
