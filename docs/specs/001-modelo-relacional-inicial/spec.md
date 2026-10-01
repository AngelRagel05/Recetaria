---
id: "001"
title: "Modelo relacional inicial de Recetaria"
status: completed
---

# Especificación: Modelo relacional inicial de Recetaria

## Problema y objetivo

Recetaria necesita una primera definición estable de sus tablas de dominio y de las relaciones entre ellas antes de diseñar atributos, claves, restricciones SQL o migraciones. El resultado será un modelo relacional conceptual, versionado y comprensible, que no anticipe decisiones de implementación todavía pendientes.

## Alcance

### Incluido

- Un diagrama Mermaid ER sin atributos.
- Exactamente 21 tablas de dominio con nombres en inglés.
- Relaciones, cardinalidades y opcionalidades aprobadas.
- Notas en español para las reglas que el diagrama no pueda expresar.
- La distinción entre los roles `member` y `admin` y su relación con `users`.

### Fuera de alcance

- Atributos, claves primarias o foráneas, índices y restricciones SQL.
- Migraciones, modelos Eloquent, seeders o cambios en PostgreSQL.
- Políticas de borrado y migración de usuarios existentes.
- Implementación de permisos, auditoría, suspensión, visibilidad o creación del primer administrador.
- Ratings, mensajería, notificaciones, denuncias, bloqueos e imágenes de recetas.
- Tablas internas de Laravel, como sesiones, caché o trabajos.

## Actores

- `member`: crea y comparte recetas, publica, comenta, da like, guarda recetas, utiliza colecciones y sigue a otros usuarios.
- `admin`: administra usuarios, asigna roles, gestiona cualquier colección, modera contenido, gestiona catálogos y puede consultar contenido no público dentro de los límites aprobados.

## Flujos

### Creación y publicación de recetas

1. Uno o varios usuarios son coautores equivalentes de una receta.
2. La receta puede permanecer incompleta como borrador.
3. Para aparecer como receta principal de una publicación debe tener al menos un ingrediente y un paso.
4. Un usuario puede publicar como principal una receta propia o ajena.
5. La publicación incluye una o varias imágenes y puede mencionar otras recetas.

### Interacción social

1. Los usuarios dan like y comentan publicaciones.
2. Los comentarios pueden responder a otros comentarios con anidamiento ilimitado.
3. Los usuarios guardan recetas directamente o las organizan en colecciones propias.
4. Añadir una receta a una colección implica que también esté guardada por el propietario.
5. Los usuarios pueden seguir a otros usuarios, pero no a sí mismos.

## Tablas

- Usuarios y roles: `roles`, `users`.
- Núcleo culinario: `recipes`, `recipe_authors`, `ingredients`, `units`, `recipe_ingredients`, `recipe_steps`.
- Clasificación: `categories`, `recipe_categories`, `tags`, `recipe_tags`.
- Capa social: `publications`, `publication_recipe_mentions`, `publication_images`, `comments`, `publication_likes`, `saved_recipes`, `collections`, `collection_recipes`, `user_follows`.

## Reglas de negocio

- `roles` se relaciona 1:N con `users`; cada usuario tiene exactamente un rol.
- Los roles iniciales son `member` y `admin`; `member` es el rol predeterminado.
- `users` se relaciona N:M con `recipes` mediante `recipe_authors`; cada receta tiene uno o más coautores equivalentes.
- `ingredients` es un catálogo global. `recipes` se relaciona N:M con `ingredients` mediante `recipe_ingredients`.
- Cada `recipe_ingredient` puede usar opcionalmente una `unit` global.
- `recipes` se relaciona 1:N con `recipe_steps`.
- `recipes` se relaciona N:M y opcionalmente con `categories` y `tags`, que son catálogos globales y planos.
- Cada `publication` tiene exactamente un publicador, una receta principal y entre una y muchas `publication_images`.
- Una receta puede ser principal en varias publicaciones, incluso de usuarios que no sean sus autores.
- Una publicación puede mencionar otras recetas mediante `publication_recipe_mentions`, sin repetir su receta principal.
- No existe ninguna relación entre publicaciones.
- Cada `comment` pertenece a un usuario y a una publicación, y puede tener un comentario padre de esa misma publicación.
- Los likes pertenecen exclusivamente a publicaciones y cada par usuario-publicación es único.
- Los guardados pertenecen exclusivamente a recetas y cada par usuario-receta es único.
- Cada `collection` pertenece a un único usuario. Cada par colección-receta es único.
- Incluir una receta en una colección exige o crea el guardado correspondiente para su propietario.
- `user_follows` representa una relación dirigida, única y sin autosseguimiento.
- El administrador puede gestionar usuarios, asignarles roles, gestionar cualquier colección, moderar cualquier contenido, administrar catálogos y consultar contenido no público.
- El administrador no puede acceder a credenciales, suplantar sesiones ni eliminar o degradar al último administrador.

## Criterios de aceptación

- `CA-01`: El diagrama contiene exactamente las 21 tablas aprobadas y ninguna tabla excluida.
- `CA-02`: El diagrama representa todas las relaciones, cardinalidades y opcionalidades aprobadas, incluidas las autorrelaciones de comentarios y usuarios.
- `CA-03`: El modelo distingue la receta principal de las recetas mencionadas y no contiene relaciones entre publicaciones.
- `CA-04`: El documento recoge la unicidad de pares, los mínimos para publicar, la coherencia entre respuestas, la prohibición de autosseguimiento y la implicación colección-guardado.
- `CA-05`: El diagrama no muestra atributos; contiene únicamente tablas, relaciones y cardinalidades.
- `CA-06`: Los nombres de las tablas están en inglés y las explicaciones en español.
- `CA-07`: El diagrama representa `roles` 1:N `users`; las notas identifican `member` y `admin` como roles iniciales, establecen `member` como predeterminado y recogen explícitamente la asignación de roles, la gestión de cualquier colección, el resto del alcance y las protecciones del administrador sin añadir estructuras de permisos no aprobadas.

## Decisiones aprobadas

- El modelo se documentará en Markdown con un diagrama Mermaid ER.
- Las 21 tablas, relaciones, cardinalidades, reglas y exclusiones de esta especificación fueron aprobadas explícitamente por el desarrollador.
- El rol ordinario se identificará como `member` para evitar confundirlo con la tabla `users`.
- `requirements_reviewer` y `architecture_reviewer` revisaron el contenido conversacional y devolvieron `PASS` antes de materializar estos documentos.

## Decisiones pendientes

- Los atributos, claves, restricciones SQL y políticas de borrado se decidirán antes de crear migraciones.
- La implementación de autorización definirá el bootstrap del primer administrador, los cambios de rol, la protección técnica del último administrador, la auditoría y la suspensión.
