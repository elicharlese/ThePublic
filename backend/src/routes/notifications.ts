import { Router } from 'express';
import { NotificationController } from '@/controllers/notificationController';
import { requireRole } from '@/middleware/auth';

const router = Router();

// User notification routes (require authentication)
router.get('/', NotificationController.getUserNotifications);
router.put('/:id/read', NotificationController.markNotificationRead);
router.put('/read-all', NotificationController.markAllNotificationsRead);

// Admin notification routes
router.post('/test', requireRole('admin'), NotificationController.sendTestNotification);
router.post('/maintenance', requireRole('admin'), NotificationController.sendMaintenanceNotification);
router.post('/system-alert', requireRole('admin'), NotificationController.sendSystemAlert);

export { router as notificationRoutes };
