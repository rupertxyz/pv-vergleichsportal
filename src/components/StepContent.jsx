import React from 'react';
import Kunde from './StepContent/Kunde';
import Anlage from './StepContent/Anlage';
import Kostenvoranschlag from './StepContent/Kostenvoranschlag';
import Dach from './StepContent/Dach';
import Elektro from './StepContent/Elektro';
import Wirtschaftlichkeit from './StepContent/Wirtschaftlichkeit';

const StepContent = ({ currentStep, setShouldPrompt, setShowSuccess }) => {
  return (
    <div>
      <div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
        <Kunde />
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
        <Kostenvoranschlag
          setShouldPrompt={setShouldPrompt}
          setShowSuccess={setShowSuccess}
        />
      </div>
    </div>
  );
};

export default StepContent;
