---
spec: "006"
status: completed
---

# Tareas: Conexión y migraciones PostgreSQL

- [x] `T-01` — Añadir `.env.testing.example`, ajustar `.gitignore` y `phpunit.xml`, y proteger el arranque de las pruebas para aceptar únicamente PostgreSQL local con la base `recetaria_testing`. Cubre: `CA-05`.
- [x] `T-02` — Configurar GitHub Actions con un servicio PostgreSQL 17, `pdo_pgsql` y credenciales efímeras de CI, sin secretos ni conexiones externas. Cubre: `CA-05`, `CA-10`, `CA-12`.
- [x] `T-03` — Sustituir las migraciones iniciales agrupadas por 27 migraciones de una tabla, ordenadas por dependencias, con las 20 tablas de dominio y las siete técnicas. Cubre: `CA-01`, `CA-02`.
- [x] `T-04` — Incorporar `CHECK`, índices funcionales, unicidades, claves foráneas y acciones `CASCADE`, `RESTRICT` y `SET NULL` conforme al contrato aprobado. Cubre: `CA-02`, `CA-03`, `CA-04`.
- [x] `T-05` — Añadir la migración final que habilita RLS sin políticas en las 28 tablas y retira condicionalmente los privilegios de tablas y secuencias a `anon`, `authenticated` y `service_role`. Cubre: `CA-09`.
- [x] `T-06` — Crear `Role`, adaptar `User`, implementar `RoleSeeder` idempotente, retirar el usuario ficticio de `DatabaseSeeder` y actualizar `UserFactory` y el seeding mínimo de pruebas. Cubre: `CA-06`, `CA-07`, `CA-12`.
- [x] `T-07` — Adaptar el registro para normalizar y validar `username`, resolver `member` por nombre y tratar su ausencia de forma transaccional con log, respuesta `503` y mensaje público exacto. Cubre: `CA-07`.
- [x] `T-08` — Adaptar perfil, tipos y formularios para mostrar `username` como inmutable y permitir actualizar `name`, `email` y `bio` con su normalización y límites. Cubre: `CA-08`.
- [x] `T-09` — Añadir pruebas PostgreSQL de estructura, tipos, claves, índices, restricciones, acciones de borrado, RLS y ausencia de políticas, dejando explícitamente fuera las reglas entre varias filas. Cubre: `CA-01`, `CA-02`, `CA-03`, `CA-04`, `CA-09`.
- [x] `T-10` — Actualizar y ampliar las pruebas backend de seeder, factory, registro y perfil, incluido el rol con ID no fijo, la normalización y el fallo sin `member`. Cubre: `CA-06`, `CA-07`, `CA-08`.
- [x] `T-11` — Añadir pruebas React del registro y el perfil para `username`, `bio`, errores y estado de solo lectura. Cubre: `CA-07`, `CA-08`, `CA-10`.
- [x] `T-12` — Ejecutar sobre `recetaria_testing` recreación con seed, rollback, reaplicación, suite PHPUnit, Pint, Vitest, ESLint, Prettier, build y `git diff --check`; revisar el diff y confirmar límites de alcance. Cubre: `CA-01`, `CA-05`, `CA-10`, `CA-12`.
- [x] `T-13` — Actualizar `README.md`, el modelo relacional, sus atributos, las decisiones técnicas y `MEMORY.md` con el estado ejecutable y el pendiente remoto real. Cubre: `CA-02`, `CA-05`, `CA-11`, `CA-12`.
- [x] `T-14` — Recibir evidencia de Data API desactivada, consultar Supabase sin cambios y solicitar autorización inmediata para aplicar solo migraciones pendientes y `RoleSeeder`. Cubre: `CA-09`, `CA-11`.
- [x] `T-15` — Tras la autorización, aplicar y verificar Supabase: migraciones, 28 tablas, restricciones, roles, SSL, RLS, políticas y privilegios; detenerse ante cualquier fallo sin usar comandos destructivos. Cubre: `CA-05`, `CA-06`, `CA-09`, `CA-11`.
- [x] `T-16` — Presentar especificación, plan, tareas, pruebas y evidencias a `test_reviewer`; si devuelve `BLOCKED`, informar al desarrollador y esperar una nueva instrucción sin cerrar estados ni corregir automáticamente; cerrar los estados SDD y actualizar `MEMORY.md` solo después de obtener `PASS`. Cubre: `CA-01`, `CA-02`, `CA-03`, `CA-04`, `CA-05`, `CA-06`, `CA-07`, `CA-08`, `CA-09`, `CA-10`, `CA-11`, `CA-12`.
