#!/bin/bash

# Git Push Script with Pre-Push Checks
# This script runs quality checks before pushing code to remote

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if git repository exists
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "Not a git repository!"
        exit 1
    fi
}

# Function to check if there are uncommitted changes
check_uncommitted_changes() {
    if [[ -n $(git status -s) ]]; then
        print_warning "You have uncommitted changes:"
        git status -s
        echo ""
        read -p "Do you want to commit these changes? (y/n): " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git add .
            read -p "Enter commit message: " commit_msg
            git commit -m "$commit_msg"
            print_success "Changes committed!"
        else
            print_warning "Proceeding without committing changes..."
        fi
    else
        print_status "No uncommitted changes found."
    fi
}

# Function to get current branch
get_current_branch() {
    git rev-parse --abbrev-ref HEAD
}

# Function to check if branch exists on remote
check_remote_branch() {
    local branch=$1
    if git ls-remote --exit-code --heads origin "$branch" > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to run TypeScript checks
run_typescript_check() {
    print_status "Running TypeScript type check..."
    if npx tsc --noEmit; then
        print_success "TypeScript check passed!"
        return 0
    else
        print_error "TypeScript check failed!"
        return 1
    fi
}

# Function to run build check
run_build_check() {
    print_status "Running build check..."
    if pnpm run build; then
        print_success "Build successful!"
        return 0
    else
        print_error "Build failed!"
        return 1
    fi
}

# Function to check for sensitive data
check_sensitive_data() {
    print_status "Checking for sensitive data..."
    
    # Common patterns for sensitive data
    local patterns=(
        "password\s*=\s*['\"][^'\"]+['\"]"
        "api[_-]?key\s*=\s*['\"][^'\"]+['\"]"
        "secret\s*=\s*['\"][^'\"]+['\"]"
        "token\s*=\s*['\"][^'\"]+['\"]"
        "aws[_-]?access[_-]?key"
        "AKIA[0-9A-Z]{16}"
    )
    
    local found_sensitive=false
    
    for pattern in "${patterns[@]}"; do
        if git diff --cached | grep -iE "$pattern" > /dev/null 2>&1; then
            print_warning "Potential sensitive data found matching pattern: $pattern"
            found_sensitive=true
        fi
    done
    
    if [ "$found_sensitive" = true ]; then
        print_warning "Please review your staged changes for sensitive data."
        read -p "Continue anyway? (y/n): " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Push cancelled."
            exit 1
        fi
    else
        print_success "No sensitive data patterns detected."
    fi
}

# Main function
main() {
    echo ""
    echo "=================================="
    echo "   Git Push Pre-Check Script"
    echo "=================================="
    echo ""
    
    # Check if git repo
    check_git_repo
    
    # Get current branch
    current_branch=$(get_current_branch)
    print_status "Current branch: $current_branch"
    
    # Check for uncommitted changes
    check_uncommitted_changes
    
    # Check for sensitive data
    check_sensitive_data
    
    # Ask if user wants to run checks
    echo ""
    print_status "Pre-push checks available:"
    echo "  1. TypeScript type check (fast)"
    echo "  2. Full build check (slower)"
    echo "  3. Skip checks"
    echo ""
    read -p "Select option (1-3): " -n 1 -r check_option
    echo ""
    
    case $check_option in
        1)
            if ! run_typescript_check; then
                print_error "TypeScript check failed. Fix errors before pushing."
                exit 1
            fi
            ;;
        2)
            if ! run_build_check; then
                print_error "Build check failed. Fix errors before pushing."
                exit 1
            fi
            ;;
        3)
            print_warning "Skipping pre-push checks..."
            ;;
        *)
            print_warning "Invalid option. Skipping checks..."
            ;;
    esac
    
    # Check if branch exists on remote
    echo ""
    if check_remote_branch "$current_branch"; then
        print_status "Branch exists on remote. Pushing updates..."
        
        # Pull latest changes first to avoid conflicts
        print_status "Pulling latest changes from remote..."
        if git pull --rebase origin "$current_branch"; then
            print_success "Successfully pulled latest changes!"
        else
            print_error "Failed to pull changes. Please resolve conflicts manually."
            exit 1
        fi
        
        # Push to existing branch
        if git push origin "$current_branch"; then
            print_success "Successfully pushed to origin/$current_branch!"
        else
            print_error "Failed to push changes."
            exit 1
        fi
    else
        print_status "Branch does not exist on remote. Creating new remote branch..."
        
        # Push new branch with upstream
        if git push -u origin "$current_branch"; then
            print_success "Successfully created and pushed origin/$current_branch!"
        else
            print_error "Failed to push new branch."
            exit 1
        fi
    fi
    
    echo ""
    print_success "========================================="
    print_success "  Push completed successfully! 🚀"
    print_success "========================================="
    echo ""
    
    # Show latest commit
    print_status "Latest commit:"
    git log -1 --oneline
    echo ""
}

# Run main function
main
