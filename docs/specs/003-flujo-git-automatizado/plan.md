---
spec: "003"
status: approved
---

# Plan técnico: Flujo Git supervisado para agentes

## Resumen

Adaptar la skill existente `$recetaria-git-flow` al contrato documental aprobado. El agente propondrá y solicitará una autorización distinta para cada acción lógica que cambie Git: crear y registrar la rama, cada push y commit, cambiar a `dev`, fusionar y cerrar el registro local. La rama de trabajo permanecerá local y remotamente tras publicar `dev`.

El trabajo reaprovechará los metadatos y la documentación ya creados. No añadirá scripts, hooks, dependencias, código de aplicación ni cambios en GitHub Actions. La aceptación será estática: comprobará que las instrucciones y los documentos son coherentes, sin presentarla como prueba de que un agente obedecerá siempre el flujo.

## Componentes afectados

- `.agents/skills/recetaria-git-flow/SKILL.md` y sus metadatos: fases conversacionales, precondiciones, propuestas, permisos, comandos y detención ante fallos.
- `AGENTS.md`: reemplazar las reglas de creación sin permiso y eliminación de ramas por las aprobadas para el flujo supervisado.
- `docs/decisiones-tecnicas.md` y `docs/proceso-sdd.md`: resumir el contrato vigente, sus puertas SDD, el cierre del registro y la rama documental posterior al CI.
- `MEMORY.md`: reflejar el estado operativo, las verificaciones y las publicaciones que sigan pendientes.
- Artefactos 003: seguimiento de tareas y cierre SDD, sin alterar los criterios aprobados de `spec.md`.

La aplicación, las migraciones, las dependencias, Docker, Render, Supabase y GitHub Actions quedan fuera del cambio.

## Contratos e implementación

### Descubrimiento, permisos y estado

- Conservar `name: recetaria-git-flow` y `policy.allow_implicit_invocation: true`. `start`, `adopt`, `commit`, `push`, `switch-dev`, `merge`, `publish-dev`, `close` y `cancel` describirán fases conversacionales, no comandos ejecutables.
- Usar únicamente las claves Git locales `recetaria.active-branch` y `recetaria.base-commit` para la tarea activa; exigir un único valor de cada una o ausencia conjunta. `MEMORY.md` no sustituirá esas claves. No persistir permisos ni resultados de revisores.
- Presentar antes de cada acción lógica los efectos y referencias concretos, obtener después un permiso específico y consumirlo al intentarla. Una acción puede incluir sus preparativos necesarios —por ejemplo, crear rama y registrar base o preparar rutas y crear commit—, pero nunca la siguiente acción. Las comprobaciones de solo lectura no requieren permiso.
- Usar consultas remotas de solo lectura, como `git ls-remote`, para comparar las puntas remotas sin actualizar referencias locales antes de recibir un permiso. Si el remoto no puede comprobarse, detener la acción afectada; no inferir sincronización a partir de una referencia posiblemente obsoleta.

### Inicio, trabajo y publicación de la rama

- `start` comprobará `dev` actual, índice y árbol limpios, ausencia de tarea u operación Git incompleta, remoto configurado para `dev`, igualdad entre `dev` local y remoto, nombre `<tipo>/<slug>` válido y ausencia de rama homónima local y remota. Tras permiso propio, ejecutará `git switch -c <rama> dev` y registrará rama y base; un estado parcial detendrá el trabajo.
- El push inicial tendrá propuesta y permiso independientes. Creará el upstream `<remoto>/<rama>` con `git push -u`; ningún archivo se modificará antes de que termine bien.
- Cada commit mostrará mensaje `<tipo>: <descripción en español>` y rutas literales, comprobará rama activa, upstream e índice inicialmente vacío y preparará solo lo autorizado. Un fallo conservará el árbol y expondrá el estado del índice; retirar rutas preparadas será una nueva acción autorizada, no una reparación implícita.
- Los commits locales podrán acumularse. Cada push posterior mostrará remoto, destino y todos los commits pendientes, pedirá permiso propio y nunca apuntará a `main` u otra rama. La punta remota de trabajo deberá coincidir con la local antes de la integración.

### Evidencia, cambio de rama, merge y publicación de `dev`

- Mantener las puertas SDD y la invalidación de verificaciones tras cambios no administrativos. Antes de la verificación final y otra vez antes de cambiar a `dev`, comparar base registrada, `dev` local y punta remota. Ante deriva, detenerse sin `pull`, `rebase`, `reset` ni integración automática.
- Con verificaciones vigentes, ningún `BLOCKED`, árbol limpio y rama publicada, proponer `git switch dev` y solicitar su permiso. Tras ejecutarlo, confirmar rama actual `dev` y `HEAD` igual a la base registrada; si falla, no proponer el merge.
- **Inmediatamente antes de proponer y ejecutar el merge**, volver a consultar la punta remota de `dev` y comparar base, `dev` local y remoto. Solo con igualdad y un permiso nuevo ejecutar `git merge --no-ff <rama> -m "merge: integra <rama> en dev"`. El permiso de cambio de rama no cubre el merge.
- Si el merge deja conflictos, conservar el estado, informar y solicitar una decisión para cualquier recuperación; no ejecutar `merge --abort` ni cambiar otra vez de rama con el permiso consumido. Cualquier corrección invalidará la verificación anterior.
- Tras un merge correcto, comprobar que el primer padre sea la base y el segundo la punta publicada de la rama activa. Consultar de nuevo `dev` remoto y exigir que siga en la base; mostrar el commit de merge y pedir otro permiso para `git push <remoto> dev`. Un rechazo conserva el merge local y la tarea activa.

### Cierre, adopción, cancelación y CI

- `close` solo se propondrá desde `dev` después de comprobar que la punta remota de `dev` es el merge esperado. Mostrará las dos claves locales y, tras permiso específico, las retirará sin tocar ninguna rama. Un resultado parcial bloqueará tareas nuevas y requerirá intervención.
- `adopt` conservará la validación de nombre, upstream, existencia remota y base única mediante `merge-base --all`; registrará las claves solo tras autorización. `cancel` retirará únicamente esas claves tras permiso propio y conservará ramas y trabajo.
- Tras publicar `dev` y observar su CI, la actualización posterior de `MEMORY.md` se hará en una nueva rama `docs/` sometida a los mismos permisos y al mismo cierre sin retirar ramas. El CI de esa actualización no reabrirá la tarea funcional.

## Fases y verificación

1. Tras una nueva solicitud explícita de implementación, cambiar `tasks.md` a `in_progress` y adaptar la skill y sus metadatos; la rama actual ya está adoptada, por lo que no se repetirá `start` ni `adopt` para 003.
2. Alinear `AGENTS.md` y la documentación permanente con la spec aprobada, eliminando el contrato anterior de creación sin permiso y eliminación de ramas.
3. Validar estáticamente la skill y su YAML con las herramientas existentes. Revisar que cada criterio `CA-01` a `CA-11` tenga evidencia en instrucciones y documentos, sin presentar inspección como prueba funcional.
4. Ejecutar búsquedas dirigidas de permisos, destinos, secuencia de merge, cierre y referencias obsoletas; revisar el diff completo y `git diff --check`, incluida la comprobación de archivos aún no versionados.
5. Ejecutar `$recetaria-verify` y solicitar a `test_reviewer` la relación entre los once criterios y la evidencia real. Si devuelve `BLOCKED`, mantener abierta la tarea; solo con verificaciones y revisión satisfactorias podrán cerrarse `tasks.md` y `spec.md`.

| Criterios | Evidencia prevista |
| --- | --- |
| `CA-01`–`CA-03` | Metadatos, inicio, permiso de creación y push inicial antes de editar. |
| `CA-04`–`CA-06` | Puertas SDD, commit/push independientes y comprobaciones de deriva. |
| `CA-07`–`CA-09` | Cambio a `dev`, merge, push de `dev` y cierre sin retirar ramas. |
| `CA-10`–`CA-11` | Adopción, cancelación, fallos y coherencia de reglas permanentes/CI. |

No se crearán repositorios temporales ni se ejecutará una batería dinámica de escenarios negativos. Las suites PHP y frontend no se usarán como evidencia específica de una skill documental. Los controles ejecutados se informarán sin atribuirles garantías que no proporcionan.

## Despliegue y riesgos

No hay despliegue de aplicación, migración de datos ni nueva infraestructura. GitHub Actions no cambia. La publicación real de la rama y de `dev`, el merge y el cierre de registro quedan fuera de la implementación del plan y requerirán sus permisos posteriores.

- **Cambio remoto entre permisos separados:** repetir la comparación de la base inmediatamente antes del merge y antes del push de `dev`; si difiere, detenerse.
- **Estado local parcial o fallo de un comando:** conservar ramas y trabajo, informar y pedir una nueva autorización para la recuperación o el reintento.
- **Contrato anterior aún vigente:** no aplicar el nuevo flujo como operativo hasta alinear la skill y `AGENTS.md` tras aprobar este plan y solicitar su implementación.
