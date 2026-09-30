---
name: recetaria-verify
description: Verificar una implementación terminada de Recetaria contra su especificación SDD, plan, tareas y controles reales del repositorio, o aplicar la verificación proporcional de un cambio ligero. Usar después de implementar y antes de declarar el trabajo completado; no usar para reparar fallos ni para autorizar publicación.
---

# Verificar cambios de Recetaria

Comprueba el resultado observable y devuelve un cierre basado en evidencias. No corrijas los fallos encontrados durante esta ejecución.

## Preparación

1. Lee por completo `AGENTS.md`, `MEMORY.md`, `docs/decisiones-tecnicas.md` y `docs/proceso-sdd.md`.
2. Revisa el estado de Git y el diff completo para identificar el alcance real.
3. Para un cambio SDD, lee `spec.md`, `plan.md` y `tasks.md`. Exige una especificación y un plan aprobados, además de una solicitud explícita de implementación.
4. Para un cambio ligero, confirma que no pertenece a una categoría que requiera el flujo SDD completo.

## Verificación

1. Relaciona cada criterio de aceptación con una prueba o comprobación observable.
2. Obtén los comandos vigentes desde `package.json`, `composer.json`, `README.md` y el workflow de CI. No inventes scripts ni instales herramientas.
3. Ejecuta las comprobaciones aplicables. La base actual incluye formato PHP sin escritura, pruebas PHP, lint, formato frontend sin escritura, pruebas frontend y build.
4. Ejecuta auditorías de dependencias únicamente cuando el cambio afecte a dependencias o cuando el alcance aprobado las exija.
5. Revisa que la documentación esté actualizada, que no haya secretos ni cambios accidentales y que `MEMORY.md` describa el estado operativo real.
6. Conserva los comandos ejecutados y sus resultados como evidencias.

## Puerta de pruebas

Delega la revisión final al agente personalizado `test_reviewer`. Entrégale la especificación, el plan, las tareas, el diff y los resultados de verificación, y espera su respuesta.

- Si una comprobación falla o el resultado es `BLOCKED`, informa de los fallos y detente sin modificar la implementación para repararlos.
- Si todo pasa, el agente principal puede marcar las tareas realmente terminadas, cambiar `tasks.md` a `completed`, cambiar `spec.md` a `completed` y actualizar `MEMORY.md`.
- No cambies `plan.md` después de su aprobación salvo que el desarrollador reabra formalmente la planificación.
- No crees commits, no hagas push y no declares verificado un CI remoto que no hayas observado.

Si no está disponible el agente requerido, informa que la revisión final sigue pendiente y no declares el cambio completado.
