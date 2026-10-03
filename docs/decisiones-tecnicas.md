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
- [`Atributos del modelo relacional`](atributos-modelo-relacional.md) es la referencia detallada vigente para consultar atributos, claves, índices, restricciones conceptuales y el funcionamiento de cada relación.
- Ambas vistas son complementarias y deben representar el mismo modelo: las recetas se publican de forma independiente y las imágenes de publicaciones pueden enlazar opcionalmente recetas publicadas.
- El modelo sigue siendo conceptual. Estos documentos no crean ni autorizan migraciones, cambios en PostgreSQL, políticas de borrado, migraciones de datos ni mecanismos ejecutables para las reglas entre tablas.

## Frontend y herramientas de build

- Se utilizará Vite.
- El frontend utilizará TypeScript. Los componentes y páginas React emplearán archivos `*.tsx`, mientras que el código sin JSX empleará archivos `*.ts`.
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
- Los estilos Tailwind generados por Breeze no se utilizarán en el frontend definitivo de Recetaria.
- Tailwind CSS debe eliminarse cuando las páginas y componentes generados hayan sido reemplazados y ya no exista ninguna referencia que lo necesite.

## Calidad y pruebas

El proyecto tendrá:

- Pruebas backend en Laravel.
- Pruebas frontend.
- Lint frontend.
- Build frontend.

Vitest será el ejecutor de pruebas frontend, jsdom proporcionará el entorno DOM y React Testing Library se utilizará para probar el comportamiento de componentes y páginas React. La base inicial de estas herramientas ya está instalada y configurada.

PHPUnit será el ejecutor de las pruebas backend en Laravel.

GitHub Actions comprobará en los pushes a `main` y `dev`, y en los pull requests dirigidos a cualquiera de esas ramas, las pruebas, el formato, el lint, el build y las dependencias mediante las auditorías de Composer y npm. El workflow utilizará permisos de solo lectura y no necesitará secretos del proyecto.

## Despliegue

- La aplicación se desplegará en Render.
- El despliegue de Laravel en Render se realizará mediante Docker.
- La imagen de despliegue utilizará Apache con la imagen oficial de PHP. La configuración inicial escucha en el puerto `10000` de Render.

## Git

- `main` es la rama estable y desplegada.
- `dev` es la rama principal de integración para desarrollo.
- Las ramas de trabajo nacen desde `dev` y vuelven a `dev`.
- El flujo de los agentes se define en [`$recetaria-git-flow`](../.agents/skills/recetaria-git-flow/SKILL.md); para el desarrollador es opcional. Usa comandos Git ordinarios, sin scripts propios, hooks, dependencias ni ampliaciones del CI.
- Los tipos permitidos para ramas y commits de trabajo son `feat`, `fix`, `refactor`, `docs`, `test` y `chore`. El slug es ASCII en kebab-case y los commits de trabajo siguen `<tipo>: <descripción en español>`. El commit automático del merge utiliza excepcionalmente `merge: integra <rama> en dev`.
- Solo hay una tarea activa, identificada mediante rama y commit base en la configuración Git local. `MEMORY.md` es informativo. Una rama acompaña la especificación, el plan, la implementación y la verificación.
- La creación y registro de una rama desde `dev` limpio y sincronizado requieren autorización propia. Su primer push necesita otra y debe concluir antes de modificar archivos. Cada commit, cada push posterior, el cambio a `dev`, el merge, el push de `dev` y el cierre necesitan permisos separados y de un solo uso; todos los reintentos requieren permisos nuevos.
- Con verificaciones vigentes, la rama de trabajo completamente publicada y base validada, el agente cambia a `dev` tras su permiso y ejecuta allí `merge --no-ff` solo con otro. Publicar `dev` exige otro permiso. El cierre autorizado retira únicamente las dos claves de tarea activa; conserva las ramas de trabajo local y remota. Tras observar el CI, el resultado se registra en `MEMORY.md` desde una nueva rama `docs/` sometida al mismo flujo y también conservada.
- Si `dev`, el remoto o la base cambian, el agente se detiene para consultar. No integra ni reescribe automáticamente y no opera sobre `main`.

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
