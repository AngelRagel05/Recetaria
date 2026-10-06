---
id: "006"
title: "Conexión y migraciones PostgreSQL"
status: completed
---

# Especificación: Conexión y migraciones PostgreSQL

## Problema y objetivo

Recetaria tiene aprobado un modelo relacional de 20 tablas de dominio, pero el repositorio solo conserva las migraciones iniciales de Laravel y un modelo `User` que no representa el contrato vigente. La conexión normal apunta a PostgreSQL en Supabase, mientras que las pruebas fuerzan SQLite y no verifican el motor de producción. La base remota no contiene todavía tablas ni datos de la aplicación.

El objetivo es disponer de un esquema PostgreSQL ejecutable, reproducible y protegido que materialice el modelo aprobado, mantenga operativos el registro y el perfil de Breeze y pueda validarse de forma aislada en PostgreSQL 17 local y en CI antes de aplicarse manualmente a Supabase.

## Alcance

### Incluido

- La conexión normal de Laravel con PostgreSQL en Supabase mediante variables de entorno y SSL obligatorio.
- Un entorno de pruebas aislado sobre PostgreSQL 17 local y una ejecución equivalente en GitHub Actions, sin credenciales de Supabase.
- Una migración ordenada por cada tabla física del esquema inicial.
- Las 20 tablas de dominio, atributos, claves, índices, unicidades y restricciones simples aprobadas en [`docs/atributos-modelo-relacional.md`](../../atributos-modelo-relacional.md).
- Las tablas técnicas `password_reset_tokens`, `sessions`, `cache`, `cache_locks`, `jobs`, `job_batches` y `failed_jobs` que requiere la configuración vigente de Laravel, además del repositorio técnico `migrations` que Laravel crea para controlar su ejecución.
- La política de borrado físico protegido, incluida su traducción a acciones referenciales.
- La protección de todas las tablas de Laravel frente a la Data API de Supabase mediante RLS sin políticas y retirada de privilegios de sus roles de API.
- Un catálogo inicial idempotente con los roles `member` y `admin`, sin cuentas de usuario predeterminadas.
- La adaptación mínima de `Role`, `User`, su factory, el registro y el perfil para que el esquema nuevo no rompa la autenticación existente.
- La aplicación manual y controlada de las migraciones y los roles iniciales a Supabase después de superar las verificaciones locales.

### Fuera de alcance

- Los modelos Eloquent de las otras 18 tablas de dominio, sus factories y sus operaciones CRUD.
- Las acciones transaccionales que aplicarán reglas entre varias filas o tablas.
- Triggers, funciones almacenadas o procedimientos PostgreSQL para reglas de negocio.
- La creación del primer administrador y las capacidades o políticas de autorización de `admin`.
- Supabase Auth, la Data API de Supabase como interfaz de la aplicación y cualquier acceso directo desde el frontend.
- La integración técnica con Cloudinary y la carga, transformación o eliminación de imágenes.
- La conexión del prototipo social con datos reales.
- La importación o transformación de datos legacy, porque no existen datos de aplicación que preservar.
- La ejecución automática de migraciones durante el arranque de Render.
- Nuevas dependencias de Composer o npm.

## Actores

- Visitante: crea una cuenta con nombre de usuario, nombre visible, correo y contraseña.
- Miembro: consulta su nombre de usuario inmutable y puede actualizar su nombre visible, correo y biografía.
- Desarrollador: ejecuta migraciones y pruebas contra una base PostgreSQL local aislada sin tocar Supabase.
- Sistema: mantiene el esquema, asigna el rol `member` a las altas públicas y protege la integridad declarativa de los datos.
- Operador de despliegue: desactiva la Data API y aplica manualmente el esquema verificado a Supabase.

## Flujos

### Preparación y pruebas locales

1. El entorno normal conserva su conexión PostgreSQL remota mediante `.env`.
2. El entorno de pruebas utiliza una base local independiente llamada `recetaria_testing` mediante `.env.testing`, que no se versiona.
3. El repositorio ofrece una plantilla de pruebas sin secretos y no fuerza SQLite desde PHPUnit.
4. Una recreación completa del esquema en pruebas crea las 20 tablas de dominio, las siete tablas técnicas, el repositorio `migrations` y los roles iniciales.
5. La suite backend se ejecuta contra PostgreSQL 17 tanto localmente como en CI.

### Migración inicial

1. Las migraciones se ejecutan en orden de dependencias sobre una base sin esquema previo de Recetaria.
2. Cada migración crea una única tabla física, se ejecuta en su propia transacción PostgreSQL y puede revertirse de forma segura en el orden inverso; el lote completo no se presenta como una única transacción.
3. PostgreSQL rechaza claves foráneas inválidas, duplicados, rangos no válidos, posiciones inferiores a `1`, campos emparejados incoherentes, textos obligatorios vacíos y autosseguimientos.
4. Las reglas que necesitan observar varias filas o tablas no se presentan como garantizadas por esta entrega.

### Registro y perfil

1. El visitante proporciona un `username` de 3 a 30 caracteres formado por letras ASCII, números o guion bajo, además del nombre, correo y contraseña existentes.
2. El sistema recorta y convierte a minúsculas `username` y correo antes de validar su formato, comprobar su unicidad y persistirlos; por ejemplo, `Angel_1` se almacena como `angel_1`.
3. El alta resuelve el rol cuyo nombre normalizado es `member`; no depende de un identificador numérico fijo.
4. Si el rol `member` no existe, el alta no crea ningún usuario, registra internamente el fallo de configuración y responde con estado `503` y el mensaje genérico `El registro no está disponible temporalmente.`.
5. El perfil muestra el `username` como identidad inmutable y permite modificar nombre, correo y biografía.
6. Un intento de enviar otro `username` desde el perfil no modifica la identidad almacenada.

### Despliegue en Supabase

1. La Data API se desactiva manualmente antes de exponer las tablas de la aplicación.
2. Tras verificar la implementación local, se consulta el estado remoto sin modificarlo.
3. Con autorización inmediata, se aplican las migraciones pendientes y el catálogo de roles mediante comandos manuales y no destructivos.
4. Se comprueban las tablas, migraciones, restricciones, RLS, ausencia de políticas de Data API y existencia de una única fila para `member` y otra para `admin`, sin eliminar otros roles válidos que pudieran añadirse en el futuro.
5. Render continúa arrancando la aplicación sin ejecutar migraciones automáticamente.

### Casos alternativos y errores

- Una conexión de pruebas que apunte a Supabase se considera una configuración inválida y no debe utilizarse.
- Una variable de conexión ausente o una conexión PostgreSQL fallida antes de iniciar el lote detiene la operación sin cambiar el esquema.
- Si una migración falla, su transacción se revierte, las migraciones anteriores del mismo lote permanecen registradas y una ejecución posterior reanuda únicamente las pendientes; el fallo devuelve un estado de error y no puede declararse completado.
- Un seeder fallido revierte su propia operación transaccional, devuelve un estado de error y puede reintentarse sin duplicar roles.
- No se utiliza `migrate:fresh` contra Supabase.
- No se insertan usuarios, recetas, publicaciones ni contenido de demostración en la base remota.
- No se almacenan secretos en archivos versionados, pruebas, documentación, salidas o commits.

## Reglas de datos e integridad

- El contrato de tablas, columnas, tipos conceptuales, nulabilidad, límites, índices y unicidades es el definido en `docs/atributos-modelo-relacional.md`.
- Las claves principales y foráneas de dominio utilizan `BIGINT`; no se introducen UUID.
- Las tablas físicas usan los nombres plurales aprobados y no heredan los nombres singulares de MiKiWi.
- Los timestamps del dominio son obligatorios y se interpretan en UTC; las asociaciones inmutables solo contienen `created_at`.
- Los roles, correo, `username`, ingredientes, unidades, categorías y etiquetas se almacenan con la normalización aprobada.
- El nombre de una colección es único para su propietario después de ignorar mayúsculas, minúsculas y espacios exteriores.
- Las restricciones declarativas cubren claves, unicidades, rangos, posiciones, campos emparejados y comparaciones dentro de una misma fila.
- La publicación válida de recetas, el mínimo de autores, ingredientes y pasos, el límite global de imágenes, la coherencia padre-publicación y la implicación colección-guardado se aplicarán mediante operaciones transaccionales en una entrega posterior.

## Política de borrado

- Borrar una receta elimina sus autores, ingredientes, pasos, clasificaciones, etiquetas, guardados y pertenencias a colecciones.
- Borrar una receta conserva las publicaciones y asigna `NULL` a `publication_images.recipe_id`.
- Borrar una publicación elimina sus imágenes, comentarios y likes.
- Borrar un comentario conserva sus respuestas y asigna `NULL` a su `parent_comment_id`.
- Borrar una colección elimina sus pertenencias; borrar un usuario elimina publicaciones, comentarios, likes, guardados, colecciones y seguimientos subordinados.
- Un usuario referenciado como autor de una receta no puede borrarse directamente. La futura operación de eliminación de cuenta resolverá primero recetas de autor único y coautorías compartidas.
- Los roles, ingredientes, unidades, categorías y etiquetas no pueden borrarse mientras estén en uso.
- No se incorpora borrado lógico.

## Seguridad de Supabase

- Laravel Breeze y la conexión PostgreSQL directa son las únicas vías de autenticación y persistencia de la aplicación en esta fase.
- Las 20 tablas de dominio, las siete tablas técnicas y el repositorio `migrations` creados por Laravel en `public` tienen RLS habilitado sin políticas de acceso mediante la Data API.
- Los roles `anon`, `authenticated` y `service_role` no conservan privilegios sobre las tablas y secuencias de Recetaria.
- La conexión directa del backend utiliza la cuenta PostgreSQL `postgres` ya elegida y sus credenciales permanecen únicamente en variables de entorno protegidas.
- La Data API se desactiva desde la configuración de Supabase; esta acción externa no se sustituye por una suposición documental.

## Criterios de aceptación

- `CA-01`: Una base PostgreSQL 17 vacía puede aplicar y revertir el conjunto completo de migraciones sin errores y obtiene exactamente 28 tablas públicas de Laravel: las 20 tablas de dominio aprobadas, las siete tablas técnicas declaradas y el repositorio `migrations`.
- `CA-02`: Las tablas de dominio coinciden con `docs/atributos-modelo-relacional.md` en nombres, atributos, tipos, nulabilidad, claves, índices, unicidades y timestamps.
- `CA-03`: PostgreSQL rechaza mediante restricciones declarativas los rangos, posiciones, campos emparejados, textos obligatorios, normalizaciones y autosseguimientos inválidos que corresponden a una sola fila.
- `CA-04`: Las claves foráneas aplican la política aprobada de cascada, restricción o asignación a `NULL`, incluida la conservación de publicaciones y respuestas ajenas.
- `CA-05`: El entorno de pruebas usa `recetaria_testing` en PostgreSQL local, no contiene secretos versionados y la CI ejecuta la suite backend sobre PostgreSQL 17 sin credenciales externas; la configuración remota exige `DB_SSLMODE=require` y la comprobación contra Supabase confirma que la sesión efectiva utiliza SSL.
- `CA-06`: El seeder de producción es idempotente, garantiza una única fila para `member` y otra para `admin`, no elimina otros roles válidos y no crea cuentas ni contenido de demostración.
- `CA-07`: Un visitante puede registrarse con un `username` válido y único aunque escriba letras mayúsculas; el valor se recorta, se convierte a minúsculas antes de validarse y el usuario resultante recibe el rol `member` resuelto por nombre. Si falta ese rol, la respuesta es `503` con `El registro no está disponible temporalmente.`, el fallo queda registrado y no se crea ningún usuario.
- `CA-08`: El perfil expone el `username` sin permitir cambiarlo y permite actualizar nombre, correo y biografía dentro de los límites aprobados.
- `CA-09`: Las 28 tablas de Laravel en `public` tienen RLS habilitado, no existen políticas de acceso mediante la Data API y `anon`, `authenticated` y `service_role` carecen de privilegios sobre las tablas y secuencias de Recetaria; el estado externo solo puede cerrarse con evidencia de que `Enable Data API` aparece desactivado en la configuración de Supabase.
- `CA-10`: Las pruebas existentes y las nuevas pruebas de esquema, registro y perfil pasan sobre PostgreSQL; Pint, ESLint, Prettier, Vitest y el build también pasan.
- `CA-11`: La aplicación manual a Supabase usa solo migraciones pendientes y el seeder de roles, nunca `migrate:fresh`, y termina con el estado remoto verificado sin exponer secretos.
- `CA-12`: El cambio no añade dependencias, triggers, modelos del resto del dominio, primer administrador, integración Cloudinary, Supabase Auth, conexión del feed ni migración automática en Render.

## Decisiones aprobadas

- La primera entrega materializa el esquema completo e incluye solo la compatibilidad mínima de autenticación necesaria para mantener la aplicación verificable.
- El esquema se crea desde cero porque Supabase no contiene tablas ni datos de Recetaria.
- Se utiliza una migración por tabla, en orden de dependencias, tomando de MiKiWi únicamente su patrón de conexión y migraciones.
- PostgreSQL 17 local y PostgreSQL 17 en CI sustituyen a SQLite como entornos de prueba backend.
- La política es borrado físico protegido, sin borrado lógico.
- Las reglas entre varias filas se implementarán en Laravel mediante operaciones transaccionales posteriores y no mediante triggers.
- Los únicos datos iniciales son los roles `member` y `admin`.
- El primer administrador se creará posteriormente mediante un comando Artisan explícito y seguro.
- La Data API se desactiva y se añade defensa SQL mediante RLS y retirada de privilegios.
- Los accesos automáticos `anon`, `authenticated` y `service_role` pierden sus privilegios sobre el esquema de Recetaria; esta protección no afecta a la conexión directa de Laravel como `postgres`.
- Los `username` se convierten a minúsculas antes de validar y almacenar, aunque el visitante escriba letras mayúsculas.
- La ausencia del rol `member` se trata como indisponibilidad temporal del registro mediante una respuesta `503`, un mensaje público genérico, registro interno del fallo y ausencia de escritura parcial.
- Laravel en Render mantiene la cuenta PostgreSQL `postgres` y las migraciones se aplican manualmente, no durante el arranque del contenedor.

## Decisiones pendientes

- No quedan decisiones de producto o arquitectura pendientes dentro del alcance de esta especificación.
