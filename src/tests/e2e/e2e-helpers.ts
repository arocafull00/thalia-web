import { expect, type Locator, type Page } from "@playwright/test";

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
