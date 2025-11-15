import os
from typing import Dict
from datetime import datetime
import requests


def now_iso() -> str:
    return datetime.utcnow().isoformat(timespec="seconds") + "Z"


class FetchAgent:
    """Stub provider that forwards requests to an external uAgent endpoint.

    Configure with FETCH_AGENT_ENDPOINT, e.g., http://localhost:9000 or an Agentverse-hosted URL.
    Expected remote API:
      - POST {base}/respond with JSON { message, lang?, session_id?, tenant_id? }
        -> returns JSON { reply, lang? }
      - GET  {base}/status -> returns JSON status
    """

    def __init__(self) -> None:
        base = os.getenv("FETCH_AGENT_ENDPOINT")
        self.base = (base or "").strip()

    def _ensure_configured(self):
        if not self.base:
            raise RuntimeError("FETCH_AGENT_ENDPOINT not configured")

    def status(self) -> Dict[str, object]:
        self._ensure_configured()
        try:
            r = requests.get(f"{self.base}/status", timeout=6)
            if r.ok:
                return r.json()
            return {"healthy": False, "error": f"status {r.status_code}", "time": now_iso()}
        except Exception as e:
            return {"healthy": False, "error": str(e), "time": now_iso()}

    def respond(self, message: str, lang: str = "en", session_id: str | None = None, tenant_id: str | None = None) -> Dict[str, str]:
        self._ensure_configured()
        payload = {"message": message, "lang": lang, "session_id": session_id, "tenant_id": tenant_id}
        try:
            r = requests.post(f"{self.base}/respond", json=payload, timeout=8)
            if r.ok:
                data = r.json()
                return {"reply": data.get("reply", ""), "lang": data.get("lang", lang or "en")}
            return {"reply": f"Remote agent error ({r.status_code}).", "lang": lang or "en"}
        except Exception as e:
            return {"reply": f"Remote agent unreachable: {e}", "lang": lang or "en"}