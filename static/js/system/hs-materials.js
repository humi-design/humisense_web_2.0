/* ==========================================================================
   hs-materials — the material system for the Intelligence System.

   Two complete art directions, not an inverted one. Light mode is a bright
   studio product shot: pale machined metal, clear optical glass, saturated
   blue/violet tint. Dark mode is a lit chamber: near-black anodised metal,
   deep glass, internal emission doing most of the work.

   Every material registers in `ledger` so dispose() can release GPU memory.
   ========================================================================== */

(function (global) {
    'use strict';

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

    function createMaterials(ledger) {
        function keep(m) { ledger.push(m); return m; }

        var M = {};

        /* Body of the frame: anodised, low-gloss, strongly tinted.
           Light mode needs enough darkness to hold a silhouette against a
           warm white page; dark mode needs to sit just above the background. */
        M.body = keep(new THREE.MeshStandardMaterial({
            color: 0x35447f,
            metalness: 0.88,
            roughness: 0.34,
            flatShading: true
        }));

        /* Sockets and collars: brighter, tighter, reads as machined detail. */
        M.machined = keep(new THREE.MeshStandardMaterial({
            color: 0x9db3e6,
            metalness: 0.96,
            roughness: 0.18,
            flatShading: true
        }));

        /* The gantry arm and crown: darker, more directional. */
        M.structure = keep(new THREE.MeshStandardMaterial({
            color: 0x43308f,
            metalness: 0.82,
            roughness: 0.42,
            flatShading: true
        }));

        /* Optical glass for the chamber. Kept at moderate roughness: at
           near-mirror the environment reflection swamps the tint entirely. */
        M.glass = keep(new THREE.MeshStandardMaterial({
            color: 0x9fd4ff,
            metalness: 0.0,
            roughness: 0.16,
            transparent: true,
            opacity: 0.30,
            side: THREE.DoubleSide,
            depthWrite: false
        }));

        /* Glass interior: the stacked optical elements. */
        M.lens = keep(new THREE.MeshStandardMaterial({
            color: 0x6f7bff,
            metalness: 0.2,
            roughness: 0.1,
            transparent: true,
            opacity: 0.55,
            emissive: 0x2b3bd0,
            emissiveIntensity: 0.5
        }));

        /* Cyan: active information. The only material allowed to read as
           "signal" in the composition. */
        M.signal = keep(new THREE.MeshBasicMaterial({
            color: C.cyan,
            transparent: true,
            opacity: 0.92
        }));

        /* Warm: transformation / processing. Used sparingly at activation. */
        M.transform = keep(new THREE.MeshBasicMaterial({
            color: C.orange,
            transparent: true,
            opacity: 0.9
        }));

        /* Channel walls behind the signal lines, so pathways have body. */
        M.channel = keep(new THREE.MeshStandardMaterial({
            color: 0x2f4f86,
            metalness: 0.7,
            roughness: 0.5,
            flatShading: true
        }));

        /* Module face plates: neutral, lets the emissive ring do the talking. */
        M.module = keep(new THREE.MeshStandardMaterial({
            color: 0x5b4ba8,
            metalness: 0.9,
            roughness: 0.3,
            flatShading: true
        }));

        return M;
    }

    /* Apply the art direction. Called on init and on every theme change, so
       the transition is a material swap rather than a scene rebuild. */
    function applyTheme(M, dark, T) {
        if (dark) {
            M.body.color.setHex(0x2a3358);
            M.body.roughness = 0.38;
            M.machined.color.setHex(0x8fa4d4);
            M.machined.roughness = 0.22;
            M.structure.color.setHex(0x2b1f63);
            M.structure.roughness = 0.46;
            M.glass.color.setHex(0x7fb4ff);
            M.glass.opacity = 0.22;
            M.lens.color.setHex(0x5b6bff);
            M.lens.emissiveIntensity = 1.15;
            M.channel.color.setHex(0x1f3560);
            M.module.color.setHex(0x453a86);
        } else {
            M.body.color.setHex(0x35447f);
            M.body.roughness = 0.34;
            M.machined.color.setHex(0x9db3e6);
            M.machined.roughness = 0.18;
            M.structure.color.setHex(0x43308f);
            M.structure.roughness = 0.42;
            M.glass.color.setHex(0x9fd4ff);
            M.glass.opacity = 0.30;
            M.lens.color.setHex(0x6f7bff);
            M.lens.emissiveIntensity = 0.5;
            M.channel.color.setHex(0x2f4f86);
            M.module.color.setHex(0x5b4ba8);
        }
        if (T) {
            /* Emission strength is the main lever between the two modes:
               dark mode is lit from inside, light mode from the studio. */
            M.signal.opacity = dark ? 0.95 : 0.85;
            M.transform.opacity = dark ? 0.95 : 0.85;
        }
    }

    global.HSMaterials = {
        palette: C,
        create: createMaterials,
        applyTheme: applyTheme
    };
})(window);
