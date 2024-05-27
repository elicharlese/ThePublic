import React, { useState } from 'react';
import styles from './WiFiSharing.module.scss';

const WiFiSharing: React.FC = () => {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');

  const handleShareWiFi = async () => {
    const payload = { ssid, password, user: 'test-account.testnet' }; // Use actual user account
    const response = await fetch('/share-wifi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    alert(result.message);
  };

  return (
    <div className={styles['wifi-sharing']}>
      <h2>Share Your Wi-Fi</h2>
      <input
        type="text"
        placeholder="Enter SSID"
        value={ssid}
        onChange={(e) => setSsid(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleShareWiFi}>Share Wi-Fi</button>
    </div>
  );
};

export default WiFiSharing;