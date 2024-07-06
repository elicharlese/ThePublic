import React, { useState } from 'react';
import { remoteHubService } from '../../services/RemoteHubService'; // Ensure this service is properly defined
import styles from './advancedsettings.module.scss';

const AdvancedSettings: React.FC = () => {
  const [networkTimeout, setNetworkTimeout] = useState<number>(0);
  const [maxTransactionFee, setMaxTransactionFee] = useState<number>(0);
  const [customNode, setCustomNode] = useState<string>('');
  const [isNodeAllowed, setIsNodeAllowed] = useState<boolean>(false);
  const [account, setAccount] = useState<string | null>(null);  // Assuming account information is required

  const handleUpdateNetworkSettings = async () => {
    if (!account) {
      alert('Please enter your account address');
      return;
    }
    await remoteHubService.updateNetworkSettings(networkTimeout, maxTransactionFee, account);
    alert('Network settings updated');
  };

  const handleSetCustomNode = async () => {
    if (!account) {
      alert('Please enter your account address');
      return;
    }
    await remoteHubService.setCustomNode(customNode, isNodeAllowed, account);
    alert('Custom node settings updated');
  };

  return (
    <div className={styles.advancedSettingsContainer}>
      <h1>Advanced Network Settings</h1>
      <div className={styles.formGroup}>
        <label htmlFor="account">Account Address:</label>
        <input
          type="text"
          id="account"
          value={account || ''}
          onChange={(e) => setAccount(e.target.value)}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="networkTimeout">Network Timeout (ms):</label>
        <input
          type="number"
          id="networkTimeout"
          value={networkTimeout}
          onChange={(e) => setNetworkTimeout(parseInt(e.target.value))}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="maxTransactionFee">Max Transaction Fee:</label>
        <input
          type="number"
          id="maxTransactionFee"
          value={maxTransactionFee}
          onChange={(e) => setMaxTransactionFee(parseInt(e.target.value))}
        />
      </div>
      <button onClick={handleUpdateNetworkSettings} className={styles.updateButton}>
        Update Network Settings
      </button>
      <div className={styles.formGroup}>
        <label htmlFor="customNode">Custom Node URL:</label>
        <input
          type="text"
          id="customNode"
          value={customNode}
          onChange={(e) => setCustomNode(e.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="allowNode">Allow Node:</label>
        <input
          type="checkbox"
          id="allowNode"
          checked={isNodeAllowed}
          onChange={(e) => setIsNodeAllowed(e.target.checked)}
        />
      </div>
      <button onClick={handleSetCustomNode} className={styles.updateButton}>
        Set Custom Node
      </button>
    </div>
  );
};

export default AdvancedSettings;