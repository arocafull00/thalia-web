import { expect, test, type Page } from "@playwright/test";

import { E2E_TINY_PNG } from "./e2e-constants";
import {
  clickTopbarMenuAction,
  clickTopbarTrigger,
  expectSearchParam,
  selectComboboxOption,
} from "./e2e-helpers";

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

type CampaignDraft = {
  title: string;
  content: string;
  website?: string;
  phone?: string;
  image?: boolean;
  monthsSinceLastVisit?: string;
};

/**
 * Recorre el asistente de creación paso a paso. Devuelve el diálogo para que
 * cada test pueda seguir comprobando cosas dentro de él antes de guardar.
 */
async function fillCampaignWizard(page: Page, draft: CampaignDraft) {
  const dialog = page.getByRole("dialog", { name: "Nueva campaña" });
  await expect(dialog).toBeVisible();

  // Paso 1: mensaje
  await dialog.getByLabel(/Título/).fill(draft.title);
  await dialog.getByLabel(/^Mensaje/).fill(draft.content);

  if (draft.website) {
    // exact: para no chocar con el input de imagen, cuyo texto contiene "WEBP".
    await dialog.getByLabel("Web", { exact: true }).fill(draft.website);
  }

  if (draft.phone) {
    await dialog.getByLabel("Teléfono de contacto").fill(draft.phone);
  }

  await page.getByTestId("campaign-create-next").click();

  // Paso 2: imagen
  if (draft.image) {
    await dialog.locator('input[type="file"]').setInputFiles({
      name: "promo.png",
      mimeType: "image/png",
      buffer: E2E_TINY_PNG,
    });
    await expect(dialog.getByText("promo.png")).toBeVisible();
  }

  await page.getByTestId("campaign-create-next").click();

  // Paso 3: destinatarios
  if (draft.monthsSinceLastVisit) {
    await dialog
      .getByLabel(/No viene desde hace/)
      .fill(draft.monthsSinceLastVisit);
  }

  return dialog;
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

  const dialog = await fillCampaignWizard(page, {
    title,
    content,
    website: "https://clinica-e2e.test",
  });

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

  // Paso 4: la revisión muestra el mensaje montado con su pie etiquetado.
  await page.getByTestId("campaign-create-next").click();
  const preview = dialog.getByTestId("campaign-message-preview");
  await expect(preview).toContainText(content);
  await expect(preview).toContainText("Web: https://clinica-e2e.test");

  await page.getByTestId("campaign-create-submit").click();

  await expect(dialog).toBeHidden({ timeout: 15_000 });
  await expect(
    page.getByRole("row", { name: new RegExp(title) }),
  ).toBeVisible();
  await expect(
    page.getByRole("row", { name: new RegExp(title) }),
  ).toContainText("Borrador");
});

test("no deja avanzar con 0 meses sin visitar", async ({ page }) => {
  await page.goto("/marketing");
  await clickTopbarTrigger(page, "campaign-create-trigger");

  const dialog = await fillCampaignWizard(page, {
    title: `E2E Cero ${Date.now()}`,
    content: "Mensaje de prueba.",
    monthsSinceLastVisit: "0",
  });

  // El 0 se marca como error y el asistente no pasa al paso de revisión.
  await expect(dialog.getByText("Debe ser 1 mes o más.")).toBeVisible();
  await page.getByTestId("campaign-create-next").click();
  await expect(dialog.getByText("Debe ser 1 mes o más.")).toBeVisible();
  await expect(page.getByTestId("campaign-create-submit")).toHaveCount(0);

  // Corregido a 1, avanza.
  await dialog.getByLabel(/No viene desde hace/).fill("1");
  await page.getByTestId("campaign-create-next").click();
  await expect(page.getByTestId("campaign-create-submit")).toBeVisible();
});

test("la tabla trunca el mensaje y abre la imagen en un modal", async ({
  page,
}) => {
  const suffix = Date.now();
  const title = `E2E Tabla ${suffix}`;
  const longContent = `INICIO ${"a".repeat(150)} FINAL`;

  await page.goto("/marketing");
  await clickTopbarTrigger(page, "campaign-create-trigger");

  await fillCampaignWizard(page, {
    title,
    content: longContent,
    phone: "+34910000000",
    website: "https://clinica-e2e.test",
    image: true,
  });
  await page.getByTestId("campaign-create-next").click();
  await page.getByTestId("campaign-create-submit").click();

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

  const dialog = await fillCampaignWizard(page, {
    title,
    content,
    image: true,
    monthsSinceLastVisit: "6",
  });
  await expect(dialog.getByTestId("campaign-recipients-preview")).toContainText(
    "1 paciente",
    { timeout: 15_000 },
  );
  await page.getByTestId("campaign-create-next").click();
  await page.getByTestId("campaign-create-submit").click();
  await expect(dialog).toBeHidden({ timeout: 15_000 });

  // Al pinchar la fila se navega al detalle.
  await page.getByRole("row", { name: new RegExp(title) }).click();
  await expect(page).toHaveURL(/\/marketing\/[^/?#]+/, { timeout: 15_000 });
  await expect(page.getByTestId("campaign-detail-page")).toBeVisible();
  await expect(page.getByTestId("campaign-message-preview")).toContainText(
    content,
  );
  await expect(page.getByTestId("campaign-detail-image")).toBeVisible({
    timeout: 15_000,
  });

  // Aún no se ha enviado a nadie: sin destinatarios no hay resumen de alcance.
  await expect(page.getByTestId("campaign-recipients-empty")).toBeVisible();
  await expect(page.getByTestId("campaign-reach-summary")).toHaveCount(0);

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

  const dialog = await fillCampaignWizard(page, {
    title,
    content: "Mensaje que se va a enviar.",
    monthsSinceLastVisit: "6",
  });
  await expect(dialog.getByTestId("campaign-recipients-preview")).toContainText(
    "1 paciente",
    { timeout: 15_000 },
  );
  await page.getByTestId("campaign-create-next").click();
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

  // Y el resumen de alcance refleja el envío.
  await expect(page.getByTestId("campaign-reach-summary")).toContainText(
    "Alcanzados",
  );

  // El botón de enviar desaparece: ya no es un borrador.
  await expect(
    page.getByTestId("app-topbar").getByTestId("campaign-send-trigger"),
  ).toHaveCount(0);
});

test("duplica una campaña en un borrador nuevo", async ({ page }) => {
  const suffix = Date.now();
  const title = `E2E Duplicar ${suffix}`;
  const content = "Mensaje que se va a clonar.";

  await page.goto("/marketing");
  await clickTopbarTrigger(page, "campaign-create-trigger");

  await fillCampaignWizard(page, {
    title,
    content,
    website: "https://clinica-e2e.test",
    monthsSinceLastVisit: "6",
  });
  await page.getByTestId("campaign-create-next").click();
  await page.getByTestId("campaign-create-submit").click();

  await page.getByRole("row", { name: new RegExp(title) }).click();
  await expect(page.getByTestId("campaign-detail-page")).toBeVisible();
  const originalUrl = page.url();

  await clickTopbarMenuAction(page, "Duplicar campaña");

  // Navega a la copia, que es otra campaña distinta y nace como borrador.
  await expect(page).not.toHaveURL(originalUrl, { timeout: 15_000 });
  await expect(page.getByTestId("campaign-detail-page")).toContainText(
    `Copia de ${title}`,
  );
  await expect(page.getByTestId("campaign-detail-page")).toContainText(
    "Borrador",
  );
  await expect(page.getByTestId("campaign-message-preview")).toContainText(
    content,
  );

  // El segmento viaja con la copia: el diálogo de envío dice 1 paciente.
  await clickTopbarTrigger(page, "campaign-send-trigger");
  await expect(
    page.getByRole("dialog", { name: "Enviar campaña" }),
  ).toContainText("1 paciente");
});

test("filtra campañas por nombre y por estado", async ({ page }) => {
  const suffix = Date.now();
  const borrador = `E2E Filtro Borrador ${suffix}`;
  const otra = `E2E Filtro Otra ${suffix}`;

  await page.goto("/marketing");

  for (const title of [borrador, otra]) {
    await clickTopbarTrigger(page, "campaign-create-trigger");
    await fillCampaignWizard(page, { title, content: "Mensaje de filtro." });
    await page.getByTestId("campaign-create-next").click();
    await page.getByTestId("campaign-create-submit").click();
    await expect(
      page.getByRole("row", { name: new RegExp(title) }),
    ).toBeVisible();
  }

  // Por nombre: solo queda la buscada.
  await page.getByPlaceholder("Buscar campañas...").fill(borrador);
  await expectSearchParam(page, "q", borrador);
  await expect(
    page.getByRole("row", { name: new RegExp(borrador) }),
  ).toBeVisible();
  await expect(
    page.getByRole("table").getByRole("row", { name: new RegExp(otra) }),
  ).toHaveCount(0);

  // Al limpiar la búsqueda vuelven las dos. Hay que esperar a que la URL se
  // asiente: el debounce de la búsqueda hace su propio router.replace y, si se
  // solapa con el del estado, uno pisa al otro por partir de parámetros viejos.
  await page.getByPlaceholder("Buscar campañas...").fill("");
  await expect(page.getByRole("row", { name: new RegExp(otra) })).toBeVisible();
  await expect
    .poll(() => new URL(page.url()).searchParams.get("q"), {
      timeout: 15_000,
    })
    .toBeNull();

  // Por estado: las dos son borradores, así que filtrando por "Enviada"
  // desaparecen. No se comprueba que la tabla quede vacía porque otros tests
  // dejan campañas enviadas en la misma base de datos.
  await selectComboboxOption(
    page,
    page.getByTestId("campaigns-status-combobox"),
    "Enviada",
  );
  await expectSearchParam(page, "status", "sent");
  await expect(
    page.getByRole("table").getByRole("row", { name: new RegExp(borrador) }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("table").getByRole("row", { name: new RegExp(otra) }),
  ).toHaveCount(0);

  // Y volviendo a "Borrador" reaparecen.
  await selectComboboxOption(
    page,
    page.getByTestId("campaigns-status-combobox"),
    "Borrador",
  );
  await expectSearchParam(page, "status", "draft");
  await expect(
    page.getByRole("row", { name: new RegExp(borrador) }),
  ).toBeVisible();
});
