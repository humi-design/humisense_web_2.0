/* ==========================================================================
   hs-lighting — cinematic studio lighting for the Intelligence System.

   Three-point rig plus internal chamber light, retuned per art direction.
   Light mode is a bright product shot: strong key from upper left, cool fill,
   a rim that separates the object from a warm white page. Dark mode is a lit
   chamber: the key drops, the rim and internal emission carry the form.

   The environment map is built in code rather than loaded, so there is no
   external asset to disappear. Panel colours are saturated on purpose: a
   white-dominant environment washes the brand tint out of the metal and the
   glass entirely.
   ========================================================================== */

(function (global) {
    'use strict';

    var P = global.HSMaterials.palette;

    function build(scene, renderer, ledger, profile) {
        var group = new THREE.Group();
        scene.add(group);

        var key = new THREE.DirectionalLight(0xfff4e6, 2.1);
        key.position.set(6.5, 8.5, 6.0);
        group.add(key);

        var fill = new THREE.DirectionalLight(0x9db8ff, 0.85);
        fill.position.set(-7.0, 2.0, 4.5);
        group.add(fill);

        var rim = new THREE.DirectionalLight(0x7fb4ff, 1.6);
        rim.position.set(-3.0, 4.5, -7.5);
        group.add(rim);

        /* Warm rim from lower right: the "transformation" accent. A directional
           light rather than a point light because a decay-2 point source is
           swamped by the key at this scale, and this needs to read as a warm
           edge on the lower-right faces. */
        var kicker = new THREE.DirectionalLight(P.orange, 0.9);
        kicker.position.set(5.5, -3.2, 3.4);
        group.add(kicker);

        var ambient = new THREE.AmbientLight(0xdfe6ff, 0.55);
        group.add(ambient);

        /* Internal chamber light: intelligence seen from inside. */
        var chamberLight = new THREE.PointLight(P.cyan, 1.1, 6.5, 2);
        chamberLight.position.set(0, -1.02, 0.55);
        group.add(chamberLight);

        /* ----------------------------------------------------------------
           Environment map, built from coloured panels. Cheap (one PMREM
           pass at init) and it is what gives the metal something to reflect.
           ---------------------------------------------------------------- */
        var envScene = new THREE.Scene();
        var panels = [];
        function panel(color, intensity, w, h, pos, rot) {
            var m = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity) });
            var g = new THREE.PlaneGeometry(w, h);
            var mesh = new THREE.Mesh(g, m);
            mesh.position.set(pos[0], pos[1], pos[2]);
            if (rot) mesh.rotation.set(rot[0], rot[1], rot[2]);
            envScene.add(mesh);
            panels.push(mesh);
            ledger.push(g, m);
            return mesh;
        }

        /* Cool overhead softbox, warm side bounce, blue rear panel, violet
           floor bounce. Saturated so reflections carry the palette. */
        panel(0xffe9c4, 0.95, 1.2, 13, [-2.5, 4.5, 7.5], [0.2, 0.1, 0]);
        panel(0x2f5cff, 0.85, 9, 6, [6.0, 1.0, -3.0], [0, -1.05, 0]);
        panel(0x7545e8, 0.7, 8, 8, [-6.0, 0.0, -2.0], [0, 1.05, 0]);
        panel(0x23d8f2, 0.45, 3.5, 3.5, [2.0, -4.0, 4.0], [0.9, 0, 0]);
        panel(0xff941a, 0.32, 2.6, 2.6, [-3.0, -3.4, 2.5], [0.7, 0.4, 0]);

        var pmrem = new THREE.PMREMGenerator(renderer);
        pmrem.compileEquirectangularShader();
        /* r149 signature is fromScene(scene, sigma, near, far). The blur budget
           is capped at 20 samples, and r149 requests roughly sigma*487 of them,
           so anything above ~0.04 clips the kernel and warns on every load. */
        var envRT = pmrem.fromScene(envScene, profile.envSigma, 0.1, 100);
        var envMap = envRT.texture;
        pmrem.dispose();
        panels.forEach(function (p) { p.geometry.dispose(); p.material.dispose(); });

        return {
            group: group,
            key: key,
            fill: fill,
            rim: rim,
            kicker: kicker,
            ambient: ambient,
            chamberLight: chamberLight,
            envMap: envMap,
            envRT: envRT
        };
    }

    function applyTheme(L, dark) {
        if (dark) {
            L.key.intensity = 0.85;
            L.key.color.setHex(0xc9d6ff);
            L.fill.intensity = 0.45;
            L.rim.intensity = 2.4;
            L.rim.color.setHex(0x6fa8ff);
            L.ambient.intensity = 0.16;
            L.ambient.color.setHex(0x2a3560);
            L.chamberLight.intensity = 2.2;
            L.kicker.intensity = 1.5;
        } else {
            L.key.intensity = 2.1;
            L.key.color.setHex(0xfff4e6);
            L.fill.intensity = 0.85;
            L.rim.intensity = 1.6;
            L.rim.color.setHex(0x7fb4ff);
            L.ambient.intensity = 0.55;
            L.ambient.color.setHex(0xdfe6ff);
            L.chamberLight.intensity = 1.1;
            L.kicker.intensity = 0.9;
        }
    }

    global.HSLighting = { build: build, applyTheme: applyTheme };
})(window);
