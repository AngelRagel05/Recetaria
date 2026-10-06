# Recetaria

Aplicación web para descubrir, crear y compartir recetas. La base inicial integra Laravel 12 y React mediante Inertia.js, con TypeScript en `resources/js`, CSS Modules y PostgreSQL alojado en Supabase.

## Requisitos locales

- PHP 8.2 o posterior dentro de la serie compatible con Laravel 12, con Composer.
- Node.js 22.16 o posterior de la rama 22, con npm.
- PostgreSQL 17 local para ejecutar las pruebas backend de forma aislada.
- Acceso a una base PostgreSQL de Supabase para utilizar la aplicación fuera de las pruebas automatizadas.

Las versiones concretas de las dependencias están fijadas en `composer.lock` y `package-lock.json`. Docker se utiliza para construir la imagen de despliegue en Render; no es necesario para ejecutar el servidor de desarrollo de Laravel.

## Configuración local

1. Instalar las dependencias con `composer install` y `npm ci`.
2. Copiar `.env.example` a `.env` y generar una clave con `php artisan key:generate`.
3. Configurar en `.env` las variables `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME` y `DB_PASSWORD` con los datos de Supabase. La conexión PostgreSQL utiliza `DB_SSLMODE=require`.
4. Ejecutar `php artisan migrate` cuando la base de datos esté disponible.
5. Iniciar Laravel con `php artisan serve` y, en otra terminal, Vite con `npm run dev`.

No se deben subir credenciales ni archivos `.env` al repositorio. El correo usa inicialmente el controlador `log` de Laravel; los mensajes de recuperación de contraseña no se envían a usuarios reales hasta configurar un servicio de correo adecuado.

## Base de datos de pruebas

1. Crear una base vacía llamada exactamente `recetaria_testing` en PostgreSQL 17 local.
2. Copiar `.env.testing.example` a `.env.testing`.
3. Ejecutar `php artisan key:generate --env=testing` para generar una clave exclusiva de pruebas.
4. Completar en `.env.testing` el usuario y la contraseña locales de PostgreSQL. Este archivo está ignorado por Git y no debe compartirse.
5. Mantener `DB_HOST` en `127.0.0.1` o `localhost`, `DB_DATABASE=recetaria_testing` y `DB_SSLMODE=disable` para el entorno local.

Las pruebas que usan `RefreshDatabase` se detienen antes de migrar si la conexión no es PostgreSQL local o si el nombre de la base no es `recetaria_testing`. `php artisan migrate:fresh --seed --env=testing` solo puede utilizarse contra esa base local aislada; nunca contra Supabase.

## Verificación

- Backend: `php artisan test`.
- Frontend: `npm test`, `npm run lint`, `npm run format:check` y `npm run build`.

Las pruebas PHP usan PostgreSQL 17 local mediante `.env.testing` y simulan la integración de Vite, por lo que no necesitan credenciales de Supabase ni recursos frontend compilados. Las pruebas frontend usan Vitest, jsdom y React Testing Library; `npm run build` verifica la compilación por separado. El formato puede aplicarse con `npm run format`.

El workflow de GitHub Actions en `.github/workflows/ci.yml` levanta un servicio efímero PostgreSQL 17 y ejecuta estas comprobaciones y las auditorías de dependencias de Composer y npm en los pushes a `main` y `dev`, y en los pull requests dirigidos a cualquiera de esas ramas. No utiliza credenciales de Supabase ni de Render y solo solicita permiso de lectura del repositorio. Para que se ejecute en GitHub, el archivo debe estar publicado en la rama correspondiente y Actions debe estar habilitado en su configuración.

## Despliegue previsto en Render

El `Dockerfile` construye las dependencias PHP y los recursos frontend y sirve Laravel con Apache en el puerto `10000`. Se debe crear un servicio web de Render basado en Docker, establecer las variables de entorno de producción (`APP_ENV=production`, `APP_DEBUG=false`, `APP_URL`, `ASSET_URL`, `APP_KEY`, `LOG_CHANNEL=stderr` y las variables `DB_*` de Supabase) y ejecutar las migraciones antes de utilizar las rutas que dependen de la base de datos. `APP_URL` y `ASSET_URL` deben usar la URL HTTPS pública del servicio para evitar recursos mixtos. Las credenciales se configuran en Render, nunca en la imagen ni en Git.

La imagen puede comprobarse localmente con `docker build -t recetaria .` cuando Docker esté disponible. Preparar la imagen no crea ni despliega automáticamente un servicio en Render.

Las decisiones técnicas aprobadas y sus límites se mantienen en [`docs/decisiones-tecnicas.md`](docs/decisiones-tecnicas.md).
