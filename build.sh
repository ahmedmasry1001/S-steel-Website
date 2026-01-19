#!/bin/bash

# S-Steel Website Build Script

echo "🏗️  Building S-Steel Website..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Build Frontend
echo -e "${BLUE}📦 Building React frontend...${NC}"
cd frontend
npm install
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend build successful!${NC}"
else
    echo -e "${RED}❌ Frontend build failed!${NC}"
    exit 1
fi

cd ..

# Setup Backend
echo -e "${BLUE}🐍 Setting up Python backend...${NC}"
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend setup successful!${NC}"
else
    echo -e "${RED}❌ Backend setup failed!${NC}"
    exit 1
fi

cd ..

# Create deployment structure
echo -e "${BLUE}📁 Creating deployment structure...${NC}"

mkdir -p deployment/dist
mkdir -p deployment/dist/static
mkdir -p deployment/dist/api
mkdir -p deployment/dist/uploads
mkdir -p deployment/dist/database

# Copy frontend build
cp -r frontend/build/* deployment/dist/

# Copy backend
cp -r backend/* deployment/dist/api/

# Copy deployment files
cp deployment/web.config deployment/dist/
cp deployment/README.md deployment/dist/

echo -e "${GREEN}🎉 Build complete!${NC}"
echo -e "${BLUE}📋 Deployment files are in: deployment/dist/${NC}"
echo ""
echo "Next steps:"
echo "1. Upload deployment/dist/* to your hosting server"
echo "2. Configure Python environment on server"
echo "3. Set proper file permissions for uploads and database directories"
echo "4. Update admin credentials after first login"
echo ""
echo -e "${GREEN}✨ Your S-Steel website is ready for deployment!${NC}"
