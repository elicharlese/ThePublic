// apps/thepublic/src/app/frontend/content/Utils/TopBar/TopBar.tsx

import React from 'react';
import { useRemoteHub } from '../../../context/RemoteHubContext';
import styles from './TopBar.module.scss';

const TopBar: React.FC = () => {
  const { connect, disconnect } = useRemoteHub();
  const connectionInfo = "Wi-Fi Connected: myNetwork";
  const networkTraffic = ["Traffic Entry 1", "Traffic Entry 2", "Traffic Entry 3"];
  const socialNetworkUpdates = "Community updates and interactions...";
  const statisticsInfo = "Statistics information...";

  const handleConnect = () => {
    const hubUrl = prompt("Enter the remote hub URL");
    if (hubUrl) {
      connect(hubUrl);
    }
  };

  const handleDisconnect = () => {
    const hubUrl = prompt("Enter the remote hub URL to disconnect");
    if (hubUrl) {
      disconnect(hubUrl);
    }
  };

  return (
    <div className={styles['top-bar']}>
      <div className={styles['control-buttons']}>
        <button onClick={handleConnect}>Connect to Hub</button>
        <button onClick={handleDisconnect}>Disconnect from Hub</button>
      </div>
      <div className={styles['info-bar']}>
        <div className={styles['section']}>
          <div className={styles['section-title']}>Connection Info</div>
          <div>{connectionInfo}</div>
        </div>
        <div className={styles['section']}>
          <div className={styles['section-title']}>Network Traffic Output Log</div>
          <div className={styles['log-wrapper']}>
            {networkTraffic.map((entry, index) => (
              <div key={index} className={styles['log-entry']}>{entry}</div>
            ))}
          </div>
        </div>
        <div className={styles['section']}>
          <div className={styles['section-title']}>Community Social Network</div>
          <div>{socialNetworkUpdates}</div>
        </div>
        <div className={styles['section']}>
          <div className={styles['section-title']}>Statistics</div>
          <div>{statisticsInfo}</div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;