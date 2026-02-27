import logging

from app.services.claude_client import ClaudeClient

logger = logging.getLogger(__name__)


STYLE_DESCRIPTIONS = {
    "japandi": "Japans minimalisme gecombineerd met Scandinavische warmte. Natuurlijke materialen, neutrale kleuren, functioneel design.",
    "scandinavisch": "Licht, functioneel en gezellig. Wit als basis, hout accenten, hygge sfeer.",
    "modern": "Strakke lijnen, hedendaags design, monochroom met kleuraccenten.",
    "industrieel": "Ruw, stoer en authentiek. Metaal, beton, bakstenen muren, open ruimtes.",
    "landelijk": "Warm, natuurlijk en tijdloos. Hout, zachte kleuren, klassieke vormen.",
    "bohemian": "Kleurrijk, eclectisch en persoonlijk. Patronen, textiel, wereldse invloeden.",
    "minimalistisch": "Minder is meer. Essentieel, rustig, veel witruimte.",
}


class DesignEngine:
    def __init__(self, claude: ClaudeClient):
        self.claude = claude

    def suggest(
        self,
        room_analysis: dict,
        style: str,
        budget_min: float | None = None,
        budget_max: float | None = None,
        preferences: list[str] | None = None,
    ) -> dict:
        budget = {}
        if budget_min is not None:
            budget["min"] = budget_min
        if budget_max is not None:
            budget["max"] = budget_max

        return self.claude.suggest_design(
            room_analysis=room_analysis,
            style=style,
            budget=budget,
            preferences=preferences,
        )

    def get_available_styles(self) -> list[dict]:
        return [
            {"key": key, "description": desc}
            for key, desc in STYLE_DESCRIPTIONS.items()
        ]
