import React, { useState, useEffect } from 'react';
import styles from './BottomBar.module.scss';
import { startNmapScan, startWiresharkCapture, fetchAnalyticsData } from './networkServices';
import { userHasPermission, User } from '../../../../contracts/utils/Permissions';

const BottomBar: React.FC = () => {
  const connectionInfo = "Wi-Fi Connected: myNetwork";
  const networkTraffic = ["Traffic Entry 1", "Traffic Entry 2", "Traffic Entry 3"];
  const socialNetworkUpdates = "Community updates and interactions...";
  const [statisticsInfo, setStatisticsInfo] = useState("Loading statistics information...");
  const [log, setLog] = useState<string[]>([]);
  const [scanning, setScanning] = useState(false);

  // Mock current user
  const currentUser: User = {
    roles: ['user'],
    permissions: ['nmap_scan', 'wireshark_capture'],
  };

  // Mock encryption function for secure logging
  const encrypt = (data: string): string => {
    // Placeholder for actual encryption logic
    return btoa(data);
  };

  const secureLog = (entry: string) => {
    const encryptedEntry = encrypt(entry);
    setLog([...log, encryptedEntry]);
  };

  useEffect(() => {
    const getAnalyticsData = async () => {
      try {
        const data = await fetchAnalyticsData();
        setStatisticsInfo(`Statistics information: ${JSON.stringify(data)}`);
      } catch (error) {
        setStatisticsInfo(`Error fetching statistics: ${error.message}`);
      }
    };

    getAnalyticsData();
  }, []);

  const handleNmapClick = async () => {
    if (!userHasPermission(currentUser, 'nmap_scan')) {
      secureLog('Error: Insufficient permissions for this action');
      return;
    }

    setScanning(true);
    try {
      const result = await startNmapScan('scanme.nmap.org'); // Example target
      secureLog(`Nmap scan result:\n${result}`);
    } catch (error) {
      secureLog(`Error: ${error.message}`);
    } finally {
      setScanning(false);
    }
  };

  const handleWiresharkClick = async () => {
    if (!userHasPermission(currentUser, 'wireshark_capture')) {
      secureLog('Error: Insufficient permissions for this action');
      return;
    }

    try {
      const result = await startWiresharkCapture();
      secureLog(result);
    } catch (error) {
      secureLog(`Error: ${error.message}`);
    }
  };

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
      <div className={styles.section}>
        <div className={styles['section-title']}>Tools</div>
        <div className={styles.tools}>
          <button onClick={handleNmapClick} disabled={scanning}>Run Nmap Scan</button>
          <button onClick={handleWiresharkClick}>Start Wireshark Capture</button>
          <div className={styles['log-output']}>
            {log.map((entry, index) => (
              <div key={index}>{entry}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;