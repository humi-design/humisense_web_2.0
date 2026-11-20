"""Legal pages, hub page definitions and case study references."""

LEGAL_PAGES = {
    'privacy': {
        'title': 'Privacy Policy',
        'summary': (
            'What personal data Humisense collects through this website, why it is collected '
            'and how it is handled.'
        ),
        'updated': '20 November 2026',
        'blocks': [
            ('h2', 'Who we are'),
            ('p', 'This website is operated by Humisense. For any question about this policy '
                  'or about personal data we hold, contact info@humisense.com.'),
            ('h2', 'What we collect'),
            ('p', 'We collect only what is needed to respond to an enquiry and to understand '
                  'how the website is used:'),
            ('ul', [
                'Contact details you submit voluntarily through an enquiry, newsletter or '
                'course registration form: name, email address, optional phone number, '
                'optional company name and your message.',
                'Technical information recorded automatically by our web server, such as IP '
                'address, browser type and the page requested, for security and diagnostics.',
                'Aggregate usage information collected through Google Tag Manager, subject to '
                'the consent behaviour configured in that container.',
            ]),
            ('h2', 'Why we process it'),
            ('ul', [
                'To respond to your enquiry and to provide services you request.',
                'To send updates you have explicitly subscribed to, which you can unsubscribe '
                'from at any time.',
                'To keep the website secure and to diagnose technical problems.',
                'To understand which content is useful, in aggregate.',
            ]),
            ('h2', 'What we do not do'),
            ('ul', [
                'We do not sell personal data.',
                'We do not send personal information such as names, email addresses or '
                'message contents to analytics platforms.',
                'We do not use enquiry form data for advertising retargeting.',
            ]),
            ('h2', 'How long we keep it'),
            ('p', 'Enquiry records are retained for as long as needed to handle the request '
                  'and any resulting commercial relationship, then removed in line with our '
                  'internal retention practice. Newsletter subscriptions are retained until '
                  'you unsubscribe.'),
            ('h2', 'Your rights'),
            ('p', 'Depending on where you live, you may have the right to access, correct, '
                  'delete or restrict the processing of your personal data, and to object to '
                  'processing. To exercise any of these rights, email info@humisense.com. We '
                  'will respond within the period required by the applicable law.'),
            ('h2', 'International transfers'),
            ('p', 'Humisense works with clients internationally, and service providers we use '
                  'may process data outside your country. Where this happens, we rely on '
                  'appropriate safeguards for the transfer as required by applicable law.'),
            ('h2', 'Changes to this policy'),
            ('p', 'This policy may be updated to reflect changes in our practices or in legal '
                  'requirements. The date at the top of this page shows when it was last '
                  'revised.'),
        ],
    },
    'terms': {
        'title': 'Terms of Service',
        'summary': (
            'The terms that apply to your use of the Humisense website and to professional '
            'services provided by Humisense.'
        ),
        'updated': '20 November 2026',
        'blocks': [
            ('h2', 'Scope'),
            ('p', 'These terms govern your use of humisense.com and set out the general basis '
                  'on which Humisense provides professional services. Individual engagements '
                  'are governed by a separate written agreement or statement of work, which '
                  'takes precedence where it conflicts with these terms.'),
            ('h2', 'Website use'),
            ('p', 'You may use this website for lawful purposes only. You must not attempt to '
                  'gain unauthorised access to any part of the site or its systems, interfere '
                  'with its operation, or use automated means to extract content at a volume '
                  'that degrades service for others.'),
            ('h2', 'Information on this website'),
            ('p', 'Content on this website describes our services and our approach in general '
                  'terms. It is provided for information and does not constitute a '
                  'professional, legal, financial or technical warranty for any specific '
                  'project. Any commitment we make is made in a signed agreement.'),
            ('h2', 'No guaranteed outcomes'),
            ('p', 'We do not guarantee specific commercial outcomes, cost savings, revenue '
                  'changes or search engine rankings. Where we describe typical results or '
                  'expected benefits, these are illustrative of what the approach can achieve '
                  'and depend on your processes, data and systems.'),
            ('h2', 'Intellectual property'),
            ('p', 'The content, design and code of this website belong to Humisense unless '
                  'stated otherwise. Ownership of deliverables created for a client is defined '
                  'in the relevant engagement agreement.'),
            ('h2', 'Third-party links and services'),
            ('p', 'This website may link to third-party sites or use third-party services. We '
                  'are not responsible for the content, availability or practices of those '
                  'third parties.'),
            ('h2', 'Limitation of liability'),
            ('p', 'To the extent permitted by law, Humisense is not liable for indirect or '
                  'consequential loss arising from use of this website. Liability arising from '
                  'a professional engagement is governed by the applicable engagement '
                  'agreement.'),
            ('h2', 'Governing law'),
            ('p', 'These terms are governed by the laws applicable at Humisense\u2019s place of '
                  'business, without prejudice to any mandatory consumer protection rights you '
                  'may have in your own jurisdiction.'),
        ],
    },
    'cookies': {
        'title': 'Cookie Policy',
        'summary': (
            'Which cookies and tags this website uses, what they do and how you can control '
            'them.'
        ),
        'updated': '20 November 2026',
        'blocks': [
            ('h2', 'What cookies are'),
            ('p', 'Cookies are small text files stored by your browser when you visit a '
                  'website. They are used to keep a site working correctly and, where '
                  'permitted, to measure how it is used.'),
            ('h2', 'What this site uses'),
            ('ul', [
                'Strictly necessary cookies: a session cookie used to keep your visit '
                'consistent and to protect forms against cross-site request forgery. These '
                'cannot be switched off without breaking the site.',
                'Preference storage: your light or dark theme choice is stored locally in your '
                'browser. It is not transmitted to us.',
                'Analytics: Google Tag Manager container GTM-WJKSCNR3 is installed to measure '
                'site usage and conversion events. Whether analytics cookies are set depends '
                'on the consent configuration of that container and on your choices.',
            ]),
            ('h2', 'What we do not use'),
            ('p', 'We do not use cookies to build advertising profiles of individual visitors, '
                  'and we do not send personal information such as names or email addresses to '
                  'analytics platforms.'),
            ('h2', 'Controlling cookies'),
            ('p', 'You can block or delete cookies through your browser settings. Blocking '
                  'strictly necessary cookies may prevent parts of the site, such as forms, '
                  'from working. Where a consent banner is shown, your choice is recorded and '
                  'respected.'),
            ('h2', 'Questions'),
            ('p', 'If you have a question about cookies or tracking on this site, email '
                  'info@humisense.com.'),
        ],
    },
}


def service_hub():
    from content.services import SERVICES
    primary = [
        ('AI automation services',
         'End-to-end automation of business processes using AI extraction and reasoning.',
         '/ai-automation'),
        ('AI workflow automation',
         'Workflows that carry a request from trigger to outcome without manual handoffs.',
         '/ai-workflow-automation'),
        ('Custom AI agent development',
         'Narrow, permissioned agents that complete multi-step operational tasks.',
         '/ai-agents'),
        ('AI consulting and implementation',
         'Assessment, prioritisation and delivery of a first production use case.',
         '/ai-consulting'),
    ]
    specialisms = [
        ('RFQ automation',
         'Structured capture of requests for quotation from any format.',
         '/rfq-automation'),
        ('Quotation automation',
         'Priced, approved and tracked quotation generation.',
         '/quotation-automation'),
        ('Intelligent document processing',
         'PDF, scan and spreadsheet data extraction with validation and review.',
         '/document-automation'),
        ('Sales automation',
         'Enquiry routing, follow-up discipline and reliable CRM data.',
         '/sales-automation'),
        ('Lead generation automation',
         'Researched, reviewed outreach preparation and reply qualification.',
         '/lead-generation-automation'),
        ('Business process automation',
         'Whole-process redesign and automation, measured end to end.',
         '/business-process-automation'),
    ]
    supporting = [
        ('Machine learning solutions',
         'Applied ML for classification, forecasting and matching problems.',
         '/services'),
        ('Data science and analytics',
         'Data pipelines, analysis and reporting that operational teams can use.',
         '/services'),
        ('Custom software development',
         'Web applications and internal tools built around your process.',
         '/services'),
        ('AI integration',
         'Connecting models and automation into existing ERP, CRM and finance systems.',
         '/services'),
        ('Business intelligence',
         'Dashboards and reporting built on reliable operational data.',
         '/services'),
        ('Intelligent business systems',
         'Combined automation, data and interface work for a complete process.',
         '/services'),
    ]
    return {
        'eyebrow': 'Services',
        'tagline': 'WHAT WE DO',
        'h1': 'AI Services and Implementation',
        'intro': (
            'Humisense implements AI automation as a delivery partner, not a tool vendor. '
            'Each service below describes a real process we build, the problem it addresses '
            'and how the work is delivered.'
        ),
        'groups': [
            {
                'title': 'Core AI automation services',
                'intro': 'The primary services most engagements start with.',
                'items': [
                    {'title': t, 'description': d, 'url': u} for t, d, u in primary
                ],
            },
            {
                'title': 'Process-specific automation',
                'intro': 'Focused services for the operational bottlenecks we see most often.',
                'items': [
                    {'title': t, 'description': d, 'url': u} for t, d, u in specialisms
                ],
            },
            {
                'title': 'Supporting technology services',
                'intro': (
                    'Broader technical capability that supports an automation programme when '
                    'it is needed.'
                ),
                'items': [
                    {'title': t, 'description': d, 'url': u} for t, d, u in supporting
                ],
            },
        ],
        'faqs': [
            {
                'q': 'Where should we start?',
                'a': 'Start with the process that consumes the most time and has a clear '
                     'definition of a correct outcome. RFQ intake, document capture and '
                     'enquiry handling are the most common starting points.',
            },
            {
                'q': 'Do you only do AI, or general software too?',
                'a': 'Both. AI automation is our primary focus, but projects often require '
                     'custom software, data work or integration. We deliver those as part of '
                     'the same engagement rather than handing them off.',
            },
        ],
        'closing': (
            'Describe the process you want to improve and we will tell you whether it is a '
            'good automation candidate.'
        ),
    }


def industry_hub():
    return {
        'eyebrow': 'Industries',
        'tagline': 'WHERE WE WORK',
        'h1': 'AI Automation by Industry',
        'intro': (
            'Automation opportunities differ by sector because the documents, commercial '
            'pressures and systems differ. These pages describe what we automate in each.'
        ),
        'groups': [
            {
                'title': 'Manufacturing and distribution',
                'intro': (
                    'Our deepest experience is in businesses that quote, order and ship '
                    'physical products.'
                ),
                'items': [
                    {
                        'title': 'Manufacturing',
                        'description': 'Specification intake, purchase orders, supplier '
                                       'reconciliation and quality documentation.',
                        'url': '/industries/manufacturing',
                    },
                    {
                        'title': 'Industrial distribution',
                        'description': 'RFQ processing, part matching, quotation preparation '
                                       'and supplier comparison.',
                        'url': '/industries/industrial-distribution',
                    },
                    {
                        'title': 'Wholesale and B2B',
                        'description': 'Enquiry handling, order administration and customer '
                                       'communication at transaction volume.',
                        'url': '/industries/wholesale',
                    },
                ],
            },
            {
                'title': 'Business and professional services',
                'items': [
                    {
                        'title': 'B2B businesses',
                        'description': 'Qualification, proposal preparation and sales to '
                                       'delivery handover for considered purchases.',
                        'url': '/industries/b2b-businesses',
                    },
                    {
                        'title': 'Professional services',
                        'description': 'Document review, client onboarding, knowledge retrieval '
                                       'and recurring reporting.',
                        'url': '/industries/professional-services',
                    },
                    {
                        'title': 'Small businesses',
                        'description': 'Narrowly scoped automation of enquiry response, quoting '
                                       'and document capture.',
                        'url': '/industries/small-businesses',
                    },
                ],
            },
        ],
        'faqs': [
            {
                'q': 'Do you only work in these industries?',
                'a': 'No. These pages describe where we have the most specific experience. The '
                     'underlying patterns, document capture, workflow automation and agent '
                     'design, apply to any business with similar processes.',
            },
            {
                'q': 'Do you work with businesses outside your home region?',
                'a': 'Yes. Delivery is remote-first and we work with clients internationally. '
                     'System access is arranged through your own infrastructure or an agreed '
                     'cloud environment.',
            },
        ],
        'sections': [
            {
                'heading': 'How we decide what to automate in a sector',
                'paragraphs': [
                    'Sector matters less than process shape. Two businesses in different '
                    'industries with the same pattern, an unstructured enquiry arriving by '
                    'email that must be matched against a catalogue and turned into a priced '
                    'response, need substantially the same system.',
                    'What sector does change is the tolerance for error and the review point. '
                    'A wrong part number on a quotation is a commercial problem. A wrong '
                    'tolerance on a machined component is a safety problem. The automation '
                    'design has to reflect that difference, which is why the industry pages '
                    'describe review and approval steps rather than only features.',
                ],
            },
            {
                'heading': 'What stays the same across every sector',
                'paragraphs': [
                    'Every engagement starts by measuring the current process: volume, cycle '
                    'time, error rate and where work waits. Without that baseline there is no '
                    'way to tell whether the automation helped, and no way to justify the next '
                    'phase.',
                    'Every system we deliver includes logging of what was read, what was '
                    'decided and what confidence the model reported, plus a defined route for '
                    'anything that falls below threshold. That structure is what makes an '
                    'automation operable by the team that inherits it.',
                ],
            },
        ],
        'closing': (
            'If your sector is not listed but the process sounds familiar, tell us about it.'
        ),
    }


def resources_hub():
    return {
        'eyebrow': 'Resources',
        'tagline': 'LEARN FIRST',
        'h1': 'AI Automation Resources',
        'intro': (
            'Guides, frameworks and answers written from implementation work. No gated '
            'downloads and no registration walls.'
        ),
        'groups': [
            {
                'title': 'Start here',
                'items': [
                    {
                        'title': 'AI automation FAQs',
                        'description': 'Direct answers on costs, timelines, accuracy and '
                                       'where to begin.',
                        'url': '/faqs',
                    },
                    {
                        'title': 'How to implement AI automation',
                        'description': 'The eight-step sequence we use, including the steps '
                                       'most projects skip.',
                        'url': '/blog/how-to-implement-ai-automation-in-an-existing-business',
                    },
                    {
                        'title': 'AI agents vs traditional automation',
                        'description': 'How to choose between rules, agents and a hybrid of '
                                       'the two.',
                        'url': '/blog/ai-agents-vs-traditional-workflow-automation',
                    },
                ],
            },
            {
                'title': 'Technical guides',
                'items': [
                    {
                        'title': 'How AI extracts data from PDF and Excel',
                        'description': 'The five-stage pipeline behind reliable document '
                                       'extraction.',
                        'url': '/blog/how-ai-extracts-data-from-pdf-and-excel-documents',
                    },
                    {
                        'title': 'Building an AI-powered business workflow',
                        'description': 'The architecture of a workflow that survives contact '
                                       'with production.',
                        'url': '/blog/building-an-ai-powered-business-workflow',
                    },
                    {
                        'title': 'Automating business document processing',
                        'description': 'A step-by-step guide to a single-document-type project.',
                        'url': '/blog/how-to-automate-business-document-processing',
                    },
                ],
            },
            {
                'title': 'Industry and process guides',
                'items': [
                    {
                        'title': 'What is RFQ automation?',
                        'description': 'How request intake, extraction and matching actually '
                                       'work.',
                        'url': '/blog/what-is-rfq-automation-and-how-does-it-work',
                    },
                    {
                        'title': 'AI for manufacturing manual work',
                        'description': 'Where manual effort accumulates and how to reduce it.',
                        'url': '/blog/how-ai-automation-helps-manufacturing-reduce-manual-work',
                    },
                    {
                        'title': 'AI sales automation for distributors',
                        'description': 'The five sales processes worth automating first.',
                        'url': '/blog/how-industrial-distributors-can-use-ai-to-automate-sales',
                    },
                ],
            },
        ],
        'faqs': [],
        'sections': [
            {
                'heading': 'How to use these resources',
                'paragraphs': [
                    'If you are evaluating whether automation is worth doing at all, start '
                    'with the FAQs and the implementation guide. They cover the questions '
                    'that determine feasibility: how much volume there is, how consistent the '
                    'inputs are, and what a correct output looks like.',
                    'If you already know which process you want to automate, the technical '
                    'guides describe the pipeline in enough detail to judge whether your '
                    'inputs will work: what happens with scanned documents, how tables are '
                    'handled, and where human review has to sit.',
                ],
            },
            {
                'heading': 'What is not published here',
                'paragraphs': [
                    'We do not publish client names, project values or outcome percentages '
                    'without written permission, and we do not invent them. The reference '
                    'implementations describe system design, which is the part that transfers '
                    'between businesses anyway.',
                ],
            },
        ],
        'closing': (
            'If you want a specific question answered, send it to us and we will answer it '
            'directly.'
        ),
    }


CASE_STUDIES = [
    {
        'title': 'RFQ intake for an industrial distributor',
        'sector': 'Industrial distribution',
        'type': 'Reference implementation',
        'problem': (
            'Several hundred customer RFQs arrived each week across email, PDF attachments '
            'and spreadsheet exports. Line items were re-keyed by hand before pricing, which '
            'limited daily throughput and produced transcription errors.'
        ),
        'approach': (
            'A multi-channel intake pipeline was built with layout-aware extraction for tables '
            'and line items, catalogue matching by part number and attribute, and a review '
            'queue for low-confidence fields. Structured requests were then handed to the '
            'existing quotation process.'
        ),
        'components': [
            'Email and file-drop intake',
            'Table and line-item extraction',
            'Catalogue and part number matching',
            'Confidence scoring with review queue',
            'Structured handoff to quotation',
        ],
        'notes': (
            'Described as a reference implementation. Specific client figures are not '
            'published because they have not been approved for disclosure.'
        ),
    },
    {
        'title': 'Supplier acknowledgement reconciliation in manufacturing',
        'sector': 'Manufacturing',
        'type': 'Reference implementation',
        'problem': (
            'Purchase order confirmations arrived as supplier emails with PDF attachments. '
            'Comparing confirmed price, quantity and delivery date against the original order '
            'was done inconsistently, so discrepancies were often found at goods receipt.'
        ),
        'approach': (
            'Confirmation documents are parsed and compared field by field against open '
            'purchase orders. Matches are written back automatically, acceptable variations '
            'route to the buyer for approval, and discrepancies raise a task with the supplier '
            'email attached.'
        ),
        'components': [
            'Supplier email and attachment intake',
            'Field-level extraction and comparison',
            'Variation classification',
            'Buyer approval routing',
            'Exception task creation',
        ],
        'notes': (
            'Described as a reference implementation. Buyer approval remains mandatory for any '
            'change to price, quantity or delivery date.'
        ),
    },
    {
        'title': 'Quotation generation for a catalogue business',
        'sector': 'Wholesale and B2B',
        'type': 'Reference implementation',
        'problem': (
            'Quotations were produced by copying a previous document and editing it. Pricing '
            'logic lived in personal spreadsheets, and it was unclear which revision had been '
            'sent to the customer.'
        ),
        'approach': (
            'Pricing rules were documented explicitly, a versioned template was created, and '
            'quotation generation was automated from the structured request. Approvals were '
            'routed by discount threshold, and every sent quotation created a tracked '
            'follow-up task.'
        ),
        'components': [
            'Documented pricing model',
            'Versioned quotation template',
            'Automated assembly with visible calculation',
            'Approval routing by threshold',
            'Follow-up and win/loss tracking',
        ],
        'notes': (
            'Described as a reference implementation. Automatic sending was not enabled; every '
            'quotation is approved by a person before release.'
        ),
    },
    {
        'title': 'Invoice capture and three-way matching for finance',
        'sector': 'Cross-industry',
        'type': 'Reference implementation',
        'problem': (
            'Supplier invoices were checked manually against purchase orders and goods '
            'receipts. Finance reviewed every document, including the majority that matched '
            'without issue.'
        ),
        'approach': (
            'Invoices are captured with field-level confidence scoring, validated '
            'arithmetically and matched against purchase order and receipt records. Clean '
            'matches post automatically; exceptions route to finance with the source document '
            'and the reason for the mismatch.'
        ),
        'components': [
            'Invoice extraction with OCR fallback',
            'Arithmetic and referential validation',
            'Three-way matching',
            'Duplicate detection',
            'Exception queue for finance',
        ],
        'notes': (
            'Described as a reference implementation. Posting limits and approval thresholds '
            'are configured per client policy.'
        ),
    },
]
