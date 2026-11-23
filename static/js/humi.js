/**
 * HUMISENSE — interaction layer.
 *
 * Vanilla, no framework. Everything degrades to static content if JS fails:
 * reveals are CSS transitions gated by a class, the hero wordmark is real
 * text, and navigation works without any of this.
 */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var prefersReduced = function () { return reduceMotion.matches; };

    /* ---------------------------------------------------------------
       Theme
       --------------------------------------------------------------- */

    function initTheme() {
        var root = document.documentElement;
        var toggles = document.querySelectorAll('[data-theme-toggle]');
        var meta = document.querySelector('meta[name="theme-color"]');

        function syncMeta() {
            if (!meta) return;
            meta.setAttribute(
                'content',
                root.classList.contains('dark') ? '#07080c' : '#fbfaf8'
            );
        }

        function apply(mode) {
            root.classList.toggle('dark', mode === 'dark');
            root.style.colorScheme = mode;
            try { localStorage.setItem('humi-theme', mode); } catch (e) {}
            syncMeta();
            toggles.forEach(function (btn) {
                btn.setAttribute('aria-pressed', String(mode === 'dark'));
            });
        }

        toggles.forEach(function (btn) {
            btn.addEventListener('click', function () {
                apply(root.classList.contains('dark') ? 'light' : 'dark');
            });
        });

        syncMeta();
    }

    /* ---------------------------------------------------------------
       Navigation: stuck state + mobile drawer
       --------------------------------------------------------------- */

    function initNav() {
        var nav = document.querySelector('[data-nav]');
        var toggle = document.querySelector('[data-nav-toggle]');
        var drawer = document.querySelector('[data-drawer]');
        if (!nav) return;

        var ticking = false;
        function onScroll() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function () {
                nav.classList.toggle('is-stuck', window.scrollY > 12);
                ticking = false;
            });
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        if (!toggle || !drawer) return;

        function setOpen(open) {
            toggle.setAttribute('aria-expanded', String(open));
            drawer.classList.toggle('is-open', open);
            drawer.setAttribute('aria-hidden', String(!open));
            document.body.style.overflow = open ? 'hidden' : '';
        }

        toggle.addEventListener('click', function () {
            setOpen(toggle.getAttribute('aria-expanded') !== 'true');
        });

        drawer.addEventListener('click', function (e) {
            if (e.target.closest('a')) setOpen(false);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
                setOpen(false);
                toggle.focus();
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 860 && drawer.classList.contains('is-open')) {
                setOpen(false);
            }
        });

        window.addEventListener('pageshow', function (e) {
            if (e.persisted) setOpen(false);
        });
    }

    /* ---------------------------------------------------------------
       Scroll reveals
       --------------------------------------------------------------- */

    function initReveals() {
        var items = document.querySelectorAll('[data-reveal], .stagger-children');
        if (!items.length) return;

        if (prefersReduced() || !('IntersectionObserver' in window)) {
            items.forEach(function (el) { el.classList.add('is-in'); });
            return;
        }

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-in');
                io.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

        items.forEach(function (el) { io.observe(el); });

        // Failsafe: if the observer never fires for an element (blocked script,
        // unusual scroll container, print stylesheet), reveal it anyway. Content
        // must never depend on an animation to become visible.
        window.setTimeout(function () {
            items.forEach(function (el) { el.classList.add('is-in'); });
        }, 4000);
    }

    /* ---------------------------------------------------------------
       Hero: liquid-glass wordmark
       --------------------------------------------------------------- */

    function initWordmark() {
        var stage = document.querySelector('[data-wordmark]');
        if (!stage) return;

        var letters = Array.prototype.slice.call(
            stage.querySelectorAll('.wordmark__letter')
        );
        if (!letters.length) return;

        // Pointer and scroll targets, smoothed each frame.
        var pointer = { x: 0, y: 0, tx: 0, ty: 0 };
        var scrollShift = { v: 0, t: 0 };
        var raf = null;
        var settled = false;

        // Entry choreography: each letter rises, unblurs and settles.
        function assemble() {
            letters.forEach(function (letter, i) {
                var delay = 90 + i * 58;
                letter.style.opacity = '0';
                letter.style.transform = 'translate3d(0, 46px, 0) scale(0.94)';
                letter.style.filter = 'blur(9px)';

                window.setTimeout(function () {
                    letter.style.transition =
                        'opacity 900ms cubic-bezier(0.22,1,0.36,1),' +
                        'transform 1100ms cubic-bezier(0.22,1,0.36,1),' +
                        'filter 900ms cubic-bezier(0.22,1,0.36,1)';
                    letter.style.opacity = '1';
                    letter.style.transform = 'none';
                    // Clearing the inline filter hands rendering back to the CSS
                    // drop-shadow on .wordmark__letter.
                    letter.style.filter = '';
                }, delay);
            });

            window.setTimeout(function () { settled = true; }, 90 + letters.length * 58 + 1100);
        }

        if (prefersReduced()) {
            settled = true;
        } else {
            assemble();
        }

        function frame() {
            raf = null;

            // Ease pointer towards target
            pointer.x += (pointer.tx - pointer.x) * 0.075;
            pointer.y += (pointer.ty - pointer.y) * 0.075;
            scrollShift.v += (scrollShift.t - scrollShift.v) * 0.12;

            var mid = (letters.length - 1) / 2;

            letters.forEach(function (letter, i) {
                if (!settled) return;

                // Letters further from the pointer move less — reads as depth.
                var dist = Math.abs(i - mid) / (mid || 1);
                var depth = 1 - dist * 0.55;

                var tx = pointer.x * 13 * depth;
                var ty = pointer.y * 9 * depth - scrollShift.v * (16 + dist * 26);
                var rot = pointer.x * 2.1 * depth;
                var skew = pointer.y * 1.4 * depth;
                var scale = 1 - scrollShift.v * 0.05 * (1 - dist * 0.5);

                letter.style.transform =
                    'translate3d(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px,0) ' +
                    'rotate(' + rot.toFixed(2) + 'deg) ' +
                    'skewY(' + skew.toFixed(2) + 'deg) ' +
                    'scale(' + scale.toFixed(3) + ')';
            });

            if (Math.abs(pointer.tx - pointer.x) > 0.001 ||
                Math.abs(pointer.ty - pointer.y) > 0.001 ||
                Math.abs(scrollShift.t - scrollShift.v) > 0.001) {
                raf = requestAnimationFrame(frame);
            }
        }

        function kick() {
            if (!raf) raf = requestAnimationFrame(frame);
        }

        if (!prefersReduced()) {
            var hero = stage.closest('.hero') || document.body;

            hero.addEventListener('pointermove', function (e) {
                var rect = hero.getBoundingClientRect();
                pointer.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
                pointer.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
                kick();
            }, { passive: true });

            hero.addEventListener('pointerleave', function () {
                pointer.tx = 0;
                pointer.ty = 0;
                kick();
            });

            var scrollTicking = false;
            window.addEventListener('scroll', function () {
                if (scrollTicking) return;
                scrollTicking = true;
                requestAnimationFrame(function () {
                    var h = window.innerHeight || 1;
                    scrollShift.t = Math.min(window.scrollY / h, 1);
                    kick();
                    scrollTicking = false;
                });
            }, { passive: true });
        }
    }

    /* ---------------------------------------------------------------
       Pointer-following glow on tiles and product cards
       --------------------------------------------------------------- */

    function initPointerGlow() {
        if (prefersReduced() || window.matchMedia('(hover: none)').matches) return;

        var cards = document.querySelectorAll('.tile, .product-card');
        cards.forEach(function (card) {
            card.addEventListener('pointermove', function (e) {
                var rect = card.getBoundingClientRect();
                card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width) * 100 + '%');
                card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height) * 100 + '%');
            }, { passive: true });
        });
    }

    /* ---------------------------------------------------------------
       Process timeline progress
       --------------------------------------------------------------- */

    function initProcess() {
        var process = document.querySelector('[data-process]');
        if (!process) return;

        var steps = Array.prototype.slice.call(process.querySelectorAll('.step'));
        if (!steps.length) return;

        var ticking = false;

        function update() {
            ticking = false;
            var rect = process.getBoundingClientRect();
            var vh = window.innerHeight;

            // 0 when the block first enters, 1 when it has passed the middle.
            var span = rect.height + vh * 0.5;
            var progress = (vh * 0.75 - rect.top) / span;
            progress = Math.max(0, Math.min(1, progress));

            process.style.setProperty('--progress', progress.toFixed(4));

            var activeCount = Math.ceil(progress * steps.length);
            steps.forEach(function (step, i) {
                step.classList.toggle('is-active', i < activeCount);
            });
        }

        function onScroll() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(update);
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        update();
    }

    /* ---------------------------------------------------------------
       Smooth scrolling
       --------------------------------------------------------------- */

    function initSmoothScroll() {
        if (prefersReduced() || typeof window.Lenis === 'undefined') return;

        var lenis = new window.Lenis({
            duration: 1.05,
            easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
            smoothWheel: true
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Anchor links inside the page should use Lenis, not the native jump.
        document.addEventListener('click', function (e) {
            var link = e.target.closest('a[href^="#"]');
            if (!link) return;
            var id = link.getAttribute('href');
            if (!id || id === '#') return;
            var target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            lenis.scrollTo(target, { offset: -90 });
        });

        if (document.querySelector('[data-drawer].is-open')) lenis.stop();
    }

    /* ---------------------------------------------------------------
       FAQ accordion
       --------------------------------------------------------------- */

    function initFaq() {
        var items = document.querySelectorAll('.faq-item');
        items.forEach(function (item) {
            var button = item.querySelector('.faq-question');
            var answer = item.querySelector('.faq-answer');
            if (!button || !answer) return;

            // Collapsed answers stay in the DOM for crawlers and for
            // find-in-page; the grid-rows transition only animates height.
            button.setAttribute('aria-expanded', 'false');
            answer.setAttribute('aria-hidden', 'true');

            button.addEventListener('click', function () {
                var open = item.classList.toggle('is-open');
                button.setAttribute('aria-expanded', String(open));
                answer.setAttribute('aria-hidden', String(!open));
            });
        });
    }

    /* ---------------------------------------------------------------
       Tabs
       --------------------------------------------------------------- */

    function initTabs() {
        document.querySelectorAll('.tabs').forEach(function (tabs) {
            var buttons = tabs.querySelectorAll('.tab');
            var panels = (tabs.parentElement || tabs).querySelectorAll('.tab-content');
            if (!buttons.length || !panels.length) return;

            buttons.forEach(function (button) {
                button.setAttribute('type', 'button');
                button.addEventListener('click', function () {
                    var target = button.dataset.tab;
                    buttons.forEach(function (b) {
                        b.classList.toggle('active', b === button);
                        b.setAttribute('aria-selected', String(b === button));
                    });
                    panels.forEach(function (panel) {
                        panel.classList.toggle('active', panel.id === target);
                    });
                });
            });
        });
    }

    /* ---------------------------------------------------------------
       Code block copy buttons
       --------------------------------------------------------------- */

    function initCodeCopy() {
        document.querySelectorAll('.code-copy').forEach(function (button) {
            var label = button.textContent.trim() || 'Copy';
            button.addEventListener('click', function () {
                var block = button.closest('.code-block');
                var code = block && block.querySelector('pre');
                if (!code || !navigator.clipboard) return;
                navigator.clipboard.writeText(code.textContent).then(function () {
                    button.textContent = 'Copied';
                    window.setTimeout(function () { button.textContent = label; }, 1800);
                }).catch(function () {});
            });
        });
    }

    /* ---------------------------------------------------------------
       Consent banner
       --------------------------------------------------------------- */

    function initConsent() {
        var banner = document.getElementById('consent-banner');
        if (!banner) return;

        var stored = null;
        try { stored = localStorage.getItem('humi-consent'); } catch (e) {}
        if (!stored) banner.hidden = false;

        banner.querySelectorAll('[data-consent]').forEach(function (button) {
            button.addEventListener('click', function () {
                var choice = button.dataset.consent;
                try { localStorage.setItem('humi-consent', choice); } catch (e) {}
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    event: 'consent_update',
                    analytics_storage: choice
                });
                if (typeof window.gtag === 'function') {
                    window.gtag('consent', 'update', { analytics_storage: choice });
                }
                banner.hidden = true;
            });
        });
    }

    /* ---------------------------------------------------------------
       Boot
       --------------------------------------------------------------- */

    function boot() {
        initTheme();
        initTabs();
        initCodeCopy();
        initConsent();
        initNav();
        initReveals();
        initWordmark();
        initPointerGlow();
        initProcess();
        initFaq();
        initSmoothScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
