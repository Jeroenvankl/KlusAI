#!/bin/bash
set -e

# =========================================
# KlusAI Test Runner
# =========================================
# Runs the full backend test suite and reports results.
# Usage:
#   ./scripts/test.sh              # Run all tests
#   ./scripts/test.sh --coverage   # Run with coverage report
#   ./scripts/test.sh -k "paint"   # Run only tests matching "paint"
#   ./scripts/test.sh --fast       # Run without slow integration tests

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$ROOT_DIR/packages/backend"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}  KlusAI Test Runner${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# Check if venv exists
if [ ! -d "$BACKEND_DIR/.venv" ]; then
    echo -e "${RED}[ERROR] Virtual environment not found!${NC}"
    echo "  Run ./scripts/setup.sh first to set up the project."
    exit 1
fi

# Activate venv
source "$BACKEND_DIR/.venv/bin/activate"
cd "$BACKEND_DIR"

# Parse arguments
PYTEST_ARGS="-v --tb=short"
COVERAGE=false

for arg in "$@"; do
    case $arg in
        --coverage)
            COVERAGE=true
            ;;
        --fast)
            PYTEST_ARGS="$PYTEST_ARGS -x -q"
            ;;
        -k)
            # Next arg will be the filter, handled by pass-through
            ;;
        *)
            PYTEST_ARGS="$PYTEST_ARGS $arg"
            ;;
    esac
done

# Step 1: Verify imports
echo -e "${YELLOW}[1/3] Verifying backend imports...${NC}"
python -c "
from app.main import create_app
from app.config import settings
from app.services.paint_engine import apply_paint
from app.services.segmentation import SegmentationService
from app.utils.color import hex_to_lab, delta_e
from app.utils.image import decode_image, encode_image_base64
print('  All imports OK')
" 2>&1

if [ $? -ne 0 ]; then
    echo -e "${RED}[FAIL] Import check failed!${NC}"
    exit 1
fi
echo -e "${GREEN}  [OK] All imports verified${NC}"
echo ""

# Step 2: Run tests
echo -e "${YELLOW}[2/3] Running pytest...${NC}"
echo ""

if [ "$COVERAGE" = true ]; then
    python -m pytest tests/ $PYTEST_ARGS \
        --cov=app --cov-report=term-missing --cov-report=html:htmlcov \
        2>&1
    RESULT=$?
    if [ $RESULT -eq 0 ]; then
        echo ""
        echo -e "${GREEN}  Coverage report generated: packages/backend/htmlcov/index.html${NC}"
    fi
else
    python -m pytest tests/ $PYTEST_ARGS 2>&1
    RESULT=$?
fi

echo ""

# Step 3: Summary
echo -e "${BLUE}=========================================${NC}"
if [ $RESULT -eq 0 ]; then
    echo -e "${GREEN}  ALL TESTS PASSED${NC}"
else
    echo -e "${RED}  SOME TESTS FAILED${NC}"
    echo ""
    echo -e "  Re-run with more detail:"
    echo -e "    ./scripts/test.sh --tb=long"
    echo ""
    echo -e "  Run a specific test file:"
    echo -e "    ./scripts/test.sh tests/test_paint_engine.py"
    echo ""
    echo -e "  Run tests matching a keyword:"
    echo -e "    ./scripts/test.sh -k \"paint\""
fi
echo -e "${BLUE}=========================================${NC}"

exit $RESULT
