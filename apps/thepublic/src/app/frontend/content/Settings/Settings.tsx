import React, { useState, useEffect } from 'react';
import { connect, Contract, keyStores, WalletConnection } from 'near-api-js';
import styles from './Settings.module.scss';
import { useQuery, useMutation, gql } from '@apollo/client';

// GraphQL Queries and Mutations
const GET_WIFI_CREDENTIALS = gql`
  query WifiCredentials($accountId: String!) {
    wifiCredentials(accountId: $accountId) {
      ssid
      password
    }
  }
`;

const REQUEST_ACCESS = gql`
  mutation RequestAccess($accountId: String!) {
    requestAccess(accountId: $accountId) {
      success
      message
    }
  }
`;

const Settings: React.FC = () => {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [accountId, setAccountId] = useState<string | null>(null);
  const { data, refetch } = useQuery(GET_WIFI_CREDENTIALS, {
    variables: { accountId: accountId || '' },
    skip: !accountId,
  });
  const [requestAccess] = useMutation(REQUEST_ACCESS);

  useEffect(() => {
    // Connect to NEAR wallet (placeholder, actual implementation might differ)
    const initNear = async () => {
      const near = await connect({
        networkId: 'testnet',
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
      });
      const wallet = new WalletConnection(near);
      setAccountId(wallet.getAccountId());
    };
    initNear();
  }, []);

  const handleSave = async () => {
    const near = await connect({
      networkId: 'testnet',
      keyStore: new keyStores.BrowserLocalStorageKeyStore(),
      nodeUrl: 'https://rpc.testnet.near.org',
      walletUrl: 'https://wallet.testnet.near.org',
    });
    const wallet = new WalletConnection(near);
    const wifiContract = new Contract(
      wallet.account(),
      'wifi_sharing_contract.testnet',
      {
        changeMethods: ['update_wifi_credentials'],
        viewMethods: [],
      }
    );

    await (wifiContract as any).update_wifi_credentials({ ssid, password });
    console.log('WiFi credentials updated');
  };

  const handleRequestAccess = async () => {
    const { data } = await requestAccess({ variables: { accountId: accountId || '' } });
    if (data.requestAccess.success) {
      console.log('Access requested successfully');
      alert('Access requested successfully');
    } else {
      console.log('Failed to request access:', data.requestAccess.message);
      alert('Failed to request access:', data.requestAccess.message);
    }
  };

  return (
    <div className={styles.settings}>
      <h1>Wi-Fi Settings</h1>
      {data?.wifiCredentials ? (
        <div className={styles.wifiDetails}>
          <p><strong>SSID:</strong> {data.wifiCredentials.ssid}</p>
          <p><strong>Password:</strong> {data.wifiCredentials.password}</p>
        </div>
      ) : (
        <div>
          <p>You do not have access to the Wi-Fi credentials.</p>
          <button onClick={handleRequestAccess}>Request Access</button>
        </div>
      )}

      <div className={styles.formGroup}>
        <label>SSID:</label>
        <input
          type="text"
          value={ssid}
          onChange={(e) => setSsid(e.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default Settings;