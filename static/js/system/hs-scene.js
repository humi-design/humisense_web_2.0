/* ==========================================================================
   hs-scene — scene controller for the Humisense Intelligence System.

   One renderer, one camera, one scene, one loop, for the whole homepage. The
   canvas is fixed behind the content so the object persists across every
   section instead of scrolling away with the hero.

   Scroll progress is the single input that drives composition: the camera,
   the module activation, the chamber, and the lighting all read from it. The
   object never free-rotates; motion is mechanical and purposeful.

   Fallback contract: if WebGL is unavailable, the renderer throws, or the
   device is software-rasterised, `goStatic()` hides the canvas and leaves the
   authored SVG composition in place. Nothing here is required to read the
   page.
   ========================================================================== */

(function (global) {
    'use strict';

    var GEO = global.HSGeo;
    var MAT = global.HSMaterials;
    var LIT = global.HSLighting;
    var STR = global.HSStructure;

    /* ----------------------------------------------------------------
       Capability gate
       ---------------------------------------------------------------- */

    function webglAvailable() {
        try {
            var c = document.createElement('canvas');
            return !!(global.WebGLRenderingContext &&
                (c.getContext('webgl') || c.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    /* A software rasteriser advertises WebGL but renders this scene at single
       digit frame rates. Detect it and serve the static composition instead of
       burning the visitor's battery on a slideshow. */
    function softwareRenderer() {
        try {
            var c = document.createElement('canvas');
            var gl = c.getContext('webgl') || c.getContext('experimental-webgl');
            if (!gl) return true;
            var ext = gl.getExtension('WEBGL_debug_renderer_info');
            if (!ext) return false;
            var name = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '');
            return /swiftshader|llvmpipe|software|basic render|microsoft basic/i.test(name);
        } catch (e) {
            return false;
        }
    }

    function clamp01(x) { return x < 0 ? 0 : (x > 1 ? 1 : x); }
    function lerp(a, b, t) { return a + (b - a) * t; }
    function smooth(x) { x = clamp01(x); return x * x * (3 - 2 * x); }
    function seg(p, a, b) { return clamp01((p - a) / (b - a)); }

    /* ----------------------------------------------------------------
       Entry point
       ---------------------------------------------------------------- */

    function init(opts) {
        var canvasHost = opts.canvasHost;
        var fallback = opts.fallback;
        var root = opts.root || document.documentElement;

        var reduced = global.matchMedia &&
            global.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function goStatic() {
            if (canvasHost) canvasHost.setAttribute('hidden', '');
            if (fallback) fallback.removeAttribute('aria-hidden');
            if (root) root.classList.remove('has-webgl');
        }

        if (!canvasHost) return null;

        var narrow = global.innerWidth < 721;
        var lowMem = global.navigator.deviceMemory && global.navigator.deviceMemory < 4;
        var lowCores = global.navigator.hardwareConcurrency && global.navigator.hardwareConcurrency < 4;
        var saveData = global.navigator.connection && global.navigator.connection.saveData;

        if (reduced || narrow || lowMem || lowCores || saveData ||
            !webglAvailable() || softwareRenderer()) {
            goStatic();
            return null;
        }

        /* ------------------------------------------------------------
           Profile: one place for every quality decision, scaled by width.
           ------------------------------------------------------------ */
        var profile = {
            segs: narrow ? 22 : 32,
            dpr: Math.min(global.devicePixelRatio || 1, narrow ? 1.5 : 2),
            antialias: !narrow,
            envSigma: 0.035
        };

        var renderer;
        try {
            renderer = new THREE.WebGLRenderer({
                antialias: profile.antialias,
                alpha: true,
                powerPreference: 'high-performance'
            });
        } catch (e) {
            goStatic();
            return null;
        }

        var width = canvasHost.clientWidth || global.innerWidth;
        var height = canvasHost.clientHeight || global.innerHeight;

        renderer.setPixelRatio(profile.dpr);
        renderer.setSize(width, height, false);
        renderer.setClearAlpha(0);
        if ('outputEncoding' in renderer && THREE.sRGBEncoding) {
            renderer.outputEncoding = THREE.sRGBEncoding;
        }
        if (THREE.ACESFilmicToneMapping) {
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 0.85;
        }
        renderer.domElement.style.pointerEvents = 'none';
        canvasHost.appendChild(renderer.domElement);

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(33, width / height, 0.1, 140);

        /* Disposal ledger: every geometry, material and render target. */
        var ledger = [];

        var dark = root.classList.contains('dark');
        var M = MAT.create(ledger);
        MAT.applyTheme(M, dark, true);

        var S = STR.build(M, ledger, profile);
        scene.add(S.root);

        var L = LIT.build(scene, renderer, ledger, profile);
        LIT.applyTheme(L, dark);
        scene.environment = L.envMap;

        /* ------------------------------------------------------------
           Camera choreography. Each keyframe is a full camera state at a
           scroll position; the camera interpolates between neighbours.
           Values are hand-placed against the section layout, not generated.
           ------------------------------------------------------------ */
        /* Targets are pushed left of the object so it composes into the right
           half of the viewport, clear of the copy column. Distances are set so
           the full height of the structure stays inside the frame with margin:
           the object is ~6.8 units tall, and at fov 33 that needs roughly 13
           units of camera distance. */
        var KEYS = [
            /* p,    pos,                   target */
            { p: 0.00, pos: [5.6, 1.30, 12.2], tgt: [-2.35, 0.30, 0], fov: 33 },
            { p: 0.16, pos: [4.4, 1.05, 12.8], tgt: [-2.30, 0.50, 0], fov: 33 },
            { p: 0.34, pos: [7.0, 1.75, 11.4], tgt: [-2.15, 0.25, 0], fov: 34 },
            { p: 0.52, pos: [2.2, 1.20, 13.4], tgt: [-2.40, 0.55, 0], fov: 32 },
            { p: 0.70, pos: [6.4, 2.45, 11.8], tgt: [-2.25, 0.05, 0], fov: 34 },
            { p: 0.86, pos: [4.0, 0.85, 12.6], tgt: [-2.35, 0.40, 0], fov: 33 },
            { p: 1.00, pos: [1.0, 1.15, 13.6], tgt: [-2.25, 0.50, 0], fov: 31 }
        ];

        var camPos = new THREE.Vector3();
        var camTgt = new THREE.Vector3();
        var tmpA = new THREE.Vector3();
        var tmpB = new THREE.Vector3();

        function sampleCamera(p) {
            p = clamp01(p);
            var i = 0;
            while (i < KEYS.length - 2 && p > KEYS[i + 1].p) i++;
            var a = KEYS[i], b = KEYS[i + 1];
            var t = smooth(seg(p, a.p, b.p));
            camPos.set(
                lerp(a.pos[0], b.pos[0], t),
                lerp(a.pos[1], b.pos[1], t),
                lerp(a.pos[2], b.pos[2], t)
            );
            camTgt.set(
                lerp(a.tgt[0], b.tgt[0], t),
                lerp(a.tgt[1], b.tgt[1], t),
                lerp(a.tgt[2], b.tgt[2], t)
            );
            return lerp(a.fov, b.fov, t);
        }

        /* ------------------------------------------------------------
           Opening sequence: 0 -> 1 over ~1.6s. Not a gate: the headline and
           CTAs are plain HTML and are readable from the first paint.
           ------------------------------------------------------------ */
        var introStart = 0;
        var intro = 0;

        /* ------------------------------------------------------------
           Scroll progress. Reads the document height each frame from a cached
           value refreshed on resize, so this never forces layout.
           ------------------------------------------------------------ */
        var scrollMax = 1;
        var progress = 0;
        var targetProgress = 0;

        function measure() {
            var h = document.documentElement.scrollHeight - global.innerHeight;
            scrollMax = h > 1 ? h : 1;
        }

        function readScroll() {
            var y = global.pageYOffset || document.documentElement.scrollTop || 0;
            targetProgress = clamp01(y / scrollMax);
        }

        /* ------------------------------------------------------------
           Pointer parallax: restrained. Touch devices get none, because there
           is no hover state to mirror and it would fight scrolling.
           ------------------------------------------------------------ */
        var pointer = { x: 0, y: 0, tx: 0, ty: 0 };
        var hasPointer = global.matchMedia && global.matchMedia('(hover: hover)').matches;

        function onPointerMove(ev) {
            pointer.tx = (ev.clientX / global.innerWidth) * 2 - 1;
            pointer.ty = (ev.clientY / global.innerHeight) * 2 - 1;
        }

        if (hasPointer) {
            global.addEventListener('pointermove', onPointerMove, { passive: true });
        }

        /* ------------------------------------------------------------
           Module activation. Each of the eight sockets lights as its service
           enters view in section 02. `data-hs-module` on the HTML block is
           the contract between markup and scene.
           ------------------------------------------------------------ */
        var active = 0;

        function updateModules(p) {
            /* Section 02 spans roughly 0.12..0.30 of the page. Stagger the
               eight sockets across it so they light in reading order. */
            var base = seg(p, 0.10, 0.30);
            for (var i = 0; i < S.modules.length; i++) {
                var mod = S.modules[i];
                var start = i / S.modules.length * 0.72;
                var v = smooth(seg(base, start, start + 0.28));
                /* Once past section 02 they stay lit: the system is running. */
                var keep = seg(p, 0.30, 0.34);
                var on = Math.max(v, keep);
                mod.userData.ring.material.opacity = 0.92 * on;
                /* Sockets lift slightly away from the core as they activate,
                   which is what makes the object read as "reorganising". */
                var lift = 0.055 * on;
                mod.position.set(
                    mod.userData.home.x + mod.userData.side * lift,
                    mod.userData.home.y,
                    mod.userData.home.z + lift * 0.6
                );
            }
            for (var k = 0; k < S.signalLines.length; k++) {
                var sl = S.signalLines[k];
                var sv = smooth(seg(p, 0.12 + k * 0.018, 0.24 + k * 0.018));
                sl.material.opacity = 0.85 * sv;
            }
        }

        /* ------------------------------------------------------------
           Per-section composition: chamber intensity, arm angles, exposure.
           ------------------------------------------------------------ */
        function updateComposition(p, t) {
            /* Chamber: brightest at the automation section (0.42-0.58), where
               "intelligence running a workflow" is the point of the section. */
            var ch = 0.55 + 0.75 * smooth(seg(p, 0.34, 0.52)) - 0.25 * smooth(seg(p, 0.62, 0.78));
            L.chamberLight.intensity = (dark ? 1.8 : 0.9) * ch;
            for (var i = 0; i < S.lenses.length; i++) {
                S.lenses[i].material.emissiveIntensity =
                    (dark ? 1.05 : 0.45) * ch * (0.85 + 0.15 * Math.sin(t * 1.1 + i * 0.9));
            }

            /* Lenses counter-rotate slowly: ambient motion, mechanical. */
            for (var j = 0; j < S.lenses.length; j++) {
                S.lenses[j].rotation.z = j * 0.2 + t * 0.06 * (j % 2 ? -1 : 1);
            }

            /* Arms settle from a slightly open pose into a closed, organised
               one as the page progresses: "fragmented to coordinated". */
            var settle = smooth(seg(p, 0.0, 0.45));
            S.armUpper.rotation.z = lerp(0.075, 0.0, settle);
            S.armLower.rotation.z = lerp(-0.06, 0.0, settle);

            /* Crown fins align at the end: the final, most organised state. */
            var align = smooth(seg(p, 0.80, 1.0));
            for (var f = 0; f < S.crown.children.length; f++) {
                var fin = S.crown.children[f];
                if (fin.userData.baseRot === undefined) fin.userData.baseRot = fin.rotation.z;
                fin.rotation.z = lerp(fin.userData.baseRot, 0, align * 0.7);
            }

            /* Whole object: a slow mechanical drift, never a full rotation. */
            S.root.rotation.y = Math.sin(t * 0.18) * 0.055 + (pointer.x * 0.05);
            S.root.rotation.x = pointer.y * 0.018;

            /* Warm accent peaks at the automation section and again at the
               final CTA, which is where "transformation" is the message. */
            var warm = Math.max(
                smooth(seg(p, 0.38, 0.50)) * (1 - smooth(seg(p, 0.56, 0.66))),
                smooth(seg(p, 0.86, 0.97))
            );
            L.kicker.intensity = (dark ? 1.5 : 0.9) * (0.55 + warm * 0.9);
        }

        /* ------------------------------------------------------------
           Intro: the object arrives. Reveal is a scale + opacity ramp on the
           group, not a camera fly-in, so nothing clips through the near plane.
           ------------------------------------------------------------ */
        function updateIntro(dt) {
            if (intro >= 1) return;
            intro = Math.min(1, intro + dt / 1.6);
            var e = smooth(intro);
            S.root.scale.setScalar(lerp(0.90, 1.0, e));
            S.root.position.y = lerp(-0.35, 0, e);
            renderer.toneMappingExposure = (dark ? 0.95 : 0.85) * lerp(0.55, 1, e);
        }

        /* ------------------------------------------------------------
           Loop
           ------------------------------------------------------------ */
        var running = true;
        var visible = true;
        var last = 0;
        var elapsed = 0;

        function frame(now) {
            if (!running) return;
            global.requestAnimationFrame(frame);
            if (!visible) return;

            var t = now * 0.001;
            var dt = last ? Math.min(0.05, t - last) : 0.016;
            last = t;
            elapsed += dt;

            /* Ease scroll progress toward its target so camera moves are not
               jittery on wheel events with large deltas. */
            progress += (targetProgress - progress) * Math.min(1, dt * 7);

            updateIntro(dt);

            var p = progress;
            var fov = sampleCamera(p);
            if (Math.abs(camera.fov - fov) > 0.001) {
                camera.fov = fov;
                camera.updateProjectionMatrix();
            }
            camera.position.copy(camPos);
            camera.lookAt(camTgt);

            pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 3);
            pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 3);

            updateModules(p);
            updateComposition(p, elapsed);

            renderer.render(scene, camera);
        }

        /* ------------------------------------------------------------
           Lifecycle
           ------------------------------------------------------------ */
        function resize() {
            width = canvasHost.clientWidth || global.innerWidth;
            height = canvasHost.clientHeight || global.innerHeight;
            if (!width || !height) return;
            renderer.setPixelRatio(Math.min(global.devicePixelRatio || 1, profile.dpr));
            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            measure();
            readScroll();
        }

        function onVisibility() {
            visible = !document.hidden;
            last = 0;
        }

        function dispose() {
            running = false;
            global.removeEventListener('resize', resize);
            global.removeEventListener('scroll', readScroll);
            if (hasPointer) global.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('visibilitychange', onVisibility);
            ledger.forEach(function (o) {
                if (o && o.dispose) o.dispose();
            });
            if (L.envRT) L.envRT.dispose();
            renderer.dispose();
            if (renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
        }

        /* Theme: swap material and light values in place. No scene rebuild. */
        function applyTheme() {
            dark = root.classList.contains('dark');
            MAT.applyTheme(M, dark, true);
            LIT.applyTheme(L, dark);
            renderer.toneMappingExposure = dark ? 0.95 : 0.85;
        }

        var mo = new MutationObserver(function (records) {
            for (var i = 0; i < records.length; i++) {
                if (records[i].attributeName === 'class') { applyTheme(); break; }
            }
        });
        mo.observe(root, { attributes: true, attributeFilter: ['class'] });

        global.addEventListener('resize', resize, { passive: true });
        global.addEventListener('scroll', readScroll, { passive: true });
        document.addEventListener('visibilitychange', onVisibility);

        measure();
        readScroll();
        progress = targetProgress;

        root.classList.add('has-webgl');
        if (fallback) fallback.setAttribute('aria-hidden', 'true');

        global.requestAnimationFrame(frame);

        return {
            dispose: dispose,
            resize: resize,
            applyTheme: applyTheme,
            /* Exposed for the test harness only. */
            _scene: scene,
            _renderer: renderer,
            _camera: camera,
            _structure: S,
            _lights: L,
            _setProgress: function (v) { progress = targetProgress = clamp01(v); }
        };
    }

    global.HSScene = { init: init };
})(window);
