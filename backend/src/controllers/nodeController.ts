import { Request, Response, NextFunction } from 'express';
import { supabase } from '@/services/supabase';
import { getSolanaService } from '@/services/solana';
import { AppError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';
import { CreateNodeRequest, UpdateNodeRequest, Node } from '@/types';
import { AuthenticatedRequest } from '@/middleware/auth';

export class NodeController {
  static async getAllNodes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, location, limit = 50, offset = 0 } = req.query;

      let query = supabase
        .from('nodes')
        .select(`
          *,
          users!nodes_owner_id_fkey(email)
        `)
        .range(Number(offset), Number(offset) + Number(limit) - 1);

      if (status) {
        query = query.eq('status', status);
      }

      if (location) {
        // Filter by location (simplified - could use PostGIS for geo queries)
        query = query.ilike('location->city', `%${location}%`);
      }

      const { data: nodes, error, count } = await query;

      if (error) {
        throw new AppError('Failed to fetch nodes', 500);
      }

      res.json({
        success: true,
        data: {
          nodes,
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

  static async getNodeById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const { data: node, error } = await supabase
        .from('nodes')
        .select(`
          *,
          users!nodes_owner_id_fkey(email),
          rewards(amount, reward_type, created_at, status)
        `)
        .eq('id', id)
        .single();

      if (error || !node) {
        throw new AppError('Node not found', 404);
      }

      // Get Solana node account data
      const solanaService = getSolanaService();
      const solanaNodeData = await solanaService.getNodeAccount(node.node_id);

      res.json({
        success: true,
        data: {
          ...node,
          solana_data: solanaNodeData,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async createNode(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const nodeData: CreateNodeRequest = req.body;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError('Authentication required', 401);
      }

      // Generate unique node ID
      const nodeId = `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create hardware hash
      const hardwareHash = Buffer.from(
        JSON.stringify(nodeData.hardware) + Date.now()
      ).toString('hex');

      // Register node on Solana blockchain
      const solanaService = getSolanaService();
      const txSignature = await solanaService.registerNode(
        nodeId,
        {
          lat: nodeData.location.lat,
          lng: nodeData.location.lng,
          country: nodeData.location.country,
        },
        hardwareHash,
        new (await import('@solana/web3.js')).PublicKey(req.user?.walletAddress || '')
      );

      // Store node in database
      const { data: node, error } = await supabase
        .from('nodes')
        .insert({
          owner_id: userId,
          node_id: nodeId,
          name: nodeData.name,
          description: nodeData.description,
          location: nodeData.location,
          hardware: nodeData.hardware,
          status: 'inactive',
          performance_metrics: {},
        })
        .select()
        .single();

      if (error) {
        logger.error('Failed to create node in database', { error, nodeData });
        throw new AppError('Failed to create node', 500);
      }

      logger.info('Node created successfully', { 
        nodeId, 
        userId, 
        txSignature 
      });

      res.status(201).json({
        success: true,
        data: {
          node,
          transaction_signature: txSignature,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateNode(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateNodeRequest = req.body;
      const userId = req.user?.id;

      // Check node ownership
      const { data: existingNode, error: fetchError } = await supabase
        .from('nodes')
        .select('*')
        .eq('id', id)
        .eq('owner_id', userId)
        .single();

      if (fetchError || !existingNode) {
        throw new AppError('Node not found or unauthorized', 404);
      }

      // Update on Solana if status is changing
      let txSignature: string | undefined;
      if (updateData.status && updateData.status !== existingNode.status) {
        const solanaService = getSolanaService();
        txSignature = await solanaService.updateNodeStatus(
          existingNode.node_id,
          updateData.status,
          new (await import('@solana/web3.js')).PublicKey(req.user?.walletAddress || '')
        );
      }

      // Update in database
      const { data: updatedNode, error } = await supabase
        .from('nodes')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new AppError('Failed to update node', 500);
      }

      logger.info('Node updated successfully', { 
        nodeId: id, 
        userId, 
        txSignature 
      });

      res.json({
        success: true,
        data: {
          node: updatedNode,
          transaction_signature: txSignature,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteNode(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      // Check node ownership
      const { data: existingNode, error: fetchError } = await supabase
        .from('nodes')
        .select('*')
        .eq('id', id)
        .eq('owner_id', userId)
        .single();

      if (fetchError || !existingNode) {
        throw new AppError('Node not found or unauthorized', 404);
      }

      // Deregister from Solana (sets status to inactive)
      const solanaService = getSolanaService();
      const txSignature = await solanaService.updateNodeStatus(
        existingNode.node_id,
        'inactive',
        new (await import('@solana/web3.js')).PublicKey(req.user?.walletAddress || '')
      );

      // Soft delete in database (set status to inactive)
      const { error } = await supabase
        .from('nodes')
        .update({
          status: 'inactive',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        throw new AppError('Failed to deactivate node', 500);
      }

      logger.info('Node deactivated successfully', { 
        nodeId: id, 
        userId, 
        txSignature 
      });

      res.json({
        success: true,
        data: {
          message: 'Node deactivated successfully',
          transaction_signature: txSignature,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async submitHeartbeat(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { performance_metrics } = req.body;
      const userId = req.user?.id;

      // Check node ownership
      const { data: existingNode, error: fetchError } = await supabase
        .from('nodes')
        .select('*')
        .eq('id', id)
        .eq('owner_id', userId)
        .single();

      if (fetchError || !existingNode) {
        throw new AppError('Node not found or unauthorized', 404);
      }

      // Submit heartbeat to Solana
      const solanaService = getSolanaService();
      const txSignature = await solanaService.submitHeartbeat(
        existingNode.node_id,
        performance_metrics,
        new (await import('@solana/web3.js')).PublicKey(req.user?.walletAddress || '')
      );

      // Update database with new metrics
      const { data: updatedNode, error } = await supabase
        .from('nodes')
        .update({
          performance_metrics,
          last_heartbeat: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new AppError('Failed to update node metrics', 500);
      }

      logger.info('Heartbeat submitted successfully', { 
        nodeId: id, 
        userId, 
        txSignature,
        metrics: performance_metrics
      });

      res.json({
        success: true,
        data: {
          node: updatedNode,
          transaction_signature: txSignature,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getNodeRewards(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { limit = 50, offset = 0 } = req.query;

      const { data: rewards, error, count } = await supabase
        .from('rewards')
        .select('*')
        .eq('node_id', id)
        .order('created_at', { ascending: false })
        .range(Number(offset), Number(offset) + Number(limit) - 1);

      if (error) {
        throw new AppError('Failed to fetch node rewards', 500);
      }

      res.json({
        success: true,
        data: {
          rewards,
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
}
