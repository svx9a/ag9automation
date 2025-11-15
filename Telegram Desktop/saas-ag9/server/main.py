from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.responses import PlainTextResponse
from fastapi.responses import JSONResponse
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from datetime import datetime
import os
import requests
from pydantic import BaseModel
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from server.auth import verify_supabase_jwt
from pydantic import BaseModel
from typing import Optional
import logging
import time
from uuid import uuid4
try:
    from motor.motor_asyncio import AsyncIOMotorClient  # noqa: F401
except Exception:
    AsyncIOMotorClient = None
try:
    from bson import ObjectId as _ObjectId
except Exception:
    _ObjectId = None
import asyncio
try:
    import stripe as _stripe
except Exception:
    _stripe = None
try:
    from prometheus_client import Counter, Histogram, generate_latest, CollectorRegistry
    METRICS_REGISTRY = CollectorRegistry()
    HTTP_REQUESTS_TOTAL = Counter(
        "http_requests_total",
        "Total HTTP requests",
        ["method", "status"],
        registry=METRICS_REGISTRY,
    )
    HTTP_REQUEST_DURATION_SECONDS = Histogram(
        "http_request_duration_seconds",
        "HTTP request duration in seconds",
        ["method"],
        registry=METRICS_REGISTRY,
    )
except Exception:
    METRICS_REGISTRY = None
    HTTP_REQUESTS_TOTAL = None
    HTTP_REQUEST_DURATION_SECONDS = None

# Pluggable agent provider (Local or Fetch.ai)
try:
    from server.agents.provider_factory import get_agent_provider
    AGENT = get_agent_provider()
except Exception:
    AGENT = None

def _env(name: str, default: str | None = None) -> str | None:
    v = os.getenv(name)
    if v is None:
        return default
    s = v.strip()
    if s.startswith("${") and s.endswith("}"):
        return default
    return s or default

app = FastAPI(title="Automation Bridge", version="0.1.0")

# HTTP Bearer for protected endpoints
security = HTTPBearer(auto_error=True)

# Restrict CORS for security; allow Azure site and localhost
allowed_origins_env = _env("ALLOWED_ORIGINS")
if allowed_origins_env:
    allowed_origins = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]
else:
    allowed_origins = [
        "https://sv9-app.azurewebsites.net",
        "http://127.0.0.1:3000",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://localhost:5173",
        "http://127.0.0.1:4173",
        "http://localhost:4173",
    ]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class EventPayload(BaseModel):
    wallet_balance_eth: float | None = None
    eth_price_usd: float | None = None
    eks_ready: bool | None = None

class AuthEvent(BaseModel):
    event: str
    metadata: dict | None = None
    time: str | None = None


class ChatPayload(BaseModel):
    message: str
    lang: str | None = None
    session_id: str | None = None

class GoogleAuthPayload(BaseModel):
    id_token: str

class ShopifyProductQuery(BaseModel):
    product_id: str = Field(..., min_length=1, max_length=64)


# Agent routing models
class AgentRoutePayload(BaseModel):
    message: str
    lang: Optional[str] = None
    session_id: Optional[str] = None
    tenant_id: Optional[str] = "demo"

class AgentRouteResponse(BaseModel):
    reply: str
    lang: Optional[str] = None
    session_id: Optional[str] = None
    tenant_id: Optional[str] = None

class PartnerLogo(BaseModel):
    name: str
    logo_url: str | None = None
    use: bool = False

class ContentItem(BaseModel):
    type: str
    text: str

class MixedAnalysisRequest(BaseModel):
    items: list[ContentItem]
    top_k: int = 50

class TermStat(BaseModel):
    term: str
    count: int

class BilingualPattern(BaseModel):
    pattern: str
    count: int

class MixingStats(BaseModel):
    en_only: int
    th_only: int
    mixed: int
    switches: int

class MixedAnalysisResponse(BaseModel):
    top_en: list[TermStat]
    top_th: list[TermStat]
    en_phrases: list[TermStat]
    th_phrases: list[TermStat]
    bilingual_patterns: list[BilingualPattern]
    mixing: MixingStats
    totals: dict

class AIStreamPayload(BaseModel):
    prompt: str
    provider: Optional[str] = None
    model: Optional[str] = None
    strategy: Optional[str] = "cost"
    tenant_id: Optional[str] = None

class ProviderRouteRequest(BaseModel):
    task: str
    max_tokens: Optional[int] = 2048
    priority: Optional[str] = "cost"
    allow: Optional[list[str]] = None
    tenant_id: Optional[str] = None

class ProviderRouteResponse(BaseModel):
    provider: str
    model: str
    reason: str

class ItemCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1)
    tenant_id: Optional[str] = None

class ItemUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    content: Optional[str] = Field(None, min_length=1)

class ItemOut(BaseModel):
    id: str
    title: str
    content: str
    tenant_id: Optional[str] = None
    created_at: str
    updated_at: str


STATE: dict[str, object] = {
    "wallet_balance_eth": None,
    "eth_price_usd": None,
    "eks_ready": None,
    "last_updated": None,
}


def now_iso() -> str:
    return datetime.utcnow().isoformat(timespec="seconds") + "Z"

MONGO_URI = _env("MONGO_URI")
MONGO_DB = _env("MONGO_DB")
mongo_client = None

def get_db():
    global mongo_client
    if mongo_client is None:
        if not MONGO_URI or AsyncIOMotorClient is None:
            raise HTTPException(status_code=500, detail="mongo_not_configured")
        mongo_client = AsyncIOMotorClient(MONGO_URI)
    db = mongo_client.get_default_database()
    if db is None:
        db = mongo_client[MONGO_DB or "enterprise_ai"]
    return db

@app.on_event("startup")
async def init_db():
    try:
        db = get_db()
        await db["auth_events"].create_index("time")
    except Exception:
        pass


# Serve SPA (built Vite assets in ../dist)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "dist"))
ASSETS_DIR = os.path.join(DIST_DIR, "assets")

if os.path.isdir(ASSETS_DIR):
    app.mount("/assets", StaticFiles(directory=ASSETS_DIR), name="assets")

# Serve local images to avoid cross-origin image blocking (ORB)
IMAGES_DIR = os.path.join(DIST_DIR, "images")
if os.path.isdir(IMAGES_DIR):
    app.mount("/images", StaticFiles(directory=IMAGES_DIR), name="images")

# Serve local fonts if present
FONTS_DIR = os.path.join(DIST_DIR, "fonts")
if os.path.isdir(FONTS_DIR):
    app.mount("/fonts", StaticFiles(directory=FONTS_DIR), name="fonts")

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

@app.middleware("http")
async def request_logging(request: Request, call_next):
    rid = request.headers.get("X-Request-ID") or str(uuid4())
    start = time.time()
    response = await call_next(request)
    duration_ms = int((time.time() - start) * 1000)
    if HTTP_REQUEST_DURATION_SECONDS is not None:
        try:
            HTTP_REQUEST_DURATION_SECONDS.labels(method=request.method).observe(duration_ms / 1000.0)
        except Exception:
            pass
    response.headers["X-Request-ID"] = rid
    try:
        status_code = response.status_code
    except Exception:
        status_code = 0
    logging.info(f"{request.method} {request.url.path} {status_code} {duration_ms}ms rid={rid}")
    if HTTP_REQUESTS_TOTAL is not None:
        try:
            HTTP_REQUESTS_TOTAL.labels(method=request.method, status=str(status_code)).inc()
        except Exception:
            pass
    return response

@app.exception_handler(Exception)
async def unhandled_error_handler(request: Request, exc: Exception):
    rid = request.headers.get("X-Request-ID") or str(uuid4())
    logging.error(f"error rid={rid} path={request.url.path} err={exc}")
    return JSONResponse(status_code=500, content={"error": "internal_error", "request_id": rid})


@app.get("/metrics")
def metrics():
    if METRICS_REGISTRY is None:
        raise HTTPException(status_code=404, detail="metrics_unavailable")
    blob = generate_latest(METRICS_REGISTRY)
    return PlainTextResponse(content=blob, media_type="text/plain; version=0.0.4; charset=utf-8")


@app.get("/status")
def get_status():
    # Optionally enrich ETH price from CoinGecko if missing
    if STATE.get("eth_price_usd") in (None, 0):
        try:
            r = requests.get(
                "https://api.coingecko.com/api/v3/simple/price",
                params={"ids": "ethereum", "vs_currencies": "usd"},
                timeout=4,
            )
            if r.ok:
                price = r.json().get("ethereum", {}).get("usd")
                if isinstance(price, (int, float)):
                    STATE["eth_price_usd"] = float(price)
                    STATE["last_updated"] = now_iso()
        except Exception:
            pass
    return STATE


@app.post("/events")
async def post_event(payload: EventPayload, request: Request):
    data = payload.dict(exclude_none=True)
    for k, v in data.items():
        STATE[k] = v
    STATE["last_updated"] = now_iso()
    return {"ok": True, "updated": list(data.keys())}

@app.post("/auth-events")
async def post_auth_event(payload: AuthEvent, request: Request, db=Depends(get_db)):
    doc = {
        "event": payload.event,
        "metadata": payload.metadata or {},
        "time": payload.time or now_iso(),
        "source": "next_app",
    }
    try:
        await db["auth_events"].insert_one(doc)
    except Exception:
        pass
    STATE["last_auth_event"] = doc
    STATE["last_updated"] = now_iso()
    return {"ok": True, "received": payload.event}

@app.get("/auth-events")
async def list_auth_events(limit: int = 20, db=Depends(get_db)):
    try:
        cursor = db["auth_events"].find({}, sort=[("_id", -1)], limit=limit)
        items = await cursor.to_list(length=limit)
        for x in items:
            x["_id"] = str(x["_id"])
        return {"ok": True, "items": items}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"db_list_error: {e}")

@app.get("/db/health")
async def db_health(db=Depends(get_db)):
    try:
        r = await db.command("ping")
        return {"ok": True, "result": r}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"db_error: {e}")

@app.post("/db/benchmark")
async def db_benchmark(n: int = 200, db=Depends(get_db)):
    import random
    import string
    start = time.perf_counter()
    docs = []
    for i in range(max(1, n)):
        docs.append({"k": i, "v": "".join(random.choice(string.ascii_letters) for _ in range(24)), "t": _now()})
    try:
        await db["bench"].insert_many(docs)
        mid = time.perf_counter()
        cursor = db["bench"].find({}, limit=50)
        _ = await cursor.to_list(length=50)
        end = time.perf_counter()
        await db["bench"].drop()
        return {"ok": True, "insert_ms": round((mid - start) * 1000, 2), "query_ms": round((end - mid) * 1000, 2), "n": n}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"db_benchmark_error: {e}")


def _oid(id_str: str):
    if _ObjectId is None:
        return id_str
    try:
        return _ObjectId(id_str)
    except Exception:
        raise HTTPException(status_code=400, detail="invalid_id")

def _claims(credentials: HTTPAuthorizationCredentials):
    return verify_supabase_jwt(credentials.credentials)

def _now() -> str:
    return datetime.utcnow().isoformat(timespec="seconds") + "Z"

@app.post("/items", response_model=ItemOut)
async def create_item(payload: ItemCreate, db=Depends(get_db), credentials: HTTPAuthorizationCredentials = Depends(security)):
    claims = _claims(credentials)
    tenant = payload.tenant_id or claims.get("tenant_id") or "default"
    now = _now()
    doc = {"title": payload.title, "content": payload.content, "tenant_id": tenant, "created_at": now, "updated_at": now}
    try:
        res = await db["items"].insert_one(doc)
        return ItemOut(id=str(res.inserted_id), title=doc["title"], content=doc["content"], tenant_id=tenant, created_at=now, updated_at=now)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"db_insert_error: {e}")

@app.get("/items", response_model=list[ItemOut])
async def list_items(limit: int = 50, tenant_id: Optional[str] = None, db=Depends(get_db), credentials: HTTPAuthorizationCredentials = Depends(security)):
    claims = _claims(credentials)
    tenant = tenant_id or claims.get("tenant_id") or "default"
    try:
        cursor = db["items"].find({"tenant_id": tenant}, sort=[("_id", -1)], limit=limit)
        rows = await cursor.to_list(length=limit)
        out = []
        for r in rows:
            out.append(ItemOut(id=str(r.get("_id")), title=r.get("title"), content=r.get("content"), tenant_id=r.get("tenant_id"), created_at=r.get("created_at"), updated_at=r.get("updated_at")))
        return out
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"db_list_error: {e}")

@app.get("/items/{item_id}", response_model=ItemOut)
async def get_item(item_id: str, db=Depends(get_db), credentials: HTTPAuthorizationCredentials = Depends(security)):
    claims = _claims(credentials)
    tenant = claims.get("tenant_id")
    try:
        r = await db["items"].find_one({"_id": _oid(item_id)})
        if not r:
            raise HTTPException(status_code=404, detail="not_found")
        if tenant and r.get("tenant_id") != tenant:
            raise HTTPException(status_code=403, detail="forbidden")
        return ItemOut(id=str(r.get("_id")), title=r.get("title"), content=r.get("content"), tenant_id=r.get("tenant_id"), created_at=r.get("created_at"), updated_at=r.get("updated_at"))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"db_get_error: {e}")

@app.put("/items/{item_id}", response_model=ItemOut)
async def update_item(item_id: str, payload: ItemUpdate, db=Depends(get_db), credentials: HTTPAuthorizationCredentials = Depends(security)):
    claims = _claims(credentials)
    tenant = claims.get("tenant_id") or "default"
    fields = {k: v for k, v in payload.dict(exclude_none=True).items()}
    if not fields:
        raise HTTPException(status_code=400, detail="empty_update")
    fields["updated_at"] = _now()
    try:
        r = await db["items"].find_one({"_id": _oid(item_id)})
        if not r:
            raise HTTPException(status_code=404, detail="not_found")
        if r.get("tenant_id") != tenant:
            raise HTTPException(status_code=403, detail="forbidden")
        await db["items"].update_one({"_id": _oid(item_id)}, {"$set": fields})
        r.update(fields)
        return ItemOut(id=str(r.get("_id")), title=r.get("title"), content=r.get("content"), tenant_id=r.get("tenant_id"), created_at=r.get("created_at"), updated_at=r.get("updated_at"))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"db_update_error: {e}")

@app.delete("/items/{item_id}")
async def delete_item(item_id: str, db=Depends(get_db), credentials: HTTPAuthorizationCredentials = Depends(security)):
    claims = _claims(credentials)
    tenant = claims.get("tenant_id") or "default"
    try:
        r = await db["items"].find_one({"_id": _oid(item_id)})
        if not r:
            raise HTTPException(status_code=404, detail="not_found")
        if r.get("tenant_id") != tenant:
            raise HTTPException(status_code=403, detail="forbidden")
        await db["items"].delete_one({"_id": _oid(item_id)})
        return {"ok": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"db_delete_error: {e}")


@app.post("/chat")
async def chat(payload: ChatPayload):
    """Simple rule-based chat responses for customer service."""
    user = (payload.message or "").strip().lower()
    lang = (payload.lang or "").lower()
    # Very simple intent detection
    def reply_en():
        if any(k in user for k in ["hi", "hello", "hey"]):
            return "Hello! How can I help you today?"
        if "price" in user or "pricing" in user:
            return "Our pricing is flexible. Check the Pricing section or ask me specifics."
        if "trial" in user or "free" in user:
            return "We offer a free 7‑day trial. Want me to guide you to sign up?"
        if "contact" in user or "support" in user:
            return "You can reach support via the Contact section or chat here anytime."
        if "hours" in user or "24" in user:
            return "Our AI runs 24/7; human support replies during business hours."
        return "Got it. I’m here to help—could you share more details?"

    def reply_th():
        if any(k in user for k in ["สวัสดี", "ไฮ", "เฮ้"]):
            return "สวัสดีค่ะ/ครับ มีอะไรให้ช่วยไหมคะ/ครับ?"
        if "ราคา" in user:
            return "ราคาและแพ็กเกจดูได้ที่หน้า Pricing หรือถามรายละเอียดได้เลยค่ะ/ครับ"
        if "ทดลอง" in user or "ฟรี" in user:
            return "มีทดลองใช้ฟรี 7 วัน สนใจให้ช่วยสมัครไหมคะ/ครับ?"
        if "ติดต่อ" in user or "ซัพพอร์ต" in user:
            return "ติดต่อทีมงานได้ที่หน้า Contact หรือคุยกับบอทได้ที่นี่ค่ะ/ครับ"
        if "24" in user or "ชั่วโมง" in user:
            return "ระบบ AI ทำงาน 24 ชั่วโมง ส่วนทีมงานตอบในเวลาทำการค่ะ/ครับ"
        return "รับทราบค่ะ/ครับ บอกเพิ่มเติมได้เลยนะคะ/ครับว่าต้องการอะไร"

    is_en = lang.startswith("en") if lang else False
    text = reply_en() if is_en else reply_th()
    return {"reply": text, "lang": lang or "th", "session_id": payload.session_id}


 # Firebase auth endpoint removed (Firebase disabled)


@app.post("/auth/google")
def auth_google(payload: GoogleAuthPayload):
    """Verify Google ID token directly via Google public keys."""
    client_id = _env("GOOGLE_OAUTH_CLIENT_ID")
    if not client_id:
        raise HTTPException(status_code=500, detail="Server missing GOOGLE_OAUTH_CLIENT_ID")
    try:
        request = google_requests.Request()
        decoded = google_id_token.verify_oauth2_token(payload.id_token, request, audience=client_id)
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid Google token: {e}")

    user_info = {
        "uid": decoded.get("sub"),
        "email": decoded.get("email"),
        "name": decoded.get("name"),
        "picture": decoded.get("picture"),
        "provider": "google",
    }
    return {"ok": True, "user": user_info}


@app.get("/health")
def health():
    return {"service": "automation-bridge", "status": "ok", "time": now_iso()}


@app.get("/partners/logos")
def partners_logos() -> list[PartnerLogo]:
    partners = [
        PartnerLogo(name="Trae AI", logo_url="/images/trae-ai.svg", use=True),
        PartnerLogo(name="xAI", use=False),
        PartnerLogo(name="Microsoft Azure", use=False),
        PartnerLogo(name="Cloudflare", use=False),
        PartnerLogo(name="Partner 3", use=False),
        PartnerLogo(name="Partner 4", use=False),
        PartnerLogo(name="Vercel", use=False),
        PartnerLogo(name="OpenAI", use=False),
        PartnerLogo(name="Anthropic", use=False),
        PartnerLogo(name="Google Cloud", use=False),
        PartnerLogo(name="AWS", use=False),
        PartnerLogo(name="Hugging Face", use=False),
        PartnerLogo(name="Mistral AI", use=False),
        PartnerLogo(name="Stability AI", use=False),
        PartnerLogo(name="Meta", use=False),
        PartnerLogo(name="Cohere", use=False),
    ]
    return partners


# Root serves the SPA index.html if available
@app.get("/")
def serve_spa_root():
    index_path = os.path.join(DIST_DIR, "index.html")
    if os.path.isfile(index_path):
        return FileResponse(index_path, media_type="text/html")
    # Fallback to health JSON if SPA not built yet
    return {"service": "automation-bridge", "status": "ok", "time": now_iso()}


# Protected endpoint to return current user claims from Supabase JWT
@app.get("/auth/me")
def auth_me(credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = verify_supabase_jwt(credentials.credentials)
    user_info = {
        "id": payload.get("sub"),
        "email": payload.get("email"),
        "role": payload.get("role"),
        "provider": payload.get("provider"),
    }
    return {"ok": True, "user": user_info, "claims": payload}


# --- Shopify proxy endpoints ---
@app.post("/shopify/product")
def shopify_product(payload: ShopifyProductQuery):
    shop = os.getenv("SHOPIFY_SHOP")
    token = os.getenv("SHOPIFY_ACCESS_TOKEN")
    if not shop or not token:
        raise HTTPException(status_code=500, detail="Shopify not configured")

    url = f"https://{shop}/admin/api/2024-10/graphql.json"
    headers = {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
    }

    gid = payload.product_id
    if gid.isdigit():
        gid = f"gid://shopify/Product/{gid}"

    query = {
        "query": f"""
        {{
          product(id: \"{gid}\") {{
            id
            title
            handle
            descriptionHtml
            vendor
            productType
            tags
            status
            totalInventory
            variants(first: 50) {{
              edges {{
                node {{
                  id
                  title
                  sku
                  barcode
                  price
                  inventoryQuantity
                  inventoryItem {{
                    id
                    tracked
                    measurement {{
                      weight {{
                        unit
                        value
                      }}
                    }}
                  }}
                }}
              }}
            }}
            images(first: 10) {{
              edges {{
                node {{
                  url
                  altText
                }}
              }}
            }}
          }}
        }}
        """
    }

    try:
        r = requests.post(url, json=query, headers=headers, timeout=10)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Shopify request failed: {e}")
    if not r.ok:
        raise HTTPException(status_code=r.status_code, detail=r.text)
    body = r.json()
    product = (body.get("data") or {}).get("product")
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

application = app

# --- Agent routing endpoints ---

@app.get("/agent/status")
def agent_status():
    """Return basic status of the local agent service (stub)."""
    try:
        if AGENT:
            status = AGENT.status()
        else:
            status = {
                "name": "rule_based_agent",
                "version": "0.1",
                "healthy": True,
                "time": now_iso(),
            }
        return {"ok": True, "agent": status}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent status error: {e}")


@app.post("/agent/route")
async def agent_route(payload: AgentRoutePayload):
    """Route a message to the local agent and return a reply.

    This is a stub that mirrors /chat logic now. Later you can replace LocalAgent
    with a Fetch.ai uAgent hosted in Agentverse or a dedicated uAgents runtime.
    """
    message = (payload.message or "").strip()
    lang = (payload.lang or "").lower()

    if not message:
        raise HTTPException(status_code=400, detail="Message is required")

    try:
        if AGENT:
            result = AGENT.respond(message=message, lang=lang, session_id=payload.session_id, tenant_id=payload.tenant_id)
            reply = result.get("reply") or ""
            lang_out = result.get("lang") or lang or "en"
        else:
            # Fallback to same rule-based logic as /chat
            def reply_en():
                m = message.lower()
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

            def reply_th():
                m = message.lower()
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
            reply = reply_en() if is_en else reply_th()
            lang_out = lang or ("en" if is_en else "th")

        return AgentRouteResponse(
            reply=reply,
            lang=lang_out,
            session_id=payload.session_id,
            tenant_id=payload.tenant_id,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent routing error: {e}")


# --- Unified AI orchestration ---

def _choose_provider(req: ProviderRouteRequest) -> ProviderRouteResponse:
    allow = [p.lower() for p in (req.allow or ["openai","anthropic","google"])]
    prices = {
        "openai": {"gpt-4o-mini": 0.005},
        "anthropic": {"claude-3-haiku": 0.008},
        "google": {"gemini-1.5-flash": 0.002},
    }
    best_provider = None
    best_model = None
    best_price = 1e9
    for p in allow:
        if p in prices:
            models = prices[p]
            for m, c in models.items():
                if req.priority == "speed":
                    score = c * 1.1
                else:
                    score = c
                if score < best_price:
                    best_price = score
                    best_provider = p
                    best_model = m
    if not best_provider:
        best_provider = "openai"
        best_model = "gpt-4o-mini"
    return ProviderRouteResponse(provider=best_provider, model=best_model, reason="heuristic_selection")

@app.post("/ai/route", response_model=ProviderRouteResponse)
def ai_route(payload: ProviderRouteRequest, credentials: HTTPAuthorizationCredentials = Depends(security)):
    _ = _claims(credentials)
    return _choose_provider(payload)

def _sse_format(data: str) -> bytes:
    return ("data: " + data + "\n\n").encode("utf-8")

def _stream_openai(prompt: str, model: str):
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        async def _fake():
            for w in prompt.split():
                yield _sse_format(w)
                await asyncio.sleep(0.05)
            yield _sse_format("[DONE]")
        return _fake()
    url = "https://api.openai.com/v1/chat/completions"
    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    body = {"model": model, "messages": [{"role": "user", "content": prompt}], "stream": True}
    def gen():
        try:
            r = requests.post(url, headers=headers, json=body, stream=True, timeout=60)
            for line in r.iter_lines():
                if not line:
                    continue
                try:
                    yield line + b"\n\n"
                except Exception:
                    pass
        except Exception:
            yield _sse_format("error")
            yield _sse_format("[DONE]")
    return gen()

@app.post("/ai/stream")
def ai_stream(payload: AIStreamPayload, credentials: HTTPAuthorizationCredentials = Depends(security)):
    claims = _claims(credentials)
    tenant = payload.tenant_id or claims.get("tenant_id") or "default"
    provider = (payload.provider or "").lower()
    if not provider:
        sel = _choose_provider(ProviderRouteRequest(task="chat", priority=payload.strategy))
        provider = sel.provider
        model = sel.model
    else:
        model = payload.model or ("gpt-4o-mini" if provider == "openai" else "gemini-1.5-flash")
    if provider == "openai":
        gen = _stream_openai(payload.prompt, model)
    else:
        async def fake():
            for w in payload.prompt.split():
                yield _sse_format(w)
                await asyncio.sleep(0.05)
            yield _sse_format("[DONE]")
        gen = fake()
    headers = {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "X-Tenant": tenant,
    }
    return StreamingResponse(gen, media_type="text/event-stream", headers=headers)


# --- Billing (Stripe) ---

@app.get("/billing/plans")
def billing_plans():
    return {
        "plans": [
            {"name": "Startup", "price_month": 999, "users": 50},
            {"name": "Growth", "price_month": 4999, "users": 200},
            {"name": "Enterprise", "price_month": 19999, "users": -1, "white_label": True},
        ]
    }

@app.post("/billing/checkout")
def billing_checkout(plan: str, credentials: HTTPAuthorizationCredentials = Depends(security)):
    _ = _claims(credentials)
    if _stripe is None:
        raise HTTPException(status_code=500, detail="stripe_unavailable")
    key = _env("STRIPE_SECRET_KEY")
    domain = os.getenv("PUBLIC_APP_DOMAIN")
    if not key or not domain:
        raise HTTPException(status_code=500, detail="stripe_not_configured")
    _stripe.api_key = key
    price_map = {
        "startup": _env("STRIPE_PRICE_STARTUP"),
        "growth": _env("STRIPE_PRICE_GROWTH"),
        "enterprise": _env("STRIPE_PRICE_ENTERPRISE"),
    }
    price_id = price_map.get(plan.lower())
    if not price_id:
        raise HTTPException(status_code=400, detail="invalid_plan")
    try:
        session = _stripe.checkout.Session.create(
            mode="subscription",
            line_items=[{"price": price_id, "quantity": 1}],
            success_url=f"{domain}/billing/success",
            cancel_url=f"{domain}/billing/cancel",
        )
        return {"id": session.get("id"), "url": session.get("url")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"stripe_error: {e}")

@app.post("/billing/webhook")
async def billing_webhook(request: Request):
    if _stripe is None:
        raise HTTPException(status_code=500, detail="stripe_unavailable")
    key = _env("STRIPE_WEBHOOK_SECRET")
    payload = await request.body()
    sig = request.headers.get("Stripe-Signature")
    event = None
    try:
        if key:
            event = _stripe.Webhook.construct_event(payload, sig, key)
        else:
            data = await request.json()
            event = _stripe.Event.construct_from(data, _stripe.api_key)
    except Exception:
        raise HTTPException(status_code=400, detail="invalid_signature")
    return {"ok": True}


# --- White‑label config ---

@app.get("/whitelabel/config")
def whitelabel_config(tenant_id: Optional[str] = None):
    logo_url = os.getenv("DEFAULT_LOGO_URL") or ""
    brand_name = os.getenv("DEFAULT_BRAND_NAME") or "EnterpriseAI"
    theme_color = os.getenv("DEFAULT_THEME_COLOR") or "#FF8C00"
    return {"tenant_id": tenant_id or "default", "logo_url": logo_url, "brand_name": brand_name, "theme_color": theme_color}


# --- Analytics ---

class AnalyticsEvent(BaseModel):
    name: str
    props: dict | None = None
    tenant_id: Optional[str] = None

@app.post("/analytics/events")
async def analytics_events(evt: AnalyticsEvent, db=Depends(get_db), credentials: HTTPAuthorizationCredentials = Depends(security)):
    claims = _claims(credentials)
    tenant = evt.tenant_id or claims.get("tenant_id") or "default"
    doc = {"name": evt.name, "props": evt.props or {}, "tenant_id": tenant, "time": now_iso()}
    try:
        await db["analytics_events"].insert_one(doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"db_insert_error: {e}")
    return {"ok": True}

def _is_thai_char(ch: str) -> bool:
    c = ord(ch)
    return 0x0E00 <= c <= 0x0E7F

def _lang_of_text(text: str) -> str:
    total = len(text)
    if total == 0:
        return "en"
    thai = sum(1 for ch in text if _is_thai_char(ch))
    latin = sum(1 for ch in text if ("A" <= ch <= "Z") or ("a" <= ch <= "z"))
    if thai > 0 and latin == 0:
        return "th"
    if latin > 0 and thai == 0:
        return "en"
    if thai == 0 and latin == 0:
        return "en"
    return "mixed"

def _split_sentences(text: str) -> list[str]:
    import re
    parts = re.split(r"[\.!?\u2026\n]+", text)
    return [p.strip() for p in parts if p.strip()]

def _tokenize_en(text: str) -> list[str]:
    import re
    s = text.lower()
    toks = re.findall(r"[a-zA-Z']+", s)
    sw = {
        "the","a","an","and","or","but","if","then","else","on","in","at","to","for","from","of","with","without","by","as","is","are","was","were","be","been","this","that","these","those","it","its","we","our","you","your","i","me","my","they","them","their","he","she","his","her","not"
    }
    return [t for t in toks if t not in sw and len(t) > 1]

def _tokenize_thai(text: str) -> list[str]:
    import re
    thai_seq = ''.join(ch if _is_thai_char(ch) or ch.isspace() else ' ' for ch in text)
    raw = [t for t in re.split(r"\s+", thai_seq) if t]
    if any(_is_thai_char(ch) for ch in ''.join(raw)) and sum(len(t) for t in raw) <= 4:
        letters = [ch for ch in thai_seq if _is_thai_char(ch)]
        grams = []
        for n in (2,3):
            for i in range(0, max(0, len(letters)-n+1)):
                grams.append(''.join(letters[i:i+n]))
        return grams
    return raw

def _bigrams(tokens: list[str]) -> list[str]:
    out = []
    for i in range(len(tokens)-1):
        out.append(tokens[i] + ' ' + tokens[i+1])
    return out

@app.post("/analysis/mixed-content", response_model=MixedAnalysisResponse)
async def analyze_mixed(req: MixedAnalysisRequest):
    import collections
    en_terms = collections.Counter()
    th_terms = collections.Counter()
    en_phr = collections.Counter()
    th_phr = collections.Counter()
    patterns = collections.Counter()
    sent_stats = {"en":0,"th":0,"mixed":0}
    switches = 0
    for item in req.items:
        text = item.text or ""
        sentences = _split_sentences(text)
        for s in sentences:
            lang = _lang_of_text(s)
            sent_stats[lang] = sent_stats.get(lang,0)+1
            if lang == "en":
                toks = _tokenize_en(s)
                for t in toks:
                    en_terms[t]+=1
                for bg in _bigrams(toks):
                    en_phr[bg]+=1
            elif lang == "th":
                toks = _tokenize_thai(s)
                for t in toks:
                    th_terms[t]+=1
                for bg in _bigrams(toks):
                    th_phr[bg]+=1
            else:
                en_t = _tokenize_en(s)
                th_t = _tokenize_thai(s)
                for t in en_t:
                    en_terms[t]+=1
                for t in th_t:
                    th_terms[t]+=1
                seq = []
                for ch in s:
                    if _is_thai_char(ch):
                        seq.append('th')
                    elif ("A"<=ch<="Z") or ("a"<=ch<="z"):
                        seq.append('en')
                for i in range(1,len(seq)):
                    if seq[i]!=seq[i-1]:
                        switches+=1
                if en_t and th_t:
                    patterns['TH→EN']+=1
                    patterns['EN→TH']+=1
                for bg in _bigrams(en_t):
                    en_phr[bg]+=1
                for bg in _bigrams(th_t):
                    th_phr[bg]+=1
    top_k = max(1, req.top_k)
    top_en = [TermStat(term=t,count=c) for t,c in en_terms.most_common(top_k)]
    top_th = [TermStat(term=t,count=c) for t,c in th_terms.most_common(top_k)]
    en_ph = [TermStat(term=t,count=c) for t,c in en_phr.most_common(top_k)]
    th_ph = [TermStat(term=t,count=c) for t,c in th_phr.most_common(top_k)]
    pats = [BilingualPattern(pattern=t,count=c) for t,c in patterns.most_common(50)]
    totals = {
        "total_tokens_en": sum(en_terms.values()),
        "total_tokens_th": sum(th_terms.values()),
        "sum_top_en": sum(c.count for c in top_en),
        "sum_top_th": sum(c.count for c in top_th),
        "sentences_en": sent_stats.get("en",0),
        "sentences_th": sent_stats.get("th",0),
        "sentences_mixed": sent_stats.get("mixed",0)
    }
    mixing = MixingStats(en_only=sent_stats.get("en",0), th_only=sent_stats.get("th",0), mixed=sent_stats.get("mixed",0), switches=switches)
    return MixedAnalysisResponse(top_en=top_en, top_th=top_th, en_phrases=en_ph, th_phrases=th_ph, bilingual_patterns=pats, mixing=mixing, totals=totals)