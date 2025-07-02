/**
 * Integration tests for ThePublic Backend API
 * Tests the complete API flow including authentication, database, and blockchain operations
 */

import request from 'supertest';
import { app } from '../src/index';

describe('Integration Tests', () => {
  let authToken: string;
  let userId: string;

  describe('Authentication Flow', () => {
    test('User Registration and Login', async () => {
      // 1. Register a new user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'integration@test.com',
          password: 'TestPassword123!',
          role: 'user',
        });

      expect(registerResponse.status).toBe(201);
      expect(registerResponse.body.success).toBe(true);

      // 2. Login with the created user
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'integration@test.com',
          password: 'TestPassword123!',
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.success).toBe(true);
      
      authToken = loginResponse.body.data.accessToken;
      userId = loginResponse.body.data.user.id;
      
      expect(authToken).toBeDefined();
      expect(userId).toBeDefined();
    });
  });

  describe('Protected Routes', () => {
    test('Access profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(userId);
    });

    test('Reject access without token', async () => {
      const response = await request(app)
        .get('/api/auth/profile');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Blog API Flow', () => {
    let postId: number;

    test('Create, read, update, and delete blog post', async () => {
      // 1. Create a new blog post
      const createResponse = await request(app)
        .post('/api/blog/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Integration Test Post',
          content: 'This is a test post for integration testing.',
          slug: 'integration-test-post',
          published: false,
        });

      expect(createResponse.status).toBe(201);
      expect(createResponse.body.success).toBe(true);
      postId = createResponse.body.data.id;

      // 2. Read the created post
      const readResponse = await request(app)
        .get(`/api/blog/posts/${postId}`);

      expect(readResponse.status).toBe(200);
      expect(readResponse.body.success).toBe(true);
      expect(readResponse.body.data.title).toBe('Integration Test Post');

      // 3. Update the post
      const updateResponse = await request(app)
        .put(`/api/blog/posts/${postId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Integration Test Post',
          published: true,
        });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.success).toBe(true);
      expect(updateResponse.body.data.title).toBe('Updated Integration Test Post');

      // 4. Delete the post
      const deleteResponse = await request(app)
        .delete(`/api/blog/posts/${postId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.success).toBe(true);

      // 5. Verify post is deleted
      const verifyResponse = await request(app)
        .get(`/api/blog/posts/${postId}`);

      expect(verifyResponse.status).toBe(404);
    });
  });

  describe('Node Management Flow', () => {
    test('Register and manage node', async () => {
      // 1. Register a new node
      const nodeData = {
        name: 'Test Node',
        location: 'Test Location',
        hardware_specs: {
          cpu: 'Test CPU',
          memory: '8GB',
          storage: '100GB',
        },
        wallet_address: '11111111111111111111111111111112',
      };

      const registerResponse = await request(app)
        .post('/api/nodes/register')
        .set('Authorization', `Bearer ${authToken}`)
        .send(nodeData);

      expect(registerResponse.status).toBe(201);
      expect(registerResponse.body.success).toBe(true);

      const nodeId = registerResponse.body.data.id;

      // 2. Get node status
      const statusResponse = await request(app)
        .get(`/api/nodes/${nodeId}/status`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(statusResponse.status).toBe(200);
      expect(statusResponse.body.success).toBe(true);

      // 3. Update node metrics
      const metricsData = {
        uptime: 99.5,
        bandwidth_used: 150,
        users_served: 25,
      };

      const metricsResponse = await request(app)
        .post(`/api/nodes/${nodeId}/metrics`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(metricsData);

      expect(metricsResponse.status).toBe(200);
      expect(metricsResponse.body.success).toBe(true);
    });
  });

  describe('Notification System', () => {
    test('Send and receive notifications', async () => {
      // 1. Send a notification
      const notificationData = {
        type: 'reward',
        title: 'Test Reward',
        message: 'You have received a test reward!',
        userId: userId,
      };

      const sendResponse = await request(app)
        .post('/api/notifications')
        .set('Authorization', `Bearer ${authToken}`)
        .send(notificationData);

      expect(sendResponse.status).toBe(201);
      expect(sendResponse.body.success).toBe(true);

      // 2. Get notifications for user
      const getResponse = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${authToken}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.success).toBe(true);
      expect(Array.isArray(getResponse.body.data)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('Handle invalid data gracefully', async () => {
      // Test invalid email format
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          role: 'user',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    test('Handle non-existent resources', async () => {
      const response = await request(app)
        .get('/api/blog/posts/99999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    test('Handle unauthorized access', async () => {
      const response = await request(app)
        .post('/api/blog/posts')
        .send({
          title: 'Unauthorized Post',
          content: 'This should fail',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Rate Limiting', () => {
    test('Enforce rate limits on public endpoints', async () => {
      // Make multiple rapid requests to test rate limiting
      const requests = Array(10).fill(null).map(() =>
        request(app).get('/api/blog/posts')
      );

      const responses = await Promise.all(requests);
      
      // Some requests should succeed, others should be rate limited
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });
});
