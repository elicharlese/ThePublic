import { Response, NextFunction } from 'express';
import { getNotificationService } from '@/services/notification';
import { AppError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';
import { AuthenticatedRequest } from '@/middleware/auth';

export class NotificationController {
  static async getUserNotifications(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const { limit = 50, offset = 0, unread_only } = req.query;

      if (!userId) {
        throw new AppError('Authentication required', 401);
      }

      const notificationService = getNotificationService();
      const { data: notifications, error, count } = await notificationService.getUserNotifications(
        userId,
        Number(limit),
        Number(offset),
        unread_only === 'true'
      );

      if (error) {
        throw new AppError('Failed to fetch notifications', 500);
      }

      res.json({
        success: true,
        data: {
          notifications,
          pagination: {
            total: count || 0,
            limit: Number(limit),
            offset: Number(offset),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async markNotificationRead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        throw new AppError('Authentication required', 401);
      }

      const notificationService = getNotificationService();
      await notificationService.markNotificationRead(userId, id);

      logger.info('Notification marked as read', { userId, notificationId: id });

      res.json({
        success: true,
        data: {
          message: 'Notification marked as read',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async markAllNotificationsRead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError('Authentication required', 401);
      }

      const notificationService = getNotificationService();
      await notificationService.markAllNotificationsRead(userId);

      logger.info('All notifications marked as read', { userId });

      res.json({
        success: true,
        data: {
          message: 'All notifications marked as read',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async sendTestNotification(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.role;

      if (!userId || userRole !== 'admin') {
        throw new AppError('Admin access required', 403);
      }

      const { type = 'system', title, message, target_user_id } = req.body;
      const targetUserId = target_user_id || userId;

      const notificationService = getNotificationService();

      await notificationService.sendRealtimeNotification({
        userId: targetUserId,
        type,
        title: title || 'Test Notification',
        message: message || 'This is a test notification from ThePublic backend.',
        data: {
          test: true,
          sender: userId,
        },
        priority: 'normal',
      });

      logger.info('Test notification sent', { 
        senderId: userId, 
        targetUserId,
        type 
      });

      res.json({
        success: true,
        data: {
          message: 'Test notification sent successfully',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async sendMaintenanceNotification(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userRole = req.user?.role;

      if (userRole !== 'admin') {
        throw new AppError('Admin access required', 403);
      }

      const { title, message, scheduled_time, duration } = req.body;

      if (!title || !message) {
        throw new AppError('Title and message are required', 400);
      }

      const notificationService = getNotificationService();
      await notificationService.notifyMaintenance(title, message, scheduled_time, duration);

      logger.info('Maintenance notification sent', { 
        title,
        scheduledTime: scheduled_time,
        duration 
      });

      res.json({
        success: true,
        data: {
          message: 'Maintenance notification sent to all users',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async sendSystemAlert(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userRole = req.user?.role;

      if (userRole !== 'admin') {
        throw new AppError('Admin access required', 403);
      }

      const { title, message, severity = 'info' } = req.body;

      if (!title || !message) {
        throw new AppError('Title and message are required', 400);
      }

      const validSeverities = ['info', 'warning', 'error', 'critical'];
      if (!validSeverities.includes(severity)) {
        throw new AppError('Invalid severity level', 400);
      }

      const notificationService = getNotificationService();
      await notificationService.notifySystemAlert(title, message, severity);

      logger.info('System alert sent', { 
        title,
        severity 
      });

      res.json({
        success: true,
        data: {
          message: 'System alert sent to administrators',
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
