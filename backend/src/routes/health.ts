import { Router, Request, Response } from 'express';
import { testSupabaseConnection } from '@/services/supabase';
import { logger } from '@/utils/logger';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const supabaseHealthy = await testSupabaseConnection();
    
    const health = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      services: {
        supabase: supabaseHealthy ? 'healthy' : 'unhealthy',
        solana: 'pending', // Will be implemented with Solana service
      },
    };

    logger.info('Health check requested', health);

    res.status(200).json({
      success: true,
      data: health,
    });
  } catch (error) {
    logger.error('Health check failed', { error: (error as Error).message });
    
    res.status(503).json({
      success: false,
      error: {
        message: 'Service temporarily unavailable',
      },
    });
  }
});

export { router as healthRoutes };
