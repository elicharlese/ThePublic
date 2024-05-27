import React, { useState } from 'react';
import styles from './styles/NetworkForm.module.scss';

interface WiFiNetwork {
  ssid: string;
  password: string;
}

interface NetworkFormProps {
  addNetwork: (network: WiFiNetwork) => void;
}

const NetworkForm: React.FC<NetworkFormProps> = ({ addNetwork }) => {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNetwork({ ssid, password });
    setSsid('');  // Reset form after submit
    setPassword('');
  };

  return (
    <form className={styles.networkForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="ssid">SSID:</label>
        <input
          type="text"
          id="ssid"
          value={ssid}
          onChange={e => setSsid(e.target.value)}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Add Network</button>
    </form>
  );
};

export default NetworkForm;