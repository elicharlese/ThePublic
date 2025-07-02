import { logger } from '@/utils/logger';
import { supabase } from '@/services/supabase';
import { getRealtimeService } from '@/services/realtime';

interface NotificationPayload {
  userId: string;
  type: 'reward' | 'node_status' | 'maintenance' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

interface EmailNotification {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class NotificationService {
  private realtimeService = getRealtimeService();

  // Send real-time notification
  async sendRealtimeNotification(payload: NotificationPayload): Promise<void> {
    try {
      // Store notification in database
      const { data: notification, error } = await supabase
        .from('notifications')
        .insert({
          user_id: payload.userId,
          type: payload.type,
          title: payload.title,
          message: payload.message,
          data: payload.data || {},
          priority: payload.priority,
          read: false,
        })
        .select()
        .single();

      if (error) {
        logger.error('Failed to store notification', { error, payload });
        return;
      }

      // Send real-time notification to user
      await this.realtimeService.notifyUserReward(payload.userId, {
        id: notification.id,
        type: payload.type,
        title: payload.title,
        message: payload.message,
        data: payload.data,
        priority: payload.priority,
        timestamp: notification.created_at,
      });

      logger.info('Real-time notification sent', { 
        userId: payload.userId, 
        type: payload.type,
        notificationId: notification.id
      });
    } catch (error) {
      logger.error('Failed to send real-time notification', { error, payload });
    }
  }

  // Send email notification (placeholder - would integrate with email service)
  async sendEmailNotification(notification: EmailNotification): Promise<void> {
    try {
      // In production, integrate with services like:
      // - SendGrid
      // - AWS SES
      // - Resend
      // - Postmark

      logger.info('Email notification would be sent', {
        to: notification.to,
        subject: notification.subject,
        // Don't log full content for privacy
      });

      // Store email log
      await supabase
        .from('email_logs')
        .insert({
          recipient: notification.to,
          subject: notification.subject,
          status: 'sent', // In real implementation, this would be based on email service response
          sent_at: new Date().toISOString(),
        });

    } catch (error) {
      logger.error('Failed to send email notification', { error, notification });
    }
  }

  // Reward distribution notification
  async notifyRewardDistribution(
    userId: string,
    nodeId: string,
    amount: number,
    rewardType: string
  ): Promise<void> {
    await this.sendRealtimeNotification({
      userId,
      type: 'reward',
      title: '🎉 Reward Received!',
      message: `You've earned ${amount} tokens from your ${nodeId} node for ${rewardType}.`,
      data: {
        nodeId,
        amount,
        rewardType,
      },
      priority: 'normal',
    });

    // Send email if user has email notifications enabled
    const { data: user } = await supabase
      .from('users')
      .select('email, profile')
      .eq('id', userId)
      .single();

    if (user?.email && user?.profile?.email_notifications !== false) {
      await this.sendEmailNotification({
        to: user.email,
        subject: 'ThePublic - Reward Received',
        html: this.generateRewardEmailHTML(amount, nodeId, rewardType),
        text: `You've earned ${amount} tokens from your ${nodeId} node for ${rewardType}.`,
      });
    }
  }

  // Node status change notification
  async notifyNodeStatusChange(
    userId: string,
    nodeId: string,
    nodeName: string,
    oldStatus: string,
    newStatus: string
  ): Promise<void> {
    const statusEmoji = {
      active: '🟢',
      inactive: '🔴',
      maintenance: '🟡',
      suspended: '⚠️',
    };

    await this.sendRealtimeNotification({
      userId,
      type: 'node_status',
      title: `${statusEmoji[newStatus as keyof typeof statusEmoji]} Node Status Changed`,
      message: `Your node "${nodeName}" status changed from ${oldStatus} to ${newStatus}.`,
      data: {
        nodeId,
        nodeName,
        oldStatus,
        newStatus,
      },
      priority: newStatus === 'suspended' ? 'high' : 'normal',
    });
  }

  // System maintenance notification
  async notifyMaintenance(
    title: string,
    message: string,
    scheduledTime?: string,
    duration?: string
  ): Promise<void> {
    // Get all users who want maintenance notifications
    const { data: users } = await supabase
      .from('users')
      .select('id')
      .neq('profile->maintenance_notifications', false);

    const notifications = users?.map(user => ({
      userId: user.id,
      type: 'maintenance' as const,
      title,
      message: scheduledTime 
        ? `${message} Scheduled for: ${scheduledTime}${duration ? ` (Duration: ${duration})` : ''}`
        : message,
      data: {
        scheduledTime,
        duration,
      },
      priority: 'high' as const,
    })) || [];

    // Send notifications in batches to avoid overwhelming the system
    const batchSize = 100;
    for (let i = 0; i < notifications.length; i += batchSize) {
      const batch = notifications.slice(i, i + batchSize);
      await Promise.all(
        batch.map(notification => this.sendRealtimeNotification(notification))
      );
    }

    logger.info('Maintenance notifications sent', { 
      userCount: notifications.length 
    });
  }

  // System alert notification
  async notifySystemAlert(
    title: string,
    message: string,
    severity: 'info' | 'warning' | 'error' | 'critical'
  ): Promise<void> {
    // Get admin users for system alerts
    const { data: admins } = await supabase
      .from('users')
      .select('id, email')
      .eq('role', 'admin');

    const priority = severity === 'critical' ? 'urgent' : 
                    severity === 'error' ? 'high' : 'normal';

    const notifications = admins?.map(admin => ({
      userId: admin.id,
      type: 'system' as const,
      title: `🚨 System Alert - ${severity.toUpperCase()}`,
      message: `${title}: ${message}`,
      data: {
        severity,
        originalTitle: title,
      },
      priority,
    })) || [];

    await Promise.all(
      notifications.map(notification => this.sendRealtimeNotification(notification))
    );

    // Send emails for critical alerts
    if (severity === 'critical' && admins) {
      await Promise.all(
        admins
          .filter(admin => admin.email)
          .map(admin => 
            this.sendEmailNotification({
              to: admin.email,
              subject: `CRITICAL: ThePublic System Alert - ${title}`,
              html: this.generateSystemAlertEmailHTML(title, message, severity),
              text: `CRITICAL SYSTEM ALERT: ${title}\n\n${message}`,
            })
          )
      );
    }

    logger.info('System alert notifications sent', { 
      adminCount: notifications.length,
      severity 
    });
  }

  // Get user notifications
  async getUserNotifications(
    userId: string,
    limit: number = 50,
    offset: number = 0,
    unreadOnly: boolean = false
  ): Promise<any> {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (unreadOnly) {
      query = query.eq('read', false);
    }

    return await query;
  }

  // Mark notification as read
  async markNotificationRead(userId: string, notificationId: string): Promise<void> {
    await supabase
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId)
      .eq('user_id', userId);
  }

  // Mark all notifications as read for user
  async markAllNotificationsRead(userId: string): Promise<void> {
    await supabase
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('read', false);
  }

  // HTML email templates
  private generateRewardEmailHTML(amount: number, nodeId: string, rewardType: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reward Received - ThePublic</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🎉 Reward Received!</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; margin-top: 0;">Congratulations!</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #555;">
              You've earned <strong>${amount} tokens</strong> from your node <strong>${nodeId}</strong> 
              for <strong>${rewardType}</strong> performance.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Reward Details</h3>
              <ul style="list-style: none; padding: 0;">
                <li style="padding: 5px 0; border-bottom: 1px solid #eee;"><strong>Amount:</strong> ${amount} tokens</li>
                <li style="padding: 5px 0; border-bottom: 1px solid #eee;"><strong>Node ID:</strong> ${nodeId}</li>
                <li style="padding: 5px 0;"><strong>Reward Type:</strong> ${rewardType}</li>
              </ul>
            </div>
            
            <p style="font-size: 14px; color: #666;">
              Thank you for contributing to the ThePublic network! Keep up the great work.
            </p>
          </div>
        </body>
      </html>
    `;
  }

  private generateSystemAlertEmailHTML(title: string, message: string, severity: string): string {
    const severityColors = {
      info: '#17a2b8',
      warning: '#ffc107',
      error: '#dc3545',
      critical: '#dc3545',
    };

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>System Alert - ThePublic</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: ${severityColors[severity as keyof typeof severityColors]}; color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🚨 System Alert</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px; font-weight: bold; text-transform: uppercase;">${severity}</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; margin-top: 0;">${title}</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #555;">
              ${message}
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Alert Information</h3>
              <ul style="list-style: none; padding: 0;">
                <li style="padding: 5px 0; border-bottom: 1px solid #eee;"><strong>Severity:</strong> ${severity.toUpperCase()}</li>
                <li style="padding: 5px 0; border-bottom: 1px solid #eee;"><strong>Time:</strong> ${new Date().toISOString()}</li>
                <li style="padding: 5px 0;"><strong>System:</strong> ThePublic Backend</li>
              </ul>
            </div>
            
            <p style="font-size: 14px; color: #666;">
              Please investigate and take appropriate action if necessary.
            </p>
          </div>
        </body>
      </html>
    `;
  }
}

// Singleton instance
let notificationService: NotificationService | null = null;

export function getNotificationService(): NotificationService {
  if (!notificationService) {
    notificationService = new NotificationService();
  }
  return notificationService;
}
