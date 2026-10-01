---
spec: "002"
status: completed
---

# Tareas: Atributos del modelo relacional

- [x] `T-01` — Actualizar `docs/modelo-relacional.md` como vista visual vigente con exactamente 20 tablas, relaciones corregidas, reglas breves y enlace al catálogo detallado. Cubre: `CA-01`, `CA-04` a `CA-10`, `CA-12`.
- [x] `T-02` — Crear `docs/atributos-modelo-relacional.md` con convenciones generales, exactamente 20 secciones de tabla, enlaces mutuos y sin duplicar el diagrama Mermaid. Cubre: `CA-01`, `CA-02`, `CA-03`, `CA-12`.
- [x] `T-03` — Documentar atributos, restricciones y relaciones de `roles`, `users`, `recipes`, `recipe_authors`, `ingredients`, `units`, `recipe_ingredients` y `recipe_steps`. Cubre: `CA-02`, `CA-03`, `CA-04`, `CA-05`, `CA-11`.
- [x] `T-04` — Documentar atributos, restricciones y relaciones de `categories`, `recipe_categories`, `tags` y `recipe_tags`. Cubre: `CA-02`, `CA-03`, `CA-06`.
- [x] `T-05` — Documentar atributos, restricciones y relaciones de `publications`, `publication_images`, `comments` y `publication_likes`. Cubre: `CA-02`, `CA-03`, `CA-07`, `CA-08`, `CA-09`, `CA-11`.
- [x] `T-06` — Documentar atributos, restricciones y relaciones de `saved_recipes`, `collections`, `collection_recipes` y `user_follows`. Cubre: `CA-02`, `CA-03`, `CA-09`, `CA-10`.
- [x] `T-07` — Alinear en ambas vistas las reglas de publicación, coautoría, ocultación y republicación, imágenes, comentarios, guardados, colecciones y seguimiento. Cubre: `CA-04` a `CA-10`.
- [x] `T-08` — Retirar capacidades concretas de `admin` de la vista visual, omitirlas en el catálogo y corregir `docs/decisiones-tecnicas.md`, manteniendo la autorización aplazada. Cubre: `CA-04`, `CA-12`.
- [x] `T-09` — Actualizar `docs/decisiones-tecnicas.md` para identificar las dos vistas como vigentes y complementarias y conservar las demás decisiones aplazadas. Cubre: `CA-01`, `CA-11`, `CA-12`.
- [x] `T-10` — Ejecutar las comprobaciones documentales, contrastar las 20 tablas y cada criterio de aceptación con la especificación y revisar el diff completo mediante `$recetaria-verify`. Cubre: `CA-01` a `CA-12`.
- [x] `T-11` — Actualizar `MEMORY.md`, entregar las evidencias a `test_reviewer` y cerrar `tasks.md` y `spec.md` únicamente si todas las verificaciones pasan y no existen bloqueos. Cubre: `CA-01` a `CA-12`.

Al comenzar una implementación solicitada explícitamente, `tasks.md` cambiará de `pending` a `in_progress` antes de ejecutar `T-01`; la aprobación de este plan por sí sola no autoriza ese cambio ni la implementación.
