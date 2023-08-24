import React from 'react';
import { useOutletContext, Form } from 'react-router-dom';
import ClientListItem from './components/Welcome/ClientListItem';

const Clients = () => {
  const { userColor, customers } = useOutletContext();
  return (
    <div
      style={{ minHeight: 'calc(100vh - 7rem)', width: '100%' }}
      className="w-full flex flex-col gap-4 py-8 px-4 lg:p-8"
    >
      <div className="flex items-center gap-2">
        <div className="flex flex-1">
          <h2 className="text-lg md:text-2xl font-bold">Alle Kunden</h2>
        </div>
        <Form method="post" className="flex justify-end flex-1">
          <button
            type="submit"
            className="text-white font-bold py-2 px-4 rounded opacity-100 hover:opacity-80"
            style={{ backgroundColor: userColor }}
          >
            <i className="fa-light fa-plus"></i>
            <span>Neuer Kunde</span>
          </button>
        </Form>
      </div>
      {customers.map((customer, i) => (
        <ClientListItem key={i} customer={customer} userColor={userColor} />
      ))}
    </div>
  );
};

export default Clients;
