import React, { useEffect, useState, useCallback } from 'react';
import {
  Form,
  unstable_useBlocker as useBlocker,
  useBeforeUnload,
  redirect,
} from 'react-router-dom';
import NewClientNav from './components/NewClientNav';
import StepContent from './components/StepContent';
import { saveToNinox } from './services/ninox';

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
  if (Object.keys(errorMsg).length > 0) return { messages: errorMsg };

  // save to Ninox
  await saveToNinox(data);

  return redirect('/clients');
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

const NewClient = () => {
  const steps = [
    'Angebot',
    'Anlage',
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
    <Form
      method="post"
      action="/new-client"
      className="w-full min-h-screen"
      autoComplete="off"
    >
      <div className="p-6 min-h-screen">
        <StepContent
          currentStep={currentStep}
          formContent={formContent}
          setFormContent={setFormContent}
          setShouldPrompt={setShouldPrompt}
        />
      </div>
      <NewClientNav
        steps={steps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
    </Form>
  );
};

export { NewClient, saveNewClient };
