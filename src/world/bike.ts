import type { Vec2 } from "./city";

export interface BikeInput { gas: boolean; brake: boolean; left: boolean; right: boolean; boost: boolean }
export interface BikeState { x: number; z: number; heading: number; v: number; steer: number; lean: number; crank: number }

/** Tuned in the approved prototype (docs/superpowers/prototypes/kota-neon-v3.html). */
export const BIKE = {
  max: 22, boostMax: 32, accel: 11, boostAccel: 16, brake: 24, reverse: 6, drag: 0.28, rolling: 0.9,
  minV: -5, steerResponse: 7, turnRate: 1.55, leanMax: 0.42, maxDt: 1 / 30,
} as const;

export const createBike = (x: number, z: number, heading: number): BikeState => ({ x, z, heading, v: 0, steer: 0, lean: 0, crank: 0 });
export const forward = (heading: number): Vec2 => ({ x: Math.sin(heading), z: Math.cos(heading) });
export const kmh = (v: number) => Math.round(Math.abs(v) * 1.6);

export function stepBike(s: BikeState, input: BikeInput, rawDt: number): BikeState {
  const dt = Math.min(Math.max(rawDt, 0), BIKE.maxDt);
  const cap = input.boost ? BIKE.boostMax : BIKE.max;
  let v = s.v;
  const acc = input.gas ? (input.boost ? BIKE.boostAccel : BIKE.accel) * (1 - (Math.max(0, v) / cap) * 0.6) : 0;
  const brk = input.brake ? (v > 0.3 ? BIKE.brake : BIKE.reverse) : 0;
  v += (acc - brk - v * BIKE.drag - (Math.abs(v) > 0.05 ? Math.sign(v) * BIKE.rolling : 0)) * dt;
  if (!input.gas && !input.brake && Math.abs(v) < 0.1) v = 0;
  v = Math.min(cap, Math.max(BIKE.minV, v));

  const target = (input.left ? 1 : 0) - (input.right ? 1 : 0);
  const steer = s.steer + (target - s.steer) * Math.min(1, dt * BIKE.steerResponse);
  const grip = Math.min(1, Math.abs(v) / 3) * (1 - Math.min(Math.abs(v), 32) / 70);
  const heading = s.heading + steer * BIKE.turnRate * grip * (v < 0 ? -1 : 1) * dt;
  const f = forward(heading);
  const lean = s.lean + (-steer * BIKE.leanMax * Math.min(1, Math.abs(v) / 9) - s.lean) * Math.min(1, dt * 5);
  const crank = s.crank + Math.max(0, v) * dt * 1.5 + (input.gas ? dt * 2 : 0);
  return { x: s.x + f.x * v * dt, z: s.z + f.z * v * dt, heading, v, steer, lean, crank };
}
