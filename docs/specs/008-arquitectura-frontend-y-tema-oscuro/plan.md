---
spec: "008"
status: approved
---

# Plan técnico: Arquitectura frontend por áreas y tema oscuro

## Resumen

El frontend se reorganizará dentro de la integración Laravel, Inertia y React ya existente. Se mantendrán las URLs, las propiedades Inertia, los formularios y todos los comportamientos cubiertos actualmente; solo cambiarán la resolución interna de páginas, la distribución de responsabilidades y la presentación visual aprobada.

La migración se hará de fuera hacia dentro: primero la base global del tema y las piezas compartidas, después Auth y Profile, luego SocialFeed y Home, y finalmente el resolvedor de páginas, las pruebas arquitectónicas y la documentación. Esta secuencia permite mover cada responsabilidad una sola vez y revisar por separado las partes más sensibles. No se añadirán dependencias ni se modificará `node_modules`.

## Componentes afectados

- `resources/css/global.css`: base global del tema oscuro, cargada directamente desde `resources/js/app.tsx`.
- `resources/js/app.tsx`: resolución de páginas anidadas de Inertia y color del indicador de navegación.
- `resources/js/Pages`: Home, las seis páginas Auth, Dashboard y Profile/Edit pasarán a carpetas visuales finales homónimas.
- `resources/js/Components/FormField`: componente global con carpeta propia.
- `resources/js/Components/Home`: siete componentes visuales, datos deterministas y tipos exclusivos del prototipo Home.
- `resources/js/Components/Profile`: tres formularios con sus CSS Modules independientes.
- `resources/js/Components/SocialFeed`: feed, tarjeta, carrusel y acción social con carpetas visuales propias y tipos del área.
- `resources/js/Layouts`: `AuthenticatedLayout` y `GuestLayout` con una carpeta visual por layout.
- `resources/images/prototype-feed`: los SVG actuales se conservan como recursos fuente; no se duplican ni se trasladan.
- `routes/web.php`: cambia únicamente los nombres lógicos emitidos para `/` y `/dashboard`.
- `resources/js/tests`, `tests/Feature` y `vitest.config.ts`: rutas de importación, conservación de comportamientos, contratos Inertia, arquitectura y contraste.
- `AGENTS.md`, `docs/decisiones-tecnicas.md`, los artefactos SDD 008 y `MEMORY.md`: regla permanente y estado operativo.

## Contratos, datos e interfaces

- `app.tsx` declarará la configuración `pages` soportada por `@inertiajs/vite`. La transformación tomará el último segmento del nombre lógico y convertirá, por ejemplo, `Auth/Login` en `./Pages/Auth/Login/Login.tsx`, `Home/Home` en `./Pages/Home/Home/Home.tsx` y `Profile/Edit` en `./Pages/Profile/Edit/Edit.tsx`.
- La transformación conservará el error explícito del plugin cuando una página no exista. No se crearán coincidencias parciales, rutas alternativas ni barrels.
- `/` conservará su URL y propiedades actuales, pero Laravel emitirá `Home/Home`. `/dashboard` conservará URL, middleware y nombre de ruta, pero emitirá `Profile/Dashboard`. Los controladores seguirán emitiendo los seis nombres `Auth/*` y `Profile/Edit` existentes.
- `Home` mantendrá las propiedades `canLogin` y `canRegister`, obtendrá el usuario de las propiedades compartidas actuales y seguirá siendo responsable del estado que coordina modo de feed, vista ficticia, interacción local y restauración del foco.
- `HomeHeader`, `GuestHome`, `MemberHome`, `PrototypePanel`, `CreatePrototype`, `InvitationsPrototype` y `ProfilePrototype` recibirán únicamente las propiedades y callbacks necesarios para representar su responsabilidad; no introducirán peticiones, persistencia ni estado de negocio nuevo.
- `SocialFeed` y `PublicationCard` conservarán sus contratos observables actuales. `PublicationCarousel` recibirá las imágenes y gestionará solo el índice visible; `PublicationAction` representará enlace para visitantes o botón con `aria-pressed` para miembros.
- Los tipos del feed pasarán a `Components/SocialFeed/types/socialFeed.ts`. Los tipos propios de navegación del Home pasarán a `Components/Home/types/home.ts`. Los datos deterministas pasarán a `Components/Home/data/prototypeData.ts`, sin archivo `index.ts`.
- Los SVG continuarán en `resources/images/prototype-feed`. `prototypeData.ts` obtendrá sus URLs mediante `new URL(..., import.meta.url).href`, que Vite procesa como recursos, evitando imports relativos de código y sin cambiar las imágenes ni añadir otro alias.
- `FormField`, los formularios de Auth y Profile y ambos layouts conservarán campos, atributos accesibles, rutas de envío, errores, estados de procesamiento y manejo del foco.
- `resources/css/global.css` definirá variables con nombres semánticos para colores, tipografías, espacios, bordes, radios y sombras; contendrá el reset, estilos de documento, foco y utilidades globales justificadas. `app.tsx` lo importará directamente una sola vez y no existirá `app.css`.
- Los estilos base serán mobile first para 320 píxeles. Las ampliaciones usarán media queries ascendentes en 768 y 1440 píxeles, sin retirar contenido o acciones.
- No cambian modelos, datos persistidos, contratos HTTP, autenticación, dependencias ni servicios externos.

## Fases de implementación

1. **Base visual global**
   - Crear `global.css` con la paleta, tipografías, escalas y reglas base aprobadas.
   - Importar esa base directamente una sola vez desde `app.tsx`, retirar `app.css` y alinear el indicador de progreso de Inertia con el color de foco.
   - Mantener en global solo reglas de documento, reset, foco y utilidades que se reutilicen realmente.

2. **Piezas compartidas, Auth y Profile**
   - Mover `FormField`, `AuthenticatedLayout` y `GuestLayout` a sus carpetas visuales finales y adaptar sus estilos al tema oscuro mobile first.
   - Crear una carpeta visual independiente para cada página Auth. Repartir el CSS compartido actual entre los módulos homónimos, conservando solo las reglas utilizadas por cada página.
   - Crear las carpetas de `Profile/Edit`, `Profile/Dashboard` y los tres componentes de formulario. Separar el CSS actual según la responsabilidad de cada pieza.
   - Actualizar imports con `@/` sin cambiar formularios, envíos ni estados.

3. **Área SocialFeed**
   - Trasladar los tipos a su carpeta de apoyo permitida.
   - Separar `PublicationCarousel` y `PublicationAction` de `PublicationCard`, preservando nombres accesibles, límites del carrusel, foco, anuncios y comportamiento visitante/miembro.
   - Dar a `SocialFeed`, `PublicationCard`, `PublicationCarousel` y `PublicationAction` su pareja TSX/CSS Module y repartir las reglas del módulo actual según su propietario.

4. **Área Home**
   - Mover los datos deterministas y tipos locales a sus rutas de apoyo aprobadas, conservando exactamente las publicaciones, imágenes y estados iniciales.
   - Extraer `HomeHeader`, `GuestHome`, `MemberHome`, `PrototypePanel`, `CreatePrototype`, `InvitationsPrototype` y `ProfilePrototype` con sus módulos propios.
   - Reducir `Pages/Home/Home/Home.tsx` a la coordinación de estado, foco y composición de las piezas, preservando el límite visitante, los modos del feed y las vistas ficticias.

5. **Resolución Inertia y contratos Laravel**
   - Configurar la transformación anidada en `app.tsx` una vez existan las páginas finales.
   - Cambiar únicamente `Welcome` por `Home/Home` y `Dashboard` por `Profile/Dashboard` en `routes/web.php`.
   - Añadir aserciones backend del componente Inertia para Home, Dashboard, las seis pantallas Auth y Profile/Edit, manteniendo las pruebas de rutas y comportamiento existentes.

6. **Protección automática de arquitectura y tema**
   - Ampliar la inclusión de Vitest a archivos `*.test.ts` y `*.test.tsx`.
   - Añadir una prueba estructural basada en el sistema de archivos que valide profundidades, nombres homónimos, pareja TSX/CSS, contenido exclusivo de las carpetas visuales, ubicaciones de apoyo, ausencia de carpetas prohibidas y ausencia de barrels.
   - Hacer que la misma protección detecte imports relativos de código entre carpetas; se permitirán paquetes externos, imports `@/` y el CSS Module propio relativo.
   - Añadir una prueba del contrato del tema que compruebe los valores de la paleta y calcule sin dependencias los contrastes mínimos de las combinaciones aprobadas.
   - Actualizar las pruebas React existentes para las nuevas rutas internas y mantener o ampliar las aserciones de visitante, miembro, feed, perfil, registro, formularios, carrusel y foco.

7. **Documentación, revisión visual y cierre**
   - Incorporar la estructura oficial a `AGENTS.md` y `docs/decisiones-tecnicas.md` sin duplicar el detalle operativo de la especificación.
   - Comprobar manualmente Home, las seis páginas Auth, Dashboard y Profile en 320, 768 y 1440 píxeles: desbordamiento, recorte, legibilidad, navegación y disponibilidad de acciones.
   - Medir y revisar las combinaciones reales de texto, estados, controles y foco contra WCAG 2.2 AA.
   - Ejecutar todos los controles del repositorio, revisar archivos huérfanos, imports antiguos, rutas y diff completo.
   - Entregar las evidencias a `test_reviewer`; solo con `PASS` se completarán tareas, especificación y memoria.

## Pruebas y criterios de aceptación

- `CA-01`: prueba estructural de todas las carpetas visuales y revisión del árbol final.
- `CA-02`: prueba estructural de nombres prohibidos y barrels, búsqueda de imports antiguos y revisión de archivos eliminados o movidos.
- `CA-03`: prueba estructural de la lista cerrada de rutas permitidas para `.ts`, `.d.ts` y pruebas.
- `CA-04`: prueba estructural de imports relativos y búsquedas con `rg` para confirmar `@/` entre carpetas y CSS propio relativo.
- `CA-05`: build de Vite para ejercitar la transformación y pruebas backend con `assertInertia` para `Home/Home`, `Profile/Dashboard`, `Auth/*` y `Profile/Edit`.
- `CA-06`: suite PHPUnit existente y pruebas React de formularios, perfil, registro y prototipo sin debilitar aserciones.
- `CA-07`: pruebas React de Home para visitante y miembro, seis publicaciones, cambio de modo, vistas ficticias, restauración de foco y reinicio del estado local.
- `CA-08`: pruebas de `PublicationCard`, `PublicationCarousel` y `PublicationAction` para límites, anuncios, foco, enlace visitante, botón miembro y estados activos.
- `CA-09`: prueba estructural contra la lista y profundidad de páginas, componentes y layouts aprobados.
- `CA-10`: prueba de la carga directa y única de `global.css` desde `app.tsx`, ausencia de `app.css`, revisión de módulos y búsqueda de importaciones globales adicionales.
- `CA-11`: prueba de tokens de color y revisión visual de Home, Auth, Dashboard y Profile.
- `CA-12`: comprobación manual documentada a 320, 768 y 1440 píxeles sin desbordamiento, recorte ni funciones ocultas.
- `CA-13`: cálculo automatizado de contraste de la paleta, revisión de las combinaciones realmente aplicadas y pruebas de navegación y restauración de foco.
- `CA-14`: prueba Vitest estructural con casos positivos sobre el árbol real y aserciones que produzcan mensajes claros ante cada clase de incumplimiento.
- `CA-15`: `npm test` con todas las pruebas React actualizadas y conservación explícita de las coberturas existentes.
- `CA-16`: `php artisan test` con aserciones de nombres Inertia añadidas a las pruebas de las rutas correspondientes.
- `CA-17`: ejecutar `npm test`, `npm run lint`, `npm run format:check`, `npm run build`, `php artisan test`, `vendor/bin/pint --test`, `npm audit`, `composer audit --locked` y `git diff --check`; revisar además `git diff` y el árbol completo.
- `CA-18`: revisión del contenido actualizado de `AGENTS.md` y `docs/decisiones-tecnicas.md`, sin documentos permanentes nuevos.
- `CA-19`: informe de `test_reviewer` con `PASS` y registro en `MEMORY.md` de que la publicación y GitHub Actions quedan pendientes del desarrollador.

## Documentación

- `AGENTS.md` añadirá la convención estable de rutas visuales, carpetas de apoyo, imports y mobile first.
- `docs/decisiones-tecnicas.md` recogerá la arquitectura frontend, la resolución anidada de Inertia y la dirección visual oscura aprobada.
- `MEMORY.md` reflejará la fase real durante la implementación y, tras la verificación local, mantendrá únicamente el pendiente de publicación y CI externo.
- `spec.md`, `plan.md` y `tasks.md` cambiarán de estado solo al superar las puertas SDD correspondientes.
- No se creará documentación permanente adicional.

## Despliegue y compatibilidad

- No hay migración de datos ni cambios de PostgreSQL, Supabase, Docker o Render.
- No hay dependencias nuevas ni cambios de versiones.
- Las URLs, nombres de rutas Laravel, middleware, propiedades Inertia y formularios permanecen compatibles.
- La ruta interna de los archivos frontend cambia de forma deliberada; el resolvedor, las pruebas y el build se actualizarán en la misma implementación para impedir referencias parciales.
- El agente no publicará ni integrará la rama. GitHub Actions se comprobará después de la publicación o integración realizada por el desarrollador y su resultado se registrará mediante el flujo documental previsto.

## Riesgos y medidas

- **Pérdida de comportamiento durante la división:** conservar las pruebas observables existentes, añadir cobertura de los componentes extraídos y revisar que los callbacks y el foco sigan coordinados por Home.
- **Resolución incorrecta de páginas:** usar la transformación oficial de `@inertiajs/vite`, comprobar nombres con PHPUnit y ejecutar el build completo.
- **Estilos filtrados o duplicados:** asignar cada regla al módulo de la pieza que representa; aceptar repetición pequeña cuando sea el coste directo del aislamiento aprobado y evitar trasladarla al CSS global sin uso verdaderamente común.
- **Prueba arquitectónica demasiado permisiva o demasiado rígida:** codificar la lista cerrada de excepciones de la especificación y emitir errores con la ruta concreta para facilitar cambios futuros conscientes.
- **Recursos gráficos rotos al mover los datos:** mantener los SVG en su ubicación actual y dejar que Vite resuelva sus URLs mediante `new URL(..., import.meta.url)`; validar todas las imágenes en build y revisión visual.
- **Contraste correcto en variables pero incorrecto al aplicarlas:** combinar el cálculo automático de tokens con inspección de las combinaciones reales en cada pantalla y estado.
- **Responsive no verificable mediante jsdom:** usar pruebas de comportamiento para la funcionalidad y una revisión visual explícita en los tres anchos aprobados, sin introducir una dependencia de navegador nueva.
- **Ruido de herramientas sobre dependencias:** excluir `node_modules` de las revisiones del código propio y no editar archivos generados; el aviso observado en la plantilla `SKILL.blade.php` de Inertia no es un error de PHP y queda fuera del alcance funcional.
