export const OPEN_PALETTE_EVENT = "portfolio:open-palette";

export function openCommandPalette() {
  window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));
}
