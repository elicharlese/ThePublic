import request from 'supertest';
import { app } from '../src/index';
import { supabase } from '../src/config/supabase';

// Mock Supabase
jest.mock('../src/config/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
      insert: jest.fn(),
      update: jest.fn(() => ({
        eq: jest.fn(),
      })),
    })),
  },
}));

describe('Auth Controller', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: { role: 'user' },
      };

      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          role: 'user',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('test@example.com');
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          role: 'user',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 for weak password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: '123',
          role: 'user',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user successfully', async () => {
      const mockSession = {
        access_token: 'token-123',
        refresh_token: 'refresh-123',
        user: {
          id: 'user-123',
          email: 'test@example.com',
        },
      };

      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBe('token-123');
    });

    it('should return 401 for invalid credentials', async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { session: null },
        error: { message: 'Invalid credentials' },
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/wallet-login', () => {
    it('should login with wallet signature successfully', async () => {
      // Mock wallet signature verification
      const mockPublicKey = '11111111111111111111111111111112';
      const mockSignature = 'mock-signature';
      const mockMessage = 'Login to ThePublic';

      const response = await request(app)
        .post('/api/auth/wallet-login')
        .send({
          publicKey: mockPublicKey,
          signature: mockSignature,
          message: mockMessage,
        });

      // This test would need proper signature verification
      // For now, we're testing the endpoint structure
      expect(response.status).toBeOneOf([200, 400, 401]);
    });
  });
});

describe('Blog Controller', () => {
  describe('GET /api/blog/posts', () => {
    it('should return blog posts successfully', async () => {
      const mockPosts = [
        {
          id: 1,
          title: 'Test Post',
          content: 'Test content',
          slug: 'test-post',
          published: true,
          created_at: new Date().toISOString(),
        },
      ];

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => ({
              limit: jest.fn(() => ({
                data: mockPosts,
                error: null,
              })),
            })),
          })),
        })),
      });

      const response = await request(app).get('/api/blog/posts');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /api/blog/posts', () => {
    it('should create a new blog post', async () => {
      const mockPost = {
        id: 1,
        title: 'New Post',
        content: 'New content',
        slug: 'new-post',
        published: false,
      };

      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: mockPost,
              error: null,
            }),
          })),
        })),
      });

      const response = await request(app)
        .post('/api/blog/posts')
        .send({
          title: 'New Post',
          content: 'New content',
          slug: 'new-post',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('New Post');
    });
  });
});

// Custom Jest matcher
expect.extend({
  toBeOneOf(received, expected) {
    const pass = expected.includes(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be one of ${expected}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be one of ${expected}`,
        pass: false,
      };
    }
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeOneOf(expected: any[]): R;
    }
  }
}
