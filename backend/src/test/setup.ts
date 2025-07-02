import { jest } from '@jest/globals';

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.SUPABASE_URL = 'http://localhost:54321';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
process.env.SOLANA_RPC_URL = 'http://localhost:8899';

// Global test setup
beforeAll(() => {
  // Any global setup code
});

afterAll(() => {
  // Any global cleanup code
});

// Mock external services
jest.mock('@/services/supabase', () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      signUp: jest.fn(),
      signIn: jest.fn(),
    },
  },
  testSupabaseConnection: jest.fn().mockResolvedValue(true),
}));
