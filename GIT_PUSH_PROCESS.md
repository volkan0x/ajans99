# Git Push Process Guide

This guide provides comprehensive instructions for the git workflow and push process for the SaaS Starter project.

## 📋 Table of Contents

1. [Quick Reference](#quick-reference)
2. [Standard Git Workflow](#standard-git-workflow)
3. [Branch Strategy](#branch-strategy)
4. [Pre-Push Checklist](#pre-push-checklist)
5. [Automated Scripts](#automated-scripts)
6. [Common Scenarios](#common-scenarios)
7. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Reference

### Basic Push Flow
```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add new feature description"

# Push to remote
git push origin <branch-name>
```

### Using the Automated Script
```bash
# Run the git push script (includes checks)
pnpm run git:push
```

---

## 📝 Standard Git Workflow

### 1. Check Current Status
```bash
# View current changes
git status

# View branch information
git branch -v
```

### 2. Create or Switch Branch
```bash
# Create new feature branch
git checkout -b feature/your-feature-name

# Switch to existing branch
git checkout <branch-name>
```

### 3. Stage Changes
```bash
# Stage all changes
git add .

# Stage specific files
git add path/to/file.ts

# Stage interactively
git add -p
```

### 4. Commit Changes
```bash
# Commit with message
git commit -m "type: description"

# Commit with detailed message
git commit -m "type: short description" -m "Longer explanation of changes"
```

### 5. Push to Remote
```bash
# Push to current branch
git push

# Push new branch to remote
git push -u origin <branch-name>

# Force push (use with caution)
git push --force-with-lease
```

---

## 🌿 Branch Strategy

### Main Branches
- **`main`** - Production-ready code
- **`develop`** - Development integration branch (if used)

### Supporting Branches
- **`feature/*`** - New features (e.g., `feature/user-authentication`)
- **`fix/*`** - Bug fixes (e.g., `fix/login-error`)
- **`hotfix/*`** - Urgent production fixes
- **`chore/*`** - Maintenance tasks
- **`docs/*`** - Documentation updates

### Branch Naming Convention
```
type/short-description
```

**Examples:**
- `fix/dashboard-loading`
- `chore/update-dependencies`
- `docs/api-documentation`

---

## ✅ Pre-Push Checklist

Before pushing code, ensure:

### 1. Code Quality
- [ ] No TypeScript errors: `pnpm run build`
- [ ] No console errors or warnings
- [ ] Code follows project conventions
- [ ] Unused imports removed

### 2. Testing
- [ ] Application builds successfully
- [ ] Local testing completed
- [ ] Database migrations tested (if applicable)

### 3. Environment & Configuration
- [ ] No sensitive data (API keys, secrets) in code
- [ ] Environment variables documented in `.env.example`
- [ ] Dependencies properly installed

### 4. Git Hygiene
- [ ] Meaningful commit messages
- [ ] Related changes grouped in commits
- [ ] No unnecessary files committed
- [ ] `.gitignore` properly configured

---

## 🤖 Automated Scripts

### Git Push Script

Create automated push with checks:

```bash
# Run pre-push checks and push
pnpm run git:push
```

### Manual Pre-Push Checks

```bash
# Run build check
pnpm run build

# Run pre-deploy checks
pnpm run deploy:check

# Check for TypeScript errors
npx tsc --noEmit
```

---

## 🔄 Common Scenarios

### Scenario 1: First Time Pushing a Branch
```bash
# Create and switch to new branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and set upstream
git push -u origin feature/new-feature
```

### Scenario 2: Continue Working on Existing Branch
```bash
# Pull latest changes
git pull origin feature/your-branch

# Make changes and commit
git add .
git commit -m "feat: continue feature implementation"

# Push changes
git push
```

### Scenario 3: Update Branch from Main
```bash
# Switch to main and pull latest
git checkout main
git pull origin main

# Switch back to feature branch
git checkout feature/your-branch

# Merge or rebase main into your branch
git merge main
# OR
git rebase main

# Resolve conflicts if any, then push
git push
```

### Scenario 4: Fix Last Commit Message
```bash
# Amend last commit
git commit --amend -m "corrected: new commit message"

# Force push with lease (safer than force push)
git push --force-with-lease
```

### Scenario 5: Undo Last Commit (Keep Changes)
```bash
# Undo last commit, keep changes staged
git reset --soft HEAD~1

# Make corrections and commit again
git commit -m "corrected commit"
```

### Scenario 6: Push with Pre-Deploy Checks
```bash
# Run pre-deploy checks before pushing
./scripts/pre-deploy.sh && git push
```

---

## 📏 Commit Message Conventions

Follow the Conventional Commits specification:

### Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks
- **ci**: CI/CD changes
- **build**: Build system changes

### Examples
```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve dashboard loading issue"
git commit -m "docs: update API documentation"
git commit -m "chore: update dependencies"
git commit -m "refactor: improve database query performance"
```

---

## 🛡️ Protected Branch Rules

When working with protected branches (like `main`):

1. **Never push directly to main**
2. **Always create a Pull Request**
3. **Ensure CI checks pass**
4. **Get required reviews**
5. **Squash or merge appropriately**

### Creating a Pull Request Flow
```bash
# Push your feature branch
git push -u origin feature/your-feature

# Create PR via GitHub CLI
gh pr create --title "Add new feature" --body "Description of changes"

# Or create PR via GitHub web interface
```

---

## 🔍 Troubleshooting

### Issue: Push Rejected (Non-Fast-Forward)
```bash
# Pull latest changes first
git pull --rebase origin <branch-name>

# Resolve conflicts if any
# Then push
git push
```

### Issue: Accidentally Committed Sensitive Data
```bash
# Remove from last commit
git rm --cached path/to/sensitive/file
git commit --amend

# Remove from history (use with caution)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/file" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (coordinate with team)
git push origin --force --all
```

### Issue: Need to Push but Build Fails
```bash
# Check build errors
pnpm run build

# Fix errors, then commit and push
git add .
git commit -m "fix: resolve build errors"
git push
```

### Issue: Branch Behind Remote
```bash
# Fetch latest changes
git fetch origin

# Rebase your changes on top of remote
git rebase origin/<branch-name>

# Push updates
git push
```

### Issue: Merge Conflicts
```bash
# Pull with rebase
git pull --rebase origin main

# Fix conflicts in files
# After fixing each file:
git add <resolved-file>

# Continue rebase
git rebase --continue

# Push changes
git push
```

---

## 🔗 Integration with Vercel

After pushing to GitHub:

1. **Automatic Deployments**: Vercel automatically deploys on push to `main`
2. **Preview Deployments**: Feature branches get preview URLs
3. **Check Deploy Status**: Use `gh pr status` or Vercel dashboard

### Useful Commands
```bash
# Check deployment status
vercel ls

# View latest deployment
vercel inspect

# See logs
vercel logs
```

---

## 📚 Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Vercel Git Integration](https://vercel.com/docs/git)

---

## 💡 Best Practices

1. **Commit Often**: Make small, focused commits
2. **Write Clear Messages**: Future you will thank you
3. **Pull Before Push**: Avoid conflicts
4. **Use Branches**: Keep main clean
5. **Review Before Push**: Double-check changes
6. **Test Locally**: Ensure code works
7. **Keep History Clean**: Use rebase when appropriate
8. **Protect Secrets**: Never commit sensitive data

---

## 🆘 Getting Help

If you encounter issues:
1. Check this guide
2. Review error messages carefully
3. Search GitHub issues
4. Ask the team
5. Check Git documentation

Remember: `git reflog` is your friend if you need to undo something!
