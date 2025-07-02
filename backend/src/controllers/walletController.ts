import { Response, NextFunction } from 'express';
import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from '@solana/web3.js';
import { supabase } from '@/services/supabase';
import { getSolanaService } from '@/services/solana';
import { AppError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';
import { SendTransactionRequest } from '@/types';
import { AuthenticatedRequest } from '@/middleware/auth';

export class WalletController {
  static async getBalance(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const walletAddress = req.user?.walletAddress;

      if (!walletAddress) {
        throw new AppError('Wallet address required', 400);
      }

      const solanaService = getSolanaService();
      const connection = await solanaService.getConnection();
      
      const publicKey = new PublicKey(walletAddress);
      const balance = await connection.getBalance(publicKey);
      const solBalance = balance / LAMPORTS_PER_SOL;

      logger.info('Balance retrieved', { 
        walletAddress, 
        balance: solBalance 
      });

      res.json({
        success: true,
        data: {
          wallet_address: walletAddress,
          balance_sol: solBalance,
          balance_lamports: balance,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async sendTransaction(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { recipient, amount, memo }: SendTransactionRequest = req.body;
      const userId = req.user?.id;
      const senderAddress = req.user?.walletAddress;

      if (!senderAddress) {
        throw new AppError('Wallet address required', 400);
      }

      // Validate recipient address
      try {
        new PublicKey(recipient);
      } catch {
        throw new AppError('Invalid recipient address', 400);
      }

      if (amount <= 0) {
        throw new AppError('Amount must be positive', 400);
      }

      const solanaService = getSolanaService();
      const connection = await solanaService.getConnection();

      // Check balance
      const senderPublicKey = new PublicKey(senderAddress);
      const balance = await connection.getBalance(senderPublicKey);
      const requiredLamports = amount * LAMPORTS_PER_SOL;

      if (balance < requiredLamports) {
        throw new AppError('Insufficient balance', 400);
      }

      // Create transaction
      const transaction = new Transaction();
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: senderPublicKey,
          toPubkey: new PublicKey(recipient),
          lamports: requiredLamports,
        })
      );

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = senderPublicKey;

      // Note: In a real implementation, you would need the user's wallet to sign this
      // For now, we'll simulate the transaction creation
      const serializedTransaction = transaction.serialize({ requireAllSignatures: false });
      const signature = 'simulated_signature_' + Date.now();

      // Store transaction in database
      const { data: txRecord, error } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type: 'send',
          amount,
          from_address: senderAddress,
          to_address: recipient,
          signature,
          status: 'pending',
          fee: 0.000005, // Estimated fee
        })
        .select()
        .single();

      if (error) {
        throw new AppError('Failed to record transaction', 500);
      }

      logger.info('Transaction created', { 
        userId, 
        recipient, 
        amount, 
        signature 
      });

      res.json({
        success: true,
        data: {
          transaction: txRecord,
          signature,
          explorer_url: `https://explorer.solana.com/tx/${signature}?cluster=${process.env.SOLANA_NETWORK || 'devnet'}`,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTransactions(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const { limit = 50, offset = 0, type } = req.query;

      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(Number(offset), Number(offset) + Number(limit) - 1);

      if (type) {
        query = query.eq('type', type);
      }

      const { data: transactions, error, count } = await query;

      if (error) {
        throw new AppError('Failed to fetch transactions', 500);
      }

      res.json({
        success: true,
        data: {
          transactions,
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

  static async getTransactionStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { signature } = req.params;
      const userId = req.user?.id;

      // Check if transaction belongs to user
      const { data: transaction, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('signature', signature)
        .eq('user_id', userId)
        .single();

      if (error || !transaction) {
        throw new AppError('Transaction not found', 404);
      }

      // Get status from Solana
      const solanaService = getSolanaService();
      const status = await solanaService.getTransactionStatus(signature);

      // Update database if status changed
      if (status.confirmed && transaction.status === 'pending') {
        await supabase
          .from('transactions')
          .update({
            status: 'confirmed',
            block_number: status.blockHeight,
            fee: status.fee ? status.fee / LAMPORTS_PER_SOL : transaction.fee,
            confirmed_at: new Date().toISOString(),
          })
          .eq('signature', signature);
      }

      res.json({
        success: true,
        data: {
          transaction: {
            ...transaction,
            status: status.confirmed ? 'confirmed' : transaction.status,
          },
          solana_status: status,
          explorer_url: `https://explorer.solana.com/tx/${signature}?cluster=${process.env.SOLANA_NETWORK || 'devnet'}`,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserRewards(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const { limit = 50, offset = 0 } = req.query;

      const { data: rewards, error, count } = await supabase
        .from('rewards')
        .select(`
          *,
          nodes!rewards_node_id_fkey(name, node_id)
        `)
        .eq('owner_id', userId)
        .order('created_at', { ascending: false })
        .range(Number(offset), Number(offset) + Number(limit) - 1);

      if (error) {
        throw new AppError('Failed to fetch rewards', 500);
      }

      // Calculate totals
      const totalEarned = rewards?.reduce((sum, reward) => {
        return sum + (reward.status === 'distributed' ? Number(reward.amount) : 0);
      }, 0) || 0;

      const pendingRewards = rewards?.reduce((sum, reward) => {
        return sum + (reward.status === 'pending' ? Number(reward.amount) : 0);
      }, 0) || 0;

      res.json({
        success: true,
        data: {
          rewards,
          summary: {
            total_earned: totalEarned,
            pending_rewards: pendingRewards,
            total_rewards: rewards?.length || 0,
          },
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

  static async getWalletInfo(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const walletAddress = req.user?.walletAddress;

      if (!walletAddress) {
        throw new AppError('Wallet address required', 400);
      }

      const solanaService = getSolanaService();
      const connection = await solanaService.getConnection();
      
      const publicKey = new PublicKey(walletAddress);
      const [balance, accountInfo] = await Promise.all([
        connection.getBalance(publicKey),
        connection.getAccountInfo(publicKey),
      ]);

      // Get recent transactions
      const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 10 });

      res.json({
        success: true,
        data: {
          wallet_address: walletAddress,
          balance_sol: balance / LAMPORTS_PER_SOL,
          balance_lamports: balance,
          account_info: {
            exists: accountInfo !== null,
            executable: accountInfo?.executable || false,
            owner: accountInfo?.owner?.toBase58(),
            rent_epoch: accountInfo?.rentEpoch,
          },
          recent_signatures: signatures.map(sig => ({
            signature: sig.signature,
            slot: sig.slot,
            block_time: sig.blockTime,
            confirmation_status: sig.confirmationStatus,
          })),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
