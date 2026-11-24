/**
 * HUMISENSE — page hero choreography.
 *
 * Splits headline text into masked words for the entrance, then runs one
 * motion concept per hero variant. Everything degrades: without JS the
 * headline is plain visible text, and reduced-motion users get the final
 * state with no loops.
 */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    function prefersReduced() { return reduceMotion.matches; }

    /* ---------------------------------------------------------------
       Split a heading into masked words.

       Markup inside the heading is preserved: each word keeps its own
       inline nodes (em, strong, span), so accent styling survives the
       split. The heading's own text is never destroyed if anything fails.
       --------------------------------------------------------------- */

    function splitWords(heading) {
        if (!heading || heading.dataset.split === 'done') return;
        heading.dataset.split = 'done';

        var nodes = Array.prototype.slice.call(heading.childNodes);
        var frag = document.createDocumentFragment();
        var index = 0;

        function wrapWord(wordNodes) {
            var box = document.createElement('span');
            box.className = 'hero-word';
            var inner = document.createElement('span');
            inner.style.setProperty('--d', 40 + index * 45 + 'ms');
            index += 1;
            wordNodes.forEach(function (n) { inner.appendChild(n); });
            box.appendChild(inner);
            return box;
        }

        nodes.forEach(function (node) {
            if (node.nodeType === 3) {
                var parts = node.nodeValue.split(/(\s+)/);
                parts.forEach(function (part) {
                    if (!part) return;
                    if (/^\s+$/.test(part)) {
                        frag.appendChild(document.createTextNode(' '));
                    } else {
                        frag.appendChild(wrapWord([document.createTextNode(part)]));
                    }
                });
            } else if (node.nodeType === 1) {
                // Keep an inline element whole (e.g. <em>We make it happen.</em>)
                // but split it on its own words so it animates in sequence.
                var text = node.textContent || '';
                var words = text.split(/(\s+)/).filter(function (p) { return p.length; });
                if (words.length > 1 && /^(EM|STRONG|SPAN|B|I)$/.test(node.tagName)) {
                    words.forEach(function (word) {
                        if (/^\s+$/.test(word)) {
                            frag.appendChild(document.createTextNode(' '));
                            return;
                        }
                        var clone = node.cloneNode(false);
                        clone.textContent = word;
                        frag.appendChild(wrapWord([clone]));
                    });
                } else {
                    frag.appendChild(wrapWord([node]));
                }
            }
        });

        heading.textContent = '';
        heading.appendChild(frag);
        heading.classList.add('hero-split');
    }

    function splitAll(root) {
        root.querySelectorAll('[data-hero-title]').forEach(splitWords);
    }

    /* ---------------------------------------------------------------
       Entrance
       --------------------------------------------------------------- */

    function reveal(hero) {
        hero.classList.add('is-in');
    }

    function initHero(hero) {
        splitAll(hero);

        if (prefersReduced() || !('IntersectionObserver' in window)) {
            reveal(hero);
            return;
        }

        // The hero is above the fold, so observe and reveal on the first
        // frame that it intersects. The timeout is a failsafe so content can
        // never stay hidden if the observer does not fire.
        var done = false;
        function once() { if (!done) { done = true; reveal(hero); } }

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) { if (e.isIntersecting) { once(); io.disconnect(); } });
        }, { threshold: 0.06 });

        io.observe(hero);
        window.setTimeout(once, 300);
    }

    /* ---------------------------------------------------------------
       Scroll drift

       The oversized word plates in the kinetic hero slide apart as the page
       scrolls, which is what makes the composition read as three depth
       layers rather than one flat word. Transform only, so no layout work.
       --------------------------------------------------------------- */

    function initScrollDrift(hero) {
        if (prefersReduced()) return;

        var stage = hero.querySelector('.hero-kinetic__stage');
        if (!stage) return;

        var ticking = false;

        function update() {
            ticking = false;
            var y = window.scrollY;
            if (y > window.innerHeight) return;

            // The whole stack lifts and skews slightly as the section leaves.
            stage.style.transform =
                'translate3d(0,' + (y * 0.09) + 'px,0)' +
                ' skewY(' + (y * 0.006) + 'deg)';
        }

        window.addEventListener('scroll', function () {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }, { passive: true });

        update();
    }

    /* ---------------------------------------------------------------
       Boot
       --------------------------------------------------------------- */

    function boot() {
        var heroes = document.querySelectorAll('.page-hero');

        heroes.forEach(function (hero) {
            initHero(hero);
            initScrollDrift(hero);
        });

        // Re-split if a hero is swapped in later (client-side filtering).
        if (window.MutationObserver) {
            var mo = new MutationObserver(function (records) {
                records.forEach(function (rec) {
                    rec.addedNodes.forEach(function (n) {
                        if (n.nodeType !== 1) return;
                        if (n.classList && n.classList.contains('page-hero')) initHero(n);
                    });
                });
            });
            mo.observe(document.body, { childList: true, subtree: true });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
