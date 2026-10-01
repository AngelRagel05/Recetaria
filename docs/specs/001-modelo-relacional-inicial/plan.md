---
spec: "001"
status: approved
---

# Plan técnico: Modelo relacional inicial de Recetaria

## Resumen

Mantener el modelo aprobado mediante un diagrama Mermaid ER sin atributos y propagar `member` como identificador del rol ordinario por toda la documentación aplicable, sin renombrar la tabla `users`, alterar relaciones, crear código ni modificar la base de datos.

## Componentes afectados

- Documentación SDD de la especificación `001`.
- Documento permanente del modelo relacional.
- Decisiones técnicas de autenticación y modelo de datos.
- Memoria operativa del proyecto.

## Contratos, datos e interfaces

- El diagrama expondrá exactamente las 21 tablas enumeradas en `spec.md`.
- Las relaciones y cardinalidades seguirán las reglas aprobadas sin añadir atributos.
- Las restricciones no representables en Mermaid se documentarán como notas breves.
- Los roles iniciales se identificarán como `member` y `admin`, con `member` como rol predeterminado.
- `member` sustituirá únicamente al identificador del rol ordinario; la tabla `users`, `user_follows` y las referencias genéricas a usuarios conservarán sus nombres.
- No se crean contratos de aplicación, migraciones ni interfaces ejecutables.

## Fases de implementación

1. Aprobar la especificación revisada y preparar este plan y sus tareas.
2. Obtener `PASS` de `architecture_reviewer` sobre `spec.md`, `plan.md` y `tasks.md`.
3. Tras las aprobaciones y la petición explícita de implementación, sustituir el identificador del rol ordinario en `docs/modelo-relacional.md` y `docs/decisiones-tecnicas.md`.
4. Actualizar `MEMORY.md` con el estado real de la revisión sin duplicar el modelo.
5. Buscar referencias documentales al antiguo valor del rol y comprobar que no se hayan renombrado tablas, relaciones ni el sustantivo genérico «usuario».
6. Verificar los criterios de aceptación, revisar el diff y ejecutar `test_reviewer`.

## Pruebas y criterios de aceptación

- `CA-01`: contar las entidades únicas del bloque Mermaid y compararlas con las 21 tablas aprobadas.
- `CA-02`: contrastar cada relación y cardinalidad con `spec.md`.
- `CA-03`: comprobar que solo las recetas, no las publicaciones, pueden ser principales o mencionadas.
- `CA-04`: revisar las notas de restricciones complementarias.
- `CA-05`: confirmar que el bloque Mermaid no contiene atributos.
- `CA-06`: revisar idioma y convenciones de nombres.
- `CA-07`: comprobar la relación de roles, los valores `member` y `admin`, el valor predeterminado `member` y las notas de administración y seguridad.

## Documentación

- Actualizar `docs/modelo-relacional.md` como fuente permanente.
- Mantener su enlace desde `docs/decisiones-tecnicas.md` y actualizar allí únicamente la decisión resumida de roles.
- Actualizar `MEMORY.md` con el estado local revisado y la publicación pendiente.

## Despliegue y compatibilidad

No aplica. No se modifican la aplicación, PostgreSQL, Supabase, Docker ni Render.

## Riesgos y medidas

- Mermaid no expresa todas las restricciones entre relaciones; se conservarán como notas explícitas.
- Las tablas técnicas de Laravel no cuentan entre las 21 entidades de dominio; el documento lo indicará.
- Las decisiones de implementación pendientes permanecerán fuera del diagrama para evitar anticipar migraciones o autorización.
- Una sustitución global del término en inglés para usuario dañaría nombres de tablas y referencias correctas; el cambio se limitará al valor del rol ordinario.
