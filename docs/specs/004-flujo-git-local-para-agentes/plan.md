---
spec: "004"
status: approved
---

# Plan técnico: Flujo Git local para agentes

## Resumen

Adaptar la skill existente `$recetaria-git-flow` para que una tarea del agente termine en un commit local autorizado y en la retirada de su registro Git local. El desarrollador asumirá la publicación e integración. La aceptación será documental: comprobará las instrucciones y su coherencia, sin presentar esa inspección como prueba exhaustiva del comportamiento del agente.

La rama de transición `feat/simplifica-flujo-git-agentes` ya fue creada y publicada inicialmente bajo el contrato 003. No se repetirán `start` ni el push inicial para esta tarea. La spec 003 se conservará `completed` como historial.

## Componentes afectados

- `.agents/skills/recetaria-git-flow/SKILL.md` y `agents/openai.yaml`: sustituir las fases de publicación e integración por inicio local, commits autorizados y commit final; mantener `name: recetaria-git-flow` e invocación implícita.
- `AGENTS.md`, `docs/decisiones-tecnicas.md` y `docs/proceso-sdd.md`: alinear las reglas vigentes de agentes, las puertas SDD y el seguimiento posterior al CI con el nuevo límite de responsabilidad.
- `MEMORY.md` y artefactos 004: reflejar estado operativo y cierre SDD sin reescribir la especificación 003.

No cambiar código de aplicación, migraciones, dependencias, Docker, despliegue ni GitHub Actions.

## Contratos, datos e interfaces

- Conservar únicamente `recetaria.active-branch` y `recetaria.base-commit` en la configuración Git local como estado de tarea activa. Exigir un valor de cada una o ausencia conjunta; no persistir permisos ni resultados de revisión. `MEMORY.md` seguirá siendo informativo.
- Las fases conversacionales de la skill serán `start`, `adopt`, `commit`, `final-commit` y `cancel`, no comandos ejecutables. Retirar `push`, `switch-dev`, `merge`, `publish-dev` y `close` del flujo del agente. El desarrollador podrá publicar e integrar mediante su propio flujo; la skill no lo hará por él.
- Para `start`, comprobar `dev` actual, árbol e índice limpios, ausencia de tarea y operación incompleta, upstream de `dev` configurado, igualdad de `dev` local con la punta remota consultada en solo lectura, nombre `<tipo>/<slug>` válido y libre local y remotamente. Tras mostrar rama y base y obtener permiso, ejecutar `git switch -c <rama> dev` y registrar las dos claves. No exigir upstream ni push para modificar archivos. Si el registro falla, informar del estado parcial sin reparación implícita.
- Para cada `commit`, exigir rama activa, operación Git completa, índice inicialmente vacío, rutas literales revisadas y mensaje de trabajo `<tipo>: <descripción en español>`. Mostrar mensaje y rutas; tras un permiso propio, preparar solo esas rutas, confirmar que el índice coincide y crear el commit. Se permiten varios commits locales. Un fallo tras preparar conserva el árbol y expone el índice; retirar rutas preparadas requiere otra autorización.
- `final-commit` añade a las condiciones anteriores verificaciones vigentes y ausencia de `BLOCKED`. Antes del permiso, mostrar que será el último commit y que retirará ambas claves solo si Git confirma el commit. La misma autorización cubre `git add`, `git commit` y, después del éxito, `git config --local --unset-all` de esas dos claves. Confirmar su ausencia; si el commit falla, conservar ambas, y si falla la retirada, bloquear tareas nuevas e informar del estado parcial. Ninguna rama se cambia o elimina.
- Para `adopt`, validar una rama local de nombre permitido, ausencia de tarea activa y operación incompleta, y una base única mediante `git merge-base --all dev <rama>`. No requerir upstream ni existencia remota; presentar rama y base antes del permiso para registrarlas. `cancel` requiere permiso propio para quitar solo ambas claves y conservar rama, commits, índice y árbol.
- Después de `start`, si se detecta avance de `dev` local o remoto, informar y continuar en la rama local sin alterar la base ni sincronizar automáticamente. Para consultas remotas usar `git ls-remote`, no `fetch`; si la consulta inicial falla, no crear rama. No operar automáticamente sobre `main` ni usar `pull`, `rebase`, `reset`, `stash` u operaciones forzadas como reparación.

## Fases de implementación

1. Tras una nueva solicitud explícita de implementación, cambiar `tasks.md` a `in_progress`; adaptar la skill y sus metadatos, preservando `policy.allow_implicit_invocation: true`.
2. Alinear `AGENTS.md` y la documentación permanente. Eliminar de las reglas vigentes la exigencia de push inicial, las autorizaciones de push/cambio a `dev`/merge y el cierre posterior a publicar `dev`; dejar claro que la integración y sus conflictos corresponden al desarrollador.
3. Mantener las puertas SDD: aprobaciones de requisitos y plan separadas de los permisos Git, `test_reviewer` antes del cierre local, invalidación tras cambios funcionales y comprobaciones documentales propias del cierre administrativo. La actualización de `MEMORY.md` tras observar CI será otra tarea `docs/` con el mismo flujo local, no una continuación automática.
4. Validar el contrato y la documentación; solicitar a `test_reviewer` la relación entre `CA-01` y `CA-10` y la evidencia real. Solo con verificaciones y revisión satisfactorias marcar `tasks.md` y `spec.md` como `completed` y actualizar `MEMORY.md` con publicación/CI pendientes.

El plan no ejecuta el commit final. Después de la implementación y de cerrar los estados SDD, se propondrán mensaje, rutas y retirada de claves para pedir la autorización específica de `final-commit`. La rama 004 seguirá teniendo un upstream por su creación transitoria, pero el nuevo contrato no lo exigirá ni hará más pushes.

## Pruebas y criterios de aceptación

| Criterios | Evidencia prevista |
| --- | --- |
| `CA-01`–`CA-02` | Frontmatter y metadatos, descubrimiento implícito, precondiciones de `start` y ausencia de push inicial. |
| `CA-03`–`CA-05` | Puertas SDD, permisos y rutas por commit, secuencia y fallos del commit final. |
| `CA-06`–`CA-08` | Deriva informativa, exclusión de fases de publicación/integración, adopción y cancelación locales. |
| `CA-09`–`CA-10` | Reglas permanentes y `MEMORY.md` coherentes, 003 conservada como historial y alcance documental explícito. |

Ejecutar `quick_validate.py` de `skill-creator`, validar el YAML de `openai.yaml`, buscar referencias contradictorias en la skill y documentación **vigentes**, revisar el diff completo y ejecutar `git diff --check` también para archivos todavía no versionados. Las suites PHP y frontend no son evidencia específica de una skill documental. No crear repositorios temporales ni pruebas dinámicas exhaustivas.

## Documentación, despliegue y riesgos

No hay despliegue, migración ni cambio de CI. La publicación e integración reales quedan fuera del agente y no se darán por hechas al cerrar la implementación local. `MEMORY.md` distinguirá verificación local de resultado externo observado.

- Si el commit final tiene éxito y falla la retirada de claves, el commit permanece y la tarea queda parcialmente activa; informar y pedir permiso nuevo para recuperar el registro, sin crear otro commit automáticamente.
- Si el desarrollador avanza `dev` durante el trabajo, conservar la base y comunicar la deriva; los conflictos de integración pertenecen a su flujo.
- Las reglas 003 seguirán vigentes hasta que la implementación aprobada alinee la skill y `AGENTS.md`. Ninguna aprobación SDD, `PASS` o permiso anterior autoriza un commit o publicación.
