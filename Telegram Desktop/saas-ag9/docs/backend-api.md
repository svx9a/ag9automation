# Backend API

## Health

- `GET /health`
- Response: `{ service, status, time }`

## Status

- `GET /status`
- Response: runtime state and last auth event

## Events

- `POST /events`
- Body: `{ wallet_balance_eth?, eth_price_usd?, eks_ready? }`
- Response: `{ ok, updated[] }`

## Auth Events

- `POST /auth-events`
- Body: `{ event, metadata?, time? }`
- Response: `{ ok, received }`

## Chat

- `POST /chat`
- Body: `{ message, lang?, session_id? }`
- Response: `{ reply, lang, session_id }`

## Agent

- `GET /agent/status`
- `POST /agent/route`
- Body: `{ message, lang?, session_id?, tenant_id? }`
- Response: `{ reply, lang, session_id, tenant_id }`

## Auth

- `POST /auth/google`
- Body: `{ id_token }`
- Response: `{ ok, user }`

- `GET /auth/me` (Bearer token required)
- Response: `{ ok, user, claims }`

## Shopify

- `POST /shopify/product`
- Body: `{ product_id }` (string or numeric GID)
- Env required: `SHOPIFY_SHOP`, `SHOPIFY_ACCESS_TOKEN`
- Response: Shopify product JSON

## Partners

- `GET /partners/logos`
- Response: array of `{ name, logo_url, use }`

## Headers

- Responses include `X-Request-ID` for traceability