@echo off
echo Starting College ERP System...
echo.

echo Killing existing Node processes...
taskkill /F /IM node.exe 2>nul

echo.
echo Starting Backend Server...
start "Backend" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Servers are starting...
echo Backend: http://localhost:4000
echo Frontend: http://localhost:5173
echo.
pause