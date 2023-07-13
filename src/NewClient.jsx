import React, { useState, useEffect, useRef } from 'react';
import { Form } from 'react-router-dom';

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

  const Navigation = ({ steps, currentStep, setCurrentStep }) => {
    return (
      <div className="relative">
        <div className="flex w-full justify-between mb-4 overflow-x-auto">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`flex-auto text-center text-sm p-2 border cursor-pointer ${
                index === currentStep
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-black'
              }`}
              onClick={() => setCurrentStep(index)}
            >
              {step}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const StepContent = ({ currentStep }) => {
    switch (currentStep) {
      case 0:
        return <div>Angebot content goes here</div>;
      case 1:
        return <div>Anlage content goes here</div>;
      case 2:
        return <div>Elektro content goes here</div>;
      case 3:
        return <div>Wirtschaftlichkeit content goes here</div>;
      case 4:
        return <div>Kostenvoranschlag content goes here</div>;
      default:
        return null;
    }
  };

  return (
    <Form method="post" className="w-full">
      <Navigation
        steps={steps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
      <StepContent currentStep={currentStep} />
    </Form>
  );
};

export { NewClient, saveNewClient };
