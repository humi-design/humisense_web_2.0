# AGENTS.md

Repository context for agents working on the Humisense website.

## Stack

- Flask application factory-less single `app.py` (~800 lines), SQLAlchemy models in `models.py`,
  WTForms in `forms.py`, extensions in `extensions.py`, business logic in `services/`.
- Templates: Jinja2, extending `templates/base.html`. Design system lives in
  `static/css/premium.css` (CSS custom properties `--color-*`, `--text-*`, `--space-*`).
  Tailwind is loaded via CDN config in `base.html` for utility classes only.
- Content is data, not templates: `content/*.py` holds services, industries, articles,
  FAQs, legal and hub copy. Routes render those dicts through shared templates.

## Running locally

```bash
python3 app.py                 # http://127.0.0.1:5000
```

Dependencies: Flask, Flask-SQLAlchemy, Flask-Migrate, alembic, Pillow (build-time only).
SQLite database at `instance/humisense.db`. Mail credentials come from the environment
(`MAIL_USERNAME`, `MAIL_PASSWORD`) — there are no defaults.

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
  and must reuse the `--color-*` / `--text-*` / `--space-*` tokens from `premium.css`.
- Analytics: `static/js/analytics.js` pushes to `dataLayer` for GTM container
  `GTM-WJKSCNR3`. Events: `cta_click`, `contact_email_click`, `contact_phone_click`,
  `generate_lead`, `newsletter_signup`, `scroll_depth`. No personal data in events.
