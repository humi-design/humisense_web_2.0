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
