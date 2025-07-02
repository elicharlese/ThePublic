# Backend Development Setup Guide

This document guides you through setting up the backend development environment for ThePublic.

## Prerequisites

- Node.js 18.x or higher
- npm or pnpm
- Git
- Supabase account
- Solana CLI (for blockchain development)
- Rust (for Solana programs)

## Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/elicharlese/ThePublic.git
   cd ThePublic
   ```

2. **Install dependencies**
   ```bash
   # Frontend dependencies
   npm install
   
   # Backend dependencies
   cd backend
   npm install
   ```

3. **Environment variables**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. **Database setup**
   - Create a Supabase project
   - Run database migrations (see `backend/supabase/` folder)
   - Update environment variables

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Type checking
npm run type-check
```

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   ├── types/           # TypeScript types
│   └── test/            # Test files
├── docs/                # Documentation
├── logs/                # Application logs
└── dist/                # Build output
```

## API Documentation

The API documentation is available at `/api/docs` when running the development server.

## Testing

- Unit tests: `npm test`
- Integration tests: `npm run test:integration`
- Coverage: `npm run test:coverage`

## Deployment

The application is automatically deployed to Vercel when changes are pushed to the main branch.

## Contributing

1. Create a feature branch
2. Make your changes
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## Troubleshooting

Common issues and solutions:

1. **Database connection issues**: Check Supabase credentials
2. **Build failures**: Ensure all environment variables are set
3. **Test failures**: Check mock configurations in test setup

For more help, see the specific documentation files in this folder.
