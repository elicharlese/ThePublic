import React, { useState } from 'react';
import styles from './AccountUpdate.module.scss';

const AccountUpdate: React.FC = () => {
  const [formValues, setFormValues] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com'
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
    // Handle form submission
    console.log('Updated Details:', formValues);
  };

  return (
    <div className={styles.accountUpdate}>
      <h1>Update Account Information</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formValues.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Information</button>
      </form>
    </div>
  );
};

export default AccountUpdate;