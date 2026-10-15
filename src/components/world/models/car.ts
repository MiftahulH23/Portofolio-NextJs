import { BoxGeometry, CylinderGeometry, Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, PlaneGeometry, AdditiveBlending } from "three";
import { NEON } from "@/world/palette";
import { glowSprite } from "./bike";

const box = new BoxGeometry(1, 1, 1);
const wheelGeo = new CylinderGeometry(0.36, 0.36, 0.3, 12);
const glass = new MeshStandardMaterial({ color: 0x111a30, metalness: 0.9, roughness: 0.15 });
const tyre = new MeshStandardMaterial({ color: 0x0b0b10 });
const head = new MeshBasicMaterial({ color: 0xfff6dc });
const tail = new MeshBasicMaterial({ color: 0xff1e46 });
const beamMat = new MeshBasicMaterial({ color: 0xfff1c8, transparent: true, opacity: 0.07, depthWrite: false, blending: AdditiveBlending });

function part(g: Group, mat: MeshBasicMaterial | MeshStandardMaterial, s: [number, number, number], p: [number, number, number]) {
  const m = new Mesh(box, mat);
  m.scale.set(...s);
  m.position.set(...p);
  g.add(m);
}

export function createCarModel(color: number, taxi: boolean): Group {
  const g = new Group();
  part(g, new MeshStandardMaterial({ color, metalness: 0.55, roughness: 0.35 }), [2, 0.7, 4.3], [0, 0.7, 0]);
  part(g, glass, [1.75, 0.62, 2.2], [0, 1.36, -0.25]);
  for (const [x, z] of [[-1, 1.4], [1, 1.4], [-1, -1.4], [1, -1.4]]) {
    const w = new Mesh(wheelGeo, tyre);
    w.rotation.z = Math.PI / 2;
    w.position.set(x, 0.36, z);
    g.add(w);
  }
  for (const x of [-0.65, 0.65]) {
    part(g, head, [0.4, 0.16, 0.05], [x, 0.78, 2.16]);
    const hg = glowSprite(0xfff1c8, 2.2);
    hg.position.set(x, 0.78, 2.4);
    g.add(hg);
    part(g, tail, [0.42, 0.14, 0.05], [x, 0.8, -2.16]);
    const tg = glowSprite(0xff1e46, 1.4);
    tg.position.set(x, 0.8, -2.3);
    g.add(tg);
  }
  if (taxi) part(g, new MeshBasicMaterial({ color: NEON.lime }), [0.7, 0.25, 0.35], [0, 1.8, -0.3]);
  const beam = new Mesh(new PlaneGeometry(2.6, 9), beamMat);
  beam.rotation.x = -Math.PI / 2;
  beam.position.set(0, 0.05, 6.6);
  g.add(beam);
  return g;
}
