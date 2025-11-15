# 🌑 Black Sun Primal Transformer Automata — FLASH INIT 🌑

Clear-Host
Write-Host "⚡ Black Sun — Activating Primal Automata..." -ForegroundColor Cyan
Start-Sleep -Seconds 1

# Error handling
$ErrorActionPreference = "Continue"

# Move to project folder
$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $projectPath
Write-Host "📂 Project path: $projectPath" -ForegroundColor Green

# Check prerequisites
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Python not found. Please install Python 3.11+" -ForegroundColor Red
    exit 1
}
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js not found. Please install Node.js" -ForegroundColor Red
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

Write-Host "🐍 Activating Python venv..." -ForegroundColor Yellow
try {
    & .venv\Scripts\Activate.ps1
    if ($LASTEXITCODE -ne 0) {
        $env:VIRTUAL_ENV = "$projectPath\.venv"
        $env:PATH = "$projectPath\.venv\Scripts;$env:PATH"
    }
} catch {
    $env:VIRTUAL_ENV = "$projectPath\.venv"
    $env:PATH = "$projectPath\.venv\Scripts;$env:PATH"
}

# --- SELF-HEAL FUNCTION ---
function Heal-Dependencies {
    Write-Host "🩺 Checking Python & Node dependencies..." -ForegroundColor Cyan
    try { 
        $pipCheck = pip check 2>&1
        if ($LASTEXITCODE -eq 0) { 
            Write-Host "✅ Python packages OK" -ForegroundColor Green 
        } else {
            Write-Host "⚠ Reinstalling Python packages..." -ForegroundColor Yellow
            pip install -r server\requirements.txt --quiet
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Python packages reinstalled" -ForegroundColor Green
            }
        }
    } catch { 
        Write-Host "⚠ Reinstalling Python packages..." -ForegroundColor Yellow
        pip install -r server\requirements.txt --quiet
    }
    
    if (!(Test-Path "node_modules")) { 
        Write-Host "⚠ Installing Node modules..." -ForegroundColor Yellow
        npm install --silent
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Node modules installed" -ForegroundColor Green
        }
    } else { 
        Write-Host "✅ Node modules OK" -ForegroundColor Green 
    }
}

# --- LAUNCH SERVICES ---
function Launch-Backend {
    # Check if backend is responding on port 8000
    $backendHealthy = $false
    try {
        $response = Invoke-WebRequest -Uri "http://127.0.0.1:8000/health" -TimeoutSec 1 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            $backendHealthy = $true
        }
    } catch {
        # Backend not responding
    }
    
    if ($backendHealthy) { 
        Write-Host "⚡ Backend already running" -ForegroundColor Yellow 
    } else { 
        Write-Host "🚀 Launching backend..." -ForegroundColor Cyan
        $backendScript = "cd '$projectPath'; if (Test-Path '.venv\Scripts\Activate.ps1') { .venv\Scripts\Activate.ps1 }; uvicorn server.main:app --reload --host 127.0.0.1 --port 8000"
        Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendScript
        Start-Sleep -Seconds 2
        Write-Host "✅ Backend launched" -ForegroundColor Green
    }
}

function Launch-Frontend {
    # Check if frontend is responding on port 5173
    $frontendHealthy = $false
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 1 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            $frontendHealthy = $true
        }
    } catch {
        # Frontend not responding
    }
    
    if ($frontendHealthy) { 
        Write-Host "⚡ Frontend already running" -ForegroundColor Yellow 
    } else { 
        Write-Host "✨ Launching frontend..." -ForegroundColor Cyan
        $frontendScript = "cd '$projectPath'; npm run dev"
        Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendScript
        Start-Sleep -Seconds 2
        Write-Host "✅ Frontend launched" -ForegroundColor Green
    }
}

# --- HEALTH CHECK ---
function Test-Services {
    $backendHealthy = $false
    $frontendHealthy = $false
    
    try {
        $response = Invoke-WebRequest -Uri "http://127.0.0.1:8000/health" -TimeoutSec 2 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            $backendHealthy = $true
        }
    } catch {
        # Backend not responding
    }
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 2 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            $frontendHealthy = $true
        }
    } catch {
        # Frontend not responding
    }
    
    return @{ Backend = $backendHealthy; Frontend = $frontendHealthy }
}

# --- PRIMAL LOOP ---
function Primal-Heartbeat {
    $tickCount = 0
    while ($true) {
        $tickCount++
        Write-Host ""
        Write-Host "🌑 Primal Heartbeat Tick #$tickCount..." -ForegroundColor Magenta
        Heal-Dependencies
        Launch-Backend
        Launch-Frontend
        
        $health = Test-Services
        if ($health.Backend) {
            Write-Host "✅ Backend healthy" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Backend not responding" -ForegroundColor Yellow
        }
        if ($health.Frontend) {
            Write-Host "✅ Frontend healthy" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Frontend not responding" -ForegroundColor Yellow
        }
        
        Start-Sleep -Seconds 30
    }
}

# --- INITIALIZATION ---
Write-Host ""
Write-Host "🔧 Initial setup..." -ForegroundColor Cyan
Heal-Dependencies
Launch-Backend
Launch-Frontend
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "✅ Primal Automata ONLINE & SELF-HEALED!" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "🔧 Backend: http://127.0.0.1:8000" -ForegroundColor Yellow
Write-Host "📊 API Docs: http://127.0.0.1:8000/docs" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔄 Self-healing loop starting (check every 30s)..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop" -ForegroundColor Gray
Write-Host ""

# Start the infinite self-healing heartbeat
Primal-Heartbeat
