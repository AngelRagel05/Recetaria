# Memoria de Recetaria

## Foco actual

Configurar las bases iniciales del proyecto conforme a las decisiones técnicas documentadas y aprobadas. Actualmente no hay ningún trabajo de implementación autorizado ni en curso.

## Estado actual

- Recetaria se encuentra en su fase inicial de configuración.
- `AGENTS.md` y `MEMORY.md` son los primeros artefactos de gobernanza del proyecto.
- La pila tecnológica confirmada es Laravel, React y PostgreSQL alojado en Supabase.
- La arquitectura inicial integra Laravel y React mediante Inertia.js, con el frontend dentro de `resources/js`.
- Laravel Breeze será la base de autenticación y Vite será la herramienta de build frontend.
- El frontend utilizará TypeScript: `*.tsx` para componentes y páginas React y `*.ts` para código sin JSX.
- El frontend generado por Breeze se rehacerá con CSS Modules y CSS global, conservando la lógica de autenticación necesaria y eliminando Tailwind cuando deje de utilizarse.
- Vitest será el ejecutor de pruebas frontend, jsdom proporcionará el entorno DOM y React Testing Library se utilizará para probar componentes y páginas React.
- PHPUnit se utilizará para las pruebas backend; ESLint para el lint frontend; Prettier para el formato; y npm para gestionar los paquetes frontend.
- Las decisiones técnicas iniciales y sus límites están documentados en [`docs/decisiones-tecnicas.md`](docs/decisiones-tecnicas.md).
- El repositorio está alojado en GitHub.
- El despliegue está previsto en Render mediante Docker.
- Los servicios externos se gestionarán mediante una cuenta de Google creada específicamente para Recetaria.

## En curso

No hay ningún trabajo de implementación en curso.

## Alcance de esta memoria

`MEMORY.md` solo debe contener trabajo incompleto, decisiones pendientes, contexto y estado que sean relevantes para el foco actual del proyecto.

No debe convertirse en:

- Un backlog de funcionalidades futuras.
- Una lista de todo lo que todavía no existe.
- Una lista de todas las decisiones que algún día habrá que tomar.
- Un histórico de tareas completadas.
- Una duplicación de Git o de la documentación permanente.

Una ausencia o una decisión pendiente solo debe aparecer en `MEMORY.md` cuando sea relevante para el trabajo actual o para continuar correctamente desde el estado presente.

Cuando deje de ser relevante:

- Debe eliminarse de `MEMORY.md`; o
- trasladarse a documentación permanente si posee valor a largo plazo.

## Decisiones pendientes

Actualmente no hay decisiones pendientes identificadas que bloqueen el foco actual. Cualquier nueva decisión necesaria corresponderá al desarrollador; un agente no debe convertirla en una decisión aceptada sin aprobación explícita.

## Contexto relevante

- Recetaria será una aplicación web para descubrir, crear y compartir recetas.
- Está concebida para ser una aplicación real, mantenible y razonablemente escalable, no solo una demostración.
- El proyecto no se desarrolla mediante vibe coding. Los agentes apoyan al desarrollador, pero no son responsables de las decisiones de producto ni técnicas.
- Todos los agentes deben leer `AGENTS.md` y este archivo antes de comenzar una tarea relevante.

## Problemas conocidos

Actualmente no hay ningún problema conocido registrado.

## Deuda técnica

Actualmente no hay ninguna deuda técnica registrada.

## Siguientes pasos

- Continuar la configuración inicial del proyecto junto con el desarrollador.
- Configurar el proyecto conforme a las decisiones documentadas cuando el desarrollador autorice expresamente la implementación.
- Registrar únicamente las decisiones tomadas explícitamente por el desarrollador.

Estos siguientes pasos describen la dirección natural del proyecto; no constituyen una autorización automática para ejecutar trabajo.
