/**
 * Conversion tracking for GTM-WJKSCNR3.
 *
 * Pushes structured events to the dataLayer so they can be mapped to GA4
 * events in Tag Manager. No personal data is sent: only the event type,
 * the page path and the element that was interacted with.
 */
(function () {
    'use strict';

    window.dataLayer = window.dataLayer || [];

    function push(event, params) {
        window.dataLayer.push(Object.assign({
            event: event,
            page_path: window.location.pathname
        }, params || {}));
    }

    function labelFor(el) {
        var text = (el.getAttribute('aria-label') || el.textContent || '').trim();
        return text.replace(/\s+/g, ' ').slice(0, 80);
    }

    document.addEventListener('DOMContentLoaded', function () {
        // Outbound and contact link tracking
        document.addEventListener('click', function (event) {
            var link = event.target.closest('a');
            if (!link) return;
            var href = link.getAttribute('href') || '';

            if (href.indexOf('mailto:') === 0) {
                push('contact_email_click', { link_label: labelFor(link) });
            } else if (href.indexOf('tel:') === 0) {
                push('contact_phone_click', { link_label: labelFor(link) });
            } else if (href.indexOf('/contact') === 0) {
                push('cta_click', { cta_type: 'consultation', link_label: labelFor(link) });
            } else if (link.classList.contains('btn-primary') || link.classList.contains('btn-secondary')) {
                push('cta_click', { cta_type: 'primary_button', link_label: labelFor(link) });
            }
        });

        // Contact form submission intent
        var contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function () {
                push('generate_lead', { form_type: 'contact' });
            });
        }

        // Newsletter subscription
        var newsletter = document.getElementById('newsletter-form');
        if (newsletter) {
            newsletter.addEventListener('submit', function () {
                push('newsletter_signup', { form_type: 'newsletter' });
            });
        }

        // Scroll depth at 25/50/75/100 percent
        var marks = [25, 50, 75, 100];
        var fired = {};
        window.addEventListener('scroll', function () {
            var doc = document.documentElement;
            var scrolled = (doc.scrollTop + window.innerHeight) / doc.scrollHeight * 100;
            marks.forEach(function (mark) {
                if (scrolled >= mark && !fired[mark]) {
                    fired[mark] = true;
                    push('scroll_depth', { percent: mark });
                }
            });
        }, { passive: true });
    });
})();
