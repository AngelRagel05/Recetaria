---
name: recetaria-plan
description: Convertir una especificación SDD aprobada de Recetaria en un plan técnico y tareas verificables, sin implementar. Usar solo cuando exista `docs/specs/NNN-nombre/spec.md` con estado `approved`; no usar para redactar requisitos, cambios triviales ni comenzar código.
---

# Planificar cambios aprobados de Recetaria

Convierte una especificación aprobada en instrucciones suficientes para que el agente principal pueda implementarla sin tomar decisiones relevantes nuevas.

## Comprobaciones previas

1. Lee por completo `AGENTS.md`, `MEMORY.md`, `docs/decisiones-tecnicas.md`, `docs/proceso-sdd.md` y la especificación indicada.
2. Verifica que `spec.md` tenga `status: approved`. Si no lo tiene, detente y explica que la planificación está bloqueada.
3. Comprueba que no existan decisiones pendientes que afecten al enfoque técnico. No las resuelvas por inferencia.

## Crear o revisar el plan

1. Crea `plan.md` desde [assets/plan-template.md](assets/plan-template.md) y `tasks.md` desde [assets/tasks-template.md](assets/tasks-template.md) dentro de la misma carpeta de la especificación.
2. Mantén `plan.md` en `status: draft` y `tasks.md` en `status: pending`.
3. Describe los componentes afectados, los contratos, los datos, las fases, las pruebas, la documentación y el despliegue aplicable sin ampliar el alcance aprobado.
4. Divide el trabajo en tareas pequeñas y ordenadas. Relaciona cada tarea con uno o más criterios de aceptación.
5. No modifiques código, migraciones, configuración de aplicación ni documentos ajenos a la planificación de esa especificación.

## Puerta de arquitectura

Cuando el plan y las tareas estén listos, delega su revisión al agente personalizado `architecture_reviewer`, espera su resultado y conserva el informe.

- Si el resultado es `BLOCKED`, mantén `plan.md` en `status: draft`, presenta los bloqueos y detente.
- Si el resultado es `PASS`, presenta el plan al desarrollador y espera una confirmación explícita.
- Cambia `plan.md` a `status: approved` solo cuando el desarrollador apruebe inequívocamente ese plan.
- Mantén `tasks.md` en `status: pending` hasta que exista una solicitud explícita de implementación.
- La aprobación del plan no autoriza a implementar.

Si no está disponible el agente requerido, informa que la revisión sigue pendiente y no declares superada la puerta.
