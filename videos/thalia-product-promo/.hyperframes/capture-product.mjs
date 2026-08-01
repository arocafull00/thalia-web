import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectDir = dirname(scriptDir);
const captureDir = join(projectDir, "capture", "assets");

await mkdir(captureDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
  locale: "es-ES",
  timezoneId: "Europe/Madrid",
  colorScheme: "light",
});
const page = await context.newPage();

await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto("http://127.0.0.1:3000/login", {
  waitUntil: "domcontentloaded",
});
await page.locator('input[type="email"]').fill("video@thalia.local");
await page.locator('input[type="password"]').fill("ThaliaVideo123!");
await page.locator('button[type="submit"]').click();
await page.waitForURL(/\/dashboard/, { timeout: 30_000 });
await page.getByTestId("dashboard-page").waitFor({ state: "visible" });

const captures = [
  ["dashboard", "/dashboard", "dashboard-page"],
  ["calendar", "/calendar", "calendar-page"],
  [
    "patient-detail",
    "/patients/94000000-0000-4000-8000-000000000001",
    "patient-detail-page",
  ],
  ["inventory", "/inventory", "inventory-page"],
  ["finances", "/finances", "finances-page"],
];

for (const [name, route, testId] of captures) {
  await page.goto(`http://127.0.0.1:3000${route}`, {
    waitUntil: "domcontentloaded",
  });
  await page.getByTestId(testId).waitFor({ state: "visible", timeout: 30_000 });
  await page.waitForTimeout(1200);
  await page.screenshot({
    path: join(captureDir, `${name}.png`),
    fullPage: false,
    animations: "disabled",
  });
}

await browser.close();
