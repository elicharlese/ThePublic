import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './quickmenu.module.scss';

const QuickMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.quickMenuContainer}>
      <button onClick={toggleMenu} className={styles.menuButton}>
        {isOpen ? 'Close Menu' : 'Open Menu'}
      </button>
      {isOpen && (
        <div className={styles.menu}>
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/settings">Settings</Link></li>
            <li><Link to="/logout">Logout</Link></li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuickMenu;