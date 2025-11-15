import os
from typing import Any, Dict

from fastapi import HTTPException, status
import jwt


def _get_supabase_jwt_secret() -> str:
    secret = os.getenv("SUPABASE_JWT_SECRET")
    if not secret:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server missing SUPABASE_JWT_SECRET",
        )
    return secret


def verify_supabase_jwt(token: str) -> Dict[str, Any]:
    """Verify a Supabase JWT (HS256) issued by this project.

    The token is validated using SUPABASE_JWT_SECRET. Audience verification is
    disabled because Supabase does not set a fixed audience for all flows.
    """
    secret = _get_supabase_jwt_secret()
    try:
        payload = jwt.decode(
            token,
            secret,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")