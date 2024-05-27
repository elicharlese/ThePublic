import React, { useState } from 'react';
import styles from './network.module.scss';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_AVAILABLE_NETWORKS = gql`
  query AvailableNetworks {
    availableNetworks {
      ssid
    }
  }
`;

const CONNECT_TO_NETWORK = gql`
  mutation ConnectToNetwork($ssid: String!, $password: String!) {
    connectToNetwork(ssid: $ssid, password: $password) {
      success
      message
    }
  }
`;

const Network: React.FC = () => {
  const { data } = useQuery(GET_AVAILABLE_NETWORKS);
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [connectToNetwork] = useMutation(CONNECT_TO_NETWORK);

  const handleConnect = async () => {
    const { data } = await connectToNetwork({ variables: { ssid, password } });
    if (data.connectToNetwork.success) {
      alert('Connected successfully');
    } else {
      alert('Failed to connect: ' + data.connectToNetwork.message);
    }
  };

  return (
    <div className={styles.network}>
      <h1>Network Settings</h1>
      <div className={styles.formGroup}>
        <label>SSID:</label>
        <select value={ssid} onChange={(e) => setSsid(e.target.value)}>
          <option value="">Select Network</option>
          {data?.availableNetworks.map((network: any) => (
            <option key={network.ssid} value={network.ssid}>
              {network.ssid}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.formGroup}>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleConnect}>Connect</button>
    </div>
  );
};

export default Network;