#!/bin/bash
# ============================================
# SETUP SCRIPT - Auto generate package-lock.json
# ============================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Contract Management System - Setup${NC}"
echo ""

# Function to generate package-lock.json
generate_lock() {
    local dir=$1
    local extra_args=$2
    
    echo -e "${GREEN}🔧 Setting up $dir...${NC}"
    cd "$dir"
    
    if [ -f "package-lock.json" ]; then
        echo -e "   ✅ package-lock.json already exists (skipping)"
    else
        echo -e "   📦 Generating package-lock.json..."
        npm install --package-lock-only $extra_args
        echo -e "   ✅ Created!"
    fi
    
    cd - > /dev/null
}

# Generate for each service
generate_lock "backend" ""
generate_lock "frontend" "--legacy-peer-deps"
generate_lock "realtime" ""

echo ""
echo -e "${GREEN}✅ All package-lock.json files created!${NC}"
echo ""
ls -la backend/package-lock.json frontend/package-lock.json realtime/package-lock.json 2>/dev/null || true
