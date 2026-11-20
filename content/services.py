"""Service landing page content.

Each entry is rendered by templates/service_page.html and drives its own
metadata, JSON-LD Service node, breadcrumbs and FAQ block.
"""

SERVICES = [
    {
        'slug': 'ai-automation',
        'title': 'AI Automation Services for Businesses | Humisense',
        'description': (
            'Humisense implements AI automation for business operations: workflow '
            'automation, document processing, AI agents and RFQ handling that cut '
            'manual work.'
        ),
        'h1': 'AI Automation Services for Businesses',
        'eyebrow': 'AI Automation',
        'answer': (
            'AI automation is the use of machine learning and large language models to '
            'complete business work that previously needed a person to read, decide, type '
            'or route information. Humisense implements AI automation inside your existing '
            'systems: we map a process, connect your data sources, build the AI step, and '
            'keep a human review point wherever the output matters commercially.'
        ),
        'summary': (
            'A practical implementation partner for companies that want measurable process '
            'improvement, not another dashboard or pilot that never reaches production.'
        ),
        'problems': [
            'The same information is retyped into three systems because nothing connects them.',
            'Skilled staff spend their day copying data from PDFs, emails and spreadsheets.',
            'Enquiry response times depend on who happens to be at their desk.',
            'Process knowledge lives with two people and disappears when they leave.',
            'Software vendors sell tools, but nobody owns the integration work.',
        ],
        'approach': [
            {
                'title': 'Process mapping',
                'text': 'We document how the work actually flows today, including the '
                        'exceptions, the people involved and where delays accumulate.',
            },
            {
                'title': 'Automation assessment',
                'text': 'Each step is scored on volume, variability, error cost and data '
                        'availability. Steps with high volume and clear rules move first.',
            },
            {
                'title': 'Solution design',
                'text': 'We choose between deterministic automation, AI extraction, AI '
                        'reasoning or a hybrid, and define where a human approves output.',
            },
            {
                'title': 'Build and integrate',
                'text': 'The automation is built against your real systems through APIs, '
                        'databases, file drops or email, with logging from day one.',
            },
            {
                'title': 'Shadow run and handover',
                'text': 'The automation runs alongside the manual process until accuracy is '
                        'proven, then ownership and monitoring transfer to your team.',
            },
        ],
        'capabilities': [
            'Workflow automation across email, ERP, CRM and file storage',
            'Document data extraction from PDFs, scans and spreadsheets',
            'AI agents that handle multi-step operational tasks',
            'RFQ intake, parsing and structured comparison',
            'Quotation drafting with human approval gates',
            'Lead qualification and routing',
            'Report generation from operational data',
            'Exception queues so humans handle only what AI cannot',
        ],
        'use_cases': [
            {
                'title': 'Customer enquiry handling',
                'text': 'Incoming enquiries are read, classified and routed to the right '
                        'person with the relevant history attached, instead of sitting in a '
                        'shared inbox.',
            },
            {
                'title': 'Supplier document processing',
                'text': 'Purchase orders, delivery notes and invoices are read into '
                        'structured records and matched against expected values.',
            },
            {
                'title': 'Sales administration',
                'text': 'Quotation preparation, follow-up scheduling and CRM updates happen '
                        'automatically once a deal stage changes.',
            },
            {
                'title': 'Operational reporting',
                'text': 'Recurring reports are assembled from multiple systems and delivered '
                        'on schedule with anomalies highlighted.',
            },
        ],
        'industries': [
            ('Manufacturing', '/industries/manufacturing'),
            ('Industrial distribution', '/industries/industrial-distribution'),
            ('Wholesale and B2B', '/industries/wholesale'),
            ('Professional services', '/industries/professional-services'),
        ],
        'technologies': [
            'Python', 'Large language models', 'OCR and document parsing', 'REST APIs',
            'PostgreSQL', 'Workflow orchestration', 'Vector search', 'Cloud or on-premise deployment',
        ],
        'benefits': [
            'Manual handling time drops on the processes that are automated',
            'Response times become predictable rather than dependent on workload',
            'Data quality improves because capture happens once, at source',
            'Staff move to exceptions, negotiation and customer work',
            'Every automated decision is logged and auditable',
        ],
        'faqs': [
            {
                'q': 'What is AI automation?',
                'a': 'AI automation uses machine learning models to perform tasks that '
                     'require judgement about unstructured input, such as reading an email, '
                     'extracting fields from a PDF, or deciding which queue an enquiry '
                     'belongs to. It is usually combined with conventional workflow '
                     'automation, which handles the deterministic steps around it.',
            },
            {
                'q': 'Which processes should we automate first?',
                'a': 'Start with a process that runs at high volume, has a clear definition '
                     'of a correct outcome, and is currently a bottleneck. RFQ intake, '
                     'document data capture and enquiry routing are common first candidates '
                     'because the input is unstructured but the expected output is well defined.',
            },
            {
                'q': 'Do we need to replace our ERP or CRM?',
                'a': 'No. Humisense builds around your existing systems. We integrate through '
                     'APIs, database access, file exchange or email, and only recommend '
                     'replacement when a system genuinely blocks the process.',
            },
            {
                'q': 'How do you handle mistakes made by the AI?',
                'a': 'Every automation we build defines an approval point. Low-risk steps can '
                     'run unattended with logging; commercially sensitive outputs such as '
                     'quotations are drafted by the system and approved by a person. Items '
                     'that fail a confidence threshold are routed to a review queue rather '
                     'than guessed at.',
            },
            {
                'q': 'How much does AI automation cost?',
                'a': 'Cost depends on process complexity, the number of integrations and the '
                     'level of human review required. We scope projects in phases so that a '
                     'first production automation can be delivered before committing to a '
                     'wider programme. Contact us with a process description for a scoped estimate.',
            },
        ],
        'related': [
            ('AI workflow automation', '/ai-workflow-automation'),
            ('Custom AI agent development', '/ai-agents'),
            ('Intelligent document processing', '/document-automation'),
            ('AI consulting and implementation', '/ai-consulting'),
        ],
    },
    {
        'slug': 'ai-workflow-automation',
        'title': 'AI Workflow Automation for Businesses | Humisense',
        'description': (
            'AI workflow automation connects your systems and adds AI reasoning where '
            'rules are not enough. Humisense builds workflows without manual '
            'handoffs.'
        ),
        'h1': 'AI Workflow Automation for Businesses',
        'eyebrow': 'Workflow Automation',
        'answer': (
            'AI workflow automation is the combination of a defined process flow with AI '
            'steps that interpret unstructured input. Traditional workflow tools move data '
            'between systems when conditions are met; AI workflow automation adds the '
            'ability to read an email, understand a document, classify an enquiry or draft '
            'a response as part of that flow.'
        ),
        'summary': (
            'We build workflows that start from a real trigger in your business, such as an '
            'incoming enquiry or a new purchase order, and carry it through to a finished '
            'outcome with clear ownership at every step.'
        ),
        'problems': [
            'Work stalls between departments because handoffs depend on email.',
            'Rules-based automation breaks whenever a document or enquiry varies slightly.',
            'Nobody can say where a specific request currently is in the process.',
            'Approvals happen in chat threads and are impossible to audit later.',
        ],
        'approach': [
            {
                'title': 'Trigger definition',
                'text': 'Every workflow starts from a specific event: an email arriving, a '
                        'record being created, a file landing in a folder or a schedule firing.',
            },
            {
                'title': 'State model',
                'text': 'We define the states a request passes through, who owns each state '
                        'and what evidence is required to move forward.',
            },
            {
                'title': 'AI steps',
                'text': 'AI is applied only where interpretation is genuinely needed: '
                        'extraction, classification, summarisation, matching or drafting.',
            },
            {
                'title': 'Deterministic steps',
                'text': 'Validation, calculations, lookups and system writes stay '
                        'deterministic so behaviour is predictable and testable.',
            },
            {
                'title': 'Observability',
                'text': 'Each run is logged with inputs, decisions and outputs so failures '
                        'can be diagnosed without guesswork.',
            },
        ],
        'capabilities': [
            'Email and inbox driven workflow triggers',
            'Document intake with AI extraction',
            'Approval steps with named approvers and audit trail',
            'System-to-system synchronisation',
            'Escalation rules when a step stalls',
            'Exception queues with context for reviewers',
            'Scheduled batch workflows',
            'Webhook and API integration with existing platforms',
        ],
        'use_cases': [
            {
                'title': 'Enquiry to quotation',
                'text': 'An enquiry email arrives, the request is parsed, matching products '
                        'are retrieved, a draft quotation is assembled and routed for approval.',
            },
            {
                'title': 'Order to fulfilment documentation',
                'text': 'An order confirmation is read, checked against the sales record, and '
                        'the required shipping documents are generated.',
            },
            {
                'title': 'Invoice processing',
                'text': 'Supplier invoices are captured, matched against purchase orders and '
                        'exceptions are queued for finance review.',
            },
            {
                'title': 'Compliance documentation',
                'text': 'Certificates and declarations are collected from suppliers, checked '
                        'for completeness and stored against the right record.',
            },
        ],
        'industries': [
            ('Manufacturing', '/industries/manufacturing'),
            ('Industrial distribution', '/industries/industrial-distribution'),
            ('Wholesale and B2B', '/industries/wholesale'),
            ('Small businesses', '/industries/small-businesses'),
        ],
        'technologies': [
            'Python', 'Workflow orchestration', 'LLM extraction', 'OCR',
            'REST and webhook integrations', 'Relational databases', 'Message queues',
        ],
        'benefits': [
            'Work moves forward without waiting for a person to notice it',
            'Process state is visible instead of hidden in mailboxes',
            'Approvals are recorded with who approved what and when',
            'Variation in input stops breaking the process',
            'Volume growth does not require proportional headcount growth',
        ],
        'faqs': [
            {
                'q': 'What is AI workflow automation?',
                'a': 'It is a workflow where at least one step uses an AI model to interpret '
                     'unstructured content. The surrounding steps are ordinary automation: '
                     'validation, lookups, calculations and system updates. The AI step makes '
                     'the workflow tolerant of real-world input such as free-text emails or '
                     'inconsistent document layouts.',
            },
            {
                'q': 'How is this different from a no-code automation tool?',
                'a': 'No-code tools are effective for connecting systems when the data is '
                     'already structured. They struggle when the input is a PDF, a scanned '
                     'purchase order or a customer email written in three different ways. '
                     'Humisense adds the extraction and reasoning layer those tools do not '
                     'handle, and integrates it with the same platforms you already use.',
            },
            {
                'q': 'Can it work with our existing ERP?',
                'a': 'In most cases yes. Integration happens through the ERP vendor API, a '
                     'database view, a supported import format or a middleware layer. Where '
                     'no API exists we use the safest supported interface rather than '
                     'screen-scraping where avoidable.',
            },
            {
                'q': 'What happens when the workflow cannot decide?',
                'a': 'The item is routed to a review queue with the original input, the '
                     'extracted data and the reason for the uncertainty. A person resolves '
                     'it, and the correction is recorded so the process can be improved.',
            },
        ],
        'related': [
            ('AI automation services', '/ai-automation'),
            ('Intelligent document processing', '/document-automation'),
            ('Business process automation', '/business-process-automation'),
            ('AI agents', '/ai-agents'),
        ],
    },
    {
        'slug': 'ai-agents',
        'title': 'Custom AI Agent Development | Humisense',
        'description': (
            'Humisense builds custom AI agents that carry out multi-step business tasks with '
            'tool access, guardrails and audit logs, integrated with your existing systems.'
        ),
        'h1': 'Custom AI Agent Development',
        'eyebrow': 'AI Agents',
        'answer': (
            'An AI agent is a system that uses a language model to decide which actions to '
            'take, then executes those actions through tools you control: looking up a '
            'record, sending an email, updating a CRM, or querying a database. Unlike a '
            'chatbot that only replies, an agent completes work and reports what it did.'
        ),
        'summary': (
            'We build agents that are deliberately narrow, tightly scoped and auditable. '
            'Each agent has a defined job, a defined set of tools and a defined escalation '
            'path when it is uncertain.'
        ),
        'problems': [
            'Off-the-shelf assistants cannot reach the systems where the work actually happens.',
            'Multi-step tasks still require a person to copy results between applications.',
            'Automation projects fail because nobody defines what the system must not do.',
            'There is no record of why a system took an action, so nothing can be reviewed.',
        ],
        'approach': [
            {
                'title': 'Job definition',
                'text': 'We write the agent job as a short, testable statement with explicit '
                        'inputs, outputs and boundaries.',
            },
            {
                'title': 'Tool design',
                'text': 'Each tool is a narrow, permissioned function. The agent cannot act '
                        'outside the tools it has been given.',
            },
            {
                'title': 'Evaluation set',
                'text': 'Before launch we assemble real examples of the task, including edge '
                        'cases, and measure the agent against them.',
            },
            {
                'title': 'Guardrails',
                'text': 'Confidence thresholds, spend limits, approval requirements and '
                        'refusal behaviour are configured explicitly.',
            },
            {
                'title': 'Deployment and monitoring',
                'text': 'The agent runs with full trace logging, and its performance is '
                        'reviewed against the evaluation set after release.',
            },
        ],
        'capabilities': [
            'Sales and enquiry agents that qualify and route',
            'Procurement agents that compare supplier responses',
            'Document agents that extract, validate and file records',
            'Research agents that assemble briefs from internal sources',
            'Support agents with access to order and product data',
            'Human-in-the-loop approval for sensitive actions',
            'Tool-level permissions and rate limits',
            'Full trace logs for every run',
        ],
        'use_cases': [
            {
                'title': 'Inbound sales qualification',
                'text': 'An agent reads new enquiries, checks the customer against the CRM, '
                        'asks clarifying questions where information is missing and books a '
                        'call with the right account manager.',
            },
            {
                'title': 'Supplier response comparison',
                'text': 'An agent collects supplier replies to an RFQ, normalises the pricing '
                        'and lead times into a comparable table and flags the gaps.',
            },
            {
                'title': 'Internal knowledge retrieval',
                'text': 'An agent answers operational questions from approved internal '
                        'documentation and links to the source passage for verification.',
            },
            {
                'title': 'Order status handling',
                'text': 'An agent answers routine customer status questions by querying the '
                        'order system and escalates anything unusual to a person.',
            },
        ],
        'industries': [
            ('Manufacturing', '/industries/manufacturing'),
            ('Industrial distribution', '/industries/industrial-distribution'),
            ('Professional services', '/industries/professional-services'),
            ('B2B businesses', '/industries/b2b-businesses'),
        ],
        'technologies': [
            'Large language models', 'Tool calling', 'Python', 'Vector search',
            'Role-based access control', 'Audit logging', 'API gateways',
        ],
        'benefits': [
            'Multi-step tasks complete without manual copying between systems',
            'Actions are permissioned and logged, so behaviour can be reviewed',
            'Escalation is explicit rather than an afterthought',
            'The agent can be evaluated against real examples before release',
            'Scope stays narrow, so accuracy stays measurable',
        ],
        'faqs': [
            {
                'q': 'What is an AI agent?',
                'a': 'An AI agent is software that uses a language model to choose actions '
                     'and then performs them through defined tools. It differs from a '
                     'chatbot because it completes tasks in external systems, and it differs '
                     'from a script because the sequence of actions is decided at run time '
                     'rather than hard-coded.',
            },
            {
                'q': 'How does custom AI agent development work?',
                'a': 'We start from the job to be done, define the tools the agent may use, '
                     'build an evaluation set from real examples, implement the agent with '
                     'guardrails, test it against the evaluation set, and then release it with '
                     'monitoring. Development is iterative because the failure modes only '
                     'become clear once real inputs are used.',
            },
            {
                'q': 'What is the difference between AI agents and traditional automation?',
                'a': 'Traditional automation follows rules you define in advance. An AI agent '
                     'decides which action to take based on the content it is given. Rules '
                     'are more predictable and cheaper to run; agents handle variation. Most '
                     'production systems use both: rules for the deterministic steps and an '
                     'agent only where judgement is required.',
            },
            {
                'q': 'Are AI agents safe to give access to our systems?',
                'a': 'They are as safe as the permissions you grant. We design tools with the '
                     'minimum permission needed for the job, avoid destructive operations, '
                     'require approval for commercially significant actions, and log every '
                     'call so behaviour can be audited.',
            },
            {
                'q': 'Do we need our own data to build an agent?',
                'a': 'You need examples of the task, not a large training dataset. A set of '
                     'real emails, documents or records is usually enough to define the job '
                     'and evaluate the agent. Your data stays in your environment or in an '
                     'agreed cloud region.',
            },
        ],
        'related': [
            ('AI workflow automation', '/ai-workflow-automation'),
            ('AI automation services', '/ai-automation'),
            ('Sales automation', '/sales-automation'),
            ('AI consulting and implementation', '/ai-consulting'),
        ],
    },
    {
        'slug': 'rfq-automation',
        'title': 'AI-Powered RFQ Automation Solutions | Humisense',
        'description': (
            'Automate RFQ intake, parsing and supplier comparison. Humisense builds '
            'RFQ automation that turns unstructured enquiries into comparable '
            'structured quotes.'
        ),
        'h1': 'AI-Powered RFQ Automation',
        'eyebrow': 'RFQ Automation',
        'answer': (
            'RFQ automation uses AI to read incoming requests for quotation, extract the '
            'items, quantities, specifications and delivery requirements, and place them '
            'into a structured format your team can price and respond to. It removes the '
            'manual re-keying that delays response times and introduces transcription errors.'
        ),
        'summary': (
            'Built for distributors, manufacturers and wholesalers who receive quotations as '
            'emails, PDFs, spreadsheets and portal submissions, often in inconsistent formats.'
        ),
        'problems': [
            'RFQs arrive as PDFs, spreadsheets, emails and portal exports with no common format.',
            'Line items are re-keyed by hand, which is slow and produces errors.',
            'Response time depends on the workload of one or two experienced people.',
            'Incomplete requests are discovered late, after pricing work has already started.',
            'There is no record of how many RFQs were received, won or lost.',
        ],
        'approach': [
            {
                'title': 'Intake capture',
                'text': 'RFQs are collected from every channel you use: mailbox, shared drive, '
                        'web form, portal export or API.',
            },
            {
                'title': 'Document understanding',
                'text': 'Attachments are parsed with layout-aware extraction so tables, '
                        'specifications and footnotes are preserved rather than flattened.',
            },
            {
                'title': 'Normalisation and matching',
                'text': 'Extracted items are mapped to your product catalogue using part '
                        'numbers, descriptions and specification matching.',
            },
            {
                'title': 'Completeness checks',
                'text': 'Missing quantities, unclear specifications and contradictory '
                        'requirements are flagged before pricing begins.',
            },
            {
                'title': 'Structured handoff',
                'text': 'A clean, priced-ready RFQ record is created and routed to the right '
                        'person or into the quotation workflow.',
            },
        ],
        'capabilities': [
            'Multi-format intake: PDF, Excel, email body, scanned images',
            'Table and line-item extraction with column mapping',
            'Product and part number matching against your catalogue',
            'Specification comparison and substitution suggestions',
            'Missing-information detection with clarification drafts',
            'Multi-supplier response comparison',
            'Win/loss tracking on quoted requests',
            'Integration with ERP and CRM records',
        ],
        'use_cases': [
            {
                'title': 'Distributor RFQ desk',
                'text': 'A distributor receiving several hundred RFQs a week parses each one '
                        'automatically and prioritises by value and lead time instead of by '
                        'arrival order.',
            },
            {
                'title': 'Manufacturer custom quotes',
                'text': 'A manufacturer extracts specifications from customer drawings and '
                        'specification sheets, checks feasibility against standard ranges and '
                        'prepares the technical annex for the quote.',
            },
            {
                'title': 'Multi-supplier sourcing',
                'text': 'A buyer sends a structured request to several suppliers, collects the '
                        'responses and compares price, lead time and terms in one table.',
            },
            {
                'title': 'Tender intake',
                'text': 'Large tender documents are split into requirements so that the bid '
                        'team can assess fit before committing effort.',
            },
        ],
        'industries': [
            ('Industrial distribution', '/industries/industrial-distribution'),
            ('Manufacturing', '/industries/manufacturing'),
            ('Wholesale and B2B', '/industries/wholesale'),
        ],
        'technologies': [
            'Document AI', 'OCR', 'Large language models', 'Catalogue matching',
            'Python', 'ERP and CRM APIs',
        ],
        'benefits': [
            'Enquiries enter a structured system without manual re-keying',
            'Quotation turnaround no longer depends on one person being available',
            'Incomplete requests are caught before pricing effort is spent',
            'RFQ volume, response time and win rate become measurable',
            'Experienced staff spend their time on pricing judgement, not data entry',
        ],
        'faqs': [
            {
                'q': 'What is RFQ automation?',
                'a': 'RFQ automation is the automated capture and structuring of requests '
                     'for quotation. It reads the request from whatever format it arrives in, '
                     'extracts the commercial and technical details, and creates a structured '
                     'record that can be priced, compared and tracked.',
            },
            {
                'q': 'Can AI read scanned or photographed RFQs?',
                'a': 'Yes, with the caveat that quality matters. Scanned documents are '
                     'processed with OCR and layout analysis before extraction. Clear scans '
                     'work well; poor photographs, handwriting and unusual layouts produce '
                     'lower accuracy and are routed to review. We measure extraction accuracy '
                     'on your own documents before going live.',
            },
            {
                'q': 'How accurate is the extraction?',
                'a': 'Accuracy depends on document consistency. For standardised formats it is '
                     'high; for highly variable customer documents it is lower, which is why '
                     'every RFQ automation we build includes a confidence threshold and a '
                     'review queue for uncertain fields. We do not quote accuracy figures '
                     'before testing against your documents.',
            },
            {
                'q': 'Does it replace our sales team?',
                'a': 'No. It removes the data entry and checking work around quoting so that '
                     'sales and technical staff can concentrate on pricing decisions, '
                     'substitutions and customer conversations.',
            },
        ],
        'related': [
            ('Automated quotation processing', '/quotation-automation'),
            ('Intelligent document processing', '/document-automation'),
            ('Industrial distribution solutions', '/industries/industrial-distribution'),
            ('AI workflow automation', '/ai-workflow-automation'),
        ],
    },
    {
        'slug': 'quotation-automation',
        'title': 'Automated Quotation Processing Using AI | Humisense',
        'description': (
            'Humisense automates quotation preparation: pricing lookup, document assembly, '
            'approval routing and follow-up, with human approval before anything is sent.'
        ),
        'h1': 'Automated Quotation Processing Using AI',
        'eyebrow': 'Quotation Automation',
        'answer': (
            'Quotation automation assembles a priced, formatted quotation from structured '
            'request data and your pricing rules, then routes it for approval and sends it. '
            'The AI element is used where pricing depends on interpreting descriptions, '
            'specifications or previous similar quotes, and to draft the covering response.'
        ),
        'summary': (
            'Designed for businesses that quote frequently from a catalogue, price list or '
            'project history, and lose time assembling the same document structures repeatedly.'
        ),
        'problems': [
            'Quotes are built by copying an old document and editing it, which carries errors forward.',
            'Pricing rules live in spreadsheets that only one person understands.',
            'Approval happens over email and the final version is unclear.',
            'Follow-up depends on memory, so opportunities quietly expire.',
        ],
        'approach': [
            {
                'title': 'Pricing model capture',
                'text': 'We document the actual pricing logic: list price, discount bands, '
                        'customer-specific agreements, freight and tax treatment.',
            },
            {
                'title': 'Template design',
                'text': 'Quotation templates are standardised so that the output is consistent '
                        'and every mandatory clause appears.',
            },
            {
                'title': 'Assembly automation',
                'text': 'The system builds the quotation from the request record and the '
                        'pricing model, with the calculation shown rather than hidden.',
            },
            {
                'title': 'Approval routing',
                'text': 'Discounts beyond a threshold, non-standard terms or new customers '
                        'are routed to a named approver before the document leaves the system.',
            },
            {
                'title': 'Follow-up scheduling',
                'text': 'Each sent quotation creates a follow-up task and status record so '
                        'that outcomes are tracked.',
            },
        ],
        'capabilities': [
            'Pricing lookup from catalogue, price list or agreement data',
            'Customer-specific discount application',
            'Quotation document generation in your template',
            'Multi-currency and international unit handling',
            'Approval workflow with audit trail',
            'Version control on revisions',
            'Automated follow-up reminders',
            'Win/loss reporting',
        ],
        'use_cases': [
            {
                'title': 'Catalogue quoting',
                'text': 'A distributor quotes standard catalogue items, with pricing and '
                        'availability pulled directly from the ERP and formatted into the '
                        'customer template.',
            },
            {
                'title': 'Project quotations',
                'text': 'A manufacturer assembles a multi-line project quote including '
                        'technical specifications, lead times and payment terms.',
            },
            {
                'title': 'Service proposals',
                'text': 'A professional services firm generates a scope-based proposal from a '
                        'structured brief and approved rate card.',
            },
            {
                'title': 'Quote revisions',
                'text': 'Customer-requested changes are applied to the existing quotation '
                        'with a full revision history rather than a new untracked document.',
            },
        ],
        'industries': [
            ('Industrial distribution', '/industries/industrial-distribution'),
            ('Manufacturing', '/industries/manufacturing'),
            ('Professional services', '/industries/professional-services'),
            ('Wholesale and B2B', '/industries/wholesale'),
        ],
        'technologies': [
            'Python', 'Document generation', 'ERP and CRM APIs',
            'Large language models for drafting', 'Approval workflow engines',
        ],
        'benefits': [
            'Quotation output becomes consistent across the team',
            'Pricing logic is documented in one place instead of in personal spreadsheets',
            'Approvals are recorded rather than lost in email threads',
            'Revisions are tracked, so the latest version is unambiguous',
            'Follow-up happens systematically instead of by memory',
        ],
        'faqs': [
            {
                'q': 'How does AI-powered quotation automation work?',
                'a': 'The system receives a structured request, retrieves applicable prices '
                     'and terms, calculates the quotation, generates the document from a '
                     'controlled template and routes it for approval. AI is used where a '
                     'description must be interpreted, where a similar previous quotation is '
                     'the best reference, or where a covering message has to be drafted.',
            },
            {
                'q': 'Will it send quotes without our approval?',
                'a': 'Only if you configure it to. By default every quotation above an '
                     'agreed value, or with a discount beyond your threshold, requires '
                     'approval. Low-risk standard quotes can be configured to send '
                     'automatically once the pricing model has been validated.',
            },
            {
                'q': 'Can it handle multiple currencies?',
                'a': 'Yes. Currency, unit of measure and tax treatment are part of the pricing '
                     'model, so quotations for international customers are generated with the '
                     'correct currency and terms.',
            },
            {
                'q': 'Does it work with our existing quotation template?',
                'a': 'Yes. We build the generator around your existing template so the output '
                     'is recognisable to your customers. Templates are versioned so changes '
                     'can be reviewed rather than applied silently.',
            },
        ],
        'related': [
            ('RFQ automation', '/rfq-automation'),
            ('Sales automation', '/sales-automation'),
            ('Industrial distribution solutions', '/industries/industrial-distribution'),
            ('AI workflow automation', '/ai-workflow-automation'),
        ],
    },
    {
        'slug': 'document-automation',
        'title': 'Intelligent Document Processing & Automation | Humisense',
        'description': (
            'Extract structured data from PDFs, scans, invoices, purchase orders and '
            'spreadsheets with intelligent document processing built by Humisense.'
        ),
        'h1': 'Intelligent Document Processing',
        'eyebrow': 'Document Automation',
        'answer': (
            'Intelligent document processing combines OCR, layout analysis and language '
            'models to convert documents into structured data your systems can use. It '
            'handles PDFs, scans, photographs and spreadsheets, including documents where '
            'the layout changes between suppliers or customers.'
        ),
        'summary': (
            'Most business documents are still read by a person and retyped. This is the '
            'single largest source of avoidable manual work in operational teams.'
        ),
        'problems': [
            'Invoices, purchase orders and delivery notes are retyped into the ERP by hand.',
            'Document layouts vary by supplier, so template-based capture keeps breaking.',
            'Key documents are stored as PDFs with no structured data attached.',
            'Searching for a specific clause or value means opening files one by one.',
            'Errors found late in the process cost more to correct.',
        ],
        'approach': [
            {
                'title': 'Document inventory',
                'text': 'We catalogue the document types you receive, their volumes and how '
                        'much their layouts vary.',
            },
            {
                'title': 'Extraction design',
                'text': 'Field definitions are agreed with the people who use the data, '
                        'including validation rules and acceptable formats.',
            },
            {
                'title': 'Pipeline build',
                'text': 'Documents are ingested, classified, parsed and extracted, with '
                        'confidence scores attached to each field.',
            },
            {
                'title': 'Validation and review',
                'text': 'Extracted data is validated against business rules; failures are '
                        'queued for human review with the source document alongside.',
            },
            {
                'title': 'System handoff',
                'text': 'Clean records are written to your ERP, CRM, database or file store '
                        'with the original document linked for reference.',
            },
        ],
        'capabilities': [
            'Invoice, purchase order and delivery note extraction',
            'Table extraction from multi-page PDFs and spreadsheets',
            'Scanned document and photograph processing',
            'Document classification and routing',
            'Field-level confidence scoring',
            'Validation against business rules',
            'Duplicate and anomaly detection',
            'Searchable archive with structured metadata',
        ],
        'use_cases': [
            {
                'title': 'Accounts payable',
                'text': 'Supplier invoices are captured, matched against purchase orders and '
                        'receipts, and exceptions are queued for finance.',
            },
            {
                'title': 'Procurement documents',
                'text': 'Purchase requisitions, order confirmations and supplier certificates '
                        'are captured and linked to the correct supplier record.',
            },
            {
                'title': 'Logistics paperwork',
                'text': 'Delivery notes, packing lists and customs documents are extracted '
                        'and reconciled against the shipment record.',
            },
            {
                'title': 'Contract and specification review',
                'text': 'Key clauses, dates and obligations are extracted from agreements and '
                        'technical documents for review.',
            },
        ],
        'industries': [
            ('Manufacturing', '/industries/manufacturing'),
            ('Industrial distribution', '/industries/industrial-distribution'),
            ('Professional services', '/industries/professional-services'),
            ('Wholesale and B2B', '/industries/wholesale'),
        ],
        'technologies': [
            'OCR engines', 'Layout-aware document AI', 'Large language models',
            'Python', 'Vector search', 'Object storage', 'ERP and accounting APIs',
        ],
        'benefits': [
            'Data is captured once, at source, instead of being retyped',
            'Supplier layout changes no longer break the capture process',
            'Documents become searchable and reportable',
            'Finance and operations teams review exceptions instead of every document',
            'A complete audit trail links each record to its source document',
        ],
        'faqs': [
            {
                'q': 'Can AI process PDF and Excel documents?',
                'a': 'Yes. PDFs are handled with text extraction where the file contains a '
                     'text layer and with OCR where it is a scan. Excel files are read as '
                     'structured data, including multi-sheet workbooks and merged cells. Both '
                     'paths produce the same structured output, which is then validated.',
            },
            {
                'q': 'What about handwritten documents?',
                'a': 'Handwriting recognition has improved but remains less reliable than '
                     'printed text. We test against your actual documents and set confidence '
                     'thresholds accordingly; handwritten fields usually route to review.',
            },
            {
                'q': 'Do you store our documents?',
                'a': 'Only where the design requires it. Processing can run entirely inside '
                     'your own infrastructure or cloud account, with documents retained '
                     'according to your policy. Retention and deletion rules are agreed '
                     'during design.',
            },
            {
                'q': 'Which documents should we start with?',
                'a': 'Pick one high-volume document type with clear downstream use, such as '
                     'supplier invoices or purchase orders. A single well-scoped document '
                     'pipeline proves the approach and creates the integration patterns for '
                     'the next document type.',
            },
        ],
        'related': [
            ('AI workflow automation', '/ai-workflow-automation'),
            ('RFQ automation', '/rfq-automation'),
            ('Manufacturing solutions', '/industries/manufacturing'),
            ('Business process automation', '/business-process-automation'),
        ],
    },
    {
        'slug': 'sales-automation',
        'title': 'AI Sales Automation for B2B Teams | Humisense',
        'description': (
            'Automate enquiry handling, quotation follow-up, CRM hygiene and pipeline '
            'reporting with AI sales automation implemented by Humisense.'
        ),
        'h1': 'AI Sales Automation',
        'eyebrow': 'Sales Automation',
        'answer': (
            'AI sales automation applies AI to the administrative and analytical work around '
            'selling: reading and routing enquiries, enriching customer records, drafting '
            'follow-ups, summarising interactions and keeping the pipeline accurate. It '
            'supports the sales team rather than replacing the relationship.'
        ),
        'summary': (
            'Built for B2B teams where the sales process is real but the CRM is not an '
            'accurate picture of it.'
        ),
        'problems': [
            'Enquiries arrive through several channels and some are never followed up.',
            'CRM records are updated late, partially, or not at all.',
            'Sales staff write the same follow-up messages dozens of times a week.',
            'Management reporting requires manual spreadsheet consolidation.',
            'Handover between sales and operations loses information.',
        ],
        'approach': [
            {
                'title': 'Channel consolidation',
                'text': 'Enquiries from email, web forms, phone notes and portals are captured '
                        'into one queue with a consistent structure.',
            },
            {
                'title': 'Qualification and routing',
                'text': 'Each enquiry is assessed against your qualification criteria and '
                        'routed to the right owner with the context attached.',
            },
            {
                'title': 'Activity automation',
                'text': 'Follow-up tasks, reminders and drafts are generated from the stage '
                        'of the deal rather than from memory.',
            },
            {
                'title': 'CRM hygiene',
                'text': 'Interactions are logged automatically and missing fields are '
                        'flagged, so the pipeline reflects reality.',
            },
            {
                'title': 'Reporting',
                'text': 'Pipeline, conversion and response-time reporting is generated from '
                        'the system rather than assembled by hand.',
            },
        ],
        'capabilities': [
            'Multi-channel enquiry capture',
            'Lead scoring against your criteria',
            'Automated routing and assignment',
            'Follow-up drafting with human send',
            'Meeting and call summary capture',
            'CRM field completion and deduplication',
            'Pipeline and conversion reporting',
            'Quotation status tracking',
        ],
        'use_cases': [
            {
                'title': 'Inbound enquiry handling',
                'text': 'A technical distributor receives enquiries from a web form, a shared '
                        'mailbox and two marketplaces; all three land in one queue with the '
                        'customer history attached.',
            },
            {
                'title': 'Follow-up discipline',
                'text': 'Quotations create scheduled follow-ups, and the system surfaces the '
                        'ones that have gone quiet.',
            },
            {
                'title': 'Account handover',
                'text': 'When an account moves between representatives, a structured summary '
                        'of history, open quotes and commitments transfers with it.',
            },
            {
                'title': 'Territory reporting',
                'text': 'Regional performance is reported from live pipeline data instead of '
                        'a monthly spreadsheet exercise.',
            },
        ],
        'industries': [
            ('Industrial distribution', '/industries/industrial-distribution'),
            ('Wholesale and B2B', '/industries/wholesale'),
            ('Manufacturing', '/industries/manufacturing'),
            ('B2B businesses', '/industries/b2b-businesses'),
        ],
        'technologies': [
            'CRM APIs', 'Large language models', 'Python', 'Email integration',
            'Webhook pipelines', 'Business intelligence tooling',
        ],
        'benefits': [
            'Fewer enquiries go unanswered because nothing depends on inbox monitoring',
            'CRM data becomes reliable enough to manage from',
            'Sales staff spend more time with customers and less time on administration',
            'Reporting is generated rather than assembled',
            'Handovers stop losing context',
        ],
        'faqs': [
            {
                'q': 'Will AI send emails to our customers automatically?',
                'a': 'By default, no. Drafts are prepared and a person sends them. Automatic '
                     'sending can be enabled for low-risk, templated messages such as '
                     'acknowledgements, once the templates have been reviewed.',
            },
            {
                'q': 'Does this replace our CRM?',
                'a': 'No. It makes your existing CRM more accurate by capturing activity '
                     'automatically and flagging incomplete records. Replacing the CRM is a '
                     'separate decision and usually not the bottleneck.',
            },
            {
                'q': 'How do you score leads without historical data?',
                'a': 'We start with rule-based qualification using criteria your team already '
                     'applies, such as industry, size, requirement clarity and timeline. Once '
                     'enough outcomes exist, the criteria can be reviewed against actual wins '
                     'and losses.',
            },
            {
                'q': 'Can it work across multiple sales regions?',
                'a': 'Yes. Routing rules, languages and business hours can be configured per '
                     'region, and reporting can be segmented by territory without separate '
                     'systems.',
            },
        ],
        'related': [
            ('Lead generation automation', '/lead-generation-automation'),
            ('Quotation automation', '/quotation-automation'),
            ('AI agents', '/ai-agents'),
            ('B2B business solutions', '/industries/b2b-businesses'),
        ],
    },
    {
        'slug': 'lead-generation-automation',
        'title': 'AI Lead Generation Automation | Humisense',
        'description': (
            'Build a repeatable B2B lead generation engine: prospect research, list building, '
            'outreach preparation and qualification, automated with AI and human review.'
        ),
        'h1': 'AI Lead Generation Automation',
        'eyebrow': 'Lead Generation',
        'answer': (
            'AI lead generation automation handles the research and preparation work behind '
            'outbound selling: identifying companies that match your ideal customer profile, '
            'finding the right contacts, researching context and preparing personalised '
            'outreach for a person to review and send.'
        ),
        'summary': (
            'The objective is not more messages. It is a smaller number of well-researched, '
            'relevant approaches that respect the recipient and comply with applicable rules.'
        ),
        'problems': [
            'Prospecting is done manually and inconsistently when the team has spare time.',
            'Contact data is out of date, duplicated or missing context.',
            'Outreach is generic, so reply rates stay low.',
            'There is no record of which segments or messages actually work.',
        ],
        'approach': [
            {
                'title': 'Ideal customer profile',
                'text': 'We define the company characteristics, roles and trigger events that '
                        'make a prospect genuinely relevant.',
            },
            {
                'title': 'Data sourcing',
                'text': 'Prospect data is assembled from permitted sources and checked for '
                        'accuracy and duplication before use.',
            },
            {
                'title': 'Research automation',
                'text': 'For each prospect the system gathers context: recent activity, '
                        'relevant products, likely operational pain points.',
            },
            {
                'title': 'Outreach preparation',
                'text': 'Draft messages are prepared with specific, factual references and '
                        'queued for human review before sending.',
            },
            {
                'title': 'Qualification and handover',
                'text': 'Replies are classified, qualified against your criteria and routed '
                        'to sales with the full context attached.',
            },
        ],
        'capabilities': [
            'Ideal customer profile definition',
            'Prospect list building and enrichment',
            'Account research summaries',
            'Personalised outreach drafting',
            'Reply classification and qualification',
            'Suppression and do-not-contact handling',
            'Sequence and follow-up management',
            'Segment performance reporting',
        ],
        'use_cases': [
            {
                'title': 'Targeted account research',
                'text': 'A manufacturer targeting a new region builds a shortlist of relevant '
                        'industrial buyers with researched context before any contact.',
            },
            {
                'title': 'Enquiry enrichment',
                'text': 'Inbound leads are enriched with company data so that qualification '
                        'does not start from an empty record.',
            },
            {
                'title': 'Event follow-up',
                'text': 'Contacts met at a trade fair receive relevant follow-up prepared from '
                        'the actual conversation notes.',
            },
            {
                'title': 'Dormant account reactivation',
                'text': 'Accounts that have not ordered in a defined period are researched and '
                        'approached with a specific, relevant reason to reconnect.',
            },
        ],
        'industries': [
            ('Manufacturing', '/industries/manufacturing'),
            ('Industrial distribution', '/industries/industrial-distribution'),
            ('B2B businesses', '/industries/b2b-businesses'),
            ('Professional services', '/industries/professional-services'),
        ],
        'technologies': [
            'Data enrichment APIs', 'Large language models', 'Python',
            'CRM integration', 'Email infrastructure',
        ],
        'benefits': [
            'Prospecting happens consistently rather than opportunistically',
            'Outreach references real context instead of generic templates',
            'Contact data quality improves through deduplication and validation',
            'Replies are qualified against explicit criteria',
            'You can see which segments actually produce conversations',
        ],
        'faqs': [
            {
                'q': 'Is automated outreach compliant?',
                'a': 'It depends on jurisdiction and on how the automation is used. We build '
                     'with human review before sending, suppression list handling and clear '
                     'identification. You remain responsible for compliance with the rules that '
                     'apply to your market, including consent and opt-out requirements, and we '
                     'will tell you plainly where a proposed approach creates risk.',
            },
            {
                'q': 'Will this send thousands of emails a day?',
                'a': 'We do not recommend that, and it is not what we build. High-volume '
                     'generic sending damages domain reputation and produces poor results. '
                     'The focus is targeted research and relevant contact, at a volume a human '
                     'can actually review.',
            },
            {
                'q': 'Where does the prospect data come from?',
                'a': 'From sources you are permitted to use: your own CRM, publicly available '
                     'business information and licensed data providers. We do not scrape '
                     'personal data from platforms in breach of their terms.',
            },
            {
                'q': 'How is success measured?',
                'a': 'By qualified conversations, not by send volume. We report replies, '
                     'positive responses, meetings booked and pipeline created by segment, so '
                     'you can judge whether the approach is working.',
            },
        ],
        'related': [
            ('Sales automation', '/sales-automation'),
            ('AI agents', '/ai-agents'),
            ('B2B business solutions', '/industries/b2b-businesses'),
            ('AI automation services', '/ai-automation'),
        ],
    },
    {
        'slug': 'business-process-automation',
        'title': 'Business Process Automation with AI | Humisense',
        'description': (
            'End-to-end business process automation for operations, finance, procurement and '
            'customer service, designed and implemented by Humisense.'
        ),
        'h1': 'Business Process Automation',
        'eyebrow': 'Process Automation',
        'answer': (
            'Business process automation replaces manual, repetitive steps in an end-to-end '
            'process with software. Adding AI extends automation to steps that involve '
            'documents, free-text communication and judgement, which is where most '
            'operational processes actually stall.'
        ),
        'summary': (
            'We automate whole processes, not isolated tasks, so that the benefit is visible '
            'in cycle time and workload rather than in a single saved click.'
        ),
        'problems': [
            'Individual tasks are automated but the process as a whole still needs chasing.',
            'Work moves between departments through email, so accountability is unclear.',
            'Process variation is handled by experience that is not written down.',
            'Nobody owns the process end to end, so improvement stalls.',
        ],
        'approach': [
            {
                'title': 'End-to-end mapping',
                'text': 'We map the process from trigger to outcome, including every handoff '
                        'and exception, not just the steps inside one department.',
            },
            {
                'title': 'Waste analysis',
                'text': 'Waiting time, rework loops, duplicate entry and unnecessary approvals '
                        'are identified and quantified.',
            },
            {
                'title': 'Target design',
                'text': 'We design the future process first, then decide which parts need '
                        'software, which need AI and which need to be removed entirely.',
            },
            {
                'title': 'Phased implementation',
                'text': 'Delivery is staged so that each phase produces a working improvement '
                        'rather than a long programme with no visible result.',
            },
            {
                'title': 'Measurement',
                'text': 'Cycle time, throughput, error rate and rework are measured before and '
                        'after so the effect is known rather than assumed.',
            },
        ],
        'capabilities': [
            'Process discovery and mapping',
            'Exception handling design',
            'Document and email driven steps',
            'Approval and escalation workflows',
            'System integration across ERP, CRM and finance',
            'Process analytics and dashboards',
            'Change management support',
            'Ongoing optimisation',
        ],
        'use_cases': [
            {
                'title': 'Order to cash',
                'text': 'From order receipt through fulfilment documentation, invoicing and '
                        'receipt matching, with exceptions surfaced early.',
            },
            {
                'title': 'Procure to pay',
                'text': 'Requisition, approval, purchase order issue, goods receipt and '
                        'invoice matching in one tracked flow.',
            },
            {
                'title': 'Enquiry to quote',
                'text': 'Customer requests are captured, qualified, priced and quoted with '
                        'consistent turnaround.',
            },
            {
                'title': 'Supplier onboarding',
                'text': 'Document collection, verification and record creation handled '
                        'systematically instead of by email chase.',
            },
        ],
        'industries': [
            ('Manufacturing', '/industries/manufacturing'),
            ('Wholesale and B2B', '/industries/wholesale'),
            ('Professional services', '/industries/professional-services'),
            ('Small businesses', '/industries/small-businesses'),
        ],
        'technologies': [
            'Python', 'Workflow engines', 'Document AI', 'ERP and finance APIs',
            'Relational databases', 'Business intelligence tooling',
        ],
        'benefits': [
            'Cycle time becomes predictable and measurable',
            'Handoffs stop depending on individual memory',
            'Exceptions surface early instead of at the end of the process',
            'Process knowledge is documented in the system, not only in people',
            'Improvement becomes continuous because the data exists',
        ],
        'faqs': [
            {
                'q': 'Which business processes can be automated using AI?',
                'a': 'Processes with high volume, unstructured input and a clear definition of '
                     'a correct outcome. Common examples include enquiry handling, quotation '
                     'preparation, invoice processing, purchase order handling, supplier '
                     'document collection and routine customer communication. Processes that '
                     'depend mainly on negotiation or relationship judgement are better '
                     'supported than automated.',
            },
            {
                'q': 'Should we automate or simplify first?',
                'a': 'Simplify first. Automating an unnecessarily complex process locks the '
                     'complexity in. Our mapping phase usually identifies steps that can be '
                     'removed or combined before any software is written.',
            },
            {
                'q': 'How long does a process automation project take?',
                'a': 'A single well-scoped process typically moves from mapping to production '
                     'in weeks rather than quarters, provided system access is available. '
                     'Larger end-to-end programmes are delivered in phases, each producing a '
                     'working improvement.',
            },
            {
                'q': 'How do you measure the result?',
                'a': 'We agree baseline measurements before implementation: cycle time, volume '
                     'handled, error and rework rate, and hours spent per unit. The same '
                     'measurements are taken afterwards. We do not publish projected ROI '
                     'figures before measuring your actual process.',
            },
        ],
        'related': [
            ('AI workflow automation', '/ai-workflow-automation'),
            ('Intelligent document processing', '/document-automation'),
            ('AI consulting and implementation', '/ai-consulting'),
            ('AI automation services', '/ai-automation'),
        ],
    },
    {
        'slug': 'ai-consulting',
        'title': 'AI Consulting & Implementation Services | Humisense',
        'description': (
            'Independent AI consulting: opportunity assessment, feasibility, architecture and '
            'hands-on implementation for businesses starting or scaling AI automation.'
        ),
        'h1': 'AI Consulting and Implementation',
        'eyebrow': 'AI Consulting',
        'answer': (
            'AI consulting helps you decide where AI is genuinely worth applying, what it '
            'will take to implement, and how to do it without disrupting operations. '
            'Humisense combines assessment work with hands-on implementation, so '
            'recommendations are grounded in what can actually be built and maintained.'
        ),
        'summary': (
            'Useful when you know AI matters to your business but need a clear, prioritised '
            'plan and a delivery partner rather than another vendor demonstration.'
        ),
        'problems': [
            'There is pressure to adopt AI but no clear picture of where it pays off.',
            'Pilot projects succeed in isolation and never reach production.',
            'Data is scattered and nobody knows whether it is usable.',
            'Vendors propose tools that do not fit the actual process.',
            'Internal teams lack the specialised skills for a first implementation.',
        ],
        'approach': [
            {
                'title': 'Opportunity assessment',
                'text': 'We review your operations and identify candidate processes, scored on '
                        'value, feasibility and risk.',
            },
            {
                'title': 'Feasibility and data review',
                'text': 'Each candidate is checked against available data, system access and '
                        'the quality of the input it depends on.',
            },
            {
                'title': 'Prioritised roadmap',
                'text': 'You receive a sequenced plan with effort estimates, dependencies and '
                        'a recommended first project.',
            },
            {
                'title': 'Pilot delivery',
                'text': 'We build the first automation to production standard, not as a demo, '
                        'so it can be evaluated on real work.',
            },
            {
                'title': 'Capability transfer',
                'text': 'Documentation, monitoring and training are handed over so your team '
                        'can operate and extend what has been built.',
            },
        ],
        'capabilities': [
            'AI readiness and opportunity assessment',
            'Process selection and prioritisation',
            'Data and integration feasibility review',
            'Solution architecture design',
            'Build-versus-buy analysis',
            'Implementation of the first production use case',
            'Governance and human-review design',
            'Team training and handover',
        ],
        'use_cases': [
            {
                'title': 'First AI project selection',
                'text': 'A leadership team with several candidate ideas needs to know which '
                        'one is worth funding first and what it will involve.',
            },
            {
                'title': 'Stalled pilot rescue',
                'text': 'A proof of concept works in a demo but has never run on real volume; '
                        'we assess why and rebuild it for production.',
            },
            {
                'title': 'Architecture review',
                'text': 'An internal team has built something and wants an independent review '
                        'of the design, cost and maintainability.',
            },
            {
                'title': 'Automation governance',
                'text': 'A business adopting AI needs clear rules on human approval, logging '
                        'and data handling before scaling up.',
            },
        ],
        'industries': [
            ('Manufacturing', '/industries/manufacturing'),
            ('Industrial distribution', '/industries/industrial-distribution'),
            ('Professional services', '/industries/professional-services'),
            ('Small businesses', '/industries/small-businesses'),
        ],
        'technologies': [
            'Python', 'Large language models', 'Document AI', 'Cloud platforms',
            'Data warehousing', 'Workflow orchestration',
        ],
        'benefits': [
            'A prioritised plan instead of a list of possibilities',
            'Clear understanding of data and integration constraints before spending',
            'A first production use case that proves the approach',
            'Governance rules that make scaling safer',
            'Internal capability rather than permanent dependency',
        ],
        'faqs': [
            {
                'q': 'How can a business start implementing AI?',
                'a': 'Start with one process that is high volume, clearly defined and '
                     'currently a bottleneck. Document how it works today, measure the '
                     'baseline, and automate that single process to production standard. '
                     'Success there creates the pattern, the data and the internal confidence '
                     'for the next one.',
            },
            {
                'q': 'Do we need a data strategy before starting?',
                'a': 'You need usable data for the specific process you are automating, not a '
                     'complete enterprise data strategy. Many valuable automations work from '
                     'documents and emails that already exist. A broader data programme can '
                     'run in parallel.',
            },
            {
                'q': 'How much does AI consulting cost?',
                'a': 'Assessment work is typically a fixed-scope engagement; implementation is '
                     'priced per project or phase. We give a written scope with deliverables '
                     'before starting so there are no open-ended consulting arrangements.',
            },
            {
                'q': 'Can you work with our existing development team?',
                'a': 'Yes. We often work alongside internal teams, either leading the first '
                     'implementation or providing architecture and review while your team '
                     'builds. Handover is a deliverable, not an afterthought.',
            },
        ],
        'related': [
            ('AI automation services', '/ai-automation'),
            ('Business process automation', '/business-process-automation'),
            ('AI agents', '/ai-agents'),
            ('Resources and guides', '/resources'),
        ],
    },
]

SERVICES_BY_SLUG = {service['slug']: service for service in SERVICES}
