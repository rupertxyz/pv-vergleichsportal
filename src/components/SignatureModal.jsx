import React, { useRef, useEffect, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const SignatureModal = ({
  savedSignature,
  setSavedSignature,
  setShowModal,
  setFormContent,
  formContent,
}) => {
  const sigPad = useRef(null);

  const prefillSignature = async () => {
    if (sigPad && sigPad.current) {
      const canvas = sigPad.current.getCanvas();

      const ctx = canvas.getContext('2d');
      const signatureText = `${formContent.vorname} ${formContent.nachname}`;

      // // Ensure font is loaded
      const fontSize = 30;
      await document.fonts.load(`${fontSize}px Dancing Script`);
      const approximateTextHeight = fontSize * 0.7;

      ctx.font = `${fontSize}px Dancing Script`;

      ctx.webkitFontSmoothing = 'antialiased'; // Add font smoothing
      ctx.globalAlpha = 0.9; // Adjust global alpha
      const textWidth = ctx.measureText(signatureText).width;

      // Calculate center coordinates
      const centerX = (canvas.width - textWidth) / 2;
      const centerY = (canvas.height + approximateTextHeight) / 2;

      if (formContent.vorname && formContent.nachname) {
        ctx.fillText(signatureText, 20, 150);
      }

      sigPad.current.fromDataURL(canvas.toDataURL());
    }
  };

  const saveSignature = (e) => {
    e.preventDefault();
    if (sigPad && sigPad.current) {
      const savedSignature = sigPad.current.isEmpty()
        ? null
        : sigPad.current.toDataURL();
      setSavedSignature(savedSignature);
      setFormContent((prevFormContent) => {
        return { ...prevFormContent, signature: savedSignature };
      });
      setShowModal(false);
    }
  };

  useEffect(() => {
    if (savedSignature) {
      sigPad.current.fromDataURL(savedSignature);
    } else {
      prefillSignature(); // Prefill the signature when the modal is opened
    }
  }, [savedSignature]);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded w-3/4 lg:w-1/2">
        <SignatureCanvas
          penColor="black"
          canvasProps={{
            className: 'w-full h-64',
          }}
          ref={(ref) => (sigPad.current = ref)}
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
