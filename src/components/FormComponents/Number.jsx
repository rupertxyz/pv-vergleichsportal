import React, { useEffect, useState, useContext } from 'react';
import NumericInput from 'react-numeric-input';
import { useActionData } from 'react-router-dom';
import FormErrorMsg from '../FormErrorMsg';
import { FormContext } from '../../NewClient';

const Number = ({
  label,
  defaultValue = null,
  step,
  identifier,
  placeholder = '',
  smWidth = '1/2',
  unitName = '',
}) => {
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
    const newBenoetigteKwp = formContent.anzahlModule * 430;
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
    return number + ' ' + unitName;
  }

  function parseNumber(num) {
    const number = parseInt(num.replace(unitName, '').replace(/\./g, ''));
    return number;
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
