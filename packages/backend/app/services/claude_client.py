"""
KlusAI AI Client — powered by Google Gemini.

This module wraps Google's Gemini API to provide all AI capabilities
for KlusAI: room analysis, design suggestions, build plans, reverse
engineering inspiration photos, and live construction help.

Note: The class is still called ClaudeClient to avoid breaking imports
across the codebase. A rename can be done later.
"""

import base64
import json
import logging

from google import genai
from google.genai import types

from app.config import settings

logger = logging.getLogger(__name__)


class ClaudeClient:
    """AI client using Google Gemini (naming kept for backward compat)."""

    def __init__(self):
        self.client = genai.Client(api_key=settings.GOOGLE_AI_API_KEY)
        self.model = settings.GEMINI_MODEL

    # ── Room Analysis ────────────────────────────────────────────

    def analyze_room(self, image_b64: str, media_type: str = "image/jpeg") -> dict:
        image_bytes = base64.b64decode(image_b64)

        response = self.client.models.generate_content(
            model=self.model,
            contents=[
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_bytes(data=image_bytes, mime_type=media_type),
                        types.Part.from_text(text="Analyseer deze kamer grondig."),
                    ],
                ),
            ],
            config=types.GenerateContentConfig(
                system_instruction=(
                    "You are KlusAI's room analysis engine. Analyze the room photo and return "
                    "a JSON object with these exact keys: room_type (string), "
                    "walls (array of {position, color, condition, area_m2}), "
                    "windows (array of {type, wall_position, estimated_size}), "
                    "doors (array of {type, wall_position}), "
                    "floor ({type, condition, color}), "
                    "ceiling ({type, color, height}), "
                    "furniture (array of {name, type, estimated_size, position, style}), "
                    "lighting ({natural, artificial: [], overall_brightness}), "
                    "estimated_dimensions ({width_m, length_m, height_m}), "
                    "style_assessment (string). "
                    "All descriptions must be in Dutch. Return ONLY valid JSON, no markdown."
                ),
                max_output_tokens=4096,
                temperature=0.3,
            ),
        )
        return self._parse_json(response.text)

    # ── Design Suggestions ───────────────────────────────────────

    def suggest_design(
        self,
        room_analysis: dict,
        style: str,
        budget: dict | None = None,
        preferences: list[str] | None = None,
    ) -> dict:
        budget = budget or {}
        preferences = preferences or []
        pref_text = ", ".join(preferences) if preferences else "geen specifieke voorkeuren"

        response = self.client.models.generate_content(
            model=self.model,
            contents=[
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_text(
                            text=(
                                f"Kameranalyse: {json.dumps(room_analysis, ensure_ascii=False)}\n"
                                "Geef gedetailleerde ontwerpsuggesties."
                            )
                        ),
                    ],
                ),
            ],
            config=types.GenerateContentConfig(
                system_instruction=(
                    f"You are KlusAI's interior design engine. The user wants a '{style}' style. "
                    f"User preferences: {pref_text}. "
                    "Return a JSON object with: style, description, "
                    "color_palette (array of {{role, hex_code, paint_name, paint_brand}}), "
                    "furniture_changes (array of {{action, item, suggestion, product_name, store, estimated_price}}), "
                    "lighting_suggestions (array of strings), "
                    "accessories (array of {{type, description, product_name, store, estimated_price}}), "
                    "budget_breakdown (array of {{category, description, estimated_cost}}), "
                    "total_estimated_cost (number), "
                    "mood_keywords (array of strings). "
                    f"Budget range: EUR {budget.get('min', 0)} - {budget.get('max', 5000)}. "
                    "Use real Dutch store products (Gamma, Praxis, IKEA, Karwei, Kwantum). "
                    "All text in Dutch. Return ONLY valid JSON, no markdown."
                ),
                max_output_tokens=4096,
                temperature=0.4,
            ),
        )
        return self._parse_json(response.text)

    # ── Build Plans ──────────────────────────────────────────────

    def create_build_plan(
        self,
        project_description: str,
        room_analysis: dict | None = None,
        skill_level: str = "beginner",
    ) -> dict:
        room_info = (
            json.dumps(room_analysis, ensure_ascii=False)
            if room_analysis
            else "Geen kameranalyse beschikbaar"
        )

        response = self.client.models.generate_content(
            model=self.model,
            contents=[
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_text(
                            text=(
                                f"Project: {project_description}\n"
                                f"Kamerinfo: {room_info}\n"
                                "Maak een gedetailleerd en veilig bouwplan."
                            )
                        ),
                    ],
                ),
            ],
            config=types.GenerateContentConfig(
                system_instruction=(
                    "You are KlusAI's construction planning engine. Create safe, detailed "
                    "step-by-step build plans for home renovation projects. "
                    f"The user's skill level is: {skill_level}. "
                    "CRITICAL: Always include safety warnings. Flag any step requiring a professional "
                    "(electrical, plumbing, structural). Suggest protective equipment. "
                    "Return a JSON object with: title, difficulty (makkelijk/gemiddeld/moeilijk), "
                    "estimated_hours, total_cost_est, safety_level (laag/middel/hoog), "
                    "steps (array of {{order, title, description, tools: [], "
                    "materials: [{{name, quantity, unit, estimated_price}}], "
                    "safety_warnings: [], estimated_mins}}). "
                    "All text in Dutch. Return ONLY valid JSON, no markdown."
                ),
                max_output_tokens=8192,
                temperature=0.3,
            ),
        )
        return self._parse_json(response.text)

    # ── Reverse Engineering ──────────────────────────────────────

    def reverse_engineer(self, image_b64: str, media_type: str = "image/jpeg") -> dict:
        image_bytes = base64.b64decode(image_b64)

        response = self.client.models.generate_content(
            model=self.model,
            contents=[
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_bytes(data=image_bytes, mime_type=media_type),
                        types.Part.from_text(
                            text="Analyseer deze inspiratiefoto. Hoe kan ik deze look namaken?"
                        ),
                    ],
                ),
            ],
            config=types.GenerateContentConfig(
                system_instruction=(
                    "You are KlusAI's reverse engineering engine. Analyze this inspiration photo "
                    "and return a JSON object with: style_name, description, "
                    "color_palette (array of {{role, hex_code, name}}), "
                    "furniture (array of {{item, material, estimated_product, store, estimated_price}}), "
                    "materials (array of {{type, description}}), "
                    "lighting ({{type, description}}), "
                    "how_to_recreate (array of step strings), "
                    "total_estimated_cost. "
                    "Match to Dutch stores: Gamma, Praxis, IKEA, Karwei, Kwantum. "
                    "All text in Dutch. Return ONLY valid JSON, no markdown."
                ),
                max_output_tokens=4096,
                temperature=0.3,
            ),
        )
        return self._parse_json(response.text)

    # ── Live Help ────────────────────────────────────────────────

    def live_help(self, image_b64: str, question: str, media_type: str = "image/jpeg") -> str:
        image_bytes = base64.b64decode(image_b64)

        response = self.client.models.generate_content(
            model=self.model,
            contents=[
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_bytes(data=image_bytes, mime_type=media_type),
                        types.Part.from_text(text=question),
                    ],
                ),
            ],
            config=types.GenerateContentConfig(
                system_instruction=(
                    "You are KlusAI's live construction helper. The user is doing a DIY project "
                    "and showing you their camera feed. Give short, direct, actionable advice in Dutch. "
                    "Focus on safety first. Be concise (max 2-3 sentences)."
                ),
                max_output_tokens=500,
                temperature=0.5,
            ),
        )
        return response.text

    # ── Helpers ──────────────────────────────────────────────────

    @staticmethod
    def _parse_json(text: str) -> dict:
        """Parse JSON from Gemini response, stripping markdown fences if present."""
        cleaned = text.strip()
        if cleaned.startswith("```"):
            lines = cleaned.split("\n")
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            cleaned = "\n".join(lines)
        return json.loads(cleaned)
