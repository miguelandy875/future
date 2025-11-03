#!/bin/bash

# Umuhuza Frontend Development Script

echo "🚀 Starting Umuhuza Frontend Development Server..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start the development server
echo "✨ Starting Vite dev server on http://localhost:3000"
echo ""
npm run dev
