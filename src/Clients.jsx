import React from 'react';
import { loadNinoxData } from './services/ninox';
import { useLoaderData } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';

async function dataLoader() {
  const data = await loadNinoxData();
  return data;
}

const Clients = () => {
  const { userColor } = useOutletContext();
  const customers = useLoaderData();
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
  };
  if (customers.length > 0) {
    return (
      <div className="w-full overflow-x-auto pt-6">
        <div style={gridStyle} className="divide-y divide-gray-200">
          <div className="bg-gray-50 px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Anrede
          </div>
          <div className="bg-gray-50 px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Vorname
          </div>
          <div className="bg-gray-50 px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Nachname
          </div>
          <div className="bg-gray-50 px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Adresse
          </div>
          <div className="bg-gray-50 px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></div>
          {customers.map((customer, index) => (
            <>
              <div
                key={`${index}-anrede`}
                className="px-5 py-4 whitespace-nowrap text-sm text-gray-500"
              >
                {customer.anrede}
              </div>
              <div
                key={`${index}-vorname`}
                className="px-5 py-4 whitespace-nowrap text-sm text-gray-500"
              >
                {customer.vorname}
              </div>
              <div
                key={`${index}-nachname`}
                className="px-5 py-4 whitespace-nowrap text-sm text-gray-500"
              >
                {customer.nachname}
              </div>
              <div
                key={`${index}-adresse`}
                className="px-5 py-4 whitespace-nowrap text-sm text-gray-500"
              >
                {customer.adresse}
              </div>
              <div
                key={`${index}-button`}
                className="px-5 py-4 whitespace-nowrap text-sm text-gray-500 flex justify-center items-center"
              >
                <button
                  style={{ borderColor: userColor, color: userColor }}
                  className="border px-2 py-1 text-center overflow-ellipsis overflow-hidden"
                >
                  Öffnen
                </button>
              </div>
            </>
          ))}
        </div>
      </div>
    );
  }
};

export { Clients, dataLoader };
