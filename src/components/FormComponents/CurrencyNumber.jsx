import React, { useEffect, useState } from 'react';
import NumericInput from 'react-numeric-input';

const CurrencyNumber = ({
  label,
  defaultValue,
  step,
  formContent,
  setFormContent,
  identifier,
}) => {
  const value = formContent[identifier] || '';

  useEffect(() => {
    if (value === '') {
      setFormContent((prevFormContent) => {
        return { ...prevFormContent, [identifier]: defaultValue };
      });
    }
  }, []);

  function formatNumber(num) {
    // format number with Intl.NumberFormat in € and german locale
    return String(num).replace('.', ',') + ' €';
  }

  function parseNumber(stringValue) {
    // remove '€' and replace ',' with '.'
    return parseFloat(stringValue.replace('€', '').replace(',', '.'));
  }

  return (
    <div className="w-full sm:w-1/2 p-2 truncate">
      <label>{label}</label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <NumericInput
          value={value}
          onChange={(num) => {
            setFormContent({ ...formContent, [identifier]: num });
          }}
          step={step}
          format={formatNumber}
          parse={parseNumber}
          precision={2}
          style={{
            wrap: {
              display: 'block',
            },
            input: {
              display: 'block',
              width: '100%',
              fontSize: '14px',
              lineHeight: '1.5rem',
              borderRadius: '0.5rem',
            },
            'input:focus': {
              outline: '2px auto #4b5563',
              outlineOffset: '0px',
              borderRadius: '0.25rem',
            },
          }}
        />
      </div>
    </div>
  );
};

export default CurrencyNumber;
