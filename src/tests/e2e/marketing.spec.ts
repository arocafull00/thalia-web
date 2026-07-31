import { expect, test } from "@playwright/test";

import { E2E_TINY_PNG } from "./e2e-constants";
import { clickTopbarTrigger } from "./e2e-helpers";

/**
 * Comprueba que el edge runtime de Supabase responde antes de probar el envío,
 * y de paso lo calienta: la primera invocación descarga supabase-js desde
 * esm.sh, así que hacerlo aquí evita que ese coste caiga dentro del test.
 *
 * Si no responde, el test se salta en lugar de fallar.
 */
async function edgeFunctionsAvailable(): Promise<boolean> {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!baseUrl) {
    return false;
  }

  try {
    const response = await fetch(`${baseUrl}/functions/v1/send-campaign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
      // Margen amplio a propósito: en frío la función tarda en arrancar, y con
      // un timeout corto la sonda fallaría y el test se saltaría en silencio,
      // que es peor que tardar unos segundos de más.
      signal: AbortSignal.timeout(60_000),
    });

    // No vale con que conteste algo: cuando Supabase corre pero nadie sirve las
    // functions, Kong responde igualmente (404/503) y el test se ejecutaría
    // para acabar fallando. La firma de que la función está viva es su propio
    // 400 por falta de campaignId.
    if (response.status !== 400) {
      return false;
    }

    const payload = await response.json().catch(() => null);
    return typeof payload?.error === "string";
  } catch {
    return false;
  }
}

test("muestra el estado vacío cuando no hay campañas", async ({ page }) => {
  await page.goto("/marketing");
  await expect(page.getByTestId("marketing-page")).toBeVisible();
  await expect(page.getByTestId("campaigns-empty-state")).toBeVisible();
});

test("crea una campaña y segmenta a los pacientes con consentimiento", async ({
  page,
}) => {
  const suffix = Date.now();
  const title = `E2E Campaña ${suffix}`;
  const content = "Hola, este mes tenemos un 20% en tratamientos faciales.";

  await page.goto("/marketing");
  await expect(page.getByTestId("marketing-page")).toBeVisible();
  await clickTopbarTrigger(page, "campaign-create-trigger");

  const dialog = page.getByRole("dialog", { name: "Nueva campaña" });
  await expect(dialog).toBeVisible();

  await dialog.getByLabel(/Título/).fill(title);
  await dialog.getByLabel(/^Mensaje/).fill(content);

  // La vista previa refleja el mensaje mientras se escribe.
  await expect(dialog.getByTestId("campaign-message-preview")).toContainText(
    content,
  );

  // El pie se monta con los campos que tengan valor.
  // exact: para no chocar con el input de imagen, cuyo texto contiene "WEBP".
  await dialog
    .getByLabel("Web", { exact: true })
    .fill("https://clinica-e2e.test");
  await expect(dialog.getByTestId("campaign-message-preview")).toContainText(
    "https://clinica-e2e.test",
  );

  // Sin filtros hay 2 pacientes con opt-in y teléfono en el seed.
  await expect(dialog.getByTestId("campaign-recipients-preview")).toContainText(
    "2 pacientes",
    { timeout: 15_000 },
  );

  // Filtrando por inactividad de 6 meses solo queda uno.
  await dialog.getByLabel(/No viene desde hace/).fill("6");
  await expect(dialog.getByTestId("campaign-recipients-preview")).toContainText(
    "1 paciente",
    { timeout: 15_000 },
  );

  await page.getByTestId("campaign-create-submit").click();

  await expect(dialog).toBeHidden({ timeout: 15_000 });
  await expect(
    page.getByRole("row", { name: new RegExp(title) }),
  ).toBeVisible();
  await expect(
    page.getByRole("row", { name: new RegExp(title) }),
  ).toContainText("Borrador");
});

test("la tabla trunca el mensaje y abre la imagen en un modal", async ({
  page,
}) => {
  const suffix = Date.now();
  const title = `E2E Tabla ${suffix}`;
  // Más de 100 caracteres para comprobar el recorte.
  const longContent = `INICIO ${"a".repeat(150)} FINAL`;

  await page.goto("/marketing");
  await clickTopbarTrigger(page, "campaign-create-trigger");

  const dialog = page.getByRole("dialog", { name: "Nueva campaña" });
  await dialog.getByLabel(/Título/).fill(title);
  await dialog.getByLabel(/^Mensaje/).fill(longContent);
  await dialog.getByLabel("Teléfono de contacto").fill("+34910000000");
  await dialog
    .getByLabel("Web", { exact: true })
    .fill("https://clinica-e2e.test");
  await dialog.locator('input[type="file"]').setInputFiles({
    name: "promo.png",
    mimeType: "image/png",
    buffer: E2E_TINY_PNG,
  });
  await page.getByTestId("campaign-create-submit").click();
  await expect(dialog).toBeHidden({ timeout: 15_000 });

  const row = page.getByRole("row", { name: new RegExp(title) });
  await expect(row).toBeVisible();

  // El mensaje se corta: se ve el principio pero no el final.
  await expect(row).toContainText("INICIO");
  await expect(row).not.toContainText("FINAL");

  // El icono abre el modal sin navegar al detalle.
  await row.getByTestId("campaign-image-trigger").click();
  await expect(page.getByTestId("campaign-image-dialog")).toBeVisible();
  await expect(
    page.getByTestId("campaign-image-dialog").getByRole("img"),
  ).toBeVisible({ timeout: 15_000 });
  await expect(page).toHaveURL(/\/marketing$/);
});

test("abre el detalle de una campaña y confirma a cuántos se enviará", async ({
  page,
}) => {
  const suffix = Date.now();
  const title = `E2E Detalle ${suffix}`;
  const content = "Mensaje de la campaña de detalle.";

  await page.goto("/marketing");
  await clickTopbarTrigger(page, "campaign-create-trigger");

  const dialog = page.getByRole("dialog", { name: "Nueva campaña" });
  await dialog.getByLabel(/Título/).fill(title);
  await dialog.getByLabel(/^Mensaje/).fill(content);

  // Imagen destacada: se sube al guardar, no al elegirla.
  await dialog.locator('input[type="file"]').setInputFiles({
    name: "promo.png",
    mimeType: "image/png",
    buffer: E2E_TINY_PNG,
  });
  await expect(dialog.getByText("promo.png")).toBeVisible();

  await dialog.getByLabel(/No viene desde hace/).fill("6");
  await expect(dialog.getByTestId("campaign-recipients-preview")).toContainText(
    "1 paciente",
    { timeout: 15_000 },
  );
  await page.getByTestId("campaign-create-submit").click();
  await expect(dialog).toBeHidden({ timeout: 15_000 });

  // Al pinchar la fila se navega al detalle.
  await page.getByRole("row", { name: new RegExp(title) }).click();
  await expect(page).toHaveURL(/\/marketing\/[^/?#]+/, { timeout: 15_000 });
  await expect(page.getByTestId("campaign-detail-page")).toBeVisible();
  await expect(page.getByTestId("campaign-message-preview")).toContainText(
    content,
  );
  // La imagen subida se recupera del bucket privado con URL firmada.
  await expect(page.getByTestId("campaign-detail-image")).toBeVisible({
    timeout: 15_000,
  });

  // Aún no se ha enviado a nadie.
  await expect(page.getByTestId("campaign-recipients-empty")).toBeVisible();

  // El diálogo recalcula el segmento: debe decir 1 paciente, no el número
  // que se vio al crearla.
  await clickTopbarTrigger(page, "campaign-send-trigger");
  const confirmDialog = page.getByRole("dialog", { name: "Enviar campaña" });
  await expect(confirmDialog).toBeVisible();
  await expect(confirmDialog).toContainText("1 paciente");
  await expect(confirmDialog).toContainText("no se puede deshacer");
});

test("envía la campaña y la marca como enviada", async ({ page }) => {
  test.skip(
    !(await edgeFunctionsAvailable()),
    "Requiere el edge runtime de Supabase en marcha.",
  );

  // La edge function importa supabase-js desde esm.sh en tiempo de ejecución.
  // En un runner limpio, la primera invocación descarga ese módulo por red y el
  // arranque en frío se come los 30 s por defecto del test.
  test.slow();

  const suffix = Date.now();
  const title = `E2E Envio ${suffix}`;

  await page.goto("/marketing");
  await clickTopbarTrigger(page, "campaign-create-trigger");

  const dialog = page.getByRole("dialog", { name: "Nueva campaña" });
  await dialog.getByLabel(/Título/).fill(title);
  await dialog.getByLabel(/^Mensaje/).fill("Mensaje que se va a enviar.");
  await dialog.getByLabel(/No viene desde hace/).fill("6");
  await expect(dialog.getByTestId("campaign-recipients-preview")).toContainText(
    "1 paciente",
    { timeout: 15_000 },
  );
  await page.getByTestId("campaign-create-submit").click();
  await expect(dialog).toBeHidden({ timeout: 15_000 });

  await page.getByRole("row", { name: new RegExp(title) }).click();
  await expect(page.getByTestId("campaign-detail-page")).toBeVisible();

  await clickTopbarTrigger(page, "campaign-send-trigger");
  await page
    .getByRole("dialog", { name: "Enviar campaña" })
    .getByRole("button", { name: "Enviar ahora" })
    .click();

  // El destinatario aparece con su estado y la campaña pasa a Enviada.
  await expect(page.getByTestId("campaign-recipients-list")).toContainText(
    "E2E Marketing Inactivo",
    { timeout: 30_000 },
  );
  await expect(page.getByTestId("campaign-detail-page")).toContainText(
    "Enviada",
    { timeout: 15_000 },
  );

  // El botón de enviar desaparece: ya no es un borrador.
  await expect(
    page.getByTestId("app-topbar").getByTestId("campaign-send-trigger"),
  ).toHaveCount(0);
});
