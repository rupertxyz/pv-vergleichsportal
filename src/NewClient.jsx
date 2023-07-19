import React, { useEffect, useState, useCallback } from 'react';
import {
  Form,
  unstable_Blocker as Blocker,
  unstable_useBlocker as useBlocker,
  unstable_BlockerFunction as BlockerFunction,
} from 'react-router-dom';
import NewClientNav from './components/NewClientNav';
import StepContent from './components/StepContent';

async function saveNewClient(request) {
  console.log(request);
  const data = Object.fromEntries(await request.formData());
  console.log(data);
  return null;
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
    Object.values(formContent).every((value) => value !== '');

  let shouldBlock = useCallback(
    function ({ currentLocation, nextLocation }) {
      return isFormFilled && currentLocation.pathname !== nextLocation.pathname;
    },
    [isFormFilled]
  );

  const blocker = useBlocker(shouldBlock);

  // Reset the blocker if the user cleans the form
  useEffect(() => {
    if (blocker.state === 'blocked' && !isFormFilled) {
      blocker.reset();
    }
  }, [blocker, isFormFilled]);

  useEffect(() => {
    if (blocker.state === 'blocked') {
      window.alert('Bitte das Formular zuerst ausfüllen und speichern.');
    }
  }, [blocker]);

  return (
    <Form method="post" className="w-full min-h-screen">
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
