import React, { useEffect, useState } from 'react';
import styles from './outputlog.module.scss';

// Assuming there's a socket connection utility
import { socket } from '../socket'; // Replace with the actual path to your socket instance

interface LogEntry {
  id: number;
  message: string;
  timestamp: string;
}

const OutputLog: React.FC = () => {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);

  useEffect(() => {
    // Fetch initial log entries if needed
    fetchInitialLogEntries();

    // Listen for new log messages from the socket
    socket.on('newLogMessage', (logEntry: LogEntry) => {
      setLogEntries((prevEntries) => [...prevEntries, logEntry]);
    });

    return () => {
      socket.off('newLogMessage');
    };
  }, []);

  const fetchInitialLogEntries = async () => {
    // Mockup fetch function for initial log entries
    const initialEntries = await fetchExampleLogEntries();
    setLogEntries(initialEntries);
  };

  const fetchExampleLogEntries = async () => {
    // Mockup example log entries
    return [
      { id: 1, message: 'Connected to the server.', timestamp: new Date().toISOString() },
      { id: 2, message: 'User joined the chat.', timestamp: new Date().toISOString() },
    ];
  };

  return (
    <div className={styles.outputLogContainer}>
      <h2>Output Log</h2>
      <div className={styles.logEntries}>
        {logEntries.map((entry) => (
          <div key={entry.id} className={styles.logEntry}>
            <div className={styles.timestamp}>{new Date(entry.timestamp).toLocaleTimeString()}</div>
            <div className={styles.message}>{entry.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutputLog;