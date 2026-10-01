---
spec: "002"
status: approved
---

# Plan técnico: Atributos del modelo relacional

## Resumen

Mantener dos vistas complementarias y fiables del mismo modelo vigente. `docs/modelo-relacional.md` será la referencia visual para localizar rápidamente las relaciones entre exactamente 20 tablas; `docs/atributos-modelo-relacional.md` será la referencia detallada para consultar sus atributos y comprender el funcionamiento de cada relación.

El diagrama Mermaid existirá únicamente en el documento visual para evitar divergencias. Ambos documentos se enlazarán mutuamente y compartirán las mismas reglas aprobadas. La implementación será exclusivamente documental: no se crearán migraciones, modelos Eloquent, validadores, servicios, seeders ni cambios de aplicación o base de datos.

## Componentes afectados

- `docs/modelo-relacional.md`: vista visual vigente, inventario de 20 tablas, cardinalidades y reglas breves, sin atributos.
- `docs/atributos-modelo-relacional.md`: nuevo catálogo detallado de atributos, restricciones y explicación de relaciones, sin duplicar el diagrama Mermaid.
- `docs/decisiones-tecnicas.md`: identificación de ambas vistas como fuentes vigentes y complementarias, resumen del modelo y límites aplazados.
- `docs/specs/002-atributos-modelo-relacional/spec.md`: fuente normativa aprobada y estado SDD al cerrar la implementación.
- `docs/specs/002-atributos-modelo-relacional/tasks.md`: seguimiento verificable de la implementación.
- `MEMORY.md`: estado operativo al finalizar y, si corresponde, pendiente de publicación o CI.

No se modificarán `app/`, `database/`, `resources/`, `routes/`, `tests/`, la configuración, las dependencias ni PostgreSQL.

## Contratos, datos e interfaces

- `docs/modelo-relacional.md` enumerará exactamente las 20 tablas aprobadas y su diagrama eliminará `publication_recipe_mentions`, la receta principal y las menciones; añadirá la relación opcional de `recipes` con `publication_images`.
- El documento visual conservará únicamente cardinalidades y reglas breves suficientes para interpretar el diagrama, con un enlace al catálogo detallado.
- `docs/atributos-modelo-relacional.md` declarará para cada tabla sus atributos, tipo conceptual, nulabilidad, límites, valor inicial aplicable, claves, índices, unicidades y timestamps.
- Cada tabla del catálogo detallado tendrá una subsección de relaciones que explique cardinalidad, dirección, opcionalidad y reglas de coherencia; no incluirá un segundo diagrama Mermaid.
- Ambos documentos se enlazarán mutuamente y describirán el mismo conjunto de tablas y relaciones.
- Las convenciones globales se documentarán una sola vez y las secciones por tabla solo repetirán lo necesario para evitar ambigüedad.
- El contrato mantendrá los campos de autenticación de Breeze y añadirá conceptualmente `role_id`, `username`, `bio` y los identificadores opcionales del avatar, sin modificar todavía su implementación.
- Las reglas no expresables como atributos o cardinalidades —autor mínimo, publicación válida de recetas, límites de imágenes, coherencia de comentarios, colección-guardado y ocultación temporal— se conservarán como reglas complementarias explícitas.
- Ninguno de los dos documentos atribuirá capacidades ni protecciones concretas a `admin`; `docs/decisiones-tecnicas.md` dejará de afirmar que ese alcance ya está definido.
- El documento distinguirá restricciones conceptuales de mecanismos ejecutables: no decidirá SQL específico, triggers, servicios, transacciones, políticas `ON DELETE` ni estrategia de migración.
- No se introducirán rutas, formularios, API ni interfaces de usuario.

## Fases de implementación

1. Después de que el plan sea aprobado y el desarrollador solicite explícitamente la implementación, cambiar `tasks.md` de `pending` a `in_progress` antes de modificar la documentación permanente.
2. Actualizar `docs/modelo-relacional.md` como vista visual vigente: exactamente 20 tablas, relaciones corregidas, reglas breves y enlace al catálogo detallado.
3. Crear `docs/atributos-modelo-relacional.md` con las convenciones generales y un catálogo de 20 tablas agrupado por dominio, sin duplicar el diagrama.
4. Documentar en cada tabla sus atributos, restricciones y una subsección de relaciones con cardinalidad, dirección, opcionalidad y reglas aplicables.
5. Alinear en ambas vistas las reglas de publicación independiente de recetas, perfiles de coautores, ocultación y republicación, imágenes, comentarios, guardados, colecciones y seguimiento.
6. Retirar las capacidades y protecciones concretas de `admin` de la vista visual, omitirlas en el catálogo detallado y corregir la afirmación correspondiente de `docs/decisiones-tecnicas.md`.
7. Añadir enlaces mutuos entre ambas vistas y actualizar `docs/decisiones-tecnicas.md` para identificarlas como fuentes vigentes y complementarias.
8. Verificar ambos documentos contra cada criterio de aceptación, comprobar su coherencia mutua, revisar el alcance del diff y actualizar `MEMORY.md` con el estado real.
9. Ejecutar `$recetaria-verify` para realizar las comprobaciones documentales aplicables y revisar el diff completo.
10. Entregar las evidencias a `test_reviewer`; si no existen fallos ni bloqueos, cambiar `tasks.md` y `spec.md` a `completed` conforme al proceso SDD.

## Pruebas y criterios de aceptación

- `CA-01`: comprobar que la vista visual y el catálogo detallado representan exactamente las mismas 20 tablas y que no contienen `publication_recipe_mentions` ni `main_recipe_id`.
- `CA-02`: contrastar las 20 claves primarias y todas las claves foráneas con la matriz de la especificación; comprobar tipo, nulabilidad y declaración de índice o cobertura equivalente.
- `CA-03`: revisar tabla por tabla los tipos, límites, valores iniciales y timestamps, diferenciando entidades mutables de asociaciones inmutables.
- `CA-04`: comprobar roles y usuarios, el rol `member` sin ID fijo, normalización, inmutabilidad del `username`, campos Breeze y pareja de identificadores del avatar.
- `CA-05`: comprobar los contratos y reglas de recetas, autores, ingredientes, unidades, ingredientes de receta y pasos, incluidos rangos, parejas de campos, posiciones y `published_at`.
- `CA-06`: comprobar catálogos planos de categorías y etiquetas, normalización y unicidad de sus asociaciones.
- `CA-07`: comprobar publicador inmutable, entre una y diez imágenes, portada en posición `1`, `publication_images.recipe_id` opcional, indexado y no único, y conservación u ocultación del enlace durante el ciclo borrador-publicación.
- `CA-08`: comprobar mutabilidad exclusiva del contenido del comentario, coherencia entre padre y publicación y ausencia de límite de anidamiento.
- `CA-09`: comprobar unicidades, timestamps, ausencia de campos no aprobados y prohibición de autosseguimiento en likes, guardados y seguimientos.
- `CA-10`: comprobar privacidad de colecciones, nombre normalizado único por propietario, implicación colección-guardado, ocultación de borradores y orden estable por `(created_at, id)`.
- `CA-11`: comprobar que solo se documentan identificadores de Cloudinary, que ambos `public_id` usan `TEXT` con `UNIQUE` y que no aparecen URLs, credenciales ni detalles de integración.
- `CA-12`: inspeccionar el diff para confirmar que solo cambian artefactos documentales autorizados y que no se deciden borrado, migración de datos, autorización ni bootstrap del primer administrador.
- Coherencia entre vistas: contrastar el diagrama y el inventario visual con las subsecciones de relaciones del catálogo, incluidos cardinalidad y opcionalidad.
- Límite de autorización: comprobar que ninguno de los documentos atribuye capacidades concretas a `admin` y que `docs/decisiones-tecnicas.md` sustituye su afirmación obsoleta por el aplazamiento aprobado.
- Navegación: comprobar que ambos documentos se enlazan mutuamente y que solo la vista visual contiene Mermaid.
- Verificación documental adicional: ejecutar comprobaciones de espacios y conflictos con `git diff --check`, búsquedas dirigidas con `rg` y revisión completa del diff. Las suites de aplicación no validan este cambio documental y no se modificarán ni se presentarán como evidencia de sus reglas.

## Documentación

- Actualizar `docs/modelo-relacional.md` como fuente visual vigente y crear `docs/atributos-modelo-relacional.md` como fuente detallada vigente.
- Enlazar ambas vistas entre sí y actualizar `docs/decisiones-tecnicas.md` solo con sus responsabilidades, el resumen y los límites necesarios.
- Actualizar `MEMORY.md` al terminar la implementación para reflejar el estado operativo sin convertirlo en un historial ni duplicar la especificación.

## Despliegue y compatibilidad

No aplica despliegue de aplicación ni base de datos. No se modifica PostgreSQL, Supabase, Docker, Render ni GitHub Actions.

La compatibilidad con el esquema y los flujos actuales de Breeze solo se evalúa conceptualmente. La adaptación de usuarios existentes, registro, perfil, factories, seeders y pruebas se planificará junto con las futuras migraciones, después de aprobar las decisiones que esta especificación mantiene fuera de alcance.

## Riesgos y medidas

- Riesgo de divergencia entre las dos vistas y la especificación: se utilizará una comparación tabla por tabla y relación por relación contra cada criterio de aceptación.
- Riesgo de conservar relaciones obsoletas del modelo `001`: se buscarán expresamente `publication_recipe_mentions`, receta principal y menciones después de actualizar el diagrama y las reglas.
- Riesgo de presentar reglas conceptuales como garantías ya implementadas: el documento indicará que todavía no existe esquema ejecutable ni mecanismos de aplicación.
- Riesgo de anticipar decisiones aplazadas: las políticas de borrado, migración de datos, autorización, Cloudinary y restricciones entre varias filas o tablas permanecerán señaladas como pendientes.
- Riesgo de duplicar y desincronizar el diagrama: Mermaid se mantendrá únicamente en `docs/modelo-relacional.md`; el catálogo detallado explicará relaciones por tabla y enlazará la vista visual.
- Riesgo de heredar capacidades de `admin` incompatibles con la especificación aprobada: se retirarán de la vista visual, no se reproducirán en el catálogo y se remitirán a una especificación futura.
