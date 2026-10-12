import { expect, test } from "@playwright/test";

test("home renders without console or page errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Miftahul");
  await expect(page.getByRole("heading", { name: "Services", level: 2 })).toBeVisible();
  await page.mouse.wheel(0, 4000);
  await expect(page.locator("#contact")).toBeVisible();
  expect(errors).toEqual([]);
});

test("featured project opens its case study and goes back", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /read case study/i }).click();
  await expect(page).toHaveURL(/\/projects\/sipresma$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Student Achievement Information System");
  await page.getByRole("link", { name: /back to work/i }).click();
  await expect(page).toHaveURL(/\/#work$/);
});

test("unknown case study returns 404", async ({ page }) => {
  const res = await page.goto("/projects/does-not-exist");
  expect(res?.status()).toBe(404);
});

test("command palette opens with Ctrl+K and filters", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Control+K");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.type("linkedin");
  await expect(dialog.getByText("Open LinkedIn profile")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("contact form submits (dry run)", async ({ page }) => {
  await page.goto("/#contact");
  await page.getByLabel("Name").fill("Test Person");
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByLabel("Message").fill("This is an automated smoke test.");
  await page.getByRole("button", { name: /send message/i }).click();
  await expect(page.getByText("Message sent, Test.")).toBeVisible();
});

test("language choice persists across reloads", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Switch language to Indonesian" }).click();
  await expect(page.getByRole("navigation", { name: "Utama" })).toContainText("/karya");
  await page.reload();
  await expect(page.getByRole("navigation", { name: "Utama" })).toContainText("/karya");
  await expect(page.locator("html")).toHaveAttribute("lang", "id");
});

test("no horizontal scroll at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ["/", "/projects/sipresma"]) {
    await page.goto(path);
    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(width, path).toBeLessThanOrEqual(390);
  }
});

test("templates still render", async ({ page }) => {
  const res = await page.goto("/temacoffe");
  expect(res?.status()).toBe(200);
  await expect(page.getByText("MabroCoffee").first()).toBeVisible();
});

test("sitemap and robots are served", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain("https://miftahulhuda.vercel.app/projects/sipresma");
  expect((await request.get("/robots.txt")).ok()).toBe(true);
});
