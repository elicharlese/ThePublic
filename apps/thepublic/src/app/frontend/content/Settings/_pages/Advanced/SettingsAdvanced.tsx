// apps/thepublic/src/app/frontend/content/AdvancedSettings.tsx

import React, { useState } from 'react';
import { remoteHubService } from '../../services/RemoteHubService';
import styles from './AdvancedSettings.module.scss';

const AdvancedSettings: React.FC = () => {
  const [networkTimeout, setNetworkTimeout] = useState(0);
  const [maxTransactionFee, setMaxTransactionFee] = useState(0);
  const [customNode, setCustomNode] = useState('');
  const [isNodeAllowed, setIsNodeAllowed] = useState(false);

  const handleUpdateNetworkSettings = async () => {
    const account = prompt('Enter your account address');
    if (account) {
      await remoteHubService.updateNetworkSettings(networkTimeout, maxTransactionFee, account);
      alert('Network settings updated');
    }
  };

  const handleSetCustomNode = async () => {
    const account = prompt('Enter your account address');
    if (account) {
      await remoteHubService.setCustomNode(customNode, isNodeAllowed, account);
      alert('Custom node settings updated');
    }
  };

  return (
    <div className={styles.advancedSettings}>
      <h1>Advanced Settings</h1>
      <div>
        <label>Network Timeout:</label>
        <input type="number" value={networkTimeout} onChange={(e) => setNetworkTimeout(parseInt(e.target.value))} />
      </div>
      <div>
        <label>Max Transaction Fee:</label>
        <input type="number" value={maxTransactionFee} onChange={( e) => setMaxTransactionFee(parseInt(e.target.value))} />
      </div>
      <button onClick={handleUpdateNetworkSettings}>Update Network Settings</button>
      <div>
        <label>Custom Node:</label>
        <input type="text" value={customNode} onChange={(e) => setCustomNode(e.target.value)} />
      </div>
      <div>
        <label>Allow Node:</label>
        <input type="checkbox" checked={isNodeAllowed} onChange={(e) => setIsNodeAllowed(e.target.checked)} />
      </div>
      <button onClick={handleSetCustomNode}>Set Custom Node</button>
    </div>
  );
};

export default AdvancedSettings;