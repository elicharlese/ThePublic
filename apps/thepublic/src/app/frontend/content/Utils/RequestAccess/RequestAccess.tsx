import React, { useState } from 'react';
import { connect, Contract, keyStores, WalletConnection } from 'near-api-js';
import styles from './requestaccess.module.scss';

const RequestAccess: React.FC = () => {
  const [authorized, setAuthorized] = useState(false);
  const [wifiCredentials, setWifiCredentials] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const nearConfig = {
    networkId: "testnet",
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const near = await connect(nearConfig);
        const wallet = new WalletConnection(near);
        const accountId = wallet.getAccountId();
        setAccountId(accountId);

        const wifiContract = new Contract(
          wallet.account(),
          "wifi_sharing_contract.testnet", // replace with your contract address
          {
            changeMethods: ['request_access'],
            viewMethods: ['get_wifi_credentials'],
          }
        );

        const credentials = await (wifiContract as any).get_wifi_credentials({ account_id: accountId });
        
        setWifiCredentials(credentials);

        if (credentials) {
          setAuthorized(true);
        }
      } catch (err) {
        setError('Failed to connect to NEAR. Please try again later.');
      }
    };

    initialize();
  }, []);

  const requestAccess = async () => {
    try {
      const near = await connect(nearConfig);
      const wallet = new WalletConnection(near);
      const wifiContract = new Contract(
        wallet.account(),
        "wifi_sharing_contract.testnet", // replace with your contract address
        {
          changeMethods: ['request_access'],
          viewMethods: ['get_wifi_credentials'],
        }
      );

      await (wifiContract as any).request_access({ account_id: accountId });
      setError(null);
      console.log('Access requested');
    } catch (err) {
      setError('Failed to request access. Please try again later.');
    }
  };

  return (
    <div className={styles.requestAccessContainer}>
      <h1>Wi-Fi Sharing</h1>
      {authorized ? (
        <div className={styles.credentials}>
          <p>Your Wi-Fi credentials: {wifiCredentials}</p>
        </div>
      ) : (
        <div className={styles.notAuthorized}>
          <p>You are not authorized to view Wi-Fi credentials.</p>
          {error && <div className={styles.error}>{error}</div>}
          <button onClick={requestAccess} className={styles.requestButton}>Request Access</button>
        </div>
      )}
    </div>
  );
};

export default RequestAccess;