import React, { useEffect, useState } from 'react';
import { getPurchasesByAccount } from './purchasesService'; // Ensure the correct import path
import { useAuth } from './AuthContext'; // Assuming you're using AuthContext to get the authenticated account
import styles from './Purchases.module.scss';

interface Purchase {
  id: string;
  item: string;
  amount: number;
  date: string;
}

const Purchases: React.FC = () => {
  const { account, isAuthenticated } = useAuth(); // Assuming account and isAuthenticated are provided by AuthContext
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setLoading(true);
        const purchaseData = await getPurchasesByAccount(account);
        setPurchases(purchaseData);
      } catch (error) {
        setError('Failed to fetch purchases');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && account) {
      fetchPurchases();
    }
  }, [account, isAuthenticated]);

  if (loading) {
    return <div>Loading purchases...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.purchasesContainer}>
      <h1>My Purchases</h1>
      {purchases.length === 0 ? (
        <div>No purchases found.</div>
      ) : (
        <ul>
          {purchases.map((purchase) => (
            <li key={purchase.id} className={styles.purchaseItem}>
              <div><strong>Item:</strong> {purchase.item}</div>
              <div><strong>Amount:</strong> ${purchase.amount}</div>
              <div><strong>Date:</strong> {new Date(purchase.date).toLocaleDateString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Purchases;