---
spec: "005"
status: approved
---

# Plan técnico: Prototipo visual del feed social

## Resumen

Se reemplazará el contenido provisional de `Welcome` por un prototipo interactivo del feed social que derive el estado visitante o miembro de `auth.user`. La presentación se dividirá en componentes pequeños orientados al feed, mientras los datos ficticios y sus imágenes permanecerán aislados para poder sustituirlos por propiedades reales de Inertia en fases posteriores.

El prototipo conservará en memoria la pestaña, la vista ficticia y las interacciones locales mientras la página siga montada. Volver desde creación, invitaciones o perfil recuperará el feed en el mismo estado; una recarga restablecerá los fixtures deterministas. No se modificarán rutas, controladores ni persistencia.

## Componentes afectados

- `resources/js/Pages/Welcome.tsx`: orquestación de sesión, navegación entre feed y vistas ficticias, estado local y composición del home.
- `resources/js/Pages/Welcome.module.css`: layout responsive específico del home y sus vistas ficticias.
- `resources/js/Pages/Welcome.fixtures.ts`: tipos y conjuntos deterministas de publicaciones, invitaciones y perfil de muestra.
- `resources/js/Components/SocialFeed/`: shell, feed, tarjetas, carrusel, estado vacío y llamada de acceso; cada componente recibirá datos y callbacks, sin leer fixtures ni simular persistencia por su cuenta.
- `resources/images/prototype-feed/`: seis ilustraciones culinarias SVG originales y locales, con un máximo de 50 KB por archivo y 300 KB en total; el texto alternativo se definirá en los fixtures y no habrá URLs remotas.
- `resources/js/types/index.d.ts`: `auth.user` admitirá `null` y se expondrá un tipo autenticado estrechado para los layouts protegidos.
- `resources/js/Layouts/AuthenticatedLayout.tsx`: utilizará el tipo autenticado sin cambiar su comportamiento ni las rutas de Breeze.
- `resources/js/Pages/Profile/Partials/UpdateProfileInformationForm.tsx`: utilizará el mismo tipo autenticado para conservar el acceso seguro a nombre, correo y verificación.
- Pruebas frontend de `Welcome` y de los componentes del feed.

## Contratos, datos e interfaces

- `PageProps.auth.user` será `User | null`; `AuthenticatedPageProps` estrechará el mismo contrato a `User` para rutas protegidas.
- Los fixtures definirán un contrato de presentación estable con identificador, autor público, imágenes con `src` y `alt`, texto opcional, referencia textual de receta, contadores y estado inicial de interacción.
- `PublicationCard` recibirá una publicación, el estado de autenticación y callbacks de like, comentario y guardado. No conocerá Inertia, rutas ni almacenamiento.
- `PublicationCarousel` mantendrá solo el índice visible, limitará los extremos, omitirá controles con una imagen y anunciará la posición de forma accesible.
- Las pestañas y controles del carrusel permanecerán montados durante los cambios. La pestaña activada y el control del carrusel pulsado conservarán el foco; un área `aria-live="polite"` anunciará `Imagen X de Y`.
- `SocialFeed` recibirá una colección; si está vacía delegará en un estado vacío reutilizable.
- Para visitantes, los callbacks sociales renderizarán enlaces a `route('login')`. Para miembros, el contenedor actualizará un mapa de estado local por publicación y acción.
- La navegación autenticada manejará dos estados separados: pestaña del feed (`Inicio` o `Explorar`) y vista activa (`feed`, `create`, `invitations` o `profile`). Volver a `feed` conservará la pestaña y las interacciones locales hasta recargar.
- Al abrir una vista ficticia, el foco pasará a su encabezado mediante un destino programático; al volver al feed, regresará al acceso de navegación que abrió esa vista.
- Las vistas de creación, invitaciones y perfil serán paneles ficticios del mismo árbol React. No contendrán formularios enviables ni enlaces a rutas de dominio.
- El visitante recibirá exactamente las seis publicaciones públicas definidas para ese estado. Las colecciones autenticadas podrán tener otra cantidad sin convertirla en contrato funcional.

## Fases de implementación

1. Incorporar seis ilustraciones SVG dentro del presupuesto acordado, los tipos de presentación y los fixtures deterministas; corregir el contrato nullable de `auth.user` y migrar sus dos consumidores autenticados actuales.
2. Construir el shell y la navegación de visitante/miembro, manteniendo `Welcome` como única página servida por `/` y usando solo las rutas de autenticación existentes.
3. Construir feed, tarjeta, referencia de receta, acciones y carrusel como componentes controlados y reutilizables, manteniendo montados sus controles y gestionando foco y anuncio de posición.
4. Añadir el límite y CTA de visitante, las pestañas autenticadas, el estado vacío y las vistas ficticias navegables, preservando estado y restaurando el foco mientras el home permanezca montado.
5. Aplicar el diseño responsive con CSS Modules, ampliar únicamente los tokens globales estrictamente compartidos, comprobar el presupuesto de los SVG y revisar etiquetas, estados deshabilitados y ausencia de desbordamiento a 320 píxeles.
6. Añadir pruebas de comportamiento, ejecutar las comprobaciones reales del repositorio y revisar el diff completo antes del cierre SDD.

## Pruebas y criterios de aceptación

- `CA-01`, `CA-02`: render de visitante con seis artículos, acciones de registro/login, CTA final y ausencia de carga adicional.
- `CA-03`, `CA-04`: render autenticado, `Inicio` inicial y cambio reversible a `Explorar` con contenidos distintos sin navegación de documento.
- `CA-05`: comprobación de autor, contenido visual, texto, receta asociada y grupo de acciones en cada tarjeta.
- `CA-06`: pruebas del carrusel con una y varias imágenes, límites, posición anunciada, botones deshabilitados y conservación del foco en el control activado.
- `CA-07`: cada acción social del visitante expone un enlace al login y no altera contadores ni estados.
- `CA-08`: creación, invitaciones y perfil abren paneles ficticios; el foco pasa al encabezado y vuelve al acceso de origen, mientras la pestaña y el estado local se conservan sin envíos ni rutas inexistentes.
- `CA-09`: render directo del feed vacío dentro del shell con mensaje y navegación disponibles.
- `CA-10`, `CA-11`: revisión manual a 320 píxeles y escritorio, más aserciones de roles, nombres accesibles, `aria-selected`, `aria-controls`, `aria-current`, estados `disabled`, foco visible y `document.activeElement` tras cada transición.
- `CA-12`: una acción autenticada modifica solo el estado del componente; desmontar y volver a montar recupera el fixture inicial.
- `CA-13`: las pruebas suministran publicaciones distintas a los componentes sin depender de los fixtures de la página.
- `CA-14`: revisión de manifiestos, rutas y diff para confirmar que no hay dependencias, endpoints ni cambios backend; comprobación de que cada SVG no supera 50 KB y el conjunto no supera 300 KB.
- `CA-15`: Vitest y React Testing Library cubren los estados y transiciones anteriores sin comprobar detalles internos innecesarios.
- Verificación completa: `php artisan test`, `vendor/bin/pint --test`, `npm test`, `npm run lint`, `npm run format:check`, `npm run build` y `git diff --check`.

## Documentación

- No se creará documentación permanente adicional: la especificación, este plan y sus tareas describen el prototipo.
- Al cerrar la implementación se actualizará `MEMORY.md` únicamente con el estado operativo vigente y los pendientes externos reales.

## Despliegue y compatibilidad

- No hay migraciones, servicios externos ni despliegue en esta especificación.
- La ruta `/` y las rutas de Breeze conservan sus contratos backend actuales.
- Los recursos locales se incluirán en el build de Vite; el prototipo funcionará sin conexión a servicios de imágenes.
- El cambio debe mantener compatibles las páginas autenticadas existentes al estrechar el tipo nullable de `auth.user`.

## Riesgos y medidas

- Apariencia de persistencia ficticia: las vistas se identificarán como prototipo y todos los cambios locales se reiniciarán al recargar.
- Duplicación futura: los fixtures no se importarán desde los componentes y todos los componentes dependerán de props y callbacks.
- Regresión de páginas protegidas por el nuevo tipo nullable: `AuthenticatedLayout` y `UpdateProfileInformationForm` migrarán a `AuthenticatedPageProps`, se buscarán nuevos consumidores y se compilará todo el frontend.
- Carrusel o navegación inaccesibles: los controles permanecerán montados, se gestionará explícitamente la entrada y restauración de foco y las pruebas comprobarán `document.activeElement`.
- Dependencia de contenido remoto, licencias o peso excesivo: se usarán seis SVG originales locales y se bloqueará el cierre si cualquier archivo o el total exceden el presupuesto acordado.
- Crecimiento prematuro de componentes: carrusel, referencia y acciones podrán permanecer internos a la tarjeta cuando no necesiten una reutilización independiente.
