import React, { useEffect, useState, useCallback, createContext } from 'react';
import {
  Form,
  unstable_useBlocker as useBlocker,
  useBeforeUnload,
  redirect,
  useLoaderData,
} from 'react-router-dom';
import NewClientNav from './components/NewClientNav';
import StepContent from './components/StepContent';
import { saveToNinox, getNinoxRecord } from './services/ninox';

import { deleteClient } from './services/ninox';
import { writePdf } from './services/docsautomator';
import { uploadFile } from './services/firebase';

export const FormContext = createContext();

// LOADER
async function getRecordData({ params }) {
  return await getNinoxRecord(params.id);
}

// ACTION
async function clientActions({ request, params }) {
  if (request.method === 'PUT') {
    const data = Object.fromEntries(await request.formData());

    // convert data to Boolean if string is true or false
    Object.keys(data).forEach((key) => {
      if (data[key] === 'true') {
        data[key] = true;
      }
      if (data[key] === 'false') {
        data[key] = false;
      }
    });

    console.log('data here', data);

    if (data.signature && !data.signature.includes('https://firebasestorage')) {
      const signatureDownloadUrl = await uploadFile('signature', data);
      data.signature = signatureDownloadUrl;
    }
    if (data.chart && !data.chart.includes('https://firebasestorage')) {
      const chartDownloadUrl = await uploadFile('chart', data);
      data.chart = chartDownloadUrl;
    }

    // save to Ninox
    if (data.saveOnly) {
      await saveToNinox(data, params.id);
      return redirect(`/`);
    }

    const writePdfResult = await writePdf(data);

    if (writePdfResult?.pdfUrl) {
      data.pdf = writePdfResult.pdfUrl;
    }

    await saveToNinox(data, params.id);
    return data;
  }
  if (request.method === 'DELETE') {
    await deleteClient(params.id);
    return redirect('/');
  }
}

function usePrompt(message, shouldPrompt, { beforeUnload = false } = {}) {
  useBlocker(
    useCallback(
      () =>
        shouldPrompt &&
        (typeof message === 'string' ? !window.confirm(message) : false),
      [message, shouldPrompt]
    ),
    []
  );

  useBeforeUnload(
    useCallback(
      (event) => {
        if (shouldPrompt && beforeUnload && typeof message === 'string') {
          event.preventDefault();
          event.returnValue = message;
        }
      },
      [message, beforeUnload, shouldPrompt]
    ),
    { capture: true }
  );
}

const Client = () => {
  const clientData = useLoaderData();
  const steps = [
    'Kunde',
    'Anlage',
    'Dach',
    'Elektro',
    'Wirtschaftlichkeit',
    'Kostenvoranschlag',
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // jump to top of page when currentStep changes
    window.scrollTo(0, 0);
  }, [currentStep]);

  const [formContent, setFormContent] = useState({});
  console.log(formContent);
  const [calculationData, setCalculationData] = useState({});

  useEffect(() => {
    if (clientData) {
      setFormContent({ ...formContent, ...clientData });
    }
  }, [clientData]);

  // check if formContent is an empty object or if all of the values are empty strings
  const isFormFilled =
    Object.keys(formContent).length > 0 &&
    Object.values(formContent).some(
      (value) => value !== '' && value !== '+49 ' && value !== '+49'
    );

  const [shouldPrompt, setShouldPrompt] = useState(false);

  // detect changes in key and values between formContent and clientData
  // if there are changes, set shouldPrompt to true
  useEffect(() => {
    if (formContent) {
      const hasChanges = !Object.keys(formContent).every(
        (key) =>
          key === 'benoetigteKwp' ||
          key === 'chart' ||
          formContent[key] === clientData[key]
      );
      setShouldPrompt(hasChanges);
    }
  }, [formContent]);

  usePrompt(
    'Das Formular ist noch nicht gespeichert. Zum Verlassen bitte bestätigen. Alle bisher eingegebenen Daten werden gelöscht.',
    shouldPrompt,
    {
      beforeUnload: isFormFilled,
    }
  );

  return (
    <FormContext.Provider
      value={{
        formContent,
        setFormContent,
        calculationData,
        setCalculationData,
      }}
    >
      <Form
        className="flex flex-col"
        style={{
          minHeight: 'calc(100vh - 7rem)',
          width: '100%',
        }}
        autoComplete="off"
      >
        <div className="p-6 flex-grow h-full">
          <StepContent
            key={currentStep}
            currentStep={currentStep}
            setShouldPrompt={setShouldPrompt}
          />
        </div>
        <div className="sticky bottom-0">
          <NewClientNav
            steps={steps}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        </div>
      </Form>
    </FormContext.Provider>
  );
};

export { Client, getRecordData, clientActions };
