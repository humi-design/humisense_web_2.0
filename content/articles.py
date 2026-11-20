"""Blog articles.

Articles are stored as structured blocks so the template can render semantic
HTML (h2/h3/p/ul/table/callout) and build Article JSON-LD from the same data.
"""

ARTICLES = [
    {
        'slug': 'how-ai-automation-helps-manufacturing-reduce-manual-work',
        'title': 'How AI Automation Helps Manufacturing Companies Reduce Manual Work',
        'description': (
            'Where manual work actually accumulates in a manufacturing business, and how '
            'document-driven automation reduces it without disrupting production systems.'
        ),
        'h1': 'How AI Automation Helps Manufacturing Companies Reduce Manual Work',
        'category': 'Manufacturing',
        'published': '2026-02-10',
        'updated': '2026-02-10',
        'reading_time': 9,
        'keywords': ['manufacturing automation', 'AI automation', 'document processing'],
        'intro': (
            'Ask a manufacturing operations manager where the manual work is and the answer '
            'is rarely "on the shop floor". It is in the commercial and supply chain '
            'administration that surrounds production: reading customer specifications, '
            're-keying purchase orders, reconciling supplier confirmations, assembling '
            'quality documentation and compiling reports.'
        ),
        'blocks': [
            ('h2', 'Why manufacturing administration resists ordinary automation'),
            ('p', 'Manufacturing systems are usually mature. ERP, MRP and planning tools have '
                  'been in place for years and they handle structured data well. The problem '
                  'is that a large share of the information entering those systems does not '
                  'arrive structured. It arrives as a customer PDF, a specification sheet, a '
                  'supplier email or a scanned delivery note.'),
            ('p', 'Rules-based automation can move structured data between systems. It cannot '
                  'reliably interpret a document whose layout changes between customers. That '
                  'is the gap AI automation fills, and it is why manufacturing is one of the '
                  'sectors where the approach produces the clearest early results.'),
            ('h2', 'The five processes that usually hold the most manual work'),
            ('h3', '1. Customer specification and RFQ intake'),
            ('p', 'Enquiries arrive with drawings, specification tables, quantities and '
                  'delivery requirements, each customer using their own format. Someone reads '
                  'the request, extracts the details and transcribes them into a quotation '
                  'template. This is slow, and transcription errors surface later as '
                  'production problems.'),
            ('p', 'Document understanding models can extract line items, quantities, '
                  'tolerances and delivery terms into a structured record. The engineering '
                  'judgement about feasibility stays with engineers; the transcription does not.'),
            ('h3', '2. Purchase order processing'),
            ('p', 'Customer purchase orders arrive as PDFs and are entered into the ERP by '
                  'hand. Order changes are worse, because the original record must be found '
                  'and updated rather than simply created. Validating the order against the '
                  'sales record before entry catches quantity and price mismatches while they '
                  'are still cheap to fix.'),
            ('h3', '3. Supplier acknowledgement reconciliation'),
            ('p', 'A purchase order goes out and a confirmation comes back, usually as an '
                  'email with a PDF attached. Somewhere a person compares the confirmed price, '
                  'quantity and delivery date against what was ordered. When this is done late, '
                  'discrepancies are discovered at goods receipt, which is the most expensive '
                  'moment to find them.'),
            ('h3', '4. Quality and compliance documentation'),
            ('p', 'Inspection certificates, material certificates, test reports and '
                  'declarations must be collected, checked for completeness and attached to the '
                  'correct production or shipment record. The work is not difficult, but it is '
                  'time-sensitive and easy to postpone until dispatch day, when it becomes urgent.'),
            ('h3', '5. Operational reporting'),
            ('p', 'On-time delivery, quality, supplier performance and production output are '
                  'usually compiled in spreadsheets from several system exports. The result is '
                  'a report that is already out of date when it is published, and whose '
                  'definitions differ between departments.'),
            ('h2', 'A realistic implementation sequence'),
            ('p', 'Attempting all five at once is the standard failure pattern. A workable '
                  'sequence looks like this:'),
            ('ul', [
                'Pick one document type with high volume and a clear downstream use, such as '
                'customer purchase orders.',
                'Measure the baseline: how many arrive per week, how long entry takes, how '
                'often errors are found and what they cost to correct.',
                'Build the extraction and validation for that document type only, with a '
                'review queue for low-confidence fields.',
                'Run it alongside manual processing until accuracy is demonstrated on real '
                'documents.',
                'Reuse the integration and review patterns for the next document type.',
            ]),
            ('p', 'The second process is typically faster to deliver than the first because '
                  'the integration work, logging and review interface already exist.'),
            ('h2', 'What AI should not be trusted with in a manufacturing context'),
            ('p', 'AI is a poor fit for decisions with safety, tolerance or contractual '
                  'consequences. It should not approve a substitution, confirm a material '
                  'grade or release a deviation. These decisions belong to qualified people. '
                  'The automation\u2019s job is to put the right information in front of that '
                  'person quickly, with the source document attached.'),
            ('callout', 'A useful rule: automate the reading, the checking and the routing. '
                        'Keep the sign-off with a person whose name is on the record.'),
            ('h2', 'How to judge whether it worked'),
            ('p', 'Before starting, agree the measurements. Typical ones are documents '
                  'processed per hour, order entry error rate, quotation turnaround time and '
                  'hours spent per shipment on documentation. If those numbers are not '
                  'measured before the project, any claim about improvement afterwards is '
                  'opinion rather than evidence.'),
            ('p', 'Humisense implements manufacturing automation around existing ERP systems. '
                  'If you have a document process that consumes more time than it should, '
                  'the manufacturing solutions page describes the typical starting points.'),
        ],
        'related_services': [
            ('AI automation for manufacturing', '/industries/manufacturing'),
            ('Intelligent document processing', '/document-automation'),
            ('RFQ automation', '/rfq-automation'),
        ],
        'related_articles': [
            'what-is-rfq-automation-and-how-does-it-work',
            'how-ai-extracts-data-from-pdf-and-excel-documents',
        ],
    },
    {
        'slug': 'what-is-rfq-automation-and-how-does-it-work',
        'title': 'What Is RFQ Automation and How Does It Work?',
        'description': (
            'A practical explanation of RFQ automation: what it handles, how the extraction '
            'pipeline works, where accuracy limits appear and how to evaluate it.'
        ),
        'h1': 'What Is RFQ Automation and How Does It Work?',
        'category': 'RFQ & Quotation',
        'published': '2026-02-17',
        'updated': '2026-02-17',
        'reading_time': 8,
        'keywords': ['RFQ automation', 'request for quotation', 'AI procurement'],
        'intro': (
            'RFQ automation is the automated capture and structuring of requests for '
            'quotation. Instead of a person reading each request and typing the details into '
            'a pricing tool, software reads the request, extracts the commercial and '
            'technical details, and produces a structured record that can be priced, compared '
            'and tracked.'
        ),
        'blocks': [
            ('h2', 'What an RFQ actually contains'),
            ('p', 'A request for quotation is rarely a single clean table. A typical '
                  'industrial RFQ includes a covering email, one or more attached documents, '
                  'a line-item table that may be a PDF table or an Excel sheet, technical '
                  'specifications, delivery requirements, commercial terms and often '
                  'footnotes that change the meaning of the main table.'),
            ('p', 'That mixture is the reason RFQ automation is not simply a form. The system '
                  'has to work out which parts of the request carry the data and which carry '
                  'the conditions.'),
            ('h2', 'The five stages of an RFQ automation pipeline'),
            ('h3', 'Stage 1: Intake'),
            ('p', 'Requests are collected from every channel you actually use: a shared '
                  'mailbox, a web form, a customer portal export, a supplier platform or an '
                  'API. Intake also records metadata that matters later, such as arrival time, '
                  'sender and attachments, because response-time measurement depends on it.'),
            ('h3', 'Stage 2: Classification and splitting'),
            ('p', 'The system determines what kind of request it is and separates the parts. '
                  'A single email may contain three separate RFQs for different projects, or '
                  'an RFQ plus an unrelated question. Splitting them correctly prevents one '
                  'request from being priced against another.'),
            ('h3', 'Stage 3: Extraction'),
            ('p', 'This is the core step. Layout-aware document models read tables, line items, '
                  'quantities, units, part numbers, descriptions and delivery dates. For scans, '
                  'OCR runs first. For spreadsheets, the structure is read directly. Each '
                  'extracted field carries a confidence score.'),
            ('h3', 'Stage 4: Normalisation and matching'),
            ('p', 'Extracted text is not yet usable data. "M8 x 40 SS316" and "M8x40 stainless '
                  '316" describe the same item. Matching maps requested items to your '
                  'catalogue using part numbers, descriptions and attributes, and surfaces '
                  'substitution candidates where an exact match does not exist.'),
            ('h3', 'Stage 5: Completeness checks and handoff'),
            ('p', 'Before pricing begins, the system checks whether anything essential is '
                  'missing: a quantity with no unit, a part number with no description, a '
                  'delivery date in the past. Incomplete requests are routed back for '
                  'clarification or flagged, rather than being priced on assumptions. Complete '
                  'requests become structured records ready for quotation.'),
            ('h2', 'Where accuracy actually breaks down'),
            ('p', 'Extraction accuracy is not a single number. It varies by document type, '
                  'scan quality and layout consistency. The realistic position is:'),
            ('ul', [
                'Standardised, text-based documents from repeat customers extract well.',
                'Scanned documents extract acceptably when the scan is clean and the layout '
                'is consistent.',
                'Photographs of handwritten lists and unusual layouts produce lower accuracy '
                'and should route to review.',
                'Specifications that depend on interpreting drawings need human confirmation.',
            ]),
            ('callout', 'Any credible RFQ automation includes a confidence threshold and a '
                        'review queue. A system that claims to handle every document without '
                        'review is describing a demo, not a production process.'),
            ('h2', 'What to measure when evaluating RFQ automation'),
            ('ul', [
                'Field-level extraction accuracy on your own documents, not a vendor sample set.',
                'Percentage of requests requiring human correction, and how long correction takes.',
                'Time from receipt to a priced quotation before and after.',
                'Volume handled per person per day.',
                'Rate of requests returned for missing information, and whether that is caught earlier.',
            ]),
            ('h2', 'Where it fits in the wider process'),
            ('p', 'RFQ automation produces the structured input for quotation automation. The '
                  'two are usually implemented together because the value comes from the whole '
                  'path: request received, understood, matched, priced and quoted. Automating '
                  'only the intake still leaves the manual bottleneck further downstream.'),
            ('p', 'Humisense builds RFQ automation for distributors, manufacturers and '
                  'wholesalers. The RFQ automation service page describes the approach in '
                  'more detail.'),
        ],
        'related_services': [
            ('RFQ automation', '/rfq-automation'),
            ('Quotation automation', '/quotation-automation'),
            ('AI automation for industrial distributors', '/industries/industrial-distribution'),
        ],
        'related_articles': [
            'how-to-automate-quotation-processing-using-ai',
            'how-ai-extracts-data-from-pdf-and-excel-documents',
        ],
    },
    {
        'slug': 'how-to-automate-quotation-processing-using-ai',
        'title': 'How to Automate Quotation Processing Using AI',
        'description': (
            'A step-by-step view of quotation automation: capturing pricing logic, generating '
            'documents, routing approvals and tracking outcomes without losing control.'
        ),
        'h1': 'How to Automate Quotation Processing Using AI',
        'category': 'RFQ & Quotation',
        'published': '2026-02-24',
        'updated': '2026-02-24',
        'reading_time': 8,
        'keywords': ['quotation automation', 'AI quoting', 'sales automation'],
        'intro': (
            'Quotation processing is one of the most repeated documents in a B2B business and '
            'one of the least standardised. The same company will produce quotations in three '
            'different layouts, with pricing derived from spreadsheets maintained by different '
            'people. Automating it is less about AI than about making the pricing logic '
            'explicit, then letting software apply it consistently.'
        ),
        'blocks': [
            ('h2', 'Start with the pricing logic, not the technology'),
            ('p', 'Before any automation is possible, the pricing rules have to exist in a '
                  'usable form. In most businesses they are partly documented and partly held '
                  'by experience. A workable capture looks like this:'),
            ('ul', [
                'List price source: catalogue, price list, ERP record or supplier cost plus margin.',
                'Customer-specific agreements: contracted discounts, negotiated rates, '
                'rebate structures.',
                'Volume and order-value discount bands, and who is allowed to approve them.',
                'Freight, packaging, tax and currency handling.',
                'Validity periods and what causes a quotation to expire.',
            ]),
            ('p', 'This exercise often produces value before any software is written, because '
                  'it exposes inconsistencies that were costing margin.'),
            ('h2', 'Generating the quotation document'),
            ('p', 'Once the logic exists, document generation is straightforward. The system '
                  'takes the structured request, applies the pricing rules, calculates totals '
                  'and renders the result into a controlled template. The important '
                  'design choices are:'),
            ('ul', [
                'The template is versioned, so a change can be reviewed rather than applied silently.',
                'Calculations are shown, not hidden, so a reviewer can verify line totals.',
                'Terms and conditions are included by rule, not by memory.',
                'Currency, unit of measure and tax treatment are explicit fields.',
            ]),
            ('h2', 'Where AI genuinely adds value'),
            ('p', 'AI is not needed to multiply quantity by price. It is useful in four places:'),
            ('h3', 'Interpreting descriptions'),
            ('p', 'When a customer asks for an item described in their own words rather than a '
                  'part number, a language model can map the description to catalogue '
                  'candidates and propose the closest matches.'),
            ('h3', 'Finding precedent'),
            ('p', 'For non-standard requests, the system can retrieve similar previous '
                  'quotations and show how they were priced, giving the estimator a starting '
                  'point instead of a blank page.'),
            ('h3', 'Drafting the covering message'),
            ('p', 'A short covering email that references the actual request reads better than '
                  'a generic template, and drafting it is exactly the kind of task a language '
                  'model does well.'),
            ('h3', 'Detecting anomalies'),
            ('p', 'If a line is priced 40 percent below the usual level for that customer and '
                  'product, the system can flag it before the quotation is sent. This catches '
                  'errors that manual review routinely misses.'),
            ('h2', 'Approval routing is the control point'),
            ('p', 'The commercial risk in quotation automation is not a wrong multiplication. '
                  'It is an unapproved discount or a non-standard term leaving the business. '
                  'Approval routing should be explicit:'),
            ('ul', [
                'Standard quotes within agreed parameters can be released automatically.',
                'Discounts beyond a threshold route to a named approver.',
                'New customers and non-standard payment terms always require approval.',
                'Every approval records who approved, when and on what basis.',
            ]),
            ('callout', 'Automation without an approval trail is a governance problem waiting '
                        'to happen. The trail is what makes faster quoting safe.'),
            ('h2', 'Tracking what happens after the quotation is sent'),
            ('p', 'A quotation that is never followed up is a wasted calculation. Each sent '
                  'quotation should create a follow-up task with a due date and a status. Over '
                  'time this produces something most businesses do not have: a reliable view '
                  'of quote volume, response time, win rate by customer and by category, and '
                  'the reasons quotations are lost.'),
            ('h2', 'A sensible implementation order'),
            ('ul', [
                'Document the pricing logic and standardise the template.',
                'Automate generation for standard catalogue quotes first.',
                'Add approval routing before enabling any automatic sending.',
                'Add AI assistance for description matching and precedent retrieval.',
                'Add follow-up tracking and win/loss reporting.',
            ]),
            ('p', 'Humisense implements quotation automation together with RFQ intake, because '
                  'the structured request is the input the quotation generator needs. See the '
                  'quotation automation service page for the implementation approach.'),
        ],
        'related_services': [
            ('Quotation automation', '/quotation-automation'),
            ('RFQ automation', '/rfq-automation'),
            ('Sales automation', '/sales-automation'),
        ],
        'related_articles': [
            'what-is-rfq-automation-and-how-does-it-work',
            'how-industrial-distributors-can-use-ai-to-automate-sales',
        ],
    },
    {
        'slug': 'ai-agents-vs-traditional-workflow-automation',
        'title': 'AI Agents vs Traditional Workflow Automation',
        'description': (
            'When to use a rules-based workflow, when to use an AI agent, and why most '
            'production systems need both rather than one or the other.'
        ),
        'h1': 'AI Agents vs Traditional Workflow Automation',
        'category': 'AI Agents',
        'published': '2026-03-03',
        'updated': '2026-03-03',
        'reading_time': 7,
        'keywords': ['AI agents', 'workflow automation', 'agentic AI'],
        'intro': (
            'The distinction is often presented as a choice: use an agent, or use workflow '
            'automation. In practice they solve different problems. Rules-based workflows are '
            'predictable and cheap; AI agents handle variation and judgement. Production '
            'systems usually need both.'
        ),
        'blocks': [
            ('h2', 'What traditional workflow automation does well'),
            ('p', 'A workflow automation executes a sequence you define in advance. If a '
                  'purchase order arrives, validate the supplier, check the amount against the '
                  'approval matrix, write the record and notify the buyer. The behaviour is '
                  'deterministic: the same input produces the same output, and you can reason '
                  'about it before it runs.'),
            ('p', 'This is a strength, not a limitation. Deterministic steps are cheap to run, '
                  'easy to test and simple to audit. Most of the value in business automation '
                  'comes from exactly these steps.'),
            ('h2', 'Where rules-based automation breaks'),
            ('p', 'It breaks when the input is not structured. A supplier sends an invoice in a '
                  'slightly different layout and the template fails. A customer writes an '
                  'enquiry in prose rather than filling in the form. A request needs to be '
                  'interpreted before it can be routed.'),
            ('p', 'Teams respond by adding rules to handle each variation. The rule set grows, '
                  'interacts unpredictably and becomes impossible to maintain. This is the '
                  'point at which an AI step is the right answer.'),
            ('h2', 'What an AI agent actually is'),
            ('p', 'An agent uses a language model to decide which action to take next, then '
                  'executes that action through tools you define. Given a task, it might look '
                  'up a customer record, check an order status, then draft a reply. The '
                  'sequence is decided at run time rather than hard-coded.'),
            ('p', 'The important design constraint is that the agent can only do what its '
                  'tools allow. A narrow tool set is what makes an agent predictable enough '
                  'to deploy.'),
            ('h2', 'A side-by-side comparison'),
            ('table', {
                'headers': ['Dimension', 'Workflow automation', 'AI agent'],
                'rows': [
                    ['Input', 'Structured data', 'Unstructured or variable content'],
                    ['Behaviour', 'Deterministic, defined in advance', 'Decided at run time'],
                    ['Cost per run', 'Low', 'Higher, because of model inference'],
                    ['Testing', 'Exhaustive test cases are feasible', 'Evaluation against real examples'],
                    ['Failure mode', 'Breaks visibly on unexpected input', 'May act incorrectly but plausibly'],
                    ['Best use', 'Validation, calculation, routing, system writes', 'Interpretation, matching, drafting, multi-step lookup'],
                ],
            }),
            ('h2', 'The hybrid pattern that actually ships'),
            ('p', 'The systems that work in production put the agent in a narrow slot inside a '
                  'deterministic frame:'),
            ('ul', [
                'A workflow receives the trigger and prepares the input.',
                'An AI step interprets the unstructured part: reads the document, classifies '
                'the enquiry, extracts the fields.',
                'The workflow validates the output against business rules and confidence thresholds.',
                'Deterministic code performs the calculations and system writes.',
                'Anything below threshold routes to a person with the source material attached.',
            ]),
            ('callout', 'An agent that can only call three narrowly scoped tools is far easier '
                        'to trust than one that can call thirty.'),
            ('h2', 'Questions worth asking before choosing'),
            ('ul', [
                'Is the input structured or does it vary?',
                'Is the correct output unambiguous, or does it require judgement?',
                'What is the cost of a wrong action, and can it be reversed?',
                'Can the step be tested against a fixed set of examples?',
                'Does the volume justify per-run inference cost?',
            ]),
            ('p', 'If the input is structured and the outcome is unambiguous, use a workflow. '
                  'If interpretation is required, add an AI step inside the workflow rather '
                  'than replacing the workflow with an agent.'),
            ('p', 'Humisense builds both, and the choice is made per process rather than per '
                  'company. See the AI agents and workflow automation service pages for the '
                  'implementation approach.'),
        ],
        'related_services': [
            ('Custom AI agent development', '/ai-agents'),
            ('AI workflow automation', '/ai-workflow-automation'),
            ('AI automation services', '/ai-automation'),
        ],
        'related_articles': [
            'building-an-ai-powered-business-workflow',
            'how-to-implement-ai-automation-in-an-existing-business',
        ],
    },
    {
        'slug': 'how-industrial-distributors-can-use-ai-to-automate-sales',
        'title': 'How Industrial Distributors Can Use AI to Automate Sales',
        'description': (
            'The specific sales processes industrial distributors can automate, from RFQ '
            'intake and part matching to quotation follow-up and pipeline visibility.'
        ),
        'h1': 'How Industrial Distributors Can Use AI to Automate Sales',
        'category': 'Industrial Distribution',
        'published': '2026-03-10',
        'updated': '2026-03-10',
        'reading_time': 8,
        'keywords': ['industrial distribution', 'sales automation', 'RFQ automation'],
        'intro': (
            'Industrial distribution is a margin business built on responsiveness. Customers '
            'have alternatives and they choose on availability, price and how quickly they get '
            'an answer. The sales process is therefore a response-time problem before it is a '
            'selling problem.'
        ),
        'blocks': [
            ('h2', 'Where the sales day actually goes'),
            ('p', 'In most distribution businesses, the sales team spends a minority of its '
                  'time selling. The rest goes to reading enquiries, hunting for part numbers, '
                  'checking stock, assembling quotations, chasing suppliers and updating '
                  'records. Each of those tasks is individually small and collectively '
                  'dominant.'),
            ('h2', 'Process 1: RFQ intake and parsing'),
            ('p', 'Enquiries arrive as PDFs, spreadsheets, photographs of handwritten lists and '
                  'portal exports. Parsing them automatically into line items removes the '
                  'manual transcription step and, more importantly, makes the request '
                  'searchable and measurable. You cannot improve response time on requests you '
                  'have not recorded.'),
            ('h2', 'Process 2: Part number and equivalent matching'),
            ('p', 'Customers rarely order using your part numbers. They use the manufacturer '
                  'number, an internal code, or a description. Matching maps the request to '
                  'catalogue items using exact numbers where possible and attributes where '
                  'not. Substitution candidates are surfaced for the estimator to confirm, '
                  'which is a commercial decision rather than a clerical one.'),
            ('h2', 'Process 3: Quotation assembly'),
            ('p', 'Once items are matched and priced, the quotation is generated rather than '
                  'typed. Customer agreements, discount bands and freight rules are applied by '
                  'the system, and anything outside standard parameters routes for approval. '
                  'The estimator reviews commercial judgement, not arithmetic.'),
            ('h2', 'Process 4: Supplier comparison'),
            ('p', 'For non-stock or project business, quotations depend on supplier responses. '
                  'Collecting those responses and normalising price, lead time, minimum order '
                  'quantity and validity into one comparable view turns a scattered email '
                  'exercise into a decision table.'),
            ('h2', 'Process 5: Follow-up and pipeline'),
            ('p', 'Quotations that are not followed up are the largest hidden loss in '
                  'distribution. Automated follow-up tasks, tied to the quotation record and '
                  'surfaced when overdue, produce a measurable improvement without changing '
                  'how anyone sells.'),
            ('callout', 'The compounding benefit is data. Once quotes are structured, you can '
                        'see win rate by customer, by category and by estimator, which is '
                        'usually not visible today.'),
            ('h2', 'A realistic starting point'),
            ('ul', [
                'Measure current quote turnaround on a sample of recent enquiries.',
                'Automate intake and parsing for the most common document formats only.',
                'Add catalogue matching for your top-selling categories, where data quality is '
                'usually best.',
                'Generate quotations for standard catalogue requests first.',
                'Add follow-up tracking before attempting wider pipeline automation.',
            ]),
            ('p', 'Catalogue quality matters. If part descriptions are inconsistent, matching '
                  'will be weaker. Cleaning the subset of the catalogue that the automation '
                  'touches is usually enough to start; cleaning everything first delays value '
                  'for months.'),
            ('h2', 'What to avoid'),
            ('ul', [
                'Automating substitutions without human confirmation, which creates commercial risk.',
                'Sending quotations automatically before the pricing model has been validated.',
                'Attempting to automate the entire sales cycle at once.',
                'Choosing a tool before mapping the process, which usually leads to the tool '
                'dictating the process.',
            ]),
            ('p', 'Humisense builds distribution sales automation around existing ERP and '
                  'catalogue systems. The industrial distribution page describes the typical '
                  'implementation in more detail.'),
        ],
        'related_services': [
            ('AI automation for industrial distributors', '/industries/industrial-distribution'),
            ('RFQ automation', '/rfq-automation'),
            ('Sales automation', '/sales-automation'),
        ],
        'related_articles': [
            'what-is-rfq-automation-and-how-does-it-work',
            'how-to-automate-quotation-processing-using-ai',
        ],
    },
    {
        'slug': 'automating-supplier-communication-with-ai',
        'title': 'Automating Supplier Communication with AI',
        'description': (
            'How to automate supplier acknowledgements, price updates, delivery confirmations '
            'and document collection without losing the relationships that matter.'
        ),
        'h1': 'Automating Supplier Communication with AI',
        'category': 'Procurement',
        'published': '2026-03-17',
        'updated': '2026-03-17',
        'reading_time': 7,
        'keywords': ['supplier communication', 'procurement automation', 'document processing'],
        'intro': (
            'Supplier communication is high-volume, low-variation and commercially important. '
            'A confirmation email that is filed without being checked becomes a delivery '
            'problem three weeks later. Automating the reading and reconciliation of supplier '
            'messages removes that risk without removing the relationship.'
        ),
        'blocks': [
            ('h2', 'The four message types worth automating first'),
            ('h3', 'Order acknowledgements'),
            ('p', 'A supplier confirms an order with a PDF attached. The confirmed price, '
                  'quantity and delivery date need to be compared against what was ordered. '
                  'Automating the extraction and comparison means discrepancies are found in '
                  'minutes rather than at goods receipt.'),
            ('h3', 'Price updates'),
            ('p', 'Suppliers send price changes as lists, notices or updated catalogues. '
                  'Capturing those changes into structured form allows the commercial impact to '
                  'be assessed before the new price reaches a customer quotation.'),
            ('h3', 'Delivery notifications'),
            ('p', 'Dispatch confirmations and tracking updates can be matched to open purchase '
                  'orders, keeping delivery status accurate without anyone re-keying a date.'),
            ('h3', 'Document collection'),
            ('p', 'Certificates, declarations and compliance documents are requested and '
                  'chased. Automation can request, track and validate completeness, escalating '
                  'only when a supplier does not respond.'),
            ('h2', 'The reconciliation pattern that works'),
            ('p', 'The reliable design is not "let the AI reply to suppliers". It is a '
                  'comparison loop:'),
            ('ul', [
                'Extract the relevant fields from the supplier message.',
                'Compare each field against the purchase order record.',
                'Classify the result as matching, acceptable variation or discrepancy.',
                'Write matches back to the system, route variations for approval, and raise '
                'discrepancies as tasks with the supplier email attached.',
            ]),
            ('p', 'The AI handles reading and comparison. The commercial decision about whether '
                  'a variation is acceptable stays with a buyer.'),
            ('h2', 'Where language models help beyond extraction'),
            ('p', 'Supplier messages contain free text that carries meaning: "we can ship 80 '
                  'percent now, the balance in two weeks", or "the material is on allocation". '
                  'A rules engine cannot interpret that. A language model can convert it into '
                  'a structured status that the system can act on, which is exactly the kind of '
                  'task worth automating.'),
            ('h2', 'Practical guardrails'),
            ('ul', [
                'Never let automated messages commit to a commercial position; draft, then '
                'route for a buyer to send.',
                'Record the supplier message that justified each decision.',
                'Escalate anything that changes price, quantity or delivery beyond agreed tolerances.',
                'Keep a named buyer accountable for each supplier relationship.',
            ]),
            ('callout', 'Suppliers respond differently to a clearly human message than to an '
                        'obviously automated one. Automate the reading, not the voice.'),
            ('h2', 'Measuring the effect'),
            ('p', 'Useful measurements are: time from acknowledgement receipt to discrepancy '
                  'identification, number of discrepancies found at goods receipt rather than '
                  'at confirmation, and hours spent per week reconciling supplier messages. '
                  'These are measurable and directly attributable.'),
            ('p', 'Humisense builds supplier communication automation as part of procurement '
                  'and document processing projects. The document automation page describes the '
                  'extraction layer these workflows depend on.'),
        ],
        'related_services': [
            ('Intelligent document processing', '/document-automation'),
            ('Business process automation', '/business-process-automation'),
            ('AI automation for manufacturing', '/industries/manufacturing'),
        ],
        'related_articles': [
            'how-ai-can-improve-procurement-operations',
            'how-ai-extracts-data-from-pdf-and-excel-documents',
        ],
    },
    {
        'slug': 'how-ai-extracts-data-from-pdf-and-excel-documents',
        'title': 'How AI Extracts Data from PDF and Excel Documents',
        'description': (
            'The technical path from a PDF or spreadsheet to structured data: parsing, OCR, '
            'layout analysis, field extraction, validation and confidence scoring.'
        ),
        'h1': 'How AI Extracts Data from PDF and Excel Documents',
        'category': 'Technical',
        'published': '2026-03-24',
        'updated': '2026-03-24',
        'reading_time': 9,
        'keywords': ['document AI', 'PDF extraction', 'OCR', 'data extraction'],
        'intro': (
            'Document extraction is often described as if a model simply reads a file and '
            'produces JSON. The reality is a pipeline with several distinct stages, each of '
            'which can fail differently. Understanding the stages is what allows you to '
            'judge whether an extraction result is trustworthy.'
        ),
        'blocks': [
            ('h2', 'Stage 1: Determine what kind of document you have'),
            ('p', 'The first decision is whether the PDF contains a text layer or is a scan. A '
                  'digitally generated PDF can be parsed directly; a scan must be processed '
                  'with OCR first. Spreadsheets are different again, because their structure '
                  'is explicit but their layout may be anything.'),
            ('h2', 'Stage 2: Parse the structure, not just the text'),
            ('p', 'Extracting raw text loses the information that matters most. In an invoice, '
                  'the relationship between a line description and its amount is positional. '
                  'Layout-aware parsing preserves coordinates, table boundaries, column headers '
                  'and reading order, which is what makes table extraction possible.'),
            ('p', 'For spreadsheets, structure is read directly, but real-world workbooks '
                  'contain merged cells, multiple header rows, hidden sheets and totals '
                  'interleaved with data. A robust pipeline detects these rather than assuming '
                  'a clean rectangle.'),
            ('h2', 'Stage 3: Field extraction'),
            ('p', 'Once structure is preserved, fields are extracted. There are three '
                  'techniques, and production systems combine them:'),
            ('table', {
                'headers': ['Technique', 'How it works', 'Best for'],
                'rows': [
                    ['Template mapping', 'Fixed coordinates or labels', 'Consistent supplier formats, high volume'],
                    ['Layout model', 'Learned understanding of document structure', 'Moderate variation across suppliers'],
                    ['Language model extraction', 'Prompted with schema and document text', 'Unusual layouts, free text, mixed formats'],
                ],
            }),
            ('p', 'A useful pattern is to attempt template mapping first for known formats, '
                  'fall back to a layout model for variants, and use a language model where the '
                  'document does not fit either.'),
            ('h2', 'Stage 4: Validation'),
            ('p', 'Extraction without validation produces data that looks correct and is '
                  'occasionally wrong, which is worse than obviously missing data. Validation '
                  'rules catch this:'),
            ('ul', [
                'Arithmetic checks: do line totals sum to the stated total?',
                'Referential checks: does the supplier exist, and does the purchase order number match?',
                'Format checks: is the date plausible, is the currency valid, is the quantity positive?',
                'Range checks: is the unit price within the expected band for this item?',
            ]),
            ('h2', 'Stage 5: Confidence scoring and review'),
            ('p', 'Every extracted field should carry a confidence score derived from the '
                  'extraction method, the model output and the validation result. Fields below '
                  'threshold are routed to a review queue with the source document positioned '
                  'at the relevant page. The reviewer corrects the field, and the correction is '
                  'recorded as feedback.'),
            ('callout', 'The review queue is not a failure of the automation. It is the '
                        'mechanism that makes automation safe enough to trust with real documents.'),
            ('h2', 'What accuracy to expect'),
            ('p', 'Accuracy is a property of your document set, not of the technology in '
                  'general. Clean, standardised documents from repeat suppliers extract well. '
                  'Photographs of handwritten lists do not. Anyone quoting a single accuracy '
                  'percentage before seeing your documents is guessing.'),
            ('p', 'The right way to evaluate is to run a sample of your actual documents '
                  'through the pipeline and measure field-level accuracy, including the '
                  'percentage that required correction and the time correction took.'),
            ('h2', 'Architecture considerations'),
            ('ul', [
                'Where does processing run: your infrastructure, your cloud account, or a vendor environment?',
                'Which model providers are used, and do they retain input data?',
                'How long are source documents and extracted records retained?',
                'How is the pipeline monitored when a new supplier format appears?',
            ]),
            ('p', 'These questions matter more than the choice of model, because they determine '
                  'whether the system can be operated responsibly over time.'),
            ('p', 'Humisense builds document extraction pipelines that feed ERP, CRM and '
                  'workflow systems. The intelligent document processing page describes the '
                  'implementation approach.'),
        ],
        'related_services': [
            ('Intelligent document processing', '/document-automation'),
            ('AI workflow automation', '/ai-workflow-automation'),
            ('RFQ automation', '/rfq-automation'),
        ],
        'related_articles': [
            'how-to-automate-business-document-processing',
            'how-ai-can-improve-procurement-operations',
        ],
    },
    {
        'slug': 'ai-automation-use-cases-for-small-businesses',
        'title': 'AI Automation Use Cases for Small Businesses',
        'description': (
            'Realistic AI automation starting points for small businesses, with cost, scope '
            'and the processes that produce the fastest measurable improvement.'
        ),
        'h1': 'AI Automation Use Cases for Small Businesses',
        'category': 'Small Business',
        'published': '2026-03-31',
        'updated': '2026-03-31',
        'reading_time': 7,
        'keywords': ['small business automation', 'AI use cases', 'business automation'],
        'intro': (
            'Small businesses have the same automation opportunities as large ones, with two '
            'differences: the budget is smaller and the tolerance for a failed project is much '
            'lower. That makes scope discipline more important than technology choice.'
        ),
        'blocks': [
            ('h2', 'The test for a good first project'),
            ('p', 'A suitable first automation has four properties: it happens often, it has a '
                  'clear correct outcome, it currently costs a specific person time every week, '
                  'and a mistake is recoverable. If any of those is missing, choose something else.'),
            ('h2', 'Use case 1: Enquiry response and routing'),
            ('p', 'A small business receives enquiries across email, a website form and '
                  'sometimes a marketplace. Response time depends on who checks the inbox. '
                  'Automation can acknowledge immediately with accurate standard information, '
                  'classify the enquiry, and route it to the right person with the history '
                  'attached. This is usually the highest-value starting point because it '
                  'affects revenue directly.'),
            ('h2', 'Use case 2: Quotation preparation'),
            ('p', 'If quotes are prepared by copying a previous document and editing it, the '
                  'process is both slow and error-prone. Generating quotes from a structured '
                  'price list and a short brief removes the editing cycle and prevents old '
                  'prices or terms carrying forward.'),
            ('h2', 'Use case 3: Supplier invoice capture'),
            ('p', 'Supplier invoices and receipts arriving by email can be captured into '
                  'structured records ready for bookkeeping. For a business processing a few '
                  'hundred documents a month, this removes a recurring evening task and reduces '
                  'transcription errors that create reconciliation work later.'),
            ('h2', 'Use case 4: Customer status queries'),
            ('p', 'Where are my goods, what is my order status, when will it ship. These are '
                  'high volume and low variation. Answering them from live system data with '
                  'escalation for anything unusual frees significant time without touching the '
                  'conversations that matter.'),
            ('h2', 'Use case 5: Weekly operational summary'),
            ('p', 'A short automated summary of enquiries received, quotes issued, orders '
                  'confirmed and outstanding items gives the owner a clear view without '
                  'compiling anything. It is inexpensive to build once the underlying data is '
                  'structured.'),
            ('h2', 'What to expect on cost'),
            ('p', 'Costs depend on the process, the number of integrations and the level of '
                  'human review. A useful framing is to compare the automation cost with the '
                  'annual cost of the hours currently spent, and with the revenue effect of '
                  'faster response. We scope in phases so the first automation can be '
                  'delivered and evaluated before committing further.'),
            ('callout', 'Do not start with a platform decision. Start with the process that '
                        'costs the most hours, and choose the simplest tooling that solves it.'),
            ('h2', 'What to avoid'),
            ('ul', [
                'Automating several processes at once, which usually finishes none of them.',
                'Buying a suite of tools before knowing which process matters.',
                'Automating a process that should be simplified or removed first.',
                'Skipping the baseline measurement, which makes the result impossible to prove.',
            ]),
            ('p', 'Humisense scopes small business automation deliberately narrowly. The small '
                  'businesses industry page describes the typical starting points.'),
        ],
        'related_services': [
            ('AI automation for small businesses', '/industries/small-businesses'),
            ('AI automation services', '/ai-automation'),
            ('Quotation automation', '/quotation-automation'),
        ],
        'related_articles': [
            'how-to-implement-ai-automation-in-an-existing-business',
            'ai-agents-vs-traditional-workflow-automation',
        ],
    },
    {
        'slug': 'how-to-implement-ai-automation-in-an-existing-business',
        'title': 'How to Implement AI Automation in an Existing Business',
        'description': (
            'A practical implementation sequence: selecting the process, getting system '
            'access, running a shadow period and handing over to the operational team.'
        ),
        'h1': 'How to Implement AI Automation in an Existing Business',
        'category': 'Implementation',
        'published': '2026-04-07',
        'updated': '2026-04-07',
        'reading_time': 9,
        'keywords': ['AI implementation', 'automation roadmap', 'change management'],
        'intro': (
            'Most failed AI projects do not fail because the technology did not work. They '
            'fail because the project was scoped too broadly, system access arrived late, '
            'nobody agreed what "correct" meant, or the people who had to use it were never '
            'involved. Implementation discipline matters more than model choice.'
        ),
        'blocks': [
            ('h2', 'Step 1: Choose the process with evidence, not enthusiasm'),
            ('p', 'Score candidate processes on four dimensions: volume, variability, cost of '
                  'error and data availability. High volume with low variability is easy. High '
                  'volume with high variability is valuable but harder. Low volume with high '
                  'error cost is usually not worth automating first.'),
            ('h2', 'Step 2: Measure the baseline before building anything'),
            ('p', 'Record how long the process takes today, how many units are handled, how '
                  'often errors occur and what correcting them costs. Without a baseline, the '
                  'project cannot demonstrate success and will be judged on impressions.'),
            ('h2', 'Step 3: Secure system access early'),
            ('p', 'This is the most common cause of delay. Identify every system the automation '
                  'must read from or write to, and start the access requests during the design '
                  'phase rather than after it. API keys, database read access, service accounts '
                  'and firewall rules all take longer than expected.'),
            ('h2', 'Step 4: Agree the definition of correct'),
            ('p', 'Write down what a correct output looks like, including edge cases. Get the '
                  'people who currently do the work to agree it. This definition becomes the '
                  'evaluation criteria for the automation and the basis for the review queue '
                  'rules.'),
            ('h2', 'Step 5: Build narrowly, with logging from day one'),
            ('p', 'Build the smallest version that handles the main path, with every run logged: '
                  'input, extracted data, decisions, confidence and output. Logging is not '
                  'optional polish; it is how you find out why something failed in week three.'),
            ('h2', 'Step 6: Run a shadow period'),
            ('p', 'Run the automation alongside the existing manual process. Compare outputs. '
                  'Where they differ, decide whether the automation or the manual process is '
                  'wrong. This phase usually reveals that the manual process was less '
                  'consistent than assumed, which is useful information in itself.'),
            ('h2', 'Step 7: Define the human review point explicitly'),
            ('p', 'Decide which outputs can proceed automatically and which require approval. '
                  'Base this on commercial consequence, not on technical confidence alone. A '
                  'high-confidence extraction of a discount that should not have been offered '
                  'is still a problem.'),
            ('h2', 'Step 8: Hand over with documentation and monitoring'),
            ('p', 'The operational team should know how to read the logs, handle the review '
                  'queue and escalate a failure. Monitoring should alert on volume drops, '
                  'error-rate increases and confidence changes, because those are the signals '
                  'that a supplier changed a document format or an upstream system changed.'),
            ('callout', 'A project that only the implementer can operate is not finished. '
                        'Handover is part of the deliverable.'),
            ('h2', 'Typical timeline shape'),
            ('p', 'A single well-scoped process with available system access usually moves from '
                  'mapping to a shadow run in weeks, then to production after the shadow period. '
                  'Programmes that attempt several processes in parallel take longer and '
                  'produce less, because the integration and review patterns are rebuilt each '
                  'time instead of being reused.'),
            ('h2', 'The organisational side'),
            ('ul', [
                'Involve the people doing the work early; they know the exceptions.',
                'Be explicit that the aim is removing repetitive work, not reducing headcount.',
                'Nominate an owner for the automated process inside the business.',
                'Expect a period of adjustment where both systems run in parallel.',
            ]),
            ('p', 'Humisense runs implementation projects for businesses adopting automation '
                  'for the first time, including assessment, build and handover. The AI '
                  'consulting page describes the engagement model.'),
        ],
        'related_services': [
            ('AI consulting and implementation', '/ai-consulting'),
            ('Business process automation', '/business-process-automation'),
            ('AI automation services', '/ai-automation'),
        ],
        'related_articles': [
            'building-an-ai-powered-business-workflow',
            'ai-automation-use-cases-for-small-businesses',
        ],
    },
    {
        'slug': 'building-an-ai-powered-business-workflow',
        'title': 'Building an AI-Powered Business Workflow',
        'description': (
            'The architecture of a production AI workflow: triggers, extraction, validation, '
            'decision points, system writes and exception handling.'
        ),
        'h1': 'Building an AI-Powered Business Workflow',
        'category': 'Implementation',
        'published': '2026-04-14',
        'updated': '2026-04-14',
        'reading_time': 8,
        'keywords': ['AI workflow', 'automation architecture', 'business process'],
        'intro': (
            'A production AI workflow is not a chain of prompts. It is a system with a '
            'trigger, a state model, a small number of AI steps, deterministic validation and '
            'an exception path. Getting the shape right matters more than the model you choose.'
        ),
        'blocks': [
            ('h2', 'The trigger'),
            ('p', 'Every workflow starts from a specific event: an email arriving in a mailbox, '
                  'a record being created in a system, a file landing in a folder, a webhook '
                  'from a platform or a scheduled run. The trigger determines how the workflow '
                  'is tested and how failures are detected. Vague triggers produce workflows '
                  'that are impossible to monitor.'),
            ('h2', 'The state model'),
            ('p', 'Define the states a request passes through and who owns each one. For an '
                  'enquiry-to-quotation workflow the states might be received, parsed, matched, '
                  'priced, awaiting approval, sent and closed. Each transition has a condition '
                  'and an owner. This is what makes it possible to answer "where is this '
                  'request" without opening a mailbox.'),
            ('h2', 'The AI steps, kept narrow'),
            ('p', 'Use AI only where interpretation is needed. In practice that is usually '
                  'three places: extracting fields from unstructured input, classifying or '
                  'matching against a known set, and drafting text for a person to review. '
                  'Everything else is ordinary code.'),
            ('h2', 'The deterministic core'),
            ('p', 'Validation, calculation, lookup and system writes should be deterministic. '
                  'This is not a matter of taste. Deterministic steps can be unit tested, '
                  'reasoned about and audited. A workflow where the pricing calculation is '
                  'decided by a language model is a workflow you cannot certify.'),
            ('h2', 'The exception path'),
            ('p', 'Every workflow needs a defined path for items it cannot handle: low '
                  'confidence extraction, contradictory data, an unmatched item, a failed '
                  'system write. Exceptions should route to a queue with enough context for a '
                  'person to resolve them quickly, and the resolution should be recorded.'),
            ('table', {
                'headers': ['Layer', 'Responsibility', 'Failure mode if missing'],
                'rows': [
                    ['Trigger', 'Start the workflow reliably', 'Requests silently missed'],
                    ['State model', 'Track where each item is', 'Work stalls invisibly'],
                    ['AI steps', 'Interpret unstructured input', 'Brittle rules that break on variation'],
                    ['Validation', 'Check output against business rules', 'Plausible but wrong data in systems'],
                    ['System writes', 'Update the record of truth', 'Duplicate or missing records'],
                    ['Exception path', 'Handle what cannot be automated', 'Silent data loss'],
                    ['Logging', 'Explain what happened', 'No diagnosis possible'],
                ],
            }),
            ('h2', 'Logging and observability'),
            ('p', 'Each run should record its input, the extracted or interpreted data, the '
                  'confidence, the decisions taken and the output. When a supplier changes a '
                  'document layout, this is how you find out in hours instead of weeks. '
                  'Alerting on volume and confidence trends is more useful than alerting on '
                  'individual failures.'),
            ('h2', 'A worked example: enquiry to quotation'),
            ('ul', [
                'Trigger: email arrives in the sales mailbox with an attachment.',
                'AI step: classify as enquiry or not, extract customer, items and requirements.',
                'Validation: check required fields, match customer to CRM, flag missing quantities.',
                'Deterministic: look up prices, apply customer agreement, calculate totals.',
                'AI step: draft the covering message for review.',
                'Approval: route to the account owner, or to a manager above the discount threshold.',
                'System write: create the quotation record, send on approval, schedule follow-up.',
                'Exception path: unmatched items and missing information route to a review queue.',
            ]),
            ('callout', 'Two AI steps in a workflow of eight stages. That ratio is normal in '
                        'systems that work.'),
            ('p', 'Humisense designs and builds workflows of this shape around existing ERP and '
                  'CRM systems. The AI workflow automation page describes the approach in '
                  'detail.'),
        ],
        'related_services': [
            ('AI workflow automation', '/ai-workflow-automation'),
            ('Custom AI agent development', '/ai-agents'),
            ('Business process automation', '/business-process-automation'),
        ],
        'related_articles': [
            'ai-agents-vs-traditional-workflow-automation',
            'how-to-implement-ai-automation-in-an-existing-business',
        ],
    },
    {
        'slug': 'how-ai-can-improve-procurement-operations',
        'title': 'How AI Can Improve Procurement Operations',
        'description': (
            'Where AI improves procurement: requisition intake, supplier comparison, purchase '
            'order reconciliation, invoice matching and supplier document management.'
        ),
        'h1': 'How AI Can Improve Procurement Operations',
        'category': 'Procurement',
        'published': '2026-04-21',
        'updated': '2026-04-21',
        'reading_time': 8,
        'keywords': ['procurement automation', 'AI procurement', 'supplier management'],
        'intro': (
            'Procurement is document-heavy and decision-light in a specific way: most of the '
            'effort goes into collecting, reading and reconciling information, while the '
            'actual buying decision takes a fraction of the time. That is precisely the '
            'profile AI automation handles well.'
        ),
        'blocks': [
            ('h2', 'Requisition intake'),
            ('p', 'Purchase requests arrive as emails, spreadsheets and forms, often with '
                  'incomplete specifications. Automated intake captures the request, checks '
                  'completeness against the category rules and routes it for approval. '
                  'Incomplete requests are returned before they consume buyer time.'),
            ('h2', 'Supplier quotation comparison'),
            ('p', 'When several suppliers are asked to quote, responses arrive in different '
                  'formats with different assumptions. Normalising them into a comparable view '
                  'of price, lead time, minimum order quantity, payment terms and validity '
                  'makes the decision faster and more defensible.'),
            ('h2', 'Purchase order issue and acknowledgement'),
            ('p', 'Once an order is placed, the acknowledgement must be compared against the '
                  'order. Automating that comparison catches price and delivery discrepancies '
                  'at confirmation rather than at goods receipt, which is where they become '
                  'expensive.'),
            ('h2', 'Invoice matching'),
            ('p', 'Three-way matching between purchase order, goods receipt and invoice is '
                  'standard practice but often performed manually and incompletely. Automated '
                  'matching with exception queues lets finance focus on genuine discrepancies '
                  'rather than checking every invoice.'),
            ('h2', 'Supplier document management'),
            ('p', 'Certificates, insurance documents, declarations and compliance records must '
                  'be current. Automation can request, track and validate completeness, and '
                  'flag expiring documents before they become a compliance issue.'),
            ('h2', 'Supplier performance visibility'),
            ('p', 'Once acknowledgements, deliveries and discrepancies are captured '
                  'systematically, supplier performance becomes measurable: on-time delivery, '
                  'acknowledgement accuracy, price stability, document completeness. This is '
                  'information most procurement teams would like to have but cannot assemble '
                  'manually.'),
            ('table', {
                'headers': ['Process', 'Manual effort today', 'What automation removes'],
                'rows': [
                    ['Requisition intake', 'Reading and re-keying requests', 'Transcription and completeness checks'],
                    ['Quotation comparison', 'Rebuilding comparisons in spreadsheets', 'Normalisation and table assembly'],
                    ['PO acknowledgement', 'Manual comparison against order', 'Extraction and field comparison'],
                    ['Invoice matching', 'Checking every invoice', 'Matching, with exceptions surfaced'],
                    ['Supplier documents', 'Chasing and checking', 'Collection tracking and expiry alerts'],
                ],
            }),
            ('callout', 'Procurement automation rarely changes who decides. It changes how '
                        'much time is spent preparing the decision.'),
            ('h2', 'Where to start'),
            ('p', 'Invoice matching and PO acknowledgement are usually the fastest to deliver '
                  'because the documents are standardised and the correct outcome is '
                  'unambiguous. Quotation comparison follows, since it depends on supplier '
                  'responses that vary more.'),
            ('h2', 'Guardrails'),
            ('ul', [
                'Automated approval limits should be set conservatively and reviewed.',
                'Supplier commitments should remain with named buyers.',
                'Every automated match should be traceable to the source documents.',
                'Category-specific rules should be owned by the category manager, not by IT.',
            ]),
            ('p', 'Humisense builds procurement automation on top of existing ERP and '
                  'accounting systems. The document automation page describes the extraction '
                  'layer these workflows depend on.'),
        ],
        'related_services': [
            ('Intelligent document processing', '/document-automation'),
            ('Business process automation', '/business-process-automation'),
            ('AI automation for manufacturing', '/industries/manufacturing'),
        ],
        'related_articles': [
            'automating-supplier-communication-with-ai',
            'how-to-automate-business-document-processing',
        ],
    },
    {
        'slug': 'how-to-automate-business-document-processing',
        'title': 'How to Automate Business Document Processing',
        'description': (
            'A practical guide to automating document processing: choosing the document type, '
            'defining fields, building validation and operating the review queue.'
        ),
        'h1': 'How to Automate Business Document Processing',
        'category': 'Technical',
        'published': '2026-04-28',
        'updated': '2026-04-28',
        'reading_time': 8,
        'keywords': ['document automation', 'document processing', 'data capture'],
        'intro': (
            'Document processing automation is one of the most reliable automation projects a '
            'business can undertake, provided it is scoped to a single document type and the '
            'downstream use of the data is clear. Attempting every document type at once is '
            'the standard way to fail.'
        ),
        'blocks': [
            ('h2', 'Step 1: Pick one document type'),
            ('p', 'Choose the document that is processed most often and feeds a system that '
                  'matters. Supplier invoices, customer purchase orders and delivery notes are '
                  'the usual first candidates. A single document type means a single schema, a '
                  'single validation rule set and a single review process.'),
            ('h2', 'Step 2: Collect a representative sample'),
            ('p', 'Gather several hundred real examples, including the awkward ones: different '
                  'suppliers, scans, multi-page documents, credit notes, amended versions. This '
                  'sample is used to design the schema and to measure accuracy. A sample of '
                  'only clean examples produces a system that fails on contact with reality.'),
            ('h2', 'Step 3: Define the fields and their rules'),
            ('p', 'For each field, define the type, whether it is mandatory, the acceptable '
                  'format and the validation rule. Be strict about what is mandatory; a schema '
                  'with twenty required fields will route most documents to review.'),
            ('table', {
                'headers': ['Field', 'Type', 'Validation'],
                'rows': [
                    ['Document number', 'String', 'Unique, non-empty'],
                    ['Document date', 'Date', 'Within the last 12 months, not in the future'],
                    ['Supplier', 'Reference', 'Must match an existing supplier record'],
                    ['Line total', 'Currency', 'Quantity × unit price within rounding tolerance'],
                    ['Document total', 'Currency', 'Equals sum of line totals'],
                ],
            }),
            ('h2', 'Step 4: Build the extraction pipeline'),
            ('p', 'Ingest, classify, extract, validate. Classification matters when several '
                  'document types arrive in the same inbox, because an invoice processed with '
                  'an RFQ schema produces confident nonsense.'),
            ('h2', 'Step 5: Design the review queue properly'),
            ('p', 'The review queue determines whether the automation is actually usable. A '
                  'reviewer should see the source document and the extracted fields side by '
                  'side, be able to correct a field in one action, and have the correction '
                  'recorded. If reviewing a document takes as long as entering it manually, '
                  'the automation has produced no benefit.'),
            ('h2', 'Step 6: Write to the destination system'),
            ('p', 'The output has to land somewhere useful: an ERP record, an accounting entry, '
                  'a database table or a structured file. Idempotency matters. If a document '
                  'is processed twice, it must not create two records. Use the document number '
                  'plus supplier as a natural key.'),
            ('h2', 'Step 7: Operate and improve'),
            ('p', 'Monitor volume, confidence distribution and review rate. When a new supplier '
                  'format appears, review rate rises; that is the signal to add it to the '
                  'sample set and improve the pipeline. A document pipeline is a system that '
                  'needs periodic attention, not a one-off installation.'),
            ('callout', 'Review rate is the metric that tells you whether the automation is '
                        'earning its place. If most documents need correction, the scope is '
                        'wrong.'),
            ('h2', 'Common mistakes'),
            ('ul', [
                'Starting with every document type at once.',
                'Defining fields nobody downstream actually uses.',
                'Treating extraction accuracy as a single number rather than per field.',
                'Building no review interface, which forces all-or-nothing confidence.',
                'Ignoring duplicate handling, which corrupts downstream records.',
            ]),
            ('p', 'Humisense builds document processing pipelines for invoices, purchase '
                  'orders, delivery notes, specifications and RFQs. The intelligent document '
                  'processing page describes the approach.'),
        ],
        'related_services': [
            ('Intelligent document processing', '/document-automation'),
            ('AI workflow automation', '/ai-workflow-automation'),
            ('Business process automation', '/business-process-automation'),
        ],
        'related_articles': [
            'how-ai-extracts-data-from-pdf-and-excel-documents',
            'how-ai-can-improve-procurement-operations',
        ],
    },
]

ARTICLES_BY_SLUG = {article['slug']: article for article in ARTICLES}
