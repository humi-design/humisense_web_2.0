/* ==========================================================================
   hero-3d — "CONFLUENCE"

   A signature hero sculpture for Humisense. One carved monolith, split by a
   fault, its upper mass displaced and rotated above the lower. A precision
   glass chamber sits in the cleft. Luminous information enters from below,
   converges in the chamber, and leaves through the upper mass.

   Solid matter represents engineering. Living light represents intelligence.
   Their meeting point is the fault.

   Design notes
   ------------
   - The masses are lofted from squircle cross-sections (superellipse
     exponent 7-9), which gives flat machined faces with tight radii rather
     than the soft look of a scaled primitive.
   - Every solid uses MeshStandardMaterial driven by a procedural PMREM
     environment, so metal reads as metal instead of a lit flat colour.
   - The living layer is deliberately small: three open splines, ~120
     particles, one chamber flare. Nothing here is random.
   - The object is never spun. Motion is a slow drift plus parallax.

   Contract with the page: this module owns [data-sculpture-canvas] inside
   #hero-sculpture and toggles has-webgl / is-static. Everything else in the
   hero belongs to the template.
   ========================================================================== */

(function () {
    'use strict';

    var root = document.getElementById('hero-sculpture');
    if (!root) return;

    var canvasHost = root.querySelector('[data-sculpture-canvas]');
    var fallback = root.querySelector('[data-sculpture-fallback]');
    if (!canvasHost) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var docEl = document.documentElement;

    /* ------------------------------------------------------------------
       Capability gate
       ------------------------------------------------------------------ */

    function webglAvailable() {
        try {
            var c = document.createElement('canvas');
            return !!(window.WebGLRenderingContext &&
                (c.getContext('webgl') || c.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    /* A software rasteriser advertises WebGL but cannot sustain this scene, so
       it must be treated as incapable rather than merely low-end. */
    function softwareRenderer() {
        try {
            var c = document.createElement('canvas');
            var gl = c.getContext('webgl') || c.getContext('experimental-webgl');
            if (!gl) return false;
            var ext = gl.getExtension('WEBGL_debug_renderer_info');
            if (!ext) return false;
            var name = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '');
            return /swiftshader|llvmpipe|software|basic render|microsoft basic/i.test(name);
        } catch (e) {
            return false;
        }
    }

    function goStatic() {
        root.classList.remove('has-webgl');
        root.classList.add('is-static');
    }

    var mem = navigator.deviceMemory || 8;
    var cores = navigator.hardwareConcurrency || 8;
    var saveData = !!(navigator.connection && navigator.connection.saveData);
    var narrow = window.matchMedia('(max-width: 720px)').matches;

    if (!webglAvailable() || typeof THREE === 'undefined' || saveData ||
        mem < 2 || cores < 2 || reduceMotion.matches || softwareRenderer()) {
        goStatic();
        return;
    }

    /* Quality ladder. `low` keeps the same silhouette with fewer particles
       and no environment-map supersampling. */
    var TIER = narrow ? 'low' : (mem >= 4 && cores >= 4 ? 'high' : 'mid');

    var PROFILE = {
        high: { particles: 130, streams: 3, ringSegs: 44, envSigma: 0.16, dpr: 1.5, fps: 60, antialias: true },
        mid: { particles: 84, streams: 3, ringSegs: 36, envSigma: 0.22, dpr: 1.4, fps: 60, antialias: true },
        low: { particles: 44, streams: 2, ringSegs: 28, envSigma: 0.30, dpr: 1.2, fps: 30, antialias: false }
    }[TIER];

    /* ------------------------------------------------------------------
       Palette
       ------------------------------------------------------------------ */

    var C = {
        elecBlue: 0x2867e8,
        deepBlue: 0x153a9a,
        purple: 0x5429c7,
        violet: 0x7545e8,
        cyan: 0x23d8f2,
        magenta: 0xe82d68,
        raspberry: 0xa91443,
        orange: 0xff941a,
        orangeDeep: 0xe96719,
        golden: 0xf3c94f,
        mustard: 0xd9a928
    };

    /* ------------------------------------------------------------------
       Renderer
       ------------------------------------------------------------------ */

    var width = canvasHost.clientWidth || 1;
    var height = canvasHost.clientHeight || 1;

    var renderer;
    try {
        renderer = new THREE.WebGLRenderer({
            antialias: PROFILE.antialias,
            alpha: true,
            powerPreference: 'high-performance'
        });
    } catch (e) {
        goStatic();
        return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, PROFILE.dpr));
    renderer.setSize(width, height, false);
    renderer.setClearAlpha(0);
    if ('outputEncoding' in renderer && THREE.sRGBEncoding) {
        renderer.outputEncoding = THREE.sRGBEncoding;
    }
    if (THREE.ACESFilmicToneMapping) {
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.80;
    }
    renderer.domElement.style.pointerEvents = 'none';
    canvasHost.appendChild(renderer.domElement);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(33, width / height, 0.1, 120);
    camera.position.set(0, 0.1, 9.6);

    var world = new THREE.Group();
    scene.add(world);

    /* Disposal ledger — every geometry, material and texture registers here. */
    var disposables = [];
    function track(obj) { disposables.push(obj); return obj; }

    /* ------------------------------------------------------------------
       Theme
       ------------------------------------------------------------------ */

    var theme = { dark: docEl.classList.contains('dark'), t: 0 };

    var themeObserver = null;
    if ('MutationObserver' in window) {
        themeObserver = new MutationObserver(function () {
            theme.dark = docEl.classList.contains('dark');
        });
        themeObserver.observe(docEl, { attributes: true, attributeFilter: ['class'] });
    }

    /* ------------------------------------------------------------------
       Procedural studio environment

       A tiny emissive room rendered to a PMREM cube. This is what makes the
       metal read as metal: the surfaces reflect large soft panels rather
       than a flat colour. It costs one render at startup.
       ------------------------------------------------------------------ */

    var envMap = null;

    function buildEnvironment() {
        var envScene = new THREE.Scene();
        var junk = [];

        function panel(color, intensity, w, h, pos, rot) {
            var mat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(color).multiplyScalar(intensity),
                side: THREE.DoubleSide
            });
            var geo = new THREE.PlaneGeometry(w, h);
            var m = new THREE.Mesh(geo, mat);
            m.position.set(pos[0], pos[1], pos[2]);
            if (rot) m.rotation.set(rot[0], rot[1], rot[2]);
            envScene.add(m);
            junk.push(geo, mat);
            return m;
        }

        /* Room shell — dark, so reflections have something to fall off into */
        var roomGeo = new THREE.BoxGeometry(26, 26, 26);
        var roomMat = new THREE.MeshBasicMaterial({ color: 0x05060c, side: THREE.BackSide });
        envScene.add(new THREE.Mesh(roomGeo, roomMat));
        junk.push(roomGeo, roomMat);

        /* Large soft key from above-front — the main form-defining highlight */
        panel(0xffd9a0, 0.48, 13, 9, [0, 8.5, 5], [Math.PI / 2.4, 0, 0]);
        /* Cool rim from the left — separates the silhouette */
        panel(0x3f7dff, 1.35, 7, 15, [-8.5, 1.5, -2.5], [0, Math.PI / 2.1, 0]);
        /* Violet bounce from the right */
        panel(0x7a3fff, 1.25, 7, 13, [8.5, 0.5, -3.5], [0, -Math.PI / 2.1, 0]);
        /* Warm floor card — gives the lower mass a golden underside */
        panel(0xff8a1a, 0.75, 9, 9, [1.5, -7.5, 2], [-Math.PI / 2.2, 0, 0]);
        /* Tight specular strip — the crisp highlight along bevelled edges */
        panel(0xffe9c4, 0.95, 1.2, 13, [-2.5, 4.5, 7.5], [0.2, 0.1, 0]);

        var pmrem = new THREE.PMREMGenerator(renderer);
        var rt = pmrem.fromScene(envScene, PROFILE.envSigma);
        pmrem.dispose();

        junk.forEach(function (o) {
            if (o && o.dispose) o.dispose();
        });

        track(rt);
        return rt.texture;
    }

    try {
        envMap = buildEnvironment();
        scene.environment = envMap;
    } catch (e) {
        envMap = null;
    }

    /* ------------------------------------------------------------------
       Geometry helpers
       ------------------------------------------------------------------ */

    /* Superellipse point. n=2 is a circle, higher n approaches a square.
       n between 6 and 9 gives the flat machined face with a tight radius
       that reads as a milled edge rather than a soft primitive. */
    function squircle(theta, rx, rz, n) {
        var ct = Math.cos(theta), st = Math.sin(theta);
        var sx = Math.sign(ct) * Math.pow(Math.abs(ct), 2 / n);
        var sz = Math.sign(st) * Math.pow(Math.abs(st), 2 / n);
        return [rx * sx, rz * sz];
    }

    /* Loft a stack of squircle rings into a closed solid. Each ring is
       { y, rx, rz, n, ox, oz, twist }. Returns BufferGeometry with flat
       faces on the sides and proper caps, which is what lets the bevelled
       highlight run along an edge. */
    function loft(rings, segs) {
        var pos = [], norm = [], idx = [];
        var cols = segs;

        /* Side surface */
        for (var r = 0; r < rings.length; r++) {
            var ring = rings[r];
            for (var s = 0; s < cols; s++) {
                var th = (s / cols) * Math.PI * 2 + (ring.twist || 0);
                var p = squircle(th, ring.rx, ring.rz, ring.n);
                pos.push(p[0] + (ring.ox || 0), ring.y, p[1] + (ring.oz || 0));
                norm.push(0, 0, 0);
            }
        }
        for (var r2 = 0; r2 < rings.length - 1; r2++) {
            for (var s2 = 0; s2 < cols; s2++) {
                var a = r2 * cols + s2;
                var b = r2 * cols + ((s2 + 1) % cols);
                var c = (r2 + 1) * cols + ((s2 + 1) % cols);
                var d = (r2 + 1) * cols + s2;
                idx.push(a, b, c, a, c, d);
            }
        }

        var geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        geo.setIndex(idx);
        geo.computeVertexNormals();

        /* Caps: fan from a centre vertex on the top and bottom rings */
        var merged = mergeCap(geo, rings, cols, true);
        merged = mergeCap(merged, rings, cols, false);
        merged.computeVertexNormals();
        return merged;
    }

    /* Append a flat cap at the top or bottom ring. Kept separate so the cap
       normal is exactly the ring plane rather than an averaged bevel. */
    function mergeCap(geo, rings, cols, top) {
        var ring = top ? rings[rings.length - 1] : rings[0];
        var y = ring.y;
        var verts = [];
        var indices = [];
        var baseIdx = geo.attributes.position.count;

        verts.push(ring.ox || 0, y, ring.oz || 0);
        for (var s = 0; s < cols; s++) {
            var th = (s / cols) * Math.PI * 2 + (ring.twist || 0);
            var p = squircle(th, ring.rx, ring.rz, ring.n);
            verts.push(p[0] + (ring.ox || 0), y, p[1] + (ring.oz || 0));
        }
        for (var s2 = 0; s2 < cols; s2++) {
            var a = baseIdx + 1 + s2;
            var b = baseIdx + 1 + ((s2 + 1) % cols);
            if (top) indices.push(baseIdx, a, b);
            else indices.push(baseIdx, b, a);
        }

        var g2 = new THREE.BufferGeometry();
        var oldPos = geo.attributes.position.array;
        var oldIdx = geo.index ? geo.index.array : [];
        var allPos = new Float32Array(oldPos.length + verts.length);
        allPos.set(oldPos, 0);
        allPos.set(verts, oldPos.length);
        var allIdx = new Uint32Array(oldIdx.length + indices.length);
        allIdx.set(oldIdx, 0);
        allIdx.set(indices, oldIdx.length);

        g2.setAttribute('position', new THREE.BufferAttribute(allPos, 3));
        g2.setIndex(new THREE.BufferAttribute(allIdx, 1));
        geo.dispose();
        return g2;
    }

    /* Extruded flat plate with a real bevel — used for the machined collars
       and the spine. ExtrudeGeometry's bevel is what gives the crisp
       highlight line along the edge. */
    function plate(shapeFn, depth, bevel) {
        var sh = new THREE.Shape();
        shapeFn(sh);
        var geo = new THREE.ExtrudeGeometry(sh, {
            depth: depth,
            bevelEnabled: true,
            bevelThickness: bevel,
            bevelSize: bevel,
            bevelSegments: 2,
            curveSegments: 6
        });
        geo.center();
        return geo;
    }

    /* ------------------------------------------------------------------
       Materials
       ------------------------------------------------------------------ */

    var matMetal = track(new THREE.MeshStandardMaterial({
        color: 0x4a5a9e,
        metalness: 0.92,
        roughness: 0.30,
        envMapIntensity: 1.15
    }));

    var matMetalDark = track(new THREE.MeshStandardMaterial({
        color: 0x1d2140,
        metalness: 0.9,
        roughness: 0.46,
        envMapIntensity: 0.9
    }));

    var matBrass = track(new THREE.MeshStandardMaterial({
        color: 0xc08a2e,
        metalness: 0.95,
        roughness: 0.32,
        envMapIntensity: 1.2
    }));

    /* The two glass masses. MeshPhysicalMaterial with transmission would be
       ideal but costs a full extra scene render per frame; instead these are
       thin, dark-tinted transmissive shells lit by the environment, which
       reads as optical glass at this scale for a fraction of the cost. */
    var matGlassLow = track(new THREE.MeshStandardMaterial({
        color: 0x2f5ee0,
        metalness: 0.35,
        roughness: 0.16,
        transparent: true,
        opacity: 0.80,
        envMapIntensity: 1.25,
        emissive: new THREE.Color(C.deepBlue),
        emissiveIntensity: 0.30,
        flatShading: true,
        side: THREE.DoubleSide
    }));

    var matGlassHigh = track(new THREE.MeshPhysicalMaterial({
        color: C.purple,
        metalness: 0.0,
        roughness: 0.05,
        transparent: true,
        opacity: 0.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        envMapIntensity: 2.0,
        side: THREE.DoubleSide
    }));

    /* ------------------------------------------------------------------
       The sculpture

       Two masses, one fault. The lower mass is wide and stable, tapering
       upward; the upper mass is narrower, displaced to the right and tilted,
       as if the top of the column were caught mid-separation. A machined
       spine runs up the back and holds them together, which is what makes
       the asymmetry read as engineered rather than accidental.
       ------------------------------------------------------------------ */

    var sculpture = new THREE.Group();
    world.add(sculpture);

    var SEGS = PROFILE.ringSegs;

    /* Lower mass — a plinth that rises and tapers */
    var lowerRings = [
        { y: -2.28, rx: 1.16, rz: 0.30, n: 12.0, ox:  0.14, oz: 0.00 },
        { y: -2.14, rx: 1.34, rz: 0.34, n: 12.0, ox:  0.08, oz: 0.01 },
        { y: -1.86, rx: 1.40, rz: 0.35, n: 11.0, ox:  0.00, oz: 0.02 },
        { y: -1.44, rx: 1.34, rz: 0.34, n: 10.0, ox: -0.09, oz: 0.02 },
        { y: -1.02, rx: 1.22, rz: 0.32, n: 9.4,  ox: -0.17, oz: 0.02 },
        { y: -0.66, rx: 1.09, rz: 0.30, n: 9.0,  ox: -0.24, oz: 0.01 },
        { y: -0.40, rx: 0.99, rz: 0.28, n: 8.8,  ox: -0.29, oz: 0.01 },
        { y: -0.28, rx: 0.93, rz: 0.27, n: 8.8,  ox: -0.31, oz: 0.00 }
    ];
    var lowerMass = new THREE.Mesh(track(loft(lowerRings, SEGS)), matGlassLow);
    lowerMass.position.x = -0.04;
    lowerMass.rotation.z = 0.15;
    sculpture.add(lowerMass);

    /* Upper mass — narrower, displaced right, and rotated. Its underside is
       angled to echo the fault plane. */
    var upperRings = [
        { y:  0.00, rx: 0.88, rz: 0.26, n: 8.8, ox: -0.04, oz: 0.00 },
        { y:  0.14, rx: 0.97, rz: 0.28, n: 9.0, ox:  0.03, oz: 0.01 },
        { y:  0.46, rx: 1.02, rz: 0.30, n: 9.4, ox:  0.12, oz: 0.01 },
        { y:  0.88, rx: 0.98, rz: 0.29, n: 9.8, ox:  0.20, oz: 0.01 },
        { y:  1.28, rx: 0.87, rz: 0.26, n: 10.0, ox: 0.26, oz: 0.01 },
        { y:  1.62, rx: 0.70, rz: 0.22, n: 10.5, ox: 0.30, oz: 0.00 },
        { y:  1.84, rx: 0.50, rz: 0.17, n: 11.0, ox: 0.33, oz: 0.00 }
    ];
    var upperMass = new THREE.Mesh(track(loft(upperRings, SEGS)), matGlassHigh);
    upperMass.position.set(0.30, 0.30, -0.02);
    upperMass.rotation.set(0.02, 0.07, 0.15);
    sculpture.add(upperMass);

    /* The fault plane: a thin machined slab spanning the gap, catching light
       along its cut edge. This is the line the eye follows. */
    var faultGeo = track(new THREE.BoxGeometry(1.62, 0.035, 0.52));
    var faultPlate = new THREE.Mesh(faultGeo, matMetal);
    faultPlate.position.set(0.03, 0.03, 0.0);
    faultPlate.rotation.set(0.04, 0.03, 0.15);
    sculpture.add(faultPlate);

    /* Machined spine up the back — the engineering that holds the two masses.
       A flat bar with a real bevel, so it takes a crisp highlight. */
    var spineGeo = track(plate(function (sh) {
        sh.moveTo(-0.30, -0.10);
        sh.lineTo(0.30, -0.10);
        sh.lineTo(0.20, 2.10);
        sh.lineTo(-0.16, 2.10);
        sh.closePath();
    }, 0.14, 0.028));
    var spine = new THREE.Mesh(spineGeo, matMetalDark);
    spine.position.set(0.06, 0.16, -0.46);
    spine.rotation.set(0, 0.06, 0.02);
    sculpture.add(spine);

    /* Collars: two precision rings clamping the spine to each mass. These are
       the "mechanical elements" and they are what the upper mass pivots on. */
    var collarGeo = track(plate(function (sh) {
        var n = 44;
        for (var i = 0; i < n; i++) {
            var a = (i / n) * Math.PI * 2;
            var r = 0.30 + Math.cos(a * 4) * 0.018;
            var x = Math.cos(a) * r, y = Math.sin(a) * r;
            if (i === 0) sh.moveTo(x, y); else sh.lineTo(x, y);
        }
        sh.closePath();
        sh.holes.push((function () {
            var p = new THREE.Path();
            var m = 40;
            for (var j = 0; j < m; j++) {
                var b = (j / m) * Math.PI * 2;
                var x2 = Math.cos(b) * 0.19, y2 = Math.sin(b) * 0.19;
                if (j === 0) p.moveTo(x2, y2); else p.lineTo(x2, y2);
            }
            p.closePath();
            return p;
        })());
    }, 0.10, 0.012));
    var collarA = new THREE.Mesh(collarGeo, matBrass);
    collarA.position.set(0.06, -0.44, -0.44);
    collarA.rotation.x = Math.PI / 2;
    sculpture.add(collarA);

    var collarB = new THREE.Mesh(collarGeo, matBrass);
    collarB.position.set(0.20, 0.66, -0.42);
    collarB.rotation.x = Math.PI / 2;
    collarB.scale.setScalar(0.86);
    sculpture.add(collarB);

    /* Base foot: a machined block that grounds the whole thing, so the
       sculpture does not appear to float. */
    var footGeo = track(plate(function (sh) {
        sh.moveTo(-0.92, -0.26);
        sh.lineTo(0.92, -0.26);
        sh.lineTo(1.06, 0.26);
        sh.lineTo(-1.06, 0.26);
        sh.closePath();
    }, 0.78, 0.04));
    var foot = new THREE.Mesh(footGeo, matMetalDark);
    foot.position.set(-0.10, -2.36, 0);
    foot.rotation.x = -Math.PI / 2;
    sculpture.add(foot);


    /* ------------------------------------------------------------------
       Machined detailing

       Thin turned bands wrapping each mass. Every one of these is a place
       where the surface turns through a hard angle, so it catches a crisp
       horizontal highlight. Without them the masses read as smooth volume;
       with them they read as components that were made.
       ------------------------------------------------------------------ */

    var matBand = track(new THREE.MeshStandardMaterial({
        color: 0x7b85b4,
        metalness: 0.94,
        roughness: 0.33,
        envMapIntensity: 1.05
    }));

    function band(y, r, thickness, tilt) {
        var g = track(new THREE.CylinderGeometry(r, r, thickness, 44, 1, true));
        var m = new THREE.Mesh(g, matBand);
        m.position.y = y;
        if (tilt) m.rotation.z = tilt;
        return m;
    }

    /* Lower mass: three bands marking its taper */
    sculpture.add(band(-1.86, 1.412, 0.032, 0.02));
    sculpture.add(band(-1.44, 1.352, 0.028, 0.02));
    sculpture.add(band(-1.02, 1.232, 0.026, 0.02));

    /* Upper mass: two bands, carried with the mass so they travel with it */
    var bandHiA = new THREE.Mesh(track(new THREE.CylinderGeometry(1.030, 1.030, 0.030, 40, 1, true)), matBand);
    bandHiA.position.y = 0.46;
    upperMass.add(bandHiA);

    var bandHiB = new THREE.Mesh(track(new THREE.CylinderGeometry(0.878, 0.878, 0.026, 40, 1, true)), matBand);
    bandHiB.position.y = 1.28;
    upperMass.add(bandHiB);

    /* Vertical flutes on the lower mass. Six machined grooves, each a thin
       dark rib, giving the plinth a measured rhythm rather than a blank
       face. Placed on the front arc only, so they catch the key light. */
    var fluteGeo = track(new THREE.BoxGeometry(0.018, 0.62, 0.030));
    var matFlute = track(new THREE.MeshStandardMaterial({
        color: 0x14182e,
        metalness: 0.7,
        roughness: 0.55
    }));
    for (var fl = 0; fl < 6; fl++) {
        var ang = -0.62 + fl * 0.248;
        var flute = new THREE.Mesh(fluteGeo, matFlute);
        flute.position.set(
            Math.sin(ang) * 1.24 - 0.12,
            -1.46,
            Math.cos(ang) * 0.34 + 0.12
        );
        flute.rotation.y = ang;
        flute.rotation.z = 0.03;
        sculpture.add(flute);
    }

    /* ------------------------------------------------------------------
       The chamber

       The heart of the piece: a precision glass vessel suspended in the
       fault, holding layered optical discs and a pool of light. This is
       where incoming information is visibly processed before it leaves.
       ------------------------------------------------------------------ */

    var chamber = new THREE.Group();
    chamber.position.set(-0.02, 0.02, 0.20);
    sculpture.add(chamber);

    /* Outer vessel — a lathed capsule. Lathe gives a true turned profile,
       which is what a machined glass part looks like. */
    var vesselProfile = [];
    (function () {
        var pts = 18;
        for (var i = 0; i <= pts; i++) {
            var t = i / pts;
            var y = -0.34 + t * 0.68;
            var r = 0.30 * Math.sin(Math.PI * (0.12 + t * 0.76));
            vesselProfile.push(new THREE.Vector2(Math.max(0.055, r), y));
        }
    })();

    var matVessel = track(new THREE.MeshStandardMaterial({
        color: 0xdfe8ff,
        metalness: 0.5,
        roughness: 0.06,
        transparent: true,
        opacity: 0.30,
        envMapIntensity: 2.0,
        side: THREE.DoubleSide
    }));
    var vessel = new THREE.Mesh(track(new THREE.LatheGeometry(vesselProfile, 40)), matVessel);
    chamber.add(vessel);

    /* Internal optical discs — thin stacked plates, each slightly rotated, so
       light passing through reads as layers rather than a solid block. */
    var discGeo = track(new THREE.CylinderGeometry(0.235, 0.235, 0.008, 32, 1, true));
    var matDisc = track(new THREE.MeshStandardMaterial({
        color: C.mustard,
        metalness: 1.0,
        roughness: 0.18,
        transparent: true,
        opacity: 0.55,
        envMapIntensity: 1.8,
        side: THREE.DoubleSide
    }));
    var discs = [];
    for (var d = 0; d < 4; d++) {
        var disc = new THREE.Mesh(discGeo, matDisc);
        disc.position.y = -0.19 + d * 0.125;
        disc.rotation.z = d * 0.16;
        chamber.add(disc);
        discs.push(disc);
    }

    /* The light itself: a small emissive core plus one soft sprite. Restraint
       matters here — the chamber should glow, not bloom. */
    var matCore = track(new THREE.MeshBasicMaterial({
        color: new THREE.Color(C.golden),
        transparent: true,
        opacity: 0.0
    }));
    var core = new THREE.Mesh(track(new THREE.SphereGeometry(0.085, 20, 16)), matCore);
    chamber.add(core);

    var glowTex = (function () {
        var s = 128;
        var cv = document.createElement('canvas');
        cv.width = cv.height = s;
        var ctx = cv.getContext('2d');
        var g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
        g.addColorStop(0.0, 'rgba(255,255,255,1)');
        g.addColorStop(0.22, 'rgba(255,255,255,0.6)');
        g.addColorStop(0.55, 'rgba(255,255,255,0.16)');
        g.addColorStop(1.0, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, s, s);
        var t = new THREE.CanvasTexture(cv);
        t.needsUpdate = true;
        return track(t);
    })();

    var matGlow = track(new THREE.SpriteMaterial({
        map: glowTex,
        color: new THREE.Color(C.golden),
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    }));
    var glowSprite = new THREE.Sprite(matGlow);
    glowSprite.scale.setScalar(1.25);
    chamber.add(glowSprite);

    /* ------------------------------------------------------------------
       Lighting

       Studio setup. One large key from upper front-left, a cool rim from
       behind right to separate the silhouette, and a warm kicker low left.
       The chamber contributes its own point light once it ignites.
       ------------------------------------------------------------------ */

    var keyLight = new THREE.DirectionalLight(0xfff4e2, 2.4);
    keyLight.position.set(-4.2, 6.0, 5.2);
    scene.add(keyLight);

    var rimLight = new THREE.DirectionalLight(0x9fd0ff, 1.5);
    rimLight.position.set(5.0, 2.2, -4.6);
    scene.add(rimLight);

    var warmLight = new THREE.DirectionalLight(0xffb066, 0.75);
    warmLight.position.set(-3.0, -3.4, 2.6);
    scene.add(warmLight);

    var chamberLight = new THREE.PointLight(C.golden, 0.0, 6.0, 2.0);
    chamber.add(chamberLight);

    var fillLight = new THREE.HemisphereLight(0x9fb8ff, 0x1a1030, 0.35);
    scene.add(fillLight);

    /* ------------------------------------------------------------------
       Living intelligence

       Three open splines. None of them closes on itself: each enters the
       sculpture from outside, passes through or near the chamber, and leaves
       through a different surface. That is the metaphor — information goes
       in as raw signal and comes out as an organised result.

       Particles ride the curves with a per-particle phase offset, so the
       motion reads as flow rather than a scrolling texture.
       ------------------------------------------------------------------ */

    var streamPaths = [
        /* Enters low left, rises through the chamber, exits the upper mass
           toward the top right. The primary pathway. */
        [
            [-2.55, -2.15, 0.55], [-1.70, -1.45, 0.42], [-0.95, -0.72, 0.30],
            [-0.20, -0.10, 0.22], [0.16, 0.34, 0.16], [0.52, 0.92, 0.06],
            [0.86, 1.52, -0.06], [1.14, 2.10, -0.18]
        ],
        /* Enters from behind the base, arcs up the left face, and terminates
           at the chamber rim. A converging pathway. */
        [
            [-1.95, -2.30, -0.75], [-1.42, -1.62, -0.48], [-0.92, -0.98, -0.22],
            [-0.52, -0.44, 0.02], [-0.22, 0.00, 0.10]
        ],
        /* Leaves the chamber and travels down the right flank to the foot.
           An output pathway, deliberately going against the first. */
        [
            [0.14, 0.12, 0.14], [0.62, -0.22, 0.28], [1.08, -0.78, 0.40],
            [1.46, -1.42, 0.50], [1.62, -2.05, 0.42]
        ]
    ];

    var streamCurves = [];
    for (var sp = 0; sp < streamPaths.length; sp++) {
        var pts = [];
        for (var pp = 0; pp < streamPaths[sp].length; pp++) {
            var v = streamPaths[sp][pp];
            pts.push(new THREE.Vector3(v[0], v[1], v[2]));
        }
        streamCurves.push(track(new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5)));
    }

    var ACTIVE_STREAMS = Math.min(PROFILE.streams, streamCurves.length);

    /* Faint guide tubes so the pathways are legible even when the particles
       are between beats. Kept very thin and dim. */
    var matGuide = track(new THREE.MeshBasicMaterial({
        color: new THREE.Color(C.cyan),
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    }));
    var guides = [];
    for (var g = 0; g < ACTIVE_STREAMS; g++) {
        var tube = new THREE.Mesh(
            track(new THREE.TubeGeometry(streamCurves[g], 48, 0.0075, 5, false)),
            matGuide
        );
        world.add(tube);
        guides.push(tube);
    }

    /* Particle system. One Points object for all streams — a single draw call
       instead of three. */
    var P_COUNT = PROFILE.particles;

    var pPos = new Float32Array(P_COUNT * 3);
    var pColor = new Float32Array(P_COUNT * 3);
    var pSize = new Float32Array(P_COUNT);
    var pPhase = new Float32Array(P_COUNT);
    var pSpeed = new Float32Array(P_COUNT);
    var pStream = new Uint8Array(P_COUNT);

    var colCyan = new THREE.Color(C.cyan);
    var colGold = new THREE.Color(C.golden);
    var colMagenta = new THREE.Color(C.magenta);

    (function seedParticles() {
        for (var i = 0; i < P_COUNT; i++) {
            var s = i % ACTIVE_STREAMS;
            pStream[i] = s;
            pPhase[i] = Math.random();
            /* Uneven speeds: a few fast couriers, many slow ones. */
            pSpeed[i] = 0.055 + Math.random() * 0.10 + (i % 7 === 0 ? 0.06 : 0);
            pSize[i] = 2.2 + Math.random() * 3.4;

            /* Colour by role: inputs cyan, the through-path gold, outputs
               magenta. The palette does the storytelling. */
            var col = s === 0 ? colGold : (s === 1 ? colCyan : colMagenta);
            var j = 0.85 + Math.random() * 0.3;
            pColor[i * 3] = col.r * j;
            pColor[i * 3 + 1] = col.g * j;
            pColor[i * 3 + 2] = col.b * j;
        }
    })();

    var particleGeo = track(new THREE.BufferGeometry());
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    particleGeo.setAttribute('aColor', new THREE.BufferAttribute(pColor, 3));
    particleGeo.setAttribute('aSize', new THREE.BufferAttribute(pSize, 1));

    var matParticles = track(new THREE.ShaderMaterial({
        uniforms: {
            uReveal: { value: 0.0 },
            uDpr: { value: Math.min(window.devicePixelRatio || 1, PROFILE.dpr) },
            uTime: { value: 0.0 }
        },
        vertexShader: [
            'attribute vec3 aColor;',
            'attribute float aSize;',
            'uniform float uDpr;',
            'uniform float uReveal;',
            'varying vec3 vColor;',
            'varying float vFade;',
            'void main() {',
            '  vColor = aColor;',
            '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
            '  gl_Position = projectionMatrix * mv;',
            '  gl_PointSize = aSize * uDpr * (7.0 / max(0.001, -mv.z));',
            '  vFade = uReveal;',
            '}'
        ].join('\n'),
        fragmentShader: [
            'varying vec3 vColor;',
            'varying float vFade;',
            'void main() {',
            '  vec2 d = gl_PointCoord - vec2(0.5);',
            '  float r = length(d);',
            '  if (r > 0.5) discard;',
            '  float soft = smoothstep(0.5, 0.06, r);',
            '  float a = soft * vFade;',
            '  gl_FragColor = vec4(vColor * (0.7 + soft * 0.9), a);',
            '}'
        ].join('\n'),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    }));

    var particles = new THREE.Points(particleGeo, matParticles);
    particles.frustumCulled = false;
    world.add(particles);

    /* ------------------------------------------------------------------
       Signature moment

       Recurring beat: a pulse leaves the base, travels the primary pathway,
       flares the chamber, and discharges out of the upper mass. It runs on a
       slow cycle with long quiet stretches, so it reads as an event rather
       than a loop.
       ------------------------------------------------------------------ */

    var pulse = { t: -1, active: false, next: 3.2 };
    var PULSE_DUR = 4.6;

    /* ------------------------------------------------------------------
       Camera framing

       The sculpture is tall, so the camera sits slightly above centre and
       looks a touch downward. Parallax is a few centimetres of travel at
       most — enough to feel alive, never enough to feel like a turntable.
       ------------------------------------------------------------------ */

    var camBase = new THREE.Vector3(0, 0.12, 9.6);
    var lookTarget = new THREE.Vector3(0, 0.05, 0);
    var pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false };

    function onPointerMove(ev) {
        var rect = root.getBoundingClientRect();
        pointer.tx = ((ev.clientX - rect.left) / rect.width - 0.5) * 2;
        pointer.ty = ((ev.clientY - rect.top) / rect.height - 0.5) * 2;
        pointer.active = true;
    }
    function onPointerLeave() {
        pointer.tx = 0;
        pointer.ty = 0;
        pointer.active = false;
    }
    if (window.matchMedia('(pointer: fine)').matches) {
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        document.addEventListener('pointerleave', onPointerLeave, { passive: true });
    }

    /* ------------------------------------------------------------------
       Resize and visibility
       ------------------------------------------------------------------ */

    var resizeTimer = null;
    function resize() {
        var w = canvasHost.clientWidth || 1;
        var h = canvasHost.clientHeight || 1;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
        matParticles.uniforms.uDpr.value = Math.min(window.devicePixelRatio || 1, PROFILE.dpr);
    }
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 160);
    }, { passive: true });

    var visible = true;
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
            visible = entries[0].isIntersecting;
        }, { threshold: 0.01 }).observe(root);
    }
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) visible = false;
    });

    /* ------------------------------------------------------------------
       Theme application
       ------------------------------------------------------------------ */

    /* Base values the theme scales from. Keeping them in one place stops the
       render loop and the theme from fighting over the same material. */
    var BASE = {
        glassLowOpacity: 0.72,
        glassHighOpacity: 0.70,
        glassLowEnv: 1.25,
        glassHighEnv: 1.30,
        glassLowEmissive: 0.30,
        glassHighEmissive: 0.32,
        metalEnv: 1.15,
        metalDarkEnv: 0.90,
        brassEnv: 1.20
    };

    function applyTheme() {
        theme.t += ((theme.dark ? 1 : 0) - theme.t) * 0.05;
        var t = theme.t;

        /* Dark mode is not an inversion. The stage darkens, so the glass can
           be a little more transparent and the rim does the separating work.
           In light mode the glass stays more solid so it holds its own
           against a brighter surround. */
        matGlassLow.envMapIntensity = BASE.glassLowEnv * (1 - t * 0.22);
        matGlassHigh.envMapIntensity = BASE.glassHighEnv * (1 - t * 0.20);
        matGlassLow.emissiveIntensity = BASE.glassLowEmissive * (1 + t * 0.55);
        matGlassHigh.emissiveIntensity = BASE.glassHighEmissive * (1 + t * 0.55);

        keyLight.intensity = 2.4 + t * 0.35;
        rimLight.intensity = 1.5 + t * 0.85;
        warmLight.intensity = 0.75 + t * 0.3;
        fillLight.intensity = 0.35 + t * 0.18;

        matMetal.envMapIntensity = BASE.metalEnv * (1 + t * 0.25);
        matMetalDark.envMapIntensity = BASE.metalDarkEnv * (1 + t * 0.2);
        matBrass.envMapIntensity = BASE.brassEnv * (1 + t * 0.25);
    }

    /* ------------------------------------------------------------------
       Intro: the sculpture wakes in five beats
       ------------------------------------------------------------------ */

    var intro = { t: 0, done: false };
    var INTRO_DUR = 4.2;

    function clamp01(x) { return x < 0 ? 0 : (x > 1 ? 1 : x); }
    function easeOut(x) { return 1 - Math.pow(1 - x, 3); }
    function seg(p, a, b) { return clamp01((p - a) / (b - a)); }

    /* ------------------------------------------------------------------
       Render loop
       ------------------------------------------------------------------ */

    var clock = new THREE.Clock();
    var rafId = null;
    var elapsed = 0;
    var frameInterval = 1 / PROFILE.fps;
    var frameAccum = 0;

    var tmpA = new THREE.Vector3();
    var tmpB = new THREE.Vector3();

    function updateParticles(dt, reveal) {
        matParticles.uniforms.uReveal.value = reveal;
        if (reveal <= 0.001) return;

        for (var i = 0; i < P_COUNT; i++) {
            var curve = streamCurves[pStream[i] % streamCurves.length];
            pPhase[i] += pSpeed[i] * dt;
            if (pPhase[i] > 1) pPhase[i] -= 1;

            curve.getPointAt(pPhase[i], tmpA);
            pPos[i * 3] = tmpA.x;
            pPos[i * 3 + 1] = tmpA.y;
            pPos[i * 3 + 2] = tmpA.z;
        }
        particleGeo.attributes.position.needsUpdate = true;
    }

    function updatePulse(dt, t) {
        if (!pulse.active) {
            pulse.next -= dt;
            if (pulse.next <= 0) {
                pulse.active = true;
                pulse.t = 0;
            }
            return 0;
        }
        pulse.t += dt;
        if (pulse.t >= PULSE_DUR) {
            pulse.active = false;
            pulse.t = -1;
            pulse.next = 9 + Math.random() * 7;
            return 0;
        }
        /* One envelope: rise, peak at the chamber, fall away. */
        var x = pulse.t / PULSE_DUR;
        return Math.sin(Math.PI * clamp01(x));
    }

    function frame() {
        rafId = requestAnimationFrame(frame);

        var dt = clock.getDelta();
        if (!visible) return;

        /* Frame cap keeps a 120 Hz display from burning battery for no gain */
        frameAccum += dt;
        if (frameAccum < frameInterval) return;
        var step = frameAccum;
        frameAccum = 0;
        elapsed += step;

        applyTheme();

        /* Intro progression */
        if (!intro.done) {
            intro.t += step / INTRO_DUR;
            if (intro.t >= 1) { intro.t = 1; intro.done = true; }
        }
        var p = easeOut(intro.t);

        /* 1. Structure resolves — the masses fade up from the dark */
        var s1 = seg(p, 0.0, 0.34);
        matGlassLow.opacity = BASE.glassLowOpacity * (1 - theme.t * 0.14) * s1;
        matGlassHigh.opacity = BASE.glassHighOpacity * (1 - theme.t * 0.12) * s1;

        /* 2. Chamber ignites */
        var s2 = seg(p, 0.22, 0.58);
        var breath = 0.88 + Math.sin(elapsed * 1.15) * 0.12;
        var pulseGain = updatePulse(step, elapsed);
        var coreLevel = s2 * breath + pulseGain * 0.55;
        matCore.opacity = clamp01(coreLevel) * 0.95;
        matGlow.opacity = clamp01(s2 * (0.30 + pulseGain * 0.5));
        glowSprite.scale.setScalar(1.15 + pulseGain * 0.55);
        chamberLight.intensity = clamp01(s2 * 1.1 + pulseGain * 0.9) * 2.4;

        /* 3. Optics align — the discs settle into their resting offsets */
        var s3 = seg(p, 0.34, 0.72);
        for (var i = 0; i < discs.length; i++) {
            var rest = i * 0.16;
            discs[i].rotation.z = rest + Math.sin(elapsed * 0.35 + i) * 0.05;
            discs[i].position.y = (-0.19 + i * 0.125) + Math.sin(elapsed * 0.5 + i * 1.3) * 0.006;
        }
        matDisc.opacity = 0.55 * s3;

        /* 4. Streams appear */
        var s4 = seg(p, 0.48, 0.86);
        matGuide.opacity = 0.055 * s4;
        updateParticles(step, s4);

        /* 5. Structure breathes — a very slight counter-motion between the
           two masses, as if held apart by force rather than resting. */
        var s5 = seg(p, 0.60, 1.0);
        upperMass.position.y = 0.30 + Math.sin(elapsed * 0.42) * 0.012 * s5;
        upperMass.rotation.z = -0.075 + Math.sin(elapsed * 0.31) * 0.008 * s5;
        chamber.position.y = 0.06 + Math.sin(elapsed * 0.42 + 0.4) * 0.008 * s5;

        /* Camera: slow drift plus damped parallax. Never a full rotation. */
        pointer.x += (pointer.tx - pointer.x) * 0.045;
        pointer.y += (pointer.ty - pointer.y) * 0.045;
        var driftX = Math.sin(elapsed * 0.16) * 0.10;
        var driftY = Math.cos(elapsed * 0.13) * 0.05;

        camera.position.x = camBase.x + driftX + pointer.x * 0.42;
        camera.position.y = camBase.y + driftY - pointer.y * 0.26;
        camera.position.z = camBase.z - Math.abs(pointer.x) * 0.10;
        camera.lookAt(lookTarget);

        /* The object itself barely turns — this is parallax, not a turntable */
        sculpture.rotation.y = pointer.x * 0.10 + Math.sin(elapsed * 0.11) * 0.03;
        sculpture.rotation.x = -pointer.y * 0.045;

        renderer.render(scene, camera);
    }

    /* ------------------------------------------------------------------
       Teardown
       ------------------------------------------------------------------ */

    function dispose() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        if (themeObserver) themeObserver.disconnect();
        window.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerleave', onPointerLeave);
        disposables.forEach(function (d) {
            if (d && typeof d.dispose === 'function') {
                try { d.dispose(); } catch (e) {}
            }
        });
        try { renderer.dispose(); } catch (e) {}
        if (renderer.domElement && renderer.domElement.parentNode) {
            renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
    }
    window.addEventListener('pagehide', dispose, { once: true });

    renderer.domElement.addEventListener('webglcontextlost', function (ev) {
        ev.preventDefault();
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        goStatic();
    });

    if (reduceMotion.addEventListener) {
        reduceMotion.addEventListener('change', function () {
            if (reduceMotion.matches) {
                if (rafId) cancelAnimationFrame(rafId);
                rafId = null;
                goStatic();
            }
        });
    }

    /* ------------------------------------------------------------------
       Start
       ------------------------------------------------------------------ */

    root.classList.add('has-webgl');
    if (fallback) fallback.setAttribute('aria-hidden', 'true');
    frame();
})();
