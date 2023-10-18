import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { loadNinoxData, saveToNinox, createClient } from '../../services/ninox';
import indexDb from '../../config/dexie';

const ClientListItem = ({
  customer,
  diff = false,
  offline,
  clientDataFromNinox,
  setClientDataFromNinox,
}) => {
  const [updatingNinox, setUpdatingNinox] = useState(false);

  async function updateNinox(customer) {
    setUpdatingNinox(true);
    if (!offline) {
      // find customer id in ninox
      const ninoxId = clientDataFromNinox.find(
        (ninoxCustomer) => ninoxCustomer.id === customer.id
      );
      // if customer does not exist in ninox, create it
      if (!ninoxId) {
        const { customerId } = await createClient(customer.id);
        // update indexedDB with new ninox id
        await indexDb.data.update(customer.id, { id: customerId });
        await saveToNinox(customer, customerId);
      }
      // if customer exists in ninox, update it
      else {
        await saveToNinox(customer, customer.id);
      }

      // // // delete customers in ninox that are not in indexedDB
      // for (const ninoxCustomer of clientDataFromNinox) {
      //   const indexedDbId = customers.find(
      //     (customer) => customer.id === ninoxCustomer.id
      //   );
      //   if (!indexedDbId) {
      //     await deleteClient(ninoxCustomer.id);
      //   }
      // }

      // update client data from ninox
      const ninoxData = await loadNinoxData();
      setClientDataFromNinox(ninoxData);
    } else {
      window.alert(
        'Sync nicht möglich, da keine Internetverbindung besteht. Bitte später erneut versuchen.'
      );
    }
    setUpdatingNinox(false);
  }

  return (
    <NavLink
      to={`/clients/${customer.id}`}
      className={`${
        diff ? 'bg-red-200 hover:bg-red-300' : 'bg-white hover:bg-gray-100'
      }  shadow-sm hover:shadow-md border border-slate-100 flex flex-col rounded transition-all duration-200 `}
    >
      <div className="flex flex-col items-center justify-center p-4">
        <div className="flex lg:items-center w-full gap-2">
          <div className="flex flex-col gap-1 flex-1 justify-start lg:order-1">
            <h5 className="font-bold text-lg lg:text-xl">
              {`${customer.titel || ''} ${customer.vorname || 'Neuer Kunde'} ${
                customer.nachname || ''
              }`}
            </h5>
            <div className="w-60 text-sm flex items-center gap-2">
              <p className="truncate">
                {customer.firma || 'Keine Firma angegeben'}
                <br />
                {customer.adresse || 'Keine Adresse angegeben'}
              </p>
            </div>
          </div>
          <div className="lg:order-3 flex flex-col lg:flex-row gap-2">
            <div className="flex flex-1 gap-1 items-center justify-end">
              {diff ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    updateNinox(customer);
                  }}
                  className="flex justify-center w-20 text-center bg-red-500 hover:bg-red-600 text-xs font-medium py-4 rounded"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="white"
                    className={`block w-4 h-4 ${
                      updatingNinox && 'animate-bounce'
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                  </svg>
                </button>
              ) : null}

              {customer?.pdf ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(customer.pdf, '_blank');
                  }}
                  className="w-20 text-center bg-blue-100 hover:bg-blue-200 text-xs font-medium py-2 rounded"
                >
                  <p>PDF</p>
                </button>
              ) : null}

              <div className="text-xl hidden lg:block">
                <i className="fa-light fa-chevron-right"></i>
              </div>
            </div>
            {/* <div className="flex flex-1 items-center justify-end">
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  const confirm = window.confirm(
                    'Sind Sie sicher, dass Sie diesen Kunden löschen möchten?'
                  );
                  if (confirm) {
                    fetcher.submit(
                      {},
                      {
                        method: 'delete',
                        action: `/clients/${customer.id}/?index`,
                      }
                    );
                  }
                }}
                className="w-20 text-center bg-rose-100 hover:bg-rose-200 text-xs font-medium py-2 rounded"
              >
                <p>Löschen</p>
              </button>
              <div className="text-xl hidden lg:block">
                <i className="fa-light fa-chevron-right"></i>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default ClientListItem;
