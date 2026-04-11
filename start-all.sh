#!/bin/bash

# Start both backend and frontend servers in separate terminals

echo "Starting CRM Application..."

# Start Backend
echo "Launching Backend Server (port 5000)..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start Frontend
echo "Launching Frontend Application (port 4200)..."
cd ../frontend/crm-frontend
npm start &
FRONTEND_PID=$!

echo "Backend & Frontend servers starting..."
echo "Frontend: http://localhost:4200"
echo "Backend: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for all background processes
wait
