# =============================================
# 🦅 Automatic Thai - One-Click Deploy (Fly.io)
# =============================================
Write-Host "🔥 Starting Automatic Thai Deploy..." -ForegroundColor Yellow

# Get script directory and set as project root
$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $projectPath
Write-Host "📂 Project path: $projectPath" -ForegroundColor Cyan

# Error handling
$ErrorActionPreference = "Stop"
function Handle-Error {
    param($message)
    Write-Host "❌ Error: $message" -ForegroundColor Red
    exit 1
}

try {
    # Ensure Fly CLI is installed
    if (-not (Get-Command fly -ErrorAction SilentlyContinue)) {
        Write-Host "⚠️ Fly CLI not found. Installing..." -ForegroundColor Yellow
        try {
            iwr https://fly.io/install.ps1 -useb | iex
            Write-Host "✅ Fly CLI installed" -ForegroundColor Green
        } catch {
            Handle-Error "Failed to install Fly CLI. Please install manually from https://fly.io/docs/getting-started/installing-flyctl/"
        }
    } else {
        Write-Host "✅ Fly CLI found" -ForegroundColor Green
    }

    # Build frontend (in root, not frontend folder)
    if (Test-Path ".\package.json") {
        Write-Host "⚙️ Building frontend..." -ForegroundColor Cyan
        if (-not (Test-Path ".\node_modules")) {
            Write-Host "📦 Installing Node dependencies..." -ForegroundColor Yellow
            npm install
            if ($LASTEXITCODE -ne 0) { Handle-Error "npm install failed" }
        }
        Write-Host "🔨 Building production bundle..." -ForegroundColor Yellow
        npm run build
        if ($LASTEXITCODE -ne 0) { Handle-Error "npm run build failed" }
        if (-not (Test-Path ".\dist")) {
            Handle-Error "Build output 'dist' directory not found"
        }
        Write-Host "✅ Frontend built successfully" -ForegroundColor Green
    } else {
        Handle-Error "package.json not found in project root"
    }

    # Create fly.toml if missing
    if (-not (Test-Path ".\fly.toml")) {
        Write-Host "🧾 Creating fly.toml..." -ForegroundColor Cyan
        @'
app = "automatic-thai"
primary_region = "sin"

[build]
  builder = "paketobuildpacks/builder:base"

[env]
  PORT = "8000"

[[services]]
  internal_port = 8000
  protocol = "tcp"

  [[services.ports]]
    port = 80
    handlers = ["http"]

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]

  [[services.tcp_checks]]
    interval = "15s"
    timeout = "2s"
    grace_period = "5s"
'@ | Out-File -Encoding utf8 "fly.toml"
        Write-Host "✅ Created fly.toml" -ForegroundColor Green
    }

    # Login to Fly.io
    Write-Host "🔐 Checking Fly.io authentication..." -ForegroundColor Cyan
    fly auth whoami 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "🔑 Logging into Fly.io..." -ForegroundColor Yellow
        fly auth login
        if ($LASTEXITCODE -ne 0) { Handle-Error "Fly.io login failed" }
    } else {
        Write-Host "✅ Already authenticated with Fly.io" -ForegroundColor Green
    }

    # Launch or update app (skip if already exists)
    Write-Host "🚀 Preparing Fly app..." -ForegroundColor Cyan
    $appList = fly apps list 2>&1
    $appExists = $appList | Select-String "automatic-thai"
    
    if (-not $appExists) {
        Write-Host "🆕 Creating new Fly app..." -ForegroundColor Yellow
        # Try to get organization name
        $orgOutput = fly orgs list 2>&1
        $orgName = $null
        if ($orgOutput -match "personal") {
            $orgName = "personal"
        } elseif ($orgOutput -match "^\s+(\S+)") {
            $orgName = $Matches[1]
        }
        
        if ($orgName) {
            Write-Host "   Using organization: $orgName" -ForegroundColor Gray
            $createOutput = fly apps create automatic-thai --org $orgName 2>&1
            $createError = $createOutput -join " "
            if ($LASTEXITCODE -ne 0 -and $createError -notmatch "already exists") {
                # Check for payment/billing error
                if ($createError -match "payment|billing|credit card") {
                    Write-Host "⚠️ Fly.io account requires payment setup" -ForegroundColor Yellow
                    Write-Host "   Visit: https://fly.io/dashboard/billing" -ForegroundColor Gray
                    Write-Host "   After adding payment info, re-run this script" -ForegroundColor Gray
                    Handle-Error "Fly.io billing setup required. Please add payment information to your account."
                }
                # If org specified fails, try without org
                $createOutput2 = fly apps create automatic-thai 2>&1
                $createError2 = $createOutput2 -join " "
                if ($LASTEXITCODE -ne 0 -and $createError2 -notmatch "already exists") {
                    if ($createError2 -match "payment|billing|credit card") {
                        Write-Host "⚠️ Fly.io account requires payment setup" -ForegroundColor Yellow
                        Write-Host "   Visit: https://fly.io/dashboard/billing" -ForegroundColor Gray
                        Handle-Error "Fly.io billing setup required. Please add payment information to your account."
                    }
                }
            }
        } else {
            # Create without org specification
            $createOutput = fly apps create automatic-thai 2>&1
            $createError = $createOutput -join " "
            if ($LASTEXITCODE -ne 0 -and $createError -notmatch "already exists") {
                if ($createError -match "payment|billing|credit card") {
                    Write-Host "⚠️ Fly.io account requires payment setup" -ForegroundColor Yellow
                    Write-Host "   Visit: https://fly.io/dashboard/billing" -ForegroundColor Gray
                    Handle-Error "Fly.io billing setup required. Please add payment information to your account."
                }
            }
        }
        
        # Verify app was created
        Start-Sleep -Seconds 1
        $verifyList = fly apps list 2>&1
        $verifyExists = $verifyList | Select-String "automatic-thai"
        if ($verifyExists) {
            Write-Host "✅ Fly app 'automatic-thai' created successfully" -ForegroundColor Green
        } else {
            Handle-Error "App 'automatic-thai' was not created. Please check your Fly.io account status or create it manually via: fly apps create automatic-thai"
        }
    } else {
        Write-Host "✅ App 'automatic-thai' already exists" -ForegroundColor Green
    }

    # Set secrets (skip if already set)
    Write-Host "🔒 Setting environment secrets..." -ForegroundColor Cyan
    fly secrets set GOOGLE_OAUTH_CLIENT_ID="${env:GOOGLE_OAUTH_CLIENT_ID:-dummy-client}" `
                  ALLOWED_ORIGINS="${env:ALLOWED_ORIGINS:-*}" `
                  --app automatic-thai 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Secrets configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Warning: Secrets may already be set or failed to update" -ForegroundColor Yellow
    }

    # Deploy
    Write-Host "🕊️ Deploying to Fly.io..." -ForegroundColor Cyan
    fly deploy --app automatic-thai
    if ($LASTEXITCODE -ne 0) { Handle-Error "Deployment failed" }

    # Check status
    Write-Host "`n✨ Checking deployment status..." -ForegroundColor Cyan
    fly status --app automatic-thai

    Write-Host "`n✅ Automatic Thai deployed successfully!" -ForegroundColor Green
    Write-Host "🌍 Visit: https://automatic-thai.fly.dev" -ForegroundColor Cyan

} catch {
    Handle-Error $_.Exception.Message
}
