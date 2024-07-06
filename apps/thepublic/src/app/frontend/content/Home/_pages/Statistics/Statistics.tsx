import React, { useEffect, useState } from 'react';
import { getUserStatistics } from './statisticsService'; // Ensure the correct import path
import { useAuth } from './AuthContext'; // Assuming you're using AuthContext to get the authenticated account
import styles from './Statistics.module.scss';

interface StatisticsData {
  totalVisits: number;
  totalPurchases: number;
  lastLogin: string;
}

const Statistics: React.FC = () => {
  const { account, isAuthenticated } = useAuth(); // Assuming account and isAuthenticated are provided by AuthContext
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const statsData = await getUserStatistics(account);
        setStatistics(statsData);
      } catch (error) {
        setError('Failed to fetch statistics');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && account) {
      fetchStatistics();
    }
  }, [account, isAuthenticated]);

  if (loading) {
    return <div>Loading statistics...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!statistics) {
    return <div>No statistics available.</div>;
  }

  return (
    <div className={styles.statisticsContainer}>
      <h1>My Statistics</h1>
      <div className={styles.statItem}>
        <strong>Total Visits:</strong> {statistics.totalVisits}
      </div>
      <div className={styles.statItem}>
        <strong>Total Purchases:</strong> {statistics.totalPurchases}
      </div>
      <div className={styles.statItem}>
        <strong>Last Login:</strong> {new Date(statistics.lastLogin).toLocaleString()}
      </div>
    </div>
  );
};

export default Statistics;