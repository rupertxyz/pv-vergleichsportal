import React, { useState } from 'react';
import { auth } from '../../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import sonnenDachLogo from '../../assets/sonnendach_logo.webp';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((error) => {
        console.error(error);
        setLoginError(true);
      });
  };

  return (
    <form onSubmit={signIn} className="flex flex-col gap-2">
      <img className="block" src={sonnenDachLogo} />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onClick={() => setLoginError(false)}
        className="focus:ring-2 focus:ring-yellow-500 focus:outline-non"
      />
      <input
        type="password"
        placeholder="Passwort"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onClick={() => setLoginError(false)}
        className="focus:ring-2 focus:ring-yellow-500 focus:outline-non"
      />
      <button type="submit" className="border-2 hover:bg-slate-50 p-2">
        Log In
      </button>
      {loginError && (
        <p className="text-red-500 text-center">Falsche Email oder Passwort</p>
      )}
    </form>
  );
}
