# Runbooks for ThePublic Backend

## Overview
This document provides step-by-step guides for deployment, monitoring, incident response, and operational procedures for ThePublic backend systems.

---

## 1. Deployment Runbook

### Prerequisites
- Access to GitHub repository
- Vercel account with deployment permissions
- Supabase project access
- Solana CLI tools installed

### Frontend & API Deployment (Vercel)
1. **Automated Deployment**
   ```bash
   # Push to main branch triggers automatic deployment
   git push origin main
   ```

2. **Manual Deployment**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel --prod
   ```

3. **Environment Variables Check**
   - Verify all required env vars are set in Vercel dashboard
   - Check Supabase connection strings
   - Validate JWT secrets and API keys

### Solana Smart Contract Deployment
1. **Build contracts**
   ```bash
   cd backend/solana
   cargo build-bpf
   ```

2. **Deploy to testnet**
   ```bash
   solana program deploy target/deploy/thepublic.so --url testnet
   ```

3. **Deploy to mainnet** (production only)
   ```bash
   solana program deploy target/deploy/thepublic.so --url mainnet-beta
   ```

### Supabase Database Updates
1. **Run migrations**
   ```bash
   npx supabase db push
   ```

2. **Verify RLS policies**
   - Check user access permissions
   - Test API endpoints with different roles

---

## 2. Monitoring & Alerting

### Health Checks
- **API Health**: Monitor `/api/health` endpoint
- **Database**: Check Supabase dashboard for connection issues
- **Blockchain**: Monitor Solana RPC response times

### Key Metrics to Monitor
- API response times (< 500ms target)
- Error rates (< 1% target)
- Database connection pool usage
- Solana transaction success rates
- User authentication success rates

### Alert Conditions
- API downtime > 2 minutes
- Error rate > 5% for 5 minutes
- Database connection failures
- Smart contract transaction failures > 10%

---

## 3. Incident Response

### Severity Levels
- **P0 (Critical)**: Complete service outage
- **P1 (High)**: Major feature unavailable
- **P2 (Medium)**: Minor feature issues
- **P3 (Low)**: Cosmetic or documentation issues

### Response Procedures

#### P0/P1 Incidents
1. **Immediate Actions**
   - Check Vercel deployment status
   - Verify Supabase service status
   - Check Solana network status
   - Review recent deployments

2. **Communication**
   - Post status update on status page
   - Notify team in incident channel
   - Communicate with users if needed

3. **Investigation**
   - Check logs in Vercel dashboard
   - Review Supabase logs
   - Monitor smart contract events
   - Identify root cause

4. **Resolution**
   - Rollback if recent deployment caused issue
   - Apply hotfix if needed
   - Verify resolution with health checks

#### Post-Incident
- Document incident in postmortem
- Identify prevention measures
- Update monitoring/alerting if needed

---

## 4. Rollback Procedures

### Frontend/API Rollback
1. **Via Vercel Dashboard**
   - Go to deployments tab
   - Select previous stable deployment
   - Click "Promote to Production"

2. **Via Git**
   ```bash
   # Revert to previous commit
   git revert HEAD
   git push origin main
   ```

### Database Rollback
1. **Minor schema changes**
   ```bash
   # Revert specific migration
   npx supabase db reset --db-url [CONNECTION_STRING]
   ```

2. **Major changes**
   - Restore from Supabase backup
   - Coordinate with team for data migration

### Smart Contract Rollback
1. **Deploy previous version**
   ```bash
   solana program deploy previous_version.so --url [NETWORK]
   ```

2. **Update frontend contract addresses**
   - Update environment variables
   - Redeploy frontend

---

## 5. Backup & Recovery

### Database Backups
- Supabase handles automatic daily backups
- Point-in-time recovery available for 7 days
- Manual backup before major deployments

### Code Repository
- All code versioned in GitHub
- Tags for release versions
- Protected main branch

### Configuration Backup
- Environment variables documented
- Deployment configurations in version control
- API keys stored securely in Vercel/Supabase

---

## 6. Performance Optimization

### Database Optimization
- Monitor slow queries in Supabase
- Add indexes for frequently queried fields
- Optimize RLS policies

### API Optimization
- Enable caching for static data
- Optimize database queries
- Use connection pooling

### Frontend Optimization
- Monitor Core Web Vitals
- Optimize bundle size
- Use CDN for static assets

---

## 7. Security Procedures

### Security Incident Response
1. **Immediate containment**
   - Disable affected endpoints if needed
   - Rotate compromised keys/tokens
   - Block malicious IPs

2. **Investigation**
   - Review access logs
   - Check for data breaches
   - Assess impact scope

3. **Recovery**
   - Apply security patches
   - Update compromised credentials
   - Notify users if required

### Regular Security Tasks
- Weekly security log review
- Monthly dependency updates
- Quarterly security audit
- Annual penetration testing

---

## 8. Maintenance Windows

### Scheduled Maintenance
- Plan during low-traffic hours (2-4 AM UTC)
- Notify users 24 hours in advance
- Prepare rollback plan

### Emergency Maintenance
- Document reason for emergency
- Communicate with stakeholders
- Monitor system closely post-maintenance

---

_Last updated: July 2, 2025_
