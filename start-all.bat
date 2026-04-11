@echo off
REM Start both backend and frontend servers in separate windows

echo Starting CRM Application...

REM Start Backend
echo Launching Backend Server (port 5000)...
start "CRM Backend" cmd /k "cd backend && npm run dev"

REM Wait a bit for backend to start
timeout /t 3

REM Start Frontend
echo Launching Frontend Application (port 4200)...
start "CRM Frontend" cmd /k "cd frontend\crm-frontend && npm start"

echo Backend & Frontend servers starting...
echo Frontend: http://localhost:4200
echo Backend: http://localhost:5000
