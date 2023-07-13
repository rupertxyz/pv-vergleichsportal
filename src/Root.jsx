import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Root = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-md shadow-md p-4">
        <Header />
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Root;
