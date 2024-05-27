import React from 'react';
import styles from './BottomBar.module.scss';

const BottomBar: React.FC = () => {
  const connectionInfo = "Wi-Fi Connected: myNetwork";
  const networkTraffic = ["Traffic Entry 1", "Traffic Entry 2", "Traffic Entry 3"];
  const socialNetworkUpdates = "Community updates and interactions...";
  const statisticsInfo = "Statistics information...";

  return (
    <div className={styles['bottom-bar']}>
      <div className={styles.section}>
        <div className={styles['section-title']}>Connection Info</div>
        <div className={styles.info}>{connectionInfo}</div>
      </div>
      <div className={styles.section}>
        <div className={styles['section-title']}>Network Traffic Output Log</div>
        <div className={styles['network-traffic-log']}>
          {networkTraffic.map((entry, index) => (
            <div key={index}>{entry}</div>
          ))}
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles['section-title']}>Community Social Network</div>
        <div className={styles['social-network']}>
          <p>{socialNetworkUpdates}</p>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles['section-title']}>Statistics</div>
        <div className={styles.statistics}>
          <p>{statisticsInfo}</p>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;