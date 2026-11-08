---
id: "009"
title: "Gestión colaborativa de recetas"
status: draft
---

# Especificación: Gestión colaborativa de recetas

## Problema y objetivo

Recetaria ya dispone del esquema PostgreSQL necesario para representar recetas, autorías, ingredientes, pasos, categorías y etiquetas, pero todavía no ofrece una funcionalidad real para utilizarlos. Los accesos de creación e invitaciones del Home siguen siendo prototipos locales, no existen páginas persistentes de recetas y la aplicación aún permite eliminar una cuenta aunque sus datos deban conservarse.

El objetivo es permitir que los miembros creen, guarden, editen, publiquen y despubliquen recetas de forma colaborativa; gestionen invitaciones entre coautores; consulten perfiles públicos; y desactiven o reactiven su cuenta sin borrar información. Todo el trabajo debe preservar los datos reales de Supabase y mantener la arquitectura Laravel, Inertia y React existente.

## Alcance

### Incluido

- Una sección autenticada “Mis recetas” en `/recipes` con todos los borradores y recetas publicadas en los que el usuario sea autor.
- Un asistente mobile first para crear y editar datos generales, ingredientes, elaboración, categorías y etiquetas, coautores y revisión.
- El guardado persistente de cada etapa del asistente y la reanudación posterior de borradores.
- La detección de ediciones simultáneas para impedir que una versión antigua sobrescriba cambios más recientes.
- La publicación, edición, despublicación y republicación de recetas, sin ninguna opción para eliminarlas.
- Una página pública por identificador para cada receta publicada.
- Invitaciones de coautoría por `username`, con historial y estados `pending`, `accepted`, `rejected` y `cancelled`.
- Perfiles públicos en `/users/{username}` para cuentas activas.
- La sustitución de la eliminación de cuenta por desactivación y un flujo posterior de reactivación.
- La sustitución de los accesos ficticios del Home por navegación real a crear receta, invitaciones y perfil propio.
- Migraciones conservadoras hacia delante para añadir `users.deactivated_at` y la tabla histórica `recipe_author_invitations`.
- Datos iniciales idempotentes para unidades, categorías e ingredientes.
- La protección de la tabla nueva con RLS sin políticas y sin privilegios para los roles de la Data API de Supabase.
- Pruebas backend y frontend de las reglas, permisos, persistencia, accesibilidad y presentación responsive aprobadas.

### Fuera de alcance

- El borrado de recetas, usuarios o sus datos históricos.
- Publicaciones sociales reales, imágenes, Cloudinary y la persistencia del feed actual.
- Un explorador, buscador global o feed específico de recetas.
- Guardados, colecciones, comentarios, likes, seguimiento y administración de catálogos.
- Privilegios especiales del rol `admin` sobre recetas, perfiles o invitaciones.
- La creación de unidades o categorías desde el formulario de recetas.
- Moderación, transferencia de propiedad o jerarquías entre coautores.
- Una API separada, una SPA independiente, nuevas dependencias o cambios de plataforma.
- Migraciones destructivas, modificación de migraciones ya aplicadas o automatización de migraciones en Render.

## Actores

- Visitante: puede consultar recetas publicadas y perfiles públicos de cuentas activas, pero nunca borradores, correos ni datos privados.
- Miembro activo: puede gestionar las recetas que coautoriza, enviar y responder invitaciones, ver sus invitaciones y desactivar su cuenta.
- Coautor: tiene la misma capacidad que los demás autores de la receta para editarla, publicarla, despublicarla e invitar colaboradores.
- Usuario invitado: puede aceptar o rechazar exclusivamente las invitaciones pendientes dirigidas a su cuenta.
- Usuario desactivado: conserva sus datos y autorías, pero no puede mantener una sesión, editar contenido ni tener un perfil público hasta reactivar su cuenta.
- Administrador: se comporta como cualquier otro miembro dentro de esta funcionalidad.

## Flujos

### Consultar y reanudar las recetas propias

1. El miembro abre `/recipes`.
2. La aplicación muestra los borradores y las recetas publicadas en las que aparece en `recipe_authors`, ordenados desde la modificación más reciente y, en caso de empate, por el identificador más alto.
3. Cada elemento indica de forma comprensible si es borrador o está publicado.
4. El miembro puede abrir una receta para continuarla o editarla si sigue siendo coautor.
5. La interfaz no ofrece ninguna acción para eliminar la receta.

### Crear un borrador por etapas

1. El miembro inicia la creación desde el Home o desde “Mis recetas”.
2. En la primera etapa introduce los datos generales. El título es obligatorio y se respetan los límites y pares de campos definidos por el modelo vigente.
3. Al guardar por primera vez se crea el borrador con `published_at` nulo y se asocia al usuario actual como primer autor.
4. El miembro completa etapas para ingredientes, elaboración, categorías y etiquetas, coautores y revisión.
5. Cada etapa guarda sus datos en PostgreSQL antes de avanzar y puede reanudarse posteriormente sin perder lo ya guardado.
6. Los ingredientes y pasos conservan un orden explícito desde la posición `1`.
7. Categorías y etiquetas son opcionales.
8. En la revisión se muestran los datos persistidos y los requisitos que aún impidan publicar.

### Evitar sobrescrituras entre ediciones simultáneas

1. Al abrir una receta editable, el formulario recibe la versión representada por su `updated_at`.
2. Cada guardado presenta esa versión como referencia.
3. Si otra edición ha actualizado la receta entretanto, el guardado antiguo se rechaza completo.
4. La aplicación informa de que existen cambios más recientes y pide recargar; no mezcla ni sobrescribe silenciosamente ambas versiones.
5. Tras recargar, el usuario trabaja sobre la versión vigente.
6. Todo guardado de una etapa que cambie datos generales, ingredientes, pasos, categorías, etiquetas o autorías actualiza `recipes.updated_at`. Las operaciones sobre invitaciones son independientes y no cambian por sí solas esa versión.

### Gestionar ingredientes, cantidades y catálogos

1. El autor puede reutilizar un ingrediente existente o escribir un nombre nuevo.
2. Los nombres de ingredientes y etiquetas se recortan, se convierten a minúsculas y reutilizan la fila ya existente cuando coinciden después de normalizarlos.
3. Las unidades y categorías solo pueden elegirse entre los catálogos controlados existentes.
4. Las cantidades aceptan punto o coma decimal y se convierten a un valor numérico único antes de guardarse.
5. Una unidad solo puede indicarse cuando existe cantidad; una cantidad puede existir sin unidad.
6. Una receta no puede repetir el mismo ingrediente, categoría o etiqueta.

### Publicar, editar y despublicar

1. Cualquier coautor puede publicar una receta cuando contiene al menos un ingrediente y un paso válidos.
2. La primera publicación asigna la fecha actual a `published_at` y hace visible la receta mediante una URL pública basada en su identificador.
3. Una receta publicada puede editarse directamente y conserva su fecha de publicación.
4. Mientras siga publicada no se puede retirar su último ingrediente ni su último paso.
5. Despublicar establece `published_at` a nulo, conserva todos los datos y oculta la receta de páginas públicas, perfiles y enlaces.
6. Republicar asigna una fecha nueva y recupera su visibilidad pública.

### Invitar y responder a coautores

1. Un coautor introduce el `username` completo de la persona a invitar; no existe buscador público, autocompletado ni envío por correo.
2. El valor se normaliza como los nombres de usuario del registro antes de buscar una coincidencia exacta.
3. No se puede invitar al propio usuario, a una cuenta inexistente o desactivada, a un coautor actual ni a quien ya tenga una invitación pendiente para esa receta.
4. La invitación se guarda en `recipe_author_invitations` como `pending` con la receta, el remitente, el destinatario y su fecha de envío; la fecha de resolución permanece vacía.
5. Todos los coautores pueden consultar el historial de invitaciones de la receta. Cada destinatario solo puede consultar sus propias invitaciones recibidas, que muestran título de la receta, nombre y `username` del remitente, estado, fecha de envío y fecha de resolución cuando exista.
6. Las invitaciones recibidas pendientes aparecen antes que las resueltas; dentro de cada grupo se muestran primero las enviadas más recientemente y los empates se resuelven por el identificador más alto.
7. El destinatario puede aceptar o rechazar una invitación pendiente.
8. Aceptar cambia su estado a `accepted`, registra su fecha de resolución y solo entonces añade al destinatario a `recipe_authors`.
9. Rechazar cambia su estado a `rejected`, registra su fecha de resolución y no crea una autoría.
10. Solo el remitente puede cancelar una invitación pendiente que haya enviado; pasa a `cancelled` y registra su fecha de resolución.
11. Los estados resueltos no se reescriben. Después de un rechazo o cancelación puede enviarse una invitación nueva, que queda como otra fila del historial.

### Abandonar una coautoría

1. Un coautor puede retirarse únicamente a sí mismo de una receta.
2. No puede retirarse si es el último autor restante.
3. Al retirarse, se cancelan las invitaciones pendientes que hubiera enviado para esa receta.
4. La receta y las autorías de las demás personas permanecen intactas.

### Consultar recetas y perfiles públicos

1. Cualquier visitante puede abrir por identificador una receta publicada.
2. La página pública muestra título, descripción, cantidad resultante cuando exista, tiempos, ingredientes ordenados con sus cantidades, unidades y notas, pasos ordenados, categorías, etiquetas y autores.
3. Los autores activos se muestran con nombre y `username` enlazado a su perfil; los desactivados aparecen como texto sin enlace. No se muestran correos ni datos internos.
4. Los borradores solo son accesibles para sus coautores; ante cualquier otro usuario se comportan como contenido inexistente.
5. `/users/{username}` muestra nombre, `username`, biografía y las recetas publicadas que coautoriza una cuenta activa.
6. Las recetas del perfil se ordenan desde la publicación más reciente y, en caso de empate, por el identificador más alto.
7. El perfil nunca muestra correo, borradores ni datos privados.
8. Una receta publicada aparece en el perfil de cada coautor activo.
9. Si un autor está desactivado, la receta pública conserva su nombre de autor como texto sin enlace a un perfil.
10. Una receta publicada continúa visible aunque alguno o todos sus autores estén desactivados.
11. El perfil de una cuenta desactivada se comporta como inexistente.

### Desactivar y reactivar una cuenta

1. La edición de perfil ofrece “Desactivar cuenta” en lugar de eliminarla.
2. El usuario debe introducir correctamente su contraseña actual para confirmar.
3. La desactivación asigna `deactivated_at`, cancela todas las invitaciones pendientes enviadas o recibidas por esa cuenta y conserva usuarios, recetas, autorías e historial.
4. La sesión actual se cierra y cualquier otra sesión existente deja de dar acceso autenticado.
5. La cuenta desactivada no puede iniciar una sesión normal, editar contenido, recibir invitaciones nuevas ni mostrar un perfil público.
6. Si introduce credenciales válidas al iniciar sesión, se le ofrece confirmar la reactivación sin conceder todavía una sesión normal.
7. Al confirmar, `deactivated_at` vuelve a nulo y el usuario recupera el acceso con sus datos y autorías anteriores.
8. Una contraseña incorrecta no revela si la cuenta está activa o desactivada y conserva la limitación de intentos existente.

### Aplicar cambios a la base desplegada

1. Todos los cambios se verifican primero contra `recetaria_testing` y el PostgreSQL efímero de CI.
2. Las migraciones nuevas conservan las tablas y filas existentes; no modifican migraciones ya aplicadas.
3. Tras CI verde, el desarrollador puede autorizar por separado la aplicación manual de las migraciones hacia delante en Supabase.
4. Solo después de migrar correctamente puede autorizar por separado el seeder de catálogos.
5. Ante cualquier fallo remoto, el proceso se detiene sin rollback, reconstrucción, borrado ni reintentos automáticos.

### Casos alternativos y errores

- Un guardado inválido conserva la etapa actual, muestra errores asociados a sus campos y no deja cambios parciales.
- Un usuario que haya dejado de ser coautor no puede seguir editando mediante una pestaña antigua.
- Una invitación deja de poder aceptarse, rechazarse o cancelarse cuando ya no está pendiente.
- Dos aceptaciones o cancelaciones simultáneas no duplican autorías ni cambian dos veces el estado.
- Una cuenta que se desactive durante una colaboración pierde inmediatamente el acceso, pero no desaparece de las autorías históricas.
- Si un nombre de ingrediente o etiqueta se crea simultáneamente, se reutiliza una única fila normalizada sin duplicados.
- Si el seeder encuentra un nombre inicial ya existente, reutiliza la fila sin modificarla, incluido cualquier símbolo que ya tenga una unidad. Si una inserción encuentra otro conflicto de unicidad incompatible, aborta la operación completa sin alterar datos previos.
- Un visitante o miembro sin autorización no puede deducir la existencia de un borrador ni de un perfil desactivado a partir de la respuesta pública.

## Reglas de negocio

- `recipes.published_at IS NULL` identifica un borrador; una fecha identifica una receta publicada.
- Toda receta debe conservar al menos un autor y todos los coautores tienen la misma jerarquía.
- Todos los coautores pueden editar, publicar, despublicar e invitar; no existe propietario principal ni privilegio del rol `admin`.
- El primer guardado crea conjuntamente la receta y la autoría inicial, sin dejar una receta sin autor.
- Publicar exige al menos una fila en `recipe_ingredients` y una en `recipe_steps`.
- Una receta publicada debe conservar al menos un ingrediente y un paso.
- Editar una receta publicada no cambia `published_at`; despublicar lo deja a nulo y republicar asigna una fecha nueva.
- No existe ninguna operación para eliminar recetas.
- Cada guardado editable debe comprobar la versión `updated_at` recibida antes de aplicar cambios. Todo cambio persistido por una etapa del asistente actualiza esa versión, incluidas las asociaciones y autorías; las acciones sobre invitaciones no la actualizan por sí solas.
- Los borradores son privados para sus coautores; las recetas publicadas son públicas por identificador.
- Las categorías y etiquetas son opcionales.
- Los autores pueden crear ingredientes y etiquetas normalizados, pero no unidades ni categorías.
- Los nombres de ingredientes, etiquetas y catálogos se almacenan en minúsculas y sin espacios exteriores.
- Las cantidades positivas aceptan punto o coma en la entrada y se almacenan con el tipo decimal vigente.
- Solo puede existir una invitación `pending` por receta y destinatario; las invitaciones resueltas se conservan y permiten una invitación posterior independiente.
- `recipe_author_invitations` conserva para cada invitación su identificador, receta, remitente, destinatario, estado, fecha de envío y fecha de resolución opcional.
- La fecha de resolución es nula únicamente mientras la invitación está `pending` y es obligatoria para `accepted`, `rejected` y `cancelled`.
- Una invitación resuelta no se modifica ni se elimina.
- Solo una invitación aceptada puede crear una autoría y nunca puede duplicar una asociación existente.
- Solo el remitente cancela su invitación pendiente; solo el destinatario la acepta o rechaza.
- Cada coautor solo puede retirar su propia autoría y nunca la última de la receta.
- Desactivar una cuenta exige la contraseña actual, conserva sus datos y autorías y cancela sus invitaciones pendientes enviadas o recibidas.
- Una cuenta desactivada no puede mantener acceso autenticado; la reactivación requiere credenciales válidas y una confirmación explícita posterior.
- Los perfiles públicos solo pertenecen a cuentas activas y nunca exponen correo ni borradores.
- La autoría de una cuenta desactivada sigue apareciendo como texto en sus recetas publicadas, sin enlace público.
- Las unidades iniciales que falten se insertan sin símbolo: unidad, gramo, kilogramo, mililitro, centilitro, litro, cucharadita, cucharada, taza, pizca, diente y manojo. Una unidad preexistente con el mismo nombre se reutiliza intacta, incluido su símbolo.
- Las categorías iniciales son: desayunos; aperitivos y entrantes; ensaladas; sopas y cremas; platos principales; guarniciones; panes y masas; salsas y aderezos; postres; bebidas.
- Los ingredientes iniciales son: agua, aceite de oliva, aceite de girasol, sal, pimienta negra, azúcar, azúcar moreno, harina de trigo, harina integral, maicena, levadura química, levadura fresca, bicarbonato de sodio, mantequilla, leche, nata, yogur natural, huevo, arroz, pasta, pan, patata, cebolla, ajo, tomate, tomate triturado, pimiento rojo, pimiento verde, zanahoria, calabacín, berenjena, champiñón, espinaca, lechuga, pepino, limón, naranja, manzana, plátano, fresa, pollo, ternera, cerdo, salmón, atún, gamba, lenteja, garbanzo, alubia, queso, queso parmesano, perejil, cilantro, orégano, comino, pimentón, canela, vainilla, chocolate negro y miel.
- El seeder es idempotente: inserta únicamente nombres ausentes, reutiliza coincidencias y nunca actualiza ni elimina filas existentes.
- La base desplegada solo recibe migraciones conservadoras hacia delante y aplicaciones manuales autorizadas; nunca `migrate:fresh`, `db:wipe`, reconstrucciones, rollbacks remotos ni migraciones destructivas.
- La tabla nueva habilita RLS sin políticas y retira privilegios a `anon`, `authenticated` y `service_role`; Laravel continúa usando la conexión PostgreSQL directa aprobada.

## Criterios de aceptación

- `CA-01`: Un miembro autenticado ve en `/recipes` todos y solo los borradores y recetas publicadas que coautoriza, ordenados por modificación e identificador, puede abrirlos y no encuentra ninguna acción de eliminación.
- `CA-02`: El primer guardado válido crea un borrador y su autoría inicial conjuntamente; las demás etapas persisten y pueden reanudarse sin pérdida de datos.
- `CA-03`: El asistente cubre datos generales, ingredientes, elaboración, categorías y etiquetas, coautores y revisión con una presentación mobile first operable a 320, 768 y 1440 píxeles.
- `CA-04`: Un guardado basado en un `updated_at` antiguo se rechaza sin sobrescribir cambios y muestra una indicación clara para recargar; cada etapa que modifica la receta o sus asociaciones actualiza esa versión y una acción aislada sobre invitaciones no lo hace.
- `CA-05`: Título, rendimiento, tiempos, cantidades, unidades, posiciones, instrucciones y asociaciones respetan las restricciones del modelo vigente; punto y coma decimales producen el mismo valor almacenado.
- `CA-06`: Los autores pueden crear y reutilizar ingredientes y etiquetas normalizados sin duplicados; solo pueden seleccionar unidades y categorías controladas.
- `CA-07`: Publicar exige al menos un ingrediente y un paso, asigna `published_at` y crea una página pública por identificador con título, descripción, cantidad resultante opcional, tiempos, ingredientes, pasos, categorías, etiquetas y autores.
- `CA-08`: Editar una receta publicada conserva `published_at` y rechaza retirar su último ingrediente o paso; despublicar la oculta y republicar asigna una fecha nueva.
- `CA-09`: Un borrador es accesible únicamente para sus coautores y se comporta como inexistente para los demás; una receta publicada es visible sin autenticación.
- `CA-10`: La invitación exige un `username` completo y válido y rechaza cuentas inexistentes, inactivas, el propio usuario, coautores actuales y destinatarios con una invitación pendiente.
- `CA-11`: Aceptar, rechazar y cancelar producen exclusivamente las transiciones permitidas; solo aceptar añade una autoría y los estados resueltos conservan el historial.
- `CA-12`: Tras una invitación rechazada o cancelada puede crearse otra independiente; nunca hay dos pendientes simultáneas para la misma receta y destinatario.
- `CA-13`: Todos los coautores ven el historial de invitaciones de su receta; cada destinatario ve solo sus invitaciones recibidas con el contexto y orden aprobados, y únicamente el remitente puede cancelar la suya.
- `CA-14`: Un coautor puede abandonar una receta salvo que sea el último; al hacerlo se cancelan sus invitaciones pendientes de esa receta sin alterar las demás autorías.
- `CA-15`: `/users/{username}` muestra solo nombre, `username`, biografía y recetas publicadas de una cuenta activa, ordenadas por publicación e identificador; nunca muestra correo ni borradores.
- `CA-16`: El perfil desactivado y los borradores ajenos se comportan como inexistentes; las recetas publicadas permanecen visibles y muestran autores inactivos como texto sin enlace.
- `CA-17`: Desactivar exige la contraseña actual, establece `deactivated_at`, conserva datos y autorías, cancela invitaciones pendientes e inutiliza todas las sesiones existentes.
- `CA-18`: Un inicio con credenciales válidas de una cuenta desactivada requiere confirmación antes de reactivarla y no concede una sesión normal mientras siga desactivada.
- `CA-19`: Los accesos ficticios del Home navegan realmente a crear receta, invitaciones y perfil propio, manteniendo operabilidad por teclado y foco visible.
- `CA-20`: Las migraciones nuevas añaden de forma conservadora `users.deactivated_at` y `recipe_author_invitations` con receta, remitente, destinatario, estado, envío y resolución, preservan las filas existentes y protegen la tabla nueva con RLS sin políticas y sin privilegios de la Data API.
- `CA-21`: El seeder inserta exactamente los nombres iniciales ausentes con símbolos de unidades nulos, reutiliza sin modificar las unidades preexistentes, es idempotente y aborta sin cambios parciales ante otros conflictos incompatibles.
- `CA-22`: Las políticas de autorización impiden que visitantes, no autores, destinatarios incorrectos, usuarios desactivados o administradores sin coautoría realicen operaciones no permitidas.
- `CA-23`: Las pruebas backend cubren persistencia por etapas, validación, orden, publicación, conflictos, invitaciones, salida, perfiles, desactivación, sesiones, reactivación, seeder, RLS y conservación de datos.
- `CA-24`: Las pruebas React cubren los flujos principales y errores de recetas, invitaciones, perfiles y cuenta sin incumplir la arquitectura frontend, CSS Modules, mobile first, navegación por teclado y WCAG 2.2 AA.
- `CA-25`: PHPUnit, Vitest, ESLint, Prettier, build, Pint, auditorías y `git diff --check` pasan; la revisión completa no encuentra borrados de datos, cambios destructivos, secretos ni alteraciones fuera del alcance.
- `CA-26`: Tras CI verde, cualquier migración o seeder en Supabase requiere autorización independiente y manual; un fallo remoto detiene el proceso sin rollback, reconstrucción ni reintento automático.
- `CA-27`: `test_reviewer` relaciona todos los criterios con pruebas y evidencias y emite `PASS` antes de completar la especificación.

## Decisiones aprobadas

- Las recetas se gestionan mediante Laravel e Inertia, sin API separada ni dependencias nuevas.
- “Mis recetas” reúne borradores y publicadas coautorizadas por el usuario.
- La creación utiliza un asistente mobile first y guarda cada etapa en PostgreSQL.
- La concurrencia se controla mediante la versión `updated_at` y un guardado antiguo se rechaza completo.
- Todos los coautores tienen los mismos permisos sobre la receta; `admin` no recibe privilegios adicionales.
- No se pueden eliminar recetas ni cuentas.
- La coautoría comienza únicamente al aceptar una invitación por `username` exacto.
- Las invitaciones conservan un historial inmutable de estados resueltos y permiten volver a invitar mediante una fila nueva.
- El historial vive en `recipe_author_invitations` y conserva receta, remitente, destinatario, estado, fecha de envío y fecha de resolución.
- Todos los coautores ven el historial de su receta, pero solo el remitente cancela su invitación pendiente.
- La desactivación exige contraseña, invalida sesiones y cancela invitaciones pendientes enviadas y recibidas sin retirar autorías.
- Los borradores ajenos y perfiles desactivados se presentan como inexistentes para proteger su privacidad.
- La reactivación exige credenciales correctas y una confirmación separada antes de recuperar la sesión.
- Las unidades iniciales ausentes se crean sin símbolos; una unidad preexistente se reutiliza sin modificarla.
- Ingredientes y etiquetas pueden crecer mediante nombres normalizados; unidades y categorías permanecen controladas.
- Supabase contiene datos reales y solo admite cambios conservadores hacia delante, aplicados manualmente con autorización independiente.

## Decisiones pendientes

- Ninguna dentro del alcance de esta especificación.
