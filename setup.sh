#!/bin/bash
set -e

echo "🔧 Checking for node_modules..."

if [ ! -d "node_modules" ]; then
  echo "📦 node_modules not found. Installing dependencies..."
  npm install
else
  echo "✅ node_modules already exists. Skipping install."
fi

echo "🧹 Running initial lint and format..."
npm run lint || true
npm run format || true

echo "📦 Pre-building Vite to warm up cache..."
npm run build > /dev/null 2>&1

echo "✅ Environment setup complete. Ready for development."
