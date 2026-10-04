---
id: "005"
title: "Prototipo visual del feed social"
status: completed
---

# Especificación: Prototipo visual del feed social

## Problema y objetivo

La ruta principal de Recetaria muestra actualmente una bienvenida provisional y no permite validar la experiencia visual que articulará el producto social. Antes de conectar recetas, publicaciones e interacciones reales, se necesita una primera versión navegable del home que permita revisar su jerarquía, adaptación responsive y diferencias entre visitantes y miembros sin anticipar el backend de fases posteriores.

El objetivo es sustituir la bienvenida provisional por un prototipo visual reutilizable del feed de publicaciones. El prototipo utilizará contenido representativo de muestra, conservará una separación clara entre presentación y datos y servirá como base visual para conectar posteriormente información real mediante Inertia.

## Alcance

### Incluido

- El home público de Recetaria en la ruta `/` para visitantes y miembros autenticados.
- Un shell responsive con identidad de Recetaria, navegación principal y acciones diferenciadas según exista o no una sesión.
- Una muestra de exactamente seis publicaciones para visitantes, seguida de una llamada a registrarse o iniciar sesión sin posibilidad de cargar más publicaciones.
- Los modos visuales `Inicio` y `Explorar` para miembros autenticados, alimentados con conjuntos representativos de publicaciones de muestra.
- Vistas ficticias navegables de creación, invitaciones y perfil dentro del mismo shell, sin rutas de dominio ni persistencia.
- Tarjetas de publicación con autor, imágenes, texto, referencia visible a una receta y estado representativo de las acciones sociales.
- Navegación accesible entre las imágenes de una publicación cuando contenga más de una.
- Estados visuales reutilizables para ausencia de contenido y para el límite de contenido de visitantes.
- Accesos visuales autenticados a creación, invitaciones y perfil que abren sus correspondientes vistas ficticias dentro del prototipo.
- Contenido de muestra local y determinista, sin peticiones a servicios externos ni persistencia.
- Adaptación desde 320 píxeles de ancho hasta escritorio y navegación operable mediante teclado.

### Fuera de alcance

- Migraciones, modelos, seeders o cambios en PostgreSQL.
- La adaptación de registro, inicio de sesión, perfiles o roles.
- La creación, edición o persistencia real de recetas y publicaciones.
- La carga de imágenes, la integración con Cloudinary o cualquier credencial externa.
- Los algoritmos, consultas, cursores o carga incremental de los feeds reales.
- La persistencia de likes, comentarios, seguimientos, guardados o colecciones.
- La implementación funcional de creación, invitaciones, perfiles públicos o administración.
- Una API independiente, nuevas dependencias frontend o una librería visual.
- Cambios en las rutas y la lógica backend de autenticación ya proporcionadas por Breeze.

## Actores

- Visitante: necesita comprender el propósito de Recetaria, descubrir una muestra limitada de publicaciones y acceder con claridad al registro o inicio de sesión.
- Miembro autenticado: necesita reconocer la futura experiencia social, alternar entre `Inicio` y `Explorar` y localizar los accesos principales de su cuenta.
- Desarrollador: necesita validar una base visual y de interacción que pueda conectarse después a datos reales sin mantener una segunda interfaz paralela.

## Flujos

### Visitante consulta la muestra pública

1. El visitante abre `/` sin una sesión activa.
2. El sistema presenta la identidad de Recetaria y acciones para iniciar sesión o crear una cuenta.
3. El visitante puede recorrer exactamente seis publicaciones representativas.
4. Si una publicación contiene varias imágenes, puede avanzar, retroceder e identificar la posición actual.
5. Tras la sexta publicación, el sistema muestra una llamada visible al registro o inicio de sesión y no ofrece carga adicional.
6. Una acción social conduce a la ruta existente de inicio de sesión sin modificar el estado del prototipo.

### Miembro consulta los modos del feed

1. El miembro abre `/` con una sesión activa.
2. El sistema muestra el shell autenticado y presenta `Inicio` como modo inicial.
3. El miembro puede alternar entre `Inicio` y `Explorar` sin recargar la página completa.
4. Cada modo muestra su propio conjunto determinista de publicaciones de muestra.
5. El miembro puede abrir desde el shell las vistas ficticias de creación, invitaciones y perfil y regresar al feed sin recargar la página completa.
6. Las vistas ficticias se identifican como parte del prototipo, no envían formularios y no navegan hacia rutas de dominio inexistentes.
7. Al activar una acción social, el prototipo actualiza únicamente su estado visual local; el cambio se pierde al recargar y no genera peticiones de dominio.

### Publicación sin contenido disponible

1. Un modo del feed recibe una colección vacía.
2. El sistema muestra un estado vacío comprensible que conserva la navegación principal y orienta al usuario sobre la ausencia de contenido.

### Casos alternativos y errores

- Si una publicación contiene una sola imagen, no se muestran controles de carrusel innecesarios.
- Los controles de carrusel no permiten avanzar fuera de la primera o última imagen y comunican su estado deshabilitado.
- Si falta un dato opcional del contenido de muestra, la tarjeta mantiene una presentación coherente sin mostrar texto residual, claves técnicas ni espacios rotos.
- Si JavaScript actualiza la pestaña activa o la imagen visible, el foco del teclado permanece en un elemento predecible y no se pierde la capacidad de navegación.
- Si el miembro recarga la página después de activar una acción social, el prototipo recupera el estado determinista original de sus datos de muestra.

## Reglas de negocio

- El visitante ve exactamente seis publicaciones en el home y no puede solicitar más dentro de este prototipo.
- `Inicio` y `Explorar` son modos exclusivos del estado autenticado.
- El contenido del prototipo es ficticio, local y determinista; no representa datos persistidos ni decisiones sobre el algoritmo futuro.
- Las publicaciones de muestra pueden representar varias imágenes y deben mostrar al menos una referencia de receta para anticipar la relación visual aprobada para el MVP.
- Las recetas se representan únicamente mediante información textual; no reciben una imagen propia dentro de la tarjeta.
- Los estados autenticado y visitante se determinan a partir de la sesión ya compartida por Inertia; no se simula un segundo mecanismo de autenticación.
- Ninguna acción visual del prototipo puede crear, modificar o eliminar datos del usuario o del dominio.
- Las acciones sociales de un visitante conducen siempre al inicio de sesión mediante la ruta existente y no modifican estado local ni persistente.
- Las acciones sociales de un miembro pueden cambiar únicamente su representación local y deben recuperar su estado inicial al recargar la página.
- Los accesos a creación, invitaciones y perfil abren vistas ficticias dentro del shell, sin conducir a rutas de dominio inexistentes ni aparentar que una operación se ha persistido.

## Criterios de aceptación

- `CA-01`: Al abrir `/` sin sesión se muestran la identidad de Recetaria, las acciones de registro e inicio de sesión y exactamente seis publicaciones de muestra.
- `CA-02`: Después de la sexta publicación, el visitante ve una llamada de acceso y no dispone de un control para cargar más publicaciones.
- `CA-03`: Al abrir `/` con sesión se muestra `Inicio` como modo activo y se ofrecen `Inicio` y `Explorar` sin las acciones de registro del visitante.
- `CA-04`: Un miembro puede alternar entre `Inicio` y `Explorar` sin recargar la página completa, y cada modo conserva un conjunto determinista y diferenciado de publicaciones.
- `CA-05`: Cada tarjeta muestra autor, contenido visual, texto representativo, una referencia textual a receta y acciones sociales en un orden coherente.
- `CA-06`: Una publicación con varias imágenes permite avanzar y retroceder, informa de la posición y bloquea los movimientos fuera de rango; una publicación con una sola imagen no muestra esos controles.
- `CA-07`: Las acciones sociales de un visitante conducen a la ruta existente de inicio de sesión y no modifican estado local ni persistente.
- `CA-08`: Los accesos autenticados a creación, invitaciones y perfil abren vistas ficticias navegables dentro del shell, permiten regresar al feed y no envían datos ni abren rutas de dominio inexistentes.
- `CA-09`: Un conjunto vacío produce un estado comprensible sin romper el shell ni ocultar la navegación principal.
- `CA-10`: La interfaz funciona desde 320 píxeles hasta escritorio sin desbordamiento horizontal de la página y mantiene legibles las tarjetas y acciones.
- `CA-11`: Pestañas, enlaces y controles de carrusel son utilizables mediante teclado, tienen nombres accesibles y muestran un foco visible.
- `CA-12`: Las acciones sociales de un miembro actualizan únicamente el estado visual local, recuperan su valor inicial al recargar y no realizan peticiones de dominio ni persisten interacciones.
- `CA-13`: Los datos de muestra están aislados de la presentación y pueden sustituirse posteriormente por propiedades reales sin conservar otra versión del home.
- `CA-14`: El prototipo no incorpora nuevas dependencias, no modifica las rutas o la lógica backend de Breeze y solo utiliza la navegación existente al inicio de sesión cuando corresponde.
- `CA-15`: Las pruebas frontend verifican los estados de visitante y miembro, el límite de seis publicaciones, el cambio de modo, las vistas ficticias, el carrusel, el estado vacío y las acciones sociales de ambos actores.

## Decisiones aprobadas

- El primer resultado visible del roadmap será un frontend real construido con contenido tipado de muestra y preparado para conectarse después.
- Tanto visitantes como miembros verán un feed de publicaciones en `/`, con controles diferentes según la sesión.
- El visitante verá seis publicaciones antes de la llamada al registro o inicio de sesión.
- Los miembros dispondrán de un modo principal y otro de exploración; la composición y paginación reales se implementarán en una fase posterior.
- Creación, invitaciones y perfil se representarán mediante vistas ficticias navegables dentro del shell, sin formularios operativos ni rutas de dominio.
- Las acciones sociales del visitante conducirán al login y las del miembro solo cambiarán estado visual local no persistente.
- El prototipo conservará la identidad visual existente de tonos verdes y fondos claros, utilizará CSS Modules y no añadirá una librería visual.
- Las recetas no tendrán imágenes propias; la referencia de receta se presentará como información asociada a una publicación.
- La fase no implementará persistencia, modelo de datos, Cloudinary ni interacciones sociales reales.

## Decisiones pendientes

- Ninguna dentro del alcance de esta especificación.
