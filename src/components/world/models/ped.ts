import { BoxGeometry, CylinderGeometry, Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, SphereGeometry } from "three";

const legsGeo = new CylinderGeometry(0.16, 0.14, 0.8, 8);
const bodyGeo = new CylinderGeometry(0.22, 0.26, 0.72, 8);
const headGeo = new SphereGeometry(0.17, 10, 8);
const phoneGeo = new BoxGeometry(0.08, 0.14, 0.02);
const legsMat = new MeshStandardMaterial({ color: 0x1a1830 });
const phoneMat = new MeshBasicMaterial({ color: 0x9fe8ff });

export function createPedModel(shirt: number, skin: number, phone: boolean): Group {
  const g = new Group();
  const legs = new Mesh(legsGeo, legsMat);
  legs.position.y = 0.4;
  const body = new Mesh(bodyGeo, new MeshStandardMaterial({ color: shirt, roughness: 0.7 }));
  body.position.y = 1.16;
  const head = new Mesh(headGeo, new MeshStandardMaterial({ color: skin }));
  head.position.y = 1.68;
  g.add(legs, body, head);
  if (phone) {
    const p = new Mesh(phoneGeo, phoneMat);
    p.position.set(0.18, 1.35, 0.22);
    g.add(p);
  }
  return g;
}
