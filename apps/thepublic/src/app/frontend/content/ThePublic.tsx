import React, { useEffect, useState } from 'react';
import { connect, Contract, keyStores, WalletConnection } from 'near-api-js';
import './global.css';

const Home: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const near = await connect({
        networkId: "testnet",
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
      });
      const wallet = new WalletConnection(near);
      const thePublicContract = new Contract(
        wallet.account(),
        "thepublic_contract.testnet", // replace with your thepublic contract address
        {
          changeMethods: [],
          viewMethods: ["get_user_data"]
        }
      );

      const accountId = wallet.getAccountId();
      const userData = await (thePublicContract as any).get_user_data({ account_id: accountId });
      setUserData(userData);
    })();
  }, []);

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <p>{userData ? `User Data: ${JSON.stringify(userData)}` : 'No user data