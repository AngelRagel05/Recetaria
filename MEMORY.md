# Memoria de Recetaria

## Foco actual

No hay una tarea activa. El modelo relacional inicial está integrado y verificado en `dev`.

## Estado actual

- La base Laravel 12 + React + Inertia está confirmada en `main` y `dev`, con frontend TypeScript en `resources/js` y autenticación Breeze adaptada a CSS Modules y CSS global, sin Tailwind.
- El sistema SDD está publicado en `dev` mediante el commit `0bf9823`: proceso permanente, tres skills compartidas y tres agentes revisores de solo lectura.
- Las tres skills se han validado con `quick_validate.py`, se descubren en una sesión nueva de Codex y responden a su invocación explícita. La configuración TOML y las simulaciones de las puertas también pasan.
- `requirements_reviewer`, `architecture_reviewer` y `test_reviewer` se han ejecutado por nombre sobre la especificación `001`; sus revisiones finales devolvieron `PASS`.
- El modelo relacional inicial está integrado en `dev` mediante el commit `ea866a8`: contiene 21 tablas de dominio, 28 relaciones Mermaid, los roles iniciales `member` y `admin` con `member` como predeterminado, y ninguna migración ni cambio en PostgreSQL.
- Pint, las 25 pruebas PHP, ESLint, Prettier, Vitest, el build y las comprobaciones documentales pasan.
- El workflow [**Integración y seguridad**](https://github.com/AngelRagel05/Recetaria/actions/runs/36794565559) ha pasado para `ea866a8` en `dev`.
- Las decisiones aprobadas están en [`docs/decisiones-tecnicas.md`](docs/decisiones-tecnicas.md) y el flujo está definido en [`docs/proceso-sdd.md`](docs/proceso-sdd.md).

## En curso

No hay trabajo en curso relacionado con el modelo relacional inicial.

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

No hay decisiones técnicas pendientes para cerrar el modelo conceptual. Los atributos, restricciones SQL, políticas de borrado, migraciones y autorización requerirán especificaciones posteriores.

## Contexto relevante

- Recetaria será una aplicación web para descubrir, crear y compartir recetas.
- Está concebida para ser una aplicación real, mantenible y razonablemente escalable, no solo una demostración.
- El proyecto no se desarrolla mediante vibe coding. Los agentes apoyan al desarrollador, pero no son responsables de las decisiones de producto ni técnicas.
- Todos los agentes deben leer `AGENTS.md` y este archivo antes de comenzar una tarea relevante.

## Problemas conocidos

No hay problemas conocidos en la implementación ni en su CI.

## Deuda técnica

Actualmente no hay ninguna deuda técnica registrada.

## Siguientes pasos

- Acordar con el desarrollador el siguiente foco antes de iniciar otra especificación o implementación.

Estos siguientes pasos describen la dirección natural del proyecto; no constituyen una autorización automática para ejecutar trabajo.
