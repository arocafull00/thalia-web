import { expect, type Locator, type Page } from "@playwright/test";

export function topbarTrigger(page: Page, testId: string) {
  return page.getByTestId("app-topbar").getByTestId(testId);
}

export async function clickTopbarTrigger(page: Page, testId: string) {
  await topbarTrigger(page, testId).click();
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

export async function selectFirstAvailableAppointmentSlot(dialog: Locator) {
  await dialog
    .getByRole("button", { name: "Buscar hueco", exact: true })
    .click();

  const slotButton = dialog.locator("ul li button").first();
  await expect(slotButton).toBeVisible({ timeout: 15_000 });
  await slotButton.click();
}
