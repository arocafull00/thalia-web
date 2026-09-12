/**
 * Sustitución de variables en las plantillas de mensajes de WhatsApp.
 *
 * Vive aquí y no dentro de la función para poder probarla: `index.ts` llama a
 * `Deno.serve` al importarse, así que no se puede cargar desde un test.
 *
 * `replaceAll` y no `replace`: una plantilla puede repetir una variable —el
 * nombre del paciente al saludar y al despedirse—, y con `replace` sólo se
 * sustituiría la primera, dejando un `{paciente}` a la vista del paciente.
 */
export function buildMessage(
  template: string,
  vars: Record<string, string>,
): string {
  return Object.entries(vars).reduce(
    (message, [key, value]) => message.replaceAll(`{${key}}`, value),
    template,
  );
}

/**
 * Quita la frase que contiene un hueco cuando no hay valor para él.
 *
 * Sustituirlo por cadena vacía deja la frase coja: el paciente recibía
 * «Confirma la cita pinchando en este enlace:» y nada detrás. Peor que no
 * mencionarlo, porque parece que el mensaje se cortó.
 *
 * Si TODAS las frases contienen el hueco, se deja la plantilla sin él: mandar
 * un mensaje vacío sería peor que una frase coja.
 */
export function dropSentenceWith(
  template: string,
  placeholder: string,
): string {
  if (!template.includes(placeholder)) return template;

  const frases = template.split(/(?<=[.!?])\s+/);
  const restantes = frases.filter((frase) => !frase.includes(placeholder));

  if (restantes.length === 0) {
    return template.replaceAll(placeholder, "").replace(/\s+/g, " ").trim();
  }

  return restantes.join(" ").trim();
}
