/**
 * HUMISENSE — The Intelligence Core.
 *
 * One bespoke WebGL composition for the homepage hero. Not a brain, an atom
 * or a globe: a crystalline "H" monogram (the brand mark) suspended inside a
 * live neural mesh, ringed by autonomous agent modules, with information
 * streaming in and processed data flowing back out. The entrance runs in five
 * choreographed stages, then settles into an ambient loop that never restarts.
 *
 * Layers, outermost in:
 *   streams  — particles riding curved paths into and out of the core
 *   agents   — 7 modules, each a different structure in a different hue
 *   neural   — nodes and pulsing edges: the network the core thinks through
 *   crystal  — the H monogram: faceted shards around a luminous heart
 *
 * Everything degrades. No WebGL, reduced motion, save-data or a very weak
 * device fall back to the designed static composition already in the DOM; the
 * canvas only ever mounts on top of it.
 *
 * Performance: no post-processing chain (the bloom is additive sprite work,
 * which is far cheaper), points/instanced particles, a hard DPR cap, a
 * per-tier quality ladder, a frame budget on weak devices, and a pause
 * whenever the hero leaves the viewport or the tab is hidden.
 */
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

    function goStatic() {
        root.classList.remove('has-webgl');
        root.classList.add('is-static');
    }

    var mem = navigator.deviceMemory || 8;
    var cores = navigator.hardwareConcurrency || 8;
    var saveData = !!(navigator.connection && navigator.connection.saveData);
    var narrow = window.matchMedia('(max-width: 720px)').matches;

    if (!webglAvailable() || typeof THREE === 'undefined' || saveData ||
        mem < 2 || cores < 2 || reduceMotion.matches) {
        goStatic();
        return;
    }

    /* Quality ladder. `low` is the dedicated mobile composition: the same
       system, fewer agents, a third of the particles, a capped frame rate. */
    var TIER = narrow ? 'low' : (mem >= 4 && cores >= 4 ? 'high' : 'mid');

    var PROFILE = {
        high: { nodes: 46, edges: 92, agents: 7, curves: 5, perCurve: 26, motes: 240, dpr: 1.8, fps: 60 },
        mid: { nodes: 34, edges: 60, agents: 6, curves: 4, perCurve: 16, motes: 140, dpr: 1.5, fps: 60 },
        low: { nodes: 20, edges: 30, agents: 4, curves: 3, perCurve: 9, motes: 60, dpr: 1.25, fps: 30 }
    }[TIER];

    /* ------------------------------------------------------------------
       Palette — the full brand ramp, every hue with a job
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
       Renderer and scene
       ------------------------------------------------------------------ */

    var width = canvasHost.clientWidth || 1;
    var height = canvasHost.clientHeight || 1;

    var renderer;
    try {
        renderer = new THREE.WebGLRenderer({
            antialias: TIER !== 'low',
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
    if (THREE.sRGBEncoding && 'outputEncoding' in renderer) {
        renderer.outputEncoding = THREE.sRGBEncoding;
    }
    renderer.domElement.style.pointerEvents = 'none';
    canvasHost.appendChild(renderer.domElement);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 120);
    camera.position.set(0, 0, 11.2);

    var world = new THREE.Group();
    scene.add(world);

    /* Disposal ledger — every geometry, material and texture registers here
       so one teardown frees the GPU. */
    var disposables = [];
    function track(obj) { disposables.push(obj); return obj; }

    /* ------------------------------------------------------------------
       Shared texture: a soft radial glow, drawn once
       ------------------------------------------------------------------ */

    function makeGlowTexture() {
        var s = 128;
        var cv = document.createElement('canvas');
        cv.width = cv.height = s;
        var ctx = cv.getContext('2d');
        var g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
        g.addColorStop(0.0, 'rgba(255,255,255,1)');
        g.addColorStop(0.28, 'rgba(255,255,255,0.55)');
        g.addColorStop(0.62, 'rgba(255,255,255,0.14)');
        g.addColorStop(1.0, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, s, s);
        var tex = new THREE.CanvasTexture(cv);
        tex.needsUpdate = true;
        return track(tex);
    }

    var glowTex = makeGlowTexture();

    /* ------------------------------------------------------------------
       Theme. The hero stage is dark in both themes; dark mode is deeper and
       lets the core burn harder. The observer means the toggle costs no
       reload and no second scene.
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
       Shaders
       ------------------------------------------------------------------ */

    /* Crystal: fresnel-lit glass. The edge term carries colour; the body
       stays nearly clear so stacked shards read as real depth. */
    var CRYSTAL_VERT = [
        'varying vec3 vN;',
        'varying vec3 vV;',
        'varying vec3 vP;',
        'void main() {',
        '  vec4 wp = modelMatrix * vec4(position, 1.0);',
        '  vP = wp.xyz;',
        '  vN = normalize(mat3(modelMatrix) * normal);',
        '  vV = normalize(cameraPosition - wp.xyz);',
        '  gl_Position = projectionMatrix * viewMatrix * wp;',
        '}'
    ].join('\n');

    var CRYSTAL_FRAG = [
        'uniform vec3 uBody;',
        'uniform vec3 uEdge;',
        'uniform vec3 uGlow;',
        'uniform float uOpacity;',
        'uniform float uPower;',
        'uniform float uTime;',
        'uniform float uPulse;',
        'varying vec3 vN;',
        'varying vec3 vV;',
        'varying vec3 vP;',
        'void main() {',
        '  float f = pow(1.0 - clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0), uPower);',
        '  float band = 0.5 + 0.5 * sin(vP.y * 5.0 + uTime * 1.15);',
        '  vec3 col = mix(uBody, uEdge, f);',
        '  col += uGlow * (f * 0.75 + band * 0.07) * uPulse;',
        // A floor on alpha: without it the shards only show where the surface
        // turns away from the camera, which reads as an outline sketch.
        '  float a = uOpacity * (0.42 + 0.58 * f);',
        '  gl_FragColor = vec4(col, a);',
        '}'
    ].join('\n');

    function crystalMaterial(opts) {
        return track(new THREE.ShaderMaterial({
            uniforms: {
                uBody: { value: new THREE.Color(opts.body) },
                uEdge: { value: new THREE.Color(opts.edge) },
                uGlow: { value: new THREE.Color(opts.glow) },
                uOpacity: { value: opts.opacity },
                uPower: { value: opts.power || 2.4 },
                uTime: { value: 0 },
                uPulse: { value: 0 }
            },
            vertexShader: CRYSTAL_VERT,
            fragmentShader: CRYSTAL_FRAG,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
            /* Normal blending, not additive: five shards stacked additively
               sum straight to white and the monogram dissolves. Alpha keeps
               each facet reading as glass and preserves the silhouette. */
            blending: THREE.NormalBlending
        }));
    }

    /* Neural nodes: soft luminous discs, each with its own phase and reveal
       order. The pointer raises a local excitement field, so the mesh answers
       where the cursor is rather than leaning as a whole. */
    var NODE_VERT = [
        'attribute float aSize;',
        'attribute float aPhase;',
        'attribute float aOrder;',
        'uniform float uTime;',
        'uniform float uReveal;',
        'uniform float uDpr;',
        'uniform vec3 uPointer;',
        'uniform float uExcite;',
        'varying float vA;',
        'varying float vE;',
        'void main() {',
        '  vec3 p = position;',
        '  p += normalize(p + 0.0001) * sin(uTime * 0.7 + aPhase * 6.2831) * 0.05;',
        '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
        '  gl_Position = projectionMatrix * mv;',
        '  float d = distance(p, uPointer);',
        '  vE = smoothstep(2.6, 0.0, d) * uExcite;',
        '  float appear = smoothstep(aOrder, aOrder + 0.14, uReveal);',
        '  vA = appear * (0.55 + 0.35 * sin(uTime * 1.5 + aPhase * 6.2831));',
        '  gl_PointSize = aSize * uDpr * (1.0 + vE * 0.7) * (150.0 / max(0.001, -mv.z));',
        '}'
    ].join('\n');

    var NODE_FRAG = [
        'uniform vec3 uColorA;',
        'uniform vec3 uColorB;',
        'varying float vA;',
        'varying float vE;',
        'void main() {',
        '  vec2 uv = gl_PointCoord - 0.5;',
        '  float r = length(uv);',
        '  if (r > 0.5) discard;',
        '  float soft = smoothstep(0.5, 0.0, r);',
        '  float core = smoothstep(0.16, 0.0, r);',
        '  vec3 col = mix(uColorA, uColorB, vE);',
        '  col += vec3(0.85) * core * 0.18;',
        '  gl_FragColor = vec4(col, soft * vA);',
        '}'
    ].join('\n');

    /* Pulsing edges: a highlight travels the length of each segment, which is
       what makes the mesh read as traffic instead of a spiderweb. */
    var PULSE_VERT = [
        'attribute float aT;',
        'attribute float aRand;',
        'attribute float aOrder;',
        'uniform float uReveal;',
        'varying float vT;',
        'varying float vR;',
        'varying float vA;',
        'void main() {',
        '  vT = aT;',
        '  vR = aRand;',
        '  vA = smoothstep(aOrder, aOrder + 0.12, uReveal);',
        '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
        '}'
    ].join('\n');

    var PULSE_FRAG = [
        'uniform float uTime;',
        'uniform vec3 uColorA;',
        'uniform vec3 uColorB;',
        'uniform float uSpeed;',
        'uniform float uIntensity;',
        'uniform float uExcite;',
        'varying float vT;',
        'varying float vR;',
        'varying float vA;',
        'void main() {',
        '  float p = fract(uTime * uSpeed + vR);',
        '  float d = abs(vT - p);',
        '  d = min(d, 1.0 - d);',
        '  float pulse = smoothstep(0.18, 0.0, d);',
        '  vec3 col = mix(uColorA, uColorB, pulse);',
        '  float a = (0.10 + pulse * 0.55) * vA * uIntensity * (1.0 + uExcite * 0.4);',
        '  gl_FragColor = vec4(col, a);',
        '}'
    ].join('\n');

    function pulseMaterial(colorA, colorB, speed, intensity) {
        return track(new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColorA: { value: new THREE.Color(colorA) },
                uColorB: { value: new THREE.Color(colorB) },
                uSpeed: { value: speed },
                uIntensity: { value: intensity },
                uExcite: { value: 0 },
                uReveal: { value: 0 }
            },
            vertexShader: PULSE_VERT,
            fragmentShader: PULSE_FRAG,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        }));
    }

    /* ------------------------------------------------------------------
       A. The crystal — an abstract H monogram
       ------------------------------------------------------------------
       Two tapered uprights, a bridging bar, and two slanted splinters that
       break the symmetry so it never reads as a letter extruded by a
       machine. Five-sided prisms give genuinely faceted crystal faces.
       ------------------------------------------------------------------ */

    var core = new THREE.Group();
    world.add(core);

    var shardGeo = track(new THREE.CylinderGeometry(1, 1, 1, 5, 1, false));

    function shard(opts) {
        var m = new THREE.Mesh(shardGeo, crystalMaterial(opts.mat));
        m.scale.set(opts.w, opts.h, opts.d);
        m.position.set(opts.x, opts.y, opts.z);
        m.rotation.set(opts.rx || 0, opts.ry || 0, opts.rz || 0);
        m.renderOrder = 0;
        core.add(m);
        return m;
    }

    var glassBlue = { body: C.deepBlue, edge: C.cyan, glow: C.cyan, opacity: 1.0, power: 1.75 };
    var glassViolet = { body: C.purple, edge: C.violet, glow: C.magenta, opacity: 1.0, power: 2.0 };
    var glassGold = { body: C.orange, edge: C.golden, glow: C.golden, opacity: 1.0, power: 1.45 };

    /* Uprights and bridge — the H */
    shard({ mat: glassBlue, w: 0.20, h: 2.35, d: 0.20, x: -0.62, y: 0.02, z: 0, rz: 0.055, ry: 0.3 });
    shard({ mat: glassViolet, w: 0.19, h: 2.05, d: 0.19, x: 0.60, y: -0.10, z: 0.04, rz: -0.045, ry: -0.35 });
    shard({ mat: glassGold, w: 0.14, h: 1.02, d: 0.14, x: 0, y: 0.16, z: 0, rz: Math.PI / 2, ry: 0.1 });
    /* Asymmetric splinters */
    shard({ mat: glassViolet, w: 0.10, h: 1.30, d: 0.10, x: -0.28, y: 0.72, z: 0.42, rz: 0.5, rx: 0.22 });
    shard({ mat: glassBlue, w: 0.09, h: 1.05, d: 0.09, x: 0.34, y: -0.66, z: -0.38, rz: -0.42, rx: -0.18 });

    /* The heart — the intelligence itself */
    /* Normal blending, not additive: an additive golden ball on top of the
       glow sprite and the gold bridge summed to pure white and lost its
       colour entirely. Alpha keeps it gold. */
    var heartMat = track(new THREE.MeshBasicMaterial({
        color: C.golden, transparent: true, opacity: 0.85, depthWrite: false
    }));
    var heart = new THREE.Mesh(track(new THREE.IcosahedronGeometry(0.46, 1)), heartMat);
    heart.renderOrder = 1;
    core.add(heart);

    var heartWire = new THREE.Mesh(
        track(new THREE.IcosahedronGeometry(0.68, 1)),
        track(new THREE.MeshBasicMaterial({
            color: C.orange, wireframe: true, transparent: true, opacity: 0.45,
            depthWrite: false
        }))
    );
    heartWire.renderOrder = 1;
    core.add(heartWire);

    /* Outer envelope: a faint refractive shell the shards sit inside */
    var shellMat = crystalMaterial({
        body: C.purple, edge: C.violet, glow: C.cyan, opacity: 0.045, power: 4.2
    });
    var shell = new THREE.Mesh(track(new THREE.IcosahedronGeometry(1.95, 1)), shellMat);
    shell.renderOrder = -5;
    core.add(shell);

    /* Bloom as additive sprites — cheaper than a composer chain and it
       composites correctly over the CSS gradient behind the canvas. Kept
       deliberately restrained: a large bright halo is what turns a crystal
       into a white blob, so the halo sits behind and stays faint. */
    function glowSprite(color, size, opacity) {
        var s = new THREE.Sprite(track(new THREE.SpriteMaterial({
            map: glowTex, color: color, transparent: true, opacity: opacity,
            blending: THREE.AdditiveBlending, depthWrite: false
        })));
        s.scale.set(size, size, 1);
        return s;
    }

    /* The halo goes first and sits behind everything, so it tints the space
       around the monogram instead of washing over it. */
    var coreHalo = glowSprite(C.magenta, 9.5, 0.045);
    coreHalo.position.z = -1.2;
    coreHalo.renderOrder = -10;
    core.add(coreHalo);

    /* Slightly wider than the monogram's 2.1-unit width, so it lifts the
       shards off the background without swallowing them. */
    var coreGlow = glowSprite(C.golden, 1.5, 0.14);
    coreGlow.position.z = -0.6;
    coreGlow.renderOrder = -1;
    core.add(coreGlow);

    /* ------------------------------------------------------------------
       B. Neural network
       ------------------------------------------------------------------
       Nodes seeded on a flattened shell, then linked to their nearest
       neighbours so the graph has local texture as well as visible hubs.
       ------------------------------------------------------------------ */

    var neural = new THREE.Group();
    neural.renderOrder = -2;
    world.add(neural);

    /* A fixed seed keeps the composition identical on every load, which
       matters for a brand visual: it should be the same object every time. */
    var seed = 20261125;
    function rng() {
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        return seed / 4294967296;
    }

    var NODE_COUNT = PROFILE.nodes;
    var nodePositions = new Float32Array(NODE_COUNT * 3);
    var nodeSizes = new Float32Array(NODE_COUNT);
    var nodePhases = new Float32Array(NODE_COUNT);
    var nodeOrders = new Float32Array(NODE_COUNT);

    for (var n = 0; n < NODE_COUNT; n++) {
        var theta = rng() * Math.PI * 2;
        var phi = Math.acos(2 * rng() - 1);
        var radius = 2.45 + rng() * 0.95;
        nodePositions[n * 3] = radius * Math.sin(phi) * Math.cos(theta);
        nodePositions[n * 3 + 1] = radius * Math.cos(phi) * 0.80;
        nodePositions[n * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
        nodeSizes[n] = 2.0 + rng() * 3.4 + (n % 7 === 0 ? 3.6 : 0);
        nodePhases[n] = rng();
        nodeOrders[n] = rng() * 0.6;
    }

    var nodeGeo = track(new THREE.BufferGeometry());
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
    nodeGeo.setAttribute('aSize', new THREE.BufferAttribute(nodeSizes, 1));
    nodeGeo.setAttribute('aPhase', new THREE.BufferAttribute(nodePhases, 1));
    nodeGeo.setAttribute('aOrder', new THREE.BufferAttribute(nodeOrders, 1));

    var nodeMat = track(new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uReveal: { value: 0 },
            uDpr: { value: Math.min(window.devicePixelRatio || 1, PROFILE.dpr) },
            uPointer: { value: new THREE.Vector3(99, 99, 99) },
            uExcite: { value: 0 },
            uColorA: { value: new THREE.Color(C.cyan) },
            uColorB: { value: new THREE.Color(C.golden) }
        },
        vertexShader: NODE_VERT,
        fragmentShader: NODE_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    }));

    neural.add(new THREE.Points(nodeGeo, nodeMat));

    /* Edges: nearest-neighbour links, deduplicated, trimmed to budget */
    var edgePairs = [];
    var seen = {};
    for (var a = 0; a < NODE_COUNT; a++) {
        var dists = [];
        for (var b = 0; b < NODE_COUNT; b++) {
            if (a === b) continue;
            var dx = nodePositions[a * 3] - nodePositions[b * 3];
            var dy = nodePositions[a * 3 + 1] - nodePositions[b * 3 + 1];
            var dz = nodePositions[a * 3 + 2] - nodePositions[b * 3 + 2];
            dists.push({ i: b, d: dx * dx + dy * dy + dz * dz });
        }
        dists.sort(function (p, q) { return p.d - q.d; });
        for (var k = 0; k < 2; k++) {
            var j = dists[k].i;
            var key = a < j ? a + ':' + j : j + ':' + a;
            if (seen[key]) continue;
            seen[key] = 1;
            edgePairs.push([a, j]);
        }
    }

    edgePairs.sort(function (p, q) {
        var i0 = p[0] * 3, j0 = p[1] * 3, i1 = q[0] * 3, j1 = q[1] * 3;
        var d0 = Math.pow(nodePositions[i0] - nodePositions[j0], 2) +
                 Math.pow(nodePositions[i0 + 1] - nodePositions[j0 + 1], 2) +
                 Math.pow(nodePositions[i0 + 2] - nodePositions[j0 + 2], 2);
        var d1 = Math.pow(nodePositions[i1] - nodePositions[j1], 2) +
                 Math.pow(nodePositions[i1 + 1] - nodePositions[j1 + 1], 2) +
                 Math.pow(nodePositions[i1 + 2] - nodePositions[j1 + 2], 2);
        return d0 - d1;
    });
    edgePairs = edgePairs.slice(0, PROFILE.edges);

    var edgeCount = edgePairs.length;
    var edgePos = new Float32Array(edgeCount * 6);
    var edgeT = new Float32Array(edgeCount * 2);
    var edgeRand = new Float32Array(edgeCount * 2);
    var edgeOrder = new Float32Array(edgeCount * 2);

    for (var e = 0; e < edgeCount; e++) {
        var i0 = edgePairs[e][0], i1 = edgePairs[e][1];
        edgePos[e * 6] = nodePositions[i0 * 3];
        edgePos[e * 6 + 1] = nodePositions[i0 * 3 + 1];
        edgePos[e * 6 + 2] = nodePositions[i0 * 3 + 2];
        edgePos[e * 6 + 3] = nodePositions[i1 * 3];
        edgePos[e * 6 + 4] = nodePositions[i1 * 3 + 1];
        edgePos[e * 6 + 5] = nodePositions[i1 * 3 + 2];
        edgeT[e * 2] = 0;
        edgeT[e * 2 + 1] = 1;
        var r = rng();
        edgeRand[e * 2] = r;
        edgeRand[e * 2 + 1] = r;
        var o = 0.18 + rng() * 0.5;
        edgeOrder[e * 2] = o;
        edgeOrder[e * 2 + 1] = o;
    }

    var edgeGeo = track(new THREE.BufferGeometry());
    edgeGeo.setAttribute('position', new THREE.BufferAttribute(edgePos, 3));
    edgeGeo.setAttribute('aT', new THREE.BufferAttribute(edgeT, 1));
    edgeGeo.setAttribute('aRand', new THREE.BufferAttribute(edgeRand, 1));
    edgeGeo.setAttribute('aOrder', new THREE.BufferAttribute(edgeOrder, 1));

    var edgeMat = pulseMaterial(C.magenta, C.cyan, 0.28, 0.9);
    neural.add(new THREE.LineSegments(edgeGeo, edgeMat));

    /* ------------------------------------------------------------------
       C. Agent modules
       ------------------------------------------------------------------
       Each module is a different structure in a different hue, placed on a
       tilted ring and linked back to the core, so they read as organs of one
       system rather than floating icons.
       ------------------------------------------------------------------ */

    var agents = new THREE.Group();
    agents.renderOrder = 3;
    world.add(agents);

    var AGENT_KINDS = [
        { kind: 'agent', color: C.violet, glow: C.violet },
        { kind: 'automation', color: C.elecBlue, glow: C.cyan },
        { kind: 'data', color: C.cyan, glow: C.cyan },
        { kind: 'voice', color: C.magenta, glow: C.magenta },
        { kind: 'document', color: C.golden, glow: C.golden },
        { kind: 'workflow', color: C.orange, glow: C.orange },
        { kind: 'analytics', color: C.mustard, glow: C.raspberry }
    ].slice(0, PROFILE.agents);

    var agentModules = [];

    function basicMat(color, opacity, wire) {
        return track(new THREE.MeshBasicMaterial({
            color: color, transparent: true, opacity: opacity,
            wireframe: !!wire, blending: THREE.AdditiveBlending, depthWrite: false
        }));
    }

    function buildAgentModule(spec) {
        var g = new THREE.Group();

        if (spec.kind === 'agent') {
            /* A trio of linked nodes: a miniature agent graph */
            for (var i = 0; i < 3; i++) {
                var s = new THREE.Mesh(track(new THREE.OctahedronGeometry(0.085, 0)), basicMat(spec.color, 0.95));
                s.position.set(Math.cos(i * 2.094) * 0.19, Math.sin(i * 2.094) * 0.19, 0);
                g.add(s);
            }
            var tp = [];
            for (var t2 = 0; t2 < 3; t2++) {
                var n2 = (t2 + 1) % 3;
                tp.push(Math.cos(t2 * 2.094) * 0.19, Math.sin(t2 * 2.094) * 0.19, 0);
                tp.push(Math.cos(n2 * 2.094) * 0.19, Math.sin(n2 * 2.094) * 0.19, 0);
            }
            var tg = track(new THREE.BufferGeometry());
            tg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(tp), 3));
            g.add(new THREE.LineSegments(tg, basicMat(spec.color, 0.5)));

        } else if (spec.kind === 'automation') {
            /* Concentric pathways: a loop that closes on itself */
            g.add(new THREE.Mesh(track(new THREE.TorusGeometry(0.24, 0.012, 6, 40)), basicMat(spec.color, 0.85)));
            var inner = new THREE.Mesh(track(new THREE.TorusGeometry(0.145, 0.01, 6, 30)), basicMat(spec.glow, 0.6));
            inner.rotation.x = Math.PI / 2.4;
            g.add(inner);

        } else if (spec.kind === 'data') {
            /* A compact particle cluster */
            var dp = new Float32Array(14 * 3);
            for (var d = 0; d < 14; d++) {
                var th = rng() * 6.2831, ph = Math.acos(2 * rng() - 1), rr = 0.06 + rng() * 0.19;
                dp[d * 3] = rr * Math.sin(ph) * Math.cos(th);
                dp[d * 3 + 1] = rr * Math.cos(ph);
                dp[d * 3 + 2] = rr * Math.sin(ph) * Math.sin(th);
            }
            var dg = track(new THREE.BufferGeometry());
            dg.setAttribute('position', new THREE.BufferAttribute(dp, 3));
            g.add(new THREE.Points(dg, track(new THREE.PointsMaterial({
                color: spec.color, size: 0.075, transparent: true, opacity: 0.95,
                blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
            }))));

        } else if (spec.kind === 'voice') {
            /* A waveform: amplitude over time */
            var vp = [];
            for (var s2 = 0; s2 <= 28; s2++) {
                var x = (s2 / 28 - 0.5) * 0.62;
                var y = Math.sin(s2 * 0.62) * 0.115 * Math.sin(s2 / 28 * Math.PI);
                vp.push(x, y, 0);
            }
            var vg = track(new THREE.BufferGeometry());
            vg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vp), 3));
            g.add(new THREE.Line(vg, basicMat(spec.color, 0.9)));

        } else if (spec.kind === 'document') {
            /* Stacked translucent data panels */
            for (var p2 = 0; p2 < 3; p2++) {
                var panel = new THREE.Mesh(
                    track(new THREE.PlaneGeometry(0.34, 0.24)),
                    basicMat(p2 === 2 ? spec.glow : spec.color, 0.3 - p2 * 0.06, true)
                );
                panel.position.set(p2 * 0.045 - 0.045, p2 * 0.055 - 0.055, p2 * 0.055 - 0.055);
                panel.rotation.set(-0.35, 0.45, 0);
                g.add(panel);
            }

        } else if (spec.kind === 'workflow') {
            /* Connected blocks: orchestration */
            [[-0.2, 0.09, 0], [0.02, -0.13, 0.05], [0.23, 0.11, -0.03]].forEach(function (p3) {
                var bx = new THREE.Mesh(track(new THREE.BoxGeometry(0.11, 0.11, 0.11)), basicMat(spec.color, 0.85, true));
                bx.position.set(p3[0], p3[1], p3[2]);
                g.add(bx);
            });
            var wg = track(new THREE.BufferGeometry());
            wg.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
                -0.2, 0.09, 0, 0.02, -0.13, 0.05,
                0.02, -0.13, 0.05, 0.23, 0.11, -0.03
            ]), 3));
            g.add(new THREE.LineSegments(wg, basicMat(spec.color, 0.45)));

        } else if (spec.kind === 'analytics') {
            /* A structured data formation: bars of rising height */
            for (var b2 = 0; b2 < 4; b2++) {
                var hgt = 0.08 + b2 * 0.055;
                var bar = new THREE.Mesh(track(new THREE.BoxGeometry(0.05, hgt, 0.05)), basicMat(spec.color, 0.9));
                bar.position.set((b2 - 1.5) * 0.09, hgt / 2 - 0.1, 0);
                g.add(bar);
            }
        }

        g.add(glowSprite(spec.glow, 0.44, 0.12));
        return g;
    }

    for (var ag = 0; ag < AGENT_KINDS.length; ag++) {
        var spec = AGENT_KINDS[ag];
        var module = buildAgentModule(spec);

        /* An ellipse tilted through Y, so modules sit at different depths and
           the ring never reads as flat. */
        var ang = (ag / AGENT_KINDS.length) * Math.PI * 2 - Math.PI / 2;
        var px = Math.cos(ang) * 3.20;
        var pz = Math.sin(ang) * 2.15;
        var py = Math.sin(ang * 2) * 0.55;

        /* The structures inside a module are drawn at roughly 0.5 units
           across, which disappears next to a 3-unit monogram. Scale the
           whole module up so each one reads as a distinct object. */
        module.scale.setScalar(1.7);

        module.position.set(px, py, pz);
        module.userData = {
            base: new THREE.Vector3(px, py, pz),
            phase: ag * 1.7,
            order: 0.42 + (ag / AGENT_KINDS.length) * 0.34
        };
        agents.add(module);
        agentModules.push(module);

        /* A curve back to the core, carrying a travelling pulse */
        var start = new THREE.Vector3(px, py, pz);
        var end = new THREE.Vector3(px * 0.18, py * 0.18, pz * 0.18);
        var mid = start.clone().multiplyScalar(0.52);
        mid.y += 0.42;
        var pts = new THREE.QuadraticBezierCurve3(start, mid, end).getPoints(26);

        var lp = [], lt = [];
        for (var pi = 0; pi < pts.length - 1; pi++) {
            lp.push(pts[pi].x, pts[pi].y, pts[pi].z);
            lp.push(pts[pi + 1].x, pts[pi + 1].y, pts[pi + 1].z);
            lt.push(pi / (pts.length - 1));
            lt.push((pi + 1) / (pts.length - 1));
        }
        var vertCount = lp.length / 3;
        var lg = track(new THREE.BufferGeometry());
        lg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lp), 3));
        lg.setAttribute('aT', new THREE.BufferAttribute(new Float32Array(lt), 1));
        lg.setAttribute('aRand', new THREE.BufferAttribute(new Float32Array(vertCount), 1));
        var lo = new Float32Array(vertCount);
        for (var li = 0; li < vertCount; li++) lo[li] = module.userData.order;
        lg.setAttribute('aOrder', new THREE.BufferAttribute(lo, 1));

        var linkMat = pulseMaterial(spec.color, spec.glow, 0.5 + ag * 0.06, 0.7);
        agents.add(new THREE.LineSegments(lg, linkMat));
        module.userData.linkMat = linkMat;
    }

    /* ------------------------------------------------------------------
       D. Information streams
       ------------------------------------------------------------------
       Particles ride curved paths in from the field, through the core, and
       out again. Each frame samples the curve directly, which keeps the cost
       linear in particle count and free of arc-length tables.
       ------------------------------------------------------------------ */

    var streamCurves = [];
    for (var sc = 0; sc < PROFILE.curves; sc++) {
        var sAng = (sc / PROFILE.curves) * Math.PI * 2 + 0.4;
        var outer = new THREE.Vector3(Math.cos(sAng) * 3.7, (rng() - 0.5) * 2.3, Math.sin(sAng) * 3.0);
        var innerP = new THREE.Vector3(Math.cos(sAng + 1.1) * 0.5, (rng() - 0.5) * 0.5, Math.sin(sAng + 1.1) * 0.5);
        var exit = new THREE.Vector3(Math.cos(sAng + 2.4) * 3.5, (rng() - 0.5) * 2.0, Math.sin(sAng + 2.4) * 2.7);
        var ctrl = outer.clone().multiplyScalar(0.45);
        ctrl.y += 0.9;
        streamCurves.push(new THREE.CatmullRomCurve3([outer, ctrl, innerP, exit], false, 'catmullrom', 0.5));
    }

    var streamCount = PROFILE.curves * PROFILE.perCurve;
    var streamSeed = new Float32Array(streamCount);
    var streamCurveOf = new Uint8Array(streamCount);
    for (var sp = 0; sp < streamCount; sp++) {
        streamCurveOf[sp] = sp % PROFILE.curves;
        streamSeed[sp] = rng();
    }

    var streamGeo = track(new THREE.BufferGeometry());
    streamGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(streamCount * 3), 3));
    var streamMat = track(new THREE.PointsMaterial({
        color: C.cyan, size: 0.055, transparent: true, opacity: 0.7,
        blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
    }));
    var streamPoints = new THREE.Points(streamGeo, streamMat);
    streamPoints.renderOrder = 4;
    world.add(streamPoints);

    /* Ambient motes — depth dust, one draw call */
    var motePos = new Float32Array(PROFILE.motes * 3);
    for (var mt = 0; mt < PROFILE.motes; mt++) {
        var mth = rng() * 6.2831, mph = Math.acos(2 * rng() - 1), mr = 2.9 + rng() * 1.6;
        motePos[mt * 3] = mr * Math.sin(mph) * Math.cos(mth);
        motePos[mt * 3 + 1] = mr * Math.cos(mph) * 0.6;
        motePos[mt * 3 + 2] = mr * Math.sin(mph) * Math.sin(mth);
    }
    var moteGeo = track(new THREE.BufferGeometry());
    moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
    var motes = new THREE.Points(moteGeo, track(new THREE.PointsMaterial({
        color: 0xf7f0df, size: 0.028, transparent: true, opacity: 0.20,
        blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
    })));
    world.add(motes);

    /* ------------------------------------------------------------------
       Lighting — the shards are shader-lit; this gives the sprite glows and
       the envelope something to sit against.
       ------------------------------------------------------------------ */

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    var keyLight = new THREE.PointLight(C.golden, 26, 24, 2);
    keyLight.position.set(-3.4, 4.2, 5.2);
    scene.add(keyLight);
    var rimLight = new THREE.PointLight(C.violet, 22, 26, 2);
    rimLight.position.set(4.2, -2.6, -4.4);
    scene.add(rimLight);

    /* ------------------------------------------------------------------
       Interaction — a local field, not a global follow
       ------------------------------------------------------------------ */

    var pointer = { x: 0, y: 0 };
    var target = { x: 0, y: 0 };
    var excite = 0;
    var exciteTarget = 0;
    var pointerLocal = new THREE.Vector3(99, 99, 99);

    function onPointerMove(ev) {
        var rect = root.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        target.x = ((ev.clientX - rect.left) / rect.width - 0.5) * 2;
        target.y = ((ev.clientY - rect.top) / rect.height - 0.5) * 2;
        exciteTarget = 1;
    }

    function onPointerLeave() {
        exciteTarget = 0;
        target.x = 0;
        target.y = 0;
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
        nodeMat.uniforms.uDpr.value = Math.min(window.devicePixelRatio || 1, PROFILE.dpr);
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
        visible = !document.hidden;
    });

    /* ------------------------------------------------------------------
       Entrance: five stages driven by one progress value
       ------------------------------------------------------------------ */

    var intro = { t: 0, done: false };

    function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }
    function clamp01(x) { return x < 0 ? 0 : (x > 1 ? 1 : x); }
    function stage(p, from, to) { return clamp01((p - from) / (to - from)); }

    /* ------------------------------------------------------------------
       Render loop
       ------------------------------------------------------------------ */

    var clock = new THREE.Clock();
    var rafId = null;
    var elapsed = 0;
    var frameInterval = 1 / PROFILE.fps;
    var frameAccum = 0;
    var tmpVec = new THREE.Vector3();

    function applyTheme() {
        theme.t += ((theme.dark ? 1 : 0) - theme.t) * 0.06;
        var t = theme.t;

        edgeMat.uniforms.uIntensity.value = 0.72 + t * 0.4;
        nodeMat.uniforms.uColorA.value.setHex(t > 0.5 ? C.cyan : C.violet);
        shellMat.uniforms.uOpacity.value = 0.035 + t * 0.04;
        keyLight.intensity = 22 + t * 10;
        rimLight.intensity = 18 + t * 12;
    }

    function frame() {
        rafId = requestAnimationFrame(frame);
        if (!visible) { clock.getDelta(); return; }

        var dt = Math.min(clock.getDelta(), 0.05);

        /* Frame budget on weak devices: skip the expensive work but keep time
           advancing, so animation speed stays honest. */
        frameAccum += dt;
        if (frameAccum < frameInterval) return;
        var step = frameAccum;
        frameAccum = 0;
        elapsed += step;

        applyTheme();

        if (!intro.done) {
            intro.t = Math.min(1, intro.t + step / 3.4);
            if (intro.t >= 1) intro.done = true;
        }
        var p = intro.t;

        /* Stage 1 — the core awakens */
        var s1 = easeOutCubic(stage(p, 0.0, 0.26));
        core.scale.setScalar(0.35 + s1 * 0.65);
        heartMat.opacity = 0.85 * s1;
        coreGlow.material.opacity = (0.4 + theme.t * 0.24) * s1;
        coreHalo.material.opacity = (0.16 + theme.t * 0.16) * s1;

        /* Stage 2 — the mesh lights outward from the centre */
        var s2 = easeOutCubic(stage(p, 0.14, 0.60));
        nodeMat.uniforms.uReveal.value = s2;
        edgeMat.uniforms.uReveal.value = s2;

        /* Stage 3 — agent modules come online one at a time */
        var s3 = stage(p, 0.42, 0.88);
        agentModules.forEach(function (m) {
            var startAt = (m.userData.order - 0.42) / 0.46 * 0.5;
            var local = clamp01((s3 - startAt) / 0.5);
            m.scale.setScalar(1.7 * (0.2 + easeOutCubic(local) * 0.8));
            m.userData.linkMat.uniforms.uReveal.value = clamp01(local);
        });

        /* Stage 4 — streams begin to flow */
        var s4 = easeOutCubic(stage(p, 0.68, 1.0));
        streamMat.opacity = (0.7 + theme.t * 0.25) * s4;
        motes.material.opacity = (0.34 + theme.t * 0.16) * (0.3 + s4 * 0.7);

        /* Once the entrance is done, the heart and its bloom follow the theme
           rather than the intro clock, so a mid-session toggle still lands. */
        if (intro.done) {
            heartMat.opacity = 0.85 + theme.t * 0.08;
            coreGlow.material.opacity = 0.4 + theme.t * 0.24;
            coreHalo.material.opacity = 0.16 + theme.t * 0.16;
        }

        /* Pointer easing */
        pointer.x += (target.x - pointer.x) * Math.min(1, step * 2.6);
        pointer.y += (target.y - pointer.y) * Math.min(1, step * 2.6);
        excite += (exciteTarget - excite) * Math.min(1, step * 3.0);

        pointerLocal.set(pointer.x * 3.4, -pointer.y * 3.4, 0);
        nodeMat.uniforms.uPointer.value.copy(pointerLocal);
        nodeMat.uniforms.uExcite.value = excite;

        var t = elapsed;

        world.rotation.y = t * 0.055 + pointer.x * 0.16;
        world.rotation.x = -0.06 + pointer.y * 0.10 + Math.sin(t * 0.22) * 0.02;

        /* The core drifts on its own axis, independent of the mesh, so the
           two never feel mechanically locked together. */
        /* Oscillate, never spin: a monogram that rotates through 360° is
           edge-on and illegible for half of every cycle. */
        core.rotation.y = Math.sin(t * 0.26) * 0.34;
        core.rotation.x = Math.sin(t * 0.34) * 0.10;
        heart.rotation.y -= step * 0.9;
        heart.rotation.z += step * 0.4;
        heartWire.rotation.y += step * 0.5;
        heartWire.rotation.x -= step * 0.3;

        heart.scale.setScalar(1 + Math.sin(t * 1.5) * 0.06);
        heartWire.scale.setScalar(1 + Math.sin(t * 1.5 + 1.2) * 0.08);
        coreGlow.scale.setScalar(1.5 * (1 + Math.sin(t * 1.1) * 0.05));
        shellMat.uniforms.uPulse.value = 1 + Math.sin(t * 0.9) * 0.12;

        nodeMat.uniforms.uTime.value = t;
        edgeMat.uniforms.uTime.value = t;
        core.traverse(function (o) {
            if (o.material && o.material.uniforms && o.material.uniforms.uTime) {
                o.material.uniforms.uTime.value = t;
            }
        });

        neural.rotation.y = -t * 0.075;
        neural.rotation.x = Math.sin(t * 0.18) * 0.05;

        agentModules.forEach(function (m, idx) {
            var ph = m.userData.phase;
            var b0 = m.userData.base;
            m.position.set(
                b0.x + Math.sin(t * 0.31 + ph) * 0.14,
                b0.y + Math.sin(t * 0.44 + ph * 1.3) * 0.16,
                b0.z + Math.cos(t * 0.27 + ph) * 0.14
            );
            m.rotation.y += step * (0.3 + idx * 0.045);
            m.rotation.x = Math.sin(t * 0.4 + ph) * 0.25;
            m.userData.linkMat.uniforms.uTime.value = t;
            m.userData.linkMat.uniforms.uExcite.value = excite * 0.5;
        });
        agents.rotation.y = t * 0.035;

        /* Streams advance along their curves */
        var posAttr = streamGeo.getAttribute('position');
        for (var i = 0; i < streamCount; i++) {
            var ci = streamCurveOf[i];
            var u = (elapsed * (0.09 + streamSeed[i] * 0.10) + streamSeed[i]) % 1;
            streamCurves[ci].getPoint(u, tmpVec);
            posAttr.array[i * 3] = tmpVec.x;
            posAttr.array[i * 3 + 1] = tmpVec.y;
            posAttr.array[i * 3 + 2] = tmpVec.z;
        }
        posAttr.needsUpdate = true;

        motes.rotation.y += step * 0.02;

        /* Camera parallax: a few centimetres, no more */
        camera.position.x = pointer.x * 0.34;
        camera.position.y = -pointer.y * 0.24;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }

    /* ------------------------------------------------------------------
       Teardown
       ------------------------------------------------------------------ */

    function dispose() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        if (themeObserver) themeObserver.disconnect();
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

    /* A lost context must not leave a dead canvas behind */
    renderer.domElement.addEventListener('webglcontextlost', function (ev) {
        ev.preventDefault();
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        goStatic();
    });

    /* A visitor who turns reduced-motion on mid-session gets the still frame */
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
    resize();
    frame();
})();
