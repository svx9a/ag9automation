import os
from typing import Any

from .local_agent import RuleBasedAgent

try:
    from .fetch_agent import FetchAgent
except Exception:
    FetchAgent = None


def get_agent_provider() -> Any:
    provider = (os.getenv("AGENT_PROVIDER") or "local").strip().lower()
    if provider == "fetch" and FetchAgent is not None:
        return FetchAgent()
    # default fallback
    return RuleBasedAgent()