import React, { useEffect, useState, useContext } from 'react';
import NumericInput from 'react-numeric-input';
import { useActionData } from 'react-router-dom';
import FormErrorMsg from '../FormErrorMsg';
import { FormContext } from '../../Client';

const CurrencyNumber = ({ label, step, identifier, smWidth = 'full' }) => {
  const { formContent, setFormContent } = useContext(FormContext);
  const value = formContent[identifier] || '';
  const data = useActionData();

  function formatNumber(num) {
    // format number with Intl.NumberFormat in € and german locale
    return String(num).replace('.', ',') + ' €';
  }

  function parseNumber(stringValue) {
    // remove '€' and replace ',' with '.'
    return parseFloat(stringValue.replace('€', '').replace(',', '.'));
  }

  return (
    <div className={`w-${smWidth} sm:w-1/2 p-2 truncate`}>
      <label>{label}</label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <NumericInput
          value={value}
          name={identifier}
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
          autoComplete="off"
        />
      </div>
    </div>
  );
};

export default CurrencyNumber;
