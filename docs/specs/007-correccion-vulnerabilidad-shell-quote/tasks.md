---
spec: "007"
status: completed
---

# Tareas: Corrección de vulnerabilidad en shell-quote

- [x] `T-01` — Añadir en `package.json` la sustitución exacta y limitada de `shell-quote 1.11.0` bajo `concurrently`, sin cambiar otras dependencias. Cubre: `CA-01`, `CA-05`, `CA-07`.
- [x] `T-02` — Regenerar `package-lock.json` con npm y comprobar que el diff de dependencias solo refleja la resolución aprobada. Cubre: `CA-01`, `CA-07`.
- [x] `T-03` — Ejecutar una instalación limpia y verificar el árbol efectivo de `concurrently` y `shell-quote`. Cubre: `CA-01`.
- [x] `T-04` — Ejecutar `npm audit` sin exclusiones y una coordinación breve y finita mediante el binario local de `concurrently`. Cubre: `CA-02`, `CA-03`.
- [x] `T-05` — Ejecutar las pruebas frontend, ESLint, Prettier y el build configurados. Cubre: `CA-04`.
- [x] `T-06` — Comprobar que `composer.json` y `.github/workflows/ci.yml` no cambian, ejecutar `git diff --check` y revisar el diff completo para descartar código funcional, secretos o actualizaciones ajenas. Cubre: `CA-03`, `CA-05`, `CA-06`, `CA-07`.
- [x] `T-07` — Actualizar `MEMORY.md`, entregar las evidencias a `test_reviewer` y cerrar los artefactos SDD únicamente con resultado `PASS`, conservando el nuevo CI como pendiente externo. Cubre: `CA-01`, `CA-02`, `CA-03`, `CA-04`, `CA-05`, `CA-06`, `CA-07`.
