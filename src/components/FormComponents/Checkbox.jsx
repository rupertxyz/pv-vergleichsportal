import React, { useEffect, useContext } from 'react';
import { FormContext } from '../../Client';

const Checkbox = ({ label, identifier, smWidth = 'w-full' }) => {
  const { formContent, setFormContent } = useContext(FormContext);
  const value = formContent[identifier] || false;

  useEffect(() => {
    if (!value) {
      setFormContent((prevFormContent) => {
        return { ...prevFormContent, [identifier]: false };
      });
    }
  }, []);

  useEffect(() => {
    if (formContent.zaehlerschrankTauschen) {
      setFormContent((prevFormContent) => {
        return {
          ...prevFormContent,
          anzahlZaehlerFelder: 1,
          laengeKabelwegHakZs: 5,
        };
      });
    } else {
      setFormContent((prevFormContent) => {
        return {
          ...prevFormContent,
          anzahlZaehlerFelder: '',
          laengeKabelwegHakZs: '',
        };
      });
    }
  }, [formContent.zaehlerschrankTauschen]);

  return (
    <div className={`${smWidth} p-2`}>
      <label className="block text-sm font-medium leading-6 text-gray-900 truncate">
        {label}
      </label>
      <div className="relative mt-1 rounded-md">
        <input
          type="checkbox"
          checked={value}
          name={identifier}
          onChange={(e) => {
            setFormContent({ ...formContent, [identifier]: e.target.checked });
          }}
          className="block rounded-md p-4 text-gray-900 border-gray-600 focus:ring-0 focus:ring-offset-0 focus:ring-gray-600 sm:text-sm sm:leading-6 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Checkbox;
