import { Router } from 'express';
import { AuthController } from '@/controllers/authController';
import { requireAuth } from '@/middleware/auth';

const router = Router();

// Public auth routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/wallet-login', AuthController.walletLogin);

// Protected auth routes
router.post('/refresh', requireAuth, AuthController.refreshToken);
router.get('/profile', requireAuth, AuthController.getProfile);
router.put('/profile', requireAuth, AuthController.updateProfile);
router.post('/logout', requireAuth, AuthController.logout);

export { router as authRoutes };
