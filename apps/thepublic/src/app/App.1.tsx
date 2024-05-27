import React from 'react';
import TopBar from './Utils/TopBar/TopBar';
import NetworkTrafficLog from './content/Network/NetworkTrafficLog';
import CommunitySocialNetwork from './content/CommunitySocialNetwork';
import MapComponent from './content/MapComponent';
import StatisticsComponent from './content/StatisticsComponent';
import NetworkCustomization from './components/NetworkCustomization';
import styles from './App.module.scss';

const App: React.FC = () => {
  return (
    <div className={styles.app}>
      <TopBar />
      <div className={styles.content}>
        <NetworkTrafficLog />
        <CommunitySocialNetwork />
        <MapComponent />
        <StatisticsComponent />
        <NetworkCustomization />
      </div>
    </div>
  );
};

export default App;