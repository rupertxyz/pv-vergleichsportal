import React from 'react';
import puff from '../../assets/svg_loaders/puff.svg';

const AnimationOne = ({ text, color = 'black', check }) => {
  return (
    <>
      <div className="flex justify-center items-center gap-2">
        {check ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke={color}
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ) : (
          <img src={puff} className="w-5 h-5" />
        )}
        <p className="text-center text-md font-bold" style={{ color }}>
          {text}
        </p>
      </div>
    </>
  );
};

export default AnimationOne;
