# Backend Architecture Overview

This document provides a high-level overview of ThePublic backend architecture, including:
- Solana blockchain integration (Rust)
- API server (TypeScript/Node.js)
- Supabase (database, auth, realtime)
- Deployment and CI/CD

## 1. Solana Blockchain (Rust)
- Smart contracts for node registration, rewards, proof of coverage, micropayments
- Wallet integration for node operators
- Exposed via REST/gRPC API for frontend consumption

## 2. API Server (TypeScript/Node.js)
- REST/gRPC endpoints for all frontend needs
- Connects to Solana programs and Supabase
- Handles business logic, validation, notifications, and error handling

## 3. Supabase
- User authentication (email, OAuth, wallet signature)
- User/node profiles, node metadata, rewards history
- Realtime subscriptions for live updates
- Role-based access and security policies

## 4. Deployment
- Vercel for frontend and serverless API
- Supabase for managed database and auth
- GitHub Actions for CI/CD

See other docs in this folder for details on each component.
