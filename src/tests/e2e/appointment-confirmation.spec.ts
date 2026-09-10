import { expect, test } from "@playwright/test";

/*
 * La página del enlace de confirmación es pública: no hay sesión, ni barra
 * lateral, ni clínica activa. Por eso este spec no usa el storageState de
 * auth.setup — se ejecuta como un paciente cualquiera que abre el enlace desde
 * WhatsApp.
 */
test.use({ storageState: { cookies: [], origins: [] } });

const CONFIRMABLE = "90000000-0000-4000-8000-000000000001";
const CANCELLED = "90000000-0000-4000-8000-000000000002";
const EXPIRED = "90000000-0000-4000-8000-000000000003";

test("muestra la cita y la confirma con el botón", async ({ page }) => {
  await page.goto(`/cita/${CONFIRMABLE}`);

  await expect(
    page.getByRole("heading", { name: "¿Confirmas tu cita?" }),
  ).toBeVisible();
  await expect(page.getByText("Clínica E2E")).toBeVisible();

  const confirmButton = page.getByRole("button", { name: "Confirmar cita" });
  await expect(confirmButton).toBeVisible();
  await confirmButton.click();

  await expect(
    page.getByRole("heading", { name: "¡Cita confirmada!" }),
  ).toBeVisible();
  await expect(confirmButton).toBeHidden();
});

test("volver al enlace ya confirmado no da error", async ({ page }) => {
  // Idempotencia: el paciente reabre el mensaje días después. Depende del test
  // anterior a propósito, que es lo que deja la cita confirmada.
  await page.goto(`/cita/${CONFIRMABLE}`);

  await expect(
    page.getByRole("heading", { name: "Tu cita ya está confirmada" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Confirmar cita" }),
  ).toBeHidden();
});

test("no ofrece confirmar una cita cancelada", async ({ page }) => {
  await page.goto(`/cita/${CANCELLED}`);

  await expect(
    page.getByRole("heading", { name: "Esta cita fue cancelada" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Confirmar cita" }),
  ).toBeHidden();
});

test("rechaza un token caducado y uno inexistente", async ({ page }) => {
  await page.goto(`/cita/${EXPIRED}`);
  await expect(
    page.getByRole("heading", { name: "El enlace ha caducado" }),
  ).toBeVisible();

  // Un token que no existe no se distingue de uno inválido: la página no debe
  // revelar si el enlace llegó a existir.
  await page.goto("/cita/00000000-0000-4000-8000-000000000999");
  await expect(
    page.getByRole("heading", { name: "Enlace no válido" }),
  ).toBeVisible();
});

test("no expone ningún dato del paciente", async ({ page }) => {
  await page.goto(`/cita/${CANCELLED}`);

  const body = await page.locator("body").innerText();

  // La página no muestra ningún dato del paciente. El seed lo llama "E2E
  // Paciente Base", así que ni la palabra "Paciente" debe aparecer — el único
  // nombre propio en pantalla es el de la clínica y el del profesional.
  expect(body).not.toContain("Paciente");
  expect(body).not.toContain("E2E Tratamiento Facial");
});
