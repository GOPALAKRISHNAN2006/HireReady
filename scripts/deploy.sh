#!/bin/bash
# ===========================================
# HireReady - Production Deployment Script
# ===========================================

set -e

echo "🚀 Starting HireReady Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.prod exists
if [ ! -f ".env.prod" ]; then
    echo -e "${RED}Error: .env.prod file not found!${NC}"
    echo "Please copy .env.prod.example to .env.prod and configure it."
    exit 1
fi

# Load environment variables
export $(cat .env.prod | grep -v '#' | xargs)

# Validate required environment variables
REQUIRED_VARS=(
    "MONGO_ROOT_PASSWORD"
    "REDIS_PASSWORD"
    "JWT_SECRET"
    "FRONTEND_URL"
    "STRIPE_SECRET_KEY"
)

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo -e "${RED}Error: $var is not set in .env.prod${NC}"
        exit 1
    fi
done

echo -e "${GREEN}✓ Environment variables validated${NC}"

# Create SSL directory if it doesn't exist
if [ ! -d "nginx/ssl" ]; then
    echo -e "${YELLOW}Creating SSL directory...${NC}"
    mkdir -p nginx/ssl
    echo -e "${YELLOW}⚠️  Remember to add your SSL certificates to nginx/ssl/${NC}"
    echo "   - fullchain.pem"
    echo "   - privkey.pem"
fi

# Build and start containers
echo "📦 Building Docker images..."
docker-compose -f docker-compose.prod.yml build --no-cache

echo "🔄 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

echo "🚀 Starting production containers..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check health status
echo "🏥 Checking service health..."

# Check MongoDB
if docker exec hireready-mongodb-prod mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ MongoDB is healthy${NC}"
else
    echo -e "${RED}✗ MongoDB is not responding${NC}"
fi

# Check Redis
if docker exec hireready-redis-prod redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Redis is healthy${NC}"
else
    echo -e "${RED}✗ Redis is not responding${NC}"
fi

# Check API Server
if curl -s http://localhost:5000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ API Server is healthy${NC}"
else
    echo -e "${YELLOW}⚠ API Server health check pending...${NC}"
fi

echo ""
echo "========================================="
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo "========================================="
echo ""
echo "Services running:"
echo "  - MongoDB:  localhost:27017"
echo "  - Redis:    localhost:6379"
echo "  - API:      localhost:5000"
echo "  - Frontend: localhost:80 (via Nginx)"
echo ""
echo "Useful commands:"
echo "  - View logs:    docker-compose -f docker-compose.prod.yml logs -f"
echo "  - Stop all:     docker-compose -f docker-compose.prod.yml down"
echo "  - Restart:      docker-compose -f docker-compose.prod.yml restart"
echo ""
