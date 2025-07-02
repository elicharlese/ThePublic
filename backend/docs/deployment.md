# Deployment Guide

This guide covers deploying ThePublic backend to production environments.

## Deployment Platforms

### Vercel (Recommended)

Vercel provides seamless deployment for both frontend and backend (serverless functions).

#### Setup

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Configure vercel.json**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "backend/src/index.ts",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/backend/src/index.ts"
       }
     ]
   }
   ```

4. **Deploy**
   ```bash
   vercel --prod
   ```

#### Environment Variables

Set these in Vercel dashboard:

```bash
NODE_ENV=production
SUPABASE_URL=your_production_supabase_url
SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_key
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
JWT_SECRET=your_secure_jwt_secret
```

### Alternative Platforms

#### Railway

1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

#### DigitalOcean App Platform

1. Create new app from GitHub
2. Configure build settings
3. Set environment variables

## Database Deployment

### Supabase

1. **Create Production Project**
   - Sign up at supabase.com
   - Create new project
   - Note the URL and keys

2. **Run Migrations**
   ```bash
   npx supabase db push --local
   ```

3. **Set up Row Level Security (RLS)**
   - Enable RLS on all tables
   - Create policies for user access

### Database Schema

See `backend/supabase/migrations/` for the complete database schema.

## Solana Program Deployment

### Mainnet Deployment

1. **Build Program**
   ```bash
   cd backend/solana
   anchor build
   ```

2. **Deploy to Mainnet**
   ```bash
   solana config set --url mainnet-beta
   anchor deploy --provider.cluster mainnet-beta
   ```

3. **Update Program ID**
   Update the program ID in your environment variables.

## Monitoring and Logging

### Error Tracking

Use Sentry for error tracking:

```bash
npm install @sentry/node
```

Configure in your application:

```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Performance Monitoring

- Use Vercel Analytics for performance insights
- Set up custom metrics for API response times
- Monitor database query performance

### Logging

Production logs are handled by Winston:

- Error logs: Stored in files and sent to external service
- Access logs: API request/response logging
- Performance logs: Slow query detection

## Security Considerations

### HTTPS

- Vercel provides HTTPS by default
- Custom domains require SSL certificate setup

### Secrets Management

- Never commit secrets to repository
- Use Vercel environment variables
- Rotate secrets regularly

### Rate Limiting

Production rate limits:
- 1000 requests per hour per IP
- 100 requests per minute per authenticated user

### Database Security

- Enable Row Level Security (RLS)
- Use least-privilege access patterns
- Regular security audits

## Backup and Recovery

### Database Backups

Supabase provides automatic backups:
- Daily backups retained for 7 days
- Weekly backups retained for 4 weeks
- Manual backups before major deployments

### Disaster Recovery

1. **Database Recovery**
   - Restore from Supabase backup
   - Verify data integrity

2. **Application Recovery**
   - Redeploy from Git
   - Verify environment variables
   - Test critical endpoints

## Performance Optimization

### Caching

- Use Redis for session storage
- Implement API response caching
- Cache static assets with CDN

### Database Optimization

- Index frequently queried columns
- Use database connection pooling
- Optimize N+1 query patterns

### API Optimization

- Implement pagination for large datasets
- Use compression middleware
- Optimize JSON response sizes

## Health Checks

Implement comprehensive health checks:

```typescript
// Health check endpoint
app.get('/health', async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    solana: await checkSolanaConnection(),
    external_apis: await checkExternalServices(),
  };
  
  const healthy = Object.values(checks).every(check => check);
  
  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'OK' : 'UNHEALTHY',
    checks,
    timestamp: new Date().toISOString(),
  });
});
```

## Rollback Strategy

### Automated Rollback

GitHub Actions can automatically rollback on deployment failure:

```yaml
- name: Health Check
  run: |
    sleep 30
    curl -f ${{ secrets.HEALTH_CHECK_URL }} || exit 1

- name: Rollback on Failure
  if: failure()
  run: vercel --prod --rollback
```

### Manual Rollback

```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-id]
```

## Monitoring Dashboard

Set up monitoring with:

- Vercel Analytics: Performance metrics
- Supabase Dashboard: Database metrics
- Custom Grafana: Application metrics
- Uptime monitoring: External service checks
