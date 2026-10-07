# Memoria de Recetaria

## Foco actual

La tarea activa es la especificación aprobada [`008-arquitectura-frontend-y-tema-oscuro`](docs/specs/008-arquitectura-frontend-y-tema-oscuro/spec.md). Su objetivo es migrar el frontend existente a la arquitectura por áreas aprobada y aplicar un único tema oscuro sin cambiar URLs, contratos ni comportamiento.

## Estado actual

- `dev` local y remota coincidían en `1a49f77a0dbaa677bc1a44fc1e72237462e26ffd` al crear la rama.
- El frontend actual sigue sin modificar: conserva la estructura anterior, el prototipo social, las pantallas Breeze adaptadas, sus pruebas y el tema claro anterior.
- PostgreSQL, Supabase, autenticación y dependencias quedan fuera del alcance de esta tarea.

## En curso

- La especificación 008 documenta la estructura visual, la resolución anidada de Inertia, la descomposición aprobada, la prueba arquitectónica y la paleta oscura.
- El desarrollador aprobó el enfoque mobile first con comprobaciones a 320, 768 y 1440 píxeles y WCAG 2.2 AA con contrastes concretos para texto, controles y foco.
- Durante la implementación, el desarrollador decidió eliminar `resources/css/app.css` por innecesario y cargar `global.css` directamente una sola vez desde `app.tsx`.
- `spec_reviewer` emitió `PASS` y el desarrollador aprobó explícitamente la especificación.
- `plan_reviewer` emitió `PASS`, el desarrollador aprobó explícitamente `plan.md` y solicitó comenzar la implementación. `tasks.md` está en `in_progress`.
- La implementación del frontend está autorizada y en curso; todavía no se ha completado ni verificado.

## Contexto operativo

- Rama de trabajo: `refactor/arquitectura-frontend-y-tema-oscuro`.
- Base de la rama: `1a49f77a0dbaa677bc1a44fc1e72237462e26ffd`.
- MiKiWi es solo una referencia de organización; no se copiarán su código, diseño ni excepciones históricas.
- El agente no publicará ni integrará la rama.

## Problemas conocidos y deuda técnica

No hay un bloqueo técnico conocido. Las puertas SDD previas a la implementación siguen pendientes.

## Siguientes pasos

1. Implementar las tareas `T-01` a `T-10` dentro del alcance aprobado.
2. Ejecutar las verificaciones técnicas y visuales previstas en `T-11` y `T-12`.
3. Someter las evidencias a `test_reviewer` antes del cierre.

Estos pasos no autorizan automáticamente la planificación, la implementación, commits, publicación ni integración.
