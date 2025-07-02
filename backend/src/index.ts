import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { logger } from '@/utils/logger';
import { errorHandler } from '@/middleware/errorHandler';
import { notFoundHandler } from '@/middleware/notFoundHandler';
import { authMiddleware } from '@/middleware/auth';
import { validateEnv } from '@/utils/validateEnv';

// Routes
import { healthRoutes } from '@/routes/health';
import { authRoutes } from '@/routes/auth';
import { nodeRoutes } from '@/routes/nodes';
import { walletRoutes } from '@/routes/wallet';
import { networkRoutes } from '@/routes/network';
import { blogRoutes } from '@/routes/blog';

// Services
import { getRealtimeService } from '@/services/realtime';
import { getSolanaService } from '@/services/solana';

// Load environment variables
dotenv.config();

// Validate environment variables
validateEnv();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://thepublic.vercel.app'] // Replace with your domain
    : ['http://localhost:3000'],
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, { 
    ip: req.ip, 
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString() 
  });
  next();
});

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/nodes', authMiddleware, nodeRoutes);
app.use('/api/wallet', authMiddleware, walletRoutes);
app.use('/api/network', networkRoutes);
app.use('/api/blog', blogRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize services
async function initializeServices(): Promise<void> {
  try {
    // Test Solana connection
    const solanaService = getSolanaService();
    const solanaHealthy = await solanaService.testConnection();
    
    if (!solanaHealthy) {
      logger.warn('Solana connection test failed, but continuing startup');
    }

    // Initialize realtime service
    const realtimeService = getRealtimeService();
    
    if (!realtimeService.isHealthy()) {
      logger.warn('Realtime service not healthy, but continuing startup');
    }

    logger.info('All services initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize services', { error });
    // Don't crash the server, but log the error
  }
}

// Create HTTP server
const server = createServer(app);

// Start server
async function startServer(): Promise<void> {
  try {
    await initializeServices();
    
    server.listen(PORT, () => {
      logger.info(`ThePublic Backend API server running on port ${PORT}`, {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
      });
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  
  try {
    const realtimeService = getRealtimeService();
    await realtimeService.disconnect();
  } catch (error) {
    logger.error('Error during graceful shutdown', { error });
  }
  
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  
  try {
    const realtimeService = getRealtimeService();
    await realtimeService.disconnect();
  } catch (error) {
    logger.error('Error during graceful shutdown', { error });
  }
  
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', { error });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection', { reason, promise });
  process.exit(1);
});

export { app, server };

// Start server if this file is run directly
if (require.main === module) {
  startServer();
}
