# Memoria de Recetaria

## Foco actual

La especificación [`007-correccion-vulnerabilidad-shell-quote`](docs/specs/007-correccion-vulnerabilidad-shell-quote/spec.md) está completada y verificada localmente en `fix/corrige-vulnerabilidad-shell-quote`, con base `4be38e868ba9b6e43ef016152e5befc1c6ff66ee`; `test_reviewer` dio `PASS`. Falta crear el commit final y, después de la publicación o integración por el desarrollador, observar una nueva ejecución de GitHub Actions.

## Estado actual

- Existen 27 migraciones creadoras, una por tabla física, para las 20 tablas de dominio y las siete tablas técnicas. Laravel añade su repositorio `migrations`, dando 28 tablas públicas.
- Una migración final habilita RLS sin políticas en las 28 tablas, descubre únicamente las secuencias reales de sus columnas y retira privilegios de tablas y secuencias a `anon`, `authenticated` y `service_role` cuando esos roles existen.
- Las claves, índices, unicidades, restricciones de una fila y acciones de borrado aprobadas están materializadas en PostgreSQL. Las reglas entre varias filas continúan fuera de alcance para acciones transaccionales posteriores.
- Las pruebas backend utilizan PostgreSQL 17 local en `recetaria_testing`; `.env.testing` existe localmente, está ignorado y reutiliza las credenciales locales sin exponerlas. La suite bloquea hosts remotos, otros nombres de base, SQLite y conexiones mediante URL antes de `RefreshDatabase`.
- GitHub Actions está preparado para PostgreSQL 17 efímero con `pdo_pgsql` y credenciales exclusivas de CI.
- `Role`, `User`, `RoleSeeder`, `UserFactory`, registro y perfil son compatibles con el esquema. El registro normaliza `username` y correo, resuelve `member` por nombre y devuelve el `503` aprobado si falta; el perfil conserva `username` inmutable y permite editar `bio`.
- `migrate:fresh --seed`, rollback y reaplicación pasan sobre `recetaria_testing`. Las 73 pruebas PHP con 223 aserciones, las 12 pruebas frontend, Pint, ESLint, Prettier y el build pasan localmente.
- Las pruebas de catálogo comparan las 20 claves primarias y las 24 unicidades aprobadas; el perfil rechaza por HTTP biografías de más de 500 caracteres sin modificar el valor almacenado.
- La prueba de valores iniciales de tiempos ordena su mapa por nombre de columna antes de compararlo estrictamente, evitando depender del orden no garantizado de `information_schema`.
- La corrección del orden inestable está integrada en `dev` mediante `4be38e8`; la nueva ejecución externa alcanzó la auditoría de npm y detectó una vulnerabilidad crítica distinta en una dependencia de desarrollo.

## En curso

- La captura del desarrollador confirma que `Enable Data API` quedó desactivado y guardado en Supabase.
- Supabase contiene las 28 tablas y las 28 migraciones aplicadas, incluidos RLS activo sin políticas y las restricciones e índices aprobados.
- `RoleSeeder` dejó exactamente `member` y `admin`, sin usuarios ni contenido de muestra.
- La conexión exige `sslmode=require`; una comprobación directa con `psql` y `libpq` confirmó negociación `TLSv1.3` con `TLS_AES_256_GCM_SHA384` y compresión desactivada en el pooler. `anon`, `authenticated` y `service_role` no conservan privilegios sobre ninguna tabla ni sobre las 23 secuencias de Recetaria.
- `package.json` limita la sustitución a la dependencia `shell-quote` de `concurrently`; `package-lock.json` cambia únicamente su resolución de `1.9.0` a `1.11.0`.
- Una instalación limpia con `npm ci` resuelve `concurrently 9.2.4` con `shell-quote 1.11.0`; `npm audit` informa cero vulnerabilidades y una coordinación finita de dos procesos termina correctamente.
- Las 12 pruebas frontend, ESLint, Prettier y el build pasan con la resolución segura. `composer.json` y `.github/workflows/ci.yml` permanecen sin cambios.

## Contexto operativo

- Rama de trabajo: `fix/corrige-vulnerabilidad-shell-quote`.
- Base de la rama: `4be38e868ba9b6e43ef016152e5befc1c6ff66ee`.
- La tarea 007 no modifica código funcional, migraciones ni servicios externos; el agente no publicará ni integrará la rama.
- Supabase partía sin tablas ni datos de Recetaria. Las migraciones se aplicaron manualmente en dos lotes porque la primera ejecución detectó el supuesto incorrecto de que todas las tablas tenían `id`; la corrección quedó cubierta por una prueba de secuencias y se aplicó solo como migración pendiente.
- No se debe usar `migrate:fresh`, rollback ni un seeder general contra Supabase.
- Render no ejecutará migraciones durante el arranque; la aplicación remota es manual.

## Problemas conocidos y deuda técnica

No quedan fallos locales conocidos. La nueva ejecución de GitHub Actions sigue pendiente de publicación o integración por el desarrollador.

## Siguientes pasos

1. Crear el commit final únicamente después de una autorización Git específica e inmediata.
2. El desarrollador gestionará la publicación e integración; el resultado del nuevo CI se registrará después mediante una tarea documental independiente.

Estos pasos no autorizan automáticamente cambios remotos, commits, publicación ni integración.
