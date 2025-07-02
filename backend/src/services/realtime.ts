import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { logger } from '@/utils/logger';
import { EventEmitter } from 'events';

interface NetworkUpdate {
  type: 'node_status' | 'node_performance' | 'reward_distribution' | 'network_stats';
  data: any;
  timestamp: string;
}

export class RealtimeService extends EventEmitter {
  private supabase: SupabaseClient;
  private channels: Map<string, RealtimeChannel> = new Map();
  private isConnected = false;

  constructor() {
    super();
    
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
        realtime: {
          params: {
            eventsPerSecond: 50,
          },
        },
      }
    );

    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      // Set up database change subscriptions
      await this.setupNodeSubscriptions();
      await this.setupRewardSubscriptions();
      await this.setupNetworkStatsSubscriptions();
      
      this.isConnected = true;
      logger.info('Realtime service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize realtime service', { error });
      throw error;
    }
  }

  private async setupNodeSubscriptions(): Promise<void> {
    const nodeChannel = this.supabase
      .channel('node-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'nodes',
        },
        (payload) => {
          this.handleNodeChange(payload);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          logger.info('Node changes subscription active');
        } else if (status === 'CHANNEL_ERROR') {
          logger.error('Error in node changes subscription');
        }
      });

    this.channels.set('nodes', nodeChannel);
  }

  private async setupRewardSubscriptions(): Promise<void> {
    const rewardChannel = this.supabase
      .channel('reward-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rewards',
        },
        (payload) => {
          this.handleRewardChange(payload);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          logger.info('Reward changes subscription active');
        } else if (status === 'CHANNEL_ERROR') {
          logger.error('Error in reward changes subscription');
        }
      });

    this.channels.set('rewards', rewardChannel);
  }

  private async setupNetworkStatsSubscriptions(): Promise<void> {
    const statsChannel = this.supabase
      .channel('network-stats-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'network_stats',
        },
        (payload) => {
          this.handleNetworkStatsChange(payload);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          logger.info('Network stats subscription active');
        } else if (status === 'CHANNEL_ERROR') {
          logger.error('Error in network stats subscription');
        }
      });

    this.channels.set('network-stats', statsChannel);
  }

  private handleNodeChange(payload: any): void {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    logger.info('Node change detected', { 
      eventType, 
      nodeId: newRecord?.node_id || oldRecord?.node_id 
    });

    // Emit different events based on what changed
    if (eventType === 'INSERT') {
      this.emit('node:created', newRecord);
      this.broadcastUpdate({
        type: 'node_status',
        data: {
          action: 'created',
          node: newRecord,
        },
        timestamp: new Date().toISOString(),
      });
    } else if (eventType === 'UPDATE') {
      // Check what specifically changed
      const statusChanged = oldRecord?.status !== newRecord?.status;
      const performanceChanged = JSON.stringify(oldRecord?.performance_metrics) !== 
                                JSON.stringify(newRecord?.performance_metrics);

      if (statusChanged) {
        this.emit('node:status_changed', {
          node: newRecord,
          oldStatus: oldRecord.status,
          newStatus: newRecord.status,
        });

        this.broadcastUpdate({
          type: 'node_status',
          data: {
            action: 'status_changed',
            node: newRecord,
            oldStatus: oldRecord.status,
          },
          timestamp: new Date().toISOString(),
        });
      }

      if (performanceChanged) {
        this.emit('node:performance_updated', {
          node: newRecord,
          metrics: newRecord.performance_metrics,
        });

        this.broadcastUpdate({
          type: 'node_performance',
          data: {
            action: 'performance_updated',
            node: newRecord,
            metrics: newRecord.performance_metrics,
          },
          timestamp: new Date().toISOString(),
        });
      }
    } else if (eventType === 'DELETE') {
      this.emit('node:deleted', oldRecord);
      this.broadcastUpdate({
        type: 'node_status',
        data: {
          action: 'deleted',
          node: oldRecord,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  private handleRewardChange(payload: any): void {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    logger.info('Reward change detected', { 
      eventType, 
      rewardId: newRecord?.id || oldRecord?.id 
    });

    if (eventType === 'INSERT') {
      this.emit('reward:created', newRecord);
      this.broadcastUpdate({
        type: 'reward_distribution',
        data: {
          action: 'reward_created',
          reward: newRecord,
        },
        timestamp: new Date().toISOString(),
      });
    } else if (eventType === 'UPDATE') {
      const statusChanged = oldRecord?.status !== newRecord?.status;

      if (statusChanged && newRecord?.status === 'distributed') {
        this.emit('reward:distributed', {
          reward: newRecord,
          oldStatus: oldRecord.status,
        });

        this.broadcastUpdate({
          type: 'reward_distribution',
          data: {
            action: 'reward_distributed',
            reward: newRecord,
          },
          timestamp: new Date().toISOString(),
        });
      }
    }
  }

  private handleNetworkStatsChange(payload: any): void {
    const { new: newRecord } = payload;
    
    logger.info('Network stats updated', { timestamp: newRecord.timestamp });

    this.emit('network:stats_updated', newRecord);
    this.broadcastUpdate({
      type: 'network_stats',
      data: {
        action: 'stats_updated',
        stats: newRecord,
      },
      timestamp: new Date().toISOString(),
    });
  }

  private broadcastUpdate(update: NetworkUpdate): void {
    // Broadcast to all connected clients through a general updates channel
    const updateChannel = this.channels.get('updates') || this.createUpdateChannel();
    
    updateChannel.send({
      type: 'broadcast',
      event: 'network_update',
      payload: update,
    });
  }

  private createUpdateChannel(): RealtimeChannel {
    const updateChannel = this.supabase
      .channel('general-updates')
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          logger.info('General updates channel active');
        } else if (status === 'CHANNEL_ERROR') {
          logger.error('Error in general updates channel');
        }
      });

    this.channels.set('updates', updateChannel);
    return updateChannel;
  }

  // Public methods for manual broadcasts
  async broadcastNodeUpdate(nodeId: string, update: any): Promise<void> {
    try {
      await this.supabase
        .channel('node-updates')
        .send({
          type: 'broadcast',
          event: 'node_manual_update',
          payload: { nodeId, update, timestamp: new Date().toISOString() },
        });

      logger.info('Manual node update broadcasted', { nodeId });
    } catch (error) {
      logger.error('Failed to broadcast node update', { error, nodeId });
    }
  }

  async broadcastNetworkStats(stats: any): Promise<void> {
    try {
      await this.supabase
        .channel('network-stats')
        .send({
          type: 'broadcast',
          event: 'stats_manual_update',
          payload: { stats, timestamp: new Date().toISOString() },
        });

      logger.info('Manual network stats broadcasted');
    } catch (error) {
      logger.error('Failed to broadcast network stats', { error });
    }
  }

  async notifyUserReward(userId: string, reward: any): Promise<void> {
    try {
      await this.supabase
        .channel(`user-${userId}`)
        .send({
          type: 'broadcast',
          event: 'user_reward',
          payload: { reward, timestamp: new Date().toISOString() },
        });

      logger.info('User reward notification sent', { userId, rewardId: reward.id });
    } catch (error) {
      logger.error('Failed to send user reward notification', { error, userId });
    }
  }

  // Health check
  isHealthy(): boolean {
    return this.isConnected && this.channels.size > 0;
  }

  // Cleanup
  async disconnect(): Promise<void> {
    try {
      for (const [name, channel] of this.channels) {
        await this.supabase.removeChannel(channel);
        logger.info(`Disconnected from channel: ${name}`);
      }
      
      this.channels.clear();
      this.isConnected = false;
      
      logger.info('Realtime service disconnected');
    } catch (error) {
      logger.error('Error disconnecting realtime service', { error });
    }
  }
}

// Singleton instance
let realtimeService: RealtimeService | null = null;

export function getRealtimeService(): RealtimeService {
  if (!realtimeService) {
    realtimeService = new RealtimeService();
  }
  return realtimeService;
}
