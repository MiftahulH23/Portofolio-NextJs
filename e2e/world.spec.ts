import { expect, test, type Page } from "@playwright/test";

declare global {
  interface Window { __world?: { tp(x: number, z: number, heading: number): void } }
}

async function start(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Start exploring →" }).click();
  await expect(page.getByRole("navigation", { name: "Journey route" })).toBeVisible({ timeout: 20_000 });
}

async function rideThroughProfileGate(page: Page) {
  await page.evaluate(() => window.__world!.tp(140, 160, 0));
  await page.keyboard.down("KeyW");
  await expect(page.getByRole("dialog", { name: "Miftahul Huda" })).toBeVisible({ timeout: 8_000 });
  await page.keyboard.up("KeyW");
}

test("intro is server-rendered with real content", async ({ request }) => {
  const html = await (await request.get("/")).text();
  expect(html).toContain("Miftahul Huda");
  expect(html).toContain("Start exploring");
  expect(html).toContain('href="/ringkas"');
  expect(html).toContain("application/ld+json");
});

test.describe("touch device", () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });

  test("the 3D chunk loads only after Start (touch devices never preload)", async ({ page }) => {
    const bodies: string[] = [];
    page.on("response", async (r) => {
      if (r.url().endsWith(".js")) bodies.push(await r.text().catch(() => ""));
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
    expect(bodies.some((b) => b.includes("WebGLRenderer"))).toBe(false);
    await page.getByRole("button", { name: "Start exploring →" }).click();
    await expect.poll(() => bodies.some((b) => b.includes("WebGLRenderer")), { timeout: 20_000 }).toBe(true);
  });

  test("controls visible after start, no horizontal scroll", async ({ page }) => {
    await start(page);
    await expect(page.getByRole("button", { name: "Ride" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  });
});

test("riding through a gate opens its card, every time", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await start(page);
  await rideThroughProfileGate(page);
  await page.getByRole("button", { name: "Close information" }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
  await rideThroughProfileGate(page);
  await expect(page.getByRole("button", { name: "Gate 1: Profile" })).toBeEnabled();
  expect(errors).toEqual([]);
});

test("language switch updates the HUD and the open card", async ({ page }) => {
  await start(page);
  await rideThroughProfileGate(page);
  await page.getByRole("button", { name: "Switch language to Indonesian" }).click();
  await expect(page.getByRole("navigation", { name: "Rute perjalanan" })).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("Gerbang 1 · Profil");
});

test("resizing mid-ride keeps working", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await start(page);
  await page.setViewportSize({ width: 820, height: 1180 });
  await page.waitForTimeout(500);
  await page.setViewportSize({ width: 1280, height: 720 });
  await rideThroughProfileGate(page);
  expect(errors).toEqual([]);
});

test("compact version link goes to /ringkas", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "View compact version ↗" }).click();
  await expect(page).toHaveURL(/\/ringkas$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Miftahul");
});

test("leaving for /ringkas and coming back starts a fresh ride", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await start(page);
  await page.getByRole("link", { name: "Compact version" }).click();
  await expect(page).toHaveURL(/\/ringkas$/);
  await page.waitForTimeout(1500); // R3F forces a context loss ~500 ms after the canvas unmounts
  await page.getByRole("link", { name: "miftahul.dev" }).first().click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  await start(page);
  await rideThroughProfileGate(page);
  expect(errors).toEqual([]);
});

test("reduced motion hydrates without errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByText(/Reduced motion is enabled/)).toBeVisible();
  await page.waitForTimeout(1000);
  expect(errors).toEqual([]);
});
