# ThePublic Backend

Production-ready backend API for ThePublic decentralized WiFi network.

## 🚀 Features

- **Node Management**: Register, monitor, and manage network nodes
- **Rewards System**: Calculate and distribute rewards to node operators
- **Wallet Integration**: Solana blockchain integration for payments and rewards
- **Real-time Updates**: Live network status and performance metrics
- **Authentication**: JWT and wallet-based authentication
- **Rate Limiting**: API protection and abuse prevention
- **Comprehensive Logging**: Structured logging with Winston
- **Type Safety**: Full TypeScript implementation

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or pnpm
- Supabase account
- Solana wallet for blockchain operations

## 🛠️ Quick Start

1. **Clone and install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/     # Route handlers and business logic
│   ├── middleware/      # Express middleware (auth, validation, etc.)
│   ├── routes/          # API route definitions
│   ├── services/        # External service integrations
│   ├── utils/           # Helper functions and utilities
│   ├── types/           # TypeScript type definitions
│   └── test/            # Test files and setup
├── docs/                # Documentation
├── logs/                # Application logs (gitignored)
└── dist/                # Build output (gitignored)
```

## 📚 Documentation

Detailed documentation is available in the `docs/` folder:

- [Setup Guide](docs/setup.md)
- [API Reference](docs/api-reference.md)
- [Deployment Guide](docs/deployment.md)
- [Solana Integration](docs/solana-integration.md)
- [Supabase Integration](docs/supabase-integration.md)

## Structure
- `solana/` — Rust smart contracts and blockchain logic
- `api/` — TypeScript/Node.js API server
- `supabase/` — Database schema, policies, and functions
- `docs/` — Backend documentation

## Getting Started
See the checklist and docs for setup and development instructions.
