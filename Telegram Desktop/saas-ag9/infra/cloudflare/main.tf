terraform {
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
  required_version = ">= 1.3.0"
}

provider "cloudflare" {
  api_token = var.api_token
}

data "cloudflare_zone" "zone" {
  zone_id = var.zone_id
}

resource "cloudflare_zone_settings_override" "zone_settings" {
  zone_id = var.zone_id
  settings {
    brotli = "on"
    tls_1_3 = "on"
    http3 = "on"
    always_use_https = "on"
    automatic_https_rewrites = "on"
    min_tls_version = "1.2"
    ssl = "strict"
    cache_level = "aggressive"
    image_resizing = "on"
  }
}

resource "cloudflare_ruleset" "waf_custom" {
  zone_id = var.zone_id
  name = "custom-waf"
  kind = "zone"
  phase = "http_request_firewall"
  rules {
    action = "block"
    expression = "lower(http.request.uri.path) contains \"/.env\""
    description = "Block env exposure"
  }
  rules {
    action = "block"
    expression = "lower(http.request.uri.path) contains \"..\""
    description = "Block path traversal"
  }
}

resource "cloudflare_ruleset" "rate_limit_api" {
  zone_id = var.zone_id
  name = "api-rate-limit"
  kind = "zone"
  phase = "http_ratelimit"
  rules {
    action = "rate_limit"
    expression = "starts_with(http.request.uri.path, \"/api/\")"
    ratelimit {
      characteristics = ["ip.src"]
      period = 60
      requests_per_period = 120
      mitigation_timeout = 600
      enable = true
    }
    description = "Rate limit API"
  }
}

resource "cloudflare_load_balancer_pool" "primary" {
  account_id = data.cloudflare_zone.zone.account_id
  name = "primary-pool"
  origins {
    name = "origin-1"
    address = var.lb_origins[0]
    enabled = true
  }
}

resource "cloudflare_load_balancer_pool" "secondary" {
  account_id = data.cloudflare_zone.zone.account_id
  name = "secondary-pool"
  origins {
    name = "origin-2"
    address = var.lb_origins[1]
    enabled = true
  }
}

resource "cloudflare_load_balancer" "lb" {
  zone_id = var.zone_id
  name = var.domain
  fallback_pool = cloudflare_load_balancer_pool.secondary.id
  default_pools = [cloudflare_load_balancer_pool.primary.id, cloudflare_load_balancer_pool.secondary.id]
  proxied = true
}

resource "cloudflare_logpush_job" "http_logs" {
  zone_id = var.zone_id
  name = "http-logs"
  dataset = "http_requests"
  destination_conf = var.logpush_destination
  logpull_options = "fields=ClientIP,EdgeStartTimestamp,CacheCacheStatus,OriginResponseTime,RayID&timestamps=rfc3339"
  enabled = true
}

resource "cloudflare_access_application" "app" {
  zone_id = var.zone_id
  name = "secure-app"
  domain = var.domain
  session_duration = "24h"
}

resource "cloudflare_access_policy" "allow_emails" {
  zone_id = var.zone_id
  application_id = cloudflare_access_application.app.id
  name = "allow-company-email"
  precedence = 1
  decision = "allow"
  include {
    email_domain {
      domain = var.access_email_domain
    }
  }
}

resource "cloudflare_spectrum_application" "tcp_app" {
  zone_id = var.zone_id
  protocol = "tcp"
  name = "tcp-app"
  dns {
    type = "CNAME"
    name = "tcp.${var.domain}"
  }
  origin_direct {
    addresses = var.lb_origins
  }
  tls = "flexible"
}

resource "cloudflare_pages_project" "site" {
  account_id = data.cloudflare_zone.zone.account_id
  name = "automatic-thai"
  production_branch = "main"
  build_config {
    build_command = "npm run build"
    destination_dir = "dist"
    root_dir = ""
    node_version = "20"
  }
}