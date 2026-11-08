# Memoria de Recetaria

## Foco actual

La tarea activa es la especificación en borrador [`009-gestion-colaborativa-recetas`](docs/specs/009-gestion-colaborativa-recetas/spec.md). Define la creación persistente y colaborativa de recetas, invitaciones, perfiles públicos y desactivación reversible de cuentas.

## Estado actual

- La especificación 008 está cerrada e integrada en `dev`.
- El esquema ya contiene recetas y sus asociaciones, pero la aplicación todavía no tiene modelos, acciones, rutas ni pantallas reales para gestionarlas.
- El desarrollador aprobó las reglas funcionales de recetas, coautoría, invitaciones, perfiles, desactivación, reactivación y catálogos recogidas en el borrador 009.
- `spec_reviewer` emitió `PASS` para la especificación 009. Falta la aprobación humana explícita; no existen todavía `plan.md` ni `tasks.md` y no hay implementación autorizada.

## Contexto operativo

- Rama de trabajo: `feat/gestion-colaborativa-recetas`.
- Base de la rama: `dcd8954036f03eac3b5f5f2821a4fa810350cba0`.
- Supabase contiene datos reales. La base desplegada no se borra, reconstruye ni revierte; los cambios futuros serán migraciones conservadoras hacia delante y requerirán autorización independiente para su aplicación remota.
- El agente no publicará ni integrará la rama.

## Problemas conocidos y deuda técnica

No hay bloqueos ni decisiones funcionales pendientes dentro del borrador. Falta la aprobación explícita del desarrollador.

## Siguientes pasos

1. Obtener la aprobación explícita del desarrollador para `spec.md`.
2. Cambiar la especificación a `approved` únicamente después de esa confirmación.
3. Crear `plan.md` y `tasks.md` solo después de la aprobación y mediante la fase de planificación correspondiente.

Estos pasos no autorizan automáticamente ramas, commits, publicación, integración ni implementación.
