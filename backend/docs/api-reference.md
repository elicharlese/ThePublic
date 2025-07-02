# API Reference

This document provides a comprehensive reference for ThePublic API endpoints.

## Base URL

- Development: `http://localhost:3001/api`
- Production: `https://thepublic.vercel.app/api`

## Authentication

Most endpoints require authentication using JWT tokens:

```
Authorization: Bearer <your-jwt-token>
```

## Common Response Format

All API responses follow this format:

```json
{
  "success": boolean,
  "data": any,
  "error": {
    "message": string,
    "stack": string (development only)
  }
}
```

## Endpoints

### Health Check

#### GET /health
Check API health status.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "OK",
    "timestamp": "2025-07-02T00:00:00.000Z",
    "uptime": 12345,
    "environment": "development",
    "services": {
      "supabase": "healthy",
      "solana": "healthy"
    }
  }
}
```

### Authentication

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "walletAddress": "optional-solana-address"
}
```

#### POST /auth/login
Login with email/password or wallet signature.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### POST /auth/wallet-login
Login with Solana wallet signature.

**Request Body:**
```json
{
  "walletAddress": "solana-address",
  "signature": "signed-message",
  "message": "original-message"
}
```

### Nodes

#### GET /nodes
Get list of network nodes.

**Query Parameters:**
- `status`: Filter by node status (active, inactive, maintenance)
- `location`: Filter by geographic location
- `limit`: Number of results (default: 50)
- `offset`: Pagination offset

#### POST /nodes
Register a new node (requires authentication).

**Request Body:**
```json
{
  "name": "My Node",
  "location": {
    "lat": 37.7749,
    "lng": -122.4194,
    "city": "San Francisco",
    "country": "USA"
  },
  "hardware": {
    "type": "raspberry-pi-4",
    "specs": "4GB RAM, 64GB Storage"
  }
}
```

#### GET /nodes/:id
Get specific node details.

#### PUT /nodes/:id
Update node information (owner only).

#### DELETE /nodes/:id
Deactivate node (owner only).

### Wallet

#### GET /wallet/balance
Get wallet balance (requires authentication).

#### POST /wallet/send
Send SOL transaction.

**Request Body:**
```json
{
  "recipient": "recipient-solana-address",
  "amount": 0.1,
  "memo": "optional-memo"
}
```

#### GET /wallet/transactions
Get transaction history.

### Network

#### GET /network/stats
Get network statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalNodes": 1234,
    "activeNodes": 1100,
    "totalUsers": 5678,
    "dataTransferred": "1.2TB",
    "uptime": "99.5%"
  }
}
```

#### GET /network/map
Get network map data for visualization.

### Blog

#### GET /blog/posts
Get blog posts.

#### GET /blog/posts/:slug
Get specific blog post.

#### POST /blog/posts
Create new blog post (admin only).

#### PUT /blog/posts/:id
Update blog post (admin only).

#### DELETE /blog/posts/:id
Delete blog post (admin only).

## Error Codes

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limiting

API endpoints are rate-limited to 100 requests per 15-minute window per IP address.

## SDK Examples

### JavaScript/TypeScript

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://thepublic.vercel.app/api',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// Get network stats
const stats = await api.get('/network/stats');
console.log(stats.data);
```

### curl

```bash
# Health check
curl https://thepublic.vercel.app/api/health

# Get network stats
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://thepublic.vercel.app/api/network/stats
```
