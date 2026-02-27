import json
import logging

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.services.claude_client import ClaudeClient
from app.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()


@router.websocket("/ws")
async def live_help_websocket(websocket: WebSocket):
    """
    WebSocket endpoint for real-time camera-based construction help.

    Client sends JSON messages:
    {
        "image_base64": "...",
        "question": "Zit ik goed?"
    }

    Server responds with:
    {
        "response": "Ja, ga 2cm naar links..."
    }
    """
    await websocket.accept()
    claude = ClaudeClient()

    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)

            image_b64 = message.get("image_base64", "")
            question = message.get("question", "Wat zie je? Geef advies.")

            if not image_b64:
                await websocket.send_json({"error": "Geen afbeelding ontvangen"})
                continue

            try:
                response_text = claude.live_help(image_b64, question)
                await websocket.send_json({"response": response_text})
            except Exception as e:
                logger.error("Claude live help error: %s", e)
                await websocket.send_json({
                    "error": "Kon geen analyse maken. Probeer opnieuw."
                })
    except WebSocketDisconnect:
        logger.info("Live help WebSocket disconnected")
    except Exception as e:
        logger.error("WebSocket error: %s", e)
