import React, { useState } from 'react';
import styles from './ChangePassword.module.scss';

const ChangePassword: React.FC = () => {
  const [formValues, setFormValues] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formValues.newPassword !== formValues.confirmPassword) {
      alert('New password and confirm password do not match');
      return;
    }
    // Handle password change
    console.log('Password changed');
  };

  return (
    <div className={styles.changePassword}>
      <h1>Change Password</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Current Password:</label>
          <input
            type="password"
            name="currentPassword"
            value={formValues.currentPassword}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            name="newPassword"
            value={formValues.newPassword}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Confirm New Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formValues.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;