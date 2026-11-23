"""Central SEO configuration: metadata registry, canonical URLs and JSON-LD builders.

Every public page resolves its metadata through this module so titles,
descriptions, canonicals and structured data stay consistent.
"""

import os

BASE_URL = os.environ.get('SITE_BASE_URL', 'https://humisense.com').rstrip('/')

SITE = {
    'name': 'Humisense',
    'legal_name': 'Humisense',
    'url': BASE_URL,
    'logo': f'{BASE_URL}/static/images/logo.png',
    'og_image': f'{BASE_URL}/static/images/og-image.png',
    'email': 'info@humisense.com',
    'support_email': 'support@humisense.com',
    'telephone': '+91-8424849942',
    'address': {
        'street': 'Priya Industrial Estate',
        'locality': 'Mumbai',
        'region': 'Maharashtra',
        'postal_code': '401105',
        'country': 'IN',
    },
    'description': (
        'Humisense is a global AI automation and intelligent business solutions company. '
        'We design and implement AI workflow automation, custom AI agents, document '
        'processing and RFQ automation for manufacturing, distribution and B2B businesses.'
    ),
}

ORG_ID = f'{BASE_URL}/#organization'
WEBSITE_ID = f'{BASE_URL}/#website'

DEFAULT_IMAGE = SITE['og_image']

# Static page metadata, keyed by Flask endpoint.
PAGE_SEO = {
    'home': {
        'title': 'AI Automation Company | Intelligent Business Solutions - Humisense',
        'description': (
            'Humisense is a global AI automation company. We implement AI workflow '
            'automation, custom AI agents, document processing and RFQ automation '
            'for business.'
        ),
        'path': '/',
    },
    'about': {
        'title': 'About Humisense | AI Automation & Implementation Partner',
        'description': (
            'Meet Humisense: a technology implementation partner that helps businesses '
            'worldwide automate operations with AI workflows, agents and document processing.'
        ),
        'path': '/about',
    },
    'services': {
        'title': 'AI Services | Automation, Agents & Implementation - Humisense',
        'description': (
            'Explore Humisense AI services: AI automation, workflow automation, custom AI '
            'agents, document processing, data science and custom software development.'
        ),
        'path': '/services',
    },
    'products': {
        'title': 'AI Products | Voice API, Agent Studio & Analytics - Humisense',
        'description': (
            'Humisense AI products include a voice API, conversational assistant, agent '
            'studio, analytics platform and research assistant for business teams.'
        ),
        'path': '/products',
    },
    'courses': {
        'title': 'AI Academy | Practical AI & Automation Training - Humisense',
        'description': (
            'Hands-on AI training from Humisense Academy: machine learning, LLM engineering, '
            'prompt engineering, AI agents and MLOps courses for working professionals.'
        ),
        'path': '/courses',
    },
    'research': {
        'title': 'AI Research | Applied Machine Learning - Humisense',
        'description': (
            'Applied AI research at Humisense: work on document understanding, workflow '
            'reasoning and practical machine learning systems for business operations.'
        ),
        'path': '/research',
    },
    'contact': {
        'title': 'Contact Humisense | Talk to an AI Automation Consultant',
        'description': (
            'Contact Humisense to discuss an AI automation project. Tell us about your '
            'workflow, documents or sales process and we will reply with a practical plan.'
        ),
        'path': '/contact',
    },
    'industries': {
        'title': 'AI Automation by Industry | Manufacturing, Distribution & B2B',
        'description': (
            'Industry-specific AI automation from Humisense for manufacturing, industrial '
            'distribution, wholesale, B2B, professional services and small businesses.'
        ),
        'path': '/industries',
    },
    'blog': {
        'title': 'AI Automation Blog | Guides & Implementation Notes - Humisense',
        'description': (
            'Practical guides on AI automation, RFQ automation, document processing and AI '
            'agents, written by the Humisense implementation team.'
        ),
        'path': '/blog',
    },
    'resources': {
        'title': 'Resources | AI Automation Guides & Frameworks - Humisense',
        'description': (
            'Humisense resource centre: implementation guides, automation frameworks, '
            'architecture notes and answers to common AI automation questions.'
        ),
        'path': '/resources',
    },
    'faqs': {
        'title': 'AI Automation FAQs | Costs, Process & Use Cases - Humisense',
        'description': (
            'Direct answers to common questions about AI automation, AI agents, RFQ '
            'automation, document processing, costs and implementation timelines.'
        ),
        'path': '/faqs',
    },
    'case_studies': {
        'title': 'AI Automation Case Studies & Reference Implementations - Humisense',
        'description': (
            'Reference implementations and delivery patterns from Humisense AI automation '
            'projects, described with the problems, architecture and outcomes involved.'
        ),
        'path': '/case-studies',
    },
    'privacy': {
        'title': 'Privacy Policy - Humisense',
        'description': (
            'How Humisense collects, uses and protects personal data submitted through '
            'this website, including enquiry forms and analytics.'
        ),
        'path': '/privacy',
    },
    'terms': {
        'title': 'Terms of Service - Humisense',
        'description': (
            'The terms governing use of the Humisense website and our AI automation and '
            'software services, covering scope, intellectual property, liability and '
            'governing law.'
        ),
        'path': '/terms',
    },
    'cookies': {
        'title': 'Cookie Policy - Humisense',
        'description': (
            'Which cookies and analytics tags the Humisense website uses, what each one '
            'does, how long it lasts and how visitors can accept, decline or change '
            'their choice.'
        ),
        'path': '/cookies',
    },
}


def canonical(path):
    if not path.startswith('/'):
        path = '/' + path
    if path != '/':
        path = path.rstrip('/')
    return BASE_URL + path


def meta(title, description, path, image=None, og_type='website', robots='index, follow',
         jsonld=None, published=None, modified=None, lang='en'):
    """Build the metadata dictionary consumed by base.html."""
    return {
        'title': title,
        'description': description,
        'canonical': canonical(path),
        'path': path,
        'image': image or DEFAULT_IMAGE,
        'type': og_type,
        'robots': robots,
        'jsonld': jsonld or [],
        'published': published,
        'modified': modified,
        'lang': lang,
    }


def page(endpoint, jsonld=None, **overrides):
    """Metadata for a page registered in PAGE_SEO."""
    entry = dict(PAGE_SEO[endpoint])
    entry.update(overrides)
    return meta(
        entry['title'],
        entry['description'],
        entry['path'],
        image=entry.get('image'),
        og_type=entry.get('type', 'website'),
        robots=entry.get('robots', 'index, follow'),
        jsonld=jsonld,
        published=entry.get('published'),
        modified=entry.get('modified'),
    )


def organization_schema():
    return {
        '@type': 'Organization',
        '@id': ORG_ID,
        'name': SITE['name'],
        'alternateName': 'HUMISENSE',
        'url': SITE['url'] + '/',
        'logo': {
            '@type': 'ImageObject',
            'url': SITE['logo'],
            'width': 512,
            'height': 512,
        },
        'image': SITE['og_image'],
        'description': SITE['description'],
        'slogan': 'Make it happen.',
        'email': SITE['email'],
        'telephone': SITE['telephone'],
        'address': {
            '@type': 'PostalAddress',
            'streetAddress': SITE['address']['street'],
            'addressLocality': SITE['address']['locality'],
            'addressRegion': SITE['address']['region'],
            'postalCode': SITE['address']['postal_code'],
            'addressCountry': SITE['address']['country'],
        },
        'areaServed': {
            '@type': 'Place',
            'name': 'Worldwide',
        },
        'knowsAbout': [
            'AI automation',
            'AI workflow automation',
            'custom AI agent development',
            'intelligent document processing',
            'RFQ automation',
            'quotation automation',
            'business process automation',
            'manufacturing automation',
            'industrial distribution automation',
        ],
        'contactPoint': [
            {
                '@type': 'ContactPoint',
                'contactType': 'sales',
                'email': SITE['email'],
                'telephone': SITE['telephone'],
                'availableLanguage': ['en'],
                'areaServed': 'Worldwide',
            },
            {
                '@type': 'ContactPoint',
                'contactType': 'technical support',
                'email': SITE['support_email'],
                'availableLanguage': ['en'],
            },
        ],
    }


def website_schema():
    return {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        'url': SITE['url'] + '/',
        'name': SITE['name'],
        'description': SITE['description'],
        'inLanguage': 'en',
        'publisher': {'@id': ORG_ID},
    }


def web_page_schema(page_type, path, name=None, description=None):
    """AboutPage / ContactPage / CollectionPage wrapper that points at the
    organization, so E-E-A-T signals stay connected to the entity graph."""
    node = {
        '@type': page_type,
        '@id': canonical(path) + '#webpage',
        'url': canonical(path),
        'isPartOf': {'@id': WEBSITE_ID},
        'about': {'@id': ORG_ID},
        'inLanguage': 'en',
    }
    if name:
        node['name'] = name
    if description:
        node['description'] = description
    return node


def breadcrumb_schema(items):
    """items: list of (label, path)."""
    return {
        '@type': 'BreadcrumbList',
        'itemListElement': [
            {
                '@type': 'ListItem',
                'position': index + 1,
                'name': label,
                'item': canonical(path),
            }
            for index, (label, path) in enumerate(items)
        ],
    }


def service_schema(name, description, path, service_type=None, category=None, offers=None):
    schema = {
        '@type': 'Service',
        '@id': canonical(path) + '#service',
        'name': name,
        'description': description,
        'serviceType': service_type or name,
        'url': canonical(path),
        'provider': {'@id': ORG_ID},
        'areaServed': {'@type': 'Place', 'name': 'Worldwide'},
        'audience': {
            '@type': 'BusinessAudience',
            'audienceType': 'Manufacturing, industrial distribution and B2B businesses',
        },
    }
    if category:
        schema['category'] = category
    if offers:
        schema['offers'] = offers
    return schema


def faq_schema(faqs):
    return {
        '@type': 'FAQPage',
        '@id': canonical('/faqs') + '#faq',
        'mainEntity': [
            {
                '@type': 'Question',
                'name': item['q'],
                'acceptedAnswer': {'@type': 'Answer', 'text': item['a']},
            }
            for item in faqs
        ],
    }


def article_schema(article, path):
    schema = {
        '@type': 'Article',
        '@id': canonical(path) + '#article',
        'headline': article['h1'],
        'description': article['description'],
        'url': canonical(path),
        'datePublished': article['published'],
        'dateModified': article.get('updated', article['published']),
        'inLanguage': 'en',
        'author': {'@id': ORG_ID},
        'publisher': {'@id': ORG_ID},
        'mainEntityOfPage': {'@type': 'WebPage', '@id': canonical(path)},
        'image': article.get('image', DEFAULT_IMAGE),
    }
    if article.get('keywords'):
        schema['keywords'] = ', '.join(article['keywords'])
    return schema


def graph(*nodes):
    """Combine page-level nodes into a single JSON-LD graph."""
    return {'@context': 'https://schema.org', '@graph': [n for n in nodes if n]}
