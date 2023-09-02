import React, { useState, useEffect, useContext } from 'react';
import {
  useActionData,
  useFetcher,
  useParams,
  NavLink,
} from 'react-router-dom';
import SignatureModal from '../SignatureModal';
import DatePicker from '../FormComponents/DatePicker';
import { FormContext } from '../../Client';
import AnimationStep from '../KVA/AnimationStep';
import { useOutletContext } from 'react-router-dom';

const ASYNC_TIMEOUT = 5000;

export const asyncTimeout = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const Kostenvoranschlag = ({ setShouldPrompt }) => {
  const params = useParams();
  const { formContent, setFormContent, calculationData, setCalculationData } =
    useContext(FormContext);

  const { userColor, userObject, customers } = useOutletContext();

  const customer = customers.find(
    (customer) => customer.id === parseInt(params.id)
  );

  const fetcher = useFetcher();

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
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

  // load saved signature from formContent if it exists
  useEffect(() => {
    if (formContent.signature) {
      setSavedSignature(formContent.signature);
    }
  }, []);

  const handleSubmit = async () => {
    setShowAnimation(true);
    setShowCalculatorAnimation(true);
    const stringifiedCalculationData = JSON.stringify(calculationData);
    fetcher.submit(
      {
        ...formContent,
        calculationData: stringifiedCalculationData,
        logo: userObject?.user?.publicMetadata?.logo,
      },
      {
        method: 'put',
        action: `/clients/${params.id}/?index`,
      }
    );
    setShouldPrompt(false);
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
    setShowAnimation(false);
    setShowLoader(true);
  };

  useEffect(() => {
    if (fetcher.data?.pdf) {
      setPdfUrl(fetcher.data.pdf);
      setShowLoader(false);
      setShowSuccess(true);
    }
  }, [fetcher.data]);

  const handleSaveOnly = async () => {
    fetcher.submit(
      {
        ...formContent,
        logo: userObject?.user?.publicMetadata?.logo,
        saveOnly: true,
      },
      {
        method: 'put',
        action: `/clients/${params.id}/?index`,
      }
    );
  };

  const handleModalClose = () => {
    setShowCalculatorAnimation(false);
    setShowSuccess(false);
  };

  return (
    <>
      {showCalculatorAnimation && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="relative w-3/4 h-1/2 md:w-1/2 md:h-3/4 flex justify-center items-center bg-gradient-to-b from-gray-50 to-gray-100 m-2 rounded">
            {showSuccess && (
              <button
                onClick={handleModalClose}
                className="absolute right-5 top-5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}

            {showLoader && (
              <div className="flex flex-col items-center justify-center">
                <h2 className="text-xl font-bold mb-6">
                  Angebot wird erstellt...
                </h2>
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            )}

            {showSuccess && (
              <div className="flex flex-col w-full h-full items-center justify-center">
                <h2 className="text-xl font-bold mb-6">
                  Angebot wurde erstellt 🎉
                </h2>
                <div className="flex flex-wrap -m-2">
                  <div className="w-1/2 md:w-1/2 p-2">
                    <a
                      href={pdfUrl}
                      target="_blank"
                      className="flex flex-col justify-center text-center items-center p-4 border-2 rounded h-full"
                      style={{ borderColor: userColor }}
                    >
                      <span>Angebot öffnen</span>
                    </a>
                  </div>
                  <div className="w-1/2 md:w-1/2 p-2">
                    {' '}
                    <NavLink
                      to="/"
                      className="flex flex-col justify-center text-center items-center p-4 border-2 rounded h-full"
                      style={{ borderColor: userColor }}
                    >
                      Alle Kunden
                    </NavLink>
                  </div>
                </div>
              </div>
            )}
            {showAnimation && (
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
            )}
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
          <div className="w-full flex justify-end mt-4 p-2 gap-4">
            <button
              className="text-white font-bold py-2 px-4 rounded opacity-100 hover:opacity-80"
              style={{ backgroundColor: userColor }}
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              {customer?.pdf ? (
                <span>Neues Angebot erstellen</span>
              ) : (
                <span>Angebot erstellen</span>
              )}
            </button>
            <button
              className="text-black font-bold py-2 px-4 rounded bg-blue-100 hover:bg-blue-200"
              onClick={(e) => {
                e.preventDefault();
                handleSaveOnly();
              }}
            >
              Speichern
            </button>
          </div>
        </div>
      </>
    </>
  );
};

export default Kostenvoranschlag;
