# Developer Onboarding Guide

Welcome to ThePublic backend development! This guide will help you get up and running quickly.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (package manager)
- **Rust** (for Solana development)
- **Solana CLI** (for blockchain development)
- **Git** (version control)
- **VS Code** (recommended editor)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/elicharlese/ThePublic.git
cd ThePublic
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
pnpm install

# Install backend dependencies
cd backend
pnpm install

# Install Solana dependencies
cd solana
cargo build
```

### 3. Environment Setup

Copy the environment template and fill in your values:

```bash
# Backend environment
cp backend/.env.example backend/.env

# Frontend environment
cp .env.example .env.local
```

Required environment variables:

```bash
# Backend (.env)
NODE_ENV=development
PORT=3001
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Supabase
SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Solana
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_NETWORK=devnet
SOLANA_PRIVATE_KEY=your-wallet-private-key

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Database Setup

Set up your Supabase project:

```bash
# Run database migrations
cd backend/supabase
supabase db push

# Or use the SQL files directly in Supabase dashboard
```

### 5. Start Development Servers

```bash
# Start backend server (from backend directory)
cd backend
pnpm dev

# Start frontend server (from root directory)
pnpm dev
```

The backend will be available at `http://localhost:3001` and frontend at `http://localhost:3000`.

## Project Structure

```
ThePublic/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utilities
│   │   └── types/           # TypeScript types
│   ├── solana/             # Blockchain programs
│   │   └── programs/       # Rust smart contracts
│   ├── supabase/           # Database migrations
│   └── docs/               # Documentation
├── app/                    # Frontend pages
├── components/             # React components
├── hooks/                  # Custom hooks
├── lib/                    # Utilities
└── styles/                 # CSS styles
```

## Development Workflow

### 1. Feature Development

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**: Follow the coding standards and patterns

3. **Test your changes**:
   ```bash
   # Run backend tests
   cd backend
   pnpm test

   # Run frontend tests
   pnpm test
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```

### 2. API Development

When adding new API endpoints:

1. **Define types** in `backend/src/types/`
2. **Create service** in `backend/src/services/`
3. **Create controller** in `backend/src/controllers/`
4. **Add routes** in `backend/src/routes/`
5. **Add tests** in `backend/src/__tests__/`
6. **Update documentation**

Example API endpoint:

```typescript
// services/exampleService.ts
export class ExampleService {
  async getExample(id: string): Promise<Example> {
    // Implementation
  }
}

// controllers/exampleController.ts
export class ExampleController {
  static async getExample(req: Request, res: Response) {
    const { id } = req.params;
    const result = await exampleService.getExample(id);
    res.json({ success: true, data: result });
  }
}

// routes/example.ts
router.get('/:id', ExampleController.getExample);
```

### 3. Database Changes

For database schema changes:

1. **Create migration** in `backend/supabase/migrations/`
2. **Update types** if needed
3. **Test migration** locally
4. **Document changes**

### 4. Blockchain Development

For Solana smart contract changes:

1. **Modify Rust code** in `backend/solana/programs/`
2. **Write tests** in the same directory
3. **Update TypeScript integration** in `backend/src/services/solana.ts`
4. **Test on devnet** before mainnet

## Testing

### Backend Testing

```bash
cd backend

# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test auth.test.ts
```

### Frontend Testing

```bash
# Run component tests
pnpm test

# Run E2E tests
pnpm test:e2e
```

### Manual Testing

Use the API documentation at `http://localhost:3001/api/docs` to test endpoints manually.

## Debugging

### Backend Debugging

1. **Use VS Code debugger**: Add breakpoints and press F5
2. **Console logging**: Use the structured logger
   ```typescript
   import { logger } from '@/utils/logger';
   logger.info('Debug message', { data });
   ```
3. **Network debugging**: Use Postman or similar tools

### Frontend Debugging

1. **React DevTools**: Browser extension for component inspection
2. **Network tab**: Check API calls and responses
3. **Console logging**: Use `console.log` for debugging

## Code Standards

### TypeScript

- Use strict TypeScript configuration
- Define proper interfaces and types
- Avoid `any` type
- Use meaningful variable names

### Error Handling

- Always handle errors appropriately
- Use structured error responses
- Log errors with context
- Provide user-friendly error messages

### Performance

- Use pagination for large datasets
- Implement proper indexing
- Cache frequently accessed data
- Use lazy loading where appropriate

## Common Issues

### 1. Port Already in Use

```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or use different port
PORT=3002 pnpm dev
```

### 2. Database Connection Issues

- Check Supabase credentials
- Verify network connectivity
- Check RLS policies

### 3. Blockchain Connection Issues

- Verify Solana RPC endpoint
- Check wallet balance
- Ensure correct network (devnet/mainnet)

### 4. Environment Variables

- Ensure all required variables are set
- Check for typos in variable names
- Restart server after changes

## Resources

### Documentation

- [Supabase Docs](https://supabase.com/docs)
- [Solana Docs](https://docs.solana.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [Express.js Docs](https://expressjs.com/)

### Tools

- [Postman](https://www.postman.com/) - API testing
- [Supabase Dashboard](https://app.supabase.com/) - Database management
- [Solana Explorer](https://explorer.solana.com/) - Blockchain exploration

### Community

- [Discord](#) - Development discussions
- [GitHub Issues](https://github.com/elicharlese/ThePublic/issues) - Bug reports
- [GitHub Discussions](https://github.com/elicharlese/ThePublic/discussions) - Questions

## Getting Help

1. **Check this documentation** first
2. **Search existing issues** on GitHub
3. **Ask in Discord** for quick help
4. **Create GitHub issue** for bugs
5. **Start GitHub discussion** for questions

## Contributing

1. **Fork the repository**
2. **Create feature branch**
3. **Make your changes**
4. **Add tests**
5. **Update documentation**
6. **Submit pull request**

Welcome to the team! 🚀
