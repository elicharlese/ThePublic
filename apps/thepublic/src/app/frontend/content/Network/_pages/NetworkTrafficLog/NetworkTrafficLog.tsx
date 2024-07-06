import React, { useEffect, useState } from 'react';
import styles from './networktrafficlog.module.scss';

const NetworkTrafficLog: React.FC = () => {
  const [logEntries, setLogEntries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogEntries = async () => {
      try {
        setLoading(true);
        // Fetch logs from your API or any other source
        const response = await fetch('https://api.example.com/network-traffic-logs');
        const data = await response.json();
        setLogEntries(data);
      } catch (error) {
        setError('Failed to fetch log entries');
      } finally {
        setLoading(false);
      }
    };

    fetchLogEntries();
  }, []);

  if (loading) {
    return <div>Loading network traffic logs...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styleer}>
      <h1>Network Traffic Log</h1>
      <div className={styles.outputLog}>
        {logEntries.map((entry, index) => (
          <div key={index} className={styles.logEntry}>
            {entry}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetworkTrafficLog;