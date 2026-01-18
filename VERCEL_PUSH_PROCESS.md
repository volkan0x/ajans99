# Vercel Push Process Guide

This guide provides comprehensive instructions for deploying your SaaS application to Vercel using various methods.

## 📋 Table of Contents

1. [Initial Setup](#initial-setup)
2. [GitHub Actions Deployment (Automated)](#github-actions-deployment)
3. [Manual CLI Deployment](#manual-cli-deployment)
4. [Available Scripts](#available-scripts)
5. [Environment Variables](#environment-variables)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Initial Setup

### 1. Install Vercel CLI

```bash
pnpm add -g vercel@latest
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Link Your Project

```bash
vercel link
```

Follow the prompts to:
- Select your Vercel scope (personal or team)
- Link to existing project or create new one
- Confirm project settings

---

## 🤖 GitHub Actions Deployment (Automated)

### Setup GitHub Secrets

Add the following secrets to your GitHub repository:

**Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Description | How to Get |
|------------|-------------|------------|
| `VERCEL_TOKEN` | Vercel API token | [Vercel Settings → Tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Your Vercel organization ID | Run `vercel link` and check `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Your Vercel project ID | Run `vercel link` and check `.vercel/project.json` |
| `POSTGRES_URL` | Production database URL | Your database provider |
| `STRIPE_SECRET_KEY` | Stripe production key | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `AUTH_SECRET` | Auth secret key | Generate with: `openssl rand -base64 32` |
| `BASE_URL` | Your production URL | e.g., `https://yourapp.vercel.app` |

### Get Vercel IDs

```bash
# Link your project first
vercel link

# View project details
cat .vercel/project.json
```

Output will look like:
```json
{
  "orgId": "team_xxxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxxx"
}
```

### Deployment Workflows

The GitHub Actions workflow automatically handles:

#### **Preview Deployments**
- Triggered on: Pull requests to `main`
- Environment: Preview
- Comments PR with deployment URL
- Runs type checks and build tests first

#### **Production Deployments**
- Triggered on: Push to `main` branch
- Environment: Production
- Requires all checks to pass
- Updates production environment

#### **Staging Deployments**
- Triggered on: Push to `develop` branch
- Environment: Staging
- For testing before production

### Workflow Features

✅ **Pre-deployment checks:**
- Type checking with TypeScript
- Build validation
- Dependency installation

✅ **Automatic deployments:**
- Preview for PRs
- Production for main branch
- Staging for develop branch

✅ **Notifications:**
- PR comments with preview URLs
- GitHub deployment summaries
- Failed build notifications

---

## 💻 Manual CLI Deployment

### Quick Deploy Commands

```bash
# Preview deployment (development)
pnpm deploy

# Production deployment with pre-checks
pnpm deploy:production

# Production deployment (direct)
pnpm deploy:prod

# Run pre-deployment checks only
pnpm deploy:check
```

### Step-by-Step Manual Deployment

#### 1. Run Pre-deployment Checks

```bash
pnpm deploy:check
```

This script checks:
- ✓ Required commands (node, pnpm, vercel)
- ✓ Required files (package.json, next.config.ts, vercel.json)
- ✓ Environment variables
- ✓ Dependencies installed
- ✓ TypeScript type checking
- ✓ Build success

#### 2. Deploy to Preview

```bash
vercel
```

Or with alias:
```bash
pnpm deploy:preview
```

This creates a preview deployment with a unique URL.

#### 3. Deploy to Production

```bash
vercel --prod
```

Or with pre-checks:
```bash
pnpm deploy:production
```

### Advanced CLI Options

```bash
# Pull Vercel environment configuration
pnpm vercel:pull

# Build locally for Vercel
pnpm vercel:build

# Build for production
pnpm vercel:build:prod

# Deploy with specific environment variables
vercel --env NODE_ENV=production

# Deploy to specific region
vercel --regions iad1

# Deploy with build override
vercel --build-env NEXT_PUBLIC_API_URL=https://api.example.com
```

---

## 📝 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `deploy` | `vercel` | Quick preview deployment |
| `deploy:prod` | `vercel --prod` | Quick production deployment |
| `deploy:check` | `./scripts/pre-deploy.sh` | Run pre-deployment checks |
| `deploy:preview` | `vercel` | Preview deployment (explicit) |
| `deploy:production` | Pre-check + deploy | Safe production deployment |
| `vercel:pull` | `vercel pull --yes` | Pull Vercel configuration |
| `vercel:build` | `vercel build` | Build for Vercel preview |
| `vercel:build:prod` | `vercel build --prod` | Build for production |

---

## 🔐 Environment Variables

### Required Variables

```bash
# Database
POSTGRES_URL="postgresql://user:pass@host:5432/database"

# Authentication
AUTH_SECRET="your-secret-key-here"

# Stripe
STRIPE_SECRET_KEY="sk_live_xxxxxxxxxxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxx"

# Application
BASE_URL="https://yourapp.vercel.app"
NODE_ENV="production"
```

### Setting Environment Variables in Vercel

#### Via Dashboard:
1. Go to project settings
2. Navigate to "Environment Variables"
3. Add each variable for appropriate environments

#### Via CLI:
```bash
# Set a variable for production
vercel env add POSTGRES_URL production

# Set a variable for preview and development
vercel env add AUTH_SECRET preview development

# Pull environment variables to local
vercel env pull .env.local
```

### Environment Variable Scopes

- **Production**: Used in production deployments
- **Preview**: Used in preview deployments (PRs, develop branch)
- **Development**: Used when running `vercel dev` locally

---

## 🔧 Troubleshooting

### Build Failures

**Issue**: Build fails on Vercel
```
Error: Module not found...
```

**Solutions**:
1. Ensure all dependencies are in `package.json`:
   ```bash
   pnpm install
   git add package.json pnpm-lock.yaml
   git commit -m "Update dependencies"
   git push
   ```

2. Check build logs in Vercel dashboard
3. Test build locally:
   ```bash
   pnpm build
   ```

### Environment Variable Issues

**Issue**: Environment variables not working

**Solutions**:
1. Verify variables are set in Vercel dashboard
2. Check variable names (case-sensitive)
3. Redeploy after adding/changing variables:
   ```bash
   vercel --prod --force
   ```

4. Pull and verify locally:
   ```bash
   vercel env pull .env.local
   cat .env.local
   ```

### Database Connection Errors

**Issue**: Cannot connect to database

**Solutions**:
1. Verify `POSTGRES_URL` is correct
2. Check database allows Vercel IPs
3. Ensure SSL/TLS settings are correct
4. Test connection locally:
   ```bash
   pnpm db:studio
   ```

### Deployment Webhook Issues

**Issue**: GitHub Actions not triggering

**Solutions**:
1. Check workflow file syntax:
   ```bash
   cat .github/workflows/deploy.yml
   ```

2. Verify GitHub secrets are set
3. Check Actions tab for error messages
4. Ensure branch names match workflow triggers

### Pre-deploy Script Fails

**Issue**: `pnpm deploy:check` fails

**Solutions**:
1. Check script permissions:
   ```bash
   chmod +x scripts/pre-deploy.sh
   ```

2. Run individual checks:
   ```bash
   pnpm tsc --noEmit
   pnpm build
   ```

3. Verify environment variables:
   ```bash
   cat .env
   ```

### Stripe Webhook Not Receiving Events

**Issue**: Stripe events not being processed

**Solutions**:
1. Update webhook URL in Stripe dashboard:
   ```
   https://yourapp.vercel.app/api/stripe/webhook
   ```

2. Verify webhook secret:
   ```bash
   vercel env ls
   ```

3. Check webhook logs in Stripe dashboard
4. Test webhook locally:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

### CLI Authentication Issues

**Issue**: `vercel` command not authenticated

**Solutions**:
```bash
# Logout and login again
vercel logout
vercel login

# Or use token directly
vercel --token YOUR_TOKEN
```

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [GitHub Actions with Vercel](https://vercel.com/guides/how-can-i-use-github-actions-with-vercel)

---

## 🎯 Quick Reference

### First Time Deployment
```bash
# 1. Install and login
pnpm add -g vercel@latest
vercel login

# 2. Link project
vercel link

# 3. Set environment variables
vercel env add POSTGRES_URL production
vercel env add STRIPE_SECRET_KEY production
vercel env add AUTH_SECRET production

# 4. Deploy
vercel --prod
```

### Regular Deployments
```bash
# With GitHub (automatic)
git add .
git commit -m "Your changes"
git push origin main

# With CLI (manual)
pnpm deploy:production
```

### Emergency Rollback
```bash
# Via Vercel dashboard
# 1. Go to Deployments
# 2. Find previous working deployment
# 3. Click "..." → "Promote to Production"

# Via CLI
vercel rollback
```

---

## ✅ Deployment Checklist

Before deploying to production:

- [ ] All tests passing locally
- [ ] Environment variables configured in Vercel
- [ ] Database migrations run on production database
- [ ] Stripe webhook configured with production URL
- [ ] `AUTH_SECRET` generated and set
- [ ] `BASE_URL` set to production domain
- [ ] Pre-deploy checks passing (`pnpm deploy:check`)
- [ ] Build succeeds locally (`pnpm build`)
- [ ] Type checks passing (`pnpm tsc --noEmit`)

---

Need help? Check the [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed Vercel setup instructions.
