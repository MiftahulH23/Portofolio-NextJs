// Renders public/world/intro-bg.jpg from the running dev server (needs window.__world).
import { chromium } from "@playwright/test";
import { statSync } from "node:fs";

const base = process.argv[2] ?? "http://localhost:3000";
const browser = await chromium.launch({ args: ["--use-gl=angle", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await page.goto(base + "/");
await page.getByRole("button", { name: /start exploring|mulai menjelajah/i }).click();
await page.waitForTimeout(4000);
await page.evaluate(() => window.__world?.tp(140, 132, 0));
await page.waitForTimeout(2500);
await page.evaluate(() => {
  for (const el of document.querySelectorAll("main > *")) if (!el.querySelector("canvas")) el.style.display = "none";
  document.querySelectorAll("body > div:not(:has(main))").forEach((el) => (el.style.display = "none"));
  document.querySelectorAll("nextjs-portal").forEach((el) => (el.style.display = "none"));
});
for (const q of [72, 62, 52]) {
  await page.screenshot({ path: "public/world/intro-bg.jpg", type: "jpeg", quality: q });
  const kb = statSync("public/world/intro-bg.jpg").size / 1024;
  console.log(`quality ${q}: ${kb.toFixed(0)} KB`);
  if (kb <= 120) break;
}
await browser.close();
