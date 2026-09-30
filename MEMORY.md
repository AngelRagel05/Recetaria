# Memoria de Recetaria

## Foco actual

Confirmar la ejecución de los tres revisores personalizados del sistema SDD.

## Estado actual

- La base Laravel 12 + React + Inertia está confirmada en `main` y `dev`, con frontend TypeScript en `resources/js` y autenticación Breeze adaptada a CSS Modules y CSS global, sin Tailwind.
- La corrección del CI del commit `0ba1d54` está publicada en `main` y `dev`.
- El sistema SDD está publicado en `dev` mediante el commit `0bf9823`: proceso permanente, tres skills compartidas y tres agentes revisores de solo lectura.
- El workflow **Integración y seguridad #4** de GitHub Actions ha pasado para `0bf9823` en `dev`, incluidos pruebas, formato, lint, build y auditorías configuradas.
- Las tres skills se han validado con `quick_validate.py`, se descubren en una sesión nueva de Codex y responden a su invocación explícita. La configuración TOML y las simulaciones de las puertas también pasan.
- Los tres revisores están validados estructuralmente; falta confirmar su invocación real por nombre en Codex.
- Las decisiones aprobadas están en [`docs/decisiones-tecnicas.md`](docs/decisiones-tecnicas.md) y el flujo está definido en [`docs/proceso-sdd.md`](docs/proceso-sdd.md).

## En curso

La implantación, la publicación en `dev`, el CI y el descubrimiento de las skills están confirmados. Solo queda ejecutar una prueba de humo de `requirements_reviewer`, `architecture_reviewer` y `test_reviewer`.

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

No hay decisiones técnicas pendientes para cerrar esta implantación. Cualquier nueva decisión necesaria corresponderá al desarrollador; un agente no debe convertirla en una decisión aceptada sin aprobación explícita.

## Contexto relevante

- Recetaria será una aplicación web para descubrir, crear y compartir recetas.
- Está concebida para ser una aplicación real, mantenible y razonablemente escalable, no solo una demostración.
- El proyecto no se desarrolla mediante vibe coding. Los agentes apoyan al desarrollador, pero no son responsables de las decisiones de producto ni técnicas.
- Todos los agentes deben leer `AGENTS.md` y este archivo antes de comenzar una tarea relevante.

## Problemas conocidos

No hay problemas conocidos en el código ni en el CI. La ejecución por nombre de los tres revisores personalizados todavía no se ha confirmado.

## Deuda técnica

Actualmente no hay ninguna deuda técnica registrada.

## Siguientes pasos

- Ejecutar una prueba de humo de los tres revisores personalizados sin modificar archivos.
- Tras confirmar sus resultados y el modo de solo lectura, retirar este último pendiente de la memoria.

Estos siguientes pasos describen la dirección natural del proyecto; no constituyen una autorización automática para ejecutar trabajo.
