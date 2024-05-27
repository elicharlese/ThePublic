import React from 'react';
import styles from './OutputLog.module.scss';

const OutputLog: React.FC = () => {
  const networks = ["Network 1", "Network 2", "Network 3", "Network 4", "Network 5"];

  return (
    <div className={styles['output-log']}>
      <div className={styles['map-container']}>
        <h2>Map showing networks on ThePublic</h2>
      </div>
      <div className={styles['network-list']}>
        <h2>Network Lists</h2>
        <ul>
          {networks.map((network, index) => (
            <li key={index}>{network}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OutputLog;