# ThePublic Backend Architecture Overview

This document provides a comprehensive overview of the ThePublic backend architecture, including system design, data flow, and component interactions.

## System Overview

ThePublic backend is a production-ready, scalable system that powers a decentralized WiFi network. It integrates blockchain technology (Solana), real-time database (Supabase), and a robust API layer to manage nodes, users, rewards, and network operations.

## High-Level Architecture

```
Frontend (Next.js) ←→ API Gateway ←→ Services ←→ Database (Supabase)
                                        ↓
                                Solana Blockchain
```

## Core Components

### 1. API Gateway (Express.js)
- **Location**: `backend/src/index.ts`
- **Responsibilities**: Request routing, authentication, rate limiting, error handling
- **Features**: JWT authentication, role-based access, request validation

### 2. Authentication Service
- **Location**: `backend/src/services/auth.ts`
- **Features**: Email/password + wallet signature authentication
- **Security**: bcrypt password hashing, JWT tokens, Solana signature verification

### 3. Node Management Service
- **Location**: `backend/src/services/node.ts`
- **Features**: CRUD operations, performance tracking, reward calculation
- **Integration**: Blockchain sync for node registration and rewards

### 4. Blockchain Integration (Solana)
- **Location**: `backend/src/services/solana.ts`, `backend/solana/`
- **Components**: Node Registry Program, Rewards Program, Transaction management
- **Languages**: Rust (smart contracts) + TypeScript (service layer)

### 5. Real-time Service
- **Location**: `backend/src/services/realtime.ts`
- **Features**: Live data sync, event broadcasting, notification delivery
- **Technology**: Supabase real-time subscriptions + WebSocket management

## Data Models

### User Model
- ID, email, wallet address, role, profile
- Multi-auth support (email + wallet)
- Role-based permissions (user, node_operator, admin)

### Node Model
- Location, hardware specs, performance metrics
- Real-time status tracking
- Geographic and performance-based indexing

### Reward Model
- Amount, type (coverage/traffic/reliability/bonus)
- Blockchain transaction tracking
- Status management (pending/distributed/failed)

## Security Architecture

1. **Authentication & Authorization**
   - JWT tokens for stateless auth
   - Solana wallet signature verification
   - Role-based access control

2. **Data Protection**
   - Row Level Security (RLS) in Supabase
   - Input validation and sanitization
   - Rate limiting and CORS protection

3. **Blockchain Security**
   - Smart contract auditing
   - Private key management
   - Transaction verification

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - Email login
- `POST /auth/wallet-login` - Wallet login
- `GET /auth/profile` - User profile

### Nodes
- `GET /nodes` - List nodes
- `POST /nodes` - Create node
- `PUT /nodes/:id` - Update node
- `POST /nodes/:id/heartbeat` - Submit metrics

### Network
- `GET /network/stats` - Network statistics
- `GET /network/map` - Map data
- `GET /network/activity` - Activity feed

## Deployment

- **Frontend**: Vercel Edge Network
- **API**: Vercel Serverless Functions
- **Database**: Supabase Cloud
- **Blockchain**: Solana Mainnet

## Monitoring & Observability

- Structured logging with Winston
- Performance metrics tracking
- Error monitoring and alerting
- Health checks and status monitoring

This architecture provides a solid foundation for a production-ready, scalable decentralized WiFi network platform.
