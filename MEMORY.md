# Memoria de Recetaria

## Foco actual

La implementación documental de `004-flujo-git-local-para-agentes` está verificada localmente en `feat/simplifica-flujo-git-agentes`, con base `f97237d` y rama inicial publicada conforme al flujo 003. `test_reviewer` dio `PASS` y la especificación y tareas están `completed`; el plan permanece `approved`. El desarrollador asumirá la publicación e integración de la rama; su CI externo aún no se ha comprobado. El CI externo de la 003 integrada en `dev` y la publicación y CI de la 002 también siguen sin comprobarse aquí.

## Estado actual

- La base Laravel 12 + React + Inertia está confirmada en `main` y `dev`, con frontend TypeScript en `resources/js` y autenticación Breeze adaptada a CSS Modules y CSS global, sin Tailwind.
- El sistema SDD está publicado en `dev` mediante el commit `0bf9823`: proceso permanente, tres skills compartidas y tres agentes revisores de solo lectura.
- Los revisores activos se denominan `spec_reviewer`, `plan_reviewer` y `test_reviewer`; sus configuraciones TOML son válidas y mantienen el modo de solo lectura.
- Las tres skills pasan `quick_validate.py`, nombran al revisor correspondiente y una sesión nueva de Codex ha invocado correctamente a `spec_reviewer`, `plan_reviewer` y `test_reviewer` en modo de solo lectura.
- [`docs/modelo-relacional.md`](docs/modelo-relacional.md) representa visualmente las 20 tablas vigentes y [`docs/atributos-modelo-relacional.md`](docs/atributos-modelo-relacional.md) documenta sus atributos, restricciones conceptuales y relaciones. La implementación local no incluye código, migraciones ni cambios en PostgreSQL.
- La especificación `002`, su plan y sus tareas están completados localmente tras superar las tres revisiones SDD. Las comprobaciones documentales y `git diff --check` pasan.
- Pint, las 25 pruebas PHP, ESLint, Prettier, Vitest, el build y las comprobaciones documentales pasan.
- El workflow [**Integración y seguridad**](https://github.com/AngelRagel05/Recetaria/actions/runs/36794565559) ha pasado para `ea866a8` en `dev`.
- Las decisiones aprobadas están en [`docs/decisiones-tecnicas.md`](docs/decisiones-tecnicas.md) y el flujo está definido en [`docs/proceso-sdd.md`](docs/proceso-sdd.md).

## En curso

La skill Git y las reglas permanentes ya describen el flujo local de la 004. La validación estática, el diff, whitespace y la revisión documental de `CA-01` a `CA-10` pasaron; no se probó dinámicamente el comportamiento del agente. La 003 permanece como historial completado. La publicación, integración y CI externos de la 004 no están verificados. Los cambios documentales de la 002 siguen pendientes de publicación y comprobación externa.

## Alcance de esta memoria

`MEMORY.md` solo debe contener trabajo incompleto, decisiones pendientes, contexto y estado que sean relevantes para el foco actual del proyecto.

No debe convertirse en:

- Un backlog de funcionalidades futuras.
- Una lista de todo lo que todavía no existe.
- Una lista de todas las decisiones que algún día habrá que tomar.
- Un histórico de tareas completadas.
- Una duplicación de Git o de la documentación permanente.

Una ausencia o una decisión pendiente solo debe aparecer en `MEMORY.md` cuando sea relevante para el trabajo actual o para continuar correctamente desde el estado presente.

Cuando deje de ser relevante:

- Debe eliminarse de `MEMORY.md`; o
- trasladarse a documentación permanente si posee valor a largo plazo.

## Decisiones pendientes

La especificación `002` mantiene fuera de alcance las políticas de borrado, la migración de datos existentes, la autorización y moderación, el contrato del primer administrador y la integración técnica con Cloudinary. Estas materias requerirán decisiones y especificaciones posteriores cuando entren en el foco del proyecto.

## Contexto relevante

- Recetaria será una aplicación web para descubrir, crear y compartir recetas.
- Está concebida para ser una aplicación real, mantenible y razonablemente escalable, no solo una demostración.
- El proyecto no se desarrolla mediante vibe coding. Los agentes apoyan al desarrollador, pero no son responsables de las decisiones de producto ni técnicas.
- Todos los agentes deben leer `AGENTS.md` y este archivo antes de comenzar una tarea relevante.

## Problemas conocidos

No hay problemas conocidos en la implementación ni en su CI.

## Deuda técnica

Actualmente no hay ninguna deuda técnica registrada.

## Siguientes pasos

- El desarrollador gestionará la publicación e integración de la rama `004`; después se comprobará el CI real.
- Comprobar el CI real de `003` tras su integración en `dev` antes de registrar un resultado externo.
- Publicar los cambios documentales de la especificación `002` cuando el desarrollador lo decida.
- Tras la publicación, comprobar el CI y actualizar esta memoria con el resultado externo real.

Estos siguientes pasos describen la dirección natural del proyecto; no constituyen una autorización automática para ejecutar trabajo.
