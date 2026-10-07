# Decisiones técnicas iniciales

Este documento recoge las decisiones técnicas iniciales aprobadas para Recetaria y sus límites. No constituye un registro formal de decisiones de arquitectura (ADR).

## Arquitectura

- Laravel se utilizará como backend.
- React se utilizará como frontend.
- Inertia.js integrará Laravel y React.
- El frontend estará dentro de `resources/js`.
- En esta fase no se utilizará una SPA separada ni una API independiente como arquitectura principal.
- Se utilizará Laravel 12 para mantener la compatibilidad con PHP 8.2.12, la versión local del desarrollador.

## Autenticación

- Laravel Breeze será la base de autenticación dentro de la arquitectura Laravel, Inertia y React.
- Se conservarán las rutas y la lógica backend de autenticación proporcionadas por Breeze.
- Se reutilizará el comportamiento frontend necesario para los formularios de autenticación, como el envío mediante Inertia, los errores de validación y los estados de procesamiento.
- Las páginas, layouts y componentes visuales generados por Breeze se reharán con TypeScript, CSS Modules y CSS global.
- El modelo conceptual distingue los roles `member` y `admin` mediante una relación 1:N entre `roles` y `users`; cada usuario tendrá exactamente un rol y `member` será el predeterminado.
- Las capacidades de los roles, la autorización, la asignación de roles y la creación del primer administrador permanecen pendientes de una especificación propia.
- No se deben asumir otras funcionalidades adicionales todavía no decididas, como login con Google, OAuth adicional, verificación de email, autenticación multifactor o permisos más granulares.

## Modelo de datos

- El [`modelo relacional`](modelo-relacional.md) es la vista visual vigente para localizar las 20 tablas de dominio, sus relaciones y sus cardinalidades.
- [`Atributos del modelo relacional`](atributos-modelo-relacional.md) es la referencia detallada vigente para consultar atributos, claves, índices, restricciones y el funcionamiento de cada relación.
- Ambas vistas son complementarias y deben representar el mismo modelo: las recetas se publican de forma independiente y las imágenes de publicaciones pueden enlazar opcionalmente recetas publicadas.
- Las migraciones de `006-conexion-migraciones-postgresql` materializan desde cero las 20 tablas de dominio y las siete tablas técnicas necesarias, con identificadores `BIGINT`, nombres plurales y borrado físico protegido.
- PostgreSQL aplica las reglas declarativas de una fila. Las reglas que necesitan observar varias filas o tablas se implementarán posteriormente mediante acciones transaccionales de Laravel, sin triggers.
- Las tablas públicas de Laravel habilitan RLS sin políticas y retiran privilegios a `anon`, `authenticated` y `service_role`. La Data API se desactiva manualmente y Laravel conserva una conexión PostgreSQL directa.
- La base desplegada en Supabase contiene datos reales y se trata como persistente. En ella están prohibidos `migrate:fresh`, `db:wipe`, los reinicios o reconstrucciones del esquema, los rollbacks remotos y las migraciones destructivas.
- Los cambios remotos de esquema se harán exclusivamente mediante migraciones conservadoras hacia delante que preserven los datos existentes. Se comprobarán antes en local y CI, se aplicarán manualmente con autorización independiente y, ante un fallo, el proceso se detendrá sin rollback ni reintentos automáticos.
- Solo la base local `recetaria_testing` y la base efímera de CI pueden reconstruirse durante las pruebas.

## Frontend y herramientas de build

- Se utilizará Vite.
- El frontend utilizará TypeScript. Los componentes y páginas React emplearán archivos `*.tsx`, mientras que el código sin JSX empleará archivos `*.ts`.
- Las páginas se organizan como `Pages/<Area>/<Page>/<Page>.tsx`, los componentes como `Components/<Component>/<Component>.tsx` o `Components/<Area>/<Component>/<Component>.tsx`, y los layouts como `Layouts/<Layout>/<Layout>.tsx`.
- Cada carpeta visual final contiene exclusivamente un TSX y su CSS Module homónimo. Los tipos, datos, hooks, utilidades y pruebas viven fuera de esas carpetas.
- Los imports internos entre carpetas utilizan `@/`; solo el CSS Module propio se importa relativamente. No se utilizan barrels `index.ts` ni carpetas `Partials`, `Common`, `Sections` o `Features`.
- Inertia resuelve el nombre lógico `Area/Page` en `Pages/Area/Page/Page.tsx`. Laravel conserva sus URLs y nombres de rutas, aunque los componentes lógicos sigan esta organización interna.
- npm será el gestor de paquetes frontend.
- ESLint se utilizará para el lint frontend.
- Prettier se utilizará para el formato frontend.
- La verificación frontend incluirá build y lint.
- Los comandos concretos se tomarán del `package.json` real una vez exista.
- No se deben inventar scripts que todavía no estén definidos.

## Estilos

- No se utilizará Bootstrap.
- Los estilos específicos de componentes o páginas utilizarán CSS Modules mediante archivos `*.module.css`.
- Los estilos globales utilizarán archivos CSS globales.
- `resources/js/app.tsx` carga directamente `resources/css/global.css` una sola vez; no existe un archivo CSS intermediario. El CSS global contiene variables, reset, tipografía, foco y utilidades realmente compartidas.
- El diseño sigue un enfoque mobile first: la base cubre 320 píxeles y se amplía progresivamente para 768 y 1440 píxeles sin retirar funciones.
- La interfaz utiliza un único tema oscuro. Su paleta base es fondo `#000020`, superficie `#171a4a`, superficie elevada `#2f2c79`, acción y foco `#ffff00`, resaltado `#ffff6a`, texto `#ffffff`, texto secundario `#c7c8e8`, éxito `#64e6a3`, error `#ff7b72`, información `#8da2ff` y texto sobre amarillo `#000020`.
- El texto utiliza la pila tipográfica del sistema y los títulos editoriales utilizan Georgia. No se cargan fuentes externas ni existe selector de tema.
- Texto, controles, estados y foco deben cumplir los contrastes de WCAG 2.2 nivel AA aprobados por el proyecto.
- Los estilos Tailwind generados por Breeze no se utilizarán en el frontend definitivo de Recetaria.
- Tailwind CSS debe eliminarse cuando las páginas y componentes generados hayan sido reemplazados y ya no exista ninguna referencia que lo necesite.

## Calidad y pruebas

El proyecto tendrá:

- Pruebas backend en Laravel.
- Pruebas frontend.
- Lint frontend.
- Build frontend.

Vitest será el ejecutor de pruebas frontend, jsdom proporcionará el entorno DOM y React Testing Library se utilizará para probar el comportamiento de componentes y páginas React. La base inicial de estas herramientas ya está instalada y configurada.

PHPUnit será el ejecutor de las pruebas backend en Laravel. Las pruebas de base de datos usarán exclusivamente una base PostgreSQL 17 local llamada `recetaria_testing`; una barrera previa a `RefreshDatabase` rechazará SQLite, hosts remotos, otros nombres de base y conexiones mediante URL.

GitHub Actions comprobará en los pushes a `main` y `dev`, y en los pull requests dirigidos a cualquiera de esas ramas, las pruebas, el formato, el lint, el build y las dependencias mediante las auditorías de Composer y npm. El workflow utilizará PostgreSQL 17 efímero, permisos de solo lectura y credenciales exclusivas de CI, sin secretos del proyecto.

## Despliegue

- La aplicación se desplegará en Render.
- El despliegue de Laravel en Render se realizará mediante Docker.
- La imagen de despliegue utilizará Apache con la imagen oficial de PHP. La configuración inicial escucha en el puerto `10000` de Render.
- Las migraciones de producción se aplicarán manualmente después de verificarlas; el arranque de Render no ejecutará migraciones automáticamente.

## Git

- `main` es la rama estable y desplegada.
- `dev` es la rama principal de integración para desarrollo.
- Las ramas de trabajo nacen desde `dev`; el desarrollador se encarga de publicarlas e integrarlas.
- El flujo de los agentes se define en [`$recetaria-git-flow`](../.agents/skills/recetaria-git-flow/SKILL.md); para el desarrollador es opcional. Usa comandos Git ordinarios, sin scripts propios, hooks, dependencias ni ampliaciones del CI.
- Los tipos permitidos para ramas y commits de trabajo son `feat`, `fix`, `refactor`, `docs`, `test` y `chore`. El slug es ASCII en kebab-case y los commits de trabajo siguen `<tipo>: <descripción en español>`. El agente no crea commits de merge.
- Solo hay una tarea activa, identificada mediante rama y commit base en la configuración Git local. `MEMORY.md` es informativo. Una rama acompaña la especificación, el plan, la implementación y la verificación.
- La creación y registro de una rama local desde `dev` limpio y sincronizado requieren autorización propia. No hay push inicial obligatorio ni publicación por el agente. Cada commit local requiere mostrar mensaje y rutas exactas y obtener un permiso separado y de un solo uso; cada reintento exige uno nuevo.
- Con verificaciones vigentes, el agente identifica el commit final antes de pedir permiso. Solo tras su éxito retira ambas claves locales con ese mismo permiso y permanece en la rama, que conserva. El desarrollador asume la publicación, integración y posibles conflictos. Tras observar el CI, el resultado se registra en `MEMORY.md` mediante una nueva tarea y rama local `docs/` sometida al mismo flujo; el CI de ese cierre documental no reabre la tarea funcional.
- Si `dev` o su remoto avanzan durante la tarea, el agente informa y continúa en su rama sin modificar la base ni integrar automáticamente. No opera sobre `main` ni reescribe el historial.

## Documentación

- Toda la documentación del proyecto se escribe en español.
- El código y sus identificadores se escriben normalmente en inglés.
- La documentación permanente se mantiene dentro de `docs/` cuando está justificada.

## Desarrollo guiado por especificaciones y agentes

- Los cambios relevantes seguirán el proceso SDD documentado en [`proceso-sdd.md`](proceso-sdd.md).
- Las especificaciones aprobadas se conservarán en `docs/specs/NNN-nombre-descriptivo/` junto con su plan técnico y sus tareas.
- Las skills compartidas del proyecto estarán en `.agents/skills/` y podrán activarse automáticamente o mediante una invocación explícita.
- Los agentes personalizados del proyecto estarán en `.codex/agents/` y los revisores SDD funcionarán en modo de solo lectura.
- Únicamente el agente principal podrá modificar archivos durante una implementación aprobada.
- La aprobación de una especificación o de un plan siempre requerirá una confirmación explícita del desarrollador.
- La aprobación del plan no autorizará por sí sola la implementación.

## Definition of Done

Una tarea no debe considerarse terminada hasta que, cuando corresponda:

- La implementación esté completa dentro del alcance aprobado.
- Las pruebas relevantes estén implementadas o actualizadas.
- Las pruebas relevantes pasen.
- El lint pase.
- El build pase.
- El diff se haya revisado.
- La documentación necesaria esté actualizada.
- `MEMORY.md` refleje el estado operativo actual.

No se debe marcar una tarea como completada si alguno de estos puntos aplicables sigue pendiente.
