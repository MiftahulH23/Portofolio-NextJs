import { BOARDS, boardPole } from "./billboards";
import { createBike, kmh, stepBike, type BikeInput, type BikeState } from "./bike";
import { BOUNDS, START, buildCity, type CityLayout, type Circle, type Rect } from "./city";
import { resolveCollisions } from "./collision";
import { GATES, GateTracker, gatePillars, type GateKey } from "./gates";
import { spawnPeds, stepPeds, type Ped } from "./pedestrians";
import { mulberry32, type Rand } from "./random";
import type { Tier } from "./store";
import { pushBikeFromCars, spawnCars, stepTraffic, type Car } from "./traffic";

export interface Runtime {
  city: CityLayout;
  colliders: { rects: Rect[]; circles: Circle[] };
  bike: BikeState;
  input: BikeInput;
  cars: Car[];
  peds: Ped[];
  rand: Rand;
  shake: number;
  tracker: GateTracker;
  trip: Trip;
}

/** What the rider has done since the last start: shown on the speedometer and the finish ticket. */
export interface Trip { meters: number; seconds: number; topKmh: number; bells: number }
export const newTrip = (): Trip => ({ meters: 0, seconds: 0, topKmh: 0, bells: 0 });

export interface StepEvents { bump: boolean; honk: boolean; nearMiss: boolean; entered: GateKey[] }

export const AGENTS: Record<Tier, { cars: number; peds: number }> = { high: { cars: 18, peds: 44 }, low: { cars: 8, peds: 16 } };

export function createRuntime(tier: Tier, seed = 7): Runtime {
  const city = buildCity(seed);
  const circles = [...city.circles, ...GATES.flatMap(gatePillars), ...BOARDS.map(boardPole)];
  const rand = mulberry32(seed + 1);
  return {
    city,
    colliders: { rects: city.rects, circles },
    bike: createBike(START.x, START.z, START.heading),
    input: { gas: false, brake: false, left: false, right: false, boost: false },
    cars: spawnCars(AGENTS[tier].cars, rand),
    peds: spawnPeds(AGENTS[tier].peds, rand),
    rand,
    shake: 0,
    tracker: new GateTracker(),
    trip: newTrip(),
  };
}

/** `keepBike` is for a mid-ride tier drop: respawn agents without teleporting the rider. */
export function resetRuntime(rt: Runtime, tier: Tier, keepBike = false) {
  if (!keepBike) {
    rt.bike = createBike(START.x, START.z, START.heading);
    rt.trip = newTrip();
  }
  rt.cars = spawnCars(AGENTS[tier].cars, rt.rand);
  rt.peds = spawnPeds(AGENTS[tier].peds, rt.rand);
  rt.tracker.reset();
  rt.shake = 0;
}

/** One simulation tick. Rendering components only read from `rt` afterwards. */
export function stepWorld(rt: Runtime, rawDt: number, started: boolean): StepEvents {
  const dt = Math.min(Math.max(rawDt, 0), 1 / 30);
  const ev: StepEvents = { bump: false, honk: false, nearMiss: false, entered: [] };
  if (started) {
    let b = stepBike(rt.bike, rt.input, dt);
    const c = resolveCollisions(b.x, b.z, rt.colliders.rects, rt.colliders.circles, BOUNDS);
    if (c.hit) {
      ev.bump = Math.abs(b.v) > 4;
      b = { ...b, x: c.x, z: c.z, v: b.v * 0.35 };
    }
    rt.bike = b;
  }
  ev.honk = stepTraffic(rt.cars, rt.bike, dt, rt.rand).honked;
  if (started) {
    const p = pushBikeFromCars(rt.bike.x, rt.bike.z, rt.cars);
    if (p.hit) {
      if (Math.abs(rt.bike.v) > 2) ev.bump = true;
      rt.bike = { ...rt.bike, x: p.x, z: p.z, v: rt.bike.v * 0.3 };
    }
  }
  const peds = stepPeds(rt.peds, rt.bike, rt.bike.v, dt);
  if (started && peds.nearMiss) {
    rt.bike = { ...rt.bike, v: rt.bike.v * 0.6 };
    ev.nearMiss = true;
  }
  if (started) {
    ev.entered = rt.tracker.update(rt.bike.x, rt.bike.z);
    rt.trip.meters += Math.abs(rt.bike.v) * dt;
    rt.trip.seconds += dt;
    rt.trip.topKmh = Math.max(rt.trip.topKmh, kmh(rt.bike.v));
  }
  if (ev.bump) rt.shake = 0.35;
  rt.shake = Math.max(0, rt.shake - dt * 1.5);
  return ev;
}

let singleton: Runtime | null = null;
/** App-wide mutable world (client only). */
export function getRuntime(tier: Tier = "high"): Runtime {
  if (!singleton) singleton = createRuntime(tier);
  return singleton;
}
