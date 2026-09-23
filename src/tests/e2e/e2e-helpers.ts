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
    .poll(() => new URL(page.url()).searchParams.get(key), {
      timeout: 15_000,
    })
    .toBe(value);
}

/*
 * La fila navega entera y la celda principal es además un enlace. Se pincha
 * ese enlace, por nombre y no con `.first()`, porque la fila lleva un segundo
 * enlace, el de la acción «Ver detalle», y el orden del DOM no es algo en lo
 * que apoyarse.
 */
export async function openRowDetail(page: Page, name: string | RegExp) {
  const row = page.getByRole("table").getByRole("row", { name });
  await expect(row).toBeVisible();
  await row.getByRole("link", { name }).click();
}

/*
 * Editar dejó de abrirse pinchando la fila —eso ahora lleva al detalle— y es un
 * botón de acción de la propia fila, rotulado por su `aria-label`.
 */
export async function openPatientEditDialog(page: Page, name: string | RegExp) {
  const row = page.getByRole("table").getByRole("row", { name });
  await expect(row).toBeVisible();
  await row.getByRole("button", { name: "Editar paciente" }).click();
  await expect(
    page.getByRole("dialog", { name: "Editar paciente" }),
  ).toBeVisible();
}

export async function selectComboboxOption(
  page: Page,
  trigger: Locator,
  option: string,
) {
  await trigger.click();
  const popup = page.locator('[data-slot="combobox-content"][data-open]');
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
  const moreBtn = topbar.getByRole("button", { name: "Más acciones" });

  // Las acciones del topbar se registran en un efecto tras montar la página, así
  // que al llegar aquí puede no haber todavía ningún botón. Un `isVisible()` de
  // un solo intento devuelve false, el helper cae al menú "Más acciones" y se
  // queda esperando por uno que en esta página no existe.
  await expect(directBtn.or(moreBtn).first()).toBeVisible({ timeout: 15_000 });

  if (await directBtn.isVisible()) {
    await directBtn.click();
    return;
  }

  await moreBtn.click();
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
