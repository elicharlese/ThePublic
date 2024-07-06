import React from 'react';
import { Link, Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import CommunitySocialNetwork from './CommunitySocialNetwork';
import PersonalSocialNetwork from './PersonalSocialNetwork';
import styles from './social.module.scss';

const Social: React.FC = () => {
  return (
    <Router>
      <div className={styles.socialContainer}>
        <nav className={styles.nav}>
          <ul>
            <li>
              <Link to="/community">Community Social Network</Link>
            </li>
            <li>
              <Link to="/personal">Personal Social Network</Link>
            </li>
          </ul>
        </nav>
        <div className={styles.content}>
          <Routes>
            <Route path="/community" element={<CommunitySocialNetwork />} />
            <Route path="/personal" element={<PersonalSocialNetwork />} />
            <Route path="/" element={<CommunitySocialNetwork />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default Social;
