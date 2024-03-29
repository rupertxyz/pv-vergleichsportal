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

import { writePdf } from './services/docsautomator';
import { uploadFile } from './services/firebase';

import indexDb from './config/dexie';

export const FormContext = createContext();

// LOADER
async function getRecordData({ params }) {
  const customerData = await indexDb.data.get(Number(params.id));
  return customerData;
}

// ACTION
async function clientActions({ request, params }) {
  if (request.method === 'PUT') {
    const data = Object.fromEntries(await request.formData());

    // delete id from data
    delete data.id;

    data.anzahlDachseiten = Number(data.anzahlDachseiten) || '';
    data.anzahlModule = Number(data.anzahlModule) || '';
    data.anzahlOptimierer = Number(data.anzahlOptimierer) || '';
    data.anzahlStockwerke = Number(data.anzahlStockwerke) || '';
    data.anzahlZaehlerFelder = Number(data.anzahlZaehlerFelder) || '';
    data.arbeitspreis = Number(data.arbeitspreis) || '';
    data.aufsparrendaemmungStaerke =
      Number(data.aufsparrendaemmungStaerke) || '';
    data.benoetigteKwp = Number(data.benoetigteKwp) || '';
    data.dachneigung = Number(data.dachneigung) || '';
    data.eAutoVerbrauch = Number(data.eAutoVerbrauch) || '';
    data.grundgebuehr = Number(data.grundgebuehr) || '';
    data.hausstromverbrauch = Number(data.hausstromverbrauch) || '';
    data.laengeKabelwegHakZs = Number(data.laengeKabelwegHakZs) || '';
    data.nutzstromverbrauch = Number(data.nutzstromverbrauch) || '';
    data.otpWert = Number(data.otpWert) || 0;
    data.sparrenmassAbstand = Number(data.sparrenmassAbstand) || '';
    data.sparrenmassBreite = Number(data.sparrenmassBreite) || '';
    data.sparrenmassHoehe = Number(data.sparrenmassHoehe) || '';
    data.speicherGroesse = Number(data.speicherGroesse) || '';
    data.trapezblechStaerke = Number(data.trapezblechStaerke) || '';
    data.ziegeldeckmassBreite = Number(data.ziegeldeckmassBreite) || '';
    data.ziegeldeckmassLaenge = Number(data.ziegeldeckmassLaenge) || '';

    data.besuchstermin = data.besuchstermin
      ? new Date(data.besuchstermin).toISOString().split('T')[0]
      : '';

    // convert data to Boolean if string is true or false
    Object.keys(data).forEach((key) => {
      if (data[key] === 'true') {
        data[key] = true;
      }
      if (data[key] === 'false') {
        data[key] = false;
      }
    });

    // if offline, skip these uploads

    // if (data.signature && !data.signature.includes('https://firebasestorage')) {
    //   if (navigator.onLine) {
    //     const signatureDownloadUrl = await uploadFile('signature', data);
    //     data.signature = signatureDownloadUrl;
    //   }
    // }
    // if (data.chart && !data.chart.includes('https://firebasestorage')) {
    //   if (navigator.onLine) {
    //     const chartDownloadUrl = await uploadFile('chart', data);
    //     data.chart = chartDownloadUrl;
    //   }
    // }

    // save to database
    if (data.saveOnly) {
      delete data.saveOnly;
      delete data.logo;
      await indexDb.data.update(Number(params.id), data);
      return redirect('/');
    }

    const writePdfResult = await writePdf(data);

    if (writePdfResult?.pdfUrl) {
      data.pdf = writePdfResult.pdfUrl;
    }

    delete data.saveOnly;
    delete data.logo;
    await indexDb.data.update(Number(params.id), data);

    return data;
  }
  if (request.method === 'DELETE') {
    try {
      await indexDb.data.delete(Number(params.id));
      return redirect('/');
    } catch (err) {
      console.log(err);
    }
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
  const [calculationData, setCalculationData] = useState({});

  useEffect(() => {
    if (clientData) {
      setFormContent((formContent) => ({ ...formContent, ...clientData }));
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
  }, [formContent, clientData]);

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
