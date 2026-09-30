---
name: recetaria-spec
description: Crear o revisar especificaciones SDD para cambios relevantes de Recetaria antes de planificar o implementar. Usar ante funcionalidades, reglas de negocio, datos, arquitectura, seguridad, dependencias, servicios, almacenamiento, despliegue, UX significativa o refactors estructurales; no usar para erratas, formato ni ajustes internos evidentes sin cambio de comportamiento.
---

# Especificar cambios de Recetaria

Define qué debe conseguir un cambio relevante sin decidir cómo se implementará.

## Preparación

1. Lee por completo `AGENTS.md`, `MEMORY.md`, `docs/decisiones-tecnicas.md` y `docs/proceso-sdd.md`.
2. Inspecciona únicamente el código y la documentación necesarios para separar hechos existentes de decisiones pendientes.
3. Clasifica el cambio según `docs/proceso-sdd.md`. Si corresponde al flujo ligero, explícalo y no crees una carpeta en `docs/specs/`.

## Crear o revisar la especificación

1. Para una especificación nueva, identifica el siguiente número secuencial de tres dígitos dentro de `docs/specs/` y crea `NNN-nombre-descriptivo/spec.md` a partir de [assets/spec-template.md](assets/spec-template.md).
2. Mantén el documento en español y con `status: draft`.
3. Documenta únicamente decisiones ya aprobadas. Registra por separado cualquier decisión pendiente que pueda cambiar el comportamiento, los datos, la seguridad, la arquitectura, las integraciones, el almacenamiento, la infraestructura o la experiencia de usuario.
4. Formula criterios de aceptación observables y numerados como `CA-01`, `CA-02` y sucesivos.
5. No crees `plan.md` ni `tasks.md`, no propongas detalles de implementación como decisiones cerradas y no modifiques código de la aplicación.

## Puerta de requisitos

Cuando el borrador esté listo, delega su revisión al agente personalizado `requirements_reviewer`, espera su resultado y conserva el informe.

- Si el resultado es `BLOCKED`, mantén `status: draft`, presenta los bloqueos y detente.
- Si el resultado es `PASS`, presenta la especificación al desarrollador y espera una confirmación explícita.
- Cambia el estado a `approved` solo cuando el desarrollador apruebe inequívocamente esa especificación. El silencio, una petición de cambios o la continuación de la conversación no cuentan como aprobación.
- La aprobación de la especificación autoriza únicamente la planificación posterior, nunca la implementación.

Si no está disponible el agente requerido, informa que la revisión sigue pendiente y no declares superada la puerta.
