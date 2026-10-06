# Memoria de Recetaria

## Foco actual

La especificación [`006-conexion-migraciones-postgresql`](docs/specs/006-conexion-migraciones-postgresql/spec.md) está completada en `feat/conexion-migraciones-postgresql`, con base `ca45a0aec2a9760a48101febef4b14b279b1b89a`. La implementación, la verificación local y la aplicación comprobada en Supabase están completas; `test_reviewer` dio `PASS`. La publicación, integración y CI externos todavía no se han observado.

## Estado actual

- Existen 27 migraciones creadoras, una por tabla física, para las 20 tablas de dominio y las siete tablas técnicas. Laravel añade su repositorio `migrations`, dando 28 tablas públicas.
- Una migración final habilita RLS sin políticas en las 28 tablas, descubre únicamente las secuencias reales de sus columnas y retira privilegios de tablas y secuencias a `anon`, `authenticated` y `service_role` cuando esos roles existen.
- Las claves, índices, unicidades, restricciones de una fila y acciones de borrado aprobadas están materializadas en PostgreSQL. Las reglas entre varias filas continúan fuera de alcance para acciones transaccionales posteriores.
- Las pruebas backend utilizan PostgreSQL 17 local en `recetaria_testing`; `.env.testing` existe localmente, está ignorado y reutiliza las credenciales locales sin exponerlas. La suite bloquea hosts remotos, otros nombres de base, SQLite y conexiones mediante URL antes de `RefreshDatabase`.
- GitHub Actions está preparado para PostgreSQL 17 efímero con `pdo_pgsql` y credenciales exclusivas de CI.
- `Role`, `User`, `RoleSeeder`, `UserFactory`, registro y perfil son compatibles con el esquema. El registro normaliza `username` y correo, resuelve `member` por nombre y devuelve el `503` aprobado si falta; el perfil conserva `username` inmutable y permite editar `bio`.
- `migrate:fresh --seed`, rollback y reaplicación pasan sobre `recetaria_testing`. Las 73 pruebas PHP con 223 aserciones, las 12 pruebas frontend, Pint, ESLint, Prettier y el build pasan localmente.
- Las pruebas de catálogo comparan las 20 claves primarias y las 24 unicidades aprobadas; el perfil rechaza por HTTP biografías de más de 500 caracteres sin modificar el valor almacenado.

## En curso

- La captura del desarrollador confirma que `Enable Data API` quedó desactivado y guardado en Supabase.
- Supabase contiene las 28 tablas y las 28 migraciones aplicadas, incluidos RLS activo sin políticas y las restricciones e índices aprobados.
- `RoleSeeder` dejó exactamente `member` y `admin`, sin usuarios ni contenido de muestra.
- La conexión exige `sslmode=require`; una comprobación directa con `psql` y `libpq` confirmó negociación `TLSv1.3` con `TLS_AES_256_GCM_SHA384` y compresión desactivada en el pooler. `anon`, `authenticated` y `service_role` no conservan privilegios sobre ninguna tabla ni sobre las 23 secuencias de Recetaria.
- No queda implementación local pendiente. El desarrollador gestionará la publicación e integración de la rama y después podrá comprobarse el CI real.

## Contexto operativo

- Rama de trabajo: `feat/conexion-migraciones-postgresql`.
- Base de la rama: `ca45a0aec2a9760a48101febef4b14b279b1b89a`.
- La rama contiene el trabajo completo de la especificación 006; el agente no publicará ni integrará la rama.
- Supabase partía sin tablas ni datos de Recetaria. Las migraciones se aplicaron manualmente en dos lotes porque la primera ejecución detectó el supuesto incorrecto de que todas las tablas tenían `id`; la corrección quedó cubierta por una prueba de secuencias y se aplicó solo como migración pendiente.
- No se debe usar `migrate:fresh`, rollback ni un seeder general contra Supabase.
- Render no ejecutará migraciones durante el arranque; la aplicación remota es manual.

## Problemas conocidos y deuda técnica

No quedan fallos conocidos ni se ha detectado deuda técnica nueva dentro del alcance aprobado. GitHub Actions solo podrá comprobarse después de que el desarrollador publique la rama.

## Siguientes pasos

1. El desarrollador gestionará la publicación e integración de la rama 006.
2. Después de observar el CI real, su resultado se registrará mediante una nueva tarea documental conforme al flujo del proyecto.

Estos pasos no autorizan automáticamente cambios remotos, commits, publicación ni integración.
