import React, { useRef, useEffect, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const SignatureModal = ({
  savedSignature,
  setSavedSignature,
  setShowModal,
  setFormContent,
}) => {
  const sigPad = useRef(null);
  const saveSignature = (e) => {
    e.preventDefault();
    if (sigPad && sigPad.current) {
      const savedSignature = sigPad.current.isEmpty()
        ? null
        : sigPad.current.toDataURL();
      setSavedSignature(savedSignature);
      setFormContent((prevFormContent) => {
        return { ...prevFormContent, unterschrift: savedSignature };
      });
      setShowModal(false);
    }
  };

  useEffect(() => {
    if (savedSignature) {
      sigPad.current.fromDataURL(savedSignature);
    }
  }, [savedSignature]);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded">
        <SignatureCanvas
          penColor="black"
          canvasProps={{
            className: 'w-full h-48',
          }}
          ref={sigPad}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
          onClick={saveSignature}
        >
          Save
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2 ml-2"
          onClick={(e) => {
            e.preventDefault();
            sigPad.current.clear();
          }}
        >
          Clear
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-2 ml-2"
          onClick={(e) => {
            e.preventDefault();
            setShowModal(false);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SignatureModal;
