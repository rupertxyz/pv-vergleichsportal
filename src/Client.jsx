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
        hausstromv: data.hausstromverbrauch || '',
        nutzstromv: data.nutzstromverbrauch || '',
        e: data.eAutoPlanung ? 'X' : '',
        w: data.waermepumpe ? 'X' : '',
        anlagengroesse: data.benoetigteKwp || '',
        g_g_m: data.glasGlasModule ? 'X' : '',
        arbeitspreis: data.arbeitspreis || '',
        speichergroesse: data.speicherGroesse || '',
        f_b_m: data.fullBlackModule ? 'X' : '',
        grundgebuehr: data.grundgebuehr || '',
        k: data.kabelweg ? 'X' : '',
        leerrohr: data.kabelweg ? 'X' : '',
        l_r_a: data.kabelweg ? 'X' : '',
        laenge: data.ziegeldeckmassLaenge || '',
        breite: data.ziegeldeckmassBreite || '',
        dachneigung: data.dachneigung || '',
        s_abstand: data.sparrenmassAbstand || '',
        s_breite: data.sparrenmassBreite || '',
        s_hoehe: data.sparrenmassHoehe || '',
        aufsparrendaemmung: data.aufsparrendaemmungStaerke || '',
        trapez_staerke: data.trapezblechStaerke,
        s_platten: data.sandwichblech ? 'X' : '',
        ziegel_gekl: data.ziegelgeklammert ? 'X' : '',
        ziegel_gem: data.ziegelgemoertelt ? 'X' : '',
        ziegel_sanierung: data.ziegelsanierung ? 'X' : '',
        zt: data.zaehlerschrankTauschen ? 'X' : '',
        azf: data.anzahlZaehlerFelder || '',
        zzl: data.zaehlerzusammenlegung ? 'X' : '',
        kk: data.kaskade ? 'X' : '',
        uz: data.unterverteiler ? 'X' : '',
        zd: data.standortZaehlerschrank === 'Dach' ? 'X' : '',
        eg: data.standortZaehlerschrank === 'EG' ? 'X' : '',
        kel: data.standortZaehlerschrank === 'Keller' ? 'X' : '',
        hd: data.standortHak === 'Dach' ? 'X' : '',
        heg: data.standortHak === 'EG' ? 'X' : '',
        hkel: data.standortHak === 'Keller' ? 'X' : '',
        zmet: data.laengeKabelwegHakZs || '',
        nvor: data.internetanschlussVorhanden ? 'X' : '',
        otp: data.otpWert || '',
        notes: data.bemerkungen || '',
        image_unterschrift_50: data.signature || '',
        image_chart_600: data.chart || '',
        line_items: [
          {
            line_items_id: '1',
            line_items_beschreibung:
              'Hochleistungs-Photovoltaikmodule von Tear 1 Herstellern\n- Mindestens 25 Jahre Leistungs- und 30 Jahre Produktgarantie\n- Hoche Witterungsbeständigkeit gegen Wind- und Schneelasten',
            line_items_menge: '23',
            line_items_einzelpreis: '1.000,00',
            line_items_gesamtpreis: '23.000,00',
          },
        ],
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

  const [formContent, setFormContent] = useState({});

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
  console.log('shouldPrompt', shouldPrompt);

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
