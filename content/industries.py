"""Industry solution page content.

Each industry page carries genuinely distinct copy: the processes, documents and
commercial pressures differ by sector, so no text is shared between pages.
"""

INDUSTRIES = [
    {
        'slug': 'manufacturing',
        'title': 'AI Automation for Manufacturing Companies | Humisense',
        'description': (
            'AI automation for manufacturers: RFQ and quotation handling, purchase order '
            'processing, supplier communication, quality documents and operational '
            'reporting.'
        ),
        'h1': 'AI Automation for Manufacturing Companies',
        'eyebrow': 'Manufacturing',
        'answer': (
            'Manufacturers run on documents and coordination: customer specifications, '
            'purchase orders, supplier acknowledgements, inspection records and delivery '
            'paperwork. AI automation reduces the manual effort of moving that information '
            'between customers, planning, production and suppliers.'
        ),
        'summary': (
            'Production scheduling and machine control are usually already systemised. The '
            'manual work sits around them, in commercial and supply chain administration.'
        ),
        'challenges': [
            'Customer specifications arrive in inconsistent formats and must be interpreted '
            'before a quote can be prepared.',
            'Purchase orders and order changes are re-keyed into the ERP, creating mismatches.',
            'Supplier confirmations and delivery notes are reconciled by hand.',
            'Quality documentation is assembled from several sources for each shipment.',
            'Production reporting is compiled in spreadsheets that nobody fully trusts.',
        ],
        'solutions': [
            {
                'title': 'Specification intake and quoting',
                'text': 'Customer drawings, specification sheets and enquiry emails are parsed '
                        'into structured requirements, checked against standard capability '
                        'ranges, and turned into a draft quotation for engineering review.',
            },
            {
                'title': 'Purchase order processing',
                'text': 'Incoming purchase orders are captured, validated against the sales '
                        'order and written into the ERP with mismatches flagged before '
                        'production starts.',
            },
            {
                'title': 'Supplier communication',
                'text': 'Order acknowledgements, delivery confirmations and price updates are '
                        'read from supplier emails and documents, then reconciled against open '
                        'purchase orders.',
            },
            {
                'title': 'Quality documentation',
                'text': 'Inspection certificates, material certificates and test reports are '
                        'collected, checked for completeness and attached to the correct '
                        'production or shipment record.',
            },
            {
                'title': 'Operational reporting',
                'text': 'Production, on-time delivery, quality and supplier performance '
                        'reports are assembled from system data on schedule, with anomalies '
                        'highlighted rather than buried.',
            },
        ],
        'capabilities': [
            'Technical specification extraction from PDFs and drawings metadata',
            'RFQ parsing and quotation drafting',
            'Purchase order and order change capture',
            'Supplier acknowledgement reconciliation',
            'Quality and compliance document collection',
            'Production reporting automation',
            'ERP integration through API or supported import',
            'Exception queues for engineering and planning review',
        ],
        'outcomes': [
            'Quotation preparation stops blocking on manual document reading',
            'Order entry errors are caught before they reach production',
            'Supplier discrepancies surface during procurement, not at goods receipt',
            'Quality documentation is complete at dispatch rather than chased afterwards',
            'Management reporting reflects the current state of operations',
        ],
        'faqs': [
            {
                'q': 'How can manufacturers use AI automation?',
                'a': 'The most common starting points are specification and RFQ intake, '
                     'purchase order processing, supplier document reconciliation and quality '
                     'documentation. These are high-volume, document-heavy processes where '
                     'manual handling creates delay and error, and where the correct output '
                     'is well defined enough to measure accuracy.',
            },
            {
                'q': 'Can AI read technical drawings?',
                'a': 'AI can read text, tables and title-block metadata from drawings and '
                     'specification documents. It cannot reliably interpret every geometric '
                     'detail or tolerance decision. Our designs use AI for the document layer '
                     'and keep engineering judgement with engineers.',
            },
            {
                'q': 'Will this integrate with our ERP?',
                'a': 'Yes, through the ERP vendor API or a supported import interface. Where '
                     'the ERP has no usable API, we agree the safest supported integration '
                     'route with your IT team before building.',
            },
            {
                'q': 'Do we need to replace our existing systems?',
                'a': 'No. Manufacturing automation projects almost always work around the '
                     'existing ERP and planning systems. Replacement is only recommended when '
                     'a system genuinely prevents the process from working.',
            },
        ],
        'related_services': [
            ('RFQ automation', '/rfq-automation'),
            ('Quotation automation', '/quotation-automation'),
            ('Intelligent document processing', '/document-automation'),
            ('Business process automation', '/business-process-automation'),
        ],
    },
    {
        'slug': 'industrial-distribution',
        'title': 'AI Automation for Industrial Distributors | Humisense',
        'description': (
            'AI automation for industrial distributors: RFQ processing, multi-supplier '
            'quotation comparison, product matching, quotation preparation and sales '
            'follow-up.'
        ),
        'h1': 'AI Automation for Industrial Distributors',
        'eyebrow': 'Industrial Distribution',
        'answer': (
            'Industrial distributors compete on response speed, availability accuracy and '
            'pricing confidence. AI automation shortens the path from customer enquiry to '
            'priced quotation by parsing requests, matching parts to the catalogue and '
            'assembling the quote for review.'
        ),
        'summary': (
            'Distribution is an information business wrapped around logistics. The '
            'bottleneck is rarely the warehouse; it is the quote desk and the follow-up.'
        ),
        'challenges': [
            'Customer RFQs arrive as PDFs, spreadsheets, photos of handwritten lists and '
            'portal exports.',
            'Part numbers are written in inconsistent formats and often describe equivalents '
            'rather than exact catalogue items.',
            'Pricing depends on supplier cost, customer agreement and current stock position.',
            'Quotation turnaround directly affects win rate, but capacity is limited.',
            'Follow-up on quoted opportunities is inconsistent across the sales team.',
        ],
        'solutions': [
            {
                'title': 'Customer RFQ processing',
                'text': 'Every incoming request is captured from all channels, parsed into line '
                        'items and checked for missing quantities or unclear specifications '
                        'before any pricing work begins.',
            },
            {
                'title': 'Product and specification matching',
                'text': 'Requested items are matched to catalogue records using part numbers, '
                        'descriptions and specification attributes, with substitution '
                        'candidates surfaced for review.',
            },
            {
                'title': 'Multi-supplier quotation comparison',
                'text': 'Supplier responses are collected and normalised into a comparable '
                        'view of price, lead time, minimum order quantity and validity.',
            },
            {
                'title': 'Automated quotation preparation',
                'text': 'Quotations are generated from the matched items and applicable '
                        'pricing, then routed for approval according to discount thresholds.',
            },
            {
                'title': 'Sales follow-up and pipeline',
                'text': 'Each quotation creates tracked follow-up tasks and status records, so '
                        'opportunities are not lost to silence.',
            },
        ],
        'capabilities': [
            'Multi-channel RFQ intake and parsing',
            'Catalogue and part number matching',
            'Substitution and equivalent identification',
            'Supplier response normalisation',
            'Pricing and margin calculation',
            'Quotation document generation',
            'Follow-up scheduling and tracking',
            'Win/loss analysis by customer and category',
        ],
        'outcomes': [
            'Quotation turnaround improves without adding quote desk staff',
            'Fewer errors from manual part number entry',
            'Substitutions are proposed consistently rather than depending on who answers',
            'Supplier comparison is structured instead of reconstructed from emails',
            'Follow-up happens systematically, so fewer opportunities go quiet',
        ],
        'faqs': [
            {
                'q': 'How can industrial distributors automate their sales processes?',
                'a': 'The highest-value starting point is usually the quote desk: parsing '
                     'incoming RFQs, matching items to the catalogue and assembling quotations. '
                     'That work is repetitive, document-driven and directly tied to win rate. '
                     'Follow-up automation and pipeline tracking usually come next.',
            },
            {
                'q': 'Can AI match part numbers and equivalents?',
                'a': 'It can match part numbers exactly where formats are consistent, and it '
                     'can suggest candidate matches where descriptions, attributes or known '
                     'equivalents are available. Suggested matches above a confidence '
                     'threshold can be applied automatically; the rest go to a reviewer, '
                     'because an incorrect substitution is a commercial risk.',
            },
            {
                'q': 'Our catalogue is messy. Is that a blocker?',
                'a': 'It is a constraint, not a blocker. We start by measuring catalogue '
                     'quality, then either clean the subset used by the process or build '
                     'matching that tolerates the current state. Cleaning the entire catalogue '
                     'before starting is usually unnecessary.',
            },
            {
                'q': 'Does this work with our ERP and supplier portals?',
                'a': 'Yes, within the limits of what those systems expose. ERP data is read '
                     'through API or a supported interface. Supplier portals vary; where no '
                     'API exists we use exports, emails or supported integrations rather than '
                     'fragile screen automation.',
            },
        ],
        'related_services': [
            ('RFQ automation', '/rfq-automation'),
            ('Quotation automation', '/quotation-automation'),
            ('Sales automation', '/sales-automation'),
            ('AI agents', '/ai-agents'),
        ],
    },
    {
        'slug': 'wholesale',
        'title': 'AI Automation for Wholesale & B2B Businesses | Humisense',
        'description': (
            'AI automation for wholesale and B2B operations: customer enquiry handling, '
            'quotation management, order administration and customer communication.'
        ),
        'h1': 'AI Automation for Wholesale and B2B Businesses',
        'eyebrow': 'Wholesale & B2B',
        'answer': (
            'Wholesale businesses handle a high volume of similar but not identical '
            'transactions: enquiries, price requests, order confirmations and customer '
            'queries. AI automation standardises that handling so response times and '
            'accuracy stop depending on individual workload.'
        ),
        'summary': (
            'The pattern is familiar: thin margins, high transaction volume and '
            'administration that scales with revenue instead of shrinking as a percentage of it.'
        ),
        'challenges': [
            'Enquiries and orders arrive by email, phone and marketplace in inconsistent formats.',
            'Customer-specific pricing and terms are tracked informally.',
            'Order administration involves re-keying between email, spreadsheet and ERP.',
            'Customer queries about availability and delivery status interrupt operational work.',
            'Seasonal peaks require temporary staff who take time to become productive.',
        ],
        'solutions': [
            {
                'title': 'Enquiry handling',
                'text': 'Customer enquiries are captured from every channel, classified by '
                        'intent and routed with the customer history attached.',
            },
            {
                'title': 'Quotation management',
                'text': 'Quotations are generated from the customer price agreement and '
                        'catalogue data, with approval routing for anything outside standard terms.',
            },
            {
                'title': 'Order administration',
                'text': 'Order emails and attachments are converted into structured order '
                        'records and validated against stock and credit status before entry.',
            },
            {
                'title': 'Customer communication',
                'text': 'Routine availability, dispatch and documentation queries are answered '
                        'from live system data, with anything unusual escalated to a person.',
            },
        ],
        'capabilities': [
            'Multi-channel enquiry capture',
            'Customer-specific pricing application',
            'Order intake from email and attachments',
            'Stock and credit validation before order entry',
            'Automated order acknowledgement',
            'Routine query response with escalation',
            'Backorder and dispatch notification',
            'Volume and margin reporting',
        ],
        'outcomes': [
            'Response times hold steady during peak periods',
            'Customer pricing is applied consistently',
            'Order entry errors decrease because validation happens before submission',
            'Routine queries are answered without interrupting operational staff',
            'Seasonal onboarding time for temporary staff reduces',
        ],
        'faqs': [
            {
                'q': 'Which wholesale processes give the fastest return?',
                'a': 'Order intake and enquiry handling usually produce the earliest visible '
                     'improvement because they are high volume, repetitive and directly '
                     'visible to customers. Quotation automation follows where quoting is a '
                     'significant part of the sales cycle.',
            },
            {
                'q': 'Can AI handle customer-specific pricing?',
                'a': 'Yes, provided the agreements exist in a usable form. Pricing rules are '
                     'encoded from your price lists, customer agreements and discount '
                     'structures. Where agreements exist only in individual memory, the '
                     'first task is documenting them.',
            },
            {
                'q': 'Will this work across multiple sales channels?',
                'a': 'Yes. Email, web forms, marketplace exports and portal orders can be '
                     'normalised into one intake process, which is often the main benefit for '
                     'businesses selling through several channels.',
            },
            {
                'q': 'How does this affect our customer relationships?',
                'a': 'The intention is to make routine interactions faster and more accurate. '
                     'Commercially sensitive conversations, negotiation and complaints remain '
                     'with people. Where a response is automated, it is clearly identifiable '
                     'and easy to escalate.',
            },
        ],
        'related_services': [
            ('Sales automation', '/sales-automation'),
            ('Quotation automation', '/quotation-automation'),
            ('Intelligent document processing', '/document-automation'),
            ('AI workflow automation', '/ai-workflow-automation'),
        ],
    },
    {
        'slug': 'b2b-businesses',
        'title': 'AI Automation for B2B Businesses | Humisense',
        'description': (
            'AI automation for B2B companies: lead qualification, enquiry response, proposal '
            'preparation and internal handover, built around your existing sales process.'
        ),
        'h1': 'AI Automation for B2B Businesses',
        'eyebrow': 'B2B',
        'answer': (
            'B2B sales cycles involve multiple documents, several stakeholders and long gaps '
            'between contact points. AI automation keeps the process moving by handling '
            'research, qualification, document preparation and follow-up so that the human '
            'conversation happens at the right moment.'
        ),
        'summary': (
            'Designed for businesses selling considered purchases where the enquiry is '
            'valuable, the cycle is long and the administrative overhead per deal is high.'
        ),
        'challenges': [
            'Enquiries are mixed in quality and qualification is done inconsistently.',
            'Proposal and document preparation consumes senior time.',
            'Long sales cycles lose momentum because follow-up depends on memory.',
            'Handover from sales to delivery loses commitments made during the sale.',
            'Pipeline reporting is a manual exercise and often out of date.',
        ],
        'solutions': [
            {
                'title': 'Lead qualification',
                'text': 'Incoming enquiries are assessed against explicit criteria, enriched '
                        'with company data and routed to the right owner with a summary.',
            },
            {
                'title': 'Proposal preparation',
                'text': 'Proposals are assembled from a controlled template, approved rate '
                        'card and the structured brief, with scope and assumptions explicit.',
            },
            {
                'title': 'Follow-up management',
                'text': 'Each stage transition creates the next action and surfaces deals that '
                        'have gone quiet.',
            },
            {
                'title': 'Sales to delivery handover',
                'text': 'A structured handover record captures scope, commitments and '
                        'documentation so delivery starts from the same information.',
            },
        ],
        'capabilities': [
            'Enquiry capture and enrichment',
            'Criteria-based qualification and routing',
            'Proposal and document assembly',
            'Follow-up and stage management',
            'CRM data completion',
            'Meeting notes to structured summary',
            'Handover documentation',
            'Pipeline and conversion reporting',
        ],
        'outcomes': [
            'Senior time shifts from document assembly to client conversation',
            'Qualification criteria are applied consistently across the team',
            'Fewer deals stall without a follow-up',
            'Delivery starts with accurate scope information',
            'Reporting reflects the live pipeline',
        ],
        'faqs': [
            {
                'q': 'Is AI useful in a relationship-driven sales process?',
                'a': 'It is useful in the work around the relationship: research, document '
                     'preparation, follow-up scheduling and record keeping. The relationship '
                     'itself stays with your people. Most B2B teams find the administrative '
                     'load is the larger constraint.',
            },
            {
                'q': 'How do you qualify leads without enough historical data?',
                'a': 'We start from criteria your team already applies informally, such as '
                     'sector, size, requirement clarity and budget authority, and encode them '
                     'explicitly. Once outcomes accumulate, the criteria can be reviewed '
                     'against actual results.',
            },
            {
                'q': 'Can it produce proposals in our format?',
                'a': 'Yes. Proposals are generated from your template with content drawn from '
                     'the structured brief and approved material. A person reviews and '
                     'finalises before anything is sent.',
            },
            {
                'q': 'What if our process differs by region?',
                'a': 'Routing rules, templates and languages can be configured per region or '
                     'business unit while sharing the same underlying system, so reporting '
                     'stays comparable.',
            },
        ],
        'related_services': [
            ('Lead generation automation', '/lead-generation-automation'),
            ('Sales automation', '/sales-automation'),
            ('AI agents', '/ai-agents'),
            ('AI consulting and implementation', '/ai-consulting'),
        ],
    },
    {
        'slug': 'professional-services',
        'title': 'AI Automation for Professional Services Firms | Humisense',
        'description': (
            'AI automation for professional services: document review, client onboarding, '
            'proposal generation, knowledge retrieval and reporting, implemented by Humisense.'
        ),
        'h1': 'AI Automation for Professional Services',
        'eyebrow': 'Professional Services',
        'answer': (
            'Professional services firms sell expertise, and much of that expertise is spent '
            'on document work, research and administration. AI automation reduces the '
            'non-billable effort around the work so that senior time goes to judgement.'
        ),
        'summary': (
            'The aim is not to automate professional judgement. It is to remove the reading, '
            'summarising, formatting and chasing that surrounds it.'
        ),
        'challenges': [
            'Client documents must be read and summarised before any advice can begin.',
            'Onboarding requires the same information collected repeatedly in different formats.',
            'Proposals and engagement letters are assembled from fragments of past work.',
            'Knowledge is distributed across mailboxes and personal drives.',
            'Reporting to clients is a manual assembly exercise each period.',
        ],
        'solutions': [
            {
                'title': 'Document review and summarisation',
                'text': 'Long documents are split, summarised and searched against specific '
                        'questions, with source references retained so the reviewer can verify.',
            },
            {
                'title': 'Client onboarding',
                'text': 'Required information and documents are collected through a structured '
                        'process, checked for completeness and filed against the client record.',
            },
            {
                'title': 'Proposal and engagement assembly',
                'text': 'Proposals are generated from approved templates, rate cards and scope '
                        'inputs, with assumptions stated explicitly.',
            },
            {
                'title': 'Knowledge retrieval',
                'text': 'Internal precedent, policy and methodology are searchable, and answers '
                        'link to the source document rather than presenting unsupported claims.',
            },
            {
                'title': 'Client reporting',
                'text': 'Recurring reports are assembled from engagement data and delivered on '
                        'schedule with commentary prompts for the account lead.',
            },
        ],
        'capabilities': [
            'Document summarisation with source references',
            'Clause and obligation extraction',
            'Structured client onboarding',
            'Proposal and engagement letter generation',
            'Internal knowledge search',
            'Time and activity summary preparation',
            'Recurring client report assembly',
            'Confidentiality-aware deployment options',
        ],
        'outcomes': [
            'Review time on long documents reduces and references stay verifiable',
            'Onboarding becomes consistent rather than dependent on the engagement manager',
            'Proposal preparation takes less senior time',
            'Internal knowledge is actually findable',
            'Client reporting stops consuming the first week of every month',
        ],
        'faqs': [
            {
                'q': 'Is client confidentiality a problem?',
                'a': 'It has to be designed for. Deployment can run inside your own cloud '
                     'tenant or on-premise, with model providers that do not retain input '
                     'data. Which option is appropriate depends on your obligations and your '
                     'clients\u2019 terms, and we will not proceed on an assumption.',
            },
            {
                'q': 'Can AI summarise accurately enough to rely on?',
                'a': 'Summaries are useful for orientation and triage, not as a substitute for '
                     'reading something that matters. Our designs always keep a link to the '
                     'source passage so a professional can verify the summary before relying '
                     'on it.',
            },
            {
                'q': 'Will this reduce billable hours?',
                'a': 'It reduces non-billable and low-value effort. How that affects revenue '
                     'depends on your commercial model. Firms typically redirect the time to '
                     'more valuable work or to capacity they previously could not take on.',
            },
            {
                'q': 'Do we need to change our practice management system?',
                'a': 'No. The automation integrates with your existing systems for client '
                     'records, documents and time capture. Replacement is not required.',
            },
        ],
        'related_services': [
            ('Intelligent document processing', '/document-automation'),
            ('AI agents', '/ai-agents'),
            ('AI consulting and implementation', '/ai-consulting'),
            ('Business process automation', '/business-process-automation'),
        ],
    },
    {
        'slug': 'small-businesses',
        'title': 'AI Automation for Small Businesses | Humisense',
        'description': (
            'Practical AI automation for small businesses: enquiry response, quotation '
            'preparation, invoice processing and reporting, scoped to fit limited budgets.'
        ),
        'h1': 'AI Automation for Small Businesses',
        'eyebrow': 'Small Business',
        'answer': (
            'For a small business, automation is about removing the work that consumes the '
            'owner\u2019s evening: answering routine enquiries, preparing quotes, chasing '
            'invoices and compiling reports. AI automation can handle a meaningful share of '
            'that without an enterprise budget.'
        ),
        'summary': (
            'Scoped deliberately small: one process, one measurable improvement, no platform '
            'migration and no long implementation programme.'
        ),
        'challenges': [
            'The same few people handle sales, operations and administration.',
            'Quotes and enquiries wait until there is time to deal with them.',
            'Administration happens outside working hours.',
            'Software is chosen for cost, so integrations are limited.',
            'Growth means hiring before revenue justifies it.',
        ],
        'solutions': [
            {
                'title': 'Enquiry response',
                'text': 'Routine enquiries receive an accurate, immediate acknowledgement with '
                        'the right information, and anything complex is flagged for the owner.',
            },
            {
                'title': 'Quotation preparation',
                'text': 'Standard quotes are generated from a price list and a short brief, '
                        'removing the copy-and-edit cycle.',
            },
            {
                'title': 'Invoice and receipt capture',
                'text': 'Supplier invoices and receipts are captured into structured records '
                        'ready for the bookkeeping process.',
            },
            {
                'title': 'Simple reporting',
                'text': 'A weekly summary of enquiries, quotes, orders and outstanding items is '
                        'delivered automatically.',
            },
        ],
        'capabilities': [
            'Enquiry acknowledgement and routing',
            'Standard quotation generation',
            'Invoice and receipt data capture',
            'Follow-up reminders',
            'Simple operational dashboards',
            'Email and spreadsheet integration',
            'Low-cost deployment options',
            'Incremental expansion as volume grows',
        ],
        'outcomes': [
            'Enquiries get a response the same day, even during busy periods',
            'Quoting stops consuming evenings',
            'Bookkeeping preparation takes less time',
            'The owner has a clear weekly view of the pipeline',
            'Growth does not immediately require an administrative hire',
        ],
        'faqs': [
            {
                'q': 'Is AI automation realistic on a small budget?',
                'a': 'Yes, if the scope is narrow. Automating one process end to end is '
                     'usually affordable and produces a measurable result. The mistake is '
                     'attempting a broad transformation with a small budget, which produces '
                     'several half-finished projects.',
            },
            {
                'q': 'Which process should a small business automate first?',
                'a': 'The one that costs the most time each week and has a clear correct '
                     'outcome. For most small businesses that is enquiry handling or quotation '
                     'preparation, because both directly affect revenue and both are repetitive.',
            },
            {
                'q': 'Do we need technical staff to run it?',
                'a': 'No. The system is delivered as a running service with monitoring and '
                     'documentation. You need someone who can review outputs and escalate '
                     'exceptions, not someone who can write code.',
            },
            {
                'q': 'What happens as we grow?',
                'a': 'The automation is built to expand: additional document types, more '
                     'channels or extra approval rules can be added without rebuilding what '
                     'already works.',
            },
        ],
        'related_services': [
            ('AI automation services', '/ai-automation'),
            ('Quotation automation', '/quotation-automation'),
            ('Intelligent document processing', '/document-automation'),
            ('AI consulting and implementation', '/ai-consulting'),
        ],
    },
]

INDUSTRIES_BY_SLUG = {industry['slug']: industry for industry in INDUSTRIES}
