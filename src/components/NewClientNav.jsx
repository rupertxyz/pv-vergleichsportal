import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const NewClientNav = ({ steps, currentStep, setCurrentStep }) => {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
        overflow: hidden;
      }
      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const scrollContainer = useRef(null);
  const [showScrollLeft, setShowScrollLeft] = useState(false);
  const [showScrollRight, setShowScrollRight] = useState(true);
  const timeoutRef = useRef(null); // Reference to store our timeout

  const checkScroll = () => {
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.current;
    const atLeftEdge = scrollLeft <= 0;
    const atRightEdge = scrollLeft >= scrollWidth - clientWidth;

    // If a timeout is already running, clear it
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    // Set a timeout to update the state after a delay
    timeoutRef.current = setTimeout(() => {
      setShowScrollLeft(!atLeftEdge);
      setShowScrollRight(!atRightEdge);
    }, 500); // Delay in milliseconds
  };

  useEffect(() => {
    const scrollEl = scrollContainer.current;
    scrollEl.addEventListener('scroll', checkScroll);

    // Clean up event listener on unmount
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      scrollEl.removeEventListener('scroll', checkScroll);
    };
  }, []);

  const scroll = (scrollOffset) => {
    scrollContainer.current.scrollLeft += scrollOffset;
    checkScroll(); // Check scroll after we've scrolled
  };

  return (
    <div className="sticky flex bottom-0 z-50 safe-bottom bg-gray-50">
      {showScrollLeft && (
        <button
          onClick={(e) => {
            e.preventDefault();
            scroll(-300);
          }}
          className="border-t border-r shadow-2xl"
        >
          <ChevronLeftIcon className="h-4 w-10" />
        </button>
      )}
      <div
        ref={scrollContainer}
        className="flex w-full justify-between overflow-x-auto hide-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        {steps.map((step, index) => (
          <div
            key={step}
            className={`flex-auto text-center text-sm p-4 border-t cursor-pointer ${
              index === currentStep
                ? 'bg-red-500 text-white'
                : 'bg-gray-50 text-black'
            }`}
            onClick={() => setCurrentStep(index)}
          >
            {step}
          </div>
        ))}
      </div>
      {showScrollRight && (
        <button
          onClick={(e) => {
            e.preventDefault();
            scroll(300);
          }}
          className="border-t border-l shadow-xl"
        >
          <ChevronRightIcon className="h-4 w-10" />
        </button>
      )}
    </div>
  );
};

export default NewClientNav;
