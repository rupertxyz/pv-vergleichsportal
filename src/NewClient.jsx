import React, { useEffect, useState } from 'react';
import { Form } from 'react-router-dom';
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

  const [formContent, setFormContent] = useState({
    leadSource: '',
    besuchstermin: '',
    anrede: '',
    vorname: '',
    nachname: '',
    adresse: {},
    telefon: '',
    email: '',
    firmenbezeichnung: '',
  });

  console.log(formContent);

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
