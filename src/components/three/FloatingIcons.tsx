"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { CatmullRomCurve3, Group, MeshStandardMaterial, Plane, Raycaster, TubeGeometry, Vector3 } from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { HOMES, ICONS } from "./icon-paths";

const LIME = "#A3E635";
const INK = "#F4F4F5";

const setCursor = (c: string) => {
  document.body.style.cursor = c;
};
const clock = () => performance.now();

function setGlow(m: MeshStandardMaterial, on: boolean) {
  m.emissiveIntensity = on ? 0.9 : 0.35;
}

function iconGeometries(paths: string[]): TubeGeometry[] {
  const loader = new SVGLoader();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg">${paths.map((d) => `<path d="${d}"/>`).join("")}</svg>`;
  const out: TubeGeometry[] = [];
  for (const shapePath of loader.parse(svg).paths) {
    for (const sub of shapePath.subPaths) {
      const pts = sub.getPoints(32).map((p) => new Vector3((p.x - 12) / 12, (12 - p.y) / 12, 0));
      if (pts.length < 2) continue;
      const curve = new CatmullRomCurve3(pts, false, "catmullrom", 0.05);
      out.push(new TubeGeometry(curve, Math.max(24, pts.length * 3), 0.085, 10, false));
    }
  }
  return out;
}

interface Body {
  home: Vector3;
  pos: Vector3;
  vel: Vector3;
  spin: number;
  scale: number;
  hover: boolean;
  drag: boolean;
  phase: number;
}

function Icons({ active, reduce }: { active: boolean; reduce: boolean }) {
  const { camera, pointer, size } = useThree();
  const groups = useRef<(Group | null)[]>([]);
  const geos = useMemo(() => ICONS.map((i) => iconGeometries(i.paths)), []);
  const mats = useMemo(
    () => ICONS.map((_, i) => new MeshStandardMaterial({ color: i % 2 ? INK : LIME, emissive: i % 2 ? "#3f3f46" : LIME, emissiveIntensity: 0.35, roughness: 0.3, metalness: 0.2 })),
    [],
  );
  const bodies = useRef<Body[]>(
    HOMES.map(([x, y, z], i) => ({ home: new Vector3(x, y, z), pos: new Vector3(x, y, z), vel: new Vector3(), spin: 0, scale: 1, hover: false, drag: false, phase: i * 1.7 })),
  );
  const plane = useMemo(() => new Plane(new Vector3(0, 0, 1), 0), []);
  const ray = useMemo(() => new Raycaster(), []);
  const hit = useMemo(() => new Vector3(), []);
  const last = useRef({ t: 0, p: new Vector3() });
  const ndc = useMemo(() => new Vector3(), []);

  useFrame((state, rawDt) => {
    if (!active) return;
    const dt = Math.min(rawDt, 1 / 30);
    const t = state.clock.elapsedTime;
    bodies.current.forEach((b, i) => {
      const g = groups.current[i];
      if (!g) return;
      if (b.drag) {
        ray.setFromCamera(pointer, camera);
        if (ray.ray.intersectPlane(plane, hit)) {
          const now = performance.now();
          const span = Math.max(1, now - last.current.t) / 1000;
          b.vel.copy(hit).sub(last.current.p).divideScalar(span).clampLength(0, 18);
          last.current = { t: now, p: hit.clone() };
          b.pos.copy(hit);
        }
      } else {
        const target = b.home.clone();
        if (!reduce) {
          target.y += Math.sin(t * 0.9 + b.phase) * 0.18;
          target.x += pointer.x * 0.35 * (1 + b.home.z * 0.3);
          target.y += pointer.y * 0.25 * (1 + b.home.z * 0.3);
          ndc.copy(b.pos).project(camera);
          const dx = ndc.x - pointer.x, dy = ndc.y - pointer.y;
          const d = Math.hypot(dx * (size.width / size.height), dy);
          if (d < 0.28) target.add(new Vector3(dx, dy, 0).normalize().multiplyScalar((0.28 - d) * 4));
        }
        const acc = target.sub(b.pos).multiplyScalar(40).addScaledVector(b.vel, -8);
        b.vel.addScaledVector(acc, dt);
        b.pos.addScaledVector(b.vel, dt);
      }
      b.spin *= Math.exp(-dt * 2.5);
      const wantScale = b.hover || b.drag ? 1.25 : 1;
      b.scale += (wantScale - b.scale) * Math.min(1, dt * 10);
      g.position.copy(b.pos);
      g.scale.setScalar(b.scale);
      g.rotation.y += (reduce ? 0 : 0.25) * dt + b.spin * dt;
      g.rotation.x = reduce ? 0 : Math.sin(t * 0.6 + b.phase) * 0.25;
      setGlow(mats[i], b.hover || b.drag);
    });
  });

  function down(i: number, e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    (e.target as Element | null)?.setPointerCapture?.(e.pointerId);
    const b = bodies.current[i];
    b.drag = true;
    last.current = { t: clock(), p: b.pos.clone() };
    setCursor("grabbing");
  }
  function up(i: number) {
    const b = bodies.current[i];
    if (!b.drag) return;
    b.drag = false;
    if (b.vel.length() < 0.5) b.spin += 14;
    setCursor(b.hover ? "pointer" : "");
  }

  return (
    <>
      {ICONS.map((icon, i) => (
        <group
          key={icon.name}
          ref={(g) => {
            groups.current[i] = g;
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            bodies.current[i].hover = true;
            setCursor("pointer");
          }}
          onPointerOut={() => {
            bodies.current[i].hover = false;
            if (!bodies.current[i].drag) setCursor("");
          }}
          onPointerDown={(e) => down(i, e)}
          onPointerUp={() => up(i)}
          onPointerMissed={() => up(i)}
        >
          {geos[i].map((geo, k) => (
            <mesh key={k} geometry={geo} material={mats[i]} />
          ))}
          <mesh visible={false}>
            <sphereGeometry args={[1.05, 8, 8]} />
          </mesh>
        </group>
      ))}
    </>
  );
}

export default function FloatingIcons({ active = true, onContextLost }: { active?: boolean; onContextLost?: () => void }) {
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 9], fov: 40 }}
      frameloop={active ? "always" : "demand"}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onContextLost?.();
        });
      }}
      onPointerUp={() => setCursor("")}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 8]} intensity={2.2} />
      <pointLight position={[-4, -2, 4]} intensity={30} color={LIME} />
      <group scale={0.8}>
        <Icons active={active} reduce={reduce} />
      </group>
    </Canvas>
  );
}
