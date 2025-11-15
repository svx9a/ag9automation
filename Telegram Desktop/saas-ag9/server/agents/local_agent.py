from datetime import datetime
from typing import Dict


def now_iso() -> str:
    return datetime.utcnow().isoformat(timespec="seconds") + "Z"


class RuleBasedAgent:
    """A minimal local agent that replies to common customer questions.

    This is a placeholder for development. In production, replace with a
    Fetch.ai uAgent and route messages through Agentverse or a uAgents runtime.
    """

    def status(self) -> Dict[str, object]:
        return {
            "name": "rule_based_agent",
            "version": "0.1",
            "healthy": True,
            "time": now_iso(),
        }

    def respond(self, message: str, lang: str = "en") -> Dict[str, str]:
        m = (message or "").strip().lower()

        def reply_en() -> str:
            if any(k in m for k in ["hi", "hello", "hey"]):
                return "Hello! How can I help you today?"
            if "price" in m or "pricing" in m:
                return "Our pricing is flexible. Check the Pricing section or ask me specifics."
            if "trial" in m or "free" in m:
                return "We offer a free 7‑day trial. Want me to guide you to sign up?"
            if "contact" in m or "support" in m:
                return "You can reach support via the Contact section or chat here anytime."
            if "hours" in m or "24" in m:
                return "Our AI runs 24/7; human support replies during business hours."
            return "Got it. I’m here to help—could you share more details?"

        def reply_th() -> str:
            if any(k in m for k in ["สวัสดี", "ไฮ", "เฮ้"]):
                return "สวัสดีค่ะ/ครับ มีอะไรให้ช่วยไหมคะ/ครับ?"
            if "ราคา" in m:
                return "ราคาและแพ็กเกจดูได้ที่หน้า Pricing หรือถามรายละเอียดได้เลยค่ะ/ครับ"
            if "ทดลอง" in m or "ฟรี" in m:
                return "มีทดลองใช้ฟรี 7 วัน สนใจให้ช่วยสมัครไหมคะ/ครับ?"
            if "ติดต่อ" in m or "ซัพพอร์ต" in m:
                return "ติดต่อทีมงานได้ที่หน้า Contact หรือคุยกับบอทได้ที่นี่ค่ะ/ครับ"
            if "24" in m or "ชั่วโมง" in m:
                return "ระบบ AI ทำงาน 24 ชั่วโมง ส่วนทีมงานตอบในเวลาทำการค่ะ/ครับ"
            return "รับทราบค่ะ/ครับ บอกเพิ่มเติมได้เลยนะคะ/ครับว่าต้องการอะไร"

        is_en = lang.startswith("en") if lang else False
        reply_text = reply_en() if is_en else reply_th()
        return {"reply": reply_text, "lang": (lang or ("en" if is_en else "th"))}


# Singleton instance used by FastAPI
agent = RuleBasedAgent()