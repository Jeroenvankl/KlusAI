import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.models.database import init_db
from app.routers import segment, paint, analyze, design, products, build_plan, live_help, reverse
from app.services.claude_client import ClaudeClient
from app.services.segmentation import SegmentationService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting KlusAI backend...")

    # Initialize database
    await init_db()
    logger.info("Database initialized")

    # Load segmentation model
    app.state.segmentation = SegmentationService()
    logger.info("Segmentation service ready")

    # Initialize Claude client
    app.state.claude = ClaudeClient()
    logger.info("Claude client ready")

    yield

    logger.info("Shutting down KlusAI backend...")


def create_app() -> FastAPI:
    app = FastAPI(
        title="KlusAI API",
        version="1.0.0",
        description="AI-gedreven klus- en renovatie-assistent",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(segment.router, prefix="/api/v1/segment", tags=["Segmentatie"])
    app.include_router(paint.router, prefix="/api/v1/paint", tags=["Verf"])
    app.include_router(analyze.router, prefix="/api/v1/analyze-room", tags=["Kameranalyse"])
    app.include_router(design.router, prefix="/api/v1/design", tags=["Ontwerp"])
    app.include_router(products.router, prefix="/api/v1/products", tags=["Producten"])
    app.include_router(build_plan.router, prefix="/api/v1/build-plan", tags=["Bouwplan"])
    app.include_router(live_help.router, prefix="/api/v1/live-help", tags=["Live Hulp"])
    app.include_router(reverse.router, prefix="/api/v1/reverse", tags=["Voorbeeld Nadoen"])

    @app.get("/health")
    async def health():
        return {"status": "ok", "version": "1.0.0"}

    return app


app = create_app()
