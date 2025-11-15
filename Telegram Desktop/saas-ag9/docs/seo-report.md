# Bilingual SEO Audit and Optimization Report

## Overview
- Site implements bilingual targeting (`th` and `en`) via `?lang` parameter.
- Head tags now switch canonical and social meta per language; structured data matches page language.
- Performance hints added to speed up first render and scrolling logo strip.

## Changes Implemented
- Technical SEO
  - Dynamic canonical (`/` for Thai, `/?lang=en` for English).
  - `hreflang` alternates (`th`, `en`, `x-default`).
  - Language auto-detection on first visit with `localStorage` preference and opt-out (`?noredir=1`).
  - `content-language` meta toggles (`th-TH`/`en-US`).
- Content & Social Meta
  - `title` and `description` toggle to English on `?lang=en`.
  - `og:title`, `og:description`, `og:url`, `og:locale` toggle per language.
  - `twitter:title`, `twitter:description`, `twitter:url` toggle per language.
- Structured Data
  - `Organization` JSON-LD retained.
  - `WebSite` JSON-LD switches: Thai kept for `lang=th`, English kept for `lang=en`.
- Performance Enhancements
  - Preload critical hero background image.
  - Preconnect/dns-prefetch for external asset CDNs.
  - `decoding="async"` added to partner logos; `fetchpriority="low"` for non-critical images.
  - Hero logo prioritized (`fetchpriority="high"`); GIF set to `loading="lazy"`.

## Recommended Next Steps
- URL Structure
  - Adopt path-based locales (`/th/`, `/en/`) or subdomains for clearer targeting.
  - Ensure `hreflang` reflects final URL structure across all pages.
- Content Optimization
  - Finalize concise titles (≤60 chars) and descriptions (≤160 chars) in both languages.
  - Localize on-page H1/H2s, CTA texts, and alt attributes consistently.
  - Build bilingual keyword maps by intent (awareness → conversion); integrate into copy.
- Performance
  - Audit LCP and CLS across devices; set width/height for key images if stable.
  - Compress hero assets (WebP/AVIF), consider responsive `srcset`.
  - Bundle analysis: code-split non-critical sections.
- International SEO
  - Verify language versions in Search Console (separate properties per locale path/subdomain).
  - Geo-targeting only if local subdomain or ccTLD is used.
  - Submit sitemaps per locale with alternates.
- Analytics & Reporting
  - Track key metrics: impressions, CTR, clicks per language; LCP/FID/CLS.
  - Compare before/after using Search Console and analytics dashboards.

## Before/After Metrics (Placeholders)
- Before: No dynamic canonical; OG/Twitter fixed to Thai; duplicate WebSite JSON-LD.
- After: Canonical, social meta, and structured data aligned with selected language; image loading optimized.

## Ongoing Strategy
- Quarterly content refresh aligned to seasonal queries.
- Monitor indexation and crawl stats per locale.
- Iterate on page speed with real-user metrics and A/B tests for key landing pages.