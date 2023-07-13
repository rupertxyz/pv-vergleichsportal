import React from 'react';
import WelcomeItem from './WelcomeItem';

const Welcome = () => {
  return (
    <div className="w-full flex p-4 gap-4">
      <WelcomeItem link="/new-client" content="Neuer Kunde" />
      <WelcomeItem link="/clients" content="Bestehende Kunden" />
    </div>
  );
};

export default Welcome;
