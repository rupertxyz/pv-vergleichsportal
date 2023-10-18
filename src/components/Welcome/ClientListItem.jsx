import React, { useState, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { loadNinoxData, saveToNinox, createClient } from '../../services/ninox';
import indexDb from '../../config/dexie';
import { Dialog, Transition } from '@headlessui/react';

const ClientListItem = ({
  customer,
  diff = false,
  offline,
  clientDataFromNinox,
  setClientDataFromNinox,
  userColor,
}) => {
  const [updatingNinox, setUpdatingNinox] = useState(false);
  let [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState([]);
  console.log('images', images);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

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

  function onImageChange(e) {
    setImages([...images, ...e.target.files]);
  }

  // <NavLink
  //   to={`/clients/${customer.id}`}
  //   className={`${
  //     diff ? 'bg-red-200 hover:bg-red-300' : 'bg-white hover:bg-gray-100'
  //   }  shadow-sm hover:shadow-md border border-slate-100 flex flex-col rounded transition-all duration-200 `}
  // >
  // </NavLink>

  return (
    <>
      <div
        onClick={openModal}
        className={`${
          diff ? 'bg-red-200 hover:bg-red-300' : 'bg-white hover:bg-gray-100'
        }  shadow-sm hover:shadow-md border border-slate-100 flex flex-col rounded transition-all duration-200 cursor-pointer`}
      >
        <div className="flex flex-col items-center justify-center p-4">
          <div className="flex lg:items-center w-full gap-2">
            <div className="flex flex-col gap-1 flex-1 justify-start lg:order-1">
              <h5 className="font-bold text-lg lg:text-xl">
                {`${customer.titel || ''} ${
                  customer.vorname || 'Neuer Kunde'
                } ${customer.nachname || ''}`}
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
            </div>
          </div>
        </div>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-center">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {customer.titel || ''} {customer.vorname || 'Neuer Kunde'}{' '}
                      {customer.nachname || ''}
                    </Dialog.Title>
                    <NavLink
                      to={`/clients/${customer.id}`}
                      className="text-white font-bold py-1 px-2 rounded opacity-100 hover:opacity-80 bg-slate-700 outline-0"
                      style={{ backgroundColor: userColor }}
                    >
                      Bearbeiten
                    </NavLink>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Kunde Details</p>
                  </div>
                  <div className="mt-8">
                    <input
                      type="file"
                      multiple={true}
                      accept="image/*"
                      onChange={onImageChange}
                      id="fileInput"
                    />

                    <div className="mt-8">
                      {images.length > 0
                        ? `${images.length} files selected`
                        : 'No files selected'}
                    </div>
                  </div>
                  <div className="mt-2 flex gap-2">
                    {images.map((image, index) => (
                      <li key={index} className="list-none w-48">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={image.name}
                          className="w-full"
                        />{' '}
                        {/* Render image */}
                      </li>
                    ))}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ClientListItem;
