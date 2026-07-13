import { useLayoutEffect } from "react";
import * as THREE from "three";

/*
 * REAL 3D hero visual — a live glossy pink "flower" surface (à la the gallery-09
 * reference). A finely-subdivided plane is displaced by domain-warped, low-freq
 * ridged noise into big smooth silk petals, shaded with an iridescent magenta→pink
 * gradient, fresnel glow, twin speculars and depth fog. Floating petals drift up
 * for atmosphere. The waves always breeze; on scroll the flower grows up from a
 * fixed bottom (bottom-anchored scaleY) like a plant.
 */

const SNOISE = `
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`;

const vert = `
  uniform float uTime;
  varying float vH;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec2 vUv;
  varying float vDepth;
  varying float vTint;
  ${SNOISE}
  float ridged(vec3 x){ float n = snoise(x); return 1.0 - abs(n); }
  // big, smooth silk folds — low frequency, few octaves (elegant, not spiky)
  float surf(vec2 p, float t){
    float breeze = sin(t * 0.7) * 0.4 + cos(t * 0.33) * 0.25;
    vec2 q = p * 0.62;
    q += 0.55 * vec2(
      snoise(vec3(p * 0.4 + vec2(breeze, 0.0), t * 0.4)),
      snoise(vec3(p * 0.4 + 7.3, t * 0.4))
    );
    q += vec2(sin(t * 0.4) * 0.5, t * 0.12);
    float f = 0.0;
    f += 0.72 * ridged(vec3(q, t * 0.6));            // large primary petals
    f += 0.26 * ridged(vec3(q * 2.1 + 1.0, t * 0.5)); // medium folds
    f += 0.10 * snoise(vec3(q * 3.6, t * 0.4));       // fine, SMOOTH detail
    return f - 0.5;
  }
  void main(){
    float t = uTime * 0.00030;
    vUv = uv;
    vec3 pos = position;
    float h = surf(position.xy, t);
    pos.z += h;
    // gentle wind sway — taller petals lean a little more
    float lean = clamp(h + 0.35, 0.0, 1.6);
    pos.x += (sin(t * 0.9 + position.y * 0.6) * 0.12) * lean;
    float e = 0.09;
    float hx = surf(position.xy + vec2(e, 0.0), t);
    float hy = surf(position.xy + vec2(0.0, e), t);
    vec3 n = normalize(vec3(-(hx - h) / e, -(hy - h) / e, 1.0));
    vH = h;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vNormal = normalize(normalMatrix * n);
    vView = normalize(-mv.xyz);
    vDepth = -mv.z;
    vTint = snoise(vec3(position.xy * 0.22, t * 0.06));
    gl_Position = projectionMatrix * mv;
  }
`;

const frag = `
  precision highp float;
  varying float vH;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec2 vUv;
  varying float vDepth;
  varying float vTint;
  uniform float uTime;
  uniform vec3 cLow;
  uniform vec3 cMid;
  uniform vec3 cHigh;
  uniform vec3 cRim;
  uniform vec3 cFog;
  void main(){
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vView);
    float hN = clamp(vH * 0.6 + 0.5, 0.0, 1.0);

    // rich colour ramp: deep purple valleys -> hot magenta -> near-white ridges
    vec3 base = mix(cLow, cMid, smoothstep(0.10, 0.55, hN));
    base = mix(base, cHigh, smoothstep(0.58, 0.96, hN));

    // valley ambient occlusion for depth
    base *= mix(0.5, 1.0, smoothstep(0.05, 0.6, hN));

    // large-scale colour variation — violet/blue patches enrich the pink
    base = mix(base, base * vec3(0.82, 0.9, 1.18), clamp(vTint * 0.5 + 0.5, 0.0, 1.0) * 0.4);

    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.2);

    // iridescent sheen — fresnel shifts the rim toward cyan/violet
    vec3 iri = mix(cRim, vec3(0.45, 0.85, 1.0), 0.5 + 0.5 * sin(hN * 6.0 + fres * 4.0));

    // twin speculars = glossy wet highlight
    vec3 L1 = normalize(vec3(0.2, 0.75, 0.85));
    vec3 L2 = normalize(vec3(-0.5, 0.4, 0.7));
    float s1 = pow(max(dot(reflect(-L1, N), V), 0.0), 46.0);
    float s2 = pow(max(dot(reflect(-L2, N), V), 0.0), 16.0);
    float diff = max(dot(N, L1), 0.0) * 0.35 + 0.65;

    // environment reflection — a soft pink "sky" reflected in the glossy surface
    vec3 R = reflect(-V, N);
    float sky = R.y * 0.5 + 0.5;
    vec3 env = mix(vec3(0.5, 0.08, 0.35), vec3(1.0, 0.92, 1.0), smoothstep(0.25, 0.8, sky));
    env = mix(env, vec3(1.0, 0.6, 0.86), smoothstep(0.8, 1.0, sky));

    // glow: bright highlights + reflective sheen + fresnel rim bloom-feel
    vec3 col = base * diff + iri * fres * 0.55 + env * fres * 0.5 + s1 * 1.35 + s2 * 0.3;
    col += fres * fres * 0.22;              // extra rim glow
    col = pow(col, vec3(0.9));              // lift midtones

    // underwater caustics — cyan light cells dancing over the surface
    float ct = uTime * 0.0008;
    float c1 = sin(vUv.x * 26.0 + ct) + sin(vUv.y * 22.0 - ct * 0.8);
    float c2 = sin((vUv.x + vUv.y) * 18.0 + ct * 1.2) + sin((vUv.x - vUv.y) * 24.0 - ct);
    float caust = pow(max(0.0, c1 * c2) * 0.22, 2.0);
    col += caust * vec3(0.45, 0.9, 1.0) * 0.6;
    // cool underwater blue grade
    col = mix(col, col * vec3(0.72, 0.96, 1.2), 0.30);

    // depth haze — far folds fade into deep water
    float fog = smoothstep(2.5, 8.0, vDepth);
    col = mix(col, cFog, fog * 0.9);

    // fade the plane edges so no rectangular border shows
    float edge =
      smoothstep(0.0, 0.10, vUv.x) * smoothstep(1.0, 0.90, vUv.x) *
      smoothstep(0.0, 0.06, vUv.y) * smoothstep(1.0, 0.48, vUv.y);
    gl_FragColor = vec4(col, edge * (1.0 - fog * 0.5));
  }
`;

export function useHeroWaves() {
  useLayoutEffect(() => {
    const mount = document.getElementById("hero-waves");
    if (!mount) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch (e) {
      return;
    }
    const W = () => mount.clientWidth || 800;
    const H = () => mount.clientHeight || 400;
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(W(), H());
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, W() / H(), 0.1, 100);
    camera.position.set(0, 1.7, 4.7);
    camera.lookAt(0, -0.5, 0);

    const uniforms = {
      uTime: { value: 0 },
      cLow: { value: new THREE.Color(0x3a0a52) },
      cMid: { value: new THREE.Color(0xd21f8f) },
      cHigh: { value: new THREE.Color(0xff9ad8) },
      cRim: { value: new THREE.Color(0xffd0ec) },
      cFog: { value: new THREE.Color(0x04182b) },
    };
    const mat = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms,
      side: THREE.DoubleSide,
      transparent: true,
    });
    const geo = new THREE.PlaneGeometry(18, 11, 320, 200);
    const sheet = new THREE.Mesh(geo, mat);
    sheet.rotation.x = -1.12; // lay it down, tilted toward the camera
    sheet.position.y = -1.15;
    scene.add(sheet);

    // scroll -> how much the flower has "grown" (0 = default half height, 1 = full)
    let targetGrow = 0;
    const onScroll = () => {
      targetGrow = Math.min(1, (window.scrollY || 0) / (window.innerHeight * 0.9));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // own RAF loop — waves always breeze; on scroll the flower grows taller
    // (bottom stays fixed, the top extends up like a plant) via a bottom-anchored scaleY
    let raf = 0;
    let grow = 0;
    const start = performance.now();
    const visual = mount.parentElement; // .hero-visual (transform-origin: bottom)
    const tick = () => {
      uniforms.uTime.value = performance.now() - start;
      grow += (targetGrow - grow) * 0.08;
      visual.style.transform = `scaleY(${1 + grow * 0.82})`;
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
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode)
        renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);
}
