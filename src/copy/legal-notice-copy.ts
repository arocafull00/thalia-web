export type LegalNoticeSection = {
  id: string;
  number: number;
  title: string;
  body: string;
};

type LegalNoticeCopy = {
  title: string;
  updatedAt: string;
  sections: LegalNoticeSection[];
};

const privacyHref = "/privacidad";
const termsHref = "/terms";
const termsLink = `[Términos y Condiciones](${termsHref})`;
const privacyLink = `[Política de Privacidad](${privacyHref})`;
const privacyCookiesLink = `[Política de Privacidad](${privacyHref}#cookies)`;

export const LEGAL_NOTICE_COPY = {
  title: "Aviso legal",
  updatedAt: "23 de septiembre de 2026",
  sections: [
    {
      id: "datos-identificativos",
      number: 1,
      title: "Datos identificativos",
      body: "En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de servicios de la sociedad de la información y de comercio electrónico, se informa de los datos del prestador de https://thalia-app.es y https://info.thalia-app.es:\n\n**Titular:** Adrian Rocafull Berbel\n**NIF:** 53882287A\n**Domicilio:** Avenida Rey Juan Carlos I, n.º 12, 46900 Torrent, Valencia, España\n**Correo electrónico:** [thalia.clinic.app@outlook.com](mailto:thalia.clinic.app@outlook.com)\n**Teléfono:** [722 561 809](tel:+34722561809)\n**Teléfono alternativo:** [611 798 035](tel:+34611798035)\n**Sitios web:** https://thalia-app.es y https://info.thalia-app.es\n\nEl prestador es una persona física y se identifica con su nombre y NIF. En adelante se le denomina **Thalia**.",
    },
    {
      id: "objeto",
      number: 2,
      title: "Objeto",
      body: `Este aviso legal regula el acceso y la utilización de los sitios web de Thalia:\n\n* **https://info.thalia-app.es** — web corporativa, con información comercial, solicitud de demostración y contacto.\n* **https://thalia-app.es** — acceso a la plataforma de gestión de clínicas y a los apartados informativos publicados en ese dominio.\n\nLa navegación por estos sitios implica la aceptación de este aviso. Quien no esté de acuerdo debe abstenerse de utilizarlos.\n\nLa contratación, el acceso y el uso de la plataforma se regulan en los ${termsLink}.`,
    },
    {
      id: "condiciones-de-uso",
      number: 3,
      title: "Condiciones de uso",
      body: "Quien accede a los sitios se compromete a utilizarlos de forma lícita, de buena fe y sin lesionar derechos de Thalia o de terceros.\n\nQueda prohibido:\n\n* utilizar los sitios para actividades ilícitas o que vulneren derechos de terceros;\n* introducir malware o realizar actuaciones que puedan dañar, inutilizar o sobrecargar los sitios;\n* intentar acceder sin autorización a áreas restringidas, cuentas o sistemas; y\n* reproducir, distribuir o modificar los contenidos sin autorización, salvo cuando la ley lo permita.\n\nThalia podrá limitar el acceso o adoptar las medidas que resulten procedentes cuando detecte un uso contrario a este aviso o a la ley.",
    },
    {
      id: "propiedad-intelectual",
      number: 4,
      title: "Propiedad intelectual e industrial",
      body: "El diseño, el código, los textos, las imágenes, las marcas, los logotipos y los demás contenidos de los sitios son titularidad de Adrian Rocafull Berbel o de sus licenciantes, y están protegidos por la normativa de propiedad intelectual e industrial.\n\nEl acceso no concede ninguna licencia distinta de la necesaria para consultar los sitios. Cualquier uso no autorizado puede constituir una infracción.",
    },
    {
      id: "responsabilidad",
      number: 5,
      title: "Responsabilidad",
      body: `Thalia procura que la información publicada sea exacta y esté actualizada, pero no garantiza la ausencia de errores ni la disponibilidad ininterrumpida de los sitios.\n\nThalia no responde de los daños derivados de interrupciones o errores técnicos ajenos a su control razonable, del uso que se haga de la información publicada, de contenidos de terceros accesibles mediante enlaces, ni de hechos de fuerza mayor.\n\nLa plataforma es una herramienta de gestión. No presta servicios sanitarios ni sustituye el criterio del profesional. Las condiciones de responsabilidad del servicio contratado se detallan en los ${termsLink}.`,
    },
    {
      id: "enlaces",
      number: 6,
      title: "Enlaces",
      body: "Los sitios pueden incluir enlaces a páginas de terceros. Esos enlaces facilitan la navegación y no implican que Thalia apruebe sus contenidos ni que exista una relación con sus titulares.\n\nThalia no controla esos sitios ni responde de sus contenidos, políticas o prácticas. Quien accede a ellos lo hace bajo su responsabilidad.",
    },
    {
      id: "proteccion-de-datos",
      number: 7,
      title: "Protección de datos",
      body: `El tratamiento de los datos personales recogidos a través de la web corporativa se describe en la ${privacyLink}.\n\nRespecto de los datos de pacientes y demás datos que una clínica incorpora a la plataforma, la clínica actúa como responsable del tratamiento y Thalia como encargado, conforme al contrato de encargo del tratamiento y a los ${termsLink}.`,
    },
    {
      id: "cookies",
      number: 8,
      title: "Cookies",
      body: `Los sitios utilizan cookies técnicas necesarias para su funcionamiento y seguridad.\n\nNo se utilizan cookies analíticas, de publicidad ni de perfilado en la web corporativa.\n\nEl detalle figura en la ${privacyCookiesLink}.`,
    },
    {
      id: "precios",
      number: 9,
      title: "Precios",
      body: `Thalia es un servicio de software dirigido a profesionales y clínicas. El precio de la suscripción, los impuestos aplicables y las condiciones de pago se comunican antes de la contratación, durante la demostración y en el proceso de alta, y se recogen en los ${termsLink}.\n\nCuando se ofrezca un periodo de prueba gratuito, no se realiza el primer cobro si la suscripción se cancela antes de que termine ese periodo, conforme a lo indicado en esos términos.`,
    },
    {
      id: "legislacion-y-jurisdiccion",
      number: 10,
      title: "Legislación y jurisdicción",
      body: "Este aviso se rige por la legislación española.\n\nThalia se dirige a profesionales y empresas. No está destinado a consumidores ni a pacientes como usuarios finales del servicio.\n\nPara cualquier controversia serán competentes los juzgados y tribunales de Torrent (Valencia), salvo que una norma imperativa disponga otro fuero.",
    },
    {
      id: "contacto",
      number: 11,
      title: "Contacto",
      body: "Para cualquier cuestión relacionada con este aviso o con los sitios web:\n\n**Titular:** Adrian Rocafull Berbel\n**NIF:** 53882287A\n**Domicilio:** Avenida Rey Juan Carlos I, n.º 12, 46900 Torrent, Valencia, España\n**Correo electrónico:** [thalia.clinic.app@outlook.com](mailto:thalia.clinic.app@outlook.com)\n**Teléfono:** [722 561 809](tel:+34722561809)\n**Teléfono alternativo:** [611 798 035](tel:+34611798035)",
    },
  ],
} satisfies LegalNoticeCopy;
