---
id: "003"
title: "Flujo Git supervisado para agentes"
status: completed
---

# Especificación: Flujo Git supervisado para agentes

## Problema y objetivo

Los agentes necesitan un procedimiento Git uniforme para trabajar en una rama creada desde `dev`, publicar su trabajo e integrarlo de nuevo en `dev` bajo la supervisión del desarrollador. La rama de trabajo debe permanecer disponible, tanto localmente como en el remoto, después de la integración.

El objetivo es describir ese procedimiento en la skill implícita `$recetaria-git-flow`, mediante comandos Git ordinarios y autorizaciones humanas separadas para cada acción lógica que cambie el estado de la tarea. La skill es un contrato de instrucciones: su revisión documental confirma la presencia y coherencia de las reglas, pero no garantiza que un agente las cumpla en todas las sesiones. El desarrollador supervisa las operaciones reales y conserva en exclusiva las aprobaciones SDD y las autorizaciones Git.

## Alcance

### Incluido

- Aplicar la skill a los cambios del repositorio realizados por agentes; para el desarrollador, el flujo es opcional.
- Iniciar una tarea únicamente desde `dev` limpio y sincronizado con su remoto, sin otra tarea activa.
- Proponer una rama `<tipo>/<nombre-tecnico>` con uno de los tipos `feat`, `fix`, `refactor`, `docs`, `test` o `chore` y un nombre ASCII en kebab-case; crearla solo tras autorización específica.
- Registrar la rama activa y su commit base en la configuración Git local. `MEMORY.md` será informativo, no la fuente técnica de la tarea activa.
- Publicar inicialmente la rama con otra autorización y completar ese push antes de modificar archivos.
- Aplicar las puertas SDD y trabajar en el alcance aprobado; autorizar cada commit por separado y permitir varios commits locales antes de un push autorizado de la rama.
- Publicar todos los commits de la rama de trabajo antes de la integración; autorizar por separado el cambio a `dev`, el merge local y el push posterior de `dev`.
- Cerrar la tarea, después de publicar `dev`, mediante una autorización propia que retire únicamente el registro local de tarea activa y conserve ambas ramas.
- Mantener la adopción de una rama existente y la cancelación de una tarea, ambas bajo confirmación explícita y sin perder el trabajo.
- Utilizar una nueva rama `docs/` con el mismo flujo para registrar en `MEMORY.md` el resultado del CI de `dev` cuando se haya observado.

### Fuera de alcance

- Sustituir aprobaciones SDD o autorizaciones del desarrollador por un resultado `PASS` o por una autorización anterior.
- Crear scripts, hooks, dependencias o pruebas del flujo en GitHub Actions.
- Crear pull requests, integrar mediante GitHub, operar automáticamente sobre `main`, tags, versiones o despliegues.
- Gestionar varias tareas activas simultáneamente, reescribir el historial o usar operaciones forzadas.
- Cambiar el comportamiento funcional de la aplicación Recetaria.
- Exigir repositorios temporales o afirmar que la revisión estática prueba el comportamiento del agente ante todos los fallos.

## Actores y estado

- **Agente principal:** comprueba las precondiciones, muestra la propuesta de cada acción lógica y la ejecuta solo tras recibir su permiso específico. Informa del resultado antes de proponer el siguiente paso.
- **Desarrollador:** aprueba cada fase SDD aplicable y autoriza de forma independiente crear la rama, cada push, cada commit, cambiar a `dev`, fusionar, cerrar la tarea, adoptar una rama o cancelar una tarea.
- **Revisores SDD:** revisan requisitos, plan y verificaciones en modo de solo lectura; un `PASS` no autoriza operaciones Git.
- **Git local:** conserva una única rama activa y su commit base en `recetaria.active-branch` y `recetaria.base-commit`. Ambas claves existen juntas o están ausentes juntas.
- **Remoto:** se obtiene del upstream de `dev`, cuya rama de integración debe ser `dev`; actualmente es `origin`.

Una autorización cubre una sola acción lógica y sus preparativos necesarios, como crear la rama y registrar su base, o preparar rutas y crear un commit. Se solicita después de mostrar el efecto concreto y se consume al intentar la acción, aunque falle. No cubre el paso siguiente, un reintento ni otra sesión. Las comprobaciones de solo lectura no necesitan permiso.

## Flujos

### Inicio y publicación inicial

1. El agente comprueba que la rama actual sea `dev`, que índice y árbol estén limpios, que `dev` coincida con su remoto, que no haya otra tarea activa ni una operación Git incompleta y que el nombre propuesto no exista local ni remotamente. Si alguna condición falla, se detiene sin crear otra rama ni sincronizar automáticamente.
2. Presenta el tipo, el nombre técnico y la rama exacta. Tras una autorización específica, crea la rama desde `dev` y registra su nombre y commit base en la configuración Git local. Si el registro queda parcial, se detiene para una decisión humana.
3. Presenta el remoto y destino exactos y solicita otra autorización para el push inicial. No modifica archivos hasta que termine correctamente. Si se deniega o falla, conserva la rama y el registro para un reintento con permiso nuevo.

### Trabajo, evidencia SDD y publicación de la rama

1. El agente aplica en cada fase las puertas SDD o el flujo ligero que correspondan. La especificación y el plan pueden redactarse en la rama ya publicada, pero el código de aplicación no se modifica hasta contar con las aprobaciones y la solicitud de implementación exigidas. Los estados de `spec.md`, `plan.md` y `tasks.md`, `MEMORY.md`, Git y la conversación vigente aportan la evidencia aplicable; una evidencia ausente no se infiere.
2. Modifica únicamente el alcance aprobado. Cada commit requiere presentar previamente mensaje convencional en español y rutas exactas, comprobar la rama activa y el índice, y obtener una autorización propia. Un commit no publica nada por sí mismo.
3. Puede acumular varios commits autorizados. Para cada push posterior de la rama, presenta remoto, destino y todos los commits pendientes y obtiene otro permiso. La rama remota debe contener todos los commits de la rama activa antes de proponer el merge.
4. Cualquier cambio no limitado al cierre administrativo SDD previsto invalida las verificaciones y la revisión de `test_reviewer`; dicho cierre conserva sus comprobaciones documentales propias.

### Cambio a `dev`, integración y publicación

1. Antes de la verificación final y otra vez antes de proponer la integración, el agente comprueba que el commit base registrado, `dev` local y `dev` remoto sigan coincidiendo. Si hay deriva, se detiene y consulta sin integrar ni reescribir el historial.
2. Con verificaciones vigentes, ningún `BLOCKED`, árbol e índice limpios y rama de trabajo completamente publicada, presenta el cambio de la rama activa a `dev` y pide autorización específica para cambiar de rama.
3. Tras cambiar, confirma que la rama actual es `dev` y que su `HEAD` sigue en la base registrada. Si el cambio o la validación falla, no propone ni ejecuta el merge y solicita una decisión humana.
4. Presenta la rama de origen, `dev` como destino, `--no-ff` y el mensaje excepcional `merge: integra <rama> en dev`. Solo tras una nueva autorización ejecuta el merge local. Ese permiso no cubre el push de `dev`.
5. Después del merge correcto, comprueba que el resultado contiene la punta de la rama de trabajo y que el remoto `dev` no avanzó. Presenta el commit pendiente y solicita otra autorización antes de publicar `dev`. Si el push falla, conserva el estado sin cerrar la tarea ni intentar integraciones automáticas.

### Cierre, adopción, cancelación y CI

1. Después de confirmar el push de `dev`, el agente presenta la rama y las dos claves locales que retirará. Una autorización específica permite cerrar la tarea eliminando solo `recetaria.active-branch` y `recetaria.base-commit`. La rama local y la remota permanecen. Si el registro queda parcial, bloquea nuevas tareas y consulta.
2. Para adoptar una rama existente sin tarea activa, valida su nombre, upstream, existencia remota y base única respecto de `dev`; muestra cualquier deriva y solicita confirmación antes de registrar la tarea. La deriva no se resuelve automáticamente.
3. Una cancelación expresamente autorizada libera únicamente el registro local y conserva ramas, commits, índice y árbol de trabajo. No equivale al cierre de una tarea integrada.
4. Tras publicar `dev` y observar su CI, el resultado externo se registra en `MEMORY.md` mediante una nueva tarea y rama `docs/` sometidas a este mismo flujo. El CI generado por ese cierre documental no reabre la tarea funcional.

### Fallos y reintentos

- Una condición incumplida, un destino distinto del previsto, una operación Git incompleta o un permiso ausente detienen la acción afectada; no se actúa sobre `main`.
- Si un commit falla tras preparar rutas, el agente conserva los cambios e informa del estado del índice. Si el merge genera conflictos, detiene la publicación y presenta el estado para decidir la recuperación. Ninguna acción de recuperación adicional se considera autorizada por el permiso fallido.
- Un fallo de push, cambio de rama, merge, cierre, adopción o cancelación conserva el estado recuperable. Todo reintento requiere una autorización nueva y una propuesta actualizada.
- El agente no ejecuta automáticamente `pull`, `rebase`, `reset`, `stash`, borrados forzados ni reparaciones que cambien el historial.

## Reglas

- Una sola tarea activa acompaña todas las fases SDD de un cambio. La rama retenida al cierre no bloquea nuevas tareas porque el registro local ya no la señala como activa; los nombres nuevos no reutilizan ramas existentes.
- Los tipos de rama y commit de trabajo son `feat`, `fix`, `refactor`, `docs`, `test` y `chore`. El nombre técnico es ASCII en kebab-case; el commit de trabajo usa `<tipo>: <descripción en español>`. El mensaje de merge indicado es la única excepción.
- El flujo exige autorizaciones independientes para creación y registro de rama, push inicial, cada commit, cada push posterior, cambio a `dev`, merge, push de `dev` y cierre del registro; adoptar y cancelar también requieren confirmación propia.
- Una aprobación SDD, un `PASS`, la solicitud de implementación o un permiso anterior no sustituyen ninguna de esas autorizaciones.
- El trabajo no se integra hasta superar las verificaciones aplicables y la revisión de `test_reviewer`. La publicación en `dev` y su CI se registran conforme al proceso SDD, sin confundir verificación local con resultado externo.
- Las ramas de trabajo permanecen local y remotamente tras el cierre.
- El detalle operativo se implementará en la skill solo después de aprobar esta especificación y su plan. Hasta entonces continúan vigentes las reglas actuales de `AGENTS.md` y la skill existente.

## Criterios de aceptación

- `CA-01`: la skill y sus metadatos declaran su invocación implícita para cambios del repositorio y describen el flujo como instrucciones supervisadas, sin scripts, hooks, dependencias ni cambios en GitHub Actions.
- `CA-02`: la skill documenta las comprobaciones de `dev` limpio y sincronizado, ausencia de tarea activa, operación incompleta y nombre ya existente antes de crear una rama de tipo permitido y nombre técnico válido.
- `CA-03`: la skill exige mostrar y autorizar la creación de la rama con su registro local, y otra autorización para el push inicial, completado antes de modificar archivos.
- `CA-04`: la skill distingue aprobaciones SDD de permisos Git y documenta la evidencia vigente y la invalidación de verificaciones tras cambios no administrativos.
- `CA-05`: la skill exige propuesta y permiso propios para cada commit y cada push de la rama, muestra rutas, mensajes, destino y commits pendientes, y exige publicar todos los commits antes del merge.
- `CA-06`: la skill documenta la comprobación de base frente a `dev` local y remoto y la detención sin integración automática ante deriva.
- `CA-07`: la skill exige una autorización para cambiar a `dev`, valida rama y base después del cambio y exige otra autorización para `merge --no-ff` con el mensaje excepcional, sin publicar `dev` implícitamente.
- `CA-08`: la skill exige comprobar el merge y el remoto, mostrar el commit pendiente y obtener un permiso separado para publicar `dev`.
- `CA-09`: la skill exige permiso propio para cerrar la tarea retirando solo las dos claves locales y conservando ambas ramas.
- `CA-10`: la skill documenta adopción y cancelación autorizadas, estado recuperable ante fallos, reintentos con permiso nuevo y ausencia de reparaciones automáticas o acciones sobre `main`.
- `CA-11`: `AGENTS.md`, el proceso SDD y las decisiones técnicas quedan alineados con el contrato, incluida la nueva rama `docs/` posterior al CI y la conservación de sus ramas.

## Decisiones aprobadas

- El desarrollador decidió sustituir el flujo anterior por una secuencia supervisada de creación y publicación de rama, cambios, commits, publicación de la rama, cambio a `dev`, merge, publicación de `dev` y cierre del registro local.
- Cada acción lógica que cambie el estado de la tarea necesita autorización propia, inmediata y de un solo uso. Los preparativos necesarios pertenecen a la misma acción; las comprobaciones de solo lectura no necesitan permiso.
- El cambio a `dev` y el merge son acciones distintas con permisos distintos. El merge seguirá siendo `--no-ff` y su commit tendrá el mensaje excepcional acordado.
- Tras publicar `dev`, el cierre autorizado libera únicamente el registro local; las ramas de trabajo permanecen en el repositorio local y en el remoto.
- Se conservan los seis tipos de trabajo, las reglas de nombres y mensajes, la tarea activa única, la adopción, la cancelación, las puertas SDD, la detención ante deriva y la exclusión de `main`.
- El cierre posterior al CI continúa en una nueva rama `docs/` con el mismo flujo. La aceptación de esta skill será documental y no afirmará pruebas exhaustivas del comportamiento del agente.

## Decisiones pendientes

- No hay decisiones pendientes identificadas para esta especificación.
