import React from 'react';
import Angebot from './StepContent/Angebot';
import Anlage from './StepContent/Anlage';
import Kostenvoranschlag from './StepContent/Kostenvoranschlag';

const StepContent = ({
  currentStep,
  formContent,
  setFormContent,
  setShouldPrompt,
}) => {
  return (
    <div>
      <div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
        <Angebot formContent={formContent} setFormContent={setFormContent} />
      </div>
      <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
        <Anlage formContent={formContent} setFormContent={setFormContent} />
      </div>
      <div style={{ display: currentStep === 2 ? 'block' : 'none' }}>
        Elektro content goes here
      </div>
      <div style={{ display: currentStep === 3 ? 'block' : 'none' }}>
        Wirtschaftlichkeit content goes here
      </div>
      <div style={{ display: currentStep === 4 ? 'block' : 'none' }}>
        <Kostenvoranschlag
          formContent={formContent}
          setFormContent={setFormContent}
          setShouldPrompt={setShouldPrompt}
        />
      </div>
    </div>
  );
};

export default StepContent;
