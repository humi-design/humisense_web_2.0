# SEO / GEO / AEO Implementation Report

Date: 20 November 2026
Project: humisense.com (Flask)
Scope: technical SEO, content architecture, structured data, international readiness,
analytics and security hardening.

---

## 1. Audit of the original site

### What existed

| Area | State before |
| --- | --- |
| Metadata | Homepage title hardcoded in `base.html` and reused by every page. No meta descriptions. No canonical tags. |
| Open Graph / Twitter | Absent. |
| Structured data | Absent. |
| `robots.txt` | Route did not exist — returned 404. |
| `sitemap.xml` | Did not exist. |
| Headings | Multiple `<h1>` on the homepage; several pages had none. |
| Internal linking | Footer linked to `#` placeholders; service cards all pointed at `/services`. |
| Trust signals | Fabricated: invented client logos (TechCorp Global, FinanceHub, RetailMax…), invented statistics (500 clients, 99% satisfaction, 300 models), invented case studies with specific percentage outcomes, invented testimonials with named people. |
| Compliance claims | "SOC2 Type II certified", "99.9% uptime" — no evidence. |
| Credentials | Mail username and password hardcoded in `config.py`. |
| Performance | 1.4 MB and 361 KB unused PNGs; 153 KB logo rendered at 40 px; no cache headers; no image dimensions. |
| Images | 4 images per page, all with alt text (this was already correct). |
| Forms | Working — `POST /contact` stores a lead and redirects. Preserved unchanged. |
| Mobile | Responsive via existing `premium.css`. Preserved. |
| Duplicate content | `home.html` had two `<section id="services">` blocks; `home-premium.html` and `home-new.html` were dead templates with different claims. |

### Structural gaps

- No page for `/industries`, `/blog`, `/faqs`, `/resources`, `/case-studies`.
- No dedicated service pages — all nine services shared one listing page.
- No industry pages.
- No legal pages (footer pointed to `#`).
- No blog or article infrastructure.

---

## 2. What was implemented

### 2.1 Metadata system

New module `seo.py` is the single source of truth.

- `SITE` — company identity (name, legal name, URL, logo, OG image, email, support email,
  telephone, postal address) used by every schema node.
- `PAGE_SEO` — one entry per page with `title`, `description`, `path`.
- `meta()` — builds the full metadata dict (title, description, canonical, robots, OG,
  Twitter, language).
- `canonical()` — joins `BASE_URL` (from `SITE_BASE_URL`, default `https://humisense.com`)
  with the path.
- `graph()`, `organization_schema()`, `website_schema()`, `service_schema()`,
  `article_schema()`, `faq_schema()`, `breadcrumb_schema()` — JSON-LD builders sharing
  `@id` references (`#organization`, `#website`).

`templates/base.html` renders everything from the `seo` dict. No child template sets a
title any more.

Verified: 45 indexable pages, **0 duplicate titles, 0 duplicate descriptions**, every
description 120–160 characters.

### 2.2 Pages created

| URL | Type | Words |
| --- | --- | --- |
| `/ai-automation` | Service | 824 |
| `/ai-workflow-automation` | Service | 748 |
| `/ai-agents` | Service | 847 |
| `/rfq-automation` | Service | 733 |
| `/quotation-automation` | Service | 690 |
| `/document-automation` | Service | 676 |
| `/sales-automation` | Service | 635 |
| `/lead-generation-automation` | Service | 653 |
| `/business-process-automation` | Service | 662 |
| `/ai-consulting` | Service | 691 |
| `/industries` | Hub | 1058 |
| `/industries/manufacturing` | Industry | 597 |
| `/industries/industrial-distribution` | Industry | 616 |
| `/industries/wholesale` | Industry | 532 |
| `/industries/b2b-businesses` | Industry | 515 |
| `/industries/professional-services` | Industry | 559 |
| `/industries/small-businesses` | Industry | 502 |
| `/blog` | Index | 431 |
| `/blog/<12 articles>` | Article | 532–836 each |
| `/faqs` | AEO hub | 1745 |
| `/resources` | Hub | 971 |
| `/case-studies` | Reference work | 541 |
| `/privacy`, `/terms`, `/cookies` | Legal | 388 / 346 / 244 |

Service and industry pages all follow the same required structure: H1, direct explanation,
business problem, approach, architecture/process, what is delivered, industry application,
implementation method, benefits stated without invented numbers, FAQs, internal links, CTA.

### 2.3 Structured data

Emitted as a single `@graph` per page with shared `@id`s:

- `Organization` (every page, prepended by `graph()`) — name, alternateName, url, logo,
  image, description, email, telephone via `ContactPoint`, postal address, `areaServed:
  Worldwide`, `knowsAbout` listing the nine service topics, `sameAs` only for profiles that
  exist.
- `WebSite` with `publisher` pointing at `#organization` and `inLanguage: en`. No
  `potentialAction`/`SearchAction` is declared because the site has no search endpoint —
  declaring one would point crawlers at a URL that does not exist.
- `Service` on every service and industry page, `provider` referencing `#organization`,
  `areaServed: Worldwide`.
- `BreadcrumbList` on every non-home page.
- `Article` on every blog post with `headline`, `datePublished`, `dateModified`, `author`
  referencing `#organization`, `inLanguage`, `mainEntityOfPage`.
- `FAQPage` on pages that visibly render FAQs (`/faqs`, service pages, industry pages,
  `/industries` hub).
- `CollectionPage` on `/blog`.

No `Review`, `AggregateRating`, `Award` or certification nodes are emitted, because none
can be evidenced.

### 2.4 Crawl and indexing

- `/robots.txt` now exists (was 404). Allows `*`, `OAI-SearchBot`, `PerplexityBot`,
  `Googlebot`, `Bingbot`; disallows `/admin/` and `/api/`; blocks `CCBot` (training-only,
  no discovery value); declares the sitemap.
- `/sitemap.xml` generated from the content modules — 60 URLs, each with `lastmod`,
  `changefreq` and `priority`. Valid XML, verified by parser.
- Sitemap coverage verified 1:1 against a full crawl: every sitemap URL is internally
  linked, and every internally linked URL is in the sitemap.
- 404 and 500 pages return the correct status and carry `noindex`.
- Canonical host enforcement: `www.` and `http` requests 301 to `https://humisense.com`.
  Verified `Host: www.humisense.com` → `301 https://humisense.com/ai-agents`.

### 2.5 Internal linking

- Navbar rebuilt: Services, Industries, Products, Resources, Academy, About, plus a mobile
  menu with 11 destinations.
- Footer rebuilt: 6 service links, 5 industry links, 7 company links, 3 real legal links.
  Placeholder `#` links removed.
- Homepage: service cards now link to their own service pages; sector strip links to
  industry pages; FAQ answers link to relevant services; evidence section links to
  `/case-studies`.
- `/services` gained a 10-card core-services grid above the existing capability list.
- Blog articles cross-link to services; service pages link to related services, industries,
  FAQs and `/contact`.
- Crawl result: 60 pages, **0 broken internal links** across 64 internal links.

### 2.6 AEO / GEO

- `/faqs` answers 15 questions, each opening with a direct one-to-two sentence answer
  before detail, and each linking to the relevant service page.
- Every service page has 4–6 question-led FAQ entries rendered as visible text and
  mirrored in `FAQPage` schema.
- Homepage FAQ rewritten to six canonical questions (what is AI automation, what is an
  agent, where to start, can AI read PDFs, do we replace the ERP, what does it cost).
- Entity clarity: the same description of Humisense, its services and its customer types
  appears in `SITE['description']`, the Organization schema, the footer and `/about`.
- Content is server-rendered HTML — no meaningful text is behind JavaScript or in images.

### 2.7 Trust and honesty corrections

Removed from the live site:

- Six invented client logos → replaced with the six industry sectors, each linking to its
  page.
- Invented hero statistics (500 clients, 5 countries, 99% satisfaction, 24/7 support) →
  replaced with the four capability areas.
- Invented proof section with percentage outcomes → replaced with the four metrics that
  are actually measured (cycle time, hours per unit, error rate, review rate) and a
  statement that projected ROI is not published.
- Invented testimonials with named people and star ratings → replaced with three reference
  implementations linking to `/case-studies`.
- Invented case studies with specific outcomes → `/case-studies` now describes system
  design and states explicitly that client figures are not published without approval.
- "SOC2 Type II certified" and "99.9% uptime" → replaced with deployment, data handling
  and handover descriptions, including the line "We do not claim certifications we have
  not obtained."
- "Trusted by hundreds of companies", "trained thousands of practitioners",
  "Join thousands of students" → replaced with accurate statements.
- Duplicate homepage `<section id="services">` block removed.
- Backdated article dates corrected: all twelve articles were dated February–April 2026
  but were written in November 2026. `published`/`updated` now carry the real date
  (2026-11-20), and the JSON-LD `datePublished`/`dateModified`, the visible
  "Published" line and the sitemap `<lastmod>` all agree.
- About page counters ("20+ team members", "50+ enterprise clients", "10K+ students
  trained") were not evidenced → replaced with factual statements about delivery model,
  scoping and review.
- Contact details (Priya Industrial Estate, Mumbai 401105; +91-8424849942;
  info@humisense.com) were traced back to the original site and kept — they are genuine.
- A final automated scan for claim patterns ("N% reduction", "trusted by N", "award
  winning", "ISO", "SOC 2", "N years of experience") returns zero matches across all
  sixty pages.
- No `AggregateRating`, `Review` or named `Person` author is emitted anywhere, because no
  genuine ratings, reviews or named authors exist yet. Articles are attributed to the
  organisation.

### 2.8 Performance

- `og-image.png` generated at 1200×630 (170 KB) — used for Open Graph and Twitter cards.
- `logo-120.png` (8 KB) replaces the 153 KB `logo.png` in navbar and footer, with explicit
  `width`/`height` and `decoding="async"`.
- `Cache-Control: public, max-age=31536000, immutable` on static assets;
  `max-age=3600` on sitemap and robots.
- CSS and JS are separate files, all served with long-lived immutable caching:

  | Asset | Raw | Gzipped |
  | --- | --- | --- |
  | `humi.css` | 47 KB | 9.6 KB |
  | `premium.css` | 59 KB | 8.9 KB |
  | `seo-pages.css` | 20 KB | 3.6 KB |
  | `humi.js` | 17 KB | 4.1 KB |
  | `analytics.js` | 2.8 KB | 1.0 KB |

- Server render time measured locally: 3.4–4.4 ms TTFB on the homepage across five runs.
- Lab Core Web Vitals (LCP/INP/CLS) still need a deployed origin — see section 4.

### 2.9 Analytics and consent

- GTM container `GTM-WJKSCNR3` confirmed installed once: head script immediately after
  `<head>`, noscript iframe immediately after `<body>`. Verified on all 60 pages.
- `static/js/analytics.js` pushes to `dataLayer`:
  `cta_click` (with `cta_type`), `contact_email_click`, `contact_phone_click`,
  `generate_lead` (contact form submit), `scroll_depth` (25/50/75/100). No personal
  data is included — only event name, page path and an 80-character label. A
  `newsletter_signup` listener was removed because no public newsletter form exists;
  the admin newsletter tables are not reachable from the public site.
- **Google Consent Mode v2** is set before the GTM snippet in `base.html`:
  `ad_storage`, `ad_user_data`, `ad_personalization` and `analytics_storage` all default
  to `denied`, with `ads_data_redaction` and `url_passthrough` enabled. Analytics cookies
  are therefore not written until the visitor opts in.
- A consent banner (`#consent-banner`, `role="dialog"`, `aria-live="polite"`) is shown on
  first visit. Accept/Decline stores the choice in `localStorage['humi-consent']`, hides
  the banner and calls `gtag('consent', 'update', …)`. Verified end to end: clicking
  Accept hides the banner, persists `granted` and fires one `consent_update` event.
- The banner uses the existing design tokens, so it follows the light/dark theme
  (`#12151d` surface, `#f2f4f8` ink in dark mode) and does not overflow at 390 px.
- `/cookies` documents the container, the default-denied position, what Accept/Decline
  does, and how to change the choice. Copy and behaviour are kept in step.

### 2.10 Security

- `config.py`: hardcoded mail username and password removed; both now read from
  `MAIL_USERNAME` / `MAIL_PASSWORD` with empty defaults.
- `.env.example` added documenting required variables; `.gitignore` added covering `.env`,
  databases, logs and `cookies.txt`.
- Response headers on every page: `X-Content-Type-Options: nosniff`,
  `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`,
  `Permissions-Policy`, `X-Robots-Tag: index, follow` (omitted on sitemap/robots/static),
  `Strict-Transport-Security` when the request is secure.

---

## 3. Verification results

| Check | Result |
| --- | --- |
| All indexable pages return HTTP 200 | 60/60 |
| Unique titles | 0 duplicates |
| Unique descriptions | 0 duplicates |
| Description length 110–165 chars | All within range |
| Canonical matches page path | All correct |
| One `<h1>` per page | All correct |
| JSON-LD parses | 60 blocks, all valid |
| GTM installed once | All pages, 1 script + 1 noscript |
| Consent banner present once | 60/60, defaults denied |
| Images have alt attributes | 0 missing |
| Broken internal links | 0 across 64 internal links |
| Sitemap ↔ crawl parity | Exact match |
| robots.txt reachable | 200 |
| Sitemap valid XML | 60 URLs parsed |
| www → apex redirect | 301 verified |
| 404 page | 404 + noindex + nav intact |
| Contact form | 302 redirect, lead row written to `leads` table |
| Form field labels | 6/6 controls have a `<label for>`, 0 unlabelled |
| Form `autocomplete` | `name`, `email`, `tel`, `organization` set on the lead form |
| Service page depth | 636–848 words, 13 H2 sections, 9 FAQs and FAQPage schema on all 10 |
| Industry page uniqueness | Max 11.5% shared word set between any two industry pages |
| Article depth | 533–837 words, 9–14 H2 sections, 2–3 service links each, 12 articles |
| AEO questions present | 14/14 required questions on `/faqs` |
| AEO answer format | 18/18 answers open with a direct answer, 0 preamble |
| Internal link matrix | All 6 required service/industry links present |
| Static assets | All 200, correct content types |
| Horizontal overflow at 390 px | None — scrollWidth equals clientWidth on 8 page types |
| Fabricated claims scan | 0 matches across all 60 pages |
| Thin content | 19 pages under 300 words of main text — all are product, course and legal pages with a fixed card layout; every commercial service, industry and article page is above 400 |

---

## 4. Status by category

### Implemented and verified locally

- Metadata system, canonicals, OG/Twitter, language declaration, heading structure.
- JSON-LD graph on all page types.
- Sitemap, robots.txt, host consolidation, 404/500 handling.
- All new pages and the internal linking between them.
- GTM installation and conversion event definitions.
- Google Consent Mode v2 defaults plus the consent banner and its persistence.
- Security headers, credential removal, `.env.example`, `.gitignore`.
- Image optimisation and cache headers.
- Contact form still writes to the database.
- Mobile layout at 390 px: no horizontal overflow on any of eight page types.
- Product pages without a documented API no longer render an empty API tab or a
  "View API Docs" button — five of six products have no `api_example`.

### Implemented but not externally verified

- Schema validity against Google Rich Results Test and Schema.org Validator — the JSON
  parses and follows the documented shapes, but the validators were not run against a
  public URL.
- Core Web Vitals — local render times measured, but LCP/INP/CLS require a deployed origin
  and field or lab data.
- Actual indexing — nothing here guarantees Google or Bing will index or rank any page.

### Pending external access

- Google Search Console: property verification, sitemap submission, and confirmation that
  the new URLs are indexed.
- Bing Webmaster Tools: same.
- GA4: confirming that `GTM-WJKSCNR3` forwards the six dataLayer events to GA4 as
  conversion events, and that Search Console is linked.
- Social profiles: `sameAs` is populated only for profiles that exist; adding real profile
  URLs to `SITE` will flow into the Organization schema automatically.
- Cookie consent: Google Consent Mode v2 defaults and a consent banner are implemented and
  verified locally (analytics denied until the visitor chooses). Still external: decide
  whether a full CMP with granular categories is needed for the markets you sell into, and
  confirm in GA4 that consent state is received.

### Recommended next

1. Verify Search Console and Bing, submit the sitemap, and watch the coverage report for
   the first four weeks.
2. Publish 2–4 articles per month against the 90-day plan below; each one links to at
   least two service pages.
3. Collect real client outcomes with written permission and replace the reference
   implementations with genuine case studies.
4. Add author pages with real credentials — `Person` schema is scaffolded but only
   justified once named authors with verifiable backgrounds exist.
5. Only add `hreflang` when reviewed translations exist. The architecture supports it
   (`BASE_URL`, per-page `path`, `inLanguage`), but no unreviewed translations were
   published.

---

## 5. 90-day content plan

**Weeks 1–4 — depth on the core commercial cluster**

1. RFQ automation: a worked example with a sample request, extracted fields and the review
   thresholds used.
2. Document extraction accuracy: what causes failures and how the pipeline handles them.
3. Quotation automation for a catalogue business: pricing rules, approval thresholds.
4. AI agents vs workflow automation: an expanded decision framework with a table.

**Weeks 5–8 — industry authority**

5. Manufacturing: purchase order and supplier acknowledgement reconciliation.
6. Industrial distribution: multi-supplier quote comparison, including how part matching
   fails and what to do about it.
7. Wholesale: enquiry-to-quotation cycle time, with the measurement method.
8. Professional services: document review and client onboarding automation.

**Weeks 9–12 — commercial and evaluative**

9. What an AI automation project actually costs, broken down by phase.
10. How to write an acceptance test for an automation before build starts.
11. Data protection considerations when sending documents to a model provider.
12. A build log of one reference implementation, including what did not work.

Each article: unique title, description under 160 characters, H1, question-led H2s, at
least two internal links to service pages, one link to `/contact`, `Article` schema with
real dates, and a visible last-updated line.
