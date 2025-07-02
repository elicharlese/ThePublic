import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '@/services/supabase';
import { AppError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    walletAddress?: string;
    role: string;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Access token required', 401);
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw new AppError('Access token required', 401);
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Get user from Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, wallet_address, role')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      throw new AppError('Invalid token', 401);
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      walletAddress: user.wallet_address,
      role: user.role,
    };

    next();
  } catch (error) {
    logger.error('Authentication failed', { error: (error as Error).message });
    
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401));
    } else {
      next(error);
    }
  }
};

export const requireRole = (requiredRole: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    if (req.user.role !== requiredRole && req.user.role !== 'admin') {
      throw new AppError('Insufficient permissions', 403);
    }

    next();
  };
};
