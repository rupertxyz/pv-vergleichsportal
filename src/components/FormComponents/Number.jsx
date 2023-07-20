import React, { useEffect, useState } from 'react';
import NumericInput from 'react-numeric-input';
import { useActionData } from 'react-router-dom';
import FormErrorMsg from '../FormErrorMsg';

const Number = ({
  label,
  defaultValue = null,
  step,
  formContent,
  setFormContent,
  identifier,
  placeholder = '',
}) => {
  const value = formContent[identifier] || '';
  const data = useActionData();
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    if (value === '' && defaultValue) {
      setFormContent((prevFormContent) => {
        return { ...prevFormContent, [identifier]: defaultValue };
      });
    }
  }, []);

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

  function formatNumber(num) {
    const number = new Intl.NumberFormat('de-DE').format(num);
    return number;
  }

  function parseNumber(num) {
    const number = parseInt(num.replace(/\./g, ''));
    return number;
  }

  return (
    <div className="w-full sm:w-1/2 p-2 truncate">
      <label>{label}</label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <NumericInput
          value={value}
          name={identifier}
          onChange={(num) => {
            setFormContent({ ...formContent, [identifier]: num });
          }}
          step={step}
          placeholder={placeholder}
          format={formatNumber}
          parse={parseNumber}
          inputMode="decimal"
          style={{
            wrap: {
              display: 'block',
            },
            input: {
              display: 'block',
              width: '100%',
              fontSize: '14px',
              lineHeight: '1.5rem',
              borderRadius: '1rem',
            },
            'input:focus': {
              outline: '2px auto #4b5563',
              outlineOffset: '0px',
              borderRadius: '0.25rem',
            },
          }}
        />
      </div>
      {errorMessage && <FormErrorMsg />}
    </div>
  );
};

export default Number;
