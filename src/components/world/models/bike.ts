import { BoxGeometry, CylinderGeometry, Group, type Material, Mesh, MeshBasicMaterial, MeshStandardMaterial, SphereGeometry, SpotLight, Sprite, SpriteMaterial, TorusGeometry, AdditiveBlending, Vector3 } from "three";
import type { BikeInput, BikeState } from "@/world/bike";
import { NEON } from "@/world/palette";
import { LIGHT } from "../lighting";
import { glowTexture } from "../painters/signs";

const UP = new Vector3(0, 1, 0);
const unitCyl = new CylinderGeometry(1, 1, 1, 8);
const unitBox = new BoxGeometry(1, 1, 1);
const tmp = new Vector3();
const V = (x: number, y: number, z: number) => new Vector3(x, y, z);

function place(mesh: Mesh, a: Vector3, b: Vector3, r: number) {
  tmp.subVectors(b, a);
  const len = tmp.length();
  mesh.position.copy(a).addScaledVector(tmp, 0.5);
  mesh.quaternion.setFromUnitVectors(UP, tmp.normalize());
  mesh.scale.set(r, len, r);
}

function rod(parent: Group, a: Vector3, b: Vector3, r: number, mat: Material) {
  const m = new Mesh(unitCyl, mat);
  place(m, a, b, r);
  parent.add(m);
  return m;
}

export function glowSprite(color: number, size: number, opacity = 1) {
  const s = new Sprite(new SpriteMaterial({ map: glowTexture(), color, opacity, transparent: true, depthWrite: false, blending: AdditiveBlending }));
  s.scale.set(size, size, 1);
  return s;
}

export function createBikeModel() {
  const frameM = new MeshStandardMaterial({ color: NEON.lime, emissive: 0x2c4a00, metalness: 0.5, roughness: 0.35 });
  const tyreM = new MeshStandardMaterial({ color: 0x0d0d14, roughness: 0.7 });
  const rimM = new MeshBasicMaterial({ color: NEON.cyan });
  const skinM = new MeshStandardMaterial({ color: 0xc98f6b, roughness: 0.7 });
  const shirtM = new MeshStandardMaterial({ color: 0x2b2550, roughness: 0.8 });
  const pantM = new MeshStandardMaterial({ color: 0x15131f, roughness: 0.8 });

  const group = new Group();
  const fork = new Group();
  fork.position.set(0, 0, 0.5);
  group.add(fork);

  const wheel = (parent: Group, z: number) => {
    const g = new Group();
    g.position.set(0, 0.46, z);
    const tyre = new Mesh(new TorusGeometry(0.42, 0.07, 8, 28), tyreM);
    tyre.rotation.y = Math.PI / 2;
    g.add(tyre);
    const rim = new Mesh(new TorusGeometry(0.34, 0.025, 6, 28), rimM);
    rim.rotation.y = Math.PI / 2;
    g.add(rim);
    for (let i = 0; i < 4; i++) {
      const sp = new Mesh(unitBox, rimM);
      sp.scale.set(0.015, 0.66, 0.015);
      sp.rotation.x = (i * Math.PI) / 4;
      g.add(sp);
    }
    parent.add(g);
    return g;
  };
  const rear = wheel(group, -0.62);
  const front = wheel(fork, 0.12);

  const crank = V(0, 0.48, 0), seat = V(0, 1.12, -0.3), head = V(0, 1.1, 0.45);
  rod(group, V(0, 0.46, -0.62), crank, 0.035, frameM);
  rod(group, crank, seat, 0.04, frameM);
  rod(group, seat, head, 0.035, frameM);
  rod(group, crank, head.clone().add(V(0, -0.12, 0)), 0.04, frameM);
  rod(group, V(0, 0.46, -0.62), seat, 0.03, frameM);
  rod(fork, V(0, 0.46, 0.12), V(0, 1.1, -0.05), 0.035, frameM);
  rod(fork, V(0, 1.1, -0.05), V(0, 1.3, 0), 0.03, frameM);
  rod(fork, V(-0.32, 1.3, 0), V(0.32, 1.3, 0), 0.025, frameM);
  const saddle = new Mesh(unitBox, pantM);
  saddle.scale.set(0.2, 0.06, 0.34);
  saddle.position.copy(seat).add(V(0, 0.04, 0));
  group.add(saddle);

  const lamp = new Mesh(new SphereGeometry(0.08, 8, 6), new MeshBasicMaterial({ color: 0xfff6d8 }));
  lamp.position.set(0, 1.18, 0.12);
  fork.add(lamp);
  const lampGlow = glowSprite(0xfff2c0, 1.4);
  lampGlow.position.copy(lamp.position);
  fork.add(lampGlow);
  const tail = new Mesh(new SphereGeometry(0.06, 8, 6), new MeshBasicMaterial({ color: 0xff2255 }));
  tail.position.set(0, 1.0, -0.55);
  group.add(tail);
  const tailGlow = glowSprite(0xff2255, 0.9);
  tailGlow.position.copy(tail.position);
  group.add(tailGlow);

  const h = LIGHT.headlight;
  const spot = new SpotLight(0xfff0cc, h.intensity, h.distance, h.angle, h.penumbra, h.decay);
  spot.position.set(0, 1.2, 0.7);
  spot.target.position.set(0, 0, 12);
  group.add(spot, spot.target);

  const rider = new Group();
  group.add(rider);
  const hip = V(0, 1.2, -0.26), shoulder = V(0, 1.78, 0.14);
  rod(rider, hip, shoulder, 0.2, shirtM);
  const headM = new Mesh(new SphereGeometry(0.17, 14, 10), skinM);
  headM.position.set(0, 2.02, 0.24);
  rider.add(headM);
  const helmet = new Mesh(new SphereGeometry(0.19, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), frameM);
  helmet.position.set(0, 2.05, 0.22);
  rider.add(helmet);
  for (const x of [-0.22, 0.22]) rod(rider, V(x, 1.72, 0.14), V(x * 1.3, 1.32, 0.5), 0.055, shirtM);

  const legs = [-0.13, 0.13].map((x) => {
    const thigh = rod(group, V(0, 0, 0), V(0, 1, 0), 0.075, pantM);
    const shin = rod(group, V(0, 0, 0), V(0, 1, 0), 0.06, pantM);
    const foot = new Mesh(unitBox, tyreM);
    foot.scale.set(0.1, 0.07, 0.24);
    group.add(foot);
    return { x, thigh, shin, foot };
  });
  const crankArms = [rod(group, V(0, 0, 0), V(0, 1, 0), 0.025, rimM), rod(group, V(0, 0, 0), V(0, 1, 0), 0.025, rimM)];
  const LEG = 0.56;

  function pose(crankAngle: number) {
    legs.forEach((lg, i) => {
      const a = crankAngle + i * Math.PI;
      const pedal = V(lg.x * 1.4, crank.y + Math.sin(a) * 0.17, crank.z + Math.cos(a) * 0.17);
      place(crankArms[i], V(lg.x * 1.4, crank.y, crank.z), pedal, 0.025);
      const hp = V(lg.x, hip.y, hip.z);
      const d = hp.distanceTo(pedal), half = Math.min(d / 2, LEG * 0.999), off = Math.sqrt(LEG * LEG - half * half);
      const dir = pedal.clone().sub(hp).normalize();
      const perp = V(0, -dir.z, dir.y);
      if (perp.z < 0) perp.negate();
      const knee = hp.clone().addScaledVector(dir, half).addScaledVector(perp, off);
      place(lg.thigh, hp, knee, 0.075);
      place(lg.shin, knee, pedal, 0.06);
      lg.foot.position.copy(pedal).add(V(0, -0.02, 0.04));
    });
  }
  pose(0);
  return { group, fork, front, rear, rider, pose };
}

export type BikeModel = ReturnType<typeof createBikeModel>;

/** Per-frame pose (module-level so React's immutability lint does not see a hook value being mutated). */
export function applyBikePose(m: BikeModel, bike: BikeState, input: BikeInput, riding: boolean, dt: number) {
  m.group.position.set(bike.x, 0, bike.z);
  m.group.rotation.set(0, bike.heading, bike.lean);
  m.fork.rotation.y = bike.steer * 0.35;
  m.front.rotation.x += (bike.v * dt) / 0.46;
  m.rear.rotation.x += (bike.v * dt) / 0.46;
  m.rider.position.y = riding && input.gas ? Math.abs(Math.sin(bike.crank)) * 0.04 : 0;
  m.rider.rotation.x = Math.min(0.18, Math.max(0, bike.v) * 0.006 + (input.boost ? 0.08 : 0));
  m.pose(bike.crank);
}
