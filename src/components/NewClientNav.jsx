import React from 'react';

const NewClientNav = ({ steps, currentStep, setCurrentStep }) => {
  return (
    <div className="sticky bottom-0 z-50 safe-bottom bg-gray-50">
      <div className="flex w-full justify-between overflow-x-auto">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`flex-auto text-center text-sm p-4 border cursor-pointer ${
              index === currentStep
                ? 'bg-red-500 text-white'
                : 'bg-gray-50 text-black'
            }`}
            onClick={() => setCurrentStep(index)} // Set the click handler to our new function
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewClientNav;
