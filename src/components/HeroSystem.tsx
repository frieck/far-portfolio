import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import * as THREE from "three";

type Props = {
  labels: string[];
};

const HUB_COLORS = ["#4d8dff", "#7ee0ff", "#b9c8ff"];
const HUB_POSITIONS: [number, number, number][] = [
  [-1.45, 0.7, 0],
  [1.45, 0.5, -0.35],
  [0.05, -1.15, 0.3],
];
const ASSEMBLE_SECONDS = 2.8;

// Deterministic PRNG so the layout is identical on every visit.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type SystemNode = {
  pos: THREE.Vector3;
  radius: number;
  color: THREE.Color;
  count: number;
};

type SystemEdge = {
  from: number;
  to: number;
  ctrl: THREE.Vector3;
};

function buildSystem(density: number) {
  const rand = mulberry32(7);
  const nodes: SystemNode[] = HUB_POSITIONS.map((p, i) => ({
    pos: new THREE.Vector3(...p),
    radius: 0.32,
    color: new THREE.Color(HUB_COLORS[i]),
    count: Math.round(650 * density),
  }));
  const links: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 0],
  ];

  // Satellite services fan out from each hub, away from the center.
  HUB_POSITIONS.forEach(([x, y], hub) => {
    const outward = Math.atan2(y, x);
    for (let s = 0; s < 3; s++) {
      const angle = outward + (s - 1) * 0.8;
      const distance = 0.75 + rand() * 0.3;
      nodes.push({
        pos: new THREE.Vector3(
          x + Math.cos(angle) * distance,
          y + Math.sin(angle) * distance,
          (rand() - 0.5) * 0.8,
        ),
        radius: 0.1 + rand() * 0.04,
        color: nodes[hub].color.clone().lerp(new THREE.Color("#ffffff"), 0.15),
        count: Math.round(140 * density),
      });
      links.push([hub, nodes.length - 1]);
    }
  });

  // A few cross-links so the system reads as one architecture, not three islands.
  for (let hub = 0; hub < 3; hub++) {
    links.push([3 + hub * 3 + 2, (hub + 1) % 3]);
  }

  const edges: SystemEdge[] = links.map(([from, to]) => {
    const a = nodes[from].pos;
    const b = nodes[to].pos;
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const dir = b.clone().sub(a);
    const perp = new THREE.Vector3(-dir.y, dir.x, 0).normalize();
    const ctrl = mid
      .addScaledVector(perp, dir.length() * (0.12 + rand() * 0.12))
      .add(new THREE.Vector3(0, 0, (rand() - 0.5) * 0.6));
    return { from, to, ctrl };
  });

  const flowPerEdge = Math.round(140 * density);
  const total =
    nodes.reduce((sum, n) => sum + n.count, 0) + edges.length * flowPerEdge;

  const start = new Float32Array(total * 3);
  const from = new Float32Array(total * 3);
  const to = new Float32Array(total * 3);
  const ctrl = new Float32Array(total * 3);
  const color = new Float32Array(total * 3);
  const offset = new Float32Array(total);
  const speed = new Float32Array(total);
  const size = new Float32Array(total);
  const delay = new Float32Array(total);

  let i = 0;
  const randomStart = () => {
    const dir = new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5);
    return dir.normalize().multiplyScalar(4 + rand() * 4);
  };
  const write = (arr: Float32Array, v: THREE.Vector3 | THREE.Color) => {
    if (v instanceof THREE.Color) arr.set([v.r, v.g, v.b], i * 3);
    else arr.set([v.x, v.y, v.z], i * 3);
  };

  // Node bodies: points on a slightly thick Fibonacci sphere.
  const golden = Math.PI * (3 - Math.sqrt(5));
  nodes.forEach((node) => {
    for (let k = 0; k < node.count; k++) {
      const y = 1 - ((k + 0.5) / node.count) * 2;
      const r = Math.sqrt(1 - y * y);
      const phi = k * golden;
      const target = new THREE.Vector3(Math.cos(phi) * r, y, Math.sin(phi) * r)
        .multiplyScalar(node.radius * (0.7 + rand() * 0.3))
        .add(node.pos);
      write(start, randomStart());
      write(from, target);
      write(to, target);
      write(ctrl, target);
      write(color, node.color);
      offset[i] = rand();
      speed[i] = 0;
      size[i] = 0.4 + rand() * 0.7;
      delay[i] = rand() * 0.35;
      i++;
    }
  });

  // Flow particles travel along each edge's curve, in both directions.
  edges.forEach((edge) => {
    const a = nodes[edge.from];
    const b = nodes[edge.to];
    const length = a.pos.distanceTo(b.pos);
    for (let k = 0; k < flowPerEdge; k++) {
      const reverse = rand() < 0.35;
      const jitter = new THREE.Vector3(
        rand() - 0.5,
        rand() - 0.5,
        rand() - 0.5,
      ).multiplyScalar(0.12);
      write(start, randomStart());
      write(from, reverse ? b.pos : a.pos);
      write(to, reverse ? a.pos : b.pos);
      write(ctrl, edge.ctrl.clone().add(jitter));
      write(color, a.color.clone().lerp(b.color, rand()));
      offset[i] = rand();
      speed[i] = (0.08 + rand() * 0.06) / Math.max(length, 0.6);
      size[i] = 0.5 + rand() * 0.6;
      delay[i] = 0.3 + rand() * 0.3;
      i++;
    }
  });

  return { nodes, edges, start, from, to, ctrl, color, offset, speed, size, delay };
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform vec3 uPointer;
  uniform float uPointerStrength;

  attribute vec3 aStart;
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute vec3 aCtrl;
  attribute vec3 aColor;
  attribute float aOffset;
  attribute float aSpeed;
  attribute float aSize;
  attribute float aDelay;

  varying vec3 vColor;
  varying float vAlpha;

  vec3 bezier(vec3 a, vec3 c, vec3 b, float t) {
    float it = 1.0 - t;
    return it * it * a + 2.0 * it * t * c + t * t * b;
  }

  void main() {
    float t = fract(aOffset + uTime * aSpeed);
    vec3 target = bezier(aFrom, aCtrl, aTo, t);
    float isFlow = step(0.0001, aSpeed);

    // Node bodies breathe slightly; flows are already moving.
    target += (1.0 - isFlow) * 0.015 * vec3(
      sin(uTime * 1.3 + aOffset * 40.0),
      cos(uTime * 1.1 + aOffset * 31.0),
      0.0
    );

    float p = clamp((uProgress - aDelay) / 0.5, 0.0, 1.0);
    p = 1.0 - pow(1.0 - p, 3.0);
    vec3 pos = mix(aStart, target, p);
    pos += sin(vec3(aOffset * 12.0, aOffset * 17.0, aOffset * 23.0) + uTime) * p * (1.0 - p) * 0.8;

    vec4 world = modelMatrix * vec4(pos, 1.0);
    vec2 away = world.xy - uPointer.xy;
    float near = smoothstep(0.9, 0.0, length(away)) * uPointerStrength;
    world.xy += normalize(away + 1e-5) * near * 0.35;

    vec4 mv = viewMatrix * world;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aSize * uPixelRatio * (1.0 + near * 0.8) / -mv.z;

    vColor = aColor;
    vAlpha = mix(0.45, sin(t * 3.14159), isFlow) * (0.25 + 0.75 * p);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, a * a * vAlpha);
  }
`;

function System({
  labels,
  reducedMotion,
  density,
  hovered,
}: {
  labels: string[];
  reducedMotion: boolean;
  density: number;
  hovered: RefObject<boolean>;
}) {
  const group = useRef<THREE.Group>(null);
  const lines = useRef<THREE.LineBasicMaterial>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const startedAt = useRef<number | null>(null);
  const [assembled, setAssembled] = useState(false);
  const system = useMemo(() => buildSystem(density), [density]);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(system.from, 3));
    g.setAttribute("aStart", new THREE.BufferAttribute(system.start, 3));
    g.setAttribute("aFrom", new THREE.BufferAttribute(system.from, 3));
    g.setAttribute("aTo", new THREE.BufferAttribute(system.to, 3));
    g.setAttribute("aCtrl", new THREE.BufferAttribute(system.ctrl, 3));
    g.setAttribute("aColor", new THREE.BufferAttribute(system.color, 3));
    g.setAttribute("aOffset", new THREE.BufferAttribute(system.offset, 1));
    g.setAttribute("aSpeed", new THREE.BufferAttribute(system.speed, 1));
    g.setAttribute("aSize", new THREE.BufferAttribute(system.size, 1));
    g.setAttribute("aDelay", new THREE.BufferAttribute(system.delay, 1));
    return g;
  }, [system]);

  const edgeGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    system.edges.forEach((edge) => {
      const curve = new THREE.QuadraticBezierCurve3(
        system.nodes[edge.from].pos,
        edge.ctrl,
        system.nodes[edge.to].pos,
      );
      const samples = curve.getPoints(24);
      for (let k = 0; k < samples.length - 1; k++) {
        points.push(samples[k], samples[k + 1]);
      }
    });
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [system]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uPixelRatio: { value: 1 },
      uSize: { value: 38 },
      uPointer: { value: new THREE.Vector3(99, 99, 0) },
      uPointerStrength: { value: 0 },
    }),
    [],
  );

  const ray = useMemo(() => new THREE.Vector3(), []);
  const pointerTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    if (!material.current) return;
    const u = material.current.uniforms;
    const elapsed = state.clock.elapsedTime;
    if (startedAt.current === null) startedAt.current = elapsed;

    const progress = reducedMotion
      ? 1
      : Math.min((elapsed - startedAt.current) / ASSEMBLE_SECONDS, 1);

    u.uProgress.value = progress;
    u.uTime.value = reducedMotion ? 0 : elapsed;
    u.uPixelRatio.value = state.gl.getPixelRatio();
    if (progress > 0.85 && !assembled) setAssembled(true);

    // Project the pointer onto the z=0 plane to push particles away from it.
    const { camera, pointer } = state;
    ray.set(pointer.x, pointer.y, 0.5).unproject(camera).sub(camera.position).normalize();
    pointerTarget.copy(camera.position).addScaledVector(ray, -camera.position.z / ray.z);
    u.uPointer.value.lerp(pointerTarget, 0.15);
    const strength = hovered.current && !reducedMotion ? 1 : 0;
    u.uPointerStrength.value += (strength - u.uPointerStrength.value) * 0.08;

    if (lines.current) lines.current.opacity = Math.max(progress - 0.6, 0) * 0.35;

    if (group.current && !reducedMotion) {
      const g = group.current;
      g.rotation.y += (Math.sin(elapsed * 0.15) * 0.25 + pointer.x * 0.2 - g.rotation.y) * 0.05;
      g.rotation.x += (-pointer.y * 0.12 - g.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={group} scale={1.18}>
      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial
          ref={lines}
          color="#4d8dff"
          transparent
          opacity={0}
          depthWrite={false}
        />
      </lineSegments>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={material}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      {labels.slice(0, 3).map((label, i) => (
        <Html
          key={label}
          position={[HUB_POSITIONS[i][0], HUB_POSITIONS[i][1] + 0.62, HUB_POSITIONS[i][2]]}
          center
          zIndexRange={[2, 0]}
          wrapperClass="hero-node-anchor"
        >
          <span className={`hero-node-label${assembled ? " is-visible" : ""}`}>
            {label}
          </span>
        </Html>
      ))}
    </group>
  );
}

export default function HeroSystem({ labels }: Props) {
  const wrapper = useRef<HTMLDivElement>(null);
  const hovered = useRef(false);
  const [visible, setVisible] = useState(true);
  const [reducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [density] = useState(() => (window.innerWidth < 700 ? 0.5 : 1));

  // Stop rendering while the hero is scrolled out of view.
  useEffect(() => {
    if (!wrapper.current) return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    observer.observe(wrapper.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapper}
      className="hero-system"
      aria-hidden="true"
      onPointerEnter={() => (hovered.current = true)}
      onPointerLeave={() => (hovered.current = false)}
    >
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 6.8], fov: 45 }}
        gl={{ antialias: false, alpha: true }}
        frameloop={visible ? "always" : "never"}
        eventSource={wrapper as RefObject<HTMLElement>}
      >
        <System
          labels={labels}
          reducedMotion={reducedMotion}
          density={density}
          hovered={hovered}
        />
      </Canvas>
    </div>
  );
}
