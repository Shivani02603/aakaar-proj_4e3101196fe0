#!/bin/bash
set -e
# Start backend in background
node backend/server.js &
BACKEND_PID=$!
# Start frontend dev server
cd frontend && npm run dev &
FRONTEND_PID=$!
# Wait for any process to exit
wait -n
# If one exits, kill the other
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null