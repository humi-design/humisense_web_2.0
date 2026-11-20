"""Answer-engine content.

Each entry leads with a direct answer of one to three sentences, then adds
explanation, examples and limitations. Written so a search engine or assistant
can quote the answer without losing its meaning.
"""

FAQ_GROUPS = [
    {
        'group': 'AI automation fundamentals',
        'faqs': [
            {
                'q': 'What is AI automation?',
                'a': (
                    'AI automation uses machine learning and language models to complete '
                    'business tasks that involve interpreting unstructured input, such as '
                    'reading an email, extracting data from a PDF or deciding which team should '
                    'handle a request. It is normally combined with conventional workflow '
                    'automation, which handles the predictable steps around it.'
                ),
                'more': (
                    'Conventional automation follows rules: if a field equals a value, move the '
                    'record to the next stage. That works until the input varies. AI automation '
                    'adds the ability to handle variation, which is why it is applied to '
                    'documents, emails and free-text communication rather than to structured '
                    'database records.'
                ),
                'link': ('AI automation services', '/ai-automation'),
            },
            {
                'q': 'How can businesses automate operations using AI?',
                'a': (
                    'Businesses automate operations by choosing one high-volume process with a '
                    'clear definition of a correct outcome, mapping how it works today, and '
                    'replacing the manual reading, checking and routing steps with software. '
                    'The first process should be narrow enough to reach production quickly.'
                ),
                'more': (
                    'The practical sequence is: measure the baseline, secure system access, '
                    'build the extraction or interpretation step, add validation and a review '
                    'queue, run it alongside the manual process, then hand over with monitoring. '
                    'Attempting several processes at once is the most common reason automation '
                    'programmes stall.'
                ),
                'link': ('AI consulting and implementation', '/ai-consulting'),
            },
            {
                'q': 'What is AI workflow automation?',
                'a': (
                    'AI workflow automation is a defined process flow in which at least one '
                    'step uses an AI model to interpret unstructured content. The surrounding '
                    'steps, such as validation, calculations and system updates, remain '
                    'deterministic so behaviour stays predictable and testable.'
                ),
                'more': (
                    'A typical example is an enquiry-to-quotation workflow: an email arrives, an '
                    'AI step extracts the request, deterministic code looks up prices and '
                    'calculates totals, an approval step routes the quotation, and a system '
                    'write records the outcome. Two AI steps in an eight-stage workflow is a '
                    'normal ratio.'
                ),
                'link': ('AI workflow automation', '/ai-workflow-automation'),
            },
            {
                'q': 'What is an AI agent?',
                'a': (
                    'An AI agent is software that uses a language model to decide which action '
                    'to take next, then performs that action through tools you define, such as '
                    'looking up a record, sending an email or querying a database. Unlike a '
                    'chatbot, it completes work in external systems rather than only replying.'
                ),
                'more': (
                    'The design constraint that makes agents deployable is a narrow tool set. An '
                    'agent that can call three permissioned functions is far easier to evaluate '
                    'and audit than one with unrestricted system access. Agents are usually '
                    'placed inside a deterministic workflow rather than replacing it.'
                ),
                'link': ('Custom AI agent development', '/ai-agents'),
            },
            {
                'q': 'How does custom AI agent development work?',
                'a': (
                    'Custom AI agent development starts from a specific job to be done, defines '
                    'the tools the agent may use, builds an evaluation set from real examples, '
                    'implements the agent with guardrails, and tests it against those examples '
                    'before release. Development is iterative because failure modes only appear '
                    'with real inputs.'
                ),
                'more': (
                    'Deliverables typically include the tool definitions with permissions, the '
                    'evaluation set, confidence thresholds, escalation rules and full trace '
                    'logging. Monitoring after release compares live performance against the '
                    'evaluation set.'
                ),
                'link': ('Custom AI agent development', '/ai-agents'),
            },
            {
                'q': 'What is the difference between AI agents and traditional automation?',
                'a': (
                    'Traditional automation follows rules defined in advance and produces the '
                    'same output for the same input. An AI agent decides which action to take '
                    'based on the content it is given, so it handles variation but is harder to '
                    'predict. Most production systems use rules for deterministic steps and an '
                    'agent only where judgement is required.'
                ),
                'more': (
                    'Rules are cheaper per run, easier to test exhaustively and simpler to '
                    'audit. Agents cost more per run because of model inference and are '
                    'evaluated against sample sets rather than exhaustive test cases. The choice '
                    'should be made per process step, not per company.'
                ),
                'link': ('AI agents vs traditional workflow automation', '/blog/ai-agents-vs-traditional-workflow-automation'),
            },
        ],
    },
    {
        'group': 'RFQ, quotation and documents',
        'faqs': [
            {
                'q': 'What is RFQ automation?',
                'a': (
                    'RFQ automation is the automated capture and structuring of requests for '
                    'quotation. Software reads the request from whatever format it arrives in, '
                    'extracts the items, quantities, specifications and delivery requirements, '
                    'and creates a structured record that can be priced and compared.'
                ),
                'more': (
                    'A complete pipeline has five stages: intake from all channels, '
                    'classification and splitting, extraction of line items and terms, '
                    'normalisation and catalogue matching, and completeness checks before '
                    'pricing. Uncertain fields route to a review queue rather than being guessed.'
                ),
                'link': ('RFQ automation', '/rfq-automation'),
            },
            {
                'q': 'How does AI-powered quotation automation work?',
                'a': (
                    'Quotation automation receives a structured request, retrieves applicable '
                    'prices and terms, calculates the quotation, generates the document from a '
                    'controlled template and routes it for approval. AI is used where a '
                    'description must be interpreted, where similar past quotations are the '
                    'best reference, or where a covering message has to be drafted.'
                ),
                'more': (
                    'The commercial control point is approval routing, not the calculation. '
                    'Standard quotes can be released automatically; discounts beyond a '
                    'threshold, new customers and non-standard terms route to a named approver '
                    'with a recorded decision.'
                ),
                'link': ('Quotation automation', '/quotation-automation'),
            },
            {
                'q': 'Can AI process PDF and Excel documents?',
                'a': (
                    'Yes. PDFs with a text layer are parsed directly, scanned PDFs are '
                    'processed with OCR and layout analysis first, and Excel files are read as '
                    'structured data including multi-sheet workbooks. All three paths produce '
                    'the same structured output, which is then validated against business rules.'
                ),
                'more': (
                    'Accuracy depends on the document set, not on the technology in general. '
                    'Standardised text documents extract well; poor scans, handwriting and '
                    'unusual layouts produce lower accuracy and should route to human review. '
                    'Extraction accuracy should be measured on your own documents before going live.'
                ),
                'link': ('Intelligent document processing', '/document-automation'),
            },
            {
                'q': 'How accurate is document data extraction?',
                'a': (
                    'Accuracy varies by document type, scan quality and layout consistency, so a '
                    'single figure is misleading. Well-standardised documents from repeat '
                    'suppliers extract reliably; handwritten or highly variable documents do '
                    'not. Any credible implementation measures field-level accuracy on your own '
                    'sample and routes low-confidence fields to review.'
                ),
                'more': (
                    'The metric that matters operationally is review rate: the proportion of '
                    'documents requiring correction and how long correction takes. If most '
                    'documents need correction, the scope or the schema is wrong.'
                ),
                'link': ('How AI extracts data from PDF and Excel documents', '/blog/how-ai-extracts-data-from-pdf-and-excel-documents'),
            },
        ],
    },
    {
        'group': 'Industry applications',
        'faqs': [
            {
                'q': 'How can manufacturers use AI automation?',
                'a': (
                    'Manufacturers most often apply AI automation to specification and RFQ '
                    'intake, purchase order processing, supplier acknowledgement reconciliation, '
                    'quality documentation and operational reporting. These are document-heavy '
                    'processes where manual handling creates delay and error while production '
                    'systems already handle the structured data.'
                ),
                'more': (
                    'AI should not be given decisions with safety, tolerance or contractual '
                    'consequences. It reads, checks and routes; qualified people sign off. '
                    'Production scheduling and machine control usually stay with existing systems.'
                ),
                'link': ('AI automation for manufacturing', '/industries/manufacturing'),
            },
            {
                'q': 'How can industrial distributors automate their sales processes?',
                'a': (
                    'Industrial distributors typically start with the quote desk: parsing '
                    'incoming RFQs, matching requested items to the catalogue, and assembling '
                    'quotations for review. Follow-up tracking and pipeline visibility come '
                    'next, because quotations that are not followed up are a common hidden loss.'
                ),
                'more': (
                    'Part number and equivalent matching is the hardest part, because customers '
                    'rarely use your catalogue numbers. Suggested matches above a confidence '
                    'threshold can be applied automatically; substitutions should always be '
                    'confirmed by a person because an incorrect substitution is a commercial risk.'
                ),
                'link': ('AI automation for industrial distributors', '/industries/industrial-distribution'),
            },
            {
                'q': 'Which business processes can be automated using AI?',
                'a': (
                    'Processes with high volume, unstructured input and a clear definition of a '
                    'correct outcome. Common examples are enquiry handling, quotation '
                    'preparation, invoice processing, purchase order handling, supplier document '
                    'collection and routine customer communication.'
                ),
                'more': (
                    'Processes that depend mainly on negotiation, relationship judgement or '
                    'creative decisions are better supported than automated. A useful test is '
                    'whether two experienced people would agree on what a correct output looks '
                    'like; if they would not, the process needs defining before it can be automated.'
                ),
                'link': ('Business process automation', '/business-process-automation'),
            },
        ],
    },
    {
        'group': 'Cost, timelines and getting started',
        'faqs': [
            {
                'q': 'How much does AI automation cost?',
                'a': (
                    'Cost depends on process complexity, the number of system integrations and '
                    'the level of human review required. Humisense scopes projects in phases so '
                    'a first production automation can be delivered and evaluated before '
                    'committing to a wider programme.'
                ),
                'more': (
                    'A useful way to frame the decision is to compare the implementation cost '
                    'with the annual cost of the hours currently spent on the process, and with '
                    'the revenue effect of faster response. We give a written scope with '
                    'deliverables before starting, and we do not publish projected ROI figures '
                    'before measuring your actual process.'
                ),
                'link': ('Contact Humisense', '/contact'),
            },
            {
                'q': 'How long does an AI automation project take?',
                'a': (
                    'A single well-scoped process with available system access usually moves '
                    'from mapping to a shadow run in weeks, then to production after the shadow '
                    'period proves accuracy. Larger end-to-end programmes are delivered in '
                    'phases, each producing a working improvement.'
                ),
                'more': (
                    'The most common cause of delay is system access, not model work. API keys, '
                    'service accounts and firewall rules should be requested during design '
                    'rather than after it.'
                ),
                'link': ('How to implement AI automation in an existing business', '/blog/how-to-implement-ai-automation-in-an-existing-business'),
            },
            {
                'q': 'How can a business start implementing AI?',
                'a': (
                    'Start with one process that is high volume, clearly defined and currently a '
                    'bottleneck. Document how it works today, measure the baseline, and automate '
                    'that single process to production standard. Success there creates the '
                    'pattern, the data and the internal confidence for the next one.'
                ),
                'more': (
                    'A readiness check helps: is the process high volume, is the correct output '
                    'agreed, is the input available, and is the data accessible? If any answer '
                    'is no, resolve that before building.'
                ),
                'link': ('AI consulting and implementation', '/ai-consulting'),
            },
            {
                'q': 'Do we need to replace our ERP or CRM to use AI automation?',
                'a': (
                    'No. Humisense builds around existing systems, integrating through APIs, '
                    'database access, file exchange or email. Replacement is only recommended '
                    'when a system genuinely prevents the process from working.'
                ),
                'more': (
                    'Where a system has no usable API, we agree the safest supported integration '
                    'route with your IT team rather than relying on fragile screen automation.'
                ),
                'link': ('AI automation services', '/ai-automation'),
            },
            {
                'q': 'Do you work with businesses outside your home country?',
                'a': (
                    'Yes. Humisense works with clients internationally and delivers projects '
                    'remotely, with system access arranged through your own infrastructure or an '
                    'agreed cloud environment. We do not require a local office in your country.'
                ),
                'more': (
                    'Delivery is remote-first, with working sessions scheduled to overlap with '
                    'your business hours. Documentation, review queues and monitoring are '
                    'designed so your team can operate the system without us being in the same '
                    'time zone.'
                ),
                'link': ('Contact Humisense', '/contact'),
            },
        ],
    },
]

ALL_FAQS = [faq for group in FAQ_GROUPS for faq in group['faqs']]
