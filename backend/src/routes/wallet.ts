import { Router } from 'express';
import { WalletController } from '@/controllers/walletController';

const router = Router();

// Wallet routes (all require authentication)
router.get('/balance', WalletController.getBalance);
router.get('/info', WalletController.getWalletInfo);
router.get('/transactions', WalletController.getTransactions);
router.get('/transactions/:signature', WalletController.getTransactionStatus);
router.get('/rewards', WalletController.getUserRewards);
router.post('/send', WalletController.sendTransaction);

export { router as walletRoutes };
