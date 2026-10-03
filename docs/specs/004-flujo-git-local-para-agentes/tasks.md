---
spec: "004"
status: completed
---

# Tareas: Flujo Git local para agentes

- [x] `T-01` — Tras una solicitud explícita de implementación, pasar a `in_progress` y adaptar la interfaz y metadatos de la skill existente, preservando la invocación implícita. Cubre: `CA-01`.
- [x] `T-02` — Documentar `start` desde `dev` limpio y sincronizado, permiso para crear y registrar una rama local y ausencia de push inicial. Cubre: `CA-02`.
- [x] `T-03` — Documentar puertas SDD, verificaciones vigentes, selección literal de rutas, mensajes y autorización individual de varios commits locales. Cubre: `CA-03`.
- [x] `T-04` — Documentar el commit final autorizado y la retirada posterior de ambas claves solo tras éxito; exponer fallos y recuperaciones sin permisos implícitos. Cubre: `CA-04`, `CA-05`.
- [x] `T-05` — Reducir la skill a fases locales, informar sin bloquear ante deriva de `dev` y adaptar `adopt` y `cancel` sin upstream obligatorio ni operaciones de publicación o integración. Cubre: `CA-06`, `CA-07`, `CA-08`.
- [x] `T-06` — Alinear `AGENTS.md`, decisiones técnicas, proceso SDD y `MEMORY.md` con el nuevo límite del agente, la tarea `docs/` posterior al CI y la 003 histórica intacta. Cubre: `CA-09`, `CA-10`.
- [x] `T-07` — Validar skill y YAML, mapear `CA-01` a `CA-10`, buscar contradicciones en reglas vigentes, revisar el diff y comprobar whitespace y alcance. Cubre: `CA-01` a `CA-10`.
- [x] `T-08` — Ejecutar `$recetaria-verify`, entregar evidencia documental a `test_reviewer` y cerrar estados SDD y memoria solo si todo pasa; dejar commit y publicación para permisos posteriores. Cubre: `CA-01` a `CA-10`.
