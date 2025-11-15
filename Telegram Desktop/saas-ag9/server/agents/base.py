from typing import Protocol, Dict


class AgentProvider(Protocol):
    def status(self) -> Dict[str, object]:
        """Return agent status/health payload."""
        ...

    def respond(self, message: str, lang: str = "en", session_id: str | None = None, tenant_id: str | None = None) -> Dict[str, str]:
        """Return agent response with at least { reply, lang } keys."""
        ...