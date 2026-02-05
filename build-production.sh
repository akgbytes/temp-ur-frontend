#!/bin/bash

# Production Build Script for Low-Memory Environments
# This script helps build Next.js apps on servers with limited RAM

set -e  # Exit on error

echo "=========================================="
echo "Production Build Script for Urbanesta"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if swap exists and create if needed
check_swap() {
    echo -e "${YELLOW}Checking swap memory...${NC}"
    SWAP_SIZE=$(free -m | grep Swap | awk '{print $2}')
    
    if [ "$SWAP_SIZE" -lt 1024 ]; then
        echo -e "${YELLOW}Swap memory is low ($SWAP_SIZE MB). Consider adding swap.${NC}"
        echo "Run these commands to add 2GB swap:"
        echo "  sudo fallocate -l 2G /swapfile"
        echo "  sudo chmod 600 /swapfile"
        echo "  sudo mkswap /swapfile"
        echo "  sudo swapon /swapfile"
        echo "  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab"
        read -p "Continue without adding swap? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        echo -e "${GREEN}Swap memory is adequate ($SWAP_SIZE MB)${NC}"
    fi
}

# Clean build artifacts
clean_build() {
    echo -e "${YELLOW}Cleaning previous build artifacts...${NC}"
    sudo rm -rf .next
    echo -e "${GREEN}Clean complete${NC}"
}

# Run the build
build_app() {
    echo -e "${YELLOW}Starting production build...${NC}"
    echo "This may take several minutes..."
    
    # Set memory limit and run build
    if npm run build:prod; then
        echo -e "${GREEN}Build successful!${NC}"
        return 0
    else
        echo -e "${RED}Build failed!${NC}"
        echo -e "${YELLOW}Trying with lower memory settings...${NC}"
        
        # Try with lower memory
        if npm run build:prod:low-mem; then
            echo -e "${GREEN}Build successful with low-memory mode!${NC}"
            return 0
        else
            echo -e "${RED}Build failed even with low memory settings${NC}"
            return 1
        fi
    fi
}

# Main execution
main() {
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        echo -e "${RED}Error: package.json not found. Are you in the frontend directory?${NC}"
        exit 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo -e "${RED}Error: Node.js 18+ is required. Current version: $(node -v)${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}Node.js version: $(node -v)${NC}"
    
    # Check swap
    check_swap
    
    # Clean previous builds
    clean_build
    
    # Build the app
    if build_app; then
        echo ""
        echo -e "${GREEN}=========================================="
        echo "Build completed successfully!"
        echo "==========================================${NC}"
        echo ""
        echo "Next steps:"
        echo "  1. Start with PM2: npm run pm2:start"
        echo "  2. Or restart: npm run pm2:restart"
        echo "  3. Check logs: npm run pm2:logs"
        echo ""
    else
        echo ""
        echo -e "${RED}=========================================="
        echo "Build failed!"
        echo "==========================================${NC}"
        echo ""
        echo "Troubleshooting:"
        echo "  1. Check if you have enough memory: free -h"
        echo "  2. Add swap space (see instructions above)"
        echo "  3. Close other applications to free memory"
        echo "  4. Check logs for specific errors"
        echo ""
        exit 1
    fi
}

# Run main function
main

