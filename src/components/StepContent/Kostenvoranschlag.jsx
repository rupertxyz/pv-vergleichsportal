import React, { useState, useEffect } from 'react';
import { useActionData } from 'react-router-dom';

const Kostenvoranschlag = ({
  formContent,
  setFormContent,
  setShouldPrompt,
}) => {
  const [errorMessages, setErrorMessages] = useState({});
  const data = useActionData();

  useEffect(() => {
    if (data) {
      setErrorMessages(data.messages);
    }
  }, [data]);

  return (
    <>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => setShouldPrompt(false)}
      >
        Submit
      </button>
      {Object.entries(errorMessages).length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <ul>
            {errorMessages &&
              Object.values(errorMessages).map((message, index) => (
                <li key={index}>{message}</li>
              ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Kostenvoranschlag;
