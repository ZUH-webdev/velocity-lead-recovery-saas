@echo off
REM Velocity V2 Frontend - Quick Setup Script (Windows)
REM Usage: setup.bat

echo 🚀 Velocity V2 Frontend - Setup Script
echo ======================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm version: %NPM_VERSION%
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

echo ✅ Dependencies installed
echo.

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo 🔧 Creating .env file...
    copy .env.example .env
    echo ✅ .env file created
    echo    Edit .env to configure your backend URL
) else (
    echo ✅ .env file already exists
)

echo.
echo ======================================
echo ✅ Setup Complete!
echo.
echo Next steps:
echo 1. Start the backend: cd ..\backend ^&^& npm run dev
echo 2. Start the frontend: npm run dev
echo 3. Open http://localhost:3000 in your browser
echo.
echo For more info, see QUICK_START.md
