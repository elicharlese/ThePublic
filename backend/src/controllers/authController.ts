import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '@/services/supabase';
import { AppError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';
import { CreateUserRequest, LoginRequest, WalletLoginRequest, AuthResponse } from '@/types';
import { AuthenticatedRequest } from '@/middleware/auth';
import { verifySignature } from '@/utils/solanaAuth';

export class AuthController {
  static async register(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, wallet_address, role = 'user' }: CreateUserRequest = req.body;

      // Validate input
      if (!email && !wallet_address) {
        throw new AppError('Email or wallet address is required', 400);
      }

      if (email && !password) {
        throw new AppError('Password is required when using email', 400);
      }

      // Check if user already exists
      let existingUser = null;
      if (email) {
        const { data } = await supabase
          .from('users')
          .select('id')
          .eq('email', email)
          .single();
        existingUser = data;
      }

      if (wallet_address && !existingUser) {
        const { data } = await supabase
          .from('users')
          .select('id')
          .eq('wallet_address', wallet_address)
          .single();
        existingUser = data;
      }

      if (existingUser) {
        throw new AppError('User already exists', 409);
      }

      // Hash password if provided
      let hashedPassword: string | undefined;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 12);
      }

      // Create user in database
      const { data: user, error } = await supabase
        .from('users')
        .insert({
          email,
          wallet_address,
          role,
          profile: {
            password_hash: hashedPassword,
            created_via: email ? 'email' : 'wallet',
          },
        })
        .select('id, email, wallet_address, role, created_at')
        .single();

      if (error) {
        logger.error('Failed to create user', { error, email, wallet_address });
        throw new AppError('Failed to create user', 500);
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      logger.info('User registered successfully', { 
        userId: user.id, 
        email: user.email,
        walletAddress: user.wallet_address,
        role: user.role 
      });

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            walletAddress: user.wallet_address,
            role: user.role,
          },
          token,
        } as AuthResponse,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password }: LoginRequest = req.body;

      if (!email || !password) {
        throw new AppError('Email and password are required', 400);
      }

      // Get user from database
      const { data: user, error } = await supabase
        .from('users')
        .select('id, email, wallet_address, role, profile')
        .eq('email', email)
        .single();

      if (error || !user) {
        throw new AppError('Invalid credentials', 401);
      }

      // Verify password
      const passwordHash = user.profile?.password_hash;
      if (!passwordHash) {
        throw new AppError('Password login not available for this user', 400);
      }

      const isValidPassword = await bcrypt.compare(password, passwordHash);
      if (!isValidPassword) {
        throw new AppError('Invalid credentials', 401);
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      // Update last login
      await supabase
        .from('users')
        .update({
          profile: {
            ...user.profile,
            last_login: new Date().toISOString(),
          },
        })
        .eq('id', user.id);

      logger.info('User logged in successfully', { 
        userId: user.id, 
        email: user.email 
      });

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            walletAddress: user.wallet_address,
            role: user.role,
          },
          token,
        } as AuthResponse,
      });
    } catch (error) {
      next(error);
    }
  }

  static async walletLogin(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { wallet_address, signature, message }: WalletLoginRequest = req.body;

      if (!wallet_address || !signature || !message) {
        throw new AppError('Wallet address, signature, and message are required', 400);
      }

      // Verify Solana signature
      const isValidSignature = await verifySignature(wallet_address, signature, message);
      if (!isValidSignature) {
        throw new AppError('Invalid wallet signature', 401);
      }

      // Check if user exists
      let { data: user, error } = await supabase
        .from('users')
        .select('id, email, wallet_address, role, profile')
        .eq('wallet_address', wallet_address)
        .single();

      // Create user if doesn't exist
      if (error || !user) {
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            wallet_address,
            role: 'user',
            profile: {
              created_via: 'wallet',
              first_login: new Date().toISOString(),
            },
          })
          .select('id, email, wallet_address, role, profile')
          .single();

        if (createError) {
          logger.error('Failed to create wallet user', { error: createError, wallet_address });
          throw new AppError('Failed to create user', 500);
        }

        user = newUser;
        logger.info('New wallet user created', { userId: user.id, wallet_address });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, walletAddress: user.wallet_address, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      // Update last login
      await supabase
        .from('users')
        .update({
          profile: {
            ...user.profile,
            last_login: new Date().toISOString(),
          },
        })
        .eq('id', user.id);

      logger.info('Wallet login successful', { 
        userId: user.id, 
        walletAddress: user.wallet_address 
      });

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            walletAddress: user.wallet_address,
            role: user.role,
          },
          token,
        } as AuthResponse,
      });
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError('Authentication required', 401);
      }

      // Get user from database
      const { data: user, error } = await supabase
        .from('users')
        .select('id, email, wallet_address, role')
        .eq('id', userId)
        .single();

      if (error || !user) {
        throw new AppError('User not found', 404);
      }

      // Generate new JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          walletAddress: user.wallet_address,
          role: user.role 
        },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            walletAddress: user.wallet_address,
            role: user.role,
          },
          token,
        } as AuthResponse,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError('Authentication required', 401);
      }

      // Get user profile
      const { data: user, error } = await supabase
        .from('users')
        .select(`
          id, 
          email, 
          wallet_address, 
          role, 
          created_at, 
          updated_at, 
          profile,
          nodes(count)
        `)
        .eq('id', userId)
        .single();

      if (error || !user) {
        throw new AppError('User not found', 404);
      }

      // Get user statistics
      const { data: rewards } = await supabase
        .from('rewards')
        .select('amount, status')
        .eq('owner_id', userId);

      const totalEarned = rewards?.reduce((sum, reward) => {
        return sum + (reward.status === 'distributed' ? Number(reward.amount) : 0);
      }, 0) || 0;

      const pendingRewards = rewards?.reduce((sum, reward) => {
        return sum + (reward.status === 'pending' ? Number(reward.amount) : 0);
      }, 0) || 0;

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            walletAddress: user.wallet_address,
            role: user.role,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
            profile: user.profile,
          },
          statistics: {
            totalNodes: user.nodes?.[0]?.count || 0,
            totalEarned,
            pendingRewards,
            totalRewards: rewards?.length || 0,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const { profile } = req.body;

      if (!userId) {
        throw new AppError('Authentication required', 401);
      }

      // Get current user
      const { data: currentUser, error: fetchError } = await supabase
        .from('users')
        .select('profile')
        .eq('id', userId)
        .single();

      if (fetchError || !currentUser) {
        throw new AppError('User not found', 404);
      }

      // Update profile (merge with existing)
      const { data: user, error } = await supabase
        .from('users')
        .update({
          profile: {
            ...currentUser.profile,
            ...profile,
            updated_at: new Date().toISOString(),
          },
        })
        .eq('id', userId)
        .select('id, email, wallet_address, role, profile')
        .single();

      if (error) {
        throw new AppError('Failed to update profile', 500);
      }

      logger.info('Profile updated successfully', { userId });

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            walletAddress: user.wallet_address,
            role: user.role,
            profile: user.profile,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;

      if (userId) {
        // Update last logout time
        await supabase
          .from('users')
          .update({
            profile: {
              last_logout: new Date().toISOString(),
            },
          })
          .eq('id', userId);

        logger.info('User logged out successfully', { userId });
      }

      res.json({
        success: true,
        data: {
          message: 'Logged out successfully',
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
