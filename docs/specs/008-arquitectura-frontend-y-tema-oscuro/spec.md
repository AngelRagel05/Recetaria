---
id: "008"
title: "Arquitectura frontend por áreas y tema oscuro"
status: approved
---

# Especificación: Arquitectura frontend por áreas y tema oscuro

## Problema y objetivo

El frontend actual mezcla páginas, componentes, datos, tipos y estilos con profundidades y criterios distintos. Algunas carpetas agrupan varios componentes visuales, otras dejan el componente y su CSS separados, y páginas como `Welcome` concentran responsabilidades que ya pueden distinguirse con claridad. Esta irregularidad dificulta localizar cada pieza, mantener sus estilos y comprobar que las nuevas pantallas respetan una organización común.

Además, la identidad visual clara y verde del prototipo inicial ya no representa la dirección aprobada para Recetaria. La aplicación necesita adoptar una paleta oscura coherente en todas sus pantallas sin cambiar sus rutas, formularios, autenticación ni comportamiento actual.

El objetivo es convertir la organización por áreas y la pareja local de componente y CSS Module en la arquitectura frontend oficial de Recetaria, migrar a ella todo el frontend existente y aplicar un único tema oscuro accesible. El patrón organizativo toma MiKiWi únicamente como referencia; el código, el diseño y las excepciones históricas de aquel proyecto no se copiarán.

## Alcance

### Incluido

- La reorganización completa del frontend existente dentro de `resources/js` por páginas, componentes, layouts y carpetas de apoyo.
- Una carpeta visual final por página, componente o layout, con exactamente un archivo `*.tsx` y su archivo `*.module.css` homónimo.
- La separación de la página de inicio y de la tarjeta de publicación en componentes con responsabilidades más pequeñas y nombres aprobados.
- La conservación separada de las seis páginas de autenticación bajo el área `Auth`.
- El traslado de los formularios de perfil desde `Pages/Profile/Partials` a componentes del área `Profile`.
- El aislamiento de datos, tipos, hooks y utilidades fuera de las carpetas visuales finales.
- La resolución de componentes Inertia anidados con el formato lógico `Area/Page`.
- El cambio de los nombres lógicos del inicio a `Home/Home` y del panel de cuenta a `Profile/Dashboard`, sin cambiar sus URLs.
- La actualización de las pruebas frontend y backend afectadas por los nuevos nombres y rutas internas.
- Una prueba automatizada que proteja las reglas estructurales aprobadas.
- La adopción de la paleta oscura aprobada en Home, autenticación, panel y perfil.
- La centralización de variables visuales, reset, tipografía, foco y utilidades verdaderamente globales.
- La actualización de `AGENTS.md` y `docs/decisiones-tecnicas.md` para convertir la estructura en una regla permanente del proyecto.
- La aplicación de un diseño mobile first y su comprobación a 320, 768 y 1440 píxeles, junto con la comprobación del contraste y la navegación mediante teclado.

### Fuera de alcance

- Cambios en las URLs públicas o en los nombres de las rutas Laravel.
- Cambios en las propiedades compartidas por Inertia, los campos de formularios o sus contratos.
- Cambios en la lógica de autenticación, autorización, registro, perfil o negocio.
- Cambios en la base de datos, migraciones, Supabase, Render o Docker.
- La conexión del prototipo social con datos reales o la creación de nuevas funciones de dominio.
- Un selector de tema, un tema claro alternativo o preferencias de color persistidas.
- Fuentes externas, librerías visuales, nuevas dependencias o una copia de código o identidad visual de MiKiWi.
- La creación de carpetas `Partials`, `Common`, `Sections` o `Features`, y el uso de archivos `index.ts` como barrels.
- Documentación permanente adicional distinta de la actualización de los documentos ya existentes y de los artefactos SDD de esta tarea.

## Actores

- Visitante: necesita conservar el acceso al home público, al registro y al inicio de sesión con una presentación oscura legible y adaptada a su dispositivo.
- Miembro autenticado: necesita conservar el feed, sus vistas ficticias, el panel y la edición de perfil sin cambios funcionales ni pérdida de accesibilidad.
- Desarrollador: necesita localizar cada pieza visual mediante una estructura predecible y recibir un fallo automático cuando una modificación futura incumpla esa arquitectura.

## Flujos

### Visitante navega por la aplicación reorganizada

1. El visitante abre `/`.
2. Laravel conserva la misma URL y propiedades, pero solicita el componente lógico `Home/Home`.
3. Inertia resuelve ese nombre en `Pages/Home/Home/Home.tsx`.
4. El visitante conserva el contenido, la navegación y las interacciones aprobadas del prototipo público.
5. Al entrar en una pantalla de autenticación, Inertia conserva nombres como `Auth/Login` y los resuelve en la carpeta propia de esa página.
6. Todas las pantallas parten de estilos diseñados para 320 píxeles y se amplían progresivamente para 768 y 1440 píxeles, con foco visible y sin retirar funciones en ningún tamaño.

### Miembro utiliza Home, panel y perfil

1. El miembro abre `/` y conserva los modos, vistas ficticias e interacciones locales del prototipo autenticado.
2. Las responsabilidades del Home se reparten entre `HomeHeader`, `GuestHome`, `MemberHome`, `PrototypePanel`, `CreatePrototype`, `InvitationsPrototype` y `ProfilePrototype` sin alterar el comportamiento observable.
3. El miembro abre `/dashboard`; Laravel solicita `Profile/Dashboard` e Inertia resuelve `Pages/Profile/Dashboard/Dashboard.tsx`.
4. El miembro abre `/profile`; el nombre lógico `Profile/Edit` se conserva y se resuelve en `Pages/Profile/Edit/Edit.tsx`.
5. Los formularios de perfil mantienen sus envíos, errores, estados y campos, aunque su presentación se encuentre en `Components/Profile`.

### Desarrollador añade o modifica una pieza visual

1. El desarrollador sitúa la página, componente o layout dentro de la carpeta correspondiente a su área.
2. La carpeta visual final contiene exclusivamente el archivo TSX y el CSS Module con el mismo nombre de la carpeta.
3. El componente importa su CSS propio mediante una ruta relativa y utiliza `@/` para los imports internos que cruzan carpetas.
4. Los tipos, datos, hooks, utilidades y pruebas se guardan únicamente en las rutas de apoyo enumeradas por esta especificación, no junto al par visual.
5. La prueba estructural informa de nombres discordantes, profundidad incorrecta, archivos extra, barrels o carpetas prohibidas.

### Casos alternativos y errores

- Si un nombre lógico de Inertia no encuentra exactamente su archivo anidado, la resolución debe fallar de forma visible durante las pruebas o el build en lugar de cargar otra página por coincidencia parcial.
- Si una carpeta visual contiene solo TSX, solo CSS, archivos con nombres distintos o un tercer archivo, la prueba estructural debe fallar indicando la carpeta afectada.
- Si aparece una carpeta `Partials`, `Common`, `Sections` o `Features` dentro del frontend reorganizado, la prueba estructural debe fallar.
- Si un archivo TypeScript sin JSX aparece dentro de una carpeta visual final o fuera de una ruta de apoyo enumerada, la prueba estructural debe fallar.
- Si el contenido no cabe a 320, 768 o 1440 píxeles, pierde foco visible o deja de cumplir los contrastes aprobados, la tarea no puede cerrarse.

## Reglas de negocio

- Las páginas seguirán la forma `Pages/<Area>/<Page>/<Page>.tsx` y `Pages/<Area>/<Page>/<Page>.module.css`.
- Los componentes globales seguirán la forma `Components/<Component>/<Component>.tsx` y su CSS homónimo.
- Los componentes de área seguirán la forma `Components/<Area>/<Component>/<Component>.tsx` y su CSS homónimo.
- Los layouts seguirán la forma `Layouts/<Layout>/<Layout>.tsx` y su CSS homónimo.
- Cada carpeta visual final contendrá exactamente esos dos archivos; no contendrá tipos, datos, pruebas, hooks, utilidades ni barrels.
- Los imports internos que crucen carpetas utilizarán el alias `@/`; solo el CSS propio se importará de forma relativa.
- `FormField` será un componente global en `Components/FormField/FormField.tsx`.
- `SocialFeed`, `PublicationCard`, `PublicationCarousel` y `PublicationAction` pertenecerán al área `SocialFeed` y vivirán respectivamente en `Components/SocialFeed/<Component>/<Component>.tsx`.
- `HomeHeader`, `GuestHome`, `MemberHome`, `PrototypePanel`, `CreatePrototype`, `InvitationsPrototype` y `ProfilePrototype` pertenecerán al área `Home` y vivirán respectivamente en `Components/Home/<Component>/<Component>.tsx`.
- `UpdateProfileInformationForm`, `UpdatePasswordForm` y `DeleteUserForm` pertenecerán al área `Profile` y vivirán respectivamente en `Components/Profile/<Component>/<Component>.tsx`.
- Los únicos archivos frontend situados directamente en `resources/js` serán `app.tsx`; las carpetas visuales `Pages`, `Components` y `Layouts`; y las carpetas de apoyo opcionales `Hooks`, `Utils`, `types` y `tests`.
- Los archivos `.ts` sin JSX se permitirán únicamente dentro de `resources/js/Hooks`, `resources/js/Utils`, `resources/js/Components/Home/data`, `resources/js/Components/Home/types` y `resources/js/Components/SocialFeed/types`. Los archivos de declaración `.d.ts` se permitirán en `resources/js/types` y los archivos de pruebas `.ts` o `.tsx` en `resources/js/tests`, con subcarpetas cuando ayuden a reflejar la estructura probada.
- Las carpetas de apoyo `Hooks` y `Utils` serán exclusivamente globales y estarán directamente bajo `resources/js`; no se permitirán variantes dentro de áreas. Las únicas carpetas de apoyo internas a áreas serán `Components/Home/data`, `Components/Home/types` y `Components/SocialFeed/types`.
- Las pruebas permanecerán fuera de las carpetas visuales y reflejarán la nueva organización sin reducir la cobertura de comportamientos existente.
- `Welcome` se sustituirá por `Pages/Home/Home/Home.tsx` y `Dashboard` por `Pages/Profile/Dashboard/Dashboard.tsx`.
- Las seis páginas de autenticación permanecerán separadas en `Pages/Auth/<Page>/<Page>.tsx`.
- `Profile/Edit` tendrá carpeta visual propia y sus tres formularios serán componentes separados del área `Profile`.
- `FormField`, `SocialFeed`, `PublicationCard`, `PublicationCarousel`, `PublicationAction` y ambos layouts tendrán carpeta visual propia.
- Los datos del prototipo vivirán en `Components/Home/data`; los tipos del Home y del feed vivirán en carpetas `types` de sus áreas.
- `resources/js/app.tsx` importará una sola vez `resources/css/global.css`, sin un archivo CSS intermediario. `global.css` contendrá únicamente variables, reset, tipografía, foco y utilidades realmente compartidas.
- Los estilos particulares, incluidos botones y tarjetas que no sean universales, permanecerán en el CSS Module de su pieza visual.
- El tema será único y oscuro, sin selector ni fuentes externas. El texto utilizará la pila del sistema y los títulos editoriales utilizarán Georgia.
- La paleta base será: fondo `#000020`, superficie `#171a4a`, superficie elevada `#2f2c79`, acción y foco `#ffff00`, resaltado suave `#ffff6a`, texto principal `#ffffff`, texto secundario `#c7c8e8`, éxito `#64e6a3`, error `#ff7b72`, información `#8da2ff` y texto sobre amarillo `#000020`.
- Espaciado, bordes, radios y sombras reutilizados se definirán mediante variables globales; su aplicación concreta seguirá siendo responsabilidad de cada CSS Module.
- El diseño seguirá un enfoque mobile first: los estilos sin media query resolverán la presentación desde 320 píxeles y las media queries ampliarán o redistribuirán progresivamente el contenido para 768 y 1440 píxeles, sin ocultar funciones necesarias según el dispositivo.
- El contrato de accesibilidad será WCAG 2.2 nivel AA. El texto normal, incluidos mensajes de estado, tendrá una relación de contraste mínima de `4.5:1`; el texto grande tendrá al menos `3:1`, considerando grande un texto de al menos 24 píxeles en peso normal o 18,66 píxeles en negrita. Los límites visuales necesarios de controles, sus estados y el indicador de foco tendrán al menos `3:1` respecto a los colores adyacentes.
- La nueva identidad oscura sustituirá la decisión visual clara y verde de la especificación 005, sin modificar los demás comportamientos aprobados en aquella especificación.
- No se añadirán dependencias ni se modificarán backend de negocio, base de datos, autenticación, Supabase o despliegue.

## Criterios de aceptación

- `CA-01`: Todo componente visual existente queda ubicado en la estructura aprobada y cada carpeta visual final contiene exactamente su TSX y su CSS Module homónimos.
- `CA-02`: No quedan carpetas `Partials`, `Common`, `Sections` o `Features`, barrels `index.ts`, imports internos antiguos ni archivos visuales huérfanos bajo `resources/js`.
- `CA-03`: Los datos, tipos, hooks, utilidades y pruebas están fuera de las carpetas visuales finales; los archivos `.ts`, `.d.ts` y de prueba solo aparecen en las rutas de apoyo enumeradas expresamente.
- `CA-04`: Los imports que cruzan carpetas utilizan `@/` y cada pieza visual importa relativamente solo su CSS Module propio.
- `CA-05`: Inertia resuelve un nombre `Area/Page` como `Pages/Area/Page/Page.tsx`; `/` renderiza `Home/Home`, `/dashboard` renderiza `Profile/Dashboard` y los nombres lógicos de `Auth/*` y `Profile/Edit` se conservan.
- `CA-06`: Las URLs, propiedades Inertia, formularios, autenticación, validaciones y comportamiento observable permanecen sin cambios, salvo por la organización interna y el tema aprobados.
- `CA-07`: Home queda dividido en `HomeHeader`, `GuestHome`, `MemberHome`, `PrototypePanel`, `CreatePrototype`, `InvitationsPrototype` y `ProfilePrototype` conservando los estados de visitante y miembro, el límite público, los modos del feed y las vistas ficticias.
- `CA-08`: `PublicationCard` delega el carrusel en `PublicationCarousel` y cada acción social en `PublicationAction`, conservando el comportamiento, los estados y la navegación por teclado existentes.
- `CA-09`: Las seis páginas Auth, Dashboard, Profile/Edit, los tres formularios de perfil, `FormField`, los cuatro componentes del área SocialFeed, los siete componentes del área Home y ambos layouts tienen carpeta visual propia en las rutas exactas definidas por esta especificación.
- `CA-10`: `resources/js/app.tsx` carga `resources/css/global.css` una sola vez, no existe un archivo CSS intermediario y no quedan estilos compartidos por accidente en módulos ajenos ni estilos específicos trasladados innecesariamente al ámbito global.
- `CA-11`: Home, Auth, Dashboard y Profile muestran de manera coherente la paleta, tipografías y variables aprobadas, sin selector de tema, fuentes externas ni nuevas dependencias.
- `CA-12`: En anchos de viewport de 320, 768 y 1440 píxeles no existe desbordamiento horizontal de la página, contenido cortado ni acciones inaccesibles; la disposición parte del móvil y se amplía progresivamente sin retirar funciones.
- `CA-13`: El texto normal y los mensajes de estado alcanzan `4.5:1`; el texto grande, los límites necesarios de controles, sus estados y el foco visible alcanzan `3:1`, conforme a WCAG 2.2 AA; toda interacción que ya era operable por teclado continúa siéndolo.
- `CA-14`: Una prueba Vitest estructural detecta profundidad o nombres incorrectos, ausencia de la pareja TSX/CSS, archivos adicionales en carpetas visuales, carpetas prohibidas, barrels y archivos `.ts`, `.d.ts` o de prueba fuera de las rutas enumeradas.
- `CA-15`: Las pruebas React mantienen la cobertura de visitante, miembro, feed, perfil, registro, formularios y accesibilidad por teclado con las nuevas rutas internas.
- `CA-16`: Las pruebas backend comprueban los nuevos nombres lógicos de Home y Dashboard y la conservación de `Auth/*` y `Profile/Edit`.
- `CA-17`: Vitest, ESLint, Prettier, build, PHPUnit, Pint, las auditorías configuradas y `git diff --check` pasan, y la revisión final no encuentra rutas modificadas, archivos huérfanos ni cambios fuera del alcance.
- `CA-18`: `AGENTS.md` y `docs/decisiones-tecnicas.md` recogen la nueva estructura como norma oficial sin crear documentación permanente adicional.
- `CA-19`: `test_reviewer` relaciona los criterios de aceptación con las pruebas y evidencias y emite `PASS`; GitHub Actions queda registrado como pendiente hasta que el desarrollador publique o integre la rama.

## Decisiones aprobadas

- Todo el frontend actual se migrará ahora a una arquitectura por áreas adaptada a TypeScript.
- MiKiWi se utilizará únicamente como referencia del patrón de carpetas, nunca como fuente de código, diseño o excepciones antiguas.
- Cada pieza visual tendrá una carpeta final con exactamente un archivo TSX y su CSS Module homónimo.
- Las páginas de autenticación seguirán separadas.
- Home y la tarjeta de publicación se dividirán por responsabilidades mediante los componentes nombrados en esta especificación.
- Las URLs y contratos existentes se conservarán, aunque Home y Dashboard adopten nombres lógicos de Inertia coherentes con sus áreas.
- La arquitectura quedará protegida mediante documentación oficial y una prueba automatizada.
- Recetaria adoptará un único tema oscuro con la paleta aprobada, sin selector, fuentes externas ni dependencias nuevas.
- Las variables compartidas se centralizarán, pero los estilos concretos seguirán perteneciendo a cada componente mediante CSS Modules.
- `global.css` se cargará directamente desde `app.tsx`; se descarta mantener `app.css` como intermediario porque no aporta valor actual.
- Los estilos seguirán un enfoque mobile first y se comprobarán exactamente a 320, 768 y 1440 píxeles.
- La referencia de accesibilidad será WCAG 2.2 nivel AA con los umbrales de contraste definidos en esta especificación.
- El refactor se realizará como una sola tarea SDD completa.

## Decisiones pendientes

- Ninguna dentro del alcance de esta especificación.
