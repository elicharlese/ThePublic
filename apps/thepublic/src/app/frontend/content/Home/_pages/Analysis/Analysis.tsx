import React, { useEffect, useState } from 'react';
import { getUserStatistics, getNetworkData } from './analyticsService'; // Assuming these services exist
import styles from './analysis.module.scss'; // Ensure there's a corresponding SCSS module

interface StatisticsData {
  totalVisits: number;
  totalPurchases: number;
  lastLogin: string;
}

interface NetworkData {
  current: string[];
  saved: string[];
  shared: string[];
}

const Analysis: React.FC = () => {
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const stats = await getUserStatistics();
        const networks = await getNetworkData();
        setStatistics(stats);
        setNetworkData(networks);
      } catch (error) {
        setError('Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.analysisContainer}>
      <h1>User Analytics</h1>
      <div className={styles.section}>
        <h2>Statistics</h2>
        {statistics ? (
          <>
            <div><strong>Total Visits:</strong> {statistics.totalVisits}</div>
            <div><strong>Total Purchases:</strong> {statistics.totalPurchases}</div>
            <div><strong>Last Login:</strong> {new Date(statistics.lastLogin).toLocaleString()}</div>
          </>
        ) : (
          <div>No statistics available.</div>
        )}
      </div>
      <div className={styles.section}>
        <h2>Network Data</h2>
        {networkData ? (
          <>
            <div>
              <h3>Current Networks</h3>
              <ul>
                {networkData.current.map((network, idx) => (
                  <li key={`current-${idx}`}>{network}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Saved Networks</h3>
              <ul>
                {networkData.saved.map((network, idx) => (
                  <li key={`saved-${idx}`}>{network}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Shared Networks</h3>
              <ul>
                {networkData.shared.map((network, idx) => (
                  <li key={`shared-${idx}`}>{network}</li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div>No network data available.</div>
        )}
      </div>
    </div>
  );
};

export default Analysis;