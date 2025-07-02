import { Request, Response, NextFunction } from 'express';
import { supabase } from '@/services/supabase';
import { getSolanaService } from '@/services/solana';
import { AppError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

export class NetworkController {
  static async getNetworkStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Get stats from database function
      const { data: dbStats, error: dbError } = await supabase
        .rpc('get_current_network_stats');

      if (dbError) {
        logger.error('Failed to get network stats from database', { error: dbError });
        throw new AppError('Failed to get network statistics', 500);
      }

      // Get Solana network stats
      const solanaService = getSolanaService();
      const solanaStats = await solanaService.getNetworkStats();

      // Combine stats
      const stats = {
        ...dbStats,
        blockchain: {
          block_height: solanaStats.blockHeight,
          total_nodes_on_chain: solanaStats.totalNodes,
          active_nodes_on_chain: solanaStats.activeNodes,
        },
        timestamp: new Date().toISOString(),
      };

      // Store current stats
      await supabase
        .from('network_stats')
        .insert({
          total_nodes: stats.total_nodes || 0,
          active_nodes: stats.active_nodes || 0,
          total_users: stats.total_users || 0,
          data_transferred: stats.total_data_gb ? Math.floor(stats.total_data_gb * 1073741824) : 0,
          uptime_percentage: stats.avg_uptime || 0,
        });

      logger.info('Network stats retrieved', { stats });

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getNetworkMap(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { bounds, status } = req.query;

      // Build query for active nodes with location data
      let query = supabase
        .from('nodes')
        .select(`
          id,
          node_id,
          name,
          status,
          location,
          performance_metrics,
          last_heartbeat,
          created_at
        `);

      // Filter by status
      if (status) {
        query = query.eq('status', status);
      } else {
        // Only show active nodes by default for map
        query = query.eq('status', 'active');
      }

      // Filter by geographic bounds if provided
      if (bounds) {
        const boundsObj = JSON.parse(bounds as string);
        // This is a simplified bounds filter - in production, use PostGIS
        query = query
          .gte('location->lat', boundsObj.south)
          .lte('location->lat', boundsObj.north)
          .gte('location->lng', boundsObj.west)
          .lte('location->lng', boundsObj.east);
      }

      const { data: nodes, error } = await query;

      if (error) {
        throw new AppError('Failed to get network map data', 500);
      }

      // Transform nodes for map display
      const mapNodes = nodes?.map(node => ({
        id: node.id,
        nodeId: node.node_id,
        name: node.name,
        status: node.status,
        position: {
          lat: node.location.lat,
          lng: node.location.lng,
        },
        location: {
          city: node.location.city,
          country: node.location.country,
        },
        metrics: {
          uptime: node.performance_metrics?.uptime_percentage || 0,
          users: node.performance_metrics?.users_served || 0,
          dataTransferred: node.performance_metrics?.data_transferred || 0,
          responseTime: node.performance_metrics?.response_time || 0,
        },
        lastSeen: node.last_heartbeat,
        onlineTime: node.created_at,
      })) || [];

      // Get network connections (simplified - in reality this would be complex)
      const connections = await NetworkController.getNetworkConnections(mapNodes);

      res.json({
        success: true,
        data: {
          nodes: mapNodes,
          connections,
          stats: {
            total_nodes: mapNodes.length,
            active_nodes: mapNodes.filter(n => n.status === 'active').length,
            coverage_area: NetworkController.calculateCoverageArea(mapNodes),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getNodeConnections(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { nodeId } = req.params;

      // Get node details
      const { data: node, error: nodeError } = await supabase
        .from('nodes')
        .select('*')
        .eq('node_id', nodeId)
        .single();

      if (nodeError || !node) {
        throw new AppError('Node not found', 404);
      }

      // Find nearby nodes (simplified distance calculation)
      const { data: nearbyNodes, error } = await supabase
        .from('nodes')
        .select('*')
        .eq('status', 'active')
        .neq('node_id', nodeId);

      if (error) {
        throw new AppError('Failed to get nearby nodes', 500);
      }

      // Calculate distances and filter nearby nodes
      const connections = nearbyNodes
        ?.map(nearbyNode => {
          const distance = NetworkController.calculateDistance(
            node.location.lat,
            node.location.lng,
            nearbyNode.location.lat,
            nearbyNode.location.lng
          );

          return {
            nodeId: nearbyNode.node_id,
            name: nearbyNode.name,
            distance,
            signalStrength: Math.max(0, 100 - distance * 2), // Simplified signal calculation
            location: nearbyNode.location,
          };
        })
        .filter(connection => connection.distance <= 10) // Within 10km
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10) || []; // Top 10 connections

      res.json({
        success: true,
        data: {
          node: {
            id: node.id,
            nodeId: node.node_id,
            name: node.name,
            location: node.location,
          },
          connections,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getNetworkActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { timeframe = '24h' } = req.query;

      let startDate: Date;
      switch (timeframe) {
        case '1h':
          startDate = new Date(Date.now() - 60 * 60 * 1000);
          break;
        case '24h':
          startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      }

      // Get historical network stats
      const { data: historicalStats, error: statsError } = await supabase
        .from('network_stats')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: true });

      if (statsError) {
        throw new AppError('Failed to get network activity', 500);
      }

      // Get recent node activities
      const { data: nodeActivities, error: activityError } = await supabase
        .from('nodes')
        .select(`
          node_id,
          name,
          status,
          last_heartbeat,
          performance_metrics,
          location
        `)
        .gte('last_heartbeat', startDate.toISOString())
        .order('last_heartbeat', { ascending: false });

      if (activityError) {
        throw new AppError('Failed to get node activities', 500);
      }

      res.json({
        success: true,
        data: {
          timeframe,
          historical_stats: historicalStats,
          recent_activities: nodeActivities,
          summary: {
            total_data_points: historicalStats?.length || 0,
            active_nodes_now: nodeActivities?.filter(n => n.status === 'active').length || 0,
            recent_heartbeats: nodeActivities?.length || 0,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Helper methods
  private static async getNetworkConnections(nodes: any[]): Promise<any[]> {
    // Simplified connection algorithm
    const connections: any[] = [];
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const distance = NetworkController.calculateDistance(
          nodes[i].position.lat,
          nodes[i].position.lng,
          nodes[j].position.lat,
          nodes[j].position.lng
        );

        // Connect nodes within 5km
        if (distance <= 5) {
          connections.push({
            from: nodes[i].nodeId,
            to: nodes[j].nodeId,
            distance,
            strength: Math.max(0, 100 - distance * 10),
          });
        }
      }
    }

    return connections;
  }

  private static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static calculateCoverageArea(nodes: any[]): number {
    if (nodes.length === 0) return 0;

    // Simplified coverage area calculation
    // In reality, this would use complex geometric algorithms
    const latitudes = nodes.map(n => n.position.lat);
    const longitudes = nodes.map(n => n.position.lng);
    
    const latRange = Math.max(...latitudes) - Math.min(...latitudes);
    const lngRange = Math.max(...longitudes) - Math.min(...longitudes);
    
    // Approximate area in square kilometers
    return latRange * lngRange * 111 * 111; // Rough conversion to km²
  }
}
