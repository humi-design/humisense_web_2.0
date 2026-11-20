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

- `Organization` (homepage and every page via the graph) — name, alternateName, url, logo,
  image, description, email, telephone via `ContactPoint`, postal address, `areaServed:
  Worldwide`, `knowsAbout` listing the nine service topics, `sameAs` only for profiles that
  exist.
- `WebSite` with `potentialAction` search target.
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
- `/sitemap.xml` generated from the content modules — 59 URLs, each with `lastmod`,
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
- Crawl result: 59 pages, **0 broken internal links**.

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

### 2.8 Performance

- `og-image.png` generated at 1200×630 (170 KB) — used for Open Graph and Twitter cards.
- `logo-120.png` (8 KB) replaces the 153 KB `logo.png` in navbar and footer, with explicit
  `width`/`height` and `decoding="async"`.
- `Cache-Control: public, max-age=31536000, immutable` on static assets;
  `max-age=3600` on sitemap and robots.
- CSS and JS are separate files; `analytics.js` is 2.8 KB and deferred.
- Server render time measured locally: 4–14 ms per page.

### 2.9 Analytics

- GTM container `GTM-WJKSCNR3` confirmed installed once: head script immediately after
  `<head>`, noscript iframe immediately after `<body>`. Verified on all 45 pages.
- `static/js/analytics.js` pushes to `dataLayer`:
  `cta_click` (with `cta_type`), `contact_email_click`, `contact_phone_click`,
  `generate_lead` (contact form submit), `newsletter_signup`, `scroll_depth`
  (25/50/75/100). No personal data is included — only event name, page path and an
  80-character label.
- `/cookies` page documents the container and the consent position.

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
| All indexable pages return HTTP 200 | 45/45 |
| Unique titles | 0 duplicates |
| Unique descriptions | 0 duplicates |
| Description length 120–160 chars | All within range |
| Canonical matches page path | All correct |
| One `<h1>` per page | All correct |
| JSON-LD parses | All valid |
| GTM installed once | All pages, head + noscript |
| Images have alt attributes | 0 missing |
| Broken internal links | 0 across 59 crawled URLs |
| Sitemap ↔ crawl parity | Exact match |
| robots.txt reachable | 200 |
| Sitemap valid XML | 59 URLs parsed |
| www → apex redirect | 301 verified |
| 404 page | 404 + noindex + nav intact |
| Contact form | 302 redirect, lead row written to `leads` table |
| Static assets | All 200, correct content types |
| Thin content | No page below 400 words except legal pages (appropriate) |

---

## 4. Status by category

### Implemented and verified locally

- Metadata system, canonicals, OG/Twitter, language declaration, heading structure.
- JSON-LD graph on all page types.
- Sitemap, robots.txt, host consolidation, 404/500 handling.
- All new pages and the internal linking between them.
- GTM installation and conversion event definitions.
- Security headers, credential removal, `.env.example`, `.gitignore`.
- Image optimisation and cache headers.
- Contact form still writes to the database.

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
- Cookie consent: the `/cookies` page states the current position. If consent is legally
  required for the target markets, a CMP must be chosen and GTM configured to respect it —
  this was not implemented because it is a legal and product decision.

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
