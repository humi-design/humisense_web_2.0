/* ==========================================================================
   hs-structure — THE FRAME.

   The central object. An asymmetric precision gantry: a tapered vertical core
   carrying eight machined module sockets, an upper arm reaching right and a
   shorter counter-arm reaching left at a different height, a machined collar
   opening onto the optical chamber at mid-height, and an asymmetric fin crown.

   Design constraints, in order of importance:
   1. It must read as a silhouette with no colour, lighting or effects. Three
      masses (core / upper arm / counter-arm) separated by real negative space,
      with a strong vertical axis. Never a single blob, never an "L".
   2. It must be modular, because sections 02, 03 and 05 need the modules to
      separate, activate and re-coordinate.
   3. No prohibited form: no ring, torus, spiral, intertwined tube, atom, H.

   Proportions are deliberate: the arms together span roughly the core height,
   so the object reads as a balanced assembly rather than a flag on a pole.
   ========================================================================== */

(function (global) {
    'use strict';

    var GEO = global.HSGeo;

    function build(M, ledger, profile) {
        var keep = function (g) { ledger.push(g); return g; };

        var root = new THREE.Group();
        var modules = [];
        var channels = [];
        var signalLines = [];

        var segs = profile.segs;

        /* ----------------------------------------------------------------
           Core — the vertical mass. Faceted, tapered at both ends, with a
           pronounced collar at mid-height where the chamber sits. The collar
           is what stops the column reading as a plain cylinder.
           ---------------------------------------------------------------- */
        var coreRings = [
            { y: -2.70, rx: 0.34, rz: 0.28, n: 7 },
            { y: -2.44, rx: 0.50, rz: 0.40, n: 7 },
            { y: -1.90, rx: 0.46, rz: 0.37, n: 7 },
            { y: -1.52, rx: 0.40, rz: 0.33, n: 7 },
            { y: -1.36, rx: 0.56, rz: 0.45, n: 8 },
            { y: -1.02, rx: 0.58, rz: 0.47, n: 8 },
            { y: -0.86, rx: 0.40, rz: 0.33, n: 7 },
            { y: -0.30, rx: 0.36, rz: 0.30, n: 7 },
            { y: 0.55, rx: 0.33, rz: 0.27, n: 7 },
            { y: 1.35, rx: 0.38, rz: 0.31, n: 7 },
            { y: 2.02, rx: 0.42, rz: 0.34, n: 7 },
            { y: 2.28, rx: 0.30, rz: 0.25, n: 7 }
        ];
        var core = new THREE.Mesh(keep(GEO.loft(coreRings, segs)), M.body);
        root.add(core);

        /* Plinth: asymmetric footprint, grounds the object. */
        var plinth = new THREE.Mesh(keep(GEO.loft([
            { y: -2.96, rx: 0.78, rz: 0.54, n: 8 },
            { y: -2.84, rx: 0.84, rz: 0.58, n: 8, ox: 0.03 },
            { y: -2.66, rx: 0.66, rz: 0.47, n: 8 }
        ], segs)), M.machined);
        root.add(plinth);

        /* ----------------------------------------------------------------
           Upper arm — reaches right from high on the core, angled slightly
           down so it reads as load-bearing rather than decorative.
           ---------------------------------------------------------------- */
        var armUpper = new THREE.Group();
        var armUpperMesh = new THREE.Mesh(keep(GEO.beam(1.62, 0.26, 0.44, 0.30)), M.structure);
        armUpperMesh.rotation.z = Math.PI / 2 + 0.09;
        armUpperMesh.position.set(0.78, 1.50, 0);
        armUpper.add(armUpperMesh);

        /* Arm head: machined block, the visual full stop. */
        var headUpper = new THREE.Mesh(keep(GEO.loft([
            { y: -0.30, rx: 0.26, rz: 0.23, n: 8 },
            { y: -0.20, rx: 0.33, rz: 0.29, n: 8 },
            { y: 0.20, rx: 0.33, rz: 0.29, n: 8 },
            { y: 0.30, rx: 0.26, rz: 0.23, n: 8 }
        ], segs)), M.machined);
        headUpper.position.set(1.58, 1.42, 0);
        armUpper.add(headUpper);
        root.add(armUpper);

        /* ----------------------------------------------------------------
           Counter-arm — shorter, opposite side, lower. This is what makes
           the composition asymmetric but balanced instead of an "L".
           ---------------------------------------------------------------- */
        var armLower = new THREE.Group();
        var armLowerMesh = new THREE.Mesh(keep(GEO.beam(1.16, 0.20, 0.34, 0.24)), M.structure);
        armLowerMesh.rotation.z = Math.PI / 2 - 0.12;
        armLowerMesh.position.set(-0.62, -0.12, 0.02);
        armLower.add(armLowerMesh);

        var headLower = new THREE.Mesh(keep(GEO.loft([
            { y: -0.22, rx: 0.21, rz: 0.19, n: 8 },
            { y: -0.14, rx: 0.26, rz: 0.23, n: 8 },
            { y: 0.14, rx: 0.26, rz: 0.23, n: 8 },
            { y: 0.22, rx: 0.21, rz: 0.19, n: 8 }
        ], segs)), M.machined);
        headLower.position.set(-1.18, -0.06, 0.02);
        armLower.add(headLower);
        root.add(armLower);

        /* Diagonal brace from core to upper arm — engineered, not assembled. */
        var brace = new THREE.Mesh(keep(GEO.beam(1.05, 0.09, 0.11, 0.09)), M.structure);
        brace.position.set(0.52, 1.94, 0);
        brace.rotation.z = -0.72;
        root.add(brace);

        /* ----------------------------------------------------------------
           Crown — four fins of varied height, leaning. Breaks the top edge
           so the profile has a signature rather than ending in a stub.
           ---------------------------------------------------------------- */
        var crown = new THREE.Group();
        var finSpecs = [
            { h: 1.05, w: 0.10, x: -0.30, z: 0.06, rz: 0.16 },
            { h: 1.52, w: 0.11, x: -0.10, z: -0.05, rz: 0.05 },
            { h: 1.18, w: 0.09, x: 0.09, z: 0.07, rz: -0.09 },
            { h: 0.74, w: 0.08, x: 0.25, z: -0.02, rz: -0.21 }
        ];
        for (var f = 0; f < finSpecs.length; f++) {
            var fs = finSpecs[f];
            var fin = new THREE.Mesh(keep(GEO.plate(function (sh) {
                sh.moveTo(-fs.w / 2, 0);
                sh.lineTo(fs.w / 2, 0);
                sh.lineTo(fs.w * 0.20, fs.h);
                sh.lineTo(-fs.w * 0.30, fs.h * 0.95);
                sh.closePath();
            }, 0.11, 0.010)), M.machined);
            fin.position.set(fs.x, 2.30 + fs.h / 2, fs.z);
            fin.rotation.z = fs.rz;
            crown.add(fin);
        }
        root.add(crown);

        /* ----------------------------------------------------------------
           Module sockets — eight, distributed around the core and along the
           arms rather than in one line, so they read as functional zones.
           `attach` names the group each socket belongs to.
           ---------------------------------------------------------------- */
        var moduleSpecs = [
            { x: 0.42, y: 1.98, z: 0.10, side: 1, attach: 'core' },
            { x: -0.40, y: 1.66, z: 0.12, side: -1, attach: 'core' },
            { x: 0.94, y: 1.46, z: 0.16, side: 1, attach: 'upper' },
            { x: 0.38, y: 0.62, z: 0.10, side: 1, attach: 'core' },
            { x: -0.36, y: 0.28, z: 0.12, side: -1, attach: 'core' },
            { x: -0.72, y: -0.14, z: 0.16, side: -1, attach: 'lower' },
            { x: 0.40, y: -0.62, z: 0.10, side: 1, attach: 'core' },
            { x: -0.38, y: -2.06, z: 0.12, side: -1, attach: 'core' }
        ];

        for (var i = 0; i < moduleSpecs.length; i++) {
            var ms = moduleSpecs[i];
            var mod = new THREE.Group();
            mod.position.set(ms.x, ms.y, ms.z);

            var collar = new THREE.Mesh(keep(GEO.loft([
                { y: -0.085, rx: 0.175, rz: 0.145, n: 8 },
                { y: -0.055, rx: 0.215, rz: 0.180, n: 8 },
                { y: 0.055, rx: 0.215, rz: 0.180, n: 8 },
                { y: 0.085, rx: 0.175, rz: 0.145, n: 8 }
            ], 20)), M.module);
            collar.rotation.z = Math.PI / 2;
            mod.add(collar);

            var face = new THREE.Mesh(keep(GEO.plate(GEO.roundedRect(0.22, 0.28, 0.035), 0.045, 0.007)), M.machined);
            face.rotation.y = Math.PI / 2;
            face.position.x = ms.side * 0.13;
            mod.add(face);

            var ringMat = M.signal.clone();
            ledger.push(ringMat);
            ringMat.opacity = 0;
            var ring = new THREE.Mesh(keep(new THREE.RingGeometry(0.072, 0.098, 22)), ringMat);
            ring.rotation.y = Math.PI / 2;
            ring.position.x = ms.side * 0.155;
            mod.add(ring);

            mod.userData.ring = ring;
            mod.userData.home = new THREE.Vector3(ms.x, ms.y, ms.z);
            mod.userData.side = ms.side;
            mod.userData.attach = ms.attach;
            modules.push(mod);
            root.add(mod);
        }

        /* ----------------------------------------------------------------
           Optical chamber — seated in the core behind a machined collar.
           This is where "internal light = intelligence" lives. The collar
           creates a real aperture so the glass is seen through metal, not
           floating in front of it.
           ---------------------------------------------------------------- */
        var chamber = new THREE.Group();
        chamber.position.set(0, -1.02, 0.30);

        var chamberBody = new THREE.Mesh(keep(GEO.loft([
            { y: -0.44, rx: 0.30, rz: 0.24, n: 9 },
            { y: -0.38, rx: 0.44, rz: 0.35, n: 9 },
            { y: 0.38, rx: 0.44, rz: 0.35, n: 9 },
            { y: 0.44, rx: 0.30, rz: 0.24, n: 9 }
        ], segs)), M.glass);
        chamberBody.renderOrder = 2;
        chamber.add(chamberBody);

        var lenses = [];
        for (var L = 0; L < 4; L++) {
            var lens = new THREE.Mesh(
                keep(new THREE.CylinderGeometry(0.245 - L * 0.014, 0.245 - L * 0.014, 0.05, 26)),
                M.lens
            );
            lens.position.y = -0.23 + L * 0.155;
            lens.rotation.x = Math.PI / 2;
            lens.rotation.z = L * 0.2;
            lenses.push(lens);
            chamber.add(lens);
        }
        chamber.userData.lenses = lenses;
        root.add(chamber);

        /* Squared machined bezel around the chamber: the aperture the glass
           is seen through. A round ring here would read as the prohibited
           orbital form; a squared bezel also matches the milled language. */
        var aperture = new THREE.Mesh(keep(GEO.bezel(1.10, 1.18, 0.13, 0.10, 0.012)), M.machined);
        aperture.position.set(0, -1.02, 0.30);
        root.add(aperture);

        /* ----------------------------------------------------------------
           Channels — machined conduits from core to each socket. Thin,
           rectangular, planar. Deliberately not tubes: round conduits read
           as the prohibited intertwined-vine form.
           ---------------------------------------------------------------- */
        for (var c = 0; c < moduleSpecs.length; c++) {
            var cm = moduleSpecs[c];
            if (cm.attach !== 'core') continue;
            var ch = new THREE.Mesh(keep(GEO.beam(0.26, 0.05, 0.05, 0.045)), M.channel);
            ch.position.set(cm.x * 0.72, cm.y, cm.z + 0.04);
            ch.rotation.z = cm.side * 0.5;
            channels.push(ch);
            root.add(ch);

            var slMat = M.signal.clone();
            ledger.push(slMat);
            slMat.opacity = 0;
            var sl = new THREE.Mesh(keep(new THREE.BoxGeometry(0.020, 0.24, 0.010)), slMat);
            sl.position.set(cm.x * 0.72, cm.y, cm.z + 0.075);
            sl.rotation.z = cm.side * 0.5;
            signalLines.push(sl);
            root.add(sl);
        }

        return {
            root: root,
            core: core,
            plinth: plinth,
            armUpper: armUpper,
            armLower: armLower,
            crown: crown,
            chamber: chamber,
            chamberBody: chamberBody,
            lenses: lenses,
            aperture: aperture,
            modules: modules,
            channels: channels,
            signalLines: signalLines
        };
    }

    global.HSStructure = { build: build };
})(window);
