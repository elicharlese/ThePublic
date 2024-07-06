import React from 'react';
import { Link } from 'react-router-dom';
import Statistics from './Statistics';
import Purchases from './Purchases';
import Map from './Map';
import styles from './dashboard.module.scss'; // Ensure there's a corresponding SCSS module

const Dashboard: React.FC = () => {
  return (
    <div className={styles.dashboardContainer}>
      <h1>Dashboard</h1>
      <nav className={styles.nav}>
        <ul>
          <li><Link to="/statistics">Statistics</Link></li>
          <li><Link to="/purchases">Purchases</Link></li>
          <li><Link to="/map">Network Map</Link></li>
          <li><Link to="/auth">Authentication</Link></li>
        </ul>
      </nav>
      <div className={styles.sections}>
        <Statistics />
        <Purchases />
        <Map />
      </div>
    </div>
  );
};

export default Dashboard;