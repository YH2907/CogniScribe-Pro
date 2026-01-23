@echo off
echo.
echo ========================================
echo   Starting Blind Notes Backend Server
echo ========================================
echo.

cd /d "%~dp0"

echo Checking environment configuration...
if not exist .env (
    echo ERROR: .env file not found!
    echo Please create .env file with required variables.
    pause
    exit /b 1
)

echo.
echo Starting server on port 5000...
echo Press Ctrl+C to stop the server
echo.
echo ----------------------------------------
echo.

node server.js

pause
