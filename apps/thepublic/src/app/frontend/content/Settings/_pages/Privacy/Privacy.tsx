import React, { useState } from 'react';
import styles from './privacy.module.scss';

const Privacy: React.FC = () => {
  const [shareProfile, setShareProfile] = useState<boolean>(false);
  const [showOnlineStatus, setShowOnlineStatus] = useState<boolean>(false);
  const [allowFriendRequests, setAllowFriendRequests] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);

  const handleSavePrivacySettings = (event: React.FormEvent) => {
    event.preventDefault();
    // Add your API call logic here to save privacy settings
    setMessage('Privacy settings saved successfully');
  };

  return (
    <div className={styles.privacyContainer}>
      <h1>Privacy Settings</h1>
      {message && <div className={styles.message}>{message}</div>}
      <form onSubmit={handleSavePrivacySettings} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="shareProfile">Share Profile:</label>
          <input
            type="checkbox"
            id="shareProfile"
            checked={shareProfile}
            onChange={(e) => setShareProfile(e.target.checked)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="showOnlineStatus">Show Online Status:</label>
          <input
            type="checkbox"
            id="showOnlineStatus"
            checked={showOnlineStatus}
            onChange={(e) => setShowOnlineStatus(e.target.checked)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="allowFriendRequests">Allow Friend Requests:</label>
          <input
            type="checkbox"
            id="allowFriendRequests"
            checked={allowFriendRequests}
            onChange={(e) => setAllowFriendRequests(e.target.checked)}
          />
        </div>
        <button type="submit" className={styles.saveButton}>
          Save Privacy Settings
        </button>
      </form>
    </div>
  );
};

export default Privacy;