# Decisiones técnicas iniciales

Este documento recoge las decisiones técnicas iniciales aprobadas para Recetaria y sus límites. No constituye un registro formal de decisiones de arquitectura (ADR).

## Arquitectura

- Laravel se utilizará como backend.
- React se utilizará como frontend.
- Inertia.js integrará Laravel y React.
- El frontend estará dentro de `resources/js`.
- En esta fase no se utilizará una SPA separada ni una API independiente como arquitectura principal.

## Autenticación

- Laravel Breeze será la base de autenticación dentro de la arquitectura Laravel, Inertia y React.
- Se conservarán las rutas y la lógica backend de autenticación proporcionadas por Breeze.
- Se reutilizará el comportamiento frontend necesario para los formularios de autenticación, como el envío mediante Inertia, los errores de validación y los estados de procesamiento.
- Las páginas, layouts y componentes visuales generados por Breeze se reharán con TypeScript, CSS Modules y CSS global.
- No se deben asumir funcionalidades adicionales todavía no decididas, como login con Google, OAuth adicional, verificación de email, autenticación multifactor, permisos avanzados o roles.

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

Vitest será el ejecutor de pruebas frontend, jsdom proporcionará el entorno DOM y React Testing Library se utilizará para probar el comportamiento de componentes y páginas React. Su instalación y configuración no forman parte de esta decisión documental y requieren una tarea de implementación autorizada expresamente.

PHPUnit será el ejecutor de las pruebas backend en Laravel.

## Despliegue

- La aplicación se desplegará en Render.
- El despliegue de Laravel en Render se realizará mediante Docker.

## Git

- `main` es la rama estable y desplegada.
- `dev` es la rama principal de integración para desarrollo.
- Las ramas de trabajo nacen desde `dev` y vuelven a `dev`.
- Las ramas utilizarán prefijos según el tipo de cambio, incluidos al menos `feat/`, `fix/`, `refactor/` y `docs/`.
- No se debe inventar una lista exhaustiva de prefijos mientras no resulte necesaria.
- No se deben crear commits ni hacer push automáticamente salvo petición explícita del desarrollador.

## Documentación

- Toda la documentación del proyecto se escribe en español.
- El código y sus identificadores se escriben normalmente en inglés.
- La documentación permanente se mantiene dentro de `docs/` cuando está justificada.
- Las skills para agentes no se crearán todavía; su creación queda como trabajo futuro pendiente.

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
