import React, { useState } from 'react';
import { Form } from 'react-router-dom';
import NewClientNav from './components/NewClientNav';
import StepContent from './components/StepContent';
import Input from './components/FormComponents/Input';
import Select from './components/FormComponents/Select';

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

  const [formContent, setFormContent] = useState({
    leadSource: '',
    besuchstermin: '',
    anrede: '',
    vorname: '',
    nachname: '',
    strasse: '',
    hausnummer: '',
    plz: '',
    ort: '',
    telefon: '',
    email: '',
    firmenbezeichnung: '',
  });

  return (
    <Form method="post" className="w-full min-h-screen">
      <div className="p-6 min-h-screen safe-bottom">
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
