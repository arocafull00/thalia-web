import { describe, expect, it } from "vitest";

import {
  buildMessage,
  dropSentenceWith,
} from "../../../supabase/functions/_shared/message-template";

const DEFAULT_TEMPLATE =
  "Hola {paciente}, te recordamos tu cita en {clinica} el {fecha} a las {hora} con {profesional}.";

const WITH_LINK = `${DEFAULT_TEMPLATE} Confírmala aquí: {enlace}`;

const VARS = {
  paciente: "Ana",
  clinica: "Clínica Thalia",
  fecha: "martes, 15 de julio",
  hora: "11:00",
  profesional: "Marta",
};

/*
 * El recordatorio y la confirmación son el mismo mensaje (#87): el enlace se
 * incrusta en la plantilla del recordatorio. Lo que se prueba aquí es que nunca
 * llegue al paciente un hueco sin sustituir.
 */
describe("plantilla del recordatorio", () => {
  it("sustituye todas las variables, enlace incluido", () => {
    const message = buildMessage(WITH_LINK, {
      ...VARS,
      enlace: "https://app.thalia.es/cita/abc",
    });

    expect(message).toContain("https://app.thalia.es/cita/abc");
    expect(message).not.toMatch(/\{[a-z]+\}/);
  });

  it("no deja el hueco a la vista cuando no hay enlace", () => {
    // Si no se pudo generar el token, la función pasa cadena vacía. Mandar la
    // palabra "{enlace}" en mitad del texto sería peor que no ofrecer botón.
    const message = buildMessage(WITH_LINK, { ...VARS, enlace: "" });

    expect(message).not.toContain("{enlace}");
    expect(message).toContain("Hola Ana");
  });

  it("sustituye una variable repetida en toda la plantilla", () => {
    const message = buildMessage("Hola {paciente}. Hasta pronto, {paciente}.", {
      paciente: "Ana",
    });

    expect(message).toBe("Hola Ana. Hasta pronto, Ana.");
  });

  it("deja intacta una plantilla sin variables", () => {
    expect(buildMessage("Texto fijo", VARS)).toBe("Texto fijo");
  });
});

/*
 * Cuando no hay enlace que poner, el paciente recibía «Confirma la cita
 * pinchando en este enlace:» y nada detrás: parecía un mensaje cortado.
 */
describe("plantilla sin enlace disponible", () => {
  it("retira la frase que menciona el enlace y deja el recordatorio intacto", () => {
    const resultado = dropSentenceWith(WITH_LINK, "{enlace}");

    expect(resultado).toBe(DEFAULT_TEMPLATE);
    expect(resultado).not.toContain("Confírmala aquí");
  });

  it("deja la plantilla igual si no menciona el enlace", () => {
    expect(dropSentenceWith(DEFAULT_TEMPLATE, "{enlace}")).toBe(
      DEFAULT_TEMPLATE,
    );
  });

  it("no devuelve un mensaje vacío cuando todo el texto es la frase del enlace", () => {
    // Mandar nada sería peor que mandar una frase coja.
    const resultado = dropSentenceWith("Confírmala aquí: {enlace}", "{enlace}");

    expect(resultado).toBe("Confírmala aquí:");
  });

  it("respeta signos de exclamación e interrogación como fin de frase", () => {
    const resultado = dropSentenceWith(
      "¡Hola Ana! ¿Confirmas aquí? {enlace}",
      "{enlace}",
    );

    expect(resultado).toBe("¡Hola Ana! ¿Confirmas aquí?");
  });
});
