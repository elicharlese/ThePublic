import React, { useState } from 'react';
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword } from '../firebase-config';
import styles from './Login.module.scss';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={styles['login-container']}>
      <h1>Log In</h1>
      {error && <div className={styles['error']}>{error}</div>}
      <form onSubmit={handleFormSubmit} className={styles['login-form']}>
        <div className={styles['form-group']}>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={handleEmailChange} required />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={handlePasswordChange} required />
        </div>
        <button type="submit" className={styles['submit-button']}>Log In</button>
      </form>
      <button onClick={handleGoogleSignIn} className={styles['google-signin-button']}>Sign in with Google</button>
      <button onClick={() => window.location.href='/signup'} className={styles['toggle-login-button']}>
        New user? Sign Up
      </button>
    </div>
  );
};

export default Login;