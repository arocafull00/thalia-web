import { expect, type Locator, type Page } from "@playwright/test";

export async function selectComboboxOption(
  page: Page,
  field: Locator,
  option: string,
) {
  await field.getByRole("button").click();
  const popup = page.locator('[data-slot="combobox-content"]');
  await expect(popup).toBeVisible();
  const search = popup.getByRole("combobox");

  if (await search.count()) {
    await search.fill(option);
  }

  await popup.getByRole("option", { name: option, exact: true }).click();
}

export function getDialogField(dialog: Locator, label: string) {
  return dialog.getByText(label, { exact: true }).locator("..");
}
