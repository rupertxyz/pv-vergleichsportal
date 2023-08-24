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
import { storage } from './config/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { deleteClient } from './services/ninox';

export const FormContext = createContext();

async function uploadFile(type, data) {
  try {
    // create reference
    const storageRef = ref(
      storage,
      `${type}/${data.vorname}-${data.nachname}.png`
    );

    // upload file from data url
    await uploadString(storageRef, data[type], 'data_url');

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error:', error);
  }
}

async function writePdf(data) {
  try {
    const res = await fetch('https://api.docsautomator.co/api/createDocument', {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.REACT_APP_DOCSAUTOMATOR_KEY,
      },
      body: JSON.stringify({
        docId: '64dcc7e4ff21743880c86f0e',
        leadquelle: data.leadSource || '',
        anrede: data.anrede || '',
        titel: data.titel || '',
        besuchstermin: data.besuchstermin || '',
        vorname: data.vorname || '',
        nachname: data.nachname || '',
        abschlusstermin: data.abschlussTermin || '',
        firmenbezeichnung: data.firma || '',
        image_logo_200: data.logo || '',
        adresse: data.adresse || '',
        telefon: data.telefon || '',
        email: data.email || '',
      }),
    });
    const result = await res.json();
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}

async function getRecordData({ params }) {
  return await getNinoxRecord(params.id);
}

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

    if (data.signature) {
      const signatureDownloadUrl = await uploadFile('signature', data);
      data.signature = signatureDownloadUrl;
    }
    if (data.chart) {
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

  const [formContent, setFormContent] = useState({
    anrede: '',
    titel: '',
    vorname: '',
    nachname: '',
    firma: '',
    adresse: '',
    telefon: '',
    email: '',
    hausstromverbrauch: 5000,
    nutzstromverbrauch: null,
    eAutoVerbrauch: null,
    arbeitspreis: 0.4,
    grundgebuehr: 120,
    leadSource: '',
    besuchstermin: '',
    abschlussTermin: '',
    waermepumpe: '',
    eAutoPlanung: '',
    sonderbelegung: '',
    anzahlModule: 24,
    anzahlOptimierer: 0,
    benoetigteKwp: '',
    speicherGroesse: '',
    anzahlStockwerke: 2,
    anzahlDachseiten: 2,
    glasGlasModule: '',
    fullBlackModule: '',
    kabelweg: '',
    ziegeldeckmassLaenge: 0.42,
    ziegeldeckmassBreite: 0.3,
    sparrenmassAbstand: 0.6,
    sparrenmassBreite: 0.1,
    sparrenmassHoehe: 0.12,
    aufsparrendaemmungStaerke: 0,
    laengeKabelwegHakZs: 5,
    otpWert: 0.25,
  });

  useEffect(() => {
    if (clientData) {
      // Filter out properties with empty values
      const filteredClientData = Object.keys(clientData).reduce((acc, key) => {
        if (clientData[key]) {
          // or if (clientData[key] !== "") for more strict check
          acc[key] = clientData[key];
        }
        return acc;
      }, {});

      setFormContent({ ...formContent, ...filteredClientData });
    }
  }, [clientData]);

  // check if formContent is an empty object or if all of the values are empty strings
  const isFormFilled =
    Object.keys(formContent).length > 0 &&
    Object.values(formContent).some(
      (value) => value !== '' && value !== '+49 ' && value !== '+49'
    );

  const [shouldPrompt, setShouldPrompt] = useState(true);

  // detect changes in key and values between formContent and clientData
  // if there are changes, set shouldPrompt to true
  useEffect(() => {
    if (clientData) {
      const hasChanges = !Object.keys(clientData).every(
        (key) => clientData[key] === formContent[key]
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
    <FormContext.Provider value={{ formContent, setFormContent }}>
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
