import React, { useEffect, useState, useCallback } from 'react';
import {
  Form,
  unstable_useBlocker as useBlocker,
  useNavigate,
  useBeforeUnload,
  // unstable_usePrompt as usePrompt,
} from 'react-router-dom';
import NewClientNav from './components/NewClientNav';
import StepContent from './components/StepContent';

async function saveNewClient(request) {
  console.log(request);
  const data = Object.fromEntries(await request.formData());
  console.log(data);
  return null;
}

function usePrompt(message, { beforeUnload = false } = {}) {
  const blocker = useBlocker(
    useCallback(
      () => (typeof message === 'string' ? !window.confirm(message) : false),
      [message]
    ),
    []
  );

  useBeforeUnload(
    useCallback(
      (event) => {
        if (beforeUnload && typeof message === 'string') {
          event.preventDefault();
          event.returnValue = message;
        }
      },
      [message, beforeUnload]
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

  console.log(formContent);

  // check if formContent is an empty object or if all of the values are empty strings
  const isFormFilled =
    Object.keys(formContent).length > 0 &&
    Object.values(formContent).some(
      (value) => value !== '' && value !== '+49 ' && value !== '+49'
    );

  usePrompt(
    'Das Formular ist noch nicht gespeichert. Zum Verlassen bitte bestätigen. Alle bisher eingegebenen Daten werden gelöscht.',
    {
      beforeUnload: isFormFilled,
    }
  );

  return (
    <Form method="post" className="w-full min-h-screen" autoComplete="off">
      <div className="p-6 min-h-screen">
        <StepContent
          currentStep={currentStep}
          formContent={formContent}
          setFormContent={setFormContent}
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
