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
  // El elemento existe antes de tener texto: sin esperar a que se rellene,
  // initialLabel se guardaba como "" y la comparación final nunca cuadraba.
  await expect(rangeLabel).not.toBeEmpty();
  const initialLabel = (await rangeLabel.textContent())?.trim() ?? "";

  // toHaveText reintenta; textContent() lee una sola vez y puede adelantarse
  // al repintado tras el clic.
  await page.getByRole("button", { name: "Período siguiente" }).click();
  await expect(rangeLabel).not.toHaveText(initialLabel);

  await page.getByRole("button", { name: "Período anterior" }).click();
  await expect(rangeLabel).toHaveText(initialLabel);
});

test("botón Hoy vuelve a la semana actual", async ({ page }) => {
  await page.goto("/calendar");
  await expect(page.getByTestId("calendar-page")).toBeVisible({
    timeout: 15_000,
  });

  const rangeLabel = page.getByTestId("calendar-range-label");
  await expect(rangeLabel).not.toBeEmpty();
  const currentLabel = (await rangeLabel.textContent())?.trim() ?? "";

  // Navigate forward two weeks
  await page.getByRole("button", { name: "Período siguiente" }).click();
  await page.getByRole("button", { name: "Período siguiente" }).click();
  await expect(rangeLabel).not.toHaveText(currentLabel);

  // Return to today
  await page.getByRole("button", { name: "Hoy" }).click();
  await expect(rangeLabel).toHaveText(currentLabel);
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
