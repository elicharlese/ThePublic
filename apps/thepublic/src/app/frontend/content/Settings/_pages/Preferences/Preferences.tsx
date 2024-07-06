import React, { useState } from 'react';
import styles from './preferences.module.scss';

const Preferences: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('en');
  const [message, setMessage] = useState<string | null>(null);

  const handleSavePreferences = (event: React.FormEvent) => {
    event.preventDefault();
    // Add your API call logic here to save preferences
    setMessage('Preferences saved successfully');
  };

  return (
    <div className={styles.preferencesContainer}>
      <h1>Preferences</h1>
      {message && <div className={styles.message}>{message}</div>}
      <form onSubmit={handleSavePreferences} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="darkMode">Dark Mode:</label>
          <input
            type="checkbox"
            id="darkMode"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="notifications">Notifications:</label>
          <input
            type="checkbox"
            id="notifications"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="language">Language:</label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
        <button type="submit" className={styles.saveButton}>
          Save Preferences
        </button>
      </form>
    </div>
  );
};

export default Preferences;