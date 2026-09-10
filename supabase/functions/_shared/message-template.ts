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
