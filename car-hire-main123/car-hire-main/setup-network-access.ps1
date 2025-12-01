# SpaceBorne Car Hire - Network Access Setup Script
# Run this script as Administrator to configure Windows Firewall

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SpaceBorne Network Access Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 1
}

Write-Host "✅ Running as Administrator" -ForegroundColor Green
Write-Host ""

# Get IP Address
Write-Host "📡 Your Network Information:" -ForegroundColor Cyan
Write-Host "----------------------------" -ForegroundColor Cyan

$ipAddresses = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -ne "127.0.0.1" }

foreach ($ip in $ipAddresses) {
    Write-Host "Network: $($ip.InterfaceAlias)" -ForegroundColor White
    Write-Host "IP Address: $($ip.IPAddress)" -ForegroundColor Green
    Write-Host ""
}

# Configure Firewall
Write-Host "🔥 Configuring Windows Firewall..." -ForegroundColor Cyan
Write-Host ""

# Check if rules already exist
$frontendRule = Get-NetFirewallRule -DisplayName "Vite Dev Server" -ErrorAction SilentlyContinue
$backendRule = Get-NetFirewallRule -DisplayName "Node Backend Server" -ErrorAction SilentlyContinue

# Frontend Port 3000
if ($frontendRule) {
    Write-Host "⚠️  Frontend rule already exists, removing old rule..." -ForegroundColor Yellow
    Remove-NetFirewallRule -DisplayName "Vite Dev Server"
}

try {
    New-NetFirewallRule -DisplayName "Vite Dev Server" `
                        -Direction Inbound `
                        -LocalPort 3000 `
                        -Protocol TCP `
                        -Action Allow `
                        -Profile Any `
                        -Description "Allow Vite development server access from network" | Out-Null
    Write-Host "✅ Frontend port 3000 - Firewall rule created" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create frontend firewall rule: $_" -ForegroundColor Red
}

# Backend Port 3001
if ($backendRule) {
    Write-Host "⚠️  Backend rule already exists, removing old rule..." -ForegroundColor Yellow
    Remove-NetFirewallRule -DisplayName "Node Backend Server"
}

try {
    New-NetFirewallRule -DisplayName "Node Backend Server" `
                        -Direction Inbound `
                        -LocalPort 3001 `
                        -Protocol TCP `
                        -Action Allow `
                        -Profile Any `
                        -Description "Allow Node.js backend server access from network" | Out-Null
    Write-Host "✅ Backend port 3001 - Firewall rule created" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create backend firewall rule: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Display access URLs
Write-Host "📱 Access URLs for Other Devices:" -ForegroundColor Cyan
Write-Host ""

foreach ($ip in $ipAddresses) {
    if ($ip.IPAddress -match "^192\.168\." -or $ip.IPAddress -match "^10\." -or $ip.IPAddress -match "^172\.(1[6-9]|2[0-9]|3[0-1])\.") {
        Write-Host "Frontend: http://$($ip.IPAddress):3000" -ForegroundColor Green
        Write-Host "Backend:  http://$($ip.IPAddress):3001" -ForegroundColor Green
        Write-Host ""
    }
}

Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Start your servers: npm run dev:all" -ForegroundColor White
Write-Host "2. Open the URL above on any device connected to the same network" -ForegroundColor White
Write-Host "3. Make sure both devices are on the same WiFi network" -ForegroundColor White
Write-Host ""

Write-Host "💡 Tip: Bookmark the URL on your mobile device for easy access!" -ForegroundColor Yellow
Write-Host ""

pause
