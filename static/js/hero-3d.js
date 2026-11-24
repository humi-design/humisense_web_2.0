/**
 * HUMISENSE — the hero sculpture.
 *
 * An original kinetic object, not a stock shape: twelve interlocking torus
 * ribs wound on a shared axis, forming a woven cage around a molten core.
 * The ribs are staggered in phase so the mass reads as a single woven
 * structure from the front and as a spiral from the side.
 *
 * The entrance is choreographed rather than a spin-up:
 *   1. the core ignites and scales in,
 *   2. the ribs unfurl from the axis outward, staggered,
 *   3. the whole cage tilts to its resting attitude,
 *   4. only then does it drift.
 *
 * Everything degrades. No WebGL, a blocked CDN, a tiny viewport or a
 * reduced-motion preference all fall back to a designed static composition
 * that is already in the DOM. The canvas is only ever mounted on top of it.
 *
 * Performance: one render pass, no post-processing chain, capped DPR, and a
 * pause when the hero leaves the viewport or the tab is hidden.
 */
(function () {
    'use strict';

    var root = document.getElementById('hero-sculpture');
    if (!root) return;

    var canvasHost = root.querySelector('[data-sculpture-canvas]');
    var fallback = root.querySelector('[data-sculpture-fallback]');
    if (!canvasHost) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    /* --- Capability gate ------------------------------------------------
       Deliberately conservative. A slow connection or a small screen gets
       the static composition, which is designed to stand on its own. */

    function webglAvailable() {
        try {
            var c = document.createElement('canvas');
            return !!(window.WebGLRenderingContext &&
                (c.getContext('webgl') || c.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    var smallScreen = window.matchMedia('(max-width: 720px)').matches;
    var lowMemory = (navigator.deviceMemory && navigator.deviceMemory < 4);
    var lowCores = (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4);

    if (!webglAvailable() || typeof THREE === 'undefined' || smallScreen || lowMemory || lowCores) {
        root.classList.add('is-static');
        return;
    }

    /* --- Scene ---------------------------------------------------------- */

    var palette = {
        blue: 0x2867e8,
        deepBlue: 0x153a9a,
        purple: 0x5429c7,
        violet: 0x7545e8,
        golden: 0xf3c94f,
        orange: 0xff941a,
        magenta: 0xe82d68,
        cream: 0xf7f0df
    };

    var width = canvasHost.clientWidth || 1;
    var height = canvasHost.clientHeight || 1;

    var renderer;
    try {
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
    } catch (e) {
        root.classList.add('is-static');
        return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.85));
    renderer.setSize(width, height, false);
    renderer.setClearAlpha(0);
    canvasHost.appendChild(renderer.domElement);

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 11.5);

    /* Group holds everything so one transform drives the whole object. */
    var world = new THREE.Group();
    scene.add(world);

    /* --- Materials ------------------------------------------------------
       Physical material with clearcoat is what gives the chrome its
       liquid sheen. It is more expensive than Lambert, but there is only a
       handful of meshes, so the cost stays flat. */

    function ribbonMaterial(color) {
        return new THREE.MeshPhysicalMaterial({
            color: color,
            metalness: 0.86,
            roughness: 0.22,
            clearcoat: 0.9,
            clearcoatRoughness: 0.18,
            reflectivity: 0.9,
            envMapIntensity: 1.15,
            emissive: color,
            emissiveIntensity: 0.045
        });
    }

    /* Each rib gets its own hue from the brand ramp, cycling so the woven
       form reads as blue and purple with warm threads through it. */
    var ribPalette = [
        palette.blue, palette.purple, palette.violet, palette.deepBlue,
        palette.orange, palette.purple, palette.blue, palette.magenta,
        palette.violet, palette.deepBlue, palette.golden, palette.blue
    ];

    var ribs = [];
    var RIB_COUNT = 12;
    var ribGeo = new THREE.TorusGeometry(2.55, 0.13, 18, 132);

    for (var i = 0; i < RIB_COUNT; i++) {
        var mesh = new THREE.Mesh(ribGeo, ribbonMaterial(ribPalette[i]));

        /* Stagger the tilt so the cage is woven, not layered. */
        var t = i / RIB_COUNT;
        mesh.rotation.y = t * Math.PI * 2;
        mesh.rotation.x = Math.sin(t * Math.PI * 2) * 0.62;
        mesh.rotation.z = Math.cos(t * Math.PI * 1.5) * 0.24;

        /* Stagger the radius so it is a helix rather than a sphere. */
        var scale = 0.72 + Math.sin(t * Math.PI) * 0.34;
        mesh.scale.setScalar(scale);

        mesh.userData = { phase: t, baseScale: scale };
        world.add(mesh);
        ribs.push(mesh);
    }

    /* --- Molten core ----------------------------------------------------
       A low-poly icosahedron in warm gold, wireframe overlaid so it reads as
       a lattice of light rather than a solid ball. */

    var coreGeo = new THREE.IcosahedronGeometry(0.92, 1);
    var core = new THREE.Mesh(coreGeo, new THREE.MeshPhysicalMaterial({
        color: palette.golden,
        emissive: palette.orange,
        emissiveIntensity: 1.05,
        metalness: 0.4,
        roughness: 0.3,
        transparent: true,
        opacity: 0.92
    }));
    world.add(core);

    var coreWire = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.12, 1),
        new THREE.MeshBasicMaterial({
            color: palette.magenta,
            wireframe: true,
            transparent: true,
            opacity: 0.34
        })
    );
    world.add(coreWire);

    /* --- Orbiting motes -------------------------------------------------
       Small points that give the composition depth. Instanced via a single
       Points object so it is one draw call. */

    var moteCount = 220;
    var moteGeo = new THREE.BufferGeometry();
    var positions = new Float32Array(moteCount * 3);
    for (var m = 0; m < moteCount; m++) {
        var radius = 3.2 + Math.random() * 3.4;
        var theta = Math.random() * Math.PI * 2;
        var phi = Math.acos(2 * Math.random() - 1);
        positions[m * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[m * 3 + 1] = radius * Math.cos(phi) * 0.62;
        positions[m * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    moteGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    var motes = new THREE.Points(moteGeo, new THREE.PointsMaterial({
        color: palette.cream,
        size: 0.045,
        transparent: true,
        opacity: 0.55,
        sizeAttenuation: true,
        depthWrite: false
    }));
    world.add(motes);

    /* --- Lighting -------------------------------------------------------
       One key from upper-left in warm gold, a cool blue rim from behind, and
       ambient fill. The warm/cool opposition is what makes the metal read as
       liquid rather than plastic. */

    scene.add(new THREE.AmbientLight(0xffffff, 0.42));

    var key = new THREE.DirectionalLight(palette.golden, 2.5);
    key.position.set(-5, 6, 7);
    scene.add(key);

    var rim = new THREE.DirectionalLight(palette.violet, 2.1);
    rim.position.set(6, -3, -6);
    scene.add(rim);

    var fillBlue = new THREE.PointLight(palette.blue, 30, 26, 2);
    fillBlue.position.set(4, 3, 4);
    scene.add(fillBlue);

    var fillWarm = new THREE.PointLight(palette.orange, 22, 22, 2);
    fillWarm.position.set(-4, -4, 2);
    scene.add(fillWarm);

    /* --- Environment map ------------------------------------------------
       A tiny procedural cube env in the brand colours gives the metal
       something to reflect. Generating it beats shipping an HDR file: no
       extra request, no 2 MB download, and it matches the palette exactly. */

    function buildEnvironment() {
        var size = 64;
        var faces = [];
        var faceColors = [
            [palette.deepBlue, palette.purple],
            [palette.purple, palette.magenta],
            [palette.golden, palette.orange],
            [palette.deepBlue, palette.blue],
            [palette.blue, palette.purple],
            [palette.magenta, palette.purple]
        ];
        faceColors.forEach(function (pair) {
            var cv = document.createElement('canvas');
            cv.width = cv.height = size;
            var ctx = cv.getContext('2d');
            var g = ctx.createLinearGradient(0, 0, size, size);
            g.addColorStop(0, '#' + pair[0].toString(16).padStart(6, '0'));
            g.addColorStop(1, '#' + pair[1].toString(16).padStart(6, '0'));
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, size, size);
            faces.push(cv);
        });
        var cube = new THREE.CubeTexture(faces);
        cube.needsUpdate = true;
        return cube;
    }

    try {
        scene.environment = buildEnvironment();
    } catch (e) {
        /* Env map is a nicety; the lights carry the look without it. */
    }

    /* --- Entrance choreography ------------------------------------------ */

    var started = false;
    var clock = new THREE.Clock();
    var pointer = { x: 0, y: 0 };
    var target = { x: 0, y: 0 };
    var scrollNorm = 0;
    var rafId = null;
    var visible = true;

    var intro = { t: 0 };

    function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }
    function easeInOutCubic(x) {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }

    function entrance(p) {
        /* p: 0 → 1 over the whole sequence */

        /* 0.00 – 0.28  core ignites */
        var coreT = easeOutCubic(Math.min(1, p / 0.28));
        core.scale.setScalar(0.001 + coreT * 1);
        core.material.opacity = 0.92 * coreT;
        coreWire.scale.setScalar(0.001 + coreT * 1);
        coreWire.material.opacity = 0.34 * coreT;

        /* 0.10 – 0.80  ribs unfurl, staggered from the axis */
        ribs.forEach(function (rib, idx) {
            var stagger = idx / RIB_COUNT * 0.45;
            var local = Math.max(0, Math.min(1, (p - 0.1 - stagger) / 0.5));
            var e = easeOutCubic(local);
            var base = rib.userData.baseScale;
            rib.scale.setScalar(Math.max(0.001, base * e));
            rib.rotation.z += 0.0016 * (1 - e);
        });

        /* 0.35 – 1.00  the cage settles into its resting tilt */
        var tiltT = easeInOutCubic(Math.max(0, Math.min(1, (p - 0.35) / 0.65)));
        world.rotation.x = THREE.MathUtils.lerp(-0.9, -0.12, tiltT);
        world.rotation.y = THREE.MathUtils.lerp(1.5, 0.0, tiltT);

        /* motes fade up last */
        motes.material.opacity = 0.55 * Math.max(0, Math.min(1, (p - 0.45) / 0.55));
    }

    if (reduceMotion.matches) {
        entrance(1);
        intro.t = 1;
    } else {
        entrance(0);
    }

    /* --- Interaction ----------------------------------------------------- */

    var host = root;
    function onPointerMove(e) {
        var rect = host.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        target.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        target.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    }

    if (!reduceMotion.matches && window.matchMedia('(pointer: fine)').matches) {
        window.addEventListener('pointermove', onPointerMove, { passive: true });
    }

    /* Scroll drives a slow expansion of the cage, so the object opens as the
       hero leaves. Read from the scroll position rather than ScrollTrigger so
       this keeps working even if GSAP fails to load. */
    function onScroll() {
        var rect = host.getBoundingClientRect();
        var span = rect.height || 1;
        var travelled = -rect.top;
        scrollNorm = Math.max(0, Math.min(1, travelled / span));
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Pause when off-screen or the tab is hidden — a hero that keeps
       rendering below the fold burns battery for nothing. */
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
            visible = entries[0].isIntersecting;
        }, { threshold: 0.01 }).observe(host);
    }
    document.addEventListener('visibilitychange', function () {
        visible = !document.hidden;
    });

    /* --- Render loop ----------------------------------------------------- */

    function frame() {
        rafId = requestAnimationFrame(frame);
        if (!visible) return;

        var dt = Math.min(clock.getDelta(), 0.05);

        if (intro.t < 1) {
            intro.t = Math.min(1, intro.t + dt / 2.4);
            entrance(intro.t);
        }

        /* Ease the pointer toward its target so motion is smooth, not twitchy */
        pointer.x += (target.x - pointer.x) * Math.min(1, dt * 2.4);
        pointer.y += (target.y - pointer.y) * Math.min(1, dt * 2.4);

        var t = clock.elapsedTime;

        /* A reader who asked for reduced motion gets the composed object at
           rest: the entrance still resolves, but nothing drifts, pulses or
           follows the pointer afterwards. */
        if (intro.t >= 1 && !reduceMotion.matches) {
            /* Resting drift: a slow counter-rotation offset by the pointer */
            world.rotation.y += dt * (0.13 + scrollNorm * 0.5);
            world.rotation.x = -0.12 + pointer.y * 0.22 + Math.sin(t * 0.28) * 0.04;

            /* The cage opens as the reader scrolls past */
            var open = 1 + scrollNorm * 0.55;
            ribs.forEach(function (rib, idx) {
                var pulse = 1 + Math.sin(t * 0.9 + idx * 0.5) * 0.018;
                rib.scale.setScalar(rib.userData.baseScale * open * pulse);
                rib.rotation.z += dt * 0.05 * (idx % 2 ? 1 : -1);
            });

            core.rotation.y += dt * 0.6;
            core.rotation.x += dt * 0.22;
            coreWire.rotation.y -= dt * 0.42;
            coreWire.rotation.z += dt * 0.2;
            core.material.emissiveIntensity = 1.05 + Math.sin(t * 1.6) * 0.16;

            motes.rotation.y += dt * 0.045;

            camera.position.x = pointer.x * 0.5;
            camera.position.y = -pointer.y * 0.32;
            camera.lookAt(0, 0, 0);
        }

        renderer.render(scene, camera);
    }

    /* --- Resize ---------------------------------------------------------- */

    var resizeTimer = null;
    function resize() {
        var w = canvasHost.clientWidth || 1;
        var h = canvasHost.clientHeight || 1;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
    }
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 160);
    }, { passive: true });

    /* --- Start ----------------------------------------------------------- */

    root.classList.add('has-webgl');
    if (fallback) fallback.setAttribute('aria-hidden', 'false');
    frame();

    /* If the context is lost (GPU reset, driver sleep) fall back rather than
       leaving a black rectangle. */
    renderer.domElement.addEventListener('webglcontextlost', function (ev) {
        ev.preventDefault();
        if (rafId) cancelAnimationFrame(rafId);
        root.classList.remove('has-webgl');
        root.classList.add('is-static');
    });

    if (reduceMotion.addEventListener) {
        reduceMotion.addEventListener('change', function () {
            if (reduceMotion.matches) {
                entrance(1);
                intro.t = 1;
                renderer.render(scene, camera);
            }
        });
    }
})();
