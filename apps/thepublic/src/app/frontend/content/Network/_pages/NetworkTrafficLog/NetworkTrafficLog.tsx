import React from 'react';
import styles from './NetworkTrafficLog.module.scss';

const NetworkTrafficLog: React.FC = () => {
  const logEntries = [
    "Traffic Entry 1",
    "Traffic Entry 2",
    "Traffic Entry 3"
  ];

  return (
    <div className={styles['output-log']}>
      {logEntries.map((entry, index) => (
        <div key={index}>{entry}</div>
      ))}
    </div>
  );
};

export default NetworkTrafficLog;