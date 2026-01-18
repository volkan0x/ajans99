# 🚀 Vercel Deployment - Quick Reference

## One-Time Setup

```bash
# Install Vercel CLI
pnpm add -g vercel@latest

# Login to Vercel
vercel login

# Link project
vercel link
```

## Deploy Commands

| Command | What it does |
|---------|--------------|
| `pnpm deploy` | Quick preview deployment |
| `pnpm deploy:prod` | Quick production deployment |
| `pnpm deploy:check` | Run all pre-deployment checks |
| `pnpm deploy:production` | Safe deploy (checks + prod) |

## GitHub Actions Setup (5 min)

1. **Get Vercel IDs:**
   ```bash
   vercel link
   cat .vercel/project.json
   ```

2. **Add GitHub Secrets:**
   - Go to: `Settings → Secrets → Actions → New secret`
   - Add: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
   - Add env vars: `POSTGRES_URL`, `STRIPE_SECRET_KEY`, `AUTH_SECRET`, `BASE_URL`

3. **Push to trigger:**
   ```bash
   git push origin main  # → Production
   git push origin develop  # → Staging
   # PR to main  # → Preview
   ```

## Environment Variables

```bash
# Add variable to Vercel
vercel env add VARIABLE_NAME production

# Pull variables locally
vercel env pull .env.local

# List all variables
vercel env ls
```

## Troubleshooting

```bash
# Check build locally
pnpm build

# Run pre-deploy checks
pnpm deploy:check

# View deployment logs
vercel logs [deployment-url]

# Force redeploy
vercel --prod --force
```

## Emergency Rollback

```bash
# Option 1: CLI
vercel rollback

# Option 2: Dashboard
# Deployments → Previous deployment → Promote to Production
```

## Files Created

- `.github/workflows/deploy.yml` - GitHub Actions workflow
- `vercel.json` - Vercel configuration
- `.vercelignore` - Files to exclude from deployment
- `scripts/pre-deploy.sh` - Pre-deployment checks script
- `app/api/health/route.ts` - Health check endpoint
- `VERCEL_PUSH_PROCESS.md` - Complete deployment guide

## Quick Health Check

```bash
# After deployment, test:
curl https://yourapp.vercel.app/health
# Should return: {"status":"healthy",...}
```

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Build fails | Run `pnpm build` locally first |
| Env vars not working | Redeploy after adding: `vercel --prod --force` |
| Can't connect | Verify `POSTGRES_URL` in Vercel dashboard |
| Auth issues | `vercel logout && vercel login` |

## Next Steps

1. ✅ Set up GitHub secrets
2. ✅ Configure environment variables in Vercel
3. ✅ Run `pnpm deploy:check`
4. ✅ Deploy: `git push origin main`
5. ✅ Test: Visit your Vercel URL
6. ✅ Configure custom domain (optional)
7. ✅ Set up Stripe webhook in production

---

📖 **Full Guide:** See [VERCEL_PUSH_PROCESS.md](./VERCEL_PUSH_PROCESS.md)
