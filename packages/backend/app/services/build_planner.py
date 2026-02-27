import logging

from app.services.claude_client import ClaudeClient

logger = logging.getLogger(__name__)


class BuildPlanner:
    def __init__(self, claude: ClaudeClient):
        self.claude = claude

    def create_plan(
        self,
        description: str,
        room_analysis: dict | None = None,
        skill_level: str = "beginner",
    ) -> dict:
        return self.claude.create_build_plan(
            project_description=description,
            room_analysis=room_analysis,
            skill_level=skill_level,
        )
