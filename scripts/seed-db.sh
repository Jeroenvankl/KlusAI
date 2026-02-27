#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")/packages/backend"

cd "$BACKEND_DIR"
source .venv/bin/activate
python -m app.utils.seed_database
