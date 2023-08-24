import React from 'react';
import { NavLink, useFetcher } from 'react-router-dom';

const ClientListItem = ({ customer }) => {
  const fetcher = useFetcher();
  return (
    <NavLink
      to={`/clients/${customer.id}`}
      className="min-h-[90px] max-h-[90px] bg-white hover:bg-gray-100 shadow-sm hover:shadow-md border border-slate-100 flex flex-col grow rounded transition-all duration-200"
    >
      <div className="flex flex-col grow items-center justify-center p-4 gap-4">
        <div className="flex flex-row lg:items-center w-full gap-2">
          <div className="flex flex-col gap-1 flex-1 justify-start lg:order-1">
            <h5 className="font-bold text-sm lg:text-xl">
              {`${customer.titel || ''} ${customer.vorname || 'Neuer Kunde'} ${
                customer.nachname || ''
              }`}
            </h5>
            <div className="text-xs lg:text-sm flex items-center gap-2">
              <p>{customer.firma || ''}</p>
            </div>
          </div>
          <div className="lg:order-3 flex gap-2">
            <div className="flex flex-1 gap-4 items-center justify-end">
              {customer?.pdf ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(customer.pdf, '_blank');
                  }}
                  className="inline-flex items-center text-center space-x-1 bg-blue-100 hover:bg-blue-200 text-xs font-medium px-3 py-2 rounded"
                >
                  <p>PDF</p>
                </button>
              ) : null}

              <div className="text-xl hidden lg:block">
                <i className="fa-light fa-chevron-right"></i>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-end">
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  const confirm = window.confirm(
                    'Are you sure you want to delete this client?'
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
                className="inline-flex items-center space-x-1 bg-rose-100 hover:bg-rose-200 text-xs font-medium px-3 py-2 rounded"
              >
                <p>Löschen</p>
              </button>
              <div className="text-xl hidden lg:block">
                <i className="fa-light fa-chevron-right"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default ClientListItem;
