import React, { useState } from 'react';
import styles from './settingsbasic.module.scss';

const SettingsBasic: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleUpdateProfile = (event: React.FormEvent) => {
    event.preventDefault();
    // Add your API call logic here
    setMessage('Profile updated successfully');
  };

  const handleChangePassword = (event: React.FormEvent) => {
    event.preventDefault();
    // Add your API call logic here
    setMessage('Password changed successfully');
  };

  return (
    <div className={styles.settingsBasicContainer}>
      <h1>Basic Settings</h1>
      {message && <div className={styles.message}>{message}</div>}
      <form onSubmit={handleUpdateProfile} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="userName">User Name:</label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.updateButton}>
          Update Profile
        </button>
      </form>

      <hr className={styles.separator} />

      <form onSubmit={handleChangePassword} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="currentPassword">Current Password:</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.updateButton}>
          Change Password
        </button>
      </form>
    </div>
  );
};

export default SettingsBasic;