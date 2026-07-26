import { expect, test } from "@playwright/test";

import { clickTopbarTrigger } from "./e2e-helpers";

test("carga la página del calendario", async ({ page }) => {
  await page.goto("/calendar");
  await expect(page.getByTestId("calendar-page")).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByTestId("calendar-range-label")).toBeVisible();
});

test("navega a la semana siguiente y vuelve", async ({ page }) => {
  await page.goto("/calendar");
  await expect(page.getByTestId("calendar-page")).toBeVisible({
    timeout: 15_000,
  });

  const rangeLabel = page.getByTestId("calendar-range-label");
  const initialLabel = await rangeLabel.textContent();

  await page.getByRole("button", { name: "Período siguiente" }).click();
  const nextLabel = await rangeLabel.textContent();
  expect(nextLabel).not.toBe(initialLabel);

  await page.getByRole("button", { name: "Período anterior" }).click();
  const backLabel = await rangeLabel.textContent();
  expect(backLabel).toBe(initialLabel);
});

test("botón Hoy vuelve a la semana actual", async ({ page }) => {
  await page.goto("/calendar");
  await expect(page.getByTestId("calendar-page")).toBeVisible({
    timeout: 15_000,
  });

  const rangeLabel = page.getByTestId("calendar-range-label");
  const currentLabel = await rangeLabel.textContent();

  // Navigate forward two weeks
  await page.getByRole("button", { name: "Período siguiente" }).click();
  await page.getByRole("button", { name: "Período siguiente" }).click();
  expect(await rangeLabel.textContent()).not.toBe(currentLabel);

  // Return to today
  await page.getByRole("button", { name: "Hoy" }).click();
  expect(await rangeLabel.textContent()).toBe(currentLabel);
});

test("abre el dialog de nueva cita desde el topbar", async ({ page }) => {
  await page.goto("/calendar");
  await expect(page.getByTestId("calendar-page")).toBeVisible({
    timeout: 15_000,
  });

  await clickTopbarTrigger(page, "calendar-create-trigger");

  const dialog = page.getByRole("dialog", { name: "Nueva cita" });
  await expect(dialog).toBeVisible();

  // Dismiss the dialog
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden({ timeout: 5_000 });
});

test("cambia el modo de vista a Día y vuelve a Semana", async ({ page }) => {
  await page.goto("/calendar");
  await expect(page.getByTestId("calendar-page")).toBeVisible({
    timeout: 15_000,
  });

  // ToggleGroupItem renders as role="radio"; use exact match to avoid clashing with ScheduleX labels
  await page.getByRole("radio", { name: "Día", exact: true }).click();

  // Range label should now show a single day (full day label format)
  const rangeLabel = page.getByTestId("calendar-range-label");
  const dayLabel = await rangeLabel.textContent();
  expect(dayLabel).toBeTruthy();

  // Switch back to week view
  await page.getByRole("radio", { name: "Semana", exact: true }).click();
  const weekLabel = await rangeLabel.textContent();
  expect(weekLabel).not.toBe(dayLabel);
});
