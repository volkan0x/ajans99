# Deployment Guide - Vercel

This guide explains how to deploy your SaaS application to Vercel.

## Prerequisites

1. A Vercel account (https://vercel.com)
2. Your production database set up (e.g., Vercel Postgres, Neon, Supabase)
3. Stripe production keys
4. Environment variables ready

## Deployment Methods

### Method 1: GitHub Integration (Recommended)

This method automatically deploys your app when you push to GitHub.

#### Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### Step 2: Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure your project:
   - **Framework Preset**: Next.js
   - **Build Command**: `next build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `pnpm install`

#### Step 3: Configure Environment Variables

Add these environment variables in Vercel Project Settings → Environment Variables:

```
POSTGRES_URL=postgresql://your-production-db-url
STRIPE_SECRET_KEY=sk_live_***
STRIPE_WEBHOOK_SECRET=whsec_***
BASE_URL=https://your-domain.vercel.app
AUTH_SECRET=your-production-secret
```

**Important:** 
- Use production Stripe keys (starts with `sk_live_`)
- Generate a new `AUTH_SECRET` with: `openssl rand -base64 32`
- Update `BASE_URL` to your actual Vercel domain

#### Step 4: Deploy

1. Click "Deploy"
2. Vercel will build and deploy your app
3. Access your app at the provided URL

#### Step 5: Set up Stripe Production Webhook

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your webhook URL: `https://your-domain.vercel.app/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the webhook signing secret and update `STRIPE_WEBHOOK_SECRET` in Vercel

### Method 2: Vercel CLI

Deploy directly from your terminal using the Vercel CLI.

#### Step 1: Install Vercel CLI (if not already installed)

```bash
npm i -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

Visit the provided URL and authenticate.

#### Step 3: Deploy to Preview

```bash
# Deploy to a preview environment
pnpm deploy
# or
vercel
```

#### Step 4: Deploy to Production

```bash
# Deploy to production
pnpm deploy:prod
# or
vercel --prod
```

The CLI will guide you through:
- Linking to an existing project or creating a new one
- Setting up environment variables
- Deploying your application

## Post-Deployment Checklist

### 1. Run Database Migrations

If you haven't run migrations on your production database:

```bash
# Set POSTGRES_URL to your production database
export POSTGRES_URL="postgresql://your-production-db-url"
pnpm db:migrate
```

### 2. Verify Environment Variables

Check that all environment variables are set correctly in Vercel:
- [ ] POSTGRES_URL
- [ ] STRIPE_SECRET_KEY (production key)
- [ ] STRIPE_WEBHOOK_SECRET (production webhook)
- [ ] BASE_URL (your Vercel domain)
- [ ] AUTH_SECRET (production secret)

### 3. Test Your Application

- [ ] Visit your deployed URL
- [ ] Test user registration
- [ ] Test login/logout
- [ ] Test Stripe checkout with test card
- [ ] Verify webhook events are received

### 4. Configure Custom Domain (Optional)

1. Go to Vercel Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `BASE_URL` environment variable

### 5. Set up Monitoring

Consider setting up:
- Vercel Analytics (built-in)
- Error tracking (Sentry, LogRocket)
- Uptime monitoring

## Continuous Deployment

With GitHub integration, every push to your default branch automatically triggers a new deployment:

```bash
git add .
git commit -m "Update feature"
git push origin main
# Vercel automatically deploys!
```

Preview deployments are created for pull requests automatically.

## Troubleshooting

### Build Fails

- Check Vercel build logs for errors
- Ensure all dependencies are in `package.json`
- Verify `next build` works locally

### Database Connection Issues

- Verify `POSTGRES_URL` is correct
- Ensure database allows connections from Vercel IPs
- Check if migrations have been run

### Stripe Webhooks Not Working

- Verify webhook URL is correct
- Check `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- Review webhook logs in Stripe dashboard

### Environment Variables Not Applied

- Redeploy after changing environment variables
- Check variable names match exactly (case-sensitive)

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
