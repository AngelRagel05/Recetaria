# Memoria de Recetaria

## Foco actual

Publicar y validar en una sesión nueva de Codex el sistema SDD implantado localmente.

## Estado actual

- La base Laravel 12 + React + Inertia está confirmada en `main` y `dev`, con frontend TypeScript en `resources/js` y autenticación Breeze adaptada a CSS Modules y CSS global, sin Tailwind.
- La corrección del CI del commit `0ba1d54` está publicada en `main` y `dev`. Su ejecución remota no se ha podido verificar desde el entorno actual.
- El sistema SDD está implementado localmente en `feat/sdd-agents`: proceso permanente, tres skills compartidas y tres agentes revisores de solo lectura.
- Las skills se han validado con `quick_validate.py` y su descubrimiento se ha confirmado mediante la interfaz local de Codex. La configuración TOML, las simulaciones de las puertas, las pruebas, el lint, el formato y el build pasan.
- Las decisiones aprobadas están en [`docs/decisiones-tecnicas.md`](docs/decisiones-tecnicas.md) y el flujo está definido en [`docs/proceso-sdd.md`](docs/proceso-sdd.md).

## En curso

La implantación está completada y verificada localmente; su publicación está pendiente de autorización. Después de publicarla habrá que comprobar el CI y el descubrimiento de skills y agentes en una sesión nueva de Codex.

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

No hay decisiones técnicas pendientes para publicar esta implantación. Cualquier nueva decisión necesaria corresponderá al desarrollador; un agente no debe convertirla en una decisión aceptada sin aprobación explícita.

## Contexto relevante

- Recetaria será una aplicación web para descubrir, crear y compartir recetas.
- Está concebida para ser una aplicación real, mantenible y razonablemente escalable, no solo una demostración.
- El proyecto no se desarrolla mediante vibe coding. Los agentes apoyan al desarrollador, pero no son responsables de las decisiones de producto ni técnicas.
- Todos los agentes deben leer `AGENTS.md` y este archivo antes de comenzar una tarea relevante.

## Problemas conocidos

La instalación local de Codex CLI (`0.121.0`) no puede completar una sesión conversacional nueva con el catálogo de modelos actual. El descubrimiento de las skills sí se ha comprobado mediante la interfaz local; la prueba integral de sesión nueva queda pendiente en una instalación compatible.

## Deuda técnica

Actualmente no hay ninguna deuda técnica registrada.

## Siguientes pasos

- Publicar la rama cuando el desarrollador lo solicite.
- Comprobar el CI y abrir una sesión nueva de Codex compatible para confirmar el descubrimiento y la ejecución de skills y agentes.
- Tras esas comprobaciones, retirar los pendientes de esta memoria y reflejar el resultado real.

Estos siguientes pasos describen la dirección natural del proyecto; no constituyen una autorización automática para ejecutar trabajo.
