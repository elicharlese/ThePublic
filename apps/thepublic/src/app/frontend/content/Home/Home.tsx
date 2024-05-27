import React, { useEffect, useState } from 'react';
import { connect, Contract, keyStores, WalletConnection } from 'near-api-js';
import './global.css';

const Home: React.FC = () => {
  const [wifiInfo, setWifiInfo] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const near = await connect({
        networkId: "testnet",
        keyStore: new keyStoreore(),
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
      });
      const wallet = new WalletConnection(near);
      const socialContract = new Contract(
        wallet.account(),
        "social_contract.testnet", // replace with your social contract address
        {
          changeMethods: ["share_wifi"],
          viewMethods: ["get_wifi_info"]
        }
      );

      const wifiInfo = await (socialContract as any).get_wifi_info({ account_id: wallet.getAccountId() });
      setWifiInfo(wifiInfo);
    })();
  }, []);

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <p>{wifiInfo ? `Shared Wi-Fi Info: ${wifiInfo}` : 'No Wi-Fi info shared yet.'}</p>
    </div>
  );
};

export default Home;