import React from 'react';
import ovalLoader from './assets/ovalLoader.svg';

const Loading = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-fixed text-indigo-950 leading-normal text-base antialiased">
      {' '}
      <img src={ovalLoader} width="100px" />
    </div>
  );
};

export default Loading;
