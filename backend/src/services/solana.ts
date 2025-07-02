import { 
  Connection, 
  PublicKey, 
  Keypair, 
  Transaction, 
  SystemProgram,
  LAMPORTS_PER_SOL,
  ConfirmOptions 
} from '@solana/web3.js';
import { AnchorProvider, Program, Wallet, web3 } from '@coral-xyz/anchor';
import { logger } from '@/utils/logger';
import { SolanaNodeAccount, SolanaNetworkState } from '@/types';

export class SolanaService {
  private connection: Connection;
  private provider: AnchorProvider;
  private nodeProgram: Program | null = null;
  private wallet: Wallet;

  constructor() {
    this.connection = new Connection(
      process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
      'confirmed'
    );

    // Create wallet from private key
    const privateKey = process.env.SOLANA_WALLET_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('SOLANA_WALLET_PRIVATE_KEY environment variable is required');
    }

    const keypair = Keypair.fromSecretKey(
      Uint8Array.from(JSON.parse(privateKey))
    );
    this.wallet = new Wallet(keypair);

    this.provider = new AnchorProvider(
      this.connection,
      this.wallet,
      { commitment: 'confirmed' }
    );

    this.initializePrograms();
  }

  private async initializePrograms(): Promise<void> {
    try {
      // Initialize node registry program
      const programId = new PublicKey(process.env.SOLANA_PROGRAM_ID!);
      
      // Note: In a real implementation, you would load the IDL
      // For now, we'll create a minimal interface
      this.nodeProgram = new Program(
        {} as any, // IDL would go here
        programId,
        this.provider
      );

      logger.info('Solana programs initialized');
    } catch (error) {
      logger.error('Failed to initialize Solana programs', { error });
      throw error;
    }
  }

  async getConnection(): Promise<Connection> {
    return this.connection;
  }

  async getNetworkStats(): Promise<{
    totalNodes: number;
    activeNodes: number;
    blockHeight: number;
  }> {
    try {
      const blockHeight = await this.connection.getBlockHeight();
      
      // Get network state account
      const networkStatePda = this.getNetworkStatePda();
      const networkStateAccount = await this.connection.getAccountInfo(networkStatePda);
      
      if (!networkStateAccount) {
        return {
          totalNodes: 0,
          activeNodes: 0,
          blockHeight,
        };
      }

      // Parse network state (would use proper deserialization in real implementation)
      return {
        totalNodes: 0, // Parse from account data
        activeNodes: 0, // Parse from account data
        blockHeight,
      };
    } catch (error) {
      logger.error('Failed to get network stats', { error });
      throw error;
    }
  }

  async registerNode(
    nodeId: string,
    location: { lat: number; lng: number; country: string },
    hardwareHash: string,
    ownerPublicKey: PublicKey
  ): Promise<string> {
    try {
      if (!this.nodeProgram) {
        throw new Error('Node program not initialized');
      }

      // Generate node PDA
      const nodeIdBuffer = Buffer.from(nodeId, 'utf-8');
      const [nodePda] = PublicKey.findProgramAddressSync(
        [Buffer.from('node'), nodeIdBuffer],
        this.nodeProgram.programId
      );

      // Create instruction data
      const locationData = {
        latitude: location.lat,
        longitude: location.lng,
        countryCode: Array.from(Buffer.from(location.country, 'utf-8')).slice(0, 2),
      };

      const hardwareHashBuffer = Array.from(Buffer.from(hardwareHash, 'utf-8')).slice(0, 32);

      // Build transaction (simplified - would use proper Anchor methods)
      const transaction = new Transaction();
      
      // In a real implementation, you would add the actual instruction here
      // transaction.add(await this.nodeProgram.methods.registerNode(...).instruction());

      const signature = await this.provider.sendAndConfirm(transaction);
      
      logger.info('Node registered on Solana', { 
        nodeId, 
        signature, 
        nodePda: nodePda.toBase58() 
      });

      return signature;
    } catch (error) {
      logger.error('Failed to register node on Solana', { error, nodeId });
      throw error;
    }
  }

  async updateNodeStatus(
    nodeId: string,
    status: 'active' | 'inactive' | 'maintenance' | 'suspended',
    ownerPublicKey: PublicKey
  ): Promise<string> {
    try {
      if (!this.nodeProgram) {
        throw new Error('Node program not initialized');
      }

      const nodeIdBuffer = Buffer.from(nodeId, 'utf-8');
      const [nodePda] = PublicKey.findProgramAddressSync(
        [Buffer.from('node'), nodeIdBuffer],
        this.nodeProgram.programId
      );

      // Build transaction
      const transaction = new Transaction();
      
      // Add update status instruction
      // transaction.add(await this.nodeProgram.methods.updateNodeStatus(...).instruction());

      const signature = await this.provider.sendAndConfirm(transaction);

      logger.info('Node status updated on Solana', { 
        nodeId, 
        status, 
        signature 
      });

      return signature;
    } catch (error) {
      logger.error('Failed to update node status on Solana', { error, nodeId });
      throw error;
    }
  }

  async submitHeartbeat(
    nodeId: string,
    performanceMetrics: {
      uptimePercentage: number;
      dataTransferred: number;
      usersServed: number;
      avgResponseTime: number;
      reliabilityScore: number;
    },
    ownerPublicKey: PublicKey
  ): Promise<string> {
    try {
      if (!this.nodeProgram) {
        throw new Error('Node program not initialized');
      }

      const nodeIdBuffer = Buffer.from(nodeId, 'utf-8');
      const [nodePda] = PublicKey.findProgramAddressSync(
        [Buffer.from('node'), nodeIdBuffer],
        this.nodeProgram.programId
      );

      // Build transaction
      const transaction = new Transaction();
      
      // Add heartbeat instruction
      // transaction.add(await this.nodeProgram.methods.submitHeartbeat(...).instruction());

      const signature = await this.provider.sendAndConfirm(transaction);

      logger.info('Heartbeat submitted to Solana', { 
        nodeId, 
        signature,
        metrics: performanceMetrics
      });

      return signature;
    } catch (error) {
      logger.error('Failed to submit heartbeat to Solana', { error, nodeId });
      throw error;
    }
  }

  async getNodeAccount(nodeId: string): Promise<SolanaNodeAccount | null> {
    try {
      if (!this.nodeProgram) {
        throw new Error('Node program not initialized');
      }

      const nodeIdBuffer = Buffer.from(nodeId, 'utf-8');
      const [nodePda] = PublicKey.findProgramAddressSync(
        [Buffer.from('node'), nodeIdBuffer],
        this.nodeProgram.programId
      );

      const accountInfo = await this.connection.getAccountInfo(nodePda);
      
      if (!accountInfo) {
        return null;
      }

      // Parse account data (would use proper deserialization)
      // const nodeAccount = this.nodeProgram.coder.accounts.decode('NodeAccount', accountInfo.data);
      
      // For now, return a mock account
      return {
        owner: this.wallet.publicKey.toBase58(),
        nodeId: Array.from(nodeIdBuffer),
        location: {
          latitude: 0,
          longitude: 0,
          countryCode: [85, 83], // 'US'
        },
        hardwareHash: Array.from(Buffer.alloc(32)),
        status: { active: {} },
        registrationTime: Date.now() / 1000,
        lastHeartbeat: Date.now() / 1000,
        reputationScore: 500,
        totalRewards: 0,
        performanceMetrics: {
          uptimePercentage: 0,
          dataTransferred: 0,
          usersServed: 0,
          avgResponseTime: 0,
          reliabilityScore: 0,
        },
      };
    } catch (error) {
      logger.error('Failed to get node account from Solana', { error, nodeId });
      throw error;
    }
  }

  async calculateRewards(
    nodeId: string,
    periodStart: Date,
    periodEnd: Date
  ): Promise<number> {
    try {
      const nodeAccount = await this.getNodeAccount(nodeId);
      
      if (!nodeAccount) {
        throw new Error('Node not found');
      }

      const metrics = nodeAccount.performanceMetrics;
      
      // Base reward calculation
      let totalReward = 100; // Base reward
      
      // Uptime bonus
      totalReward *= metrics.uptimePercentage / 100;
      
      // Data transfer bonus (1 token per GB)
      totalReward += metrics.dataTransferred / (1024 * 1024 * 1024);
      
      // User service bonus
      totalReward += metrics.usersServed * 10;
      
      // Reliability bonus
      if (metrics.reliabilityScore > 95) {
        totalReward += 50;
      }

      logger.info('Rewards calculated for node', { 
        nodeId, 
        totalReward,
        metrics 
      });

      return Math.max(totalReward, 0);
    } catch (error) {
      logger.error('Failed to calculate rewards', { error, nodeId });
      throw error;
    }
  }

  async distributeRewards(
    nodeIds: string[],
    amounts: number[]
  ): Promise<string[]> {
    try {
      if (nodeIds.length !== amounts.length) {
        throw new Error('Node IDs and amounts arrays must have the same length');
      }

      const signatures: string[] = [];

      for (let i = 0; i < nodeIds.length; i++) {
        const nodeAccount = await this.getNodeAccount(nodeIds[i]);
        
        if (!nodeAccount) {
          logger.warn('Node not found for reward distribution', { nodeId: nodeIds[i] });
          continue;
        }

        // Create reward distribution transaction
        const transaction = new Transaction();
        
        // Add token transfer instruction
        const ownerPublicKey = new PublicKey(nodeAccount.owner);
        const lamports = amounts[i] * LAMPORTS_PER_SOL;
        
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: this.wallet.publicKey,
            toPubkey: ownerPublicKey,
            lamports,
          })
        );

        const signature = await this.provider.sendAndConfirm(transaction);
        signatures.push(signature);

        logger.info('Reward distributed to node', { 
          nodeId: nodeIds[i], 
          amount: amounts[i], 
          signature 
        });
      }

      return signatures;
    } catch (error) {
      logger.error('Failed to distribute rewards', { error });
      throw error;
    }
  }

  async getTransactionStatus(signature: string): Promise<{
    confirmed: boolean;
    blockHeight?: number;
    fee?: number;
  }> {
    try {
      const status = await this.connection.getSignatureStatus(signature);
      
      if (!status.value) {
        return { confirmed: false };
      }

      const transaction = await this.connection.getTransaction(signature);
      
      return {
        confirmed: status.value.confirmationStatus === 'confirmed' || 
                  status.value.confirmationStatus === 'finalized',
        blockHeight: status.value.slot,
        fee: transaction?.meta?.fee,
      };
    } catch (error) {
      logger.error('Failed to get transaction status', { error, signature });
      throw error;
    }
  }

  private getNetworkStatePda(): PublicKey {
    if (!this.nodeProgram) {
      throw new Error('Node program not initialized');
    }

    const [networkStatePda] = PublicKey.findProgramAddressSync(
      [Buffer.from('network_state')],
      this.nodeProgram.programId
    );

    return networkStatePda;
  }

  async testConnection(): Promise<boolean> {
    try {
      const blockHeight = await this.connection.getBlockHeight();
      logger.info('Solana connection test successful', { blockHeight });
      return true;
    } catch (error) {
      logger.error('Solana connection test failed', { error });
      return false;
    }
  }
}

// Singleton instance
let solanaService: SolanaService | null = null;

export function getSolanaService(): SolanaService {
  if (!solanaService) {
    solanaService = new SolanaService();
  }
  return solanaService;
}
