# Humisense – SEO / GEO / AEO Implementation & Audit Report

**Domain:** https://humisense.com/ · **Branch:** `seo-geo-aeo-implementation`
**Scope:** Phase 1 (SEO/GEO/AEO implementation) + Phase 2 (full site audit and repair)

---

## 1. Original website audit (pre-implementation state)

The audit was run against the existing Flask application before any changes, using
Playwright scripts in `/tmp/aud`.

| Area | Finding |
| --- | --- |
| Titles / descriptions | Homepage title reused as the fallback on several pages; no central registry. |
| Canonicals | Missing on all pages. |
| Structured data | None present. |
| `robots.txt` / `sitemap.xml` | Both absent. |
| Heading structure | Multiple pages skipped levels (H1→H3→H4); card headings duplicated level with section headings. |
| Third-party JS | `lenis@1.0.42` loaded from unpkg — **a version that does not exist**. The request returned a 39-byte error body, so `window.Lenis` was `undefined` and smooth scrolling never ran. |
| Bundled JS | `gsap.min.js` (72 KB) + `ScrollTrigger.min.js` (43 KB) shipped but referenced only by unused legacy scripts. |
| SweetAlert2 | `sweetalert2@11` (unpinned, no SRI) loaded on every page but used by one template. |
| Mobile payload | ~813 KB transferred, ~637 KB of it JavaScript, including a 608 KB Three.js sculpture fetched even on phones. |
| Contrast | One failing pairing: `.seo-case-study-type` at 4.25:1. |
| Body text size | Honest disclaimer copy and consent copy rendered at ~11.5 px. |
| Dead links | "View Open Source" → `github.com/humisense` (404); four `href="#"` social placeholders. |
| Trust copy | Contact page mixed a Mumbai address with "PST" hours. No fabricated data found, but placeholders implied social profiles that do not exist. |

---

## 2. Changes implemented

### Technical SEO

- **`seo.py` (new, 388 lines)** — a central SEO system: `SITE` constants, a `PAGE_SEO`
  registry keyed by endpoint, `canonical()`, `meta()`, `page()`, and JSON-LD builders
  (`organization_schema`, `website_schema`, `web_page_schema`, `breadcrumb_schema`,
  `service_schema`, `faq_schema`, `article_schema`, `graph`).
- **`base.html`** — dynamic `<title>`, description, canonical, robots, Open Graph,
  Twitter card and `lang` attributes driven from the `seo` object. No page hardcodes
  the homepage title.
- **`robots.txt`** — allows all public content, explicitly allows `OAI-SearchBot`,
  `PerplexityBot`, `Googlebot` and `Bingbot`; disallows `/admin/` and `/api/`; declares
  the sitemap.
- **`sitemap.xml`** — 60 URLs covering all 30 public pages plus articles; no admin or
  API routes. Built from the content registry so last-modified dates stay accurate.
- **Canonical policy** — `SITE_BASE_URL` defaults to `https://humisense.com`; every page
  canonicalises to its own URL. `/premium` is a 301 to `/`, so its duplicate title is
  expected and correct.

### Structured data (JSON-LD)

`Organization` (+ `PostalAddress`, `ContactPoint` ×2, `ImageObject` logo),
`WebSite`, `Service` + `BusinessAudience` on commercial pages, `BreadcrumbList`
site-wide, `FAQPage` where FAQs exist, `Article` on posts, plus `AboutPage`,
`ContactPage` and `CollectionPage` where appropriate. All nodes share `@id`
references (`#organization`, `#website`). **No ratings, reviews, awards, clients,
certifications or performance claims are asserted.**

### Content architecture

30 public pages covering the requested tree: `/`, `/about`, `/services`, `/contact`,
`/ai-automation`, `/ai-consulting`, `/resources`, `/blog`, `/case-studies`, `/faqs`,
eight service pages (`/ai-workflow-automation`, `/ai-agents`, `/rfq-automation`,
`/quotation-automation`, `/document-automation`, `/sales-automation`,
`/lead-generation-automation`, `/business-process-automation`), six industry pages
under `/industries/`, plus `/products`, `/courses`, `/research` and legal pages.
Each commercial page carries H1, problem, approach, deliverables, limits, FAQs,
internal links and a consultation CTA.

---

## 3. Phase 2 fixes

| Fix | File | Detail |
| --- | --- | --- |
| Lenis vendored | `templates/base.html`, `static/vendor/lenis.min.js` | Replaced a dead CDN reference with a real local 1.1.13 build. Smooth scrolling now works. |
| SweetAlert2 scoped | `base.html` → `course_detail.html` | Pinned, vendored, loads only where `Swal` is used. |
| GSAP removed | `static/vendor/` | Deleted two unused libraries. |
| Three.js gated | `templates/home.html` | Fetched only when the hero will mount (screen > 720 px, memory ≥ 4 GB, ≥ 4 cores). |
| Reduced motion | `static/js/hero-3d.js` | `if (intro.t >= 1 && !reduceMotion.matches)` — static composed object, no drift. |
| Heading hierarchy | 6 templates | ~22 card headings `h4`→`h3`; visually-hidden `h2` added to product tab panels; footer headings → `h2.footer-heading`. |
| Contrast | `static/css/seo-pages.css` | `.seo-case-study-type` → `#6335c9` (5.6:1 light, 6.5:1 dark). |
| Readable disclaimers | `seo-pages.css`, `humi.css` | Case-study notes and consent copy `--t-xs` → `--t-sm`; `.seo-tags li` 0.68rem → 0.78rem. |
| Dead links removed | `research.html`, `contact.html` | 404 GitHub link replaced with the Academy; four placeholder social links and the "Follow Us" heading deleted. |

---

## 4. Verification results

Every check below was run against the live local server after the changes.

| Check | Result |
| --- | --- |
| Routes (30 public pages) | All HTTP 200; no console errors |
| Unique titles | 0 duplicates |
| Unique descriptions | 0 missing |
| Canonical URLs | Present on every page |
| Accidental `noindex` | None |
| Heading hierarchy | 13/13 sampled pages pass, no level skips |
| Internal links | 60 unique, **0 broken** |
| Contrast (13 pages × light + dark) | **0 failures** |
| Responsive (desktop/tablet/mobile) | 34 combos, no overflow, no undersized body text, no missing alt |
| `robots.txt` / `sitemap.xml` | 200; 60 URLs, no admin/API leakage |
| JSON-LD | Parses cleanly on every sampled page |
| GTM `GTM-WJKSCNR3` | Installed once (head + noscript), no duplicate container |
| Consent Mode v2 | 0 cookies before consent; GA4 `_ga` only after accept (`gcs=G100` when denied) |
| Contact form | Submits end-to-end, returns success message |
| Nav / theme / tabs / accordion | All functional at mobile and desktop |
| 3D hero | Mounts on desktop, absent on mobile, respects reduced motion |

### Performance

| Metric | Desktop | Mobile |
| --- | --- | --- |
| LCP | 260 ms | 196 ms |
| CLS | 0.055 | 0.080 |
| Transferred | 813 KB | **203 KB** |
| JavaScript | 637 KB | **27 KB** |

Mobile JavaScript fell from ~637 KB to ~27 KB (−96%) once Three.js was gated and the
unused vendors removed. Both LCP and CLS are comfortably inside Google's "good"
thresholds (LCP ≤ 2.5 s, CLS ≤ 0.1).

---

## 5. Status by category

### Implemented and verified locally
Metadata system, canonicals, sitemap, robots, JSON-LD, internal linking, heading
hierarchy, contrast, responsive layout, form and consent behaviour, asset vendoring,
performance gains.

### Implemented, not externally verified
Structured data validates by parse and against schema shapes, but has not been
submitted to Google's Rich Results Test or the Schema.org Validator — that requires
the production URL. Same for PageSpeed Insights and mobile-friendly testing.

### Pending external access
Google Search Console verification, Bing Webmaster Tools verification, GA4 property
confirmation, and any CDN/caching configuration on the production host. These need
account credentials that are not available here.

### Recommended next steps
1. Verify the domain in Search Console and Bing Webmaster Tools; submit the sitemap.
2. Run the production URL through Rich Results Test and PageSpeed Insights.
3. Publish articles on the twelve planned topics, one at a time, with genuine review.
4. Only add `hreflang` when translated pages actually exist.
5. Monitor country-level impressions before drawing any conclusion about reach —
   global availability does not by itself produce global rankings.

### Outstanding / honest limits
- The "within 24 hours" response promise appears in three places in the form flow.
  It is a service commitment the business should confirm is accurate.
- No social profiles, testimonials or client names are published, because none could
  be verified. This is intentional.
- `/premium` intentionally redirects to `/`; its title collision is not a defect.

---

## 6. Deployment note

All Phase 2 changes are uncommitted working-tree modifications on
`seo-geo-aeo-implementation`. Nothing has been pushed or deployed. Five files
(`environments.css`, `hero.css`, `hero-3d.js`, `home_hero.html`, `product_plate.html`)
plus `static/vendor/` are currently untracked and must be added before the branch is
deployed, or the live site will break.
