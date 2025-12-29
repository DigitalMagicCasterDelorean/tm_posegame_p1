# Rock Paper Scissors Pose Game - Server Launcher
# This script starts the local web server for the game

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Rock Paper Scissors Pose Game" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting local web server..." -ForegroundColor Green
Write-Host ""
Write-Host "Once the server starts:" -ForegroundColor White
Write-Host "  1. Open your browser" -ForegroundColor White
Write-Host "  2. Go to: http://localhost:8000" -ForegroundColor Yellow
Write-Host "  3. Click '게임 시작' to play!" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to the script's directory (where this .ps1 file is located)
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -Path $scriptPath

# Start the server
npx http-server -p 8000
