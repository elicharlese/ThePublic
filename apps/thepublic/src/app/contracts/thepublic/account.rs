import React, { useEffect, useState } from 'react';
import { connect, Contract, keyStores, WalletConnection } from 'near-api-js';
import './global.css';

const Home: React.FC = () => {
  const [accountInfo, setAccountInfo] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const near = await connect({
        networkId: "testnet",
        keyStore: new keyStoreore(),
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
      });
      const wallet = new WalletConnection(near);
      const accountContract = new Contract(
        wallet.account(),
        "account_contract.testnet", // replace with your account contract address
        {
          changeMethods: ["add_or_update_account"],
          viewMethods: ["get_account"]
        }
      );

      const accountInfo = await (accountContract as any).get_account({ account_id: wallet.getAccountId() });
      setAccountInfo(accountInfo);
    })();
  }, []);

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <p>{accountInfo ? `Account Info: ${JSON.stringify(accountInfo)}` : 'No account info available.'}</p>
    </div>
  );
};

export default Home;