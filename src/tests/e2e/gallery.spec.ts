import { expect, test, type Page } from "@playwright/test";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { E2E_DATA, E2E_TINY_PNG } from "./e2e-constants";
import { selectComboboxOption } from "./e2e-helpers";

const paginationRunId = Date.now().toString();
const paginationStorageKey = `${E2E_DATA.clinicId}/${E2E_DATA.patientId}/e2e-pagination-${paginationRunId}.png`;
const paginationImageIds = Array.from({ length: 25 }, () =>
  crypto.randomUUID(),
);
const adminUrl = process.env.E2E_SUPABASE_URL;
const adminKey = process.env.E2E_SUPABASE_SECRET_KEY;
let adminClient: SupabaseClient | null = null;

test.beforeAll(async () => {
  if (!adminUrl || !adminKey) {
    return;
  }

  adminClient = createClient(adminUrl, adminKey, {
    auth: { persistSession: false },
  });

  const { error: uploadError } = await adminClient.storage
    .from("patient-images")
    .upload(paginationStorageKey, E2E_TINY_PNG, {
      contentType: "image/png",
      upsert: true,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { error: insertError } = await adminClient
    .from("patient_images")
    .insert(
      paginationImageIds.map((id, index) => ({
        id,
        patient_id: E2E_DATA.patientId,
        clinic_id: E2E_DATA.clinicId,
        storage_key: paginationStorageKey,
        original_filename: `e2e-pagination-${paginationRunId}-${index + 1}.png`,
        mime_type: "image/png",
        phase: index % 2 === 0 ? "antes" : "despues",
        treatment_id: E2E_DATA.treatmentId,
        captured_at: new Date(Date.UTC(2025, 0, index + 1, 12)).toISOString(),
      })),
    );

  if (insertError) {
    throw insertError;
  }
});

test.afterAll(async () => {
  if (!adminClient) {
    return;
  }

  await adminClient
    .from("patient_images")
    .delete()
    .in("id", paginationImageIds);
  await adminClient.storage
    .from("patient-images")
    .remove([paginationStorageKey]);
});

async function uploadPatientImage(
  page: Page,
  name: string,
  phase: "Antes" | "Después",
) {
  await page.getByTestId("patient-gallery-upload-trigger").click();
  const dialog = page.getByRole("dialog", { name: "Subir imágenes" });
  await dialog.locator('input[type="file"]').setInputFiles({
    name,
    mimeType: "image/png",
    buffer: E2E_TINY_PNG,
  });
  await selectComboboxOption(
    page,
    dialog.getByTestId("patient-image-phase-combobox"),
    phase,
  );
  await page.getByTestId("patient-gallery-upload-submit").click();

  const successToast = page
    .getByRole("alert")
    .filter({ hasText: "1 imagen subida correctamente" })
    .last();
  await expect(successToast).toBeVisible({ timeout: 15_000 });
  await expect(dialog).toBeHidden({ timeout: 15_000 });
}

test("pagina y combina filtros de la galería en servidor", async ({ page }) => {
  test.skip(!adminUrl || !adminKey, "Requiere el wrapper de Supabase local");

  await page.goto(`/patients/${E2E_DATA.patientId}`);
  await page.getByRole("tab", { name: "Galería", exact: true }).click();

  const gallery = page.getByTestId("patient-gallery");
  await gallery
    .getByLabel("Buscar imagen")
    .fill(`e2e-pagination-${paginationRunId}`);

  await expect(
    gallery.getByText("24 de 25 imágenes", { exact: true }),
  ).toBeVisible();
  await expect(
    gallery.locator('[data-testid^="patient-gallery-view-"]'),
  ).toHaveCount(24);

  await gallery.getByTestId("patient-gallery-load-more").click();
  await expect(
    gallery.getByText("25 de 25 imágenes", { exact: true }),
  ).toBeVisible();
  await expect(
    gallery.locator('[data-testid^="patient-gallery-view-"]'),
  ).toHaveCount(25);
  await expect(gallery.getByTestId("patient-gallery-load-more")).toHaveCount(0);

  await selectComboboxOption(page, gallery.getByLabel("Fase"), "Antes");
  await expect(
    gallery.getByText("13 de 13 imágenes", { exact: true }),
  ).toBeVisible();

  await selectComboboxOption(
    page,
    gallery.getByLabel("Tratamiento"),
    E2E_DATA.treatment,
  );
  await gallery.getByLabel("Fecha").click();
  await page.getByLabel("Fecha desde").fill("2025-01-10");
  await page.getByLabel("Fecha hasta").fill("2025-01-20");

  await expect(
    gallery.getByText("5 de 5 imágenes", { exact: true }),
  ).toBeVisible();
});

test("sube imágenes y abre la comparativa before/after", async ({ page }) => {
  const suffix = Date.now();
  const beforeName = `e2e-before-${suffix}.png`;
  const afterName = `e2e-after-${suffix}.png`;

  await page.goto(`/patients/${E2E_DATA.patientId}`);
  await expect(page.getByTestId("patient-detail-page")).toBeVisible();
  await page.getByRole("tab", { name: "Galería", exact: true }).click();
  await expect(page.getByTestId("patient-gallery")).toBeVisible();

  await uploadPatientImage(page, beforeName, "Antes");
  await uploadPatientImage(page, afterName, "Después");

  await expect(
    page.getByRole("button", { name: `Ver imagen: ${beforeName}` }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: `Ver imagen: ${afterName}` }),
  ).toBeVisible();

  await page.getByTestId("patient-gallery-before-after-trigger").click();
  await page
    .getByRole("button", { name: `Seleccionar: ${beforeName}` })
    .click();
  await page.getByRole("button", { name: `Seleccionar: ${afterName}` }).click();
  await page.getByTestId("patient-gallery-compare-trigger").click();

  await expect(page.getByTestId("before-after-comparison")).toBeVisible();
  await expect(
    page.getByTestId("patient-gallery-comparison-close"),
  ).toBeVisible();
});

test("mantiene editables los metadatos con 24 imágenes pendientes", async ({
  context,
  page,
}) => {
  const session = await context.newCDPSession(page);
  await session.send("Emulation.setCPUThrottlingRate", { rate: 6 });

  await page.goto(`/patients/${E2E_DATA.patientId}`);
  await expect(page.getByTestId("patient-detail-page")).toBeVisible();
  await page.getByRole("tab", { name: "Galería", exact: true }).click();
  await page.getByTestId("patient-gallery-upload-trigger").click();

  const dialog = page.getByRole("dialog", { name: "Subir imágenes" });
  const files = Array.from({ length: 24 }, (_, index) => ({
    name: `e2e-batch-${index + 1}.png`,
    mimeType: "image/png",
    buffer: E2E_TINY_PNG,
  }));

  await dialog.locator('input[type="file"]').setInputFiles(files);
  await expect(
    dialog.getByRole("listitem", { name: "dropzone-file-list-item" }),
  ).toHaveCount(24);

  const phaseCombobox = dialog.getByTestId("patient-image-phase-combobox");
  const treatmentCombobox = dialog.getByTestId(
    "patient-image-treatment-combobox",
  );
  const capturedAtInput = dialog.locator('input[type="date"]');

  await selectComboboxOption(page, phaseCombobox, "Después");
  await selectComboboxOption(page, treatmentCombobox, E2E_DATA.treatment);
  await capturedAtInput.fill("2025-02-03");

  await expect(phaseCombobox).toContainText("Después");
  await expect(treatmentCombobox).toContainText(E2E_DATA.treatment);
  await expect(capturedAtInput).toHaveValue("2025-02-03");
});
