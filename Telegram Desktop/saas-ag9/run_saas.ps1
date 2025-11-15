# 🔥 Black Sun SaaS Hub Launcher 🔥

Clear-Host
Write-Host "⚡ Black Sun SaaS Hub — Starting Automation..." -ForegroundColor Cyan
Start-Sleep -Seconds 1

# Error handling
$ErrorActionPreference = "Continue"

# Move to project folder
$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $projectPath
Write-Host "📂 Entered project folder: $projectPath" -ForegroundColor Green
Start-Sleep -Milliseconds 500

# Check Python installation
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Python not found. Please install Python 3.11+" -ForegroundColor Red
    exit 1
}

# Create/activate Python venv
if (-not (Test-Path ".venv")) {
    Write-Host "🐍 Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv .venv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to create virtual environment" -ForegroundColor Red
        exit 1
    }
}

Write-Host "🐍 Activating Python virtual environment..." -ForegroundColor Yellow
try {
    & .venv\Scripts\Activate.ps1
    if ($LASTEXITCODE -ne 0) {
        # Try alternative activation
        & .venv\Scripts\python.exe -m pip --version | Out-Null
        $env:VIRTUAL_ENV = "$projectPath\.venv"
        $env:PATH = "$projectPath\.venv\Scripts;$env:PATH"
    }
    Write-Host "✅ Virtual environment activated" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Virtual environment activation had issues, continuing..." -ForegroundColor Yellow
}
Start-Sleep -Milliseconds 500

# Upgrade pip
Write-Host "📦 Upgrading pip..." -ForegroundColor Magenta
python -m pip install --upgrade pip --quiet
Start-Sleep -Milliseconds 300

# Install Python dependencies
Write-Host "📦 Installing Python packages..." -ForegroundColor Magenta
pip install -r server\requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install Python dependencies" -ForegroundColor Red
    exit 1
}
Start-Sleep -Milliseconds 500

# Check Node.js installation
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js not found. Please install Node.js" -ForegroundColor Red
    exit 1
}

# Install Node dependencies
Write-Host "🔧 Installing Node modules..." -ForegroundColor Magenta
if (-not (Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Node dependencies" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Node modules already installed" -ForegroundColor Green
}
Start-Sleep -Milliseconds 500

# Check if services are already running
$backendRunning = Get-Process -Name uvicorn -ErrorAction SilentlyContinue
$frontendRunning = Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*node*" }

# Launch backend
if (-not $backendRunning) {
    Write-Host "🚀 Starting backend server (Uvicorn)..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectPath'; .venv\Scripts\Activate.ps1; uvicorn server.main:app --reload --host 127.0.0.1 --port 8000"
    Start-Sleep -Seconds 2
} else {
    Write-Host "⚡ Backend already running" -ForegroundColor Yellow
}

# Launch frontend
if (-not $frontendRunning) {
    Write-Host "✨ Starting frontend (Vite)..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectPath'; npm run dev"
    Start-Sleep -Seconds 2
} else {
    Write-Host "⚡ Frontend already running" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Black Sun SaaS Hub Launched!" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "🔧 Backend: http://127.0.0.1:8000" -ForegroundColor Yellow
Write-Host "📊 API Docs: http://127.0.0.1:8000/docs" -ForegroundColor Yellow
Write-Host ""
