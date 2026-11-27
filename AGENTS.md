# AGENTS.md

Repository context for agents working on the Humisense website.

## Stack

- Flask application factory-less single `app.py` (~800 lines), SQLAlchemy models in `models.py`,
  WTForms in `forms.py`, extensions in `extensions.py`, business logic in `services/`.
- Templates: Jinja2, extending `templates/base.html`. Design system lives in
  `static/css/humi.css` (CSS custom properties: `--ink*`, `--bg*`, `--line*` for colour,
  `--r-*` for radii, `--sp-*` for spacing). `base.html` links `humi.css`, `legacy.css`
  and `hero-system.css`; `seo-pages.css` is linked per page by the SEO templates.
  Tailwind is loaded via CDN config in `base.html` for utility classes only.
- Content is data, not templates: `content/*.py` holds services, industries, articles,
  FAQs, legal and hub copy. Routes render those dicts through shared templates.

## Running locally

```bash
python3 -m pip install -r requirements.txt   # Flask 3.0.0 et al.
python3 app.py                 # http://127.0.0.1:5000
```

Dependencies: Flask, Flask-SQLAlchemy, Flask-Migrate, alembic. SQLite database at
`instance/humisense.db`. Mail credentials come from the environment
(`MAIL_USERNAME`, `MAIL_PASSWORD`) — there are no defaults.

The sandbox image is rebuilt between sessions and does not keep installed packages, so
run the `pip install` line first if `ModuleNotFoundError: flask` appears. Product and
course data live in JSON modules that the reloader does not watch — restart the server
after editing them.

## SEO architecture

- `seo.py` is the single source of metadata: `SITE`, `PAGE_SEO`, `meta()`, `page()`,
  `canonical()`, `graph()`, and the schema builders (`organization_schema()`,
  `website_schema()`, `service_schema()`, `article_schema()`, `faq_schema()`,
  `breadcrumb_schema()`). Every page passes a `seo` dict to `render_template`.
- `templates/base.html` renders title, description, canonical, robots, Open Graph,
  Twitter card and the JSON-LD graph from that dict. Never hardcode titles in child
  templates.
- Service routes are registered one per slug in `_register_service_routes()` so each
  slug gets its own `url_for` endpoint (e.g. `ai_automation`, `rfq_automation`).
- `/sitemap.xml` and `/robots.txt` are generated in `app.py` from the same content
  modules, so new content is picked up automatically.

## Adding a page

1. Add the content dict to the relevant `content/*.py` module.
2. Add the metadata entry to `PAGE_SEO` in `seo.py` (unique title and description;
   description 120–160 characters).
3. Add the route in `app.py`, passing `seo=seo_lib.page('<key>', jsonld=...)`.
4. Link it from a hub page or the footer so it is crawlable and appears in the sitemap.
5. Run the validation script pattern: fetch every route, assert HTTP 200, unique
   `<title>`, one `<h1>`, valid JSON-LD, canonical matches the path.

## Content rules

- Do not fabricate clients, testimonials, certifications, awards, ratings or outcome
  percentages. Case studies are framed as "reference implementations" describing system
  design.
- Do not claim SOC 2, ISO 27001, uptime SLAs or client counts that cannot be evidenced.
- Every commercial page needs: H1, problem, approach, what is delivered, limits, FAQs,
  internal links, CTA.
- FAQ answers lead with a direct answer in the first sentence (AEO/GEO), then detail.

## Conventions

- British spelling in prose ("optimisation", "organisation"), except in code identifiers.
- Templates keep existing class names; new SEO page styles go in `static/css/seo-pages.css`
  and must reuse the `--ink*` / `--bg*` / `--line*` / `--r-*` / `--sp-*` tokens from `humi.css`.
  Small chips and labels use `--r-sm`; `--r-pill` is reserved for navigation links.
- Analytics: `static/js/analytics.js` pushes to `dataLayer` for GTM container
  `GTM-WJKSCNR3`. Events: `cta_click`, `contact_email_click`, `contact_phone_click`,
  `generate_lead`, `scroll_depth`. No personal data in events.
- Consent: `base.html` sets Google Consent Mode v2 defaults (analytics denied) before
  the GTM snippet. `initConsent()` in `static/js/humi.js` shows `#consent-banner`,
  stores the choice in `localStorage['humi-consent']` and calls
  `gtag('consent','update',…)`. The cookie policy copy in `content/pages.py` describes
  this behaviour — update both together.
- Product pages: `templates/product_detail.html` renders the API tab and the "View API
  Docs" button only when `product.api_example` is set; five of six products have none.

## Phase 2 audit findings (2026-11-20)

- Third-party assets are now vendored in `static/vendor/` — the site previously
  loaded `lenis@1.0.42` from unpkg, **a version that does not exist** (39-byte error
  page returned), so smooth scrolling was silently dead. Never point a `<script src>`
  at an unpinned CDN URL; vendor it and confirm `window.<Global>` is defined.
- `sweetalert2` is only used by `course_detail.html`, so it loads in that template's
  `extra_scripts` block rather than site-wide in `base.html`.
- GSAP and ScrollTrigger were unused by any live page and have been removed.
- Heading hierarchy: card headings are `h3`; section headings must be `h2`. Tab panels
  in `product_detail.html` have a visually-hidden `h2` so their `h3` children are legal.
- Honest disclaimers (`.seo-case-study-note`), consent copy (`.consent__text`) and
  deliverable lists (`.seo-tags li`) are body text, not micro-labels — keep them at
  `--t-sm` / ≥0.78rem. `--t-xs` bottoms out at ~11.5px and is for eyebrows only.
- Audit scripts live in `/tmp/aud` (Playwright): `regress.js` (routes/meta), `sem.js`
  (headings), `crawl.js` (internal links), `contrast.js` (both themes), `qa.js`
  (responsive/tiny text/alt), `formtest.js`, `cookietest.js`, `perf.js`, `schema.js`.

## Phase 3: content integrity + accessibility verification (2026-11-24)

Verified state — all 60 sitemap URLs return 200 with unique title/description/canonical,
no accidental noindex, no broken internal links, no horizontal mobile overflow at 390px.

Content-integrity fixes this pass:
- Generic AI-template copy removed from `data/services.json` (12 descriptions),
  `data/courses.json` (11 descriptions), `templates/services.html` CTA,
  `templates/about.html` CTA (also killed a dead `href="#"` "View Careers" button).
- Unverified response-time promises removed: "within 24 hours" in `app.py` (flash +
  JSON reply), `templates/contact.html`, `templates/course_detail.html`; "same day,
  even during busy periods" outcome in `content/industries.py`.
- `data/products.json` already carries honest `stage` (`live`/`development`/
  `prototype`) and `pricing` copy — `templates/products.html` renders stage badges.
  Prototype/development products explicitly say "not available for purchase".
  Do not add a `stage` default that implies availability.

Contrast: root cause was `.env` blocks remapping `--ink` to cream while
`.btn-secondary`/`.btn-outline` kept a glass-white background. Fixed with env-scoped
legacy aliases in `static/css/environments.css`. `.hero-grid__tile--solid` in
`hero-system.css` now uses Rich Purple→Deep Blue so white ink clears 7:1. Remaining
"failures" in the audit are false positives: gradient `background-clip:text` wordmarks
and low-opacity watermarks — both computed against `rgba(0,0,0,0)`.

Performance (measured locally, Playwright + PerformanceObserver):
- CLS 0.064 homepage / 0 content pages. LCP 148–172ms homepage, 1.2–1.5s content.
- `three.min.js` (594KB) loads only on ≥721px with ≥4 deviceMemory/hardwareConcurrency,
  gated on WebGL support. Mobile homepage transfers 199KB / 13 requests — never fetches it.
  Keep that gate; removing it would hand phones a 600KB bill for a hero.

Accessibility: 14 tab stops all show a visible focus ring; `prefers-reduced-motion`
forces every hero element to `opacity:1; transform:none` (verified no text left hidden).
Single GTM container `GTM-WJKSCNR3` (head script + body noscript), consent defaults
set before it.

Fabrication guard: `Organization` schema carries only real details (Mumbai address,
`info@humisense.com`, `+91-8424849942`). No `aggregateRating`, `review`, `award`,
`numberOfEmployees` or `sameAs` — keep it that way. Case studies are labelled
"Reference implementation"; blog `Article` author is `#organization`, not a fake person.
`/research` "Working notes" is driven by `data/research.json`; `data/team.json` is `[]`
so the team section correctly renders nothing.


## Home hero (3D sculpture)

The homepage uses the persistent stage in `static/js/system/`, not the old per-hero
sculpture. Load order matters and is enforced by the loader at the bottom of
`templates/home.html`: `three.min.js`, then `hs-geo`, `hs-materials`, `hs-structure`,
`hs-lighting`, `hs-scene`. `HSScene.init({canvasHost, fallback})` returns the live
controller on `window.__hsSystem`.

Jinja gotcha that cost real debugging time: **never declare `{% block hero_scripts %}`
inside `{% block content %}`**. Jinja renders a nested block both in place *and* where
`base.html` calls it, so the loader runs twice — two canvases, two copies of Three.js,
and a page error from the second scene reading a disposed buffer. The block belongs at
top level in `templates/home.html`.

The stage is a fixed layer at `z-index: 0`; `.hs-ground` sits above it at `z-index: 1`
and **must stay `background: none`**. The page surface is painted on
`body.hs-home` instead. An opaque ground silently hides the entire object, which is
easy to misdiagnose as a WebGL failure because the canvas still reports as present and
opaque.

Camera framing is tuned against the copy column: targets sit left of the object so it
composes into the right half of the viewport. `tests`-style probe: project
`Box3.setFromObject(structure.root)` through the camera and check the object stays
inside the viewport with margin and clears `#hero-heading`'s right edge.

The scene's render loop and the theme handler both write material properties. They
disagree unless everything derives from the single `BASE` table in the scene; an
earlier version had `frame()` resetting glass opacity to literals every frame, which
silently discarded every theme adjustment.

Colour: the environment map must not be white-dominant. With near-mirror glass
(roughness ≤0.07) white panels wash the brand tint out completely and bright pixels
measure saturation 0.00. Coloured env panels + glass roughness ≈0.15 + exposure ≈0.80
keeps hue (target: <6% of pixels below 0.15 saturation).

Performance: measure with `renderer.info` before optimising. The PMREM environment and
`MeshPhysicalMaterial` clearcoat dominate, not triangle count (~10.7k tris, 36 calls).
SwiftShader/llvmpipe report WebGL but render at ~5fps, so both the loader in
`templates/home.html` and `softwareRenderer()` in the scene detect them and serve the
static composition without downloading Three.js. When testing the WebGL path locally,
spoof a hardware GPU string in the Playwright harness — never in the site code.

The static fallback is what reduced-motion, mobile and low-end visitors see
permanently, so it must carry the full composition on its own. Check its contrast
separately (target std ≥20 per channel, p5-to-p95 range ≥60).
