import React from 'react';
import TopBar from './TopBar'; // Ensure to adjust the path as per your directory
import OutputLog from './Utils/OutputLog/OutputLog'; // Adjust the path accordingly
import BottomBar from './BottomBar'; // Adjust the path accordingly
import styles from './MainLayout.module.scss';

const MainLayout: React.FC = () => {
  return (
    <div className={styles['main-layout']}>
      <TopBar />
      <div className={styles['content']}>
        <OutputLog />
      </div>
      <BottomBar />
    </div>
  );
};

export default MainLayout;