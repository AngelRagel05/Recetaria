---
spec: "006"
status: approved
---

# Plan técnico: Conexión y migraciones PostgreSQL

## Resumen

Se sustituirá el esquema inicial de Laravel por 27 migraciones de creación, una por cada tabla física que debe crear la aplicación: las 20 tablas de dominio y las siete tablas técnicas. Laravel seguirá creando por sí mismo el repositorio `migrations`, por lo que el resultado será de 28 tablas públicas. Una migración posterior, que no crea tablas, habilitará RLS y retirará a los roles de la Data API los permisos sobre esas 28 tablas y sus secuencias.

Las pruebas dejarán de utilizar SQLite y se ejecutarán sobre una base PostgreSQL 17 local llamada exactamente `recetaria_testing`. El propio arranque de la suite bloqueará cualquier configuración que no use PostgreSQL, ese nombre de base o un host local, para evitar que una prueba destructiva pueda alcanzar Supabase. GitHub Actions reproducirá el mismo entorno mediante un servicio PostgreSQL aislado y credenciales exclusivas de CI.

Sobre el esquema se adaptarán únicamente `Role`, `User`, el seeder, la factory, el registro y el perfil. El registro normalizará correo y nombre de usuario antes de validar, localizará `member` por nombre y responderá con un error público `503` si ese catálogo no está preparado. La aplicación remota se hará solo después de completar las comprobaciones locales, desactivar manualmente la Data API y recibir una autorización inmediata del desarrollador.

## Componentes afectados

- `.env.example`, una nueva `.env.testing.example`, `.gitignore`, `phpunit.xml` y `tests/TestCase.php`: separación explícita entre el entorno remoto normal y la base local de pruebas, incluida una protección previa a cualquier recreación del esquema.
- `.github/workflows/ci.yml`: servicio PostgreSQL 17, extensión `pdo_pgsql` y variables de CI sin reutilizar credenciales externas.
- `database/migrations/`: sustitución de las tres migraciones agrupadas no desplegadas por 27 migraciones de creación ordenadas y una migración final de protección SQL.
- `app/Models/Role.php` y `app/Models/User.php`: catálogo de roles, relaciones y atributos del usuario aprobados, sin añadir modelos para el resto del dominio.
- `database/seeders/RoleSeeder.php`, `database/seeders/DatabaseSeeder.php` y `database/factories/UserFactory.php`: roles iniciales idempotentes, eliminación del usuario ficticio y usuarios de prueba compatibles con el esquema.
- `app/Http/Controllers/Auth/RegisteredUserController.php`, `app/Http/Requests/ProfileUpdateRequest.php` y una vista de error `503`: normalización, validación, alta transaccional y edición limitada del perfil.
- `resources/js/Pages/Auth/Register.tsx`, `resources/js/Pages/Profile/Partials/UpdateProfileInformationForm.tsx`, sus CSS Modules y `resources/js/types/index.d.ts`: campos `username` y `bio`, identidad inmutable y contratos TypeScript.
- Pruebas backend de esquema, seeder, registro y perfil, más pruebas React de los dos formularios modificados.
- `README.md`, `docs/modelo-relacional.md`, `docs/atributos-modelo-relacional.md`, `docs/decisiones-tecnicas.md` y `MEMORY.md`: instrucciones y estado real tras convertir el contrato conceptual en un esquema ejecutable.

## Contratos, datos e interfaces

- El entorno normal continuará leyendo `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` y `DB_SSLMODE`; `.env.example` mantendrá PostgreSQL y `DB_SSLMODE=require` como contrato remoto.
- `.env.testing.example` contendrá únicamente valores de muestra y usará `pgsql`, host local y base `recetaria_testing`. El archivo real `.env.testing` seguirá ignorado y guardará, si hace falta, la contraseña local del desarrollador.
- `Tests\TestCase` validará la conexión antes de que `RefreshDatabase` pueda ejecutar migraciones: solo aceptará `pgsql`, la base `recetaria_testing` y `127.0.0.1` o `localhost`. La CI expondrá su servicio PostgreSQL por `127.0.0.1`, por lo que utilizará la misma protección.
- Se crearán, en orden de dependencias, `roles`, `users`, `password_reset_tokens`, `sessions`, `cache`, `cache_locks`, `jobs`, `job_batches`, `failed_jobs`, `recipes`, `ingredients`, `units`, `categories`, `tags`, `recipe_authors`, `recipe_ingredients`, `recipe_steps`, `recipe_categories`, `recipe_tags`, `publications`, `publication_images`, `comments`, `publication_likes`, `saved_recipes`, `collections`, `collection_recipes` y `user_follows`.
- Cada migración de creación contendrá una sola tabla y conservará `withinTransaction` de Laravel, que PostgreSQL ejecuta transaccionalmente. `down()` retirará esa tabla en el orden inverso natural de las migraciones.
- Las columnas, límites, nulabilidad, valores iniciales, claves, índices y unicidades seguirán literalmente `docs/atributos-modelo-relacional.md`. Se usarán las herramientas de esquema de Laravel y sentencias PostgreSQL con nombres explícitos para los `CHECK` y el índice funcional de colección que Laravel no expresa directamente.
- Los `CHECK` cubrirán los valores normalizados, textos obligatorios recortados, patrón y longitud de `username`, campos emparejados, cantidades y tiempos válidos, posiciones, máximo de posición de imagen y prohibición del autosseguimiento. Las reglas que comparan varias filas seguirán fuera de estas migraciones.
- Las claves foráneas implementarán la matriz aprobada: cascada para componentes y asociaciones subordinadas, restricción para roles y catálogos en uso, `SET NULL` para `publication_images.recipe_id` y `comments.parent_comment_id`, y restricción para un usuario todavía referenciado como autor.
- La migración final de seguridad recorrerá una lista cerrada de las 28 tablas, habilitará RLS sin crear políticas y retirará privilegios de tablas y secuencias solo si existen `anon`, `authenticated` o `service_role`. En local y CI esos roles pueden no existir y la migración seguirá siendo válida. Su reversión deshabilitará RLS en las tablas que aún existan, pero no volverá a conceder privilegios amplios: una reversión nunca debe abrir accidentalmente la Data API.
- `Role` expondrá su relación con usuarios y `User` incorporará `role_id`, `username`, `bio` y los identificadores opcionales de avatar, además de la relación inversa. Los demás 18 modelos de dominio no se crearán.
- `RoleSeeder` ejecutará `firstOrCreate` para `member` y `admin` dentro de una transacción; preservará otros roles y podrá repetirse sin duplicar filas. `DatabaseSeeder` llamará solo a ese seeder. Las pruebas con `RefreshDatabase` activarán ese seeding mínimo antes de usar la factory.
- `UserFactory` producirá un `username` válido, asignará el rol `member` existente y mantendrá correo y contraseña compatibles con Breeze.
- El registro recortará `name`, `username` y correo, convertirá `username` y correo a minúsculas, validará `name` con máximo 100 y `username` con el patrón aprobado, y creará el usuario dentro de una transacción con el rol `member` consultado por nombre. Nunca aceptará `role_id` desde el formulario.
- Si falta `member`, el controlador registrará únicamente el contexto técnico necesario, no creará el usuario y devolverá una vista mínima de error con estado `503` y el texto exacto `El registro no está disponible temporalmente.`.
- El perfil enviará solo `name`, `email` y `bio`; normalizará nombre y correo, convertirá una biografía vacía en `NULL` y limitará la biografía a 500 caracteres. `username` se mostrará en un campo de solo lectura y cualquier valor adicional enviado como `username` será ignorado por la actualización.
- El tipo frontend `User` incorporará `username` y `bio`. No se modificará el contrato de autenticación, las rutas de Breeze ni la contraseña.

## Fases de implementación

1. Preparar el entorno de pruebas: añadir la plantilla sin secretos, permitir que Git la registre, retirar SQLite de PHPUnit, añadir la barrera contra bases no locales y configurar PostgreSQL 17 con `pdo_pgsql` en GitHub Actions.
2. Sustituir las migraciones iniciales por las 27 migraciones de tabla en orden de dependencias, incorporar claves, índices, restricciones y políticas de borrado, y añadir la migración final de RLS y retirada condicional de privilegios.
3. Añadir `Role`, adaptar `User`, crear el seeder idempotente y actualizar la factory y el seeding de pruebas sin insertar ninguna cuenta predeterminada.
4. Adaptar el registro para `username`, normalización, resolución transaccional de `member` y error seguro `503`; adaptar el perfil para mostrar `username` como inmutable y editar `bio`.
5. Añadir pruebas PostgreSQL de esquema y seguridad, actualizar las pruebas backend de autenticación y perfil, y añadir pruebas React para los formularios afectados.
6. Ejecutar recreación completa con seed, rollback y reaplicación sobre `recetaria_testing`; ejecutar toda la suite y los controles de formato, frontend, build y diff; corregir únicamente fallos del alcance aprobado.
7. Actualizar la documentación existente y registrar en `MEMORY.md` que la implementación local está completa mientras la aplicación remota siga pendiente.
8. Solicitar al desarrollador que confirme con evidencia que `Enable Data API` está desactivado. Consultar después el estado remoto sin modificarlo y pedir una autorización inmediata y separada para ejecutar únicamente las migraciones pendientes y `RoleSeeder` contra Supabase.
9. Verificar en Supabase el estado de migraciones, las 28 tablas, restricciones, roles iniciales, RLS, ausencia de políticas, privilegios retirados y SSL efectivo; someter todas las evidencias a `test_reviewer` antes de cerrar la especificación, las tareas y `MEMORY.md`.

## Pruebas y criterios de aceptación

- `CA-01`: ejecutar `migrate:fresh --seed`, `migrate:rollback` y una nueva aplicación sobre `recetaria_testing`; contar 28 tablas públicas y comprobar que existen 27 migraciones de creación de una sola tabla, además de la migración de seguridad.
- `CA-02`: pruebas de esquema basadas en `information_schema` y `pg_catalog` verificarán nombres, tipos PostgreSQL, longitud y precisión, nulabilidad, valores iniciales, claves, índices, unicidades y timestamps de las 20 tablas de dominio.
- `CA-03`: pruebas de integración intentarán insertar filas inválidas y comprobarán que PostgreSQL rechaza normalización incorrecta, texto vacío, patrón de usuario, rangos, posiciones, campos emparejados y autosseguimiento, sin atribuirle reglas de varias filas.
- `CA-04`: pruebas por cada clase de relación comprobarán `CASCADE`, `RESTRICT` y `SET NULL`, incluidas la conservación de publicaciones al borrar una receta y de respuestas al borrar su comentario padre.
- `CA-05`: la barrera de `Tests\TestCase` tendrá pruebas unitarias sobre configuraciones permitidas y rechazadas; la ejecución local y la CI confirmarán PostgreSQL 17. La comprobación remota consultará `pg_stat_ssl` y solo aceptará una sesión SSL activa.
- `CA-06`: ejecutar `RoleSeeder` dos veces y comprobar exactamente un `member`, un `admin`, conservación de un tercer rol y ausencia de usuarios o contenido de muestra.
- `CA-07`: pruebas HTTP cubrirán registro válido, conversión de mayúsculas a minúsculas, recorte, formato y unicidad de `username`, asignación de `member` por nombre y el caso sin ese rol con `503`, mensaje público, registro interno y cero usuarios creados.
- `CA-08`: pruebas HTTP comprobarán actualización y normalización de nombre, correo y biografía, conversión de biografía vacía a `NULL`, límites y rechazo efectivo de cambios de `username`; pruebas React comprobarán el campo de solo lectura y el envío de los campos editables.
- `CA-09`: pruebas de catálogo PostgreSQL verificarán RLS activo y cero políticas en las 28 tablas; la comprobación remota verificará además la ausencia de privilegios de `anon`, `authenticated` y `service_role` sobre tablas y secuencias, junto con la evidencia externa de Data API desactivada.
- `CA-10`: ejecutar `php artisan test`, `vendor/bin/pint --test`, `npm test`, `npm run lint`, `npm run format:check`, `npm run build` y `git diff --check` con resultados satisfactorios.
- `CA-11`: antes de modificar Supabase, registrar `migrate:status`; con autorización inmediata ejecutar solo `php artisan migrate --force` y `php artisan db:seed --class=RoleSeeder --force`, y repetir consultas de estado sin mostrar variables ni credenciales.
- `CA-12`: revisar `composer.json`, `package.json`, Docker, Render y el diff completo para confirmar que no aparecen dependencias, triggers, migración automática, modelos adicionales, administrador, Cloudinary, Supabase Auth ni conexión real del feed.

## Documentación

- Actualizar `README.md` para explicar PostgreSQL 17 local, la copia de `.env.testing.example`, la base obligatoria `recetaria_testing` y los comandos de verificación reales, sustituyendo la referencia obsoleta a SQLite.
- Actualizar `docs/modelo-relacional.md`, `docs/atributos-modelo-relacional.md` y `docs/decisiones-tecnicas.md` para distinguir qué parte del contrato ya tiene esquema ejecutable y qué reglas entre varias filas siguen aplazadas, sin duplicar el detalle de las migraciones.
- Tras la verificación local, actualizar `MEMORY.md` con el estado local y el pendiente remoto. Tras la comprobación de Supabase y `test_reviewer`, sustituir ese pendiente por el resultado real y cerrar `spec.md` y `tasks.md`.
- No crear una guía independiente de base de datos: la información operativa breve cabe en el `README.md` y las decisiones duraderas en los documentos ya existentes.

## Despliegue y compatibilidad

- La aplicación conservará PostgreSQL como conexión normal y el Dockerfile conservará `pdo_pgsql`; no se añadirá ningún comando de migración al arranque de Render.
- La base local `recetaria_testing` y el servicio efímero de CI son los únicos destinos autorizados para operaciones destructivas como `migrate:fresh`.
- Supabase se tratará como destino remoto no destructivo: no se ejecutarán `migrate:fresh`, rollback ni seeders generales. La Data API deberá estar desactivada antes de la aplicación.
- La aplicación remota se dividirá en consulta previa, autorización inmediata, migración pendiente, seeder específico y comprobación posterior. Cualquier fallo detendrá la siguiente operación y se explicará antes de reintentar.
- Las rutas y flujos existentes de Breeze seguirán funcionando; el único cambio visible será el `username` obligatorio en registro y el `username` inmutable con `bio` editable en perfil.
- Como las migraciones iniciales nunca se desplegaron y Supabase está vacío, no habrá transformación ni conservación de datos legacy.

## Riesgos y medidas

- Confundir la base de pruebas con Supabase: la suite abortará antes de `RefreshDatabase` salvo que conexión, host y nombre coincidan con la base local aprobada; los comandos destructivos se ejecutarán mostrando previamente el destino no sensible.
- Divergencia entre 27 tablas creadas y 28 tablas finales: las pruebas contarán por separado las tablas de aplicación y el repositorio `migrations` administrado por Laravel.
- Restricciones PostgreSQL incompletas o demasiado amplias: cada grupo de restricciones tendrá pruebas positivas y negativas basadas en el contrato aprobado, y los nombres explícitos facilitarán localizar un fallo.
- RLS que bloquee a Laravel: las comprobaciones distinguirán la conexión directa propietaria `postgres` de los roles de la Data API; la suite probará que Breeze sigue escribiendo mientras RLS permanece activo.
- Rollback que vuelva a abrir la Data API: la migración de seguridad podrá deshabilitar RLS para permitir la reversión ordenada, pero deliberadamente no restaurará privilegios a roles automáticos.
- Seeder o registro dependientes de un ID concreto: ambos resolverán los roles por su nombre normalizado y las pruebas alterarán el ID para demostrar que no existe esa dependencia.
- Escritura parcial cuando falte `member`: la búsqueda y la creación estarán dentro de una transacción y el caso de error comprobará cero altas.
- Aplicación remota irreversible o sin evidencia suficiente: no se modificará Supabase hasta completar la verificación local, confirmar Data API desactivada y recibir el permiso inmediato; después se verificará el estado real antes de cerrar SDD.
