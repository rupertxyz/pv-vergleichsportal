import React from 'react';
import { NavLink, useFetcher } from 'react-router-dom';

const ClientListItem = ({ customer }) => {
  const fetcher = useFetcher();
  return (
    <NavLink
      to={`/clients/${customer.id}`}
      className="bg-white hover:bg-gray-100 shadow-sm hover:shadow-md border border-slate-100 flex flex-col rounded transition-all duration-200"
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
            <div className="flex flex-1 items-center justify-end">
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
            </div>
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default ClientListItem;
