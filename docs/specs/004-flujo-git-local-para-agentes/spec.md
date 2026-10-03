---
id: "004"
title: "Flujo Git local para agentes"
status: completed
---

# Especificación: Flujo Git local para agentes

## Problema y objetivo

La especificación 003 estableció un flujo supervisado en el que el agente también publica ramas, cambia a `dev`, integra y publica el resultado. El desarrollador ha asumido personalmente la publicación y la integración y considera que esas fases del agente complican y retrasan el trabajo.

El objetivo de esta especificación es sustituir el contrato operativo de la 003 por uno que termine con un commit local en la rama de trabajo. El agente prepara y verifica el cambio; el desarrollador decide cómo publicarlo e integrarlo. La skill `$recetaria-git-flow` seguirá siendo un contrato documental de instrucciones, no una garantía de comportamiento del agente en todas las sesiones o fallos. La 003 permanece completada como historial de la versión anterior.

## Alcance

### Incluido

- Mantener el flujo obligatorio para agentes y opcional para el desarrollador, con una sola tarea activa registrada mediante `recetaria.active-branch` y `recetaria.base-commit` en la configuración Git local.
- Iniciar una tarea desde `dev` limpio y sincronizado con su remoto, sin otra tarea activa ni operación Git incompleta. Proponer una rama `<tipo>/<nombre-tecnico>` no existente, con tipo `feat`, `fix`, `refactor`, `docs`, `test` o `chore` y nombre ASCII en kebab-case; crearla localmente y registrar la base solo tras permiso específico.
- Permitir modificar archivos en esa rama local sin publicarla inicialmente. Conservar las aprobaciones y verificaciones SDD aplicables antes de declarar el trabajo terminado.
- Permitir varios commits locales, cada uno con mensaje convencional en español, rutas exactas y autorización propia. El commit final se identifica antes de solicitar su permiso.
- Tras un commit final correcto, retirar únicamente las dos claves locales de tarea activa como parte de esa misma acción autorizada. Conservar la rama local, el trabajo y los commits; el agente permanece en esa rama.
- Mantener adopción y cancelación autorizadas de ramas locales sin exigir upstream remoto, así como la detención e información ante fallos o estado parcial.
- Informar si `dev` avanza durante el trabajo y continuar en la rama local sin sincronizarla ni integrarla automáticamente. El desarrollador asume la publicación, la integración y los posibles conflictos.
- Tras observar el CI de una integración realizada por el desarrollador, registrar su resultado real en `MEMORY.md` mediante una nueva tarea documental, no como continuación automática de la tarea funcional.

### Fuera de alcance

- Que el agente haga push inicial o posterior, cambie a `dev`, fusione, publique `dev` o borre ramas como parte del flujo de una tarea.
- Sustituir aprobaciones SDD o permisos Git por un `PASS`, una solicitud general o un permiso anterior.
- Operar automáticamente sobre `main`, reescribir el historial o ejecutar `pull`, `rebase`, `reset`, `stash`, operaciones forzadas o reparaciones automáticas.
- Añadir scripts, hooks, dependencias, pruebas del flujo en GitHub Actions o cambios funcionales en la aplicación.
- Exigir repositorios temporales o afirmar que una revisión documental demuestra la conducta del agente ante todos los fallos.

## Actores y estado

- **Agente principal:** propone la rama y cada commit, comprueba las condiciones y actúa solo tras el permiso correspondiente. Su entrega termina con el commit local final y la liberación del registro de tarea activa.
- **Desarrollador:** autoriza por separado la creación de la rama y cada commit. Después gestiona la publicación e integración mediante su propio flujo.
- **Revisores SDD:** revisan en modo de solo lectura; ningún `PASS` concede permiso Git ni sustituye la aprobación del desarrollador.
- **Git local:** conserva exactamente un valor por cada clave `recetaria.active-branch` y `recetaria.base-commit`, o ambas ausentes. `MEMORY.md` describe el estado operativo, pero no sustituye este registro.

Una autorización cubre una sola acción lógica y sus preparativos necesarios. Se obtiene después de mostrar el efecto concreto, se consume al intentarla aunque falle y no sobrevive a reintentos ni sesiones. Las comprobaciones de solo lectura no necesitan permiso.

## Flujos

### Inicio y trabajo

1. El agente comprueba rama actual `dev`, árbol e índice limpios, igualdad con el remoto de `dev`, ausencia de tarea activa y operación Git incompleta, y disponibilidad local y remota del nombre propuesto. Si algo falla, se detiene sin crear otra rama ni sincronizar automáticamente.
2. Presenta nombre, tipo, rama exacta y base. Tras permiso específico, crea la rama local desde `dev` y registra rama y base. No hace push inicial. Si el registro queda parcial, informa y detiene el trabajo para una decisión humana.
3. Aplica el proceso SDD o el flujo ligero correspondiente. Las aprobaciones de especificación y plan y la solicitud de implementación siguen siendo independientes de los permisos Git.
4. Antes de cada commit, comprueba que está en la rama activa, que no hay operación Git incompleta y que el índice no contiene cambios ajenos. Muestra mensaje `<tipo>: <descripción en español>` y rutas literales; solo tras un permiso propio prepara esas rutas y crea el commit. Puede acumular varios commits locales sin publicarlos.

### Verificación y commit final

1. Las verificaciones y `test_reviewer` deben estar vigentes antes de dar por terminado un cambio SDD. Un cambio funcional posterior las invalida; los ajustes administrativos de cierre SDD tienen comprobaciones documentales propias.
2. El agente identifica expresamente el último commit y presenta su mensaje, rutas y el efecto de liberar ambas claves locales si Git confirma el commit. Una autorización específica cubre ese commit y la retirada posterior de las claves, pero no una publicación o integración.
3. Si el commit final falla, conserva el trabajo y las claves e informa del índice. Si el commit funciona pero falla la retirada de una clave, conserva el estado parcial, bloquea tareas nuevas y solicita una autorización nueva para recuperarlo; no hace una reparación implícita.
4. Después del éxito, informa del commit y la rama local al desarrollador. No cambia a `dev`, publica, integra ni borra ramas. La ausencia de registro activo permite otra tarea únicamente cuando se vuelvan a cumplir sus precondiciones de inicio.

### Deriva, adopción, cancelación y seguimiento externo

- Si `dev` local o remoto avanza después del inicio, el agente comunica la deriva y puede continuar los commits en su rama local. No cambia la base registrada ni resuelve la integración; esta queda a cargo del desarrollador.
- Para `adopt`, sin tarea activa, valida nombre, rama local y base única respecto de `dev`, presenta el estado y pide autorización antes de registrar las dos claves. No exige upstream ni publicación remota.
- Para `cancel`, presenta el registro y el trabajo que quedará, pide autorización propia y retira solo las dos claves; conserva rama, commits, índice y árbol. Un fallo parcial bloquea tareas nuevas.
- Un fallo o condición incumplida detiene únicamente la acción afectada. Cada reintento o recuperación que cambie estado exige una propuesta y un permiso nuevos.
- Tras la publicación e integración manuales, el resultado externo del CI se incorpora a `MEMORY.md` solo cuando se haya observado, mediante otra tarea y rama `docs/` sometidas a este mismo flujo. El CI de ese cierre documental no reabre la tarea funcional.

## Reglas

- La rama de una tarea acompaña su especificación, plan, implementación y verificación. Las ramas locales no se eliminan por acción del agente al terminar.
- Los tipos de trabajo son `feat`, `fix`, `refactor`, `docs`, `test` y `chore`; los slugs son ASCII en kebab-case y los mensajes de commit de trabajo se escriben en español. El agente no crea commits de merge.
- La solicitud de una tarea no autoriza crear la rama. Cada commit, incluido el final, requiere su propio permiso inmediato; un permiso anterior no cubre otro commit.
- La 004 sustituirá el contrato operativo de la 003 solo después de superar sus puertas SDD y de implementar las instrucciones y reglas permanentes. La publicación inicial de la propia rama 004 se hizo conforme al contrato anterior y no constituye un requisito futuro.

## Criterios de aceptación

- `CA-01`: la skill y sus metadatos mantienen su invocación implícita para cambios realizados por agentes y describen un flujo supervisado que termina en commit local, sin scripts, dependencias ni cambios de CI.
- `CA-02`: la skill documenta las precondiciones de `dev`, tarea activa, operación incompleta y nombre de rama antes de la creación local autorizada, y no exige push inicial para editar.
- `CA-03`: la skill distingue las puertas y verificaciones SDD de los permisos Git y exige mostrar mensaje y rutas antes de autorizar cada commit; permite varios commits locales.
- `CA-04`: la skill exige señalar el commit final, contar con verificaciones vigentes y retirar las dos claves locales solo después de que ese commit tenga éxito, con el mismo permiso específico.
- `CA-05`: la skill documenta los estados recuperables ante fallos de creación, commit o retirada de claves, y exige permiso nuevo para cualquier reintento o recuperación.
- `CA-06`: la skill permite informar de la deriva de `dev` y continuar en la rama local sin sincronización o integración automática.
- `CA-07`: la skill limita el trabajo del agente a su rama y no contiene fases de push, cambio a `dev`, merge, publicación de `dev` ni borrado de ramas.
- `CA-08`: la skill permite adoptar o cancelar una tarea local con autorización y sin exigir upstream remoto, conservando el trabajo.
- `CA-09`: `AGENTS.md`, el proceso SDD, las decisiones técnicas y `MEMORY.md` describen coherentemente el nuevo límite del agente y el seguimiento del CI mediante otra tarea documental.
- `CA-10`: la especificación 003 permanece como historial completado y la aceptación de la 004 distingue explícitamente contrato documental de comportamiento del agente no probado.

## Decisiones aprobadas

- El desarrollador asumirá la publicación e integración; el agente terminará con un commit local y no hará pushes, cambios a `dev`, merges ni borrado de ramas en su flujo.
- La nueva tarea comenzará con una rama local autorizada desde `dev`; no se publicará antes de editar bajo el nuevo contrato.
- Se permiten varios commits locales, cada uno autorizado por separado tras mostrar mensaje y rutas. El último se identificará expresamente y su permiso cubrirá el commit y la liberación de las dos claves locales solo si el commit tiene éxito.
- Si `dev` avanza, el agente informará y continuará en su rama sin resolver la integración.
- La 003 permanecerá completada como historial; este contrato se documenta en la nueva especificación 004. Para crear y publicar inicialmente la rama de transición 004 se respetaron las reglas de la 003 todavía vigentes.
- Se conservan las puertas SDD, la tarea activa única, la adopción, la cancelación, los seis tipos de trabajo, la exclusión de `main` y el seguimiento posterior del CI en una nueva tarea documental.

## Decisiones pendientes

- No hay decisiones pendientes identificadas para esta especificación.
