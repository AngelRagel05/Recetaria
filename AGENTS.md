# Directrices para agentes de Recetaria

## 1. Propósito del proyecto

Recetaria es una aplicación web para descubrir, crear y compartir recetas. Está concebida para convertirse en un producto real, mantenible y razonablemente escalable, no simplemente en una demostración.

El contexto tecnológico y de servicios confirmado es el siguiente:

- Backend: Laravel.
- Frontend: React.
- Integración entre backend y frontend: Inertia.js.
- Ubicación del frontend: `resources/js` dentro del proyecto Laravel.
- Base de datos: PostgreSQL alojado en Supabase.
- Repositorio del código fuente: GitHub.
- Plataforma de despliegue: Render.
- Método de despliegue en Render: Docker.
- Los servicios externos se gestionarán mediante una cuenta de Google creada específicamente para Recetaria.
- Base de autenticación: Laravel Breeze dentro de la arquitectura Laravel, Inertia y React.
- Herramienta de build frontend: Vite.
- Lenguaje del frontend: TypeScript, con archivos `*.tsx` para componentes y páginas React y `*.ts` para código sin JSX.
- Gestor de paquetes frontend: npm.
- Ejecutor de pruebas frontend: Vitest.
- Entorno DOM para las pruebas frontend: jsdom.
- Pruebas de componentes y páginas React: React Testing Library.
- Ejecutor de pruebas backend: PHPUnit.
- Lint frontend: ESLint.
- Formato frontend: Prettier.

La arquitectura inicial confirmada integra Laravel y React mediante Inertia.js. En esta fase no se utilizará una SPA separada ni una API independiente como arquitectura principal. Las decisiones técnicas iniciales y sus límites están recogidos en [`docs/decisiones-tecnicas.md`](docs/decisiones-tecnicas.md).

Los cambios relevantes se desarrollan mediante el proceso SDD definido en [`docs/proceso-sdd.md`](docs/proceso-sdd.md). Este proceso complementa las reglas de este archivo y no sustituye ninguna aprobación exigida por ellas.

## 2. Rol de los agentes

Los agentes son asistentes técnicos y herramientas de apoyo. No sustituyen al desarrollador y no tienen autoridad para definir requisitos, arquitectura, reglas de negocio ni la dirección del producto.

Los agentes pueden ayudar a analizar, investigar, implementar, revisar, probar y documentar trabajo dentro de un alcance aprobado explícitamente. Deben respetar las decisiones que ya haya tomado el desarrollador y no deben reinterpretarlas ni ampliar su alcance de manera implícita.

Los agentes personalizados `spec_reviewer`, `plan_reviewer` y `test_reviewer` son revisores de solo lectura. Únicamente el agente principal puede modificar archivos durante una implementación aprobada.

Antes de actuar sobre una decisión relevante, un agente debe:

1. Identificar la decisión necesaria.
2. Explicar por qué es necesaria esa decisión.
3. Presentar alternativas razonables.
4. Explicar sus ventajas, desventajas y consecuencias técnicas.
5. Recomendar una alternativa cuando una sea claramente preferible.
6. Esperar a que el desarrollador tome la decisión final antes de continuar con la parte del trabajo que dependa de ella.

Cuando exista incertidumbre sobre si una elección es significativa, se debe preguntar al desarrollador en lugar de asumir autoridad.

La espera y la detención deben limitarse a la parte del trabajo afectada por la decisión pendiente. El agente puede continuar con partes independientes de la tarea cuando estén claramente separadas y no dependan de esa decisión. No debe continuar ninguna implementación afectada ni utilizar esta flexibilidad para bordear o anticipar indirectamente la decisión pendiente.

## 3. Decisiones que requieren aprobación humana

Un agente no debe decidir de manera autónoma sobre cuestiones relacionadas con:

- La arquitectura o la estructura significativa del proyecto.
- Los modelos de datos, las entidades o las relaciones entre entidades.
- Las reglas de negocio.
- La autenticación, la autorización o la política de seguridad.
- Las API o los contratos de integración.
- Las dependencias o bibliotecas.
- Los servicios externos.
- Los patrones de diseño o las abstracciones significativas.
- La infraestructura o el despliegue.
- El almacenamiento, incluido el almacenamiento de imágenes.
- Los cambios significativos en la experiencia de usuario.
- Las funcionalidades nuevas o la eliminación de funcionalidades existentes.
- Las refactorizaciones estructurales.
- Las decisiones que introduzcan deuda técnica relevante.

Una solicitud general autoriza únicamente el resultado que declara; no autoriza al agente a tomar todas las decisiones subyacentes de producto o técnicas. Por ejemplo, una solicitud para implementar la creación de recetas no autoriza al agente a elegir los campos de una receta, la estructura de los ingredientes, las categorías, las imágenes, los permisos, las relaciones ni la arquitectura.

Si una tarea aprobada expone una cuestión no decidida de esta categoría, se debe detener esa parte de la implementación y solicitar una decisión al desarrollador.

## 4. Decisiones menores que pueden tomar los agentes

Los agentes pueden resolver detalles menores de implementación cuando no cambien los requisitos, el comportamiento, la arquitectura ni una decisión que ya haya tomado el desarrollador. Algunos ejemplos son:

- Importaciones y formato.
- Nombres internos evidentes.
- Organización local trivial.
- Aplicación de una convención establecida del proyecto.
- Eliminación de código claramente muerto cuando dicha eliminación forme parte de una tarea aprobada explícitamente.

Estos permisos no deben utilizarse para introducir una convención, abstracción, dependencia o dirección arquitectónica nueva. En caso de duda, se debe preguntar.

## 5. Flujo de trabajo obligatorio antes de la implementación

Las funcionalidades, reglas de negocio, cambios en modelos de datos, arquitectura, autenticación, seguridad, dependencias, servicios externos, almacenamiento, despliegue, cambios significativos de experiencia de usuario y refactorizaciones estructurales deben seguir el proceso SDD completo de [`docs/proceso-sdd.md`](docs/proceso-sdd.md).

Para estos cambios se aplican tres puertas obligatorias:

1. Una especificación en estado `draft` debe superar la revisión de `spec_reviewer` y recibir una aprobación explícita del desarrollador.
2. El plan técnico y sus tareas deben superar la revisión de `plan_reviewer` y recibir una aprobación explícita del desarrollador.
3. Incluso con la especificación y el plan aprobados, la implementación no comienza hasta que el desarrollador la solicite explícitamente.

El silencio, la ausencia de objeciones, una petición de revisión o la aprobación de una fase anterior no autorizan la fase siguiente. Un resultado `BLOCKED` de cualquier revisor impide avanzar hasta resolver sus bloqueos.

Las erratas, el formato y los ajustes internos evidentes sin cambios de comportamiento utilizan un flujo ligero: plan breve, implementación, verificación y revisión del diff. En caso de duda sobre la clasificación, se debe preguntar al desarrollador.

Antes de implementar una tarea relevante, un agente debe:

1. Leer `AGENTS.md` por completo.
2. Leer `MEMORY.md` por completo.
3. Inspeccionar únicamente el código y la documentación relevantes para la tarea.
4. Comprender el resultado solicitado y sus límites.
5. Identificar todas las decisiones necesarias para completar la tarea.
6. Comprobar si esas decisiones ya han sido documentadas o tomadas explícitamente por el desarrollador.
7. Detener únicamente la parte del trabajo que dependa de una decisión pendiente y solicitar la decisión del desarrollador. Puede continuar con partes independientes que estén claramente separadas y no dependan de ella, sin bordearla ni anticiparla indirectamente.
8. Cuando la tarea o una parte independiente de ella sea significativa y existan todas las decisiones necesarias para ejecutarla, explicar el enfoque de implementación previsto antes de hacerlo.
9. Implementar únicamente el alcance aprobado.
10. Ejecutar las herramientas de verificación relevantes que existan realmente en el proyecto.
11. Revisar el resultado y el diff para comprobar su corrección y detectar cambios accidentales.
12. Actualizar la documentación existente cuando el cambio aprobado lo haga necesario.
13. Actualizar `MEMORY.md` para que refleje el nuevo estado operativo.

No se debe tratar un elemento pendiente de `MEMORY.md`, un siguiente paso sugerido ni una recomendación de un agente como una autorización para implementarlo.

## 6. Flujo de trabajo obligatorio después de la implementación

Una tarea no debe considerarse terminada hasta que, cuando corresponda y el repositorio lo permita:

- La implementación debe estar completa dentro del alcance aprobado.
- Las pruebas relevantes deben estar implementadas o actualizadas.
- Las pruebas relevantes deben pasar.
- Los formateadores y linters configurados deben pasar.
- El análisis estático configurado debe pasar.
- El build debe pasar.
- El diff completo debe haberse revisado para detectar cambios accidentales o fuera del alcance.
- Debe evaluarse si el cambio ha introducido deuda técnica relevante.
- Se debe informar brevemente de las decisiones de implementación no triviales tomadas dentro del margen autorizado y explicar su motivo cuando resulte útil para comprender o revisar el resultado.
- La documentación necesaria debe estar actualizada.
- `MEMORY.md` debe reflejar el estado operativo actual.

En los cambios sujetos a SDD, `test_reviewer` debe comprobar la relación entre los criterios de aceptación, las pruebas y las verificaciones ejecutadas. Un resultado `BLOCKED` impide marcar el cambio como completado.

Cuando el cierre dependa de publicación o CI externo, `MEMORY.md` se actualiza en dos etapas:

1. Tras la verificación local, registra que la implementación local está completa y que la publicación o el CI siguen pendientes.
2. Tras publicar y comprobar el CI, elimina ese pendiente y refleja el resultado externo real.

La actualización documental de la segunda etapa cierra el estado del cambio funcional y no vuelve a abrirlo por el CI generado por esa misma actualización.

No se debe marcar una tarea como completada si alguno de estos puntos aplicables sigue pendiente.

Este informe puede incluir, por ejemplo, la elección de una estructura ya utilizada en el proyecto, la reutilización de una abstracción existente, la aplicación de una convención establecida o la colocación de una lógica en una capa concreta conforme a una decisión ya existente. No debe convertirse en una explicación línea por línea ni añadir ruido innecesario. No es necesario informar sobre decisiones triviales como importaciones, formato, nombres locales evidentes o ajustes automáticos del formateador. El objetivo es que el desarrollador pueda comprender y defender las decisiones relevantes del código generado o modificado por el agente.

No se deben inventar comandos, herramientas, controles de calidad ni flujos de trabajo que todavía no existan en el proyecto. Si falta una capacidad de verificación útil, se debe informar de ello; su incorporación puede requerir aprobación por sí misma.

## 7. Principios de desarrollo

Se deben aplicar Clean Code, SOLID, DRY, KISS, YAGNI, Separation of Concerns y el principio de responsabilidad única cuando aporten un valor concreto. Se deben preferir nombres claros, un tipado razonable, una validación explícita, una gestión de errores coherente y valores predeterminados seguros.

Estos principios no justifican la sobreingeniería. Se debe evitar:

- Las abstracciones prematuras.
- Los patrones sin una necesidad demostrada.
- Los repositorios, servicios, DTO, acciones, interfaces o capas adicionales añadidos únicamente en nombre de las buenas prácticas.
- Las clases o componentes excesivamente grandes.
- La lógica de negocio en capas inadecuadas.
- La duplicación.
- La complejidad innecesaria.
- Las dependencias sin un beneficio claro.

Toda abstracción significativa debe resolver un problema real y actual. Se debe preferir la solución mantenible más sencilla que cumpla el requisito aprobado y respete las decisiones establecidas del proyecto.

Los estilos específicos de componentes o páginas deben utilizar CSS Modules mediante archivos `*.module.css`, y los estilos globales deben utilizar archivos CSS globales. No se utilizará Bootstrap. El frontend generado por Laravel Breeze debe rehacerse con estas mismas convenciones, conservando las rutas y la lógica de autenticación necesarias, pero no sus estilos basados en Tailwind CSS. Tailwind debe eliminarse cuando deje de tener referencias en el proyecto.

## 8. Pruebas y calidad

El proyecto tendrá pruebas backend en Laravel con PHPUnit, pruebas frontend con Vitest, jsdom y React Testing Library, lint frontend con ESLint, formato frontend con Prettier y build frontend con Vite.

- Los cambios de comportamiento deben incluir pruebas cuando sea razonable y existan herramientas adecuadas en el proyecto.
- Los errores deben reproducirse mediante una prueba cuando sea posible.
- Nunca se deben eliminar, omitir ni debilitar pruebas simplemente para conseguir que un cambio pase.
- Las pruebas deben verificar el comportamiento observable en lugar de detalles de implementación innecesarios.
- La verificación debe ser proporcional al riesgo y al alcance del cambio.

Los comandos concretos de build y lint frontend deben tomarse del `package.json` real una vez exista. No se deben inventar scripts que todavía no estén definidos. Si el repositorio todavía no proporciona otras herramientas de pruebas, linting, formato, análisis estático o compilación, no se debe presuponer ni instalar ninguna sin aprobación.

## 9. Seguridad

Los datos sensibles para la seguridad nunca deben incluirse en commits de Git, entre ellos:

- Archivos `.env`.
- Contraseñas.
- Tokens.
- Claves privadas.
- Secretos de Supabase.
- Secretos de Render.
- Credenciales de Google.
- Claves de API.
- Cualquier otro secreto o credencial.

Se deben utilizar variables de entorno u otro mecanismo de gestión de secretos aprobado explícitamente. No se deben exponer secretos en registros, salidas del terminal, documentación, pruebas, ejemplos, parches, commits ni conversaciones. Se deben utilizar marcadores de posición en los ejemplos y ocultar de inmediato cualquier exposición accidental.

Las decisiones de seguridad que cambien políticas, arquitectura, comportamiento o requisitos requieren la aprobación del desarrollador. Entre ellas se incluyen:

- La estrategia de autenticación.
- La autorización y los permisos.
- La política de sesiones.
- CORS.
- El rate limiting.
- El almacenamiento y la gestión de credenciales.
- Las políticas de acceso.
- Los mecanismos de protección con implicaciones arquitectónicas o funcionales.

No requieren aprobación adicional las prácticas estándar de implementación segura que no cambien requisitos, arquitectura ni decisiones acordadas. Entre ellas se incluyen:

- No exponer secretos.
- Validar las entradas según las reglas ya aprobadas.
- Escapar o tratar correctamente los datos cuando corresponda.
- Evitar prácticas inseguras evidentes.
- Utilizar correctamente los mecanismos de seguridad que ya proporciona el framework.
- Evitar introducir vulnerabilidades conocidas debido a una implementación descuidada.

Estas prácticas forman parte de una implementación correcta y segura dentro del alcance ya aprobado. Se deben preferir valores predeterminados seguros dentro de los límites de las decisiones ya tomadas, sin utilizar estas prácticas para introducir o anticipar una decisión de seguridad pendiente.

## 10. Git

La estrategia de ramas aprobada es:

- `main` es la rama estable y desplegada.
- `dev` es la rama principal de integración para desarrollo.
- Las ramas de trabajo nacen desde `dev` y vuelven a `dev`.

Las ramas de trabajo utilizarán prefijos según el tipo de cambio, incluidos al menos `feat/`, `fix/`, `refactor/` y `docs/`. No se debe inventar una lista exhaustiva de prefijos mientras no resulte necesaria.

- Los cambios deben ser coherentes y limitarse al alcance aprobado.
- No se debe modificar código ni documentación no relacionados sin una razón clara.
- Se debe preservar el trabajo existente y revisar el diff antes de informar de la finalización.
- No se deben crear commits automáticamente salvo que el desarrollador lo solicite explícitamente.
- No se debe hacer push automáticamente salvo que el desarrollador lo solicite explícitamente.
- No se deben ampliar las convenciones para los nombres de las ramas ni inventar convenciones para los mensajes de commit antes de que el desarrollador las decida.
- No se debe reescribir el historial ni utilizar operaciones destructivas de Git sin autorización explícita.

## 11. Documentación y memoria del proyecto

El conocimiento del proyecto debe estar en el lugar adecuado:

- `AGENTS.md` contiene las reglas estables de gobernanza para los agentes.
- `MEMORY.md` contiene el contexto operativo actual, conciso y necesario para continuar el trabajo correctamente.
- La documentación dentro de `docs/` contiene el conocimiento técnico o de producto duradero cuando dicha documentación está justificada.
- [`docs/decisiones-tecnicas.md`](docs/decisiones-tecnicas.md) contiene las decisiones técnicas iniciales aprobadas y sus límites.
- Los futuros registros de decisiones de arquitectura (ADR) recogerán las decisiones técnicas importantes cuando se adopte explícitamente esa práctica.
- Git contiene el historial de cambios.
- Las pruebas describen el comportamiento verificable.

`AGENTS.md` no debe convertirse en un registro de cambios, un registro de tareas ni un historial del proyecto. Los agentes no deben modificar automáticamente sus reglas de gobernanza. Si un agente considera que una regla debería cambiar, debe explicar el cambio propuesto y obtener primero la aprobación del desarrollador.

`MEMORY.md` es un documento vivo, no un registro de cambios, un diario, una lista exhaustiva de tareas, un sustituto de Git ni una referencia técnica de todo el repositorio. Solo debe contener trabajo incompleto, decisiones pendientes, contexto y estado que sean relevantes para el foco actual del proyecto. No debe convertirse en un backlog de funcionalidades futuras, una lista de todo lo que todavía no existe, una lista de todas las decisiones que algún día habrá que tomar ni un histórico de tareas completadas.

Una ausencia o una decisión pendiente solo debe aparecer en `MEMORY.md` cuando sea relevante para el trabajo actual o para continuar correctamente desde el estado presente. Cuando deje de ser relevante, debe eliminarse de `MEMORY.md` o trasladarse a documentación permanente si posee valor a largo plazo.

Un agente puede actualizar `MEMORY.md` después de una tarea únicamente cuando la actualización:

- Refleje trabajo que se haya completado realmente.
- Registre una decisión tomada explícitamente por el desarrollador.
- Elimine información que ya no sea relevante desde el punto de vista operativo.
- Actualice el foco actual o el estado inmediato.

Un agente nunca debe utilizar una actualización de `MEMORY.md` para introducir una decisión no aprobada. El contexto obsoleto debe eliminarse o trasladarse a documentación permanente adecuada cuando tenga valor duradero. Cuando exista documentación permanente, se debe enlazar a ella en lugar de duplicarla ampliamente.

Toda la documentación del proyecto debe escribirse en español. El código y sus identificadores utilizarán inglés como idioma habitual, salvo que exista una razón explícitamente acordada para hacer lo contrario.
