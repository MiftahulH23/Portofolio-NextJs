import type { CSSProperties } from "react";
import { GATES, type GateKey } from "@/world/gates";
import { hex } from "@/world/palette";

/** The neon a gate glows with in the city, so the HUD speaks the same colour. */
export const gateHex = (key: GateKey) => hex(GATES.find((g) => g.key === key)!.color);

/** Exposes the gate colour to Tailwind as `var(--gate)`. */
export const gateStyle = (key: GateKey) => ({ "--gate": gateHex(key) }) as CSSProperties;
