#!/bin/bash

# Vercel Deployment Pre-Check Script
# This script verifies that all necessary configurations are in place before deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=================================${NC}"
echo -e "${BLUE}Vercel Deployment Pre-Check${NC}"
echo -e "${BLUE}=================================${NC}\n"

# Check if required environment variables are set
check_env_var() {
    if [ -z "${!1}" ]; then
        echo -e "${RED}✗${NC} $1 is not set"
        return 1
    else
        echo -e "${GREEN}✓${NC} $1 is set"
        return 0
    fi
}

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
        return 0
    else
        echo -e "${RED}✗${NC} $1 not found"
        return 1
    fi
}

# Check if command exists
check_command() {
    if command -v "$1" &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 is installed"
        return 0
    else
        echo -e "${RED}✗${NC} $1 is not installed"
        return 1
    fi
}

errors=0

# 1. Check Required Commands
echo -e "${YELLOW}[1/6] Checking required commands...${NC}"
check_command "node" || ((errors++))
check_command "pnpm" || ((errors++))
check_command "vercel" || {
    echo -e "${YELLOW}  → Run: pnpm add -g vercel@latest${NC}"
    ((errors++))
}
echo ""

# 2. Check Required Files
echo -e "${YELLOW}[2/6] Checking required files...${NC}"
check_file "package.json" || ((errors++))
check_file "next.config.ts" || ((errors++))
check_file "vercel.json" || ((errors++))
check_file ".env" || {
    echo -e "${YELLOW}  → Warning: .env file not found (may be fine for CI/CD)${NC}"
}
echo ""

# 3. Check Environment Variables
echo -e "${YELLOW}[3/6] Checking environment variables...${NC}"
if [ -f ".env" ]; then
    source .env 2>/dev/null || true
fi

check_env_var "POSTGRES_URL" || ((errors++))
check_env_var "STRIPE_SECRET_KEY" || ((errors++))
check_env_var "AUTH_SECRET" || ((errors++))
check_env_var "BASE_URL" || {
    echo -e "${YELLOW}  → Warning: BASE_URL not set (will use Vercel default)${NC}"
}
echo ""

# 4. Check Dependencies
echo -e "${YELLOW}[4/6] Checking dependencies...${NC}"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules exists"
else
    echo -e "${YELLOW}!${NC} node_modules not found"
    echo -e "${BLUE}  → Running pnpm install...${NC}"
    pnpm install
fi
echo ""

# 5. Type Check
echo -e "${YELLOW}[5/6] Running TypeScript type check...${NC}"
if pnpm tsc --noEmit; then
    echo -e "${GREEN}✓${NC} Type check passed"
else
    echo -e "${RED}✗${NC} Type check failed"
    ((errors++))
fi
echo ""

# 6. Build Test
echo -e "${YELLOW}[6/6] Testing build...${NC}"
if pnpm build; then
    echo -e "${GREEN}✓${NC} Build successful"
else
    echo -e "${RED}✗${NC} Build failed"
    ((errors++))
fi
echo ""

# Summary
echo -e "${BLUE}=================================${NC}"
if [ $errors -eq 0 ]; then
    echo -e "${GREEN}✓ All pre-checks passed!${NC}"
    echo -e "${BLUE}=================================${NC}\n"
    echo -e "${GREEN}Ready to deploy!${NC}"
    echo -e "\nTo deploy:"
    echo -e "  ${BLUE}• Preview:${NC}    pnpm deploy"
    echo -e "  ${BLUE}• Production:${NC} pnpm deploy:prod"
    exit 0
else
    echo -e "${RED}✗ $errors issue(s) found${NC}"
    echo -e "${BLUE}=================================${NC}\n"
    echo -e "${RED}Please fix the issues above before deploying.${NC}"
    exit 1
fi
