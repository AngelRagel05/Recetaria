---
spec: "003"
status: completed
---

# Tareas: Flujo Git supervisado para agentes

- [x] `T-01` — Tras una nueva solicitud de implementación, pasar a `in_progress` y actualizar la interfaz conversacional y los metadatos de la skill existente, sin crear scripts ni repetir la adopción de esta rama. Cubre: `CA-01`.
- [x] `T-02` — Documentar precondiciones de `start`, consulta remota de solo lectura, permiso para crear y registrar la rama y permiso distinto para publicarla antes de modificar archivos. Cubre: `CA-02`, `CA-03`.
- [x] `T-03` — Documentar evidencia SDD, vigencia de verificaciones, propuestas y permisos por commit y push de la rama, y publicación completa antes del merge. Cubre: `CA-04`, `CA-05`.
- [x] `T-04` — Documentar comprobaciones de deriva antes de verificar, cambiar a `dev`, fusionar y publicar `dev`; detenerse sin integración automática si cambia la base. Cubre: `CA-06`, `CA-07`, `CA-08`.
- [x] `T-05` — Separar y autorizar `switch dev`, validar rama y base, volver a consultar el remoto inmediatamente antes del merge y autorizar `merge --no-ff` y push de `dev` por separado. Cubre: `CA-07`, `CA-08`, `CA-10`.
- [x] `T-06` — Sustituir la eliminación de ramas por un cierre autorizado que retire solo las claves locales; adaptar adopción, cancelación y recuperación sin acciones implícitas. Cubre: `CA-09`, `CA-10`.
- [x] `T-07` — Alinear `AGENTS.md`, decisiones técnicas y proceso SDD con los nuevos permisos, la conservación de ramas y la rama `docs/` posterior al CI. Cubre: `CA-04`, `CA-09`, `CA-11`.
- [x] `T-08` — Validar skill y YAML, revisar documentalmente `CA-01` a `CA-11`, buscar contradicciones y confirmar ausencia de cambios en aplicación, dependencias y CI. Cubre: `CA-01` a `CA-11`.
- [x] `T-10` — Actualizar `MEMORY.md`, ejecutar `$recetaria-verify`, revisar diff y whitespace y entregar la evidencia real a `test_reviewer`; cerrar estados solo si todo pasa. Cubre: `CA-01` a `CA-11`.

`T-09` permanece retirada por decisión explícita del desarrollador; su identificador no se reutiliza. Las tareas del contrato anterior no se consideran verificadas para esta versión aprobada de la especificación.
