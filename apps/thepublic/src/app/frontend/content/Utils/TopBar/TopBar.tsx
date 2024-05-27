import React from 'react';
import styles from './TopBar.module.scss';

const TopBar: React.FC = () => {
  const connectionInfo = "Wi-Fi Connected: myNetwork";
  const networkTraffic = [
    "Traffic Entry 1",
    "Traffic Entry 2",
    "Traffic Entry 3"
  ];

  return (
    <div className={styles['top-bar']}>
      {/* Network Traffic Log */}
      <div className={styles['info-bar']}>
        <div className={styles['section']}>
          <div className={styles['section-title']}>Connection Info</div>
          {connectionInfo}
        </div>
        <div className={styles['section']}>
          <div className={styles['section-title']}>Network Traffic Output Log</div>
          {networkTraffic.map((entry, index) => (
            <div key={index} className={styles['log-entry']}>{entry}</div>
          ))}
        </div>
        <div className={styles['section']}>
          <div className={styles['section-title']}>Community Social Network</div>
          <p>Community updates and interactions...</p>
        </div>
        <div className={styles['section']}>
          <div className={styles['section-title']}>Statistics</div>
          <p>Statistics information...</p>
        </div>
      </div>
    </div>
  );
};

export default TopBar;