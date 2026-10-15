// Usage: node scripts/world-shot.mjs <baseUrl> <outPrefix> [x,z,heading ...]
// Opens the world, clicks Start, waits, screenshots; then teleports (dev/e2e builds expose window.__world) and shoots again.
import { chromium } from "@playwright/test";

const [base = "http://localhost:3000", out = "shot", ...spots] = process.argv.slice(2);
const browser = await chromium.launch({ args: ["--use-gl=angle", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 760 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await page.goto(base + "/");
await page.getByRole("button", { name: /start exploring|mulai menjelajah/i }).click();
await page.waitForTimeout(5000);
await page.screenshot({ path: `${out}-0.png` });
let i = 1;
for (const spot of spots) {
  const [x, z, h] = spot.split(",").map(Number);
  await page.evaluate(([x, z, h]) => window.__world?.tp(x, z, h), [x, z, h]);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${out}-${i++}.png` });
}
console.log("errors:", JSON.stringify(errors));
await browser.close();
