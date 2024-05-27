import React from 'react';
import styles from './styles/NetworkList.module.scss';

interface WiFiNetwork {
  ssid: string;
  password: string;
}

interface NetworkListProps {
  networks: WiFiNetwork[];
  removeNetwork: (ssid: string) => void;
}

const NetworkList: React.FC<NetworkListProps> = ({ networks, removeNetwork }) => (
  <div className={styles.networkList}>
    <h2>Available Networks</h2>
    <ul>
      {networks.map(network => (
        <li key={network.ssid}>
          {network.ssid}
          <button onClick={() => removeNetwork(network.ssid)}>Delete</button>
        </li>
      ))}
    </ul>
  </div>
);

export default NetworkList;