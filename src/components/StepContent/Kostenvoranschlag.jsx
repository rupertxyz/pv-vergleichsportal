import React, { useState, useEffect, useContext } from 'react';
import { useActionData, useFetcher } from 'react-router-dom';
import SignatureModal from '../SignatureModal';
import DatePicker from '../FormComponents/DatePicker';
import { FormContext } from '../../NewClient';
import AnimationStep from '../KVA/AnimationStep';
import { useOutletContext } from 'react-router-dom';

const ASYNC_TIMEOUT = 500;

export const asyncTimeout = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const Kostenvoranschlag = ({ setShouldPrompt, setShowSuccess }) => {
  const { formContent, setFormContent } = useContext(FormContext);
  const { userColor, userObject } = useOutletContext();

  const fetcher = useFetcher();

  const [errorMessages, setErrorMessages] = useState({});
  const data = useActionData();
  const [showModal, setShowModal] = useState(false);
  const [savedSignature, setSavedSignature] = useState(null);
  const [showCalculatorAnimation, setShowCalculatorAnimation] = useState(false);
  const [animationColorOne, setAnimationColorOne] = useState('black');
  const [animationColorTwo, setAnimationColorTwo] = useState('black');
  const [animationColorThree, setAnimationColorThree] = useState('black');
  const [animationColorFour, setAnimationColorFour] = useState('black');
  const [animationColorFive, setAnimationColorFive] = useState('black');
  const [animationOneCheck, setAnimationOneCheck] = useState(false);
  const [animationTwoCheck, setAnimationTwoCheck] = useState(false);
  const [animationThreeCheck, setAnimationThreeCheck] = useState(false);
  const [animationFourCheck, setAnimationFourCheck] = useState(false);
  const [animationFiveCheck, setAnimationFiveCheck] = useState(false);

  useEffect(() => {
    if (data) {
      setErrorMessages(data.messages);
    }
  }, [data]);

  // load saved signature from formContent if it exists
  useEffect(() => {
    if (formContent.signature) {
      setSavedSignature(formContent.signature);
    }
  }, []);

  const handleSubmit = async () => {
    setShowCalculatorAnimation(true);
    await asyncTimeout(ASYNC_TIMEOUT);
    setAnimationColorOne('gray');
    setAnimationOneCheck(true);
    await asyncTimeout(ASYNC_TIMEOUT);
    setAnimationColorTwo('gray');
    setAnimationTwoCheck(true);
    await asyncTimeout(ASYNC_TIMEOUT);
    setAnimationColorThree('gray');
    setAnimationThreeCheck(true);
    await asyncTimeout(ASYNC_TIMEOUT);
    setAnimationColorFour('gray');
    setAnimationFourCheck(true);
    await asyncTimeout(ASYNC_TIMEOUT);
    setAnimationColorFive('gray');
    setAnimationFiveCheck(true);
    setShowCalculatorAnimation(false);
    setShowSuccess(true);
    // setTimeout(() => {
    //   fetcher.submit(
    //     { ...formContent, logo: userObject?.user?.publicMetadata?.logo },
    //     {
    //       method: 'post',
    //       action: '/new-client',
    //     }
    //   );
    //   setShowCalculatorAnimation(false);
    // }, 500);
  };

  return (
    <>
      {showCalculatorAnimation && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="w-3/4 h-1/2 md:w-1/2 md:h-1/2 flex justify-center items-center bg-gradient-to-b from-gray-50 to-gray-100 m-2 rounded">
            <div className="flex flex-col items-center justify-center">
              <div className="flex flex-col items-start justify-center gap-8 text-xs">
                <AnimationStep
                  text="Prüfe Preis- / Leistungsverhältnis"
                  color={animationColorOne}
                  check={animationOneCheck}
                />
                <AnimationStep
                  text="Prüfe Produktverfügbarkeit..."
                  color={animationColorTwo}
                  check={animationTwoCheck}
                />
                <AnimationStep
                  text="Prüfe Qualitätsstandards..."
                  color={animationColorThree}
                  check={animationThreeCheck}
                />
                <AnimationStep
                  text="Prüfe Bestpreisangebot..."
                  color={animationColorFour}
                  check={animationFourCheck}
                />
                <AnimationStep
                  text="Prüfe Fertigstellungszeitraum..."
                  color={animationColorFive}
                  check={animationFiveCheck}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <>
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Kostenvoranschlag
        </h1>
        <div className="flex flex-wrap -m-2">
          <DatePicker
            label="Abschlusstermin"
            identifier="abschlussTermin"
            smWidth="w-1/2"
          />

          {/* {Object.entries(errorMessages).length > 0 && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <ul>
                {errorMessages &&
                  Object.values(errorMessages).map((message, index) => (
                    <li key={index}>{message}</li>
                  ))}
              </ul>
            </div>
          )} */}

          <div
            onClick={() => setShowModal(true)}
            className="relative w-full flex items-center justify-center h-48 border border-black cursor-pointer m-2"
          >
            {savedSignature ? (
              <img
                className="h-full w-full object-contain"
                src={savedSignature}
                alt="Saved Signature"
                onClick={() => setShowModal(true)}
              />
            ) : (
              <div className="absolute flex items-center justify-center gap-1 w-full h-full bg-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>

                <p className="text-center text-md font-bold">
                  Signatur einfügen
                </p>
              </div>
            )}
          </div>
          {showModal && (
            <SignatureModal
              savedSignature={savedSignature}
              setSavedSignature={setSavedSignature}
              setShowModal={setShowModal}
              setFormContent={setFormContent}
            />
          )}
          <div className="w-full flex justify-end mt-4 p-2">
            <button
              className="text-white font-bold py-2 px-4 rounded opacity-80 hover:opacity-100"
              style={{ backgroundColor: userColor }}
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
                setShouldPrompt(false);
              }}
            >
              Abschicken
            </button>
          </div>
        </div>
      </>
    </>
  );
};

export default Kostenvoranschlag;
