import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthProvider from './AuthContext'; // Ensure to import your AuthProvider
import Dashboard from './Dashboard';
import Auth from './Auth';
import Purchases from './Purchases';
import Statistics from './Statistics';
import Map from './Map';
import styles from './App.module.scss'; // Assuming you may have an app-level style

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className={styles.appContainer}>
          <Routes>
            <Route path="/home" element={<Dashboard />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/map" element={<Map />} />
            <Route path="/" element={<Dashboard />} /> {/* Default route */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;