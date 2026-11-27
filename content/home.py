"""Home page content: the eight core services, product stages and featured items.

Everything here is descriptive of capability or of a system's actual stage. No
client counts, satisfaction scores or outcome percentages: those cannot be
evidenced and are not published.
"""

# --- The eight core services ------------------------------------------------
# `url` points at the closest existing deep page so every tile is a real link.

HOME_SERVICES = [
    {
        'name': 'AI & Machine Learning',
        'summary': (
            'Custom models for classification, extraction, forecasting and ranking, '
            'built around your data rather than a generic benchmark.'
        ),
        'caps': ['Custom models', 'Evaluation', 'Fine-tuning'],
        'url': '/ai-consulting',
        'icon': (
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" '
            'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" '
            'stroke-linejoin="round" aria-hidden="true"><path d="M12 4.5a3.5 3.5 0 0 0-3.5 3.5v.6A3 3 0 0 0 6 11.5a3 3 0 0 0 .8 2A3 3 0 0 0 6 15.5a3 3 0 0 0 2.5 2.95V19a3.5 3.5 0 0 0 7 0v-.55A3 3 0 0 0 18 15.5a3 3 0 0 0-.8-2 3 3 0 0 0 .8-2 3 3 0 0 0-2.5-2.9V8A3.5 3.5 0 0 0 12 4.5Z"/><path d="M12 4.5V19"/></svg>'
        ),
    },
    {
        'name': 'AI Automation',
        'summary': (
            'Operational workflows that read incoming work, apply rules and route it, '
            'with a review path for anything the system is unsure about.'
        ),
        'caps': ['Intake', 'Routing', 'Review queue'],
        'url': '/ai-automation',
        'icon': (
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" '
            'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" '
            'stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/><path d="M10 7h4a3 3 0 0 1 3 3v4"/></svg>'
        ),
    },
    {
        'name': 'Agentic AI & AI Agents',
        'summary': (
            'Agents that plan and call tools against a defined task boundary, with '
            'logging of every step so behaviour can be audited.'
        ),
        'caps': ['Tool use', 'Planning', 'Audit trail'],
        'url': '/ai-agents',
        'icon': (
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" '
            'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" '
            'stroke-linejoin="round" aria-hidden="true"><rect x="5" y="8" width="14" height="11" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01M9.5 16.5h5"/></svg>'
        ),
    },
    {
        'name': 'Web Development',
        'summary': (
            'Fast, accessible web platforms with server-rendered content, sensible '
            'caching and search infrastructure from the first commit.'
        ),
        'caps': ['Flask / Node', 'Core Web Vitals', 'SEO'],
        'url': '/services',
        'icon': (
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" '
            'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" '
            'stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.3 3.7 5.3 3.7 8.5S14.4 18.2 12 20.5c-2.4-2.3-3.7-5.3-3.7-8.5S9.6 5.8 12 3.5Z"/></svg>'
        ),
    },
    {
        'name': 'Application Development',
        'summary': (
            'Internal tools and line-of-business applications that replace spreadsheet '
            'processes with something auditable.'
        ),
        'caps': ['Internal tools', 'APIs', 'Integrations'],
        'url': '/services',
        'icon': (
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" '
            'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" '
            'stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 20h8M12 17v3M7 9l2.5 2.5L7 14M12.5 14H16"/></svg>'
        ),
    },
    {
        'name': 'Data Science',
        'summary': (
            'Analysis and modelling where the question is genuinely open: forecasting, '
            'segmentation, anomaly detection, demand planning.'
        ),
        'caps': ['Forecasting', 'Segmentation', 'Anomaly'],
        'url': '/ai-consulting',
        'icon': (
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" '
            'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" '
            'stroke-linejoin="round" aria-hidden="true"><path d="M4 19V9M9 19V5M14 19v-7M19 19v-4"/><path d="M3 19h18"/></svg>'
        ),
    },
    {
        'name': 'Business Intelligence & Power BI',
        'summary': (
            'Reporting layers over the systems you already run, with a modelled semantic '
            'layer so numbers reconcile across reports.'
        ),
        'caps': ['Power BI', 'Semantic model', 'Dashboards'],
        'url': '/ai-consulting',
        'icon': (
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" '
            'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" '
            'stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5a8.5 8.5 0 1 0 8.5 8.5H12V3.5Z"/><path d="M15 3.9A8.5 8.5 0 0 1 20.1 9H15V3.9Z"/></svg>'
        ),
    },
    {
        'name': 'Custom AI Solutions',
        'summary': (
            'Problems that do not fit a product category: bespoke systems designed around '
            'a specific constraint in your operation.'
        ),
        'caps': ['Scoping', 'Prototype', 'Production'],
        'url': '/ai-consulting',
        'icon': (
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" '
            'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" '
            'stroke-linejoin="round" aria-hidden="true"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/><circle cx="12" cy="12" r="3.2"/></svg>'
        ),
    },
]

# --- Product stages ---------------------------------------------------------
# `stage` drives the badge. Only 'live' means generally available today.

PRODUCT_STAGE_LABELS = {
    'live': 'Available',
    'prototype': 'Prototype',
    'development': 'In development',
}


def home_products(products):
    """Map raw product records onto the home page card shape."""
    out = []
    for product in products:
        stage = product.get('stage', 'prototype')
        out.append({
            'id': product['id'],
            'name': product['name'],
            'tagline': product.get('tagline') or product.get('description', '')[:120],
            'category': product.get('category', 'Product'),
            'stage': stage,
            'stage_label': PRODUCT_STAGE_LABELS.get(stage, 'Prototype'),
        })
    return out


def home_courses(courses):
    """Four representative courses, one per level where possible."""
    out = []
    for course in courses[:4]:
        out.append({
            'id': course['id'],
            'name': course['name'],
            'level': (course.get('level') or 'Beginner').title(),
            'blurb': _first_sentence(course.get('description', '')),
        })
    return out


def home_research(research):
    out = []
    for item in research[:4]:
        out.append({
            'title': item.get('title', ''),
            'summary': _first_sentence(item.get('abstract') or item.get('description', '')),
            'area': item.get('category') or item.get('area') or 'Applied AI',
        })
    return out


def _first_sentence(text, limit=165):
    text = ' '.join((text or '').split())
    if not text:
        return ''
    for sep in ('. ', '? ', '! '):
        idx = text.find(sep)
        if 0 < idx < limit:
            return text[:idx + 1]
    return text[:limit].rsplit(' ', 1)[0] + ('…' if len(text) > limit else '')
