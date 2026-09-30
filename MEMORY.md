# Memoria de Recetaria

## Foco actual

Continuar desde la base inicial Laravel + React + Inertia y coordinar con el desarrollador la conexión real a los servicios externos cuando corresponda.

## Estado actual

- La base Laravel 12 + React + Inertia está instalada en la rama de trabajo `feat/initial-setup`, con frontend TypeScript en `resources/js` y autenticación Breeze adaptada a CSS Modules y CSS global, sin Tailwind.
- PostgreSQL de Supabase está preparado mediante variables de entorno y el `Dockerfile` para Render utiliza Apache.
- Las pruebas PHP y frontend, el lint, el formato y el build local pasan.
- Las decisiones aprobadas y las instrucciones de puesta en marcha están en [`docs/decisiones-tecnicas.md`](docs/decisiones-tecnicas.md) y [`README.md`](README.md).

## En curso

No hay ningún trabajo de implementación en curso. La base preparada no se ha confirmado mediante commit ni se ha enviado al repositorio remoto.

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

No hay decisiones técnicas pendientes que bloqueen esta base inicial. Cualquier nueva decisión necesaria corresponderá al desarrollador; un agente no debe convertirla en una decisión aceptada sin aprobación explícita.

## Contexto relevante

- Recetaria será una aplicación web para descubrir, crear y compartir recetas.
- Está concebida para ser una aplicación real, mantenible y razonablemente escalable, no solo una demostración.
- El proyecto no se desarrolla mediante vibe coding. Los agentes apoyan al desarrollador, pero no son responsables de las decisiones de producto ni técnicas.
- Todos los agentes deben leer `AGENTS.md` y este archivo antes de comenzar una tarea relevante.

## Problemas conocidos

La conexión real con Supabase y la construcción de la imagen Docker siguen sin verificarse; requieren, respectivamente, credenciales de la base y un entorno con Docker.

## Deuda técnica

Actualmente no hay ninguna deuda técnica registrada.

## Siguientes pasos

- Revisar con el desarrollador la base inicial preparada.
- Configurar las credenciales de Supabase y ejecutar las migraciones cuando estén disponibles y el desarrollador autorice ese paso.
- Registrar únicamente las decisiones tomadas explícitamente por el desarrollador.

Estos siguientes pasos describen la dirección natural del proyecto; no constituyen una autorización automática para ejecutar trabajo.
