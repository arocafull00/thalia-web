export type PrivacySection = {
  id: string;
  number: number;
  title: string;
  body: string;
};

type PrivacyCorporateCopy = {
  title: string;
  updatedAt: string;
  sections: PrivacySection[];
};

export const PRIVACY_CORPORATE_COPY = {
  title: "Política de privacidad de la web corporativa",
  updatedAt: "15 de septiembre de 2026",
  sections: [
    {
      id: "responsable-del-tratamiento",
      number: 1,
      title: "Responsable del tratamiento",
      body: "El responsable del tratamiento de los datos personales recogidos a través de la web corporativa de Thalia es:\n\n**Titular:** Adrian Rocafull Berbel\n**NIF:** 53882287A\n**Domicilio:** Avenida Rey Juan Carlos I, n.º 12, 46900 Torrent, Valencia, España\n**Correo electrónico:** [thalia.clinic.app@outlook.com](mailto:thalia.clinic.app@outlook.com)\n**Sitios web:** https://info.thalia-app.es y https://thalia-app.es (apartados corporativos accesibles antes del acceso a la plataforma)",
    },
    {
      id: "ambito-de-aplicacion",
      number: 2,
      title: "Ámbito de aplicación",
      body: "Esta Política de Privacidad regula el tratamiento de datos personales realizado a través de la **web corporativa** de Thalia, accesible principalmente en **info.thalia-app.es**, así como los apartados informativos y de contacto accesibles desde **thalia-app.es** antes de iniciar sesión en la plataforma.\n\nEsta política **no sustituye** la información aplicable al uso de la plataforma SaaS de gestión clínica ni al tratamiento de datos de pacientes que las clínicas incorporan a Thalia. Ese tratamiento se rige por los [Términos y Condiciones](/terms), el contrato de encargo del tratamiento y la documentación complementaria aplicable al servicio contratado.",
    },
    {
      id: "datos-que-recogemos",
      number: 3,
      title: "Datos que recogemos",
      body: "En la web corporativa podemos tratar las siguientes categorías de datos:\n\n* **Datos identificativos de contacto:** dirección de correo electrónico facilitada en el formulario de solicitud de demo o acceso anticipado.\n* **Datos de comunicación comercial:** contenido de consultas que nos envíes voluntariamente por correo electrónico o teléfono.\n* **Datos técnicos:** dirección IP, identificadores de cookies técnicas, datos de navegador y registros de acceso generados al visitar la web.\n\nNo solicitamos datos clínicos ni de pacientes a través de la web corporativa.",
    },
    {
      id: "finalidades-y-legitimacion",
      number: 4,
      title: "Finalidades y legitimación",
      body: "Tratamos tus datos para las siguientes finalidades:\n\n* **Gestionar solicitudes de demo y acceso anticipado** — cuando envías tu correo electrónico a través del formulario de la web. Base jurídica: **consentimiento** (casilla de aceptación de esta política).\n* **Atender consultas comerciales iniciadas por ti** — cuando nos contactas por teléfono o correo electrónico. Base jurídica: **interés legítimo** en responder a solicitudes B2B y **ejecución de medidas precontractuales** a petición del interesado.\n* **Garantizar la seguridad y el funcionamiento técnico de la web** — mediante cookies técnicas y registros de servidor. Base jurídica: **interés legítimo** en mantener un servicio seguro y operativo.\n* **Cumplir obligaciones legales** — cuando resulte exigible conservar o comunicar determinada información.",
    },
    {
      id: "destinatarios-y-encargados",
      number: 5,
      title: "Destinatarios y encargados",
      body: "No cedemos tus datos a terceros con fines comerciales propios. Para prestar la web corporativa podemos contar con los siguientes encargados del tratamiento:\n\n* **Supabase** — almacenamiento de solicitudes de waitlist y cookies técnicas de sesión. Región principal: **eu-west-1 (Irlanda)**.\n* **Vercel** — alojamiento y distribución de la web, con registros técnicos de acceso.\n* **Google** — suministro de fuentes tipográficas web (Google Fonts), que puede implicar el tratamiento de la dirección IP del visitante.\n\nEstos proveedores tratan los datos conforme a instrucciones del responsable y con las garantías contractuales exigibles en materia de protección de datos.",
    },
    {
      id: "transferencias-internacionales",
      number: 6,
      title: "Transferencias internacionales",
      body: "Algunos proveedores tecnológicos pueden tratar datos desde fuera del Espacio Económico Europeo, incluidos Estados Unidos.\n\nCuando exista una transferencia internacional, se aplicarán las garantías previstas en el RGPD, como cláusulas contractuales tipo aprobadas por la Comisión Europea u otros mecanismos legalmente válidos.",
    },
    {
      id: "plazos-de-conservacion",
      number: 7,
      title: "Plazos de conservación",
      body: "Conservamos los datos durante el tiempo necesario para cumplir la finalidad para la que fueron recogidos:\n\n* **Solicitudes de demo y waitlist:** hasta **24 meses** desde la última interacción comercial o hasta que solicites su supresión.\n* **Consultas comerciales por email o teléfono:** durante el tiempo necesario para gestionar la relación precontractual y, en su caso, la relación comercial.\n* **Registros técnicos y logs de seguridad:** durante los plazos habituales de retención del proveedor de hosting, generalmente limitados a los necesarios para seguridad e incidencias.\n* **Cookies técnicas:** mientras dure la sesión o el plazo configurado por el proveedor.\n\nTranscurridos dichos plazos, los datos se suprimirán o anonimizarán, salvo obligación legal de conservación.",
    },
    {
      id: "derechos",
      number: 8,
      title: "Derechos de las personas interesadas",
      body: "Puedes ejercer los siguientes derechos en relación con tus datos personales:\n\n* **Acceso** — conocer qué datos tratamos sobre ti.\n* **Rectificación** — corregir datos inexactos o incompletos.\n* **Supresión** — solicitar la eliminación de tus datos cuando proceda.\n* **Oposición** — oponerte al tratamiento basado en interés legítimo.\n* **Limitación del tratamiento** — solicitar la restricción del tratamiento en los supuestos legalmente previstos.\n* **Portabilidad** — recibir los datos que nos hayas facilitado en formato estructurado, cuando proceda.\n\nPara ejercer tus derechos, escribe a [thalia.clinic.app@outlook.com](mailto:thalia.clinic.app@outlook.com) indicando el derecho que deseas ejercer y acreditando tu identidad cuando sea necesario. Responderemos en el plazo máximo de **un mes**, prorrogable dos meses adicionales en casos complejos.\n\nTambién puedes presentar una reclamación ante la **Agencia Española de Protección de Datos** (www.aepd.es) si consideras que el tratamiento no se ajusta a la normativa.",
    },
    {
      id: "cookies",
      number: 9,
      title: "Cookies y tecnologías similares",
      body: "La web corporativa utiliza **cookies técnicas** necesarias para el funcionamiento del formulario de solicitud y la infraestructura de la página.\n\nNo utilizamos cookies analíticas, de publicidad ni de perfilado en la web corporativa.\n\nPuedes configurar tu navegador para bloquear o eliminar cookies, aunque ello puede afectar al correcto funcionamiento de determinadas funcionalidades.",
    },
    {
      id: "diferenciacion-plataforma-saas",
      number: 10,
      title: "Diferenciación respecto de la plataforma SaaS",
      body: "Thalia ofrece dos ámbitos diferenciados:\n\n* **Web corporativa** (info.thalia-app.es): información comercial, solicitud de demos y contacto. Thalia actúa como **responsable del tratamiento** de los datos recogidos en este ámbito.\n* **Plataforma SaaS** (thalia-app.es tras el acceso): software de gestión clínica. Respecto de los datos de pacientes y demás datos que la clínica incorpora a la plataforma, la clínica actúa como **responsable del tratamiento** y Thalia actúa como **encargado del tratamiento**, conforme al contrato de encargo del tratamiento.\n\nPara información sobre el tratamiento de datos en la plataforma, consulta los [Términos y Condiciones](/terms) y la documentación contractual aplicable.",
    },
    {
      id: "actualizaciones-y-contacto",
      number: 11,
      title: "Actualizaciones y contacto",
      body: "Podemos actualizar esta Política de Privacidad para reflejar cambios normativos, técnicos o en los servicios ofrecidos. La versión vigente estará disponible en esta página con indicación de la fecha de actualización.\n\nPara cualquier consulta sobre privacidad en la web corporativa:\n\n**Correo electrónico:** [thalia.clinic.app@outlook.com](mailto:thalia.clinic.app@outlook.com)\n**Titular:** Adrian Rocafull Berbel\n**NIF:** 53882287A",
    },
  ],
} satisfies PrivacyCorporateCopy;
