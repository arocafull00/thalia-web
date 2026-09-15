export type TermsSection = {
  id: string;
  number: number;
  title: string;
  body: string;
};

type TermsCopy = {
  title: string;
  updatedAt: string;
  sections: TermsSection[];
  complementary: {
    id: string;
    title: string;
    body: string;
  };
};

export const TERMS_COPY = {
  title: "Términos y Condiciones de Thalia",
  updatedAt: "14 de septiembre de 2026",
  sections: [
    {
      id: "identificacion-del-prestador",
      number: 1,
      title: "Identificación del prestador",
      body: "Los presentes Términos y Condiciones regulan la contratación, acceso y utilización de **Thalia**, una plataforma online de gestión destinada a clínicas, centros sanitarios y profesionales sanitarios.\n\nEl servicio es prestado por:\n\n**Titular:** Adrian Rocafull Berbel\n**NIF:** 53882287A\n**Domicilio:** Avenida Rey Juan Carlos I, n.º 12, 46900 Torrent, Valencia, España\n**Correo electrónico:** [thalia.clinic.app@outlook.com](mailto:thalia.clinic.app@outlook.com)\n**Sitio web:** https://thalia-app.es\n\nEn adelante, el prestador del servicio será denominado **“Thalia”**.\n\nThalia se comercializa como un servicio de software en modalidad SaaS (Software as a Service) dirigido exclusivamente a profesionales, empresarios, clínicas, centros sanitarios y otras organizaciones que actúen en el marco de su actividad profesional o empresarial.\n\nThalia no está dirigido a consumidores ni a pacientes como usuarios finales del servicio.",
    },
    {
      id: "objeto-y-aceptacion",
      number: 2,
      title: "Objeto y aceptación",
      body: "Estos Términos regulan las condiciones conforme a las cuales el cliente puede contratar, acceder y utilizar Thalia.\n\nA efectos de estos Términos, se entenderá por **“Cliente”** la persona física o jurídica que contrata Thalia para utilizarlo dentro de su actividad profesional o empresarial.\n\nAl crear una cuenta, iniciar un periodo de prueba, contratar una suscripción o utilizar Thalia, el Cliente declara que:\n\n* ha leído y acepta estos Términos;\n* tiene capacidad legal suficiente para contratar;\n* actúa en nombre propio o dispone de autorización suficiente para representar a la clínica, centro o entidad correspondiente;\n* utilizará Thalia exclusivamente en el marco de su actividad profesional o empresarial; y\n* facilitará información veraz y actualizada durante el proceso de contratación y utilización del servicio.\n\nCuando una persona contrate Thalia en representación de una sociedad, clínica u otra organización, declara disponer de facultades suficientes para vincular a dicha organización.",
    },
    {
      id: "descripcion-del-servicio",
      number: 3,
      title: "Descripción del servicio",
      body: "Thalia es una plataforma online destinada a facilitar la gestión administrativa, operativa y asistencial de clínicas y profesionales sanitarios.\n\nSegún las funcionalidades disponibles en cada momento, Thalia puede permitir, entre otras funciones:\n\n* crear y gestionar fichas de pacientes;\n* almacenar datos identificativos y de contacto;\n* gestionar agendas, citas y calendarios;\n* asignar citas a profesionales;\n* registrar información e historial clínico;\n* registrar tratamientos y su evolución;\n* almacenar documentos, consentimientos e imágenes relacionados con pacientes;\n* registrar importes e información económica relacionada con pacientes o tratamientos;\n* gestionar usuarios, empleados, roles y permisos;\n* gestionar determinadas preferencias y consentimientos registrados por la clínica;\n* enviar recordatorios de citas mediante WhatsApp;\n* permitir comunicaciones promocionales cuando la clínica disponga de la legitimación correspondiente;\n* consultar información administrativa y estadísticas disponibles en la plataforma;\n* importar determinados datos procedentes de otros sistemas; y\n* utilizar otras herramientas relacionadas con la gestión de la clínica que Thalia incorpore en el futuro.\n\nThalia **no presta servicios sanitarios**, no realiza diagnósticos, no prescribe tratamientos y no sustituye el conocimiento, valoración o criterio de un profesional sanitario.\n\nLa responsabilidad sobre las decisiones clínicas y asistenciales corresponde exclusivamente al profesional o entidad sanitaria que presta la asistencia al paciente.\n\nThalia no procesa pagos de pacientes ni actúa como entidad de pago. Las funcionalidades económicas actualmente disponibles se limitan al registro y gestión interna de importes y otra información económica introducida por el Cliente.",
    },
    {
      id: "evolucion-de-la-plataforma",
      number: 4,
      title: "Evolución de la plataforma",
      body: "Thalia es un servicio de software en evolución.\n\nThalia podrá corregir, actualizar, mejorar, sustituir o modificar funcionalidades de la plataforma por motivos técnicos, legales, de seguridad, mantenimiento o desarrollo del producto.\n\nAsimismo, podrá incorporar nuevas funcionalidades.\n\nCuando una modificación afecte de manera sustancial a una funcionalidad esencial incluida en la suscripción contratada, Thalia procurará informar al Cliente con una antelación razonable cuando resulte posible.\n\nLa mera modificación de elementos de interfaz, mejoras técnicas, reorganización de funcionalidades o incorporación de nuevas prestaciones no constituirá por sí misma un incumplimiento contractual.",
    },
    {
      id: "registro-y-cuentas",
      number: 5,
      title: "Registro y cuentas",
      body: "Para utilizar Thalia será necesario crear una cuenta.\n\nCada usuario deberá utilizar sus propias credenciales de acceso.\n\nLas cuentas son personales y no deberán compartirse entre diferentes personas.\n\nLa persona que cree o administre inicialmente la cuenta de una clínica podrá disponer de facultades para:\n\n* configurar la organización;\n* invitar a otros usuarios;\n* crear o gestionar empleados;\n* asignar roles;\n* configurar permisos; y\n* administrar determinadas funcionalidades de la cuenta.\n\nEl Cliente es responsable de determinar qué personas pueden acceder a su organización y qué permisos debe tener cada una.\n\nEl Cliente deberá retirar o modificar los permisos cuando un trabajador, colaborador o profesional deje de necesitar acceso a la plataforma.",
    },
    {
      id: "seguridad-de-las-credenciales",
      number: 6,
      title: "Seguridad de las credenciales",
      body: "El Cliente y sus usuarios deberán:\n\n* mantener confidenciales sus credenciales;\n* utilizar contraseñas suficientemente seguras;\n* evitar compartir cuentas;\n* proteger los dispositivos utilizados para acceder a Thalia;\n* cerrar o proteger las sesiones cuando resulte necesario; y\n* comunicar a Thalia cualquier sospecha de acceso no autorizado.\n\nEl Cliente será responsable de las acciones realizadas mediante las cuentas de sus usuarios autorizados, sin perjuicio de las responsabilidades que legalmente correspondan a Thalia.\n\nThalia podrá bloquear o limitar temporalmente una cuenta cuando existan indicios razonables de:\n\n* acceso no autorizado;\n* suplantación de identidad;\n* uso abusivo;\n* compromiso de credenciales;\n* actividad potencialmente ilícita; o\n* riesgo para la seguridad de la plataforma, otros clientes o terceros.",
    },
    {
      id: "obligaciones-del-cliente",
      number: 7,
      title: "Obligaciones del Cliente",
      body: "El Cliente se compromete a utilizar Thalia conforme a la legislación aplicable, estos Términos y las obligaciones profesionales que le correspondan.\n\nEn particular, corresponde al Cliente:\n\n* determinar qué datos personales incorpora a Thalia;\n* disponer de una base jurídica válida para tratar dichos datos;\n* cumplir sus obligaciones como responsable del tratamiento;\n* proporcionar a los pacientes la información legalmente exigible;\n* gestionar adecuadamente los consentimientos cuando estos resulten necesarios;\n* garantizar que las personas que acceden a información clínica están autorizadas;\n* configurar adecuadamente los usuarios, roles y permisos;\n* mantener razonablemente actualizados los datos introducidos;\n* cumplir las obligaciones legales aplicables a la documentación e historias clínicas;\n* utilizar correctamente las funcionalidades de la plataforma; y\n* comunicar a Thalia los incidentes relevantes relacionados con el uso de la cuenta.\n\nEl Cliente es responsable de la legalidad, exactitud y procedencia de la información que incorpora a Thalia.",
    },
    {
      id: "usos-prohibidos",
      number: 8,
      title: "Usos prohibidos",
      body: "No está permitido:\n\n* utilizar Thalia para actividades ilícitas;\n* acceder o intentar acceder a información sin autorización;\n* compartir deliberadamente credenciales entre diferentes usuarios;\n* intentar eludir las medidas de seguridad;\n* introducir malware, código malicioso o elementos destinados a perjudicar la plataforma;\n* realizar ataques, pruebas de intrusión o actuaciones que puedan afectar al servicio sin autorización;\n* realizar ingeniería inversa salvo cuando exista un derecho legal imperativo para ello;\n* copiar, revender, sublicenciar o explotar comercialmente la plataforma sin autorización;\n* utilizar Thalia vulnerando derechos de terceros; o\n* utilizar las funcionalidades de comunicación para enviar mensajes contrarios a la normativa aplicable.\n\nThalia podrá adoptar medidas razonables para impedir o detener estos usos.",
    },
    {
      id: "periodo-de-prueba-gratuito",
      number: 9,
      title: "Periodo de prueba gratuito",
      body: "Thalia ofrece inicialmente un **periodo de prueba gratuito de un mes**, salvo que durante la contratación se indique expresamente una condición diferente.\n\nPara iniciar el periodo de prueba podrá requerirse que el Cliente facilite un método de pago válido a través de Stripe.\n\n**La introducción de un método de pago no supone un cobro durante el periodo gratuito.**\n\nDurante la prueba, el Cliente podrá utilizar las funcionalidades disponibles y podrá introducir datos reales, incluidos datos de pacientes, bajo su responsabilidad como responsable del tratamiento.\n\nLas obligaciones relativas a privacidad, confidencialidad, seguridad y tratamiento de datos serán aplicables desde el momento en que el Cliente empiece a utilizar Thalia, aunque se encuentre dentro del periodo gratuito.\n\nEl Cliente podrá cancelar la suscripción en cualquier momento antes de que finalice el periodo de prueba.\n\nSi cancela antes de finalizar dicho periodo, **no se realizará el primer cobro de la suscripción**.\n\nSi el Cliente no cancela antes de que finalice el periodo gratuito, la suscripción pasará automáticamente al plan de pago correspondiente y se realizará el primer cobro conforme a las condiciones indicadas durante la contratación.",
    },
    {
      id: "precio-y-suscripcion",
      number: 10,
      title: "Precio y suscripción",
      body: "Salvo que se acuerde expresamente otra condición comercial, el precio de Thalia es de:\n\n**80 € al mes + IVA aplicable.**\n\nLa suscripción tiene periodicidad mensual.\n\nThalia no exige permanencia.\n\nLa suscripción se renovará automáticamente por periodos mensuales sucesivos mientras el Cliente no la cancele.\n\nEl precio, los impuestos aplicables y las condiciones esenciales de la suscripción deberán mostrarse al Cliente antes de confirmar la contratación.",
    },
    {
      id: "pagos-mediante-stripe",
      number: 11,
      title: "Pagos mediante Stripe",
      body: "Los pagos de la suscripción se gestionan mediante **Stripe Billing**.\n\nEl tratamiento de determinados datos relacionados con el método de pago podrá ser realizado directamente por Stripe conforme a sus propias condiciones y políticas.\n\nThalia no necesita almacenar directamente los datos completos de las tarjetas bancarias cuando estos son gestionados por Stripe.\n\nEl Cliente se compromete a mantener un método de pago válido mientras mantenga activa una suscripción de pago.\n\nCuando un cobro no pueda realizarse, Thalia podrá solicitar al Cliente que actualice su método de pago o regularice el importe pendiente.\n\nEn caso de impago, Thalia podrá limitar o suspender el acceso al servicio después de comunicar la incidencia y conceder, cuando resulte razonable, una oportunidad para regularizarla.",
    },
    {
      id: "cancelacion-de-la-suscripcion",
      number: 12,
      title: "Cancelación de la suscripción",
      body: "El Cliente podrá cancelar la renovación de su suscripción en cualquier momento.\n\nLa cancelación no producirá la terminación inmediata del periodo mensual ya abonado.\n\nEl Cliente conservará el acceso a Thalia hasta la fecha de finalización del periodo de suscripción vigente.\n\nUna vez alcanzada dicha fecha:\n\n* no se realizará una nueva renovación;\n* no se efectuará el siguiente cobro periódico; y\n* el acceso ordinario al servicio podrá quedar deshabilitado.\n\nDurante el periodo en que mantenga acceso, el Cliente deberá realizar las exportaciones de información que necesite conservar fuera de Thalia.\n\nLa cancelación de una suscripción y la eliminación definitiva de una cuenta son operaciones distintas.",
    },
    {
      id: "datos-tras-la-cancelacion-y-eliminacion-de-la-cuenta",
      number: 13,
      title: "Datos tras la cancelación y eliminación de la cuenta",
      body: "La finalización de una suscripción no implicará necesariamente la eliminación inmediata y automática de toda la información asociada a la cuenta.\n\nLa devolución, conservación, bloqueo y eliminación de datos personales se realizará conforme a:\n\n* las instrucciones legalmente válidas del Cliente;\n* el contrato de encargo del tratamiento;\n* las obligaciones legales aplicables; y\n* las posibilidades y procedimientos técnicos habilitados por Thalia en cada momento.\n\nCuando proceda la eliminación definitiva de datos tratados por cuenta del Cliente, Thalia deberá actuar conforme a las obligaciones establecidas en la normativa de protección de datos y en el correspondiente contrato de encargo del tratamiento.\n\nEl Cliente deberá asegurarse de exportar la información que legalmente deba conservar antes de solicitar la eliminación definitiva de su cuenta.\n\nLa eliminación de información podrá estar sujeta a los periodos técnicos razonablemente necesarios para su eliminación de sistemas de respaldo, cuando corresponda, sin perjuicio de las obligaciones legales aplicables.",
    },
    {
      id: "migracion-inicial-de-datos",
      number: 14,
      title: "Migración inicial de datos",
      body: "Thalia podrá ofrecer al Cliente un servicio gratuito de migración inicial de datos.\n\nLa migración incluida estará prevista principalmente para información proporcionada mediante archivos **Excel o CSV**.\n\nLa migración desde otros programas, formatos, bases de datos o sistemas estará sujeta a una evaluación previa de compatibilidad y viabilidad técnica.\n\nThalia no garantiza que cualquier formato o software de terceros pueda migrarse automáticamente.\n\nEl Cliente deberá:\n\n* disponer de derecho y legitimación suficientes para facilitar los datos;\n* proporcionar los archivos en los formatos solicitados;\n* comprobar razonablemente la integridad de los datos de origen;\n* conservar, cuando resulte conveniente o legalmente necesario, una copia de seguridad del sistema de origen; y\n* revisar los datos migrados antes de utilizarlos como fuente definitiva.\n\nThalia procurará realizar correctamente la migración, pero no será responsable de errores, inconsistencias, duplicados, omisiones o datos corruptos que ya estuvieran presentes en los archivos o sistemas proporcionados por el Cliente.\n\nCuando existan incompatibilidades técnicas, Thalia podrá solicitar al Cliente información adicional o comunicar qué información no puede ser migrada.",
    },
    {
      id: "recordatorios-mediante-whatsapp",
      number: 15,
      title: "Recordatorios mediante WhatsApp",
      body: "Thalia permite a las clínicas utilizar funcionalidades de comunicación mediante WhatsApp.\n\nEntre ellas podrá encontrarse el envío de recordatorios con información similar a:\n\n“Hola [paciente], te recordamos tu cita en [clínica] el [fecha] a las [hora] con [profesional].”\n\nEl Cliente determina:\n\n* qué pacientes reciben comunicaciones;\n* qué finalidad tiene cada comunicación;\n* cuándo se envía;\n* qué información contiene; y\n* qué base jurídica permite realizar el envío.\n\nThalia proporciona la infraestructura tecnológica para facilitar dichas comunicaciones, pero corresponde al Cliente asegurarse de que su utilización cumple la normativa aplicable.\n\nPara prestar esta funcionalidad podrán intervenir proveedores tecnológicos como **Twilio y WhatsApp/Meta**, conforme a la arquitectura y configuración del servicio.",
    },
    {
      id: "comunicaciones-comerciales-y-consentimientos",
      number: 16,
      title: "Comunicaciones comerciales y consentimientos",
      body: "Thalia puede permitir que el Cliente registre de forma separada determinadas preferencias o consentimientos de los pacientes.\n\nEn particular, podrán diferenciarse los permisos relacionados con:\n\n* recordatorios o comunicaciones relacionadas con citas; y\n* ofertas, promociones u otras comunicaciones comerciales.\n\nLa disponibilidad de un campo, selector o registro de consentimiento dentro de Thalia no determina por sí misma que exista una base jurídica válida para realizar una determinada comunicación.\n\nCorresponde al Cliente determinar cuándo necesita consentimiento y obtenerlo de forma válida cuando resulte exigible.\n\nAsimismo, corresponde al Cliente gestionar las revocaciones, oposiciones y demás solicitudes de sus pacientes.\n\nCuando Thalia almacene evidencias o registros relacionados con estos permisos, lo hará como parte del servicio prestado al Cliente.",
    },
    {
      id: "proteccion-de-datos-personales",
      number: 17,
      title: "Protección de datos personales",
      body: "El uso de Thalia puede implicar el tratamiento de datos personales y, en particular, **datos relativos a la salud**, considerados categorías especiales de datos personales.\n\nRespecto de los datos de pacientes y demás datos personales que el Cliente incorpore a Thalia para gestionar su actividad:\n\n**el Cliente actúa, con carácter general, como responsable del tratamiento y Thalia actúa como encargado del tratamiento.**\n\nEl Cliente determina las finalidades y bases jurídicas del tratamiento y es responsable de cumplir las obligaciones que le correspondan como responsable.\n\nLa relación entre Thalia y el Cliente respecto del tratamiento de estos datos deberá quedar regulada mediante el correspondiente **contrato de encargo del tratamiento**, de conformidad con el artículo 28 del Reglamento (UE) 2016/679 (RGPD).\n\nEl contrato de encargo del tratamiento regulará, entre otras cuestiones:\n\n* objeto y duración del tratamiento;\n* naturaleza y finalidad;\n* categorías de datos;\n* categorías de interesados;\n* instrucciones del Cliente;\n* confidencialidad;\n* medidas técnicas y organizativas;\n* subencargados;\n* asistencia en el ejercicio de derechos;\n* incidentes de seguridad;\n* devolución y eliminación de datos; y\n* demás obligaciones exigibles.\n\nCuando Adrian Rocafull Berbel trate datos para gestionar su propia relación con los clientes, facturación, contratación, soporte, seguridad o cumplimiento de obligaciones legales, actuará como responsable del tratamiento en los términos establecidos en la correspondiente Política de Privacidad.",
    },
    {
      id: "proveedores-tecnologicos-y-subencargados",
      number: 18,
      title: "Proveedores tecnológicos y subencargados",
      body: "Para prestar Thalia pueden intervenir proveedores tecnológicos externos.\n\nActualmente, la infraestructura del servicio puede incluir, entre otros:\n\n* **Supabase**, para infraestructura de base de datos, autenticación y almacenamiento;\n* **Twilio**, para funcionalidades relacionadas con comunicaciones mediante WhatsApp;\n* **Stripe**, para la gestión de la facturación y pagos de las suscripciones;\n* **Resend**, como infraestructura utilizada para determinados envíos de correo electrónico; y\n* **Sentry**, para monitorización técnica, diagnóstico de errores y rendimiento.\n\nCuando alguno de estos proveedores trate datos personales por cuenta de Thalia en el marco del servicio prestado al Cliente, su intervención se gestionará conforme a las obligaciones aplicables en materia de protección de datos y subencargo.\n\nLa lista de proveedores podrá modificarse cuando resulte necesario para prestar, mantener o mejorar el servicio.\n\nCuando la normativa aplicable lo exija, se informará al Cliente de las modificaciones relativas a subencargados y se aplicarán las garantías correspondientes.",
    },
    {
      id: "alojamiento-de-datos",
      number: 19,
      title: "Alojamiento de datos",
      body: "La infraestructura principal de base de datos y almacenamiento de Thalia utiliza actualmente Supabase.\n\nEl proyecto principal está configurado en la región **eu-west-1 (Irlanda)**.\n\nLa utilización de proveedores internacionales podrá implicar que determinados tratamientos auxiliares o accesos técnicos estén sujetos a las condiciones y garantías aplicables de dichos proveedores.\n\nCuando exista una transferencia internacional de datos personales, Thalia aplicará o exigirá las garantías requeridas por la normativa de protección de datos aplicable.",
    },
    {
      id: "confidencialidad",
      number: 20,
      title: "Confidencialidad",
      body: "Thalia mantendrá confidencial la información del Cliente y los datos tratados durante la prestación del servicio.\n\nEl acceso a dicha información se limitará a las personas y proveedores que necesiten acceder a ella para:\n\n* prestar el servicio;\n* mantener la infraestructura;\n* resolver incidencias;\n* prestar soporte;\n* proteger la seguridad; o\n* cumplir obligaciones legales.\n\nLas personas autorizadas para tratar datos personales estarán sujetas a las correspondientes obligaciones de confidencialidad.\n\nEl Cliente deberá aplicar igualmente las obligaciones de confidencialidad correspondientes a sus trabajadores, colaboradores y usuarios.",
    },
    {
      id: "seguridad",
      number: 21,
      title: "Seguridad",
      body: "Thalia aplicará medidas técnicas y organizativas destinadas a proteger los datos frente a accesos no autorizados, pérdida, alteración, divulgación o destrucción accidental o ilícita, teniendo en cuenta la naturaleza del servicio y los riesgos asociados al tratamiento.\n\nNo obstante, ningún servicio conectado a Internet puede garantizar una seguridad absoluta.\n\nEl Cliente deberá colaborar en la seguridad del servicio mediante:\n\n* una adecuada gestión de usuarios;\n* contraseñas seguras;\n* retirada de accesos innecesarios;\n* protección de dispositivos;\n* correcta asignación de permisos; y\n* comunicación diligente de incidentes o accesos sospechosos.\n\nLas medidas técnicas y organizativas aplicables al tratamiento de datos por cuenta del Cliente se desarrollarán con mayor detalle en el contrato de encargo del tratamiento.",
    },
    {
      id: "copias-de-seguridad-y-recuperacion",
      number: 22,
      title: "Copias de seguridad y recuperación",
      body: "La infraestructura utilizada por Thalia puede disponer de mecanismos de respaldo y recuperación proporcionados por sus proveedores tecnológicos.\n\nLa existencia, frecuencia, alcance y retención de dichos mecanismos puede depender del proveedor y del plan de infraestructura contratado.\n\nSalvo que se acuerde expresamente por escrito, Thalia no ofrece al Cliente un servicio independiente de backup ni garantiza un objetivo específico de punto o tiempo de recuperación.\n\nEl Cliente deberá conservar las copias o exportaciones que resulten necesarias para cumplir sus propias obligaciones legales o profesionales cuando corresponda.",
    },
    {
      id: "datos-y-contenidos-del-cliente",
      number: 23,
      title: "Datos y contenidos del Cliente",
      body: "El Cliente conserva los derechos que le correspondan sobre los datos, documentos, imágenes e información que introduce en Thalia.\n\nLa contratación del servicio no transmite a Thalia la propiedad de los datos de pacientes.\n\nEl Cliente autoriza a Thalia a tratar dicha información exclusivamente en la medida necesaria para:\n\n* prestar las funcionalidades contratadas;\n* alojar y procesar la información;\n* mantener y proteger la plataforma;\n* realizar las operaciones técnicas necesarias;\n* prestar soporte;\n* gestionar incidencias;\n* cumplir instrucciones válidas del Cliente; y\n* cumplir obligaciones legales.\n\nThalia no podrá utilizar los datos de pacientes para finalidades propias incompatibles con la prestación del servicio.",
    },
    {
      id: "propiedad-intelectual-de-thalia",
      number: 24,
      title: "Propiedad intelectual de Thalia",
      body: "El software, código, estructura, diseño, interfaz, documentación, elementos gráficos, contenidos propios, nombre comercial y demás elementos de Thalia pertenecen a Adrian Rocafull Berbel o se utilizan con las correspondientes autorizaciones o licencias.\n\nLa contratación de Thalia no transmite al Cliente ningún derecho de propiedad sobre la plataforma.\n\nDurante la vigencia de la suscripción, el Cliente recibe un derecho limitado, no exclusivo, no transferible y destinado exclusivamente al uso profesional interno de Thalia conforme a estos Términos.\n\nSalvo autorización expresa o derecho reconocido imperativamente por la legislación aplicable, el Cliente no podrá:\n\n* copiar o reproducir sustancialmente la plataforma;\n* distribuirla;\n* sublicenciarla;\n* revenderla;\n* explotar comercialmente su código o funcionamiento;\n* crear servicios derivados basados sustancialmente en ella; o\n* realizar ingeniería inversa.",
    },
    {
      id: "disponibilidad-mantenimiento-y-soporte",
      number: 25,
      title: "Disponibilidad, mantenimiento y soporte",
      body: "Thalia procurará mantener la plataforma operativa y resolver las incidencias dentro de plazos razonables atendiendo a su naturaleza y gravedad.\n\nSin embargo, **Thalia no ofrece actualmente un SLA ni garantiza un porcentaje específico de disponibilidad**.\n\nEl servicio puede sufrir interrupciones temporales debido a:\n\n* mantenimiento;\n* actualizaciones;\n* corrección de errores;\n* cambios de infraestructura;\n* incidencias de proveedores;\n* problemas de conectividad;\n* circunstancias de fuerza mayor; o\n* actuaciones necesarias para proteger la seguridad.\n\nCuando resulte razonablemente posible, Thalia procurará reducir el impacto de las interrupciones programadas.\n\nThalia ofrecerá soporte razonable relacionado con la utilización y funcionamiento de la plataforma a través de los canales habilitados en cada momento.",
    },
    {
      id: "servicios-de-terceros",
      number: 26,
      title: "Servicios de terceros",
      body: "Determinadas funcionalidades de Thalia dependen de proveedores externos.\n\nEntre ellos pueden encontrarse servicios de alojamiento, bases de datos, almacenamiento, correo electrónico, mensajería, monitorización y procesamiento de pagos.\n\nThalia no controla completamente la infraestructura o disponibilidad de dichos terceros.\n\nCuando una incidencia sea directamente atribuible a un proveedor externo, Thalia procurará realizar las actuaciones razonables que estén a su alcance para gestionar o mitigar el problema, sin poder garantizar la resolución de circunstancias fuera de su control.",
    },
    {
      id: "responsabilidad-del-cliente-sobre-la-actividad-sanitaria",
      number: 27,
      title: "Responsabilidad del Cliente sobre la actividad sanitaria",
      body: "Thalia es una herramienta tecnológica de gestión.\n\nEl Cliente y los profesionales sanitarios que utilizan la plataforma mantienen íntegramente la responsabilidad sobre:\n\n* diagnósticos;\n* tratamientos;\n* decisiones clínicas;\n* prescripciones;\n* consentimientos informados sanitarios;\n* información proporcionada a pacientes;\n* conservación legal de documentación clínica;\n* cumplimiento de obligaciones profesionales; y\n* cualquier otra actuación sanitaria.\n\nLa existencia de información almacenada o presentada en Thalia no sustituye la comprobación y valoración del profesional sanitario.",
    },
    {
      id: "responsabilidad-de-thalia",
      number: 28,
      title: "Responsabilidad de Thalia",
      body: "Thalia responderá de los daños directos que legalmente le sean imputables conforme a la normativa aplicable.\n\nEn la medida permitida por la ley, Thalia no será responsable de daños derivados directamente de:\n\n* utilización de la plataforma contraria a estos Términos;\n* actuaciones realizadas por usuarios autorizados del Cliente;\n* permisos configurados incorrectamente por el Cliente;\n* información incorrecta introducida por el Cliente;\n* incumplimientos sanitarios o profesionales del Cliente;\n* decisiones clínicas adoptadas por profesionales sanitarios;\n* dispositivos o redes bajo control del Cliente;\n* servicios de terceros fuera del control razonable de Thalia; o\n* circunstancias de fuerza mayor.\n\nEn la medida permitida por la legislación aplicable, se excluye la responsabilidad por daños indirectos, pérdida de oportunidades comerciales o lucro cesante cuando dicha exclusión resulte legalmente válida.\n\nSalvo en los supuestos en los que la responsabilidad no pueda limitarse legalmente, la responsabilidad contractual total de Thalia derivada de un mismo hecho o conjunto de hechos relacionados quedará limitada al importe efectivamente abonado por el Cliente a Thalia durante los **doce meses anteriores** al hecho que origine la reclamación.\n\nEsta limitación no será aplicable cuando resulte incompatible con una norma imperativa ni, en particular, cuando legalmente corresponda responsabilidad por dolo u otros supuestos que no puedan ser objeto de exclusión o limitación.",
    },
    {
      id: "suspension-del-servicio",
      number: 29,
      title: "Suspensión del servicio",
      body: "Thalia podrá suspender total o parcialmente el acceso cuando resulte razonablemente necesario debido a:\n\n* impago;\n* incumplimiento grave de estos Términos;\n* utilización ilícita;\n* riesgo para la seguridad;\n* compromiso de una cuenta;\n* ataques o abuso de infraestructura;\n* requerimiento de una autoridad competente; o\n* necesidad urgente de proteger datos, usuarios o sistemas.\n\nCuando las circunstancias lo permitan, Thalia comunicará previamente la situación al Cliente y le concederá una oportunidad razonable para subsanar el incumplimiento.\n\nEn situaciones urgentes de seguridad, Thalia podrá adoptar medidas inmediatas.",
    },
    {
      id: "terminacion-por-incumplimiento",
      number: 30,
      title: "Terminación por incumplimiento",
      body: "Thalia podrá resolver la relación contractual cuando el Cliente incurra en un incumplimiento grave o reiterado de estos Términos y no lo subsane después de haber sido requerido cuando la subsanación resulte posible.\n\nEl Cliente podrá resolver la relación mediante la cancelación de su suscripción conforme al procedimiento disponible.\n\nLa terminación contractual no afectará a las obligaciones que, por su naturaleza, deban mantenerse posteriormente, incluyendo las relativas a confidencialidad, protección de datos, propiedad intelectual y responsabilidades pendientes.",
    },
    {
      id: "cambios-de-precio",
      number: 31,
      title: "Cambios de precio",
      body: "Thalia podrá modificar el precio de la suscripción en el futuro.\n\nLos cambios de precio no se aplicarán retroactivamente a periodos ya abonados.\n\nCuando una modificación afecte a una suscripción activa, Thalia informará al Cliente con antelación razonable antes de aplicar el nuevo precio a una renovación posterior.\n\nEl Cliente podrá cancelar la renovación antes de la entrada en vigor del nuevo precio si no desea continuar utilizando el servicio bajo las nuevas condiciones.",
    },
    {
      id: "modificacion-de-estos-terminos",
      number: 32,
      title: "Modificación de estos Términos",
      body: "Thalia podrá actualizar estos Términos cuando resulte necesario debido a:\n\n* cambios normativos;\n* nuevas funcionalidades;\n* modificaciones técnicas;\n* cambios en proveedores o infraestructura;\n* necesidades de seguridad; o\n* cambios en el modelo de prestación del servicio.\n\nLa versión vigente estará disponible a través de los canales correspondientes de Thalia e indicará su fecha de actualización.\n\nCuando una modificación sea relevante para los derechos u obligaciones contractuales del Cliente, Thalia procurará comunicarla con antelación razonable.\n\nCuando resulte necesario por la naturaleza del cambio, podrá solicitarse una nueva aceptación.",
    },
    {
      id: "comunicaciones-entre-las-partes",
      number: 33,
      title: "Comunicaciones entre las partes",
      body: "Las comunicaciones relacionadas con la relación contractual podrán realizarse por medios electrónicos.\n\nEl Cliente deberá mantener actualizado el correo electrónico asociado a su cuenta.\n\nLas comunicaciones enviadas a dicha dirección se considerarán dirigidas al Cliente a efectos de la gestión ordinaria de la relación contractual, sin perjuicio de los requisitos específicos que legalmente puedan resultar aplicables a determinadas comunicaciones.",
    },
    {
      id: "legislacion-aplicable",
      number: 34,
      title: "Legislación aplicable",
      body: "Estos Términos se regirán e interpretarán conforme a la **legislación española**.\n\nEn materia de protección de datos serán de aplicación, entre otras normas que correspondan:\n\n* el Reglamento (UE) 2016/679, Reglamento General de Protección de Datos (RGPD); y\n* la Ley Orgánica 3/2018, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).\n\nAsimismo, resultará aplicable la normativa española correspondiente a los servicios de la sociedad de la información y, cuando proceda por la naturaleza de los datos y actividad desarrollada por el Cliente, la normativa sanitaria aplicable.",
    },
    {
      id: "resolucion-de-controversias-y-jurisdiccion",
      number: 35,
      title: "Resolución de controversias y jurisdicción",
      body: "Ante cualquier controversia relacionada con estos Términos, las partes procurarán inicialmente alcanzar una solución amistosa.\n\nCuando no sea posible resolver la controversia mediante negociación y siempre que no exista una norma imperativa que determine otra competencia territorial, las partes acuerdan someterse a los **Juzgados y Tribunales de Valencia, España**.\n\nEsta cláusula se establece teniendo en cuenta que Thalia se ofrece como servicio B2B dirigido a profesionales y empresas y no como servicio destinado a consumidores.",
    },
    {
      id: "nulidad-parcial",
      number: 36,
      title: "Nulidad parcial",
      body: "Si alguna disposición de estos Términos fuese declarada inválida, nula o inaplicable, dicha circunstancia no afectará necesariamente a la validez de las restantes disposiciones.\n\nCuando resulte posible, la disposición afectada se interpretará o sustituirá de la forma que mejor preserve su finalidad dentro de los límites permitidos por la legislación aplicable.",
    },
    {
      id: "integridad-contractual",
      number: 37,
      title: "Integridad contractual",
      body: "Estos Términos, junto con las condiciones de contratación mostradas al Cliente y los demás documentos contractuales que resulten aplicables, regulan la relación relativa a la utilización de Thalia.\n\nEn particular, podrán complementar estos Términos:\n\n* el contrato de encargo del tratamiento;\n* la Política de Privacidad;\n* el Aviso Legal;\n* la Política de Cookies;\n* las condiciones comerciales aceptadas durante la contratación; y\n* cualesquiera anexos expresamente acordados entre las partes.\n\nEn caso de contradicción entre estos Términos y un acuerdo específico firmado entre Thalia y un Cliente, prevalecerán las condiciones específicamente pactadas para dicho Cliente respecto de la materia objeto de contradicción.",
    },
    {
      id: "contacto",
      number: 38,
      title: "Contacto",
      body: "Para consultas relacionadas con estos Términos o con el servicio:\n\n**Titular:** Adrian Rocafull Berbel\n**NIF:** 53882287A\n**Domicilio:** Avenida Rey Juan Carlos I, n.º 12, 46900 Torrent, Valencia, España\n**Correo electrónico:** [thalia.clinic.app@outlook.com](mailto:thalia.clinic.app@outlook.com)\n**Sitio web:** https://thalia-app.es",
    },
  ],
  complementary: {
    id: "documentacion-complementaria",
    title: "Documentación complementaria",
    body: "La aceptación de estos Términos no sustituye otros documentos que puedan resultar necesarios para utilizar Thalia de forma conforme con la normativa aplicable.\n\nEn particular, antes de utilizar Thalia con datos reales de pacientes deberá formalizarse, cuando resulte aplicable, el correspondiente **contrato de encargo del tratamiento** entre Thalia y el Cliente.\n\nAsimismo, Thalia dispondrá de la correspondiente documentación relativa a privacidad, cookies e información legal del prestador.",
  },
} satisfies TermsCopy;
