import React, { useEffect, useState } from 'react';
import { connect, Contract, keyStores, WalletConnection } from 'near-api-js';

const RequestAccess: React.FC = () => {
  const [authorized, setAuthorized] = useState(false);
  const [wifiCredentials, setWifiCredentials] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const near = await connect({
        networkId: "testnet",
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
      });
      const wallet = new WalletConnection(near);
      const accountId = wallet.getAccountId();
      setAccountId(accountId);

      const wifiContract = new Contract(
        wallet.account(),
        "wifi_sharing_contract.testnet", // replace with your contract address
        {
          changeMethods: ['request_access'],
          viewMethods: ['get_wifi_credentials']
        }
      );

      const credentials = await (wifiContract as any).get_wifi_credentials({ account_id: accountId });
      setWifiCredentials(credentials);

      if (credentials) {
        setAuthorized(true);
      }
    })();
  }, []);

  const requestAccess = async () => {
    const near = await connect({
      networkId: 'testnet',
      keyStore: new keyStores.BrowserLocalStorageKeyStore(),
      nodeUrl: 'https://rpc.testnet.near.org',
      walletUrl: 'https://wallet.testnet.near.org',
    });
    const wallet = new WalletConnection(near);
    const wifiContract = new Contract(
      wallet.account(),
      'wifi_sharing_contract.testnet', // replace with your contract address
      {
        changeMethods: ['request_access'],
        viewMethods: ['get_wifi_credentials'],
      }
    );

    await (wifiContract as any).request_access({ account_id: accountId });
    console.log('Access requested');
  };

  return (
    <div>
      <h1>Wi-Fi Sharing</h1>
      {authorized ? (
        <div>
          <p>Your Wi-Fi credentials: {wifiCredentials}</p>
        </div>
      ) : (
        <div>
          <p>You are not authorized to view Wi-Fi credentials.</p>
          <button onClick={requestAccess}>Request Access</button>
        </div>
      )}
    </div>
  );
};

export default RequestAccess;