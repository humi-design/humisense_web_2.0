/* ==========================================================================
   hero-3d — "THE LIVING INTELLIGENCE CORE"

   Three integrated systems, one sculpture:

     1. Kinetic metal vanes  — a small number of swept, cambered machined
        components orbiting the centre. They unfold, align and reassemble.
     2. Optical intelligence prism — a faceted, layered glass element at the
        centre. It carries the silhouette and holds the light.
     3. Neural light flow — thin pathways threading the prism's internal
        layers. They split at a junction, cross between layers and rejoin.

   Engineered precision outside, clarity at the core, connectivity running
   through it.

   Design notes
   ------------
   - No primitives. The vanes are swept from a hand-authored cambered
     section along an arc; the prism is lofted from explicit polygon rings
     with chamfer pairs, so its facets are cut rather than smooth.
   - Metal reads as metal through a procedural PMREM studio environment, not
     through flat colour.
   - The choreography is a 26 s cycle built from envelopes that are zero at
     both ends of the loop, so it is seamless by construction rather than by
     hiding a reset.
   - Ambient motion runs on elapsed time and never depends on scroll. Scroll
     adds a second, optional layer on top.

   Contract with the page: this module owns [data-sculpture-canvas] inside
   #hero-sculpture and toggles has-webgl / is-static. Nothing else in the
   hero belongs to it.

   Debug: append ?hero=clay to render the same geometry in matte clay, for
   form review. No effect on normal visits.
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
    var CLAY = /(\?|&)hero=clay(&|$)/.test(window.location.search);

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

    var TIER = narrow ? 'low' : (mem >= 4 && cores >= 4 ? 'high' : 'mid');

    var PROFILE = {
        high: { sides: 12, vaneSamples: 46, pulses: 30, tubeSegs: 44, dpr: 1.5, fps: 60, antialias: true, envSigma: 0.16, vanes: 4 },
        mid:  { sides: 10, vaneSamples: 34, pulses: 20, tubeSegs: 34, dpr: 1.4, fps: 60, antialias: true, envSigma: 0.22, vanes: 4 },
        low:  { sides: 8,  vaneSamples: 26, pulses: 12, tubeSegs: 26, dpr: 1.2, fps: 30, antialias: false, envSigma: 0.30, vanes: 3 }
    }[TIER];

    /* ------------------------------------------------------------------
       Palette — taken from the site's own tokens in humi.css
       ------------------------------------------------------------------ */

    var C = {
        mustard: 0xe8b23a,
        orange: 0xe8722e,
        magenta: 0xd63a7e,
        blue: 0x2f5cff,
        blueDeep: 0x1e3fd8,
        violet: 0x7b4dff,
        cyan: 0x12b5c9,
        steel: 0x8b98b8,
        steelDark: 0x2b3350
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
        renderer.toneMappingExposure = 0.86;
    }
    renderer.domElement.style.pointerEvents = 'none';
    canvasHost.appendChild(renderer.domElement);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(33, width / height, 0.1, 120);
    camera.position.set(0, 0.1, 6.1);

    var world = new THREE.Group();
    scene.add(world);

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
            var m2 = new THREE.MeshBasicMaterial({
                color: new THREE.Color(color).multiplyScalar(intensity),
                side: THREE.DoubleSide
            });
            var geo = new THREE.PlaneGeometry(w, h);
            var m = new THREE.Mesh(geo, m2);
            m.position.set(pos[0], pos[1], pos[2]);
            if (rot) m.rotation.set(rot[0], rot[1], rot[2]);
            envScene.add(m);
            junk.push(geo, m2);
            return m;
        }

        var roomGeo = new THREE.BoxGeometry(26, 26, 26);
        var roomMat = new THREE.MeshBasicMaterial({ color: 0x05060c, side: THREE.BackSide });
        envScene.add(new THREE.Mesh(roomGeo, roomMat));
        junk.push(roomGeo, roomMat);

        /* Large soft key from above-front — the form-defining highlight */
        panel(0xfff0d8, 0.55, 13, 9, [0, 8.5, 5], [Math.PI / 2.4, 0, 0]);
        /* Cool rim from the left — separates the silhouette */
        panel(0x4a86ff, 1.45, 7, 15, [-8.5, 1.5, -2.5], [0, Math.PI / 2.1, 0]);
        /* Violet bounce from the right */
        panel(0x8a55ff, 1.25, 7, 13, [8.5, 0.5, -3.5], [0, -Math.PI / 2.1, 0]);
        /* Warm floor card — gives the lower mass a golden underside */
        panel(0xff9a3a, 0.65, 9, 9, [1.5, -7.5, 2], [-Math.PI / 2.2, 0, 0]);
        /* Tight specular strips — the crisp highlight along machined edges */
        panel(0xfff3dd, 1.05, 1.1, 14, [-2.6, 4.5, 7.5], [0.2, 0.1, 0]);
        panel(0xdfeaff, 0.75, 1.0, 12, [3.1, 3.2, 7.0], [0.15, -0.12, 0]);

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
       Maths and geometry helpers
       ------------------------------------------------------------------ */

    function clamp01(x) { return x < 0 ? 0 : (x > 1 ? 1 : x); }
    function smooth(x) { x = clamp01(x); return x * x * (3 - 2 * x); }

    /* Trapezoid envelope: 0 outside [a,b], rises over fi, holds, falls over
       fo. Every envelope in the choreography starts and ends at zero, which
       is what makes the cycle loop without a visible reset. */
    function envelope(t, a, b, fi, fo) {
        if (t <= a || t >= b) return 0;
        var dur = b - a;
        var x = (t - a) / dur;
        var rIn = fi / dur, rOut = fo / dur;
        if (x < rIn) return smooth(x / rIn);
        if (x > 1 - rOut) return smooth((1 - x) / rOut);
        return 1;
    }

    /* Loft explicit polygon rings into a faceted solid. Unlike a squircle
       loft this keeps every facet flat and every chamfer pair crisp, which
       is what makes the prism read as a cut optical element. */
    function loftPoly(rings, sides) {
        var pos = [], idx = [];
        for (var r = 0; r < rings.length; r++) {
            var ring = rings[r];
            for (var s = 0; s < sides; s++) {
                var a = (s / sides) * Math.PI * 2 + (ring.twist || 0);
                pos.push(Math.cos(a) * ring.r, ring.y, Math.sin(a) * ring.r);
            }
        }
        for (var r2 = 0; r2 < rings.length - 1; r2++) {
            for (var s2 = 0; s2 < sides; s2++) {
                var a1 = r2 * sides + s2;
                var b1 = r2 * sides + ((s2 + 1) % sides);
                var c1 = (r2 + 1) * sides + ((s2 + 1) % sides);
                var d1 = (r2 + 1) * sides + s2;
                idx.push(a1, b1, c1, a1, c1, d1);
            }
        }
        var geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        geo.setIndex(idx);
        geo.computeVertexNormals();
        return geo;
    }

    /* Fan caps so a lofted or swept solid is closed. */
    function capRings(geo, rings, sides, top) {
        var ring = top ? rings[rings.length - 1] : rings[0];
        var oldPos = geo.attributes.position.array;
        var oldIdx = geo.index ? geo.index.array : [];
        var baseIdx = oldPos.length / 3;
        var extra = [0, ring.y, 0];
        var newIdx = [];
        for (var s = 0; s < sides; s++) {
            var a = (s / sides) * Math.PI * 2;
            extra.push(Math.cos(a) * ring.r, ring.y, Math.sin(a) * ring.r);
        }
        for (var s2 = 0; s2 < sides; s2++) {
            var i1 = baseIdx + 1 + s2;
            var i2 = baseIdx + 1 + ((s2 + 1) % sides);
            if (top) newIdx.push(baseIdx, i1, i2);
            else newIdx.push(baseIdx, i2, i1);
        }
        var allPos = new Float32Array(oldPos.length + extra.length);
        allPos.set(oldPos, 0);
        allPos.set(extra, oldPos.length);
        var allIdx = new Uint32Array(oldIdx.length + newIdx.length);
        allIdx.set(oldIdx, 0);
        allIdx.set(newIdx, oldIdx.length);
        var g2 = new THREE.BufferGeometry();
        g2.setAttribute('position', new THREE.BufferAttribute(allPos, 3));
        g2.setIndex(new THREE.BufferAttribute(allIdx, 1));
        geo.dispose();
        return g2;
    }

    /* Sweep a hand-authored section along an arc to build a curved vane.

       The sweep advances along the arc, the section's x runs radially
       (thickness) and its y runs vertically (height). The surface is
       therefore tangent to (arc, vertical), which puts its broad face normal
       on the radial axis — the vane presents its full face to a viewer
       standing outside the axis, instead of turning edge-on. */
    function sweepVane(o) {
        var n = o.samples, S = o.section.length;
        var pos = [], idx = [];
        var a0 = o.a0, span = o.span, R = o.radius;

        var centres = [], radials = [];
        for (var i = 0; i <= n; i++) {
            var u = i / n;
            var ang = a0 + u * span;
            /* camber bulges the vane outward at its centre, so it curves
               around the core rather than sitting on a plain cylinder */
            var r = R + Math.sin(u * Math.PI) * (o.camber || 0);
            centres.push(new THREE.Vector3(Math.cos(ang) * r, o.y0, Math.sin(ang) * r));
            radials.push(new THREE.Vector3(Math.cos(ang), 0, Math.sin(ang)));
        }

        for (var i2 = 0; i2 <= n; i2++) {
            var u2 = i2 / n;
            var c = centres[i2];
            var rad = radials[i2];

            /* Height is widest at the middle of the arc and tapers to the
               tips, which is what gives the vane its leaf silhouette.
               Thickness stays constant — a machined part does not vary
               gauge along its length. */
            var hf = o.height * (0.30 + 0.70 * Math.sin(Math.PI * u2));
            for (var s = 0; s < S; s++) {
                var sx = o.section[s][0] * o.thick;
                var sy = o.section[s][1] * hf;
                pos.push(c.x + rad.x * sx, c.y + sy, c.z + rad.z * sx);
            }
        }

        for (var i3 = 0; i3 < n; i3++) {
            for (var s3 = 0; s3 < S; s3++) {
                var p1 = i3 * S + s3;
                var p2 = i3 * S + ((s3 + 1) % S);
                var p3 = (i3 + 1) * S + ((s3 + 1) % S);
                var p4 = (i3 + 1) * S + s3;
                idx.push(p1, p2, p3, p1, p3, p4);
            }
        }

        var geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        geo.setIndex(idx);
        geo.computeVertexNormals();
        return capBladeEnds(geo, centres[0], centres[n], S, n);
    }

    /* Fan caps for the swept blade's two open ends. */
    function capBladeEnds(geo, firstC, lastC, S, n) {
        var oldPos = geo.attributes.position.array;
        var oldIdx = geo.index ? geo.index.array : [];
        var extra = [], newIdx = [];

        var base0 = oldPos.length / 3;
        extra.push(firstC.x, firstC.y, firstC.z);
        for (var s = 0; s < S; s++) {
            extra.push(oldPos[s * 3], oldPos[s * 3 + 1], oldPos[s * 3 + 2]);
        }
        for (var s2 = 0; s2 < S; s2++) {
            newIdx.push(base0, base0 + 1 + s2, base0 + 1 + ((s2 + 1) % S));
        }

        var base1 = base0 + 1 + S;
        var lastBase = n * S;
        extra.push(lastC.x, lastC.y, lastC.z);
        for (var s3 = 0; s3 < S; s3++) {
            var i1 = lastBase + s3;
            extra.push(oldPos[i1 * 3], oldPos[i1 * 3 + 1], oldPos[i1 * 3 + 2]);
        }
        for (var s4 = 0; s4 < S; s4++) {
            newIdx.push(base1, base1 + 1 + ((s4 + 1) % S), base1 + 1 + s4);
        }

        var allPos = new Float32Array(oldPos.length + extra.length);
        allPos.set(oldPos, 0);
        allPos.set(extra, oldPos.length);
        var allIdx = new Uint32Array(oldIdx.length + newIdx.length);
        allIdx.set(oldIdx, 0);
        allIdx.set(newIdx, oldIdx.length);

        var g2 = new THREE.BufferGeometry();
        g2.setAttribute('position', new THREE.BufferAttribute(allPos, 3));
        g2.setIndex(new THREE.BufferAttribute(allIdx, 1));
        geo.dispose();
        return g2;
    }

    /* Extruded flat plate with a real bevel — used for the machined base and
       collar. ExtrudeGeometry's bevel is what gives the crisp highlight. */
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

    var clayMat = track(new THREE.MeshStandardMaterial({
        color: 0xb9bcc4, metalness: 0.0, roughness: 0.92
    }));

    var matMetalSatin = track(new THREE.MeshStandardMaterial({
        color: C.steel, metalness: 0.94, roughness: 0.31, envMapIntensity: 1.30
    }));

    var matMetalDark = track(new THREE.MeshStandardMaterial({
        color: C.steelDark, metalness: 0.92, roughness: 0.42, envMapIntensity: 1.05
    }));

    var matChampagne = track(new THREE.MeshStandardMaterial({
        color: 0xcfa964, metalness: 0.98, roughness: 0.20, envMapIntensity: 1.45
    }));

    /* Outer shell. MeshPhysicalMaterial transmission would cost a whole extra
       scene render per frame, so the glass is built from clearcoat, a strong
       environment and controlled opacity instead — at this scale it reads as
       optical glass for a fraction of the cost. */
    var matPrism = track(new THREE.MeshPhysicalMaterial({
        color: 0x9fc4ff,
        metalness: 0.10,
        roughness: 0.045,
        transparent: true,
        opacity: 0.24,
        clearcoat: 1.0,
        clearcoatRoughness: 0.03,
        envMapIntensity: 2.35,
        emissive: new THREE.Color(C.blue),
        emissiveIntensity: 0.10,
        side: THREE.DoubleSide,
        depthWrite: false
    }));

    /* Two inner optical layers — progressively smaller and warmer, so looking
       into the prism shows depth rather than a single shell. */
    var matLayerA = track(new THREE.MeshPhysicalMaterial({
        color: 0xbfd4ff, metalness: 0.0, roughness: 0.06, transparent: true,
        opacity: 0.18, clearcoat: 1.0, clearcoatRoughness: 0.04,
        envMapIntensity: 2.0, emissive: new THREE.Color(C.violet),
        emissiveIntensity: 0.14, side: THREE.DoubleSide, depthWrite: false
    }));

    var matLayerB = track(new THREE.MeshPhysicalMaterial({
        color: 0xffe2b8, metalness: 0.0, roughness: 0.08, transparent: true,
        opacity: 0.16, clearcoat: 1.0, clearcoatRoughness: 0.05,
        envMapIntensity: 1.9, emissive: new THREE.Color(C.mustard),
        emissiveIntensity: 0.18, side: THREE.DoubleSide, depthWrite: false
    }));

    var matCore = track(new THREE.MeshBasicMaterial({
        color: new THREE.Color(C.mustard), transparent: true, opacity: 0.0
    }));

    var glowTex = (function () {
        var s = 128;
        var cv = document.createElement('canvas');
        cv.width = cv.height = s;
        var ctx = cv.getContext('2d');
        var g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
        g.addColorStop(0.0, 'rgba(255,255,255,1)');
        g.addColorStop(0.20, 'rgba(255,255,255,0.55)');
        g.addColorStop(0.52, 'rgba(255,255,255,0.14)');
        g.addColorStop(1.0, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, s, s);
        var t2 = new THREE.CanvasTexture(cv);
        t2.needsUpdate = true;
        return track(t2);
    })();

    var matGlow = track(new THREE.SpriteMaterial({
        map: glowTex, color: new THREE.Color(C.mustard), transparent: true,
        opacity: 0.0, blending: THREE.AdditiveBlending, depthWrite: false
    }));

    /* Neural pathways. Additive and very dim — they must read as light inside
       glass, not as neon wire laid on top. */
    var matNeural = track(new THREE.MeshBasicMaterial({
        color: new THREE.Color(C.cyan), transparent: true, opacity: 0.0,
        blending: THREE.AdditiveBlending, depthWrite: false
    }));

    var matPulse = track(new THREE.ShaderMaterial({
        uniforms: {
            uReveal: { value: 0.0 },
            uDpr: { value: Math.min(window.devicePixelRatio || 1, PROFILE.dpr) },
            uTime: { value: 0.0 }
        },
        vertexShader: [
            'attribute vec3 aColor;',
            'attribute float aSize;',
            'attribute float aOrder;',
            'uniform float uDpr;',
            'uniform float uReveal;',
            'varying vec3 vColor;',
            'varying float vGate;',
            'void main() {',
            '  vColor = aColor;',
            '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
            '  gl_Position = projectionMatrix * mv;',
            '  gl_PointSize = aSize * uDpr * (7.0 / max(0.001, -mv.z));',
            /* Sequential activation: pathways further from the trunk light
               later, driven from a static attribute and the reveal uniform. */
            '  vGate = smoothstep(0.0, 1.0, (uReveal - aOrder * 0.45) / 0.55);',
            '}'
        ].join('\n'),
        fragmentShader: [
            'varying vec3 vColor;',
            'varying float vGate;',
            'void main() {',
            '  vec2 d = gl_PointCoord - vec2(0.5);',
            '  float r = length(d);',
            '  if (r > 0.5) discard;',
            '  float soft = smoothstep(0.5, 0.05, r);',
            '  gl_FragColor = vec4(vColor * (0.8 + soft * 0.9), soft * vGate);',
            '}'
        ].join('\n'),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    }));

    function pick(m) { return CLAY ? clayMat : m; }

    /* ------------------------------------------------------------------
       SYSTEM 2 — the optical intelligence prism

       An elongated faceted element: many-sided, waisted at the middle, with
       chamfer pairs that cut hard edge lines across it. Nested inside are
       two smaller layers at different rotations, so the interior has visible
       depth instead of reading as one solid shell.
       ------------------------------------------------------------------ */

    var core = new THREE.Group();
    core.position.y = 0.10;
    world.add(core);

    /* The composition is authored around the origin at roughly 2 units tall;
       this brings it to a height that fills the square hero frame without
       clipping the vane tips. */
    world.scale.setScalar(1.0);

    var SIDES = PROFILE.sides;

    var shellRings = [
        { y: -0.98, r: 0.045 },
        { y: -0.84, r: 0.225 },
        { y: -0.70, r: 0.345 },
        { y: -0.56, r: 0.435 },
        { y: -0.505, r: 0.462 },
        { y: -0.455, r: 0.468 },
        { y: -0.10, r: 0.500 },
        { y: 0.22, r: 0.487 },
        { y: 0.27, r: 0.478 },
        { y: 0.44, r: 0.428 },
        { y: 0.62, r: 0.330 },
        { y: 0.78, r: 0.205 },
        { y: 0.94, r: 0.048 }
    ];

    function closedLoft(rings, sides) {
        var g = loftPoly(rings, sides);
        g = capRings(g, rings, sides, true);
        g = capRings(g, rings, sides, false);
        g.computeVertexNormals();
        return g;
    }

    var shell = new THREE.Mesh(track(closedLoft(shellRings, SIDES)), pick(matPrism));
    shell.renderOrder = 2;
    core.add(shell);

    function scaleRings(rings, s) {
        var out = [];
        for (var i = 0; i < rings.length; i++) {
            out.push({ y: rings[i].y * s, r: rings[i].r * s });
        }
        return out;
    }

    var layerA = new THREE.Mesh(
        track(closedLoft(scaleRings(shellRings, 0.70), Math.max(6, SIDES - 2))),
        pick(matLayerA)
    );
    layerA.rotation.y = 0.26;
    layerA.renderOrder = 3;
    core.add(layerA);

    var layerB = new THREE.Mesh(
        track(closedLoft(scaleRings(shellRings, 0.44), Math.max(5, SIDES - 4))),
        pick(matLayerB)
    );
    layerB.rotation.y = -0.34;
    layerB.renderOrder = 4;
    core.add(layerB);

    /* A true turned biconvex lens at the centre — the light source the whole
       element is built around. */
    var lensProfile = [];
    (function () {
        var pts = 14;
        for (var i = 0; i <= pts; i++) {
            var tt = i / pts;
            var y = -0.16 + tt * 0.32;
            var r = 0.15 * Math.sin(Math.PI * (0.06 + tt * 0.88));
            lensProfile.push(new THREE.Vector2(Math.max(0.012, r), y));
        }
    })();
    var lens = new THREE.Mesh(
        track(new THREE.LatheGeometry(lensProfile, 28)),
        pick(matLayerB)
    );
    lens.renderOrder = 5;
    core.add(lens);

    var coreOrb = new THREE.Mesh(track(new THREE.SphereGeometry(0.085, 18, 14)), pick(matCore));
    coreOrb.renderOrder = 6;
    core.add(coreOrb);

    var glowSprite = new THREE.Sprite(matGlow);
    glowSprite.scale.setScalar(1.5);
    glowSprite.renderOrder = 7;
    core.add(glowSprite);

    /* Machined waist collar — the clamp that holds the optic. Without it the
       prism floats as a crystal; with it, it reads as an assembly. */
    var collar = new THREE.Mesh(
        track(new THREE.TorusGeometry(0.512, 0.026, 8, 44)),
        pick(matChampagne)
    );
    collar.rotation.x = Math.PI / 2;
    collar.position.y = -0.01;
    core.add(collar);

    var collarLower = new THREE.Mesh(
        track(new THREE.TorusGeometry(0.474, 0.014, 6, 40)),
        pick(matMetalDark)
    );
    collarLower.rotation.x = Math.PI / 2;
    collarLower.position.y = -0.47;
    core.add(collarLower);

    /* ------------------------------------------------------------------
       SYSTEM 1 — the kinetic metal vanes

       A small number of swept, cambered components at irregular angles, so
       the silhouette is asymmetric and deliberate. Each has its own length,
       height and tilt; they move independently but stay in coordination.
       ------------------------------------------------------------------ */

    /* Cambered section, described in (thickness, height). The closed loop
       gives a flat outer face with a bevelled rim, so the broad face catches
       the key light and the edge keeps a crisp highlight. */
    var VANE_SECTION = [
        [-0.055, -0.50], [0.020, -0.46], [0.038, -0.20],
        [0.040, 0.20], [0.022, 0.46], [-0.050, 0.50],
        [-0.062, 0.18], [-0.062, -0.18]
    ];

    /* Four vanes of different span and height at irregular angles. They are
       deliberately taller than they are wide: a tall curved shield standing
       off the optic reads as a separate component, where a squat plate just
       merges into the core mass. The uneven spacing is also deliberate —
       even spacing reads as a machine part, uneven reads as design. */
    var VANE_DEFS = [
        { angle: 0.42, span: 0.78, radius: 1.20, height: 1.30, camber: 0.16, thick: 1.00, tilt: -0.07, dir: 1 },
        { angle: 1.98, span: 0.62, radius: 1.28, height: 1.02, camber: 0.13, thick: 0.86, tilt: 0.06, dir: -1 },
        { angle: 3.34, span: 0.84, radius: 1.16, height: 1.38, camber: 0.17, thick: 1.00, tilt: 0.09, dir: 1 },
        { angle: 4.86, span: 0.68, radius: 1.24, height: 1.10, camber: 0.14, thick: 0.88, tilt: -0.05, dir: -1 }
    ];

    var vanes = [];
    for (var v = 0; v < Math.min(PROFILE.vanes, VANE_DEFS.length); v++) {
        var def = VANE_DEFS[v];
        var vaneGeo = track(sweepVane({
            samples: PROFILE.vaneSamples,
            section: VANE_SECTION,
            radius: def.radius,
            a0: def.angle - def.span / 2,
            span: def.span,
            y0: 0,
            camber: def.camber,
            thick: def.thick,
            height: def.height
        }));

        var vg = new THREE.Group();
        vg.position.y = 0.06;
        /* The sweep already places the vane around the axis, so the group only
           carries the per-vane tilt and the animation offsets. */
        vg.rotation.y = 0;
        vg.rotation.x = def.tilt;

        var vmesh = new THREE.Mesh(vaneGeo, pick(v % 3 === 1 ? matChampagne : matMetalSatin));
        vg.add(vmesh);
        world.add(vg);

        vanes.push({
            group: vg, mesh: vmesh, def: def,
            baseAngle: def.angle, baseRadius: def.radius, baseTilt: def.tilt
        });
    }

    /* Machined base — a turned plinth the prism stands on, so the sculpture
       is grounded rather than floating. */
    var baseGeo = track(plate(function (sh) {
        var n = 12;
        for (var i = 0; i < n; i++) {
            var a = (i / n) * Math.PI * 2 + 0.15;
            var x = Math.cos(a) * 0.46, y = Math.sin(a) * 0.46;
            if (i === 0) sh.moveTo(x, y); else sh.lineTo(x, y);
        }
        sh.closePath();
    }, 0.11, 0.020));
    var basePlate = new THREE.Mesh(baseGeo, pick(matMetalDark));
    basePlate.position.y = -1.06;
    basePlate.rotation.x = -Math.PI / 2;
    world.add(basePlate);

    var baseRing = new THREE.Mesh(
        track(new THREE.TorusGeometry(0.487, 0.014, 6, 44)),
        pick(matChampagne)
    );
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = -0.995;
    world.add(baseRing);

    /* A short tapered column linking plinth to prism, so the optic is seated
       in an assembly instead of resting on a disc. */
    var stemRings = [
        { y: -0.99, r: 0.150 },
        { y: -0.955, r: 0.132 },
        { y: -0.930, r: 0.086 },
        { y: -0.912, r: 0.052 }
    ];
    var stem = new THREE.Mesh(track(closedLoft(stemRings, 16)), pick(matMetalSatin));
    world.add(stem);

    /* ------------------------------------------------------------------
       SYSTEM 3 — neural light flow

       Pathways inside the prism volume. One trunk enters low, splits at a
       junction, the two branches cross through different internal layers,
       and they rejoin at a second junction before leaving the top. Thin
       tubes carry the geometry; points carry the travelling light.
       ------------------------------------------------------------------ */

    var N = {
        entry: [0, -0.88, 0],
        j1:    [0, -0.46, 0],
        a1:    [0.26, -0.14, 0.10],
        b1:    [-0.24, -0.10, -0.12],
        a2:    [0.17, 0.30, -0.08],
        b2:    [-0.15, 0.34, 0.10],
        cross: [0.02, 0.06, 0.24],
        j2:    [0, 0.82, 0]
    };

    var neuralPaths = [
        [N.entry, [0, -0.68, 0.02], N.j1],
        [N.j1, [0.14, -0.30, 0.06], N.a1],
        [N.a1, [0.24, 0.08, 0.02], N.a2],
        [N.j1, [-0.13, -0.28, -0.07], N.b1],
        [N.b1, [-0.21, 0.10, -0.02], N.b2],
        [N.a1, N.cross, N.b2],
        [N.a2, [0.09, 0.58, -0.05], N.j2],
        [N.b2, [-0.08, 0.60, 0.06], N.j2]
    ];

    var neuralCurves = [];
    for (var np = 0; np < neuralPaths.length; np++) {
        var npts = [];
        for (var q = 0; q < neuralPaths[np].length; q++) {
            var pv = neuralPaths[np][q];
            npts.push(new THREE.Vector3(pv[0], pv[1], pv[2]));
        }
        neuralCurves.push(track(new THREE.CatmullRomCurve3(npts, false, 'catmullrom', 0.5)));
    }

    var neuralTubes = [];
    for (var nt = 0; nt < neuralCurves.length; nt++) {
        var tube = new THREE.Mesh(
            track(new THREE.TubeGeometry(neuralCurves[nt], PROFILE.tubeSegs, 0.0062, 4, false)),
            pick(matNeural)
        );
        tube.renderOrder = 3;
        core.add(tube);
        neuralTubes.push(tube);
    }

    /* Junction glows — the split and the rejoin, marked so the eye can read
       the graph rather than just see lines. */
    var junctionSprites = [];
    [N.j1, N.j2].forEach(function (pos) {
        var sp = new THREE.Sprite(matGlow);
        sp.position.set(pos[0], pos[1], pos[2]);
        sp.scale.setScalar(0.30);
        sp.renderOrder = 4;
        core.add(sp);
        junctionSprites.push(sp);
    });

    var P_COUNT = PROFILE.pulses;
    var pPos = new Float32Array(P_COUNT * 3);
    var pColor = new Float32Array(P_COUNT * 3);
    var pSize = new Float32Array(P_COUNT);
    var pOrder = new Float32Array(P_COUNT);
    var pState = [];

    var colCyan = new THREE.Color(C.cyan);
    var colGold = new THREE.Color(C.mustard);
    var colMagenta = new THREE.Color(C.magenta);

    (function seedPulses() {
        for (var i = 0; i < P_COUNT; i++) {
            var ci = i % neuralCurves.length;
            pState.push({
                curve: ci,
                t: Math.random(),
                speed: 0.10 + Math.random() * 0.16
            });
            /* Trunk first, branches next, joins last. */
            pOrder[i] = ci / (neuralCurves.length - 1);

            var col = ci === 0 ? colGold : (ci >= 6 ? colMagenta : colCyan);
            var j = 0.85 + Math.random() * 0.3;
            pColor[i * 3] = col.r * j;
            pColor[i * 3 + 1] = col.g * j;
            pColor[i * 3 + 2] = col.b * j;
            pSize[i] = 2.0 + Math.random() * 2.6;
        }
    })();

    var pulseGeo = track(new THREE.BufferGeometry());
    pulseGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pulseGeo.setAttribute('aColor', new THREE.BufferAttribute(pColor, 3));
    pulseGeo.setAttribute('aSize', new THREE.BufferAttribute(pSize, 1));
    pulseGeo.setAttribute('aOrder', new THREE.BufferAttribute(pOrder, 1));

    var pulses = new THREE.Points(pulseGeo, matPulse);
    pulses.frustumCulled = false;
    pulses.renderOrder = 6;
    core.add(pulses);

    /* ------------------------------------------------------------------
       Lighting

       Studio setup. One large key from upper front-left, a cool rim from
       behind right to separate the silhouette, and a warm kicker low left.
       The prism contributes its own point light once it ignites.
       ------------------------------------------------------------------ */

    var keyLight = new THREE.DirectionalLight(0xfff4e2, 2.6);
    keyLight.position.set(-4.2, 6.0, 5.2);
    scene.add(keyLight);

    var rimLight = new THREE.DirectionalLight(0x9fd0ff, 1.7);
    rimLight.position.set(5.0, 2.2, -4.6);
    scene.add(rimLight);

    var warmLight = new THREE.DirectionalLight(0xffb066, 0.7);
    warmLight.position.set(-3.0, -3.4, 2.6);
    scene.add(warmLight);

    var coreLight = new THREE.PointLight(C.mustard, 0.0, 5.5, 2.0);
    core.add(coreLight);

    var fillLight = new THREE.HemisphereLight(0x9fb8ff, 0x1a1030, 0.38);
    scene.add(fillLight);

    if (CLAY) {
        keyLight.intensity = 2.2;
        rimLight.intensity = 0.5;
        warmLight.intensity = 0.4;
        fillLight.intensity = 0.8;
    }

    /* ------------------------------------------------------------------
       Camera framing and pointer parallax
       ------------------------------------------------------------------ */

    var camBase = new THREE.Vector3(0, 0.10, 6.1);
    var lookTarget = new THREE.Vector3(0, 0.04, 0);
    var pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    function onPointerMove(ev) {
        var rect = root.getBoundingClientRect();
        pointer.tx = ((ev.clientX - rect.left) / rect.width - 0.5) * 2;
        pointer.ty = ((ev.clientY - rect.top) / rect.height - 0.5) * 2;
    }
    function onPointerLeave() {
        pointer.tx = 0;
        pointer.ty = 0;
    }
    if (window.matchMedia('(pointer: fine)').matches) {
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        document.addEventListener('pointerleave', onPointerLeave, { passive: true });
    }

    /* ------------------------------------------------------------------
       Scroll layer

       Read-only: it never changes layout and the sculpture is fully animated
       without it. It adds orientation change and sequential pathway
       activation as the hero leaves the viewport.
       ------------------------------------------------------------------ */

    var scrollState = { raw: 0, eased: 0 };

    function readScroll() {
        var rect = root.getBoundingClientRect();
        var h = rect.height || 1;
        scrollState.raw = clamp01(-rect.top / h);
    }
    window.addEventListener('scroll', readScroll, { passive: true });
    readScroll();

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
        matPulse.uniforms.uDpr.value = Math.min(window.devicePixelRatio || 1, PROFILE.dpr);
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

    var BASE = {
        prismOpacity: 0.24,
        layerAOpacity: 0.18,
        layerBOpacity: 0.16,
        prismEnv: 2.35,
        layerAEnv: 2.00,
        layerBEnv: 1.90,
        prismEmissive: 0.10,
        layerAEmissive: 0.14,
        layerBEmissive: 0.18,
        satinEnv: 1.30,
        darkEnv: 1.05,
        champagneEnv: 1.45
    };

    function applyTheme() {
        theme.t += ((theme.dark ? 1 : 0) - theme.t) * 0.05;
        var t = theme.t;

        /* Dark mode is not an inversion. The stage darkens, so the glass can
           be a little more transparent and the rim does the separating work.
           In light mode the glass stays more solid so it holds its own. */
        matPrism.envMapIntensity = BASE.prismEnv * (1 - t * 0.20);
        matLayerA.envMapIntensity = BASE.layerAEnv * (1 - t * 0.18);
        matLayerB.envMapIntensity = BASE.layerBEnv * (1 - t * 0.18);
        matPrism.emissiveIntensity = BASE.prismEmissive * (1 + t * 0.9);
        matLayerA.emissiveIntensity = BASE.layerAEmissive * (1 + t * 0.9);
        matLayerB.emissiveIntensity = BASE.layerBEmissive * (1 + t * 0.9);

        keyLight.intensity = (CLAY ? 2.2 : 2.6) + t * 0.35;
        rimLight.intensity = (CLAY ? 0.5 : 1.7) + t * 0.85;
        warmLight.intensity = (CLAY ? 0.4 : 0.7) + t * 0.30;
        fillLight.intensity = (CLAY ? 0.8 : 0.38) + t * 0.16;

        matMetalSatin.envMapIntensity = BASE.satinEnv * (1 + t * 0.25);
        matMetalDark.envMapIntensity = BASE.darkEnv * (1 + t * 0.20);
        matChampagne.envMapIntensity = BASE.champagneEnv * (1 + t * 0.25);
    }

    /* ------------------------------------------------------------------
       Choreography

       A 26 s cycle. Every envelope below is zero at t = 0 and t = 1, so the
       loop is seamless by construction; ambient drift runs underneath on
       elapsed time and never stops.

         0.02-0.20  Awakening        vanes unfold
         0.16-0.36  Activation       prism ignites and starts to turn
         0.32-0.54  Refraction       internal layers light, light travels
         0.50-0.72  Neural flow      pulses split, cross, rejoin
         0.68-0.88  Synchronisation  vanes align, pathways light together
         0.84-0.98  Reconfiguration  subtle shift back to ambient rest
       ------------------------------------------------------------------ */

    var CYCLE = 26.0;

    var clock = new THREE.Clock();
    var rafId = null;
    var elapsed = 0;
    var frameInterval = 1 / PROFILE.fps;
    var frameAccum = 0;

    var tmpV = new THREE.Vector3();

    function updatePulses(dt, reveal) {
        if (reveal <= 0.001) return;
        for (var i = 0; i < P_COUNT; i++) {
            var st = pState[i];
            st.t += st.speed * dt;
            if (st.t > 1) st.t -= 1;
            neuralCurves[st.curve].getPointAt(st.t, tmpV);
            pPos[i * 3] = tmpV.x;
            pPos[i * 3 + 1] = tmpV.y;
            pPos[i * 3 + 2] = tmpV.z;
        }
        pulseGeo.attributes.position.needsUpdate = true;
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

        scrollState.eased += (scrollState.raw - scrollState.eased) * 0.06;
        var sc = scrollState.eased;

        /* Cycle position, and the six phase envelopes. */
        var t = (elapsed % CYCLE) / CYCLE;
        var eAwake = envelope(t, 0.02, 0.20, 0.055, 0.045);
        var eAct   = envelope(t, 0.16, 0.36, 0.060, 0.050);
        var eRefr  = envelope(t, 0.32, 0.54, 0.060, 0.055);
        var eNeur  = envelope(t, 0.50, 0.72, 0.060, 0.060);
        var eSync  = envelope(t, 0.68, 0.88, 0.060, 0.055);
        var eRecon = envelope(t, 0.84, 0.98, 0.050, 0.045);

        /* Ambient baseline — always running, independent of the cycle. */
        var breathe = Math.sin(elapsed * 0.42);
        var slowTurn = elapsed * 0.055;

        /* --- System 1: vanes ------------------------------------------- */
        /* open drives the vanes outward and swings them open. They unfold on
           Awakening, pull in and settle on Synchronisation, and make a small
           structural shift on Reconfiguration. */
        var open = 0.30 + 0.08 * breathe + 0.62 * eAwake - 0.26 * eSync + 0.10 * eRecon;
        var align = eSync * 0.85 + sc * 0.25;

        for (var vi = 0; vi < vanes.length; vi++) {
            var vn = vanes[vi];
            var d = vn.def;
            /* Coordination: a shared phase with a per-vane offset, so they
               move as one system rather than independent objects. */
            var lag = Math.sin(elapsed * 0.55 + vi * 0.9) * 0.012;

            /* The sweep baked each vane into its arc, so motion is applied as a
               group rotation plus a radial push — the vane keeps its curved
               profile while it swings. */
            vn.group.rotation.y = slowTurn * 0.10 * d.dir
                + 0.16 * open * d.dir
                - 0.10 * align * d.dir;
            vn.group.rotation.x = d.tilt + (0.34 * open - 0.26 * align) * d.dir;
            vn.group.rotation.z = 0.05 * Math.sin(elapsed * 0.37 + vi) * (0.4 + open);

            /* Radial push: outward on unfold, inward as they align. */
            var push = 0.20 * open - 0.09 * align;
            vn.group.scale.setScalar(1 + push * 0.5);
            vn.group.position.y = 0.06 + 0.07 * open * d.dir + lag;
        }

        /* --- System 2: prism ------------------------------------------- */
        var ignite = 0.22 + 0.78 * eAct + 0.35 * eRefr + 0.30 * eSync;
        var breathCore = 0.90 + Math.sin(elapsed * 1.05) * 0.10;

        matCore.opacity = CLAY ? 0.0 : clamp01(ignite * breathCore) * 0.95;
        matGlow.opacity = CLAY ? 0.0 : clamp01(ignite * 0.34);
        glowSprite.scale.setScalar(1.25 + ignite * 0.55 + eNeur * 0.18);
        coreLight.intensity = CLAY ? 0.0 : clamp01(ignite) * 2.3;

        /* Restrained rotation — a few degrees, never a spin. */
        core.rotation.y = slowTurn * 0.35 + 0.10 * Math.sin(elapsed * 0.21) + sc * 0.30;
        core.rotation.x = 0.05 * Math.sin(elapsed * 0.17) - sc * 0.12;
        core.position.y = 0.10 + Math.sin(elapsed * 0.42 + 0.3) * 0.010;

        /* Layered optics: each layer counter-rotates slightly, which is what
           makes the interior read as stacked optical elements. */
        layerA.rotation.y = 0.26 + Math.sin(elapsed * 0.19) * 0.06 - slowTurn * 0.14;
        layerB.rotation.y = -0.34 + Math.sin(elapsed * 0.23 + 1.1) * 0.08 + slowTurn * 0.10;
        lens.rotation.y = slowTurn * 0.5;

        matLayerA.opacity = BASE.layerAOpacity * (1 + eRefr * 1.5 + eSync * 0.5);
        matLayerB.opacity = BASE.layerBOpacity * (1 + eRefr * 1.7 + eSync * 0.6);
        matPrism.opacity = BASE.prismOpacity * (1 + eAct * 0.25 + eRefr * 0.30);

        /* --- System 3: neural flow ------------------------------------- */
        var neural = 0.10 + 0.55 * eNeur + 0.55 * eSync + 0.20 * eRefr + sc * 0.25;
        matNeural.opacity = CLAY ? 0.0 : clamp01(neural) * 0.42;
        matPulse.uniforms.uReveal.value = CLAY ? 0.0 : clamp01(neural * 1.15);
        matPulse.uniforms.uTime.value = elapsed;
        updatePulses(step, neural);

        for (var js = 0; js < junctionSprites.length; js++) {
            junctionSprites[js].scale.setScalar(0.22 + clamp01(neural) * 0.16);
            junctionSprites[js].material.opacity = CLAY ? 0.0 : clamp01(neural) * 0.30;
        }

        /* --- Camera: slow drift plus damped parallax. Never a turntable. */
        pointer.x += (pointer.tx - pointer.x) * 0.045;
        pointer.y += (pointer.ty - pointer.y) * 0.045;

        camera.position.x = camBase.x + Math.sin(elapsed * 0.16) * 0.10 + pointer.x * 0.40;
        camera.position.y = camBase.y + Math.cos(elapsed * 0.13) * 0.05 - pointer.y * 0.24;
        camera.position.z = camBase.z - Math.abs(pointer.x) * 0.10 + sc * 0.55;
        camera.lookAt(lookTarget);

        world.rotation.y = pointer.x * 0.09 + Math.sin(elapsed * 0.11) * 0.025 + sc * 0.22;
        world.rotation.x = -pointer.y * 0.04;

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
        window.removeEventListener('scroll', readScroll);
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
