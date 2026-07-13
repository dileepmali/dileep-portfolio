import { useLayoutEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

/*
 * About-section 3D — a cinematic particle IRON MAN. ~120k particles sampled from a
 * full-body model assemble a standing figure, procedurally painted with a red+gold
 * armoured suit: gold faceplate with glowing eye-slits, a pulsing arc-reactor on the
 * chest, gold shoulders / gauntlets / belt / boots, red plating everywhere else.
 * Lambert lighting gives the armour real 3D form; back-facing body particles are
 * culled so the front reads clearly. Assembles when the section scrolls into view.
 */
const VERT = `
  uniform float uProgress;
  uniform float uTime;
  uniform vec2 uCursor;
  uniform float uCursorStrength;
  uniform float uHalfW;
  uniform vec2 uPunch;
  attribute vec3 aTarget;
  attribute vec3 aScatter;
  attribute vec3 aNormal;
  attribute vec3 aColor;
  attribute float aSeed;
  attribute float aEmissive; // 1.0 = self-lit (reactor / eyes)
  attribute float aBuild;    // 0 at the feet .. 1 at the head (assembly order)
  varying float vDepth;
  varying float vSeed;
  varying float vLight;
  varying float vVis;
  varying vec3 vColor;
  varying float vEmissive;
  varying float vFlow;
  varying float vBuildA;
  varying float vFlight;

  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0); const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy)); vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz); vec3 l = 1.0 - g; vec3 i1 = min(g.xyz, l.zxy); vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx; vec3 x2 = x0 - i2 + 2.0*C.xxx; vec3 x3 = x0 - 1.0 + 3.0*C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0; vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z); vec4 x_ = floor(j * ns.z); vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy; vec4 y = y_ * ns.x + ns.yyyy; vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy); vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0; vec4 s1 = floor(b1)*2.0 + 1.0; vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy; vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x); vec3 p1 = vec3(a0.zw, h.y); vec3 p2 = vec3(a1.xy, h.z); vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0); m = m*m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  vec3 curl(vec3 p){
    float e = 0.12;
    float a = snoise(vec3(p.x, p.y+e, p.z)) - snoise(vec3(p.x, p.y-e, p.z));
    float b = snoise(vec3(p.x, p.y, p.z+e)) - snoise(vec3(p.x, p.y, p.z-e));
    float c = snoise(vec3(p.x+e, p.y, p.z)) - snoise(vec3(p.x-e, p.y, p.z));
    return normalize(vec3(a - b, b - c, c - a) / (2.0*e));
  }

  void main(){
    // WALL BUILD (bottom-up, layer by layer): a sharp "build line" H rises from
    // the feet to the head. A particle stays hidden until the line reaches its
    // height, then snaps into place within a thin band W — like laying one brick
    // row on top of the last. Below the line = solid, above = empty.
    float W = 0.11;                                   // thickness of the active row (wider = slower float)
    float H = uProgress * (1.0 + W);                  // build line, 0 (feet) → 1+ (head)
    float bh = aBuild + (aSeed - 0.5) * 0.018;        // tiny jitter so the row edge isn't dead flat
    float pr = clamp((H - bh) / W, 0.0, 1.0);
    pr = pr*pr*(3.0-2.0*pr);
    float started = step(0.0001, pr);                 // 0 while still above the line (hidden)
    float flight = pr * (1.0 - pr) * 4.0;             // 0 at ends, 1 mid-flight (while floating in)
    vFlight = flight;
    vBuildA = smoothstep(0.0, 0.14, pr);              // appear at full opacity as soon as it starts moving
    vec3 pos = mix(aScatter, aTarget, pr);
    float turb = sin(pr*3.14159)*0.35 + 0.02;
    pos += curl(aTarget*0.7 + uTime*0.05) * turb;
    pos += curl(aTarget*1.4 + uTime*0.12) * 0.01 * pr; // subtle idle breathing

    // --- boxing: once assembled, jab the arm particles forward (approx, no rig) ---
    float built = smoothstep(0.985, 1.0, uProgress);
    float ax = abs(aTarget.x) / max(uHalfW, 0.001);
    float armH = smoothstep(0.42, 0.56, aBuild) * (1.0 - smoothstep(0.80, 0.92, aBuild));
    float armMask = smoothstep(0.5, 0.85, ax) * armH * built;
    float punchAmt = mix(uPunch.x, uPunch.y, step(0.0, aTarget.x));
    pos.z += armMask * punchAmt * 0.75;
    pos.x -= armMask * punchAmt * sign(aTarget.x) * 0.22;
    pos.y += armMask * punchAmt * 0.06;

    // cursor magnetism ripple
    float cd = distance(pos.xy, uCursor);
    float infl = smoothstep(1.2, 0.0, cd) * uCursorStrength * pr;
    pos.xy += normalize(pos.xy - uCursor + vec2(0.0001)) * infl * 0.2;
    pos.z += infl * 0.3;

    vSeed = aSeed;
    vColor = aColor;
    vEmissive = aEmissive;
    // energy pulse travelling UP the suit — powers the nano circuitry
    vFlow = 0.5 + 0.5 * sin(aTarget.y * 7.0 - uTime * 3.2);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vec4 mvC = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    vDepth = clamp((mv.z - mvC.z) / 1.6, -1.0, 1.0) * 0.5 + 0.5;

    // lambert lighting — makes the armour's face/limbs read as 3D form
    vec3 n = normalize(normalMatrix * aNormal);
    vec3 keyDir = normalize(vec3(0.28, 0.42, 0.9));
    vec3 rimDir = normalize(vec3(-0.55, 0.25, -0.5));
    float key = max(dot(n, keyDir), 0.0);
    float rim = pow(max(dot(n, rimDir), 0.0), 2.5) * 0.6;
    vLight = mix(0.75, 0.14 + 1.0 * key + rim, pr);

    // back-face cull the body once assembled (emissive parts always show)
    float front = smoothstep(-0.05, 0.28, n.z);
    float bodyVis = mix(1.0, front, pr);
    vVis = max(bodyVis, aEmissive);

    // bigger while floating in so the travelling cubes read clearly, normal once placed
    gl_PointSize = (0.6 + aSeed*0.9) * (20.0 / -mv.z) * clamp(vVis + aEmissive, 0.0, 1.0) * started * (1.0 + flight * 1.6);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = `
  precision highp float;
  uniform float uTime;
  varying float vDepth;
  varying float vSeed;
  varying float vLight;
  varying float vVis;
  varying vec3 vColor;
  varying float vEmissive;
  varying float vFlow;
  varying float vBuildA;
  varying float vFlight;
  void main(){
    if (vVis < 0.02 || vBuildA < 0.01) discard; // culled or not-yet-built particle
    float dd = length(gl_PointCoord - 0.5);
    if (dd > 0.5) discard;
    float a = 1.0 - smoothstep(0.34, 0.5, dd);

    // lit armour
    vec3 lit = vColor * clamp(vLight, 0.0, 1.55);
    lit += vec3(0.26, 0.29, 0.34) * smoothstep(1.2, 1.65, vLight); // metallic highlight

    // self-lit nano circuitry / reactor / eyes — energy pulses along the flow
    float pulse = 0.55 + 0.75 * vFlow;
    vec3 emis = vColor * (1.7 * pulse) + vec3(0.18);

    vec3 col = mix(lit, emis, vEmissive);
    float spark = step(0.93, vSeed) * vDepth * (1.0 - vEmissive);
    col += vec3(0.28) * spark;
    // travelling cubes glow so they read clearly while floating in from the edges
    col += (vColor * 0.7 + vec3(0.15, 0.3, 0.38)) * vFlight;

    // opacity: solid when placed; kept bright/visible while in flight
    float base = a * vVis * mix(clamp(0.28 + 0.7 * vLight, 0.0, 1.0), 1.0, vEmissive * 0.9 + 0.1);
    float alpha = max(base * vBuildA, a * vFlight * 0.95);
    gl_FragColor = vec4(col, alpha);
  }
`;

// ---- clean cyan mech palette ------------------------------------------------
const CYAN_DEEP = [0.06, 0.42, 0.68];  // shadowed plating
const CYAN_LIGHT = [0.28, 0.82, 0.98]; // lit plating
const CYAN_HOT = [0.62, 0.97, 1.0];    // energy nodes (glow)
const BLOOD = [0.52, 0.02, 0.03];      // dark blood-red cubes mixed in

export function useAboutShape() {
  useLayoutEffect(() => {
    const mount = document.getElementById("about-shape3d");
    if (!mount) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch (e) {
      return;
    }
    const W = () => mount.clientWidth || 500;
    const H = () => mount.clientHeight || 500;
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(W(), H());
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W() / H(), 0.1, 100);
    camera.position.set(0, 0, 5.4);

    // the body sits on the RIGHT of the full-width canvas; particles start
    // spread across the WHOLE section and fly in from every edge.
    const BODY_X = 1.5;
    const group = new THREE.Group();
    group.position.x = BODY_X;
    scene.add(group);

    const uniforms = {
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uCursor: { value: new THREE.Vector2(999, 999) },
      uCursorStrength: { value: 0 },
      uHalfW: { value: 0.9 },                       // body half-width (for arm detection)
      uPunch: { value: new THREE.Vector2(0, 0) },   // left / right arm punch amount (boxing)
    };

    let geo = null;
    let mat = null;
    let disposed = false;

    const N = 120000;
    const FIT = 3.7;
    const BUILD_MS = 20000; // assembly duration — the section stays pinned this long

    const buildGeometry = (pos, nor, col, emis, build) => {
      if (disposed) return;
      const count = pos.length / 3;
      const scatter = new Float32Array(count * 3);
      const seed = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        // start positions spread across the FULL section (world space), then
        // converted to the group's local frame (group is shifted by BODY_X).
        // Biased toward the edges so cubes clearly stream in from all sides.
        const edge = Math.pow(Math.random(), 0.5); // push toward the perimeter
        const wx = (Math.random() * 2 - 1) * 5.5 * (0.35 + 0.65 * edge);
        const wy = (Math.random() * 2 - 1) * 3.4 * (0.35 + 0.65 * edge);
        scatter[i * 3 + 0] = wx - BODY_X; // world → local
        scatter[i * 3 + 1] = wy;
        scatter[i * 3 + 2] = (Math.random() * 2 - 1) * 2.0;
        seed[i] = Math.random();
      }
      geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos.slice(), 3));
      geo.setAttribute("aTarget", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
      geo.setAttribute("aNormal", new THREE.BufferAttribute(nor, 3));
      geo.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
      geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
      geo.setAttribute("aEmissive", new THREE.BufferAttribute(emis, 1));
      geo.setAttribute("aBuild", new THREE.BufferAttribute(build, 1));
      mat = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
      });
      const points = new THREE.Points(geo, mat);
      points.frustumCulled = false;
      group.add(points);
    };

    const sampleModel = (gltf) => {
      const root = gltf.scene;
      root.updateMatrixWorld(true);
      const meshes = [];
      root.traverse((o) => {
        if (o.isMesh && o.geometry && o.geometry.attributes.position) meshes.push(o);
      });
      if (meshes.length === 0) throw new Error("no meshes with positions");

      const raw = [];
      const rawN = [];
      const rawL = []; // per-sample texture luminance (0..1), -1 if no texture
      const tmp = new THREE.Vector3();
      const tmpN = new THREE.Vector3();
      const tmpUV = new THREE.Vector2();
      const nmat = new THREE.Matrix3();

      // read a mesh's colour map into a pixel buffer so we can look it up by UV
      const readTexture = (m) => {
        const tex = m.material && (m.material.map || (Array.isArray(m.material) && m.material[0] && m.material[0].map));
        const img = tex && tex.image;
        if (!img || !img.width) return null;
        try {
          const cv = document.createElement("canvas");
          cv.width = img.width; cv.height = img.height;
          const ctx = cv.getContext("2d", { willReadFrequently: true });
          ctx.drawImage(img, 0, 0);
          return { data: ctx.getImageData(0, 0, img.width, img.height).data, w: img.width, h: img.height, flipY: tex.flipY !== false };
        } catch (e) {
          return null;
        }
      };

      meshes.forEach((m) => {
        const n = Math.round(N / meshes.length);
        nmat.getNormalMatrix(m.matrixWorld);
        const hasUV = !!m.geometry.attributes.uv;
        const texel = hasUV ? readTexture(m) : null;
        const sampler = new MeshSurfaceSampler(m).build();
        for (let i = 0; i < n; i++) {
          sampler.sample(tmp, tmpN, null, texel ? tmpUV : null);
          tmp.applyMatrix4(m.matrixWorld);
          tmpN.applyMatrix3(nmat).normalize();
          raw.push(tmp.x, tmp.y, tmp.z);
          rawN.push(tmpN.x, tmpN.y, tmpN.z);
          if (texel) {
            let u = tmpUV.x - Math.floor(tmpUV.x);
            let v = tmpUV.y - Math.floor(tmpUV.y);
            const px = Math.min(texel.w - 1, Math.max(0, (u * texel.w) | 0));
            const vy = texel.flipY ? 1 - v : v;
            const py = Math.min(texel.h - 1, Math.max(0, (vy * texel.h) | 0));
            const idx = (py * texel.w + px) * 4;
            // perceptual luminance of the real texture at this point
            rawL.push((0.299 * texel.data[idx] + 0.587 * texel.data[idx + 1] + 0.114 * texel.data[idx + 2]) / 255);
          } else {
            rawL.push(-1);
          }
        }
      });

      const box = new THREE.Box3();
      for (let i = 0; i < raw.length; i += 3)
        box.expandByPoint(tmp.set(raw[i], raw[i + 1], raw[i + 2]));
      const c = new THREE.Vector3();
      const size = new THREE.Vector3();
      box.getCenter(c);
      box.getSize(size);
      const sc = FIT / Math.max(size.y, 0.001); // fit by height (humanoid)
      const focusY = size.y * sc * 0.06;         // drop so the head clears the nav

      const sampled = raw.length / 3;
      const pos = new Float32Array(N * 3);
      const nor = new Float32Array(N * 3);
      const col = new Float32Array(N * 3);
      const emis = new Float32Array(N);
      const build = new Float32Array(N);
      let minY = Infinity, maxY = -Infinity, maxAbsX = 0;
      for (let i = 0; i < N; i++) {
        const j = i % sampled;
        pos[i * 3 + 0] = (raw[j * 3] - c.x) * sc;
        pos[i * 3 + 1] = (raw[j * 3 + 1] - c.y) * sc - focusY;
        pos[i * 3 + 2] = (raw[j * 3 + 2] - c.z) * sc;
        nor[i * 3 + 0] = rawN[j * 3];
        nor[i * 3 + 1] = rawN[j * 3 + 1];
        nor[i * 3 + 2] = rawN[j * 3 + 2];
        const y = pos[i * 3 + 1];
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        const axabs = Math.abs(pos[i * 3]);
        if (axabs > maxAbsX) maxAbsX = axabs;
      }
      const bodyH = Math.max(0.001, maxY - minY);
      uniforms.uHalfW.value = maxAbsX || 0.9; // for shader arm detection

      // clean CYAN nanoparticle body — no costume. A soft deep→light cyan
      // gradient up the body gives depth; a few front particles glow as drifting
      // energy nodes for the "nano" shimmer. Lambert lighting does the 3D form.
      for (let i = 0; i < N; i++) {
        const t = (pos[i * 3 + 1] - minY) / bodyH;
        build[i] = t; // feet=0 .. head=1 → assembly order (bottom first)
        const front = nor[i * 3 + 2] > 0.05;
        const r = Math.random();
        if (front && r < 0.05) {
          col[i * 3] = CYAN_HOT[0]; col[i * 3 + 1] = CYAN_HOT[1]; col[i * 3 + 2] = CYAN_HOT[2];
          emis[i] = 0.7;
        } else if (r < 0.23) {
          // dark blood-red cubes mixed throughout the body
          col[i * 3] = BLOOD[0]; col[i * 3 + 1] = BLOOD[1]; col[i * 3 + 2] = BLOOD[2];
          emis[i] = 0;
        } else {
          const m = 0.25 + 0.55 * t;
          col[i * 3] = CYAN_DEEP[0] + (CYAN_LIGHT[0] - CYAN_DEEP[0]) * m;
          col[i * 3 + 1] = CYAN_DEEP[1] + (CYAN_LIGHT[1] - CYAN_DEEP[1]) * m;
          col[i * 3 + 2] = CYAN_DEEP[2] + (CYAN_LIGHT[2] - CYAN_DEEP[2]) * m;
          emis[i] = 0;
        }
      }
      buildGeometry(pos, nor, col, emis, build);
    };

    new GLTFLoader().load(
      "/models/mannequin.glb",
      (gltf) => {
        try {
          sampleModel(gltf);
        } catch (e) {
          console.warn("[about-hero] sampling failed, using sphere fallback", e);
          sphereFallback();
        }
      },
      undefined,
      (err) => {
        console.warn("[about-hero] model load failed, using sphere fallback", err);
        sphereFallback();
      }
    );

    function sphereFallback() {
      const pos = new Float32Array(N * 3);
      const nor = new Float32Array(N * 3);
      const col = new Float32Array(N * 3);
      const emis = new Float32Array(N);
      const build = new Float32Array(N);
      const GA = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < N; i++) {
        const y = 1 - (i / (N - 1)) * 2;
        const r = Math.sqrt(Math.max(0, 1 - y * y));
        const th = i * GA;
        const px = Math.cos(th) * r, pz = Math.sin(th) * r;
        pos[i * 3] = px * 1.5; pos[i * 3 + 1] = y * 1.5; pos[i * 3 + 2] = pz * 1.5;
        nor[i * 3] = px; nor[i * 3 + 1] = y; nor[i * 3 + 2] = pz;
        col[i * 3] = 0.13; col[i * 3 + 1] = 0.83; col[i * 3 + 2] = 0.93;
        build[i] = (y + 1) * 0.5; // bottom → top
      }
      buildGeometry(pos, nor, col, emis, build);
    }

    // The About section is pinned via CSS (position:sticky) and the next section
    // scrolls up OVER it. Here we only kick off the particle build when it enters.
    let enterT = null;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting && enterT === null) enterT = performance.now(); }),
      { threshold: 0.35 }
    );
    io.observe(mount);

    let cursorTarget = 0;
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const hit = new THREE.Vector3();
    const ndc = new THREE.Vector2();
    const onMove = (e) => {
      const r = renderer.domElement.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.ray.intersectPlane(plane, hit)) {
        uniforms.uCursor.value.set(hit.x - BODY_X, hit.y); // into the group's local frame
        cursorTarget = 1;
      }
    };
    const onLeave = () => (cursorTarget = 0);
    window.addEventListener("pointermove", onMove);
    mount.addEventListener("pointerleave", onLeave);

    let raf = 0;
    let assembledT = null; // when the body finished building
    const start = performance.now();
    const tick = () => {
      const now = performance.now();
      const T = (now - start) * 0.001;
      uniforms.uTime.value = T;
      if (enterT !== null) {
        // linear so the build line rises at a steady pace (like laying rows)
        uniforms.uProgress.value = Math.min(1, (now - enterT) / BUILD_MS);
      }
      uniforms.uCursorStrength.value += (cursorTarget - uniforms.uCursorStrength.value) * 0.08;

      // --- once built, the body slowly turns on the spot (turntable) + breathes ---
      let spinY = 0, bob = 0;
      if (uniforms.uProgress.value >= 0.999) {
        if (assembledT === null) assembledT = now;
        const at = (now - assembledT) / 1000;
        spinY = at * 0.4;                 // steady full-turn rotation (round)
        bob = Math.sin(at * 1.6) * 0.03;  // gentle idle breathing
      }
      uniforms.uPunch.value.set(0, 0);    // boxing removed
      group.position.y = bob;
      group.rotation.y = Math.sin(T * 0.16) * 0.14 + spinY;
      group.rotation.x = Math.sin(T * 0.11) * 0.04;
      group.rotation.z = 0;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onResize = () => {
      renderer.setSize(W(), H());
      camera.aspect = W() / H();
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      mount.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      if (geo) geo.dispose();
      if (mat) mat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode)
        renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);
}
