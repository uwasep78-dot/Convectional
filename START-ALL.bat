@echo off
title CCR - Start All Services
echo ============================================
echo   CCR Website - Starting all services
echo ============================================
echo.

set ROOT=%~dp0

where mongod >nul 2>nul
if errorlevel 1 (
  echo MongoDB server (mongod) was not found on PATH.
  echo Install MongoDB or start the database separately, then run this script again.
  exit /b 1
)

if not exist "C:\data\db" mkdir "C:\data\db"

echo [1/3] Starting MongoDB...
start "MongoDB" /MIN mongod --dbpath C:\data\db

echo Waiting for MongoDB to be ready...
timeout /t 6 /nobreak >nul

echo [2/3] Starting Backend (port 5001)...
start "CCR Backend" cmd /k "cd /d %ROOT%backend && npm run dev"

timeout /t 6 /nobreak >nul

echo [3/3] Starting Frontend (port 5173)...
start "CCR Frontend" cmd /k "cd /d %ROOT%frontend && npm run dev"

timeout /t 5 /nobreak >nul

echo.
echo ============================================
echo   All services starting!
echo.
echo   Frontend:  http://localhost:5173
echo   Backend:   http://localhost:5001
echo   MongoDB:   port 27017
echo.
echo   Admin credentials must be configured in backend\.env.
echo ============================================
echo.
start "" http://localhost:5173/login