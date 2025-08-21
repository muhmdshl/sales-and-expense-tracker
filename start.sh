#!/bin/bash
echo "Starting Sales & Expense Management System..."
echo ""
echo "Installing dependencies..."
npm run install-all
echo ""
echo "Starting the application..."
echo "Frontend will be available at: http://localhost:3000"
echo "Backend API will be available at: http://localhost:5000"
echo ""
npm run dev