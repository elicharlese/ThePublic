import React from 'react';
import styles from './BottomBar.module.scss';
import OutputLog from '../Utils/OutputLog/OutputLog'; // Adjust the import path accordingly

const BottomBar: React.FC = () => {
  const connectionInfo = "Wi-Fi Connected: myNetwork";
  const networkTraffic = [
    "Traffic Entry 1",
    "Traffic Entry 2",
    "Traffic Entry 3"
  ];

  return (
    <div className={styles['bottom-bar']}>
      {/* Connection Info */}
      <div className={styles.section}>
        <div className={styles['section-title']}>Connection Info</div>
        <div className={styles.info}>{connectionInfo}</div>
      </div>

      {/* Network Traffic Log */}
      <div className={styles.section}>
        <div className={styles['section-title']}>Network Traffic Output Log</div>
        <div className={styles['network-traffic-log']}>
          {networkTraffic.map((entry, index) => (
            <div key={index}>{entry}</div>
          ))}
        </div>
      </div>

      {/* Community Social Network */}
      <div className={styles.section}>
        <div className={styles['section-title']}>Community Social Network</div>
        <div className={styles['social-network']}>
          <p>Community updates and interactions...</p>
        </div>
      </div>

      {/* Statistics */}
      <div className={styles.section}>
        <div className={styles['section-title']}>Statistics</div>
        <div className={styles.statistics}>
          <p>Statistics information...</p>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;