@echo off
:: Ensure the script runs from its own directory
cd /d "%~dp0"

:: Check Node.js and npm are available
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js not found in PATH. Please install Node.js from https://nodejs.org/ and try again.
  pause
  exit /b 1
)
where npm >nul 2>&1
if errorlevel 1 (
  echo npm not found in PATH. Installing Node.js will also install npm. Please add npm to PATH and try again.
  pause
  exit /b 1
)

:: Start frontend and backend in separate command windows, ensuring they run from the project folder
start "Frontend" cmd /k "cd /d "%~dp0" && npm run dev"
start "Backend" cmd /k "cd /d "%~dp0" && node backend/server.js"

echo Launched frontend and backend in separate windows. Watch those windows for logs and errors.
pause
