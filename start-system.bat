@echo off
echo ========================================
echo    Dr AITD Management System Startup
echo ========================================
echo.

echo Checking if MongoDB is running...
sc query MongoDB | findstr /i "RUNNING" >nul 2>&1
if %errorlevel% equ 0 (
    echo MongoDB service is running.
) else (
    echo Attempting to start MongoDB service...
    net start MongoDB 2>nul
    if %errorlevel% neq 0 (
        echo [NOTE] If MongoDB does not start automatically, please start it manually
        echo or run this script as Administrator.
    )
)

echo.
echo Killing any existing processes on port 5000, 5001, and 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5001') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo Starting Backend Server...
cd backend
start "Backend Server" cmd /k "npm start"

echo.
echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo Starting Frontend Development Server...
cd ..\frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo    System Started Successfully!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Default Login Credentials:
echo Admin: admin / admin123
echo Teacher: teacher / teacher123
echo Student: STU2025 / student123
echo.
echo Press any key to exit...
pause >nul
