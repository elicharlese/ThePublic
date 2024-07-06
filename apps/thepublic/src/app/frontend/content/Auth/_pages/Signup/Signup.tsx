import React, { useState } from 'react';
import styles from './Signup.module.scss';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Example of sending a signup request to your Cloudflare Worker
    try {
      const response = await fetch('https://your-cloudflare-worker-url/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      // Handle successful signup
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    // Redirect user to Google sign-in page configured in Cloudflare Access
    window.location.href = 'https://your-cloudflare-access-google-signin-url';
  };

  return (
    <div className={styles['signup-container']}>
      <h1>Sign Up</h1>
      {error && <div className={styles['error']}>{error}</div>}
      <form onSubmit={handleFormSubmit} className={styles['signup-form']}>
        <div className={styles['form-group']}>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={handleEmailChange} required />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={handlePasswordChange} required />
        </div>
        <button type="submit" className={styles['submit-button']}>Sign Up</button>
      </form>
      <button onClick={handleGoogleSignIn} className={styles['google-signin-button']}>Sign up with Google</button>
    </div>
  );
};

export default Signup;