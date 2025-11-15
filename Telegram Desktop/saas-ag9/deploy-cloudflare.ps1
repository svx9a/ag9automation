# =============================================
# 🌐 Automatic Thai - Cloudflare Pages Deploy
# =============================================
Write-Host "🚀 Starting Cloudflare Pages Deploy..." -ForegroundColor Cyan

# Get script directory and set as project root
$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $projectPath
Write-Host "📂 Project path: $projectPath" -ForegroundColor Green

# Error handling
$ErrorActionPreference = "Stop"
function Handle-Error {
    param($message)
    Write-Host "❌ Error: $message" -ForegroundColor Red
    exit 1
}

try {
    # Check Wrangler CLI
    if (-not (Get-Command wrangler -ErrorAction SilentlyContinue)) {
        Write-Host "⚠️ Wrangler CLI not found. Installing..." -ForegroundColor Yellow
        npm install -g wrangler
        if ($LASTEXITCODE -ne 0) {
            Handle-Error "Failed to install Wrangler CLI. Run: npm install -g wrangler"
        }
        Write-Host "✅ Wrangler CLI installed" -ForegroundColor Green
    } else {
        Write-Host "✅ Wrangler CLI found" -ForegroundColor Green
    }

    # Check Node.js
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Handle-Error "Node.js not found. Please install Node.js"
    }

    # Install dependencies if needed
    if (-not (Test-Path ".\node_modules")) {
        Write-Host "📦 Installing Node dependencies..." -ForegroundColor Yellow
        npm install
        if ($LASTEXITCODE -ne 0) { Handle-Error "npm install failed" }
    } else {
        Write-Host "✅ Node modules found" -ForegroundColor Green
    }

    # Build frontend
    Write-Host "🔨 Building frontend..." -ForegroundColor Cyan
    npm run build
    if ($LASTEXITCODE -ne 0) { Handle-Error "npm run build failed" }
    
    if (-not (Test-Path ".\dist")) {
        Handle-Error "Build output 'dist' directory not found"
    }
    Write-Host "✅ Frontend built successfully" -ForegroundColor Green

    # Check wrangler.toml
    if (-not (Test-Path ".\wrangler.toml")) {
        Write-Host "⚠️ wrangler.toml not found. Using default configuration..." -ForegroundColor Yellow
    }

    # Login to Cloudflare
    Write-Host "🔐 Checking Cloudflare authentication..." -ForegroundColor Cyan
    wrangler whoami 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "🔑 Logging into Cloudflare..." -ForegroundColor Yellow
        wrangler login
        if ($LASTEXITCODE -ne 0) { Handle-Error "Cloudflare login failed" }
    } else {
        Write-Host "✅ Already authenticated with Cloudflare" -ForegroundColor Green
    }

    # Deploy Worker (if configured)
    if (Test-Path ".\cloudflare\worker\src\index.ts") {
        Write-Host "⚡ Deploying Cloudflare Worker..." -ForegroundColor Cyan
        wrangler deploy
        if ($LASTEXITCODE -ne 0) {
            Write-Host "⚠️ Worker deployment failed or skipped" -ForegroundColor Yellow
        } else {
            Write-Host "✅ Worker deployed" -ForegroundColor Green
        }
    }

    # Deploy to Cloudflare Pages (manual step with instructions)
    Write-Host ""
    Write-Host "📄 To deploy to Cloudflare Pages:" -ForegroundColor Cyan
    Write-Host "   1. Go to: https://dash.cloudflare.com" -ForegroundColor Yellow
    Write-Host "   2. Navigate to Pages > Create a project" -ForegroundColor Yellow
    Write-Host "   3. Connect your Git repository OR upload the 'dist' folder" -ForegroundColor Yellow
    Write-Host "   4. Build settings:" -ForegroundColor Yellow
    Write-Host "      - Build command: npm run build" -ForegroundColor Gray
    Write-Host "      - Build output directory: dist" -ForegroundColor Gray
    Write-Host "      - Root directory: (leave empty)" -ForegroundColor Gray
    Write-Host "   5. Or use CLI: wrangler pages deploy dist --project-name=automatic-thai" -ForegroundColor Yellow
    Write-Host ""

    # Try Pages deploy via CLI
    Write-Host "🌐 Attempting Pages deploy via CLI..." -ForegroundColor Cyan
    wrangler pages deploy dist --project-name=automatic-thai 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Pages deployed successfully!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ CLI deploy may need project creation first" -ForegroundColor Yellow
        Write-Host "   Create project via dashboard or use: wrangler pages project create automatic-thai" -ForegroundColor Gray
    }

    Write-Host ""
    Write-Host "✅ Cloudflare deployment process completed!" -ForegroundColor Green

} catch {
    Handle-Error $_.Exception.Message
}

