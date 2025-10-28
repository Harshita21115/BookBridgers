#!/bin/bash

# BookBridgers Startup Script
echo "🚀 Starting BookBridgers Application..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${BLUE}📋 Checking prerequisites...${NC}"

if ! command_exists node; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js first.${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm not found. Please install npm first.${NC}"
    exit 1
fi

if ! command_exists mongod; then
    echo -e "${RED}❌ MongoDB not found. Please install MongoDB first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All prerequisites found${NC}"

# Check if MongoDB is running
echo -e "${BLUE}🔄 Checking MongoDB status...${NC}"
if ! brew services list | grep mongodb-community | grep started &> /dev/null; then
    echo -e "${YELLOW}⚠️  MongoDB not running. Starting MongoDB...${NC}"
    brew services start mongodb-community
    sleep 3
    echo -e "${GREEN}✅ MongoDB started${NC}"
else
    echo -e "${GREEN}✅ MongoDB is already running${NC}"
fi

# Check if dependencies are installed
echo -e "${BLUE}📦 Checking dependencies...${NC}"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  Root dependencies not found. Installing...${NC}"
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Server dependencies not found. Installing...${NC}"
    cd server && npm install && cd ..
fi

if [ ! -d "client/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Client dependencies not found. Installing...${NC}"
    cd client && npm install && cd ..
fi

echo -e "${GREEN}✅ All dependencies installed${NC}"

# Check if database has data
echo -e "${BLUE}🗄️  Checking database...${NC}"
USER_COUNT=$(mongosh library-management --quiet --eval "db.users.countDocuments()" 2>/dev/null)

if [ "$USER_COUNT" -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Database is empty. Seeding with sample data...${NC}"
    cd server && node insertDataCorrectly.js && cd ..
    echo -e "${GREEN}✅ Database seeded with sample data${NC}"
else
    echo -e "${GREEN}✅ Database has data (${USER_COUNT} users)${NC}"
fi

# Start the application
echo -e "${BLUE}🚀 Starting BookBridgers application...${NC}"
echo -e "${YELLOW}📝 This will start both frontend and backend servers${NC}"
echo -e "${YELLOW}📝 Frontend will be available at: http://localhost:3000${NC}"
echo -e "${YELLOW}📝 Backend API will be available at: http://localhost:5001${NC}"
echo ""
echo -e "${GREEN}🔑 Login Credentials:${NC}"
echo -e "${GREEN}   Student: john.student@email.com / password123${NC}"
echo -e "${GREEN}   Donor: sarah.donor@email.com / password123${NC}"
echo -e "${GREEN}   Admin: mike.librarian@email.com / password123${NC}"
echo ""
echo -e "${BLUE}Press Ctrl+C to stop the application${NC}"
echo ""

# Start the application
npm start

