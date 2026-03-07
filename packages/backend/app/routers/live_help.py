import json
import logging

from fastapi import APIRouter, Request, WebSocket, WebSocketDisconnect
from pydantic import BaseModel

from app.services.claude_client import ClaudeClient
from app.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()


class ChatMessage(BaseModel):
    question: str
    context: str = ""


class ChatResponse(BaseModel):
    response: str


@router.post("/chat", response_model=ChatResponse)
async def live_help_chat(request: Request, body: ChatMessage):
    """Text-based construction help chat endpoint."""
    claude = request.app.state.claude
    try:
        response_text = claude.text_help(body.question, body.context)
        return ChatResponse(response=response_text)
    except Exception as e:
        logger.error("Chat help error: %s", e)
        return ChatResponse(response="Sorry, er ging iets mis. Probeer het opnieuw.")


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
