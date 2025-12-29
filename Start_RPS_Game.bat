@echo off
cd /d "%~dp0"
powershell.exe -ExecutionPolicy Bypass -File "start_game_server.ps1"
pause
