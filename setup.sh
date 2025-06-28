#!/bin/bash
echo "🔧 Installing dependencies..."
npm install

echo "🧹 Running initial lint and format..."
npm run lint || true
npm run format

echo "⚡ Starting dev server..."
npm run dev
