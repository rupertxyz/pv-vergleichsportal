import React, { useEffect, useState, useContext } from 'react';
import NumericInput from 'react-numeric-input';
import { useActionData } from 'react-router-dom';
import FormErrorMsg from '../FormErrorMsg';
import { FormContext } from '../../NewClient';

const WATT_PRO_MODULE = 425;

export default function DecimalNumber({
  label,
  defaultValue = null,
  step,
  identifier,
  placeholder = '',
  smWidth = '1/2',
  unitName = '',
  readOnly = false,
  max = 100000000000,
  min = 0,
}) {
  const { formContent, setFormContent } = useContext(FormContext);
  const value =
    formContent[identifier] !== undefined &&
    formContent[identifier] !== null &&
    formContent[identifier] >= 0
      ? formContent[identifier]
      : '';
  const data = useActionData();
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    if (value === '' && defaultValue != null) {
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

  useEffect(() => {
    const newBenoetigteKwp =
      formContent.anzahlModule * (WATT_PRO_MODULE / 1000);
    if (
      formContent.anzahlModule != null &&
      formContent.benoetigteKwp !== newBenoetigteKwp
    ) {
      setFormContent((prevFormContent) => {
        return {
          ...prevFormContent,
          benoetigteKwp: newBenoetigteKwp,
        };
      });
    }
  }, [formContent]);

  function formatNumber(num) {
    const number = new Intl.NumberFormat('de-DE').format(num);
    return unitName ? number + ' ' + unitName : number;
  }

  function parseNumber(num) {
    return num.replace(unitName, '').replace(',', '.');
  }

  return (
    <div className={`w-${smWidth} p-2 truncate`}>
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
          precision={2}
          inputMode="decimal"
          readOnly={readOnly}
          max={max}
          min={min}
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
}
