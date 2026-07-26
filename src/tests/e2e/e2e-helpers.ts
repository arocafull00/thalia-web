import { expect, type Locator, type Page } from "@playwright/test";

export function topbarTrigger(page: Page, testId: string) {
  return page.getByTestId("app-topbar").getByTestId(testId);
}

export async function clickTopbarTrigger(page: Page, testId: string) {
  await topbarTrigger(page, testId).click();
}

export async function expectSearchParam(
  page: Page,
  key: string,
  value: string,
) {
  await expect
    .poll(() => new URL(page.url()).searchParams.get(key))
    .toBe(value);
}

export async function clickPatientTableRow(page: Page, name: string | RegExp) {
  const row = page.getByRole("table").getByRole("row", { name });
  await expect(row).toBeVisible();
  await Promise.all([page.waitForURL(/\/patients\/[^/?#]+/), row.click()]);
}

export async function selectComboboxOption(
  page: Page,
  trigger: Locator,
  option: string,
) {
  await trigger.click();
  const popup = page.locator('[data-slot="combobox-content"]:visible');
  await expect(popup).toBeVisible();
  const search = popup.getByRole("combobox");

  if (await search.count()) {
    await search.fill(option);
  }

  await popup.getByRole("option", { name: option, exact: true }).click();
}

export async function clickTopbarMenuAction(page: Page, label: string) {
  const topbar = page.getByTestId("app-topbar");
  const directBtn = topbar.getByRole("button", { name: label, exact: true });
  if (await directBtn.isVisible()) {
    await directBtn.click();
    return;
  }
  await topbar.getByRole("button", { name: "Más acciones" }).click();
  await page.getByRole("menuitem", { name: label, exact: true }).click();
}

export async function selectFirstAvailableAppointmentSlot(dialog: Locator) {
  await dialog
    .getByRole("button", { name: "Buscar hueco", exact: true })
    .click();

  const slotButton = dialog.locator("ul li button").first();
  await expect(slotButton).toBeVisible({ timeout: 15_000 });
  const label = (await slotButton.innerText()).trim();
  const timeMatch = label.match(/(\d{1,2}:\d{2})$/);

  if (!timeMatch) {
    throw new Error(`Unexpected appointment slot label: ${label}`);
  }

  await slotButton.click();
  return timeMatch[1];
}
