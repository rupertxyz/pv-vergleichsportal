import React, {
  useEffect,
  useState,
  useCallback,
  createContext,
  useMemo,
} from 'react';
import {
  Form,
  unstable_useBlocker as useBlocker,
  useBeforeUnload,
  redirect,
  NavLink,
  useLoaderData,
  useActionData,
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

async function saveNewClient({ request }) {
  const data = Object.fromEntries(await request.formData());
  let errorMsg = {};
  // check if any of the values are empty strings and if so, add them as a key value pair with the value being: Form field "[INSERT NAME]" is empty.
  Object.entries(data).forEach(([key, value]) => {
    if (value === '' || value === '+49 ') {
      if (key !== 'titel') {
        errorMsg[key] = `Feld ${key} ist leer.`;
      }
    }
  });

  // return if there are any empty fields
  // if (Object.keys(errorMsg).length > 0) return { messages: errorMsg };

  // const writePdfResult = await writePdf(data);
  // console.log('writePdfResult', writePdfResult);

  // if (writePdfResult?.pdfUrl) {
  //   window.open(writePdfResult.pdfUrl, '_blank');
  // }

  return redirect('/clients');
  // return {};
}

async function getRecordData({ params }) {
  return await getNinoxRecord(params.id);
}

async function clientActions({ request, params }) {
  if (request.method === 'PUT') {
    const data = Object.fromEntries(await request.formData());

    if (data.signature) {
      const signatureDownloadUrl = await uploadFile('signature', data);
      data.signature = signatureDownloadUrl;
    }
    if (data.chart) {
      const chartDownloadUrl = await uploadFile('chart', data);
      data.chart = chartDownloadUrl;
    }

    // save to Ninox
    await saveToNinox(data, params.id);
    if (data.saveOnly === 'true') {
      return redirect('/');
    } else {
      return { data: 'data' };
    }
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

function objectsAreEqual(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Ensure they have the same number of keys
  if (keys1.length !== keys2.length) return false;

  // Check if all keys and values match
  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}

const Client = () => {
  const clientData = useLoaderData();

  const data = useActionData();
  console.log('data here???', data);

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
    leadSource: '',
    besuchstermin: '',
    abschlussTermin: '',
    signature: '',
    chart: '',
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
  });

  console.log('form content', formContent);

  useEffect(() => {
    if (clientData) {
      setFormContent({ ...formContent, ...clientData });
    }
  }, [clientData]);

  const [dataChanges, setDataChanges] = useState(false);

  useEffect(() => {
    if (!objectsAreEqual(formContent, clientData)) {
      setDataChanges(true);
    } else {
      setDataChanges(false);
    }
  }, [clientData, formContent]);

  // check if formContent is an empty object or if all of the values are empty strings
  const isFormFilled =
    Object.keys(formContent).length > 0 &&
    Object.values(formContent).some(
      (value) => value !== '' && value !== '+49 ' && value !== '+49'
    );

  const [shouldPrompt, setShouldPrompt] = useState(true);

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
        method="post"
        action="/new-client"
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

export { Client, saveNewClient, getRecordData, clientActions };
