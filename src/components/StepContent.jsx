import React from 'react';
import Angebot from './StepContent/Angebot';

const StepContent = ({ currentStep, formContent, setFormContent }) => {
  switch (currentStep) {
    case 0:
      return (
        <Angebot formContent={formContent} setFormContent={setFormContent} />
      );
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

export default StepContent;
