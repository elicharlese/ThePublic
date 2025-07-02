# Deployment Guide for ThePublic Backend

## Overview
This guide covers the complete deployment process for ThePublic backend infrastructure, including the frontend, API, Solana smart contracts, and Supabase configuration.

---

## Prerequisites

### Required Tools
- Node.js 18+ and pnpm
- Rust and Solana CLI
- Git
- Vercel CLI
- Supabase CLI

### Required Accounts
- GitHub account with repository access
- Vercel account
- Supabase account
- Solana wallet for program deployment

---

## 1. Environment Setup

### Local Development
```bash
# Clone the repository
git clone https://github.com/elicharlese/ThePublic.git
cd ThePublic

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Environment Variables
```bash
# Required for all environments
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://thepublic.network

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_PRIVATE_KEY=your_deployment_private_key

# Email Configuration (optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 2. Supabase Setup

### Database Setup
1. Create a new Supabase project
2. Run database migrations:
   ```bash
   npx supabase db push
   ```

3. Set up Row Level Security (RLS) policies:
   ```sql
   -- Enable RLS on all tables
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;
   ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
   ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
   ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

   -- User policies
   CREATE POLICY "Users can view own data" ON users
     FOR SELECT USING (auth.uid() = id);

   CREATE POLICY "Users can update own data" ON users
     FOR UPDATE USING (auth.uid() = id);

   -- Node policies
   CREATE POLICY "Authenticated users can view nodes" ON nodes
     FOR SELECT TO authenticated USING (true);

   CREATE POLICY "Node owners can manage their nodes" ON nodes
     FOR ALL USING (auth.uid() = owner_id);

   -- Blog policies
   CREATE POLICY "Anyone can view published posts" ON blog_posts
     FOR SELECT USING (published = true);

   CREATE POLICY "Admins can manage all posts" ON blog_posts
     FOR ALL USING (
       EXISTS (
         SELECT 1 FROM users 
         WHERE users.id = auth.uid() 
         AND users.role = 'admin'
       )
     );
   ```

### Authentication Setup
1. Configure authentication providers in Supabase dashboard
2. Set up email templates
3. Configure redirect URLs for production

### Storage Setup
1. Create storage buckets for user uploads
2. Set up storage policies for secure access

---

## 3. Solana Smart Contract Deployment

### Build Contracts
```bash
cd backend/solana

# Build all programs
anchor build

# Run tests
anchor test
```

### Deploy to Testnet
```bash
# Set Solana CLI to testnet
solana config set --url testnet

# Airdrop SOL for deployment (testnet only)
solana airdrop 2

# Deploy node registry program
anchor deploy --program-name node-registry

# Deploy proof of coverage program
anchor deploy --program-name proof-of-coverage

# Deploy micropayment channels program
anchor deploy --program-name micropayment-channels

# Verify deployments
solana program show <PROGRAM_ID>
```

### Deploy to Mainnet
```bash
# Set Solana CLI to mainnet
solana config set --url mainnet-beta

# Ensure you have sufficient SOL for deployment
solana balance

# Deploy programs
anchor deploy --program-name node-registry --provider.cluster mainnet
anchor deploy --program-name proof-of-coverage --provider.cluster mainnet
anchor deploy --program-name micropayment-channels --provider.cluster mainnet

# Update program IDs in frontend configuration
```

### Update Program IDs
After deployment, update the program IDs in your frontend configuration:

```typescript
// lib/solana-wallet-config.ts
export const PROGRAM_IDS = {
  nodeRegistry: 'YourNodeRegistryProgramId',
  proofOfCoverage: 'YourProofOfCoverageProgramId',
  micropaymentChannels: 'YourMicropaymentChannelsProgramId',
};
```

---

## 4. Vercel Deployment

### Automatic Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Enable automatic deployments from main branch

### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Set environment variables
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
# ... add all required environment variables
```

### Vercel Configuration
Create or update `vercel.json`:
```json
{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "env": {
    "NODE_ENV": "production"
  },
  "regions": ["iad1"],
  "github": {
    "enabled": true,
    "autoAlias": false
  }
}
```

---

## 5. Domain and SSL Setup

### Custom Domain
1. Add custom domain in Vercel dashboard
2. Configure DNS records:
   ```
   Type: A
   Name: @
   Value: 76.76.19.61

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### SSL Certificate
- Vercel automatically provides SSL certificates
- Verify HTTPS is working correctly
- Set up HSTS headers for security

---

## 6. Monitoring and Logging

### Vercel Analytics
- Enable Vercel Analytics in project settings
- Monitor Core Web Vitals and performance metrics

### External Monitoring
Set up external monitoring services:
- Uptime monitoring (e.g., Pingdom, UptimeRobot)
- Error tracking (e.g., Sentry)
- Performance monitoring (e.g., New Relic)

### Log Management
- Use Vercel's built-in logging
- Set up log aggregation if needed
- Configure alerts for errors and issues

---

## 7. Backup and Recovery

### Database Backups
- Supabase provides automatic daily backups
- Set up additional backup schedules if needed
- Test restore procedures regularly

### Code Backups
- All code is version controlled in GitHub
- Use Git tags for release versions
- Maintain deployment documentation

### Configuration Backups
- Document all environment variables
- Backup Vercel project settings
- Store deployment scripts and configurations

---

## 8. Security Checklist

### Pre-deployment Security
- [ ] All API endpoints are properly authenticated
- [ ] Rate limiting is configured
- [ ] Input validation is implemented
- [ ] SQL injection protection is in place
- [ ] CORS is properly configured
- [ ] Environment variables are secure
- [ ] No secrets in code repository

### Post-deployment Security
- [ ] HTTPS is enforced
- [ ] Security headers are configured
- [ ] CSP (Content Security Policy) is set up
- [ ] Regular security updates are scheduled
- [ ] Access logs are monitored
- [ ] Incident response plan is in place

---

## 9. Performance Optimization

### Frontend Optimization
- Enable Next.js Image Optimization
- Use Vercel Edge Functions where appropriate
- Implement proper caching strategies
- Optimize bundle size

### Database Optimization
- Index frequently queried columns
- Optimize RLS policies
- Use connection pooling
- Monitor query performance

### CDN and Caching
- Vercel provides automatic CDN
- Configure cache headers appropriately
- Use edge caching for static content

---

## 10. Rollback Procedures

### Quick Rollback
```bash
# Rollback to previous deployment via Vercel dashboard
# OR revert Git commit and push
git revert HEAD
git push origin main
```

### Database Rollback
```bash
# Use Supabase dashboard to restore from backup
# OR run migration rollback
npx supabase db reset --db-url "your-db-url"
```

### Smart Contract Rollback
```bash
# Deploy previous version of smart contracts
anchor deploy --program-name node-registry --program-path ./previous-version/
```

---

## 11. Post-Deployment Verification

### Health Checks
- [ ] Frontend loads correctly
- [ ] API endpoints respond properly
- [ ] Database connections work
- [ ] Authentication functions
- [ ] Solana integration works
- [ ] Real-time features work
- [ ] Email notifications work

### Performance Checks
- [ ] Page load times < 3 seconds
- [ ] API response times < 500ms
- [ ] Core Web Vitals are green
- [ ] No JavaScript errors
- [ ] Mobile responsiveness works

### Security Checks
- [ ] SSL certificate is valid
- [ ] Security headers are present
- [ ] No sensitive data exposed
- [ ] Rate limiting works
- [ ] Authentication/authorization works

---

## Troubleshooting

### Common Issues

**Build Failures**
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check environment variables

**Database Connection Issues**
- Verify Supabase credentials
- Check network connectivity
- Validate RLS policies

**Solana Integration Issues**
- Verify program IDs are correct
- Check network configuration
- Validate wallet connections

**Performance Issues**
- Check bundle size
- Verify caching configuration
- Monitor database queries

---

_Last updated: July 2, 2025_
