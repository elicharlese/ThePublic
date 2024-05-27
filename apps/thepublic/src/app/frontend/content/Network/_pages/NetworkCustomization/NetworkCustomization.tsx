import React, { useState } from 'react';
import NetworkList from './NetworkList';
import NetworkForm from './NetworkForm';
import styles from './styles/NetworkCustomization.module.scss';

interface WiFiNetwork {
  ssid: string;
  password: string;
}

const NetworkCustomization: React.FC = () => {
  const [networks, setNetworks] = useState<WiFiNetwork[]>([
    { ssid: 'Network1', password: 'password1' }
  ]);

  const addNetwork = (network: WiFiNetwork) => {
    setNetworks([...networks, network]);
  };

  const removeNetwork = (ssid: string) => {
    setNetworks(networks.filter(network => network.ssid !== ssid));
  };

  return (
    <div className={styles.networkCustomization}>
      <h1>Network Customization</h1>
      <NetworkForm addNetwork={addNetwork} />
      <NetworkList networks={networks} removeNetwork={removeNetwork} />
    </div>
  );
};

export default NetworkCustomization;