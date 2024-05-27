import React from 'react';
import styles from './AccountOverview.module.scss';

const AccountOverview: React.FC = () => {
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinedDate: '2022-01-01'
  };

  return (
    <div className={styles.accountOverview}>
      <h1>Account Overview</h1>
      <div className={styles.details}>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Joined Date:</strong> {user.joinedDate}</p>
      </div>
    </div>
  );
};

export default AccountOverview;