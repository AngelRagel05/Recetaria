# Proceso SDD de Recetaria

## Propósito

Este documento define el proceso de desarrollo guiado por especificaciones (SDD) de Recetaria. Su objetivo es separar las decisiones de producto, la planificación técnica, la implementación y la verificación para que ningún agente avance mediante supuestos no aprobados.

`AGENTS.md` conserva la autoridad sobre la gobernanza general del proyecto. Este documento describe cómo aplicar esas reglas a un cambio concreto.

## Clasificación del cambio

El proceso completo es obligatorio para:

- Funcionalidades nuevas o eliminadas.
- Reglas de negocio.
- Modelos de datos y relaciones.
- Arquitectura, APIs o contratos de integración.
- Autenticación, autorización y políticas de seguridad.
- Dependencias y servicios externos.
- Almacenamiento e infraestructura.
- Despliegue.
- Cambios significativos en la experiencia de usuario.
- Refactorizaciones estructurales o deuda técnica relevante.

Las erratas, los cambios de formato y los ajustes internos evidentes que no alteran el comportamiento utilizan un flujo ligero: plan breve, implementación, verificación y revisión del diff. Si la clasificación no es evidente, el agente debe solicitar una decisión al desarrollador.

## Artefactos

Cada cambio relevante se conserva en una carpeta con numeración secuencial de tres dígitos:

```text
docs/specs/NNN-nombre-descriptivo/
├── spec.md
├── plan.md
└── tasks.md
```

La carpeta `docs/specs/` se crea cuando exista la primera especificación real. No se deben añadir ejemplos ficticios ni archivos de relleno.

Los agentes utilizan una sola rama de trabajo para la especificación, el plan, la implementación y la verificación de cada tarea. Antes de modificar archivos, aplican [`$recetaria-git-flow`](../.agents/skills/recetaria-git-flow/SKILL.md): la creación local y el registro de la rama desde `dev` requieren autorización propia; no se exige push inicial. La skill gestiona Git y no sustituye ninguna puerta SDD.

### Especificación

`spec.md` define el problema, el objetivo, el alcance, los actores, los flujos, las reglas, los casos límite y los criterios de aceptación. Su frontmatter contiene:

```yaml
---
id: "NNN"
title: "Título descriptivo"
status: draft
---
```

Los estados válidos son `draft`, `approved`, `completed` y `superseded`.

### Plan técnico

`plan.md` convierte una especificación aprobada en un enfoque implementable. Su frontmatter contiene:

```yaml
---
spec: "NNN"
status: draft
---
```

Los estados válidos son `draft` y `approved`.

### Tareas

`tasks.md` divide el plan en pasos verificables y relaciona cada paso con criterios de aceptación. Su frontmatter contiene:

```yaml
---
spec: "NNN"
status: pending
---
```

Los estados válidos son `pending`, `in_progress` y `completed`. Este archivo sigue únicamente el trabajo de su especificación y no sustituye a `MEMORY.md` ni constituye un backlog general.

## Puertas de aprobación

### 1. Especificación

1. `$recetaria-spec` crea o revisa la especificación en estado `draft`.
2. `spec_reviewer` la revisa en modo de solo lectura.
3. Un resultado `BLOCKED` mantiene el estado `draft`.
4. Un resultado `PASS` permite solicitar la aprobación del desarrollador.
5. El estado cambia a `approved` únicamente después de una confirmación explícita del desarrollador.

### 2. Planificación

1. `$recetaria-plan` comprueba que `spec.md` tenga estado `approved`.
2. Crea o revisa `plan.md` y `tasks.md` sin implementar código.
3. `plan_reviewer` revisa ambos documentos en modo de solo lectura.
4. Un resultado `BLOCKED` impide aprobar el plan.
5. `plan.md` cambia a `approved` únicamente después de una confirmación explícita del desarrollador.

### 3. Implementación

Una especificación y un plan aprobados no autorizan por sí solos la implementación. El desarrollador debe solicitarla explícitamente. Solo el agente principal puede modificar archivos; los agentes personalizados permanecen en modo de solo lectura.

Durante la implementación, `tasks.md` cambia a `in_progress` y únicamente se marcan las tareas que se hayan completado realmente.

### 4. Verificación y cierre

1. `$recetaria-verify` ejecuta los comandos reales de calidad aplicables al cambio y revisa el diff.
2. `test_reviewer` relaciona los criterios de aceptación con las pruebas y verificaciones ejecutadas.
3. Cualquier fallo o resultado `BLOCKED` impide cerrar el cambio y se informa sin repararlo automáticamente.
4. Cuando todas las verificaciones pasan, `tasks.md` cambia a `completed` y `spec.md` a `completed`.
5. Se actualizan la documentación necesaria y `MEMORY.md`.

## Contrato de los revisores

Los tres revisores responden en español y utilizan siempre esta estructura:

```text
Resultado: PASS | BLOCKED
Bloqueos:
Riesgos no bloqueantes:
Evidencias:
```

Los revisores no pueden aprobar fases, tomar decisiones de producto, modificar archivos ni convertir una recomendación en autorización.

Una aprobación de especificación o plan, un `PASS` de cualquier revisor y una solicitud de implementación no autorizan crear una rama ni hacer commits. Cada acción lógica que cambie Git requiere un permiso específico, inmediato y de un solo uso; las comprobaciones de solo lectura no lo necesitan. Los commits de cada fase pueden acumularse localmente en una sola rama. Tras las verificaciones aplicables y `test_reviewer`, el agente señala el commit final y solicita un permiso que cubre prepararlo, crearlo y, solo después de su éxito, retirar las dos claves locales de tarea activa. El agente permanece en esa rama; el desarrollador se encarga de publicar e integrar, sin pushes, cambios a `dev`, merges ni borrado de ramas por parte del agente.

## Cierre de memoria

Cuando el trabajo depende de publicación o CI externo, `MEMORY.md` se cierra en dos etapas:

1. Después de la verificación local registra que la implementación local está completa y qué publicación o comprobación externa permanece pendiente.
2. Después de publicar y comprobar el CI elimina ese pendiente y refleja el resultado real.

La segunda actualización se realiza en una nueva tarea y rama local `docs/` mediante el mismo flujo de permisos, después de que el desarrollador publique e integre el trabajo y se observe su CI. El agente no modifica `dev` directamente ni publica la rama `docs/`; esa actualización registra el cierre documental del cambio funcional. El CI provocado por ella no reabre la tarea ya verificada.
