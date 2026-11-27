/* ==========================================================================
   hs-geo — geometry primitives for the Humisense Intelligence System.

   Everything here builds bespoke BufferGeometry from maths. No external
   models, no texture files: the whole structure must survive being deleted
   from a CDN, and a clay render has to read on its own.
   ========================================================================== */

(function (global) {
    'use strict';

    /* Superellipse point. n=2 is an ellipse; n>=6 gives the flat machined face
       with a tight corner radius that reads as milled rather than moulded. */
    function squircle(theta, rx, rz, n) {
        var ct = Math.cos(theta), st = Math.sin(theta);
        var sx = Math.sign(ct) * Math.pow(Math.abs(ct), 2 / n);
        var sz = Math.sign(st) * Math.pow(Math.abs(st), 2 / n);
        return [rx * sx, rz * sz];
    }

    /* Loft a stack of squircle rings into a closed solid with real flat caps.
       Each ring: { y, rx, rz, n, ox, oz, twist }. */
    function loft(rings, segs) {
        var pos = [], idx = [];
        var cols = segs;
        var r, s;

        for (r = 0; r < rings.length; r++) {
            var ring = rings[r];
            for (s = 0; s < cols; s++) {
                var th = (s / cols) * Math.PI * 2 + (ring.twist || 0);
                var p = squircle(th, ring.rx, ring.rz, ring.n);
                pos.push(p[0] + (ring.ox || 0), ring.y, p[1] + (ring.oz || 0));
            }
        }
        for (r = 0; r < rings.length - 1; r++) {
            for (s = 0; s < cols; s++) {
                var a = r * cols + s;
                var b = r * cols + ((s + 1) % cols);
                var c = (r + 1) * cols + ((s + 1) % cols);
                var d = (r + 1) * cols + s;
                idx.push(a, b, c, a, c, d);
            }
        }

        var geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        geo.setIndex(idx);
        geo.computeVertexNormals();

        geo = cap(geo, rings[rings.length - 1], cols, true);
        geo = cap(geo, rings[0], cols, false);
        geo.computeVertexNormals();
        return geo;
    }

    /* Append one flat cap so the normal is exactly the ring plane rather than
       an averaged bevel that softens the edge highlight. */
    function cap(geo, ring, cols, top) {
        var verts = [ring.ox || 0, ring.y, ring.oz || 0];
        var indices = [];
        var base = geo.attributes.position.count;
        var s;

        for (s = 0; s < cols; s++) {
            var th = (s / cols) * Math.PI * 2 + (ring.twist || 0);
            var p = squircle(th, ring.rx, ring.rz, ring.n);
            verts.push(p[0] + (ring.ox || 0), ring.y, p[1] + (ring.oz || 0));
        }
        for (s = 0; s < cols; s++) {
            var i1 = base + 1 + s;
            var i2 = base + 1 + ((s + 1) % cols);
            if (top) indices.push(base, i1, i2);
            else indices.push(base, i2, i1);
        }

        var oldPos = geo.attributes.position.array;
        var oldIdx = geo.index ? geo.index.array : [];
        var allPos = new Float32Array(oldPos.length + verts.length);
        allPos.set(oldPos, 0);
        allPos.set(verts, oldPos.length);
        var allIdx = new Uint32Array(oldIdx.length + indices.length);
        allIdx.set(oldIdx, 0);
        allIdx.set(indices, oldIdx.length);

        var out = new THREE.BufferGeometry();
        out.setAttribute('position', new THREE.BufferAttribute(allPos, 3));
        out.setIndex(new THREE.BufferAttribute(allIdx, 1));
        geo.dispose();
        return out;
    }

    /* Extruded plate with a genuine bevel. The bevel is what produces the
       crisp highlight line along a machined edge. */
    function plate(shapeFn, depth, bevel) {
        var shape = new THREE.Shape();
        shapeFn(shape);
        var geo = new THREE.ExtrudeGeometry(shape, {
            depth: depth,
            bevelEnabled: bevel > 0,
            bevelThickness: bevel,
            bevelSize: bevel,
            bevelSegments: 2,
            curveSegments: 8
        });
        geo.center();
        return geo;
    }

    /* Rounded rectangle path, used for module faces and the glass chamber. */
    function roundedRect(w, h, r) {
        return function (shape) {
            var x = -w / 2, y = -h / 2;
            shape.moveTo(x + r, y);
            shape.lineTo(x + w - r, y);
            shape.quadraticCurveTo(x + w, y, x + w, y + r);
            shape.lineTo(x + w, y + h - r);
            shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            shape.lineTo(x + r, y + h);
            shape.quadraticCurveTo(x, y + h, x, y + h - r);
            shape.lineTo(x, y + r);
            shape.quadraticCurveTo(x, y, x + r, y);
        };
    }

    /* Machined bezel: a rectangular frame with a real aperture through it.
       Used around the optical chamber. Deliberately not a torus — a round
       ring reads as the prohibited orbital form, and a squared bezel also
       matches the milled language of the rest of the object. */
    function bezel(w, h, thickness, depth, bevel) {
        var shape = new THREE.Shape();
        var x = -w / 2, y = -h / 2;
        shape.moveTo(x, y);
        shape.lineTo(x + w, y);
        shape.lineTo(x + w, y + h);
        shape.lineTo(x, y + h);
        shape.closePath();

        var hole = new THREE.Path();
        var ix = x + thickness, iy = y + thickness;
        var iw = w - thickness * 2, ih = h - thickness * 2;
        hole.moveTo(ix, iy);
        hole.lineTo(ix, iy + ih);
        hole.lineTo(ix + iw, iy + ih);
        hole.lineTo(ix + iw, iy);
        hole.closePath();
        shape.holes.push(hole);

        var geo = new THREE.ExtrudeGeometry(shape, {
            depth: depth,
            bevelEnabled: bevel > 0,
            bevelThickness: bevel,
            bevelSize: bevel,
            bevelSegments: 2,
            curveSegments: 4
        });
        geo.center();
        return geo;
    }

    /* Tapered rectangular beam between two points, built along +Y then
       oriented. Used for the gantry arm and the strut bracing. */
    function beam(length, wTop, wBottom, depth) {
        return loft([
            { y: -length / 2, rx: wBottom / 2, rz: depth / 2, n: 7 },
            { y: -length / 2 + 0.02, rx: wBottom / 2, rz: depth / 2, n: 7 },
            { y: length / 2 - 0.02, rx: wTop / 2, rz: depth / 2, n: 7 },
            { y: length / 2, rx: wTop / 2, rz: depth / 2, n: 7 }
        ], 24);
    }

    /* Hollow tube run between two points with a given radius and wall.
       Built as a straight cylinder plus end rings so it stays cheap. */
    function tube(length, radius, segs) {
        var geo = new THREE.CylinderGeometry(radius, radius, length, segs || 12, 1, false);
        return geo;
    }

    global.HSGeo = {
        squircle: squircle,
        loft: loft,
        plate: plate,
        bezel: bezel,
        roundedRect: roundedRect,
        beam: beam,
        tube: tube
    };
})(window);
