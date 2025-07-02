# Backend Quickstart Guide

Follow these steps to get the backend of ThePublic up and running locally:

## 1. Prerequisites
- Node.js (v18+), pnpm or npm
- Rust (for Solana programs)
- Supabase account/project
- Solana CLI

## 2. Clone the Repository
```
git clone https://github.com/elicharlese/ThePublic.git
cd ThePublic
```

## 3. Environment Variables
- Copy `.env.example` to `.env` and fill in required values (see `backend/docs/architecture.md`)

## 4. Install Dependencies
```
pnpm install
```

## 5. Start API Server
```
cd backend/api
pnpm dev
```

## 6. Build & Test Solana Programs
```
cd backend/solana
cargo build
cargo test
```

## 7. Supabase Setup
- Create tables, policies, and functions as described in `backend/supabase/README.md`

## 8. Documentation
- See `backend/docs/` for full backend documentation and troubleshooting.
