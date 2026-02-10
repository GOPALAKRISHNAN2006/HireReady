# ===========================================
# HireReady - Production Deployment Script (Windows)
# ===========================================

Write-Host "🚀 Starting HireReady Production Deployment..." -ForegroundColor Cyan

# Check if .env.prod exists
if (-not (Test-Path ".env.prod")) {
    Write-Host "Error: .env.prod file not found!" -ForegroundColor Red
    Write-Host "Please copy .env.prod.example to .env.prod and configure it."
    exit 1
}

# Load and validate environment variables
$envContent = Get-Content ".env.prod" | Where-Object { $_ -notmatch '^#' -and $_ -match '=' }
$envVars = @{}
foreach ($line in $envContent) {
    $parts = $line -split '=', 2
    if ($parts.Count -eq 2) {
        $envVars[$parts[0].Trim()] = $parts[1].Trim()
    }
}

$requiredVars = @(
    "MONGO_ROOT_PASSWORD",
    "REDIS_PASSWORD",
    "JWT_SECRET",
    "FRONTEND_URL",
    "STRIPE_SECRET_KEY"
)

$missingVars = @()
foreach ($var in $requiredVars) {
    if (-not $envVars[$var] -or $envVars[$var] -eq "") {
        $missingVars += $var
    }
}

if ($missingVars.Count -gt 0) {
    Write-Host "Error: Missing required environment variables:" -ForegroundColor Red
    $missingVars | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    exit 1
}

Write-Host "✓ Environment variables validated" -ForegroundColor Green

# Create SSL directory if it doesn't exist
if (-not (Test-Path "nginx\ssl")) {
    Write-Host "Creating SSL directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "nginx\ssl" -Force | Out-Null
    Write-Host "⚠️  Remember to add your SSL certificates to nginx\ssl\" -ForegroundColor Yellow
    Write-Host "   - fullchain.pem"
    Write-Host "   - privkey.pem"
}

# Build and start containers
Write-Host "`n📦 Building Docker images..." -ForegroundColor Cyan
docker-compose -f docker-compose.prod.yml build --no-cache

Write-Host "`n🔄 Stopping existing containers..." -ForegroundColor Cyan
docker-compose -f docker-compose.prod.yml down

Write-Host "`n🚀 Starting production containers..." -ForegroundColor Cyan
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
Write-Host "`n⏳ Waiting for services to be ready..." -ForegroundColor Cyan
Start-Sleep -Seconds 15

# Check health status
Write-Host "`n🏥 Checking service health..." -ForegroundColor Cyan

# Check if containers are running
$containers = docker ps --format "{{.Names}}" | Where-Object { $_ -match "hireready" }
foreach ($container in $containers) {
    $status = docker inspect --format "{{.State.Health.Status}}" $container 2>$null
    if ($status -eq "healthy") {
        Write-Host "✓ $container is healthy" -ForegroundColor Green
    } elseif ($status -eq "starting") {
        Write-Host "○ $container is starting..." -ForegroundColor Yellow
    } else {
        $running = docker inspect --format "{{.State.Running}}" $container
        if ($running -eq "true") {
            Write-Host "✓ $container is running" -ForegroundColor Green
        } else {
            Write-Host "✗ $container is not running" -ForegroundColor Red
        }
    }
}

Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Services running:"
Write-Host "  - MongoDB:  localhost:27017"
Write-Host "  - Redis:    localhost:6379"
Write-Host "  - API:      localhost:5000"
Write-Host "  - Frontend: localhost:80 (via Nginx)"
Write-Host ""
Write-Host "Useful commands:"
Write-Host "  - View logs:    docker-compose -f docker-compose.prod.yml logs -f"
Write-Host "  - Stop all:     docker-compose -f docker-compose.prod.yml down"
Write-Host "  - Restart:      docker-compose -f docker-compose.prod.yml restart"
Write-Host ""
