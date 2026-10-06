# Atributos del modelo relacional de Recetaria

## Propósito y alcance

Este documento es la referencia detallada vigente de las 20 tablas de dominio de Recetaria. Define sus atributos conceptuales, nulabilidad, límites, valores iniciales, claves, índices, unicidades, timestamps y el funcionamiento de sus relaciones.

La vista rápida de las relaciones y cardinalidades se encuentra en [Modelo relacional de Recetaria](modelo-relacional.md). El diagrama se mantiene únicamente allí para evitar divergencias.

Este contrato está materializado por las migraciones de la especificación `006-conexion-migraciones-postgresql`. PostgreSQL aplica columnas, claves, índices, unicidades, restricciones de una sola fila y acciones de borrado. Las reglas que necesitan observar varias filas o tablas siguen pendientes de acciones transaccionales de Laravel.

## Convenciones generales

- Todas las tablas tienen `id BIGINT` autoincremental como clave primaria.
- Todas las claves foráneas son `BIGINT`. Son obligatorias salvo cuando se indique expresamente que aceptan `NULL`.
- Cada clave foránea está indexada. No se requiere un índice adicional cuando ya es la primera columna de un índice compuesto equivalente.
- Los campos temporales utilizan `TIMESTAMP` en UTC.
- Las entidades y relaciones mutables tienen `created_at` y `updated_at`. Las asociaciones inmutables solo tienen `created_at`.
- Los textos obligatorios se almacenan recortados y no pueden quedar vacíos.
- El correo, el nombre de usuario y los nombres de los catálogos se almacenan normalizados en minúsculas.
- Las unicidades sobre valores normalizados rechazan duplicados que solo difieran en mayúsculas, minúsculas o espacios exteriores descartados.
- Los identificadores `public_id` de Cloudinary utilizan `TEXT` y son únicos dentro de su tabla. No se almacenan URL derivables.
- Las relaciones subordinadas usan borrado en cascada; los roles, catálogos y autores en uso restringen el borrado; `publication_images.recipe_id` y `comments.parent_comment_id` pasan a `NULL` al borrar su referencia.
- El esquema utiliza borrado físico y no necesita migración de datos existentes porque se creó desde una base de aplicación vacía.
- El mecanismo ejecutable de las reglas entre varias filas o tablas permanece aplazado.

## `roles`

### Atributos y restricciones

- `id BIGINT`: clave primaria autoincremental.
- `name VARCHAR(50) NOT NULL`: nombre normalizado en minúsculas.
- `UNIQUE (name)`: impide duplicar un rol tras normalizarlo.
- No tiene timestamps.
- Es un catálogo extensible cuyos valores iniciales aprobados son `member` y `admin`.

### Relaciones

- Un rol puede estar asignado a cero o muchos usuarios.
- Cada usuario debe referenciar exactamente un rol mediante `users.role_id`.
- El registro público de un usuario resuelve el rol por el nombre `member`; no depende de un identificador numérico codificado.
- Las capacidades de `member` y `admin` no forman parte de este contrato.

## `users`

### Atributos y restricciones

- `id BIGINT`: clave primaria autoincremental.
- `role_id BIGINT NOT NULL`: clave foránea a `roles.id`; `INDEX (role_id)`.
- `username VARCHAR(30) NOT NULL`: nombre de usuario inmutable, normalizado en minúsculas, de 3 a 30 caracteres y limitado al patrón `[a-z0-9_]`.
- `UNIQUE (username)`: impide duplicados después de la normalización.
- `name VARCHAR(100) NOT NULL`: nombre visible.
- `bio VARCHAR(500) NULL`: biografía opcional.
- `avatar_asset_id VARCHAR(255) NULL`: identificador inmutable del recurso en Cloudinary; `UNIQUE (avatar_asset_id)`.
- `avatar_public_id TEXT NULL`: identificador usado para la entrega del recurso; `UNIQUE (avatar_public_id)`.
- `email VARCHAR(255) NOT NULL`: correo normalizado en minúsculas; `UNIQUE (email)`.
- `email_verified_at TIMESTAMP NULL`: fecha de verificación compatible conceptualmente con Breeze.
- `password VARCHAR(255) NOT NULL`: contraseña almacenada mediante el mecanismo de autenticación de Laravel.
- `remember_token VARCHAR(100) NULL`: token de recuerdo compatible conceptualmente con Breeze.
- `created_at TIMESTAMP NOT NULL` y `updated_at TIMESTAMP NOT NULL`.
- `avatar_asset_id` y `avatar_public_id` deben ser ambos nulos o estar ambos presentes.

### Relaciones

- Cada usuario pertenece exactamente a un rol; un rol puede agrupar muchos usuarios.
- Un usuario puede coautorizar cero o muchas recetas mediante `recipe_authors`.
- Un usuario puede crear cero o muchas publicaciones y comentarios.
- Un usuario puede dar cero o muchos likes y guardar cero o muchas recetas.
- Un usuario puede poseer cero o muchas colecciones.
- Un usuario puede originar y recibir cero o muchas relaciones de seguimiento.
- Las capacidades de administración, moderación y acceso privado se definirán en la especificación de autorización.

## `recipes`

### Atributos y restricciones

- `id BIGINT`: clave primaria autoincremental.
- `title VARCHAR(150) NOT NULL`: título obligatorio; no es único.
- `description VARCHAR(2000) NULL`: descripción opcional.
- `yield_quantity DECIMAL(8,2) NULL`: cantidad de rendimiento opcional y estrictamente positiva cuando existe.
- `yield_label VARCHAR(50) NULL`: etiqueta del rendimiento opcional.
- `preparation_time_minutes INTEGER NOT NULL DEFAULT 0`: tiempo de preparación no negativo.
- `cooking_time_minutes INTEGER NOT NULL DEFAULT 0`: tiempo de cocción no negativo.
- `resting_time_minutes INTEGER NOT NULL DEFAULT 0`: tiempo de reposo no negativo.
- `published_at TIMESTAMP NULL`: `NULL` identifica un borrador privado; una fecha identifica una receta publicada.
- `created_at TIMESTAMP NOT NULL` y `updated_at TIMESTAMP NOT NULL`.
- `yield_quantity` y `yield_label` deben aparecer juntos o ser ambos nulos.
- Cada publicación o republicación asigna a `published_at` una fecha nueva.
- No incorpora `status`, slug ni referencia directa a una imagen.

### Relaciones

- Cada receta debe conservar al menos un autor en `recipe_authors`; todos los coautores tienen la misma jerarquía.
- Una receta puede contener cero o muchos ingredientes y pasos mientras sea un borrador.
- Una receta puede asociarse con cero o muchas categorías y etiquetas.
- Una receta puede estar guardada y pertenecer a colecciones de cero o muchos usuarios.
- Una receta puede estar enlazada por cero o muchas imágenes de publicaciones. Cada imagen puede enlazar como máximo una receta.
- Para publicarse necesita al menos un ingrediente y un paso. Mientras siga publicada no se puede eliminar su último ingrediente ni su último paso.
- Una receta publicada aparece, sin límite de cantidad, en los perfiles públicos de todos sus coautores.

## `recipe_authors`

### Atributos y restricciones

- `id BIGINT`: clave primaria autoincremental.
- `recipe_id BIGINT NOT NULL`: clave foránea a `recipes.id`.
- `user_id BIGINT NOT NULL`: clave foránea a `users.id`; `INDEX (user_id)`.
- `created_at TIMESTAMP NOT NULL`.
- `UNIQUE (recipe_id, user_id)`: evita repetir un autor en una receta y cubre el índice que comienza por `recipe_id`.
- Es una asociación inmutable: no tiene `updated_at`, jerarquía, rol ni posición.

### Relaciones

- Cada fila vincula exactamente una receta con exactamente un usuario.
- Una receta tiene uno o muchos autores; un usuario puede participar en cero o muchas recetas.
- No se puede eliminar la asociación que dejaría una receta sin autores.
- La publicación de una receta la muestra en el perfil de todos los usuarios asociados.

## `ingredients`

### Atributos y restricciones

- `id BIGINT`: clave primaria autoincremental.
- `name VARCHAR(100) NOT NULL`: nombre de catálogo normalizado en minúsculas.
- `UNIQUE (name)`: impide duplicados después de la normalización.
- `created_at TIMESTAMP NOT NULL` y `updated_at TIMESTAMP NOT NULL`.
- No contiene descripción, alias, información nutricional ni alérgenos.

### Relaciones

- Un ingrediente puede aparecer en cero o muchas filas de `recipe_ingredients`.
- Cada fila de `recipe_ingredients` referencia exactamente un ingrediente.
- La misma receta no puede repetir el mismo ingrediente.

## `units`

### Atributos y restricciones

- `id BIGINT`: clave primaria autoincremental.
- `name VARCHAR(50) NOT NULL`: nombre de catálogo normalizado en minúsculas.
- `UNIQUE (name)`: impide duplicados después de la normalización.
- `symbol VARCHAR(20) NULL`: símbolo opcional; `UNIQUE (symbol)` cuando está presente.
- `created_at TIMESTAMP NOT NULL` y `updated_at TIMESTAMP NOT NULL`.
- No contiene dimensiones ni factores de conversión.

### Relaciones

- Una unidad puede medir cero o muchos ingredientes incorporados a recetas.
- Cada fila de `recipe_ingredients` puede referenciar cero o una unidad.
- La presencia de una unidad exige que la misma fila tenga cantidad; una cantidad puede existir sin unidad.

## `recipe_ingredients`

### Atributos y restricciones

- `id BIGINT`: clave primaria autoincremental.
- `recipe_id BIGINT NOT NULL`: clave foránea a `recipes.id`.
- `ingredient_id BIGINT NOT NULL`: clave foránea a `ingredients.id`; `INDEX (ingredient_id)`.
- `unit_id BIGINT NULL`: clave foránea opcional a `units.id`; `INDEX (unit_id)`.
- `quantity DECIMAL(10,3) NULL`: cantidad opcional y estrictamente positiva cuando existe.
- `notes VARCHAR(255) NULL`: indicaciones opcionales sobre el ingrediente.
- `position INTEGER NOT NULL`: posición desde `1`.
- `created_at TIMESTAMP NOT NULL` y `updated_at TIMESTAMP NOT NULL`.
- `UNIQUE (recipe_id, ingredient_id)`: evita repetir un ingrediente en una receta.
- `UNIQUE (recipe_id, position)`: evita repetir una posición y cubre el índice que comienza por `recipe_id`.
- Si `unit_id` está presente, `quantity` también debe estarlo; la regla inversa no se exige.

### Relaciones

- Cada fila pertenece exactamente a una receta y referencia exactamente un ingrediente.
- Puede referenciar cero o una unidad.
- Una receta puede tener cero o muchas filas mientras sea borrador y debe tener al menos una para publicarse.
- No se puede eliminar la última fila de una receta publicada.

## `recipe_steps`

### Atributos y restricciones

- `id BIGINT`: clave primaria autoincremental.
- `recipe_id BIGINT NOT NULL`: clave foránea a `recipes.id`.
- `position INTEGER NOT NULL`: posición desde `1`.
- `instruction VARCHAR(2000) NOT NULL`: instrucción obligatoria.
- `created_at TIMESTAMP NOT NULL` y `updated_at TIMESTAMP NOT NULL`.
- `UNIQUE (recipe_id, position)`: evita repetir una posición y cubre el índice que comienza por `recipe_id`.
- No contiene título, duración ni imagen.

### Relaciones

- Cada paso pertenece exactamente a una receta.
- Una receta puede tener cero o muchos pasos mientras sea borrador y debe tener al menos uno para publicarse.
- No se puede eliminar el último paso de una receta publicada.

## `categories`

### Atributos y restricciones

- `id BIGINT`: clave primaria autoincremental.
- `name VARCHAR(80) NOT NULL`: nombre de catálogo normalizado en minúsculas.
- `UNIQUE (name)`: impide duplicados después de la normalización.
- `created_at TIMESTAMP NOT NULL` y `updated_at TIMESTAMP NOT NULL`.
- Es un catálogo plano, sin descripción, slug, imagen ni jerarquía.

### Relaciones

- Una categoría puede clasificar cero o muchas recetas mediante `recipe_categories`.
- Una receta puede tener cero o muchas categorías.
- El mismo par receta-categoría no puede repetirse.

## `recipe_categories`

### Atributos y restricciones

- `id BIGINT`: clave primaria autoincremental.
- `recipe_id BIGINT NOT NULL`: clave foránea a `recipes.id`.
- `category_id BIGINT NOT NULL`: clave foránea a `categories.id`; `INDEX (category_id)`.
- `created_at TIMESTAMP NOT NULL`.
- `UNIQUE (recipe_id, category_id)`: evita duplicados y cubre el índice que comienza por `recipe_id`.
- Es una asociación inmutable y no tiene `updated_at`.

### Relaciones

- Cada fila vincula exactamente una receta con exactamente una categoría.
- Una receta y una categoría pueden participar en cero o muchas asociaciones.
- Las categorías son opcionales para una receta y no forman una jerarquía.

## `tags`

### Atributos y restricciones

- `id BIGINT`: clave primaria autoincremental.
- `name VARCHAR(50) NOT NULL`: nombre de catálogo normalizado en minúsculas.
- `UNIQUE (name)`: impide duplicados después de la normalización.
- `created_at TIMESTAMP NOT NULL` y `updated_at TIMESTAMP NOT NULL`.

### Relaciones

- Una etiqueta puede asociarse con cero o muchas recetas mediante `recipe_tags`.
- Una receta puede tener cero o muchas etiquetas.
- El mismo par receta-etiqueta no puede repetirse.

## `recipe_tags`

### Atributos y restricciones

- `id BIGINT`: clave primaria autoincremental.
- `recipe_id BIGINT NOT NULL`: clave foránea a `recipes.id`.
- `tag_id BIGINT NOT NULL`: clave foránea a `tags.id`; `INDEX (tag_id)`.
- `created_at TIMESTAMP NOT NULL`.
- `UNIQUE (recipe_id, tag_id)`: evita duplicados y cubre el índice que comienza por `recipe_id`.
- Es una asociación inmutable y no tiene `updated_at`.

### Relaciones

- Cada fila vincula exactamente una receta con exactamente una etiqueta.
- Una receta y una etiqueta pueden participar en cero o muchas asociaciones.
- Las etiquetas son opcionales para una receta.

## `publications`

### Atributos y restricciones

- `id BIGINT`: clave primaria autoincremental.
- `user_id BIGINT NOT NULL`: clave foránea inmutable a `users.id`; `INDEX (user_id)`.
- `caption VARCHAR(2200) NULL`: texto opcional de la publicación.
- `created_at TIMESTAMP NOT NULL` y `updated_at TIMESTAMP NOT NULL`.
- La publicación solo se persiste al publicarse; `created_at` representa ese momento.
- No contiene título, estado, `published_at` ni referencia directa a una receta.

### Relaciones

- Cada publicación pertenece exactamente a un usuario; un usuario puede crear cero o muchas publicaciones.
- Cada publicación contiene entre una y diez filas de `publication_images` y debe existir una imagen con `position = 1` como portada.
- Una publicación puede recibir cero o muchos comentarios y likes.
- Las recetas se enlazan opcionalmente desde cada imagen, no desde la publicación.
- El ciclo de vida de una publicación es independiente del de las recetas enlazadas.

## `publication_images`

### Atributos y restricciones

- `id BIGINT`: clave primaria autoincremental.
- `publication_id BIGINT NOT NULL`: clave foránea a `publications.id`.
- `recipe_id BIGINT NULL`: clave foránea opcional a `recipes.id`; `INDEX (recipe_id)` no único.
- `asset_id VARCHAR(255) NOT NULL`: identificador inmutable del recurso en Cloudinary; `UNIQUE (asset_id)`.
- `public_id TEXT NOT NULL`: identificador usado para la entrega del recurso; `UNIQUE (public_id)`.
- `alt_text VARCHAR(255) NULL`: texto alternativo opcional.
- `position INTEGER NOT NULL`: posición desde `1`; la posición `1` es la portada.
- `created_at TIMESTAMP NOT NULL` y `updated_at TIMESTAMP NOT NULL`.
- `UNIQUE (publication_id, position)`: evita repetir una posición y cubre el índice que comienza por `publication_id`.
- `recipe_id` no es único: varias imágenes, incluso de una misma publicación, pueden enlazar la misma receta.
- No se almacena ninguna URL derivable de Cloudinary.

### Relaciones

- Cada imagen pertenece exactamente a una publicación.
- Cada imagen enlaza cero o una receta; una receta puede estar enlazada por cero o muchas imágenes.
- El enlace solo puede establecerse o cambiarse hacia una receta publicada, sin modificar la receta.
- Una publicación puede tener todas sus imágenes sin receta enlazada.
- Si la receta enlazada vuelve a borrador, `recipe_id` se conserva, pero el enlace, el título y los demás metadatos de la receta dejan de exponerse públicamente.
- Al republicar la receta, el enlace y sus metadatos vuelven a aparecer automáticamente.
- Cada publicación debe conservar entre una y diez imágenes y una de ellas debe ocupar la posición `1`.

## `comments`

### Atributos y restricciones

- `id BIGINT`: clave primaria autoincremental.
- `user_id BIGINT NOT NULL`: clave foránea inmutable a `users.id`; `INDEX (user_id)`.
- `publication_id BIGINT NOT NULL`: clave foránea inmutable a `publications.id`; `INDEX (publication_id)`.
- `parent_comment_id BIGINT NULL`: clave foránea inmutable y opcional a `comments.id`; `INDEX (parent_comment_id)`.
- `content VARCHAR(2000) NOT NULL`: contenido editable del comentario.
- `created_at TIMESTAMP NOT NULL` y `updated_at TIMESTAMP NOT NULL`.
- Al editar un comentario solo puede cambiar `content`.

### Relaciones

- Cada comentario pertenece exactamente a un usuario y a una publicación.
- Un comentario puede responder a cero o un comentario padre y puede tener cero o muchas respuestas.
- Padre e hijo deben pertenecer a la misma publicación.
- El anidamiento de respuestas no tiene un límite funcional predefinido.

## `publication_likes`

### Atributos y restricciones

- `id BIGINT`: clave primaria autoincremental.
- `user_id BIGINT NOT NULL`: clave foránea a `users.id`.
- `publication_id BIGINT NOT NULL`: clave foránea a `publications.id`; `INDEX (publication_id)`.
- `created_at TIMESTAMP NOT NULL`.
- `UNIQUE (user_id, publication_id)`: permite un solo like por usuario y publicación y cubre el índice que comienza por `user_id`.
- Es una asociación inmutable, sin `updated_at`, contador almacenado ni tipos de reacción.

### Relaciones

- Cada fila vincula exactamente un usuario con exactamente una publicación.
- Un usuario y una publicación pueden participar en cero o muchas asociaciones.
- El estado es binario: la fila representa la existencia del like.

## `saved_recipes`

### Atributos y restricciones

- `id BIGINT`: clave primaria autoincremental.
- `user_id BIGINT NOT NULL`: clave foránea a `users.id`.
- `recipe_id BIGINT NOT NULL`: clave foránea a `recipes.id`; `INDEX (recipe_id)`.
- `created_at TIMESTAMP NOT NULL`.
- `UNIQUE (user_id, recipe_id)`: evita guardar dos veces la misma receta y cubre el índice que comienza por `user_id`.
- Es una asociación inmutable, sin `updated_at` ni notas personales.

### Relaciones

- Cada fila vincula exactamente un usuario con exactamente una receta.
- Un usuario puede guardar cero o muchas recetas; una receta puede estar guardada por cero o muchos usuarios.
- Añadir una receta a una colección exige que exista este vínculo para el propietario de la colección y lo crea si falta.
- Si una receta vuelve a borrador, el guardado se conserva pero desaparece de listados, contadores y marcadores públicos; reaparece al republicarla.

## `collections`

### Atributos y restricciones

- `id BIGINT`: clave primaria autoincremental.
- `user_id BIGINT NOT NULL`: clave foránea a `users.id`; `INDEX (user_id)`.
- `name VARCHAR(100) NOT NULL`: nombre recortado de la colección.
- `description VARCHAR(500) NULL`: descripción opcional.
- `created_at TIMESTAMP NOT NULL` y `updated_at TIMESTAMP NOT NULL`.
- `UNIQUE (user_id, nombre normalizado)`: un propietario no puede repetir nombres que solo difieran en mayúsculas, minúsculas o espacios exteriores.
- Las colecciones son privadas y no tienen columna de visibilidad ni imagen.

### Relaciones

- Cada colección pertenece exactamente a un usuario; un usuario puede poseer cero o muchas colecciones.
- Una colección puede contener cero o muchas recetas mediante `collection_recipes`.
- La pertenencia de una receta a una colección obliga a que el propietario tenga el vínculo correspondiente en `saved_recipes`.

## `collection_recipes`

### Atributos y restricciones

- `id BIGINT`: clave primaria autoincremental.
- `collection_id BIGINT NOT NULL`: clave foránea a `collections.id`.
- `recipe_id BIGINT NOT NULL`: clave foránea a `recipes.id`; `INDEX (recipe_id)`.
- `created_at TIMESTAMP NOT NULL`.
- `UNIQUE (collection_id, recipe_id)`: evita repetir una receta en una colección y cubre el índice que comienza por `collection_id`.
- Es una asociación inmutable, sin `updated_at` ni `position`.
- El orden se deriva de `created_at` y utiliza `id` como desempate en la misma dirección.

### Relaciones

- Cada fila vincula exactamente una colección con exactamente una receta.
- Una colección y una receta pueden participar en cero o muchas asociaciones.
- Al crear el vínculo debe existir o crearse `saved_recipes (collections.user_id, recipe_id)`.
- Si la receta vuelve a borrador, la fila y su orden original se conservan, pero la receta se oculta de la colección; al republicarla reaparece en ese orden.

## `user_follows`

### Atributos y restricciones

- `id BIGINT`: clave primaria autoincremental.
- `follower_id BIGINT NOT NULL`: clave foránea a `users.id`.
- `followed_id BIGINT NOT NULL`: clave foránea a `users.id`; `INDEX (followed_id)`.
- `created_at TIMESTAMP NOT NULL`.
- `UNIQUE (follower_id, followed_id)`: evita repetir un seguimiento y cubre el índice que comienza por `follower_id`.
- `follower_id <> followed_id`: prohíbe el autosseguimiento.
- Es una asociación inmutable, sin `updated_at`, solicitudes ni estados.

### Relaciones

- Cada fila vincula exactamente un usuario seguidor con exactamente otro usuario seguido.
- Un usuario puede seguir a cero o muchos usuarios y ser seguido por cero o muchos usuarios.
- El seguimiento se hace efectivo de forma inmediata.

## Reglas transversales

### Publicación y visibilidad de recetas

- `recipes.published_at IS NULL` identifica un borrador privado.
- Publicar exige al menos una fila en `recipe_ingredients` y una en `recipe_steps`.
- Una receta publicada aparece en los perfiles de todos sus coautores, sin límite de recetas por perfil.
- Mientras esté publicada debe conservar al menos un ingrediente y un paso.
- Despublicar conserva coautorías, enlaces desde imágenes, guardados y pertenencias a colecciones, pero oculta públicamente la receta y cualquier enlace, metadato, listado, contador o marcador que la revele.
- Republicar asigna una fecha nueva y vuelve a mostrar las referencias conservadas.

### Publicaciones e imágenes

- Una publicación existe únicamente desde el momento en que se publica y no necesita un estado propio.
- Debe contener entre una y diez imágenes, con posiciones únicas y una portada en la posición `1`.
- Los enlaces a recetas son opcionales por imagen, no únicos y modificables.
- Publicaciones y recetas tienen CRUD independiente. Una publicación consulta el estado actual de la receta enlazada y no conserva una versión histórica.

### Comentarios, guardados y colecciones

- Un comentario y su padre siempre pertenecen a la misma publicación.
- Guardar una receta y añadirla a una colección son relaciones distintas, pero toda pertenencia a colección requiere el guardado equivalente para el propietario.
- Los elementos ocultos al despublicar una receta conservan sus filas y reaparecen automáticamente si la receta se republica.
- Dentro de una colección, los empates de `created_at` se resuelven por `id` en la misma dirección para mantener un orden estable.

## Límites pendientes

Quedan fuera de este contrato la autorización y moderación, el seeder o comando del primer administrador, las credenciales y el SDK de Cloudinary y las acciones transaccionales de Laravel que ejecutarán las reglas entre varias filas o tablas. No se usarán triggers para anticipar esas reglas.

Consulta [Modelo relacional de Recetaria](modelo-relacional.md) para localizar visualmente estas relaciones.
