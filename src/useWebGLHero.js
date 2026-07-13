import { useLayoutEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";

/*
 * REAL WebGL hero backdrop — a GPU fragment shader (three.js) that paints a
 * living, flowing aurora of translucent brand-colour light. This is the modern,
 * award-site technique (Stripe / Linear / Awwwards): a full-screen shader quad
 * driven by domain-warped fbm noise, animated by time and pushed around by the
 * cursor. Rendered with alpha so it tints whatever hero background sits behind
 * it (works in both light and dark themes). Synced to gsap.ticker.
 */
const vert = `
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }
`;

const frag = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uMouse;   // -0.5 .. 0.5
  uniform float uAspect;
  uniform vec3  uC1;
  uniform vec3  uC2;
  uniform vec3  uC3;

  // --- iq value noise + fbm ---
  vec2 hash(vec2 p){
    p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
    return -1.0 + 2.0*fract(sin(p)*43758.5453123);
  }
  float noise(vec2 p){
    vec2 i=floor(p), f=fract(p);
    vec2 u=f*f*(3.0-2.0*f);
    return mix(mix(dot(hash(i+vec2(0,0)),f-vec2(0,0)),
                   dot(hash(i+vec2(1,0)),f-vec2(1,0)),u.x),
               mix(dot(hash(i+vec2(0,1)),f-vec2(0,1)),
                   dot(hash(i+vec2(1,1)),f-vec2(1,1)),u.x),u.y);
  }
  float fbm(vec2 p){
    float v=0.0, a=0.55;
    for(int i=0;i<6;i++){ v+=a*noise(p); p*=1.9; a*=0.55; }
    return v;
  }

  void main(){
    vec2 uv = vUv;
    vec2 p = (uv - 0.5);
    p.x *= uAspect;
    p += uMouse * 0.35;              // cursor pushes the field

    float t = uTime * 0.06;
    // domain warp for that liquid, flowing motion
    vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, -t)));
    vec2 r = vec2(fbm(p + 1.7*q + vec2(t*1.3, 9.2)),
                  fbm(p + 1.7*q + vec2(-t, 3.4)));
    float f = fbm(p + 2.2*r);

    // build colour from the flow field
    vec3 col = mix(uC1, uC2, clamp(f*1.6 + 0.4, 0.0, 1.0));
    col = mix(col, uC3, clamp(length(q)*0.7, 0.0, 1.0));

    // translucent blobs — alpha follows the field so the hero bg shows through
    float alpha = smoothstep(0.15, 0.85, f*0.8 + length(r)*0.5);
    alpha *= smoothstep(1.15, 0.25, length(uv-0.5)); // soft round vignette
    gl_FragColor = vec4(col, alpha * 0.55);
  }
`;

export function useWebGLHero() {
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const mount = document.getElementById("hero-webgl");
    if (!mount) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch (e) {
      return; // no WebGL → gracefully skip, hero still works
    }
    const W = () => mount.clientWidth || window.innerWidth;
    const H = () => mount.clientHeight || window.innerHeight;
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(W(), H());
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uAspect: { value: W() / H() },
      uC1: { value: new THREE.Color(0x1bb6c1) },
      uC2: { value: new THREE.Color(0x19c39c) },
      uC3: { value: new THREE.Color(0x2f7bff) },
    };
    const mat = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms,
      transparent: true,
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
    scene.add(quad);

    // cursor → smoothed target for the shader
    const target = new THREE.Vector2(0, 0);
    const onMove = (e) => {
      const r = mount.getBoundingClientRect();
      target.set(
        (e.clientX - r.left) / r.width - 0.5,
        -((e.clientY - r.top) / r.height - 0.5)
      );
    };
    window.addEventListener("pointermove", onMove);

    const tick = (time) => {
      uniforms.uTime.value = time;
      uniforms.uMouse.value.x += (target.x - uniforms.uMouse.value.x) * 0.05;
      uniforms.uMouse.value.y += (target.y - uniforms.uMouse.value.y) * 0.05;
      renderer.render(scene, camera);
    };
    gsap.ticker.add(tick);

    const onResize = () => {
      renderer.setSize(W(), H());
      uniforms.uAspect.value = W() / H();
    };
    window.addEventListener("resize", onResize);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      quad.geometry.dispose();
      mat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode)
        renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);
}
