# GitHub Actions Workflows

This directory contains automated CI/CD workflows for deploying to Vercel.

## Workflows

### `deploy.yml` - Vercel Deployment Workflow

Automates deployments to Vercel with pre-deployment checks.

#### Triggers

- **Pull Requests to `main`**: Creates preview deployments
- **Push to `main`**: Deploys to production
- **Push to `develop`**: Deploys to staging

#### Jobs

1. **lint-and-test**
   - Runs on all triggers
   - Type checks with TypeScript
   - Builds the application
   - Must pass before deployment

2. **deploy-preview**
   - Runs for pull requests
   - Creates preview deployment
   - Comments on PR with deployment URL

3. **deploy-production**
   - Runs on push to `main`
   - Deploys to production environment
   - Creates deployment summary

4. **deploy-develop**
   - Runs on push to `develop`
   - Deploys to staging environment
   - Creates deployment summary

## Setup Instructions

### 1. Create Vercel Token

1. Go to [Vercel Account Settings → Tokens](https://vercel.com/account/tokens)
2. Create a new token with appropriate scope
3. Copy the token

### 2. Get Project IDs

Run in your project directory:
```bash
vercel link
cat .vercel/project.json
```

You'll see:
```json
{
  "orgId": "team_xxxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxxx"
}
```

### 3. Add GitHub Secrets

Go to your repository: **Settings → Secrets and variables → Actions**

Add these secrets:

| Secret Name | Value | Description |
|------------|-------|-------------|
| `VERCEL_TOKEN` | `YOUR_VERCEL_TOKEN` | Token from step 1 |
| `VERCEL_ORG_ID` | `team_xxxxxxxxxxxxx` | From `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | `prj_xxxxxxxxxxxxx` | From `.vercel/project.json` |
| `POSTGRES_URL` | `postgresql://...` | Production database URL |
| `STRIPE_SECRET_KEY` | `sk_live_...` | Production Stripe key |
| `AUTH_SECRET` | Generate with `openssl rand -base64 32` | Auth secret |
| `BASE_URL` | `https://yourapp.vercel.app` | Production URL |

### 4. Create GitHub Environment (Optional)

For production deployments with additional protection:

1. Go to **Settings → Environments**
2. Create `production` environment
3. Add protection rules:
   - Required reviewers
   - Wait timer
   - Deployment branches (main only)

## Usage

### Automatic Deployments

**Preview (Pull Request)**
```bash
git checkout -b feature/new-feature
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
# Create PR → Automatic preview deployment
```

**Production (Main Branch)**
```bash
git checkout main
git merge feature/new-feature
git push origin main
# Automatic production deployment
```

**Staging (Develop Branch)**
```bash
git checkout develop
git merge feature/new-feature
git push origin develop
# Automatic staging deployment
```

### Manual Workflow Trigger

You can also trigger workflows manually from the Actions tab.

## Workflow Features

### Pre-deployment Checks
- ✅ Type checking
- ✅ Build validation
- ✅ Dependency installation

### Security
- 🔒 Secrets stored in GitHub
- 🔒 Environment-specific variables
- 🔒 Production environment protection

### Notifications
- 💬 PR comments with preview URLs
- 📊 Deployment summaries
- ❌ Failure notifications

### Optimization
- ⚡ Parallel dependency installation
- ⚡ Cached node_modules
- ⚡ Pre-built artifacts

## Monitoring

### View Workflow Status

1. Go to repository **Actions** tab
2. Select workflow run
3. View logs for each job

### Deployment URLs

- **Preview**: Posted as PR comment
- **Production**: In job summary + Vercel dashboard
- **Staging**: In job summary + Vercel dashboard

## Troubleshooting

### Workflow Fails at Build

Check build logs:
```yaml
- name: Build Project Artifacts
  run: vercel build --token=${{ secrets.VERCEL_TOKEN }}
```

Common issues:
- Missing dependencies
- TypeScript errors
- Environment variables not set

### Authentication Errors

Verify secrets are set correctly:
- `VERCEL_TOKEN` is valid
- `VERCEL_ORG_ID` matches your organization
- `VERCEL_PROJECT_ID` matches your project

### Environment Variables Not Available

Ensure all required secrets are added in GitHub:
- Settings → Secrets and variables → Actions
- Check secret names match exactly

## Customization

### Add Additional Checks

Add to `lint-and-test` job:

```yaml
- name: Run tests
  run: pnpm test

- name: Lint code
  run: pnpm lint
```

### Change Deployment Branches

Modify trigger branches:

```yaml
on:
  push:
    branches:
      - main
      - staging  # Add staging branch
      - production  # Add production branch
```

### Add Notifications

Add Slack/Discord notifications:

```yaml
- name: Notify Slack
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "Deployment to production successful!"
      }
```

## Best Practices

1. **Always test locally first**
   ```bash
   pnpm deploy:check
   pnpm build
   ```

2. **Use preview deployments for testing**
   - Create PR
   - Test preview URL
   - Merge when ready

3. **Monitor deployments**
   - Check Actions tab
   - Review Vercel dashboard
   - Monitor error tracking

4. **Keep secrets secure**
   - Never commit secrets
   - Rotate tokens regularly
   - Use environment-specific secrets

5. **Use semantic commits**
   ```bash
   feat: Add new feature
   fix: Fix bug
   chore: Update dependencies
   ```

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [GitHub Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
