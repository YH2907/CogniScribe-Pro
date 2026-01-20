import React, { useState } from 'react';
import { speak } from '../utils/speech';

export default function AuthForm({ setToken }) {
  const [mode, setMode] = useState('login'); // or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async () => {
    const url = mode === 'login' ? '/auth/login' : '/auth/register';
    const res = await fetch(`${process.env.REACT_APP_API_URL}${url}`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.token) {
      setToken(data.token);
      localStorage.setItem('token', data.token);
      speak('Logged in');
    } else {
      speak(data.message || 'Error');
    }
  };

  return (
    <div>
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button onClick={submit}>{mode === 'login' ? 'Login' : 'Register'}</button>
      <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
        Switch to {mode === 'login' ? 'Register' : 'Login'}
      </button>
    </div>
  );
}
