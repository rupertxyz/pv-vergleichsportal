import React, { useState } from 'react';
import { useOutletContext, Form } from 'react-router-dom';
import ClientListItem from './components/Welcome/ClientListItem';

const Clients = () => {
  const { userObject, customers } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter customers based on the search term
  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.vorname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.nachname.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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
            style={{ backgroundColor: userObject?.color }}
          >
            <i className="fa-light fa-plus"></i>
            <span>Neues Projekt</span>
          </button>
        </Form>
      </div>
      <input
        type="text"
        placeholder="Suche nach Vorname oder Nachname"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // 2. Update the search term when the input value changes
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
      />
      {filteredCustomers.map((customer, i) => (
        <ClientListItem
          key={i}
          customer={customer}
          userColor={userObject?.color}
        />
      ))}
    </div>
  );
};

export default Clients;
