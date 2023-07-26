import React from 'react';
import Angebot from './StepContent/Angebot';
import Anlage from './StepContent/Anlage';
import Kostenvoranschlag from './StepContent/Kostenvoranschlag';
import Dach from './StepContent/Dach';
import Elektro from './StepContent/Elektro';
import Wirtschaftlichkeit from './StepContent/Wirtschaftlichkeit';

const StepContent = ({ currentStep, setShouldPrompt }) => {
  return (
    <div>
      <div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
        <Angebot />
      </div>
      <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
        <Anlage />
      </div>
      <div style={{ display: currentStep === 2 ? 'block' : 'none' }}>
        <Dach />
      </div>
      <div style={{ display: currentStep === 3 ? 'block' : 'none' }}>
        <Elektro />
      </div>
      <div style={{ display: currentStep === 4 ? 'block' : 'none' }}>
        <Wirtschaftlichkeit />
      </div>
      <div style={{ display: currentStep === 5 ? 'block' : 'none' }}>
        <Kostenvoranschlag setShouldPrompt={setShouldPrompt} />
      </div>
    </div>
  );
};

export default StepContent;
