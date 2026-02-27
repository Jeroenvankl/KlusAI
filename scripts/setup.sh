#!/bin/bash
set -e

echo "========================================="
echo "KlusAI Setup Script"
echo "========================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Backend setup
echo ""
echo "[1/3] Setting up Python backend..."
cd "$ROOT_DIR/packages/backend"

if [ ! -d ".venv" ]; then
    python3 -m venv .venv
    echo "  [OK] Virtual environment created"
fi

source .venv/bin/activate
pip install -q -r requirements.txt
echo "  [OK] Python dependencies installed"

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    cp "$ROOT_DIR/.env.example" .env
    echo "  [INFO] Created .env from template - please add your GOOGLE_AI_API_KEY"
fi

# Seed database
echo ""
echo "[2/3] Seeding database..."
python -m app.utils.seed_database

# Frontend setup
echo ""
echo "[3/3] Setting up React Native frontend..."
cd "$ROOT_DIR"

if command -v yarn &> /dev/null; then
    yarn install
    echo "  [OK] Node dependencies installed"
else
    echo "  [WARN] Yarn not found. Install with: corepack enable && corepack prepare yarn@stable --activate"
fi

echo ""
echo "========================================="
echo "Setup complete!"
echo ""
echo "To start the backend:"
echo "  cd packages/backend && source .venv/bin/activate && uvicorn app.main:app --reload"
echo ""
echo "To start the mobile app:"
echo "  yarn mobile:start"
echo "========================================="
