---
id: "002"
title: "Atributos del modelo relacional"
status: completed
---

# Especificación: Atributos del modelo relacional

## Problema y objetivo

El modelo relacional inicial define 21 tablas de dominio y sus relaciones, pero todavía no establece qué atributos almacena cada tabla ni sus claves, nulabilidad, límites, unicidades e índices. Durante la definición de esos atributos se ha precisado además que las recetas se publican de forma independiente en los perfiles y que cada imagen de una publicación puede enlazar opcionalmente una receta, por lo que dejan de existir la receta principal y sus menciones a nivel de publicación.

El objetivo de esta especificación es definir el esquema objetivo de 20 tablas de dominio y revisar únicamente las relaciones entre publicaciones y recetas aprobadas en la especificación `001`, sin crear todavía migraciones, modelos ni cambios en PostgreSQL.

## Alcance

### Incluido

- Los atributos de las 20 tablas de dominio resultantes.
- La eliminación de `publication_recipe_mentions` y de la receta principal de `publications`.
- La referencia opcional desde cada `publication_image` a una receta publicada.
- Los tipos conceptuales, la nulabilidad, los valores iniciales, las claves primarias y foráneas, los índices y las unicidades.
- Las restricciones de formato, rango y coherencia entre atributos aprobadas.
- Los metadatos temporales de cada entidad y asociación.
- Los identificadores de Cloudinary que referencian avatares e imágenes de publicaciones.
- Las reglas entre tablas necesarias para conservar la coherencia del modelo aprobado.

### Fuera de alcance

- Migraciones, modelos Eloquent, seeders, factories, controladores, validadores, componentes o cualquier otro código de aplicación.
- `plan.md`, `tasks.md` y la planificación técnica de cómo aplicar o verificar el esquema.
- Las políticas `ON DELETE`, el borrado lógico y cualquier otra política de eliminación.
- La migración o adaptación de los usuarios y datos existentes.
- La autorización, la moderación, la suspensión, la auditoría y la visibilidad general del contenido.
- El contrato del seeder del primer administrador y la gestión de sus credenciales.
- La integración con Cloudinary, sus credenciales, SDK, transformaciones, carga, sustitución y eliminación de archivos.
- Las políticas de formato, dimensiones, peso o tipo de archivo para imágenes.
- El diseño de rutas, API, formularios, páginas y experiencia de usuario.

## Actores

- `member`: registra y mantiene su perfil; crea recetas y publicaciones; comenta, da like, guarda recetas, usa colecciones y sigue a otros usuarios conforme a la autorización que se defina posteriormente.
- `admin`: rol inicial cuyo alcance de autorización y capacidades efectivas se definirán en una especificación posterior.
- Sistema: conserva la integridad de los atributos y relaciones y asigna `member` a las altas públicas.

## Flujos

### Registro y perfil

1. Un alta pública crea un usuario con identidad pública, credenciales y el rol `member`.
2. El `username` identifica al usuario de forma pública y permanece inmutable.
3. El usuario puede completar o modificar su nombre visible, biografía y avatar sin cambiar su `username`.
4. El avatar referencia un único recurso de Cloudinary mediante `avatar_asset_id` y `avatar_public_id`; no se persiste una URL derivable y el identificador público no recibe un límite total artificial.

### Creación y edición de recetas

1. Una receta se crea con al menos un coautor y con `published_at` nulo, por lo que comienza como borrador privado y puede permanecer sin ingredientes o pasos.
2. Los coautores son equivalentes y no poseen jerarquía, rol ni orden.
3. Los ingredientes y pasos mantienen un orden propio dentro de la receta.
4. Las categorías y etiquetas son opcionales y se asocian sin duplicados.
5. Una receta solo puede publicarse cuando contiene al menos un ingrediente y un paso; al publicarse recibe una fecha en `published_at` y aparece en los perfiles de todos sus coautores.
6. No existe un límite funcional de recetas publicadas por perfil.
7. Mientras permanezca publicada no puede eliminarse su último ingrediente ni su último paso.
8. Al despublicarla, `published_at` vuelve a ser nulo y sus referencias, guardados y pertenencias a colecciones se conservan, pero desaparecen por completo los enlaces, metadatos, listados, contadores y marcadores visibles asociados a la receta.
9. Al republicarla, `published_at` recibe una fecha nueva y las referencias conservadas vuelven a mostrarse.
10. La receta no almacena imágenes.

### Publicación

1. Una publicación nueva pertenece de forma inmutable a un publicador y se persiste únicamente al publicarse.
2. La publicación contiene entre una y diez imágenes y siempre incluye una imagen con posición `1`, que actúa como portada.
3. Cada imagen puede enlazar opcionalmente una única receta que esté publicada en el momento de establecer el enlace.
4. Varias imágenes de una misma o distintas publicaciones pueden enlazar la misma receta, y una publicación puede no enlazar ninguna receta.
5. El enlace de una imagen puede cambiarse al editar la publicación sin modificar los datos de la receta.
6. Si una receta enlazada vuelve a borrador, se conserva `publication_images.recipe_id`, pero la imagen deja de mostrar enlace, título o cualquier otro metadato de la receta hasta que esta se republica.
7. La publicación y la receta conservan ciclos CRUD independientes y no crean copias históricas entre sí.

### Interacción social

1. Un usuario puede comentar una publicación y responder a comentarios de esa misma publicación con anidamiento ilimitado.
2. El contenido de un comentario puede editarse, pero su autor, publicación y comentario padre no cambian.
3. Dar like, guardar una receta y seguir a un usuario crean asociaciones simples fechadas; retirar la acción elimina la asociación.
4. El seguimiento es inmediato, sin solicitudes ni estados intermedios.
5. Las colecciones son privadas en esta fase y ordenan sus recetas cronológicamente por `created_at`, con `id` como desempate determinista.
6. Añadir una receta a una colección exige o crea también el guardado de esa receta para el propietario.
7. Si una receta guardada vuelve a borrador, sus filas en `saved_recipes` y `collection_recipes` se conservan, pero la receta desaparece por completo de los listados y contadores de guardados y colecciones, sin marcador ni metadatos visibles.
8. Cuando la receta se republica, reaparece automáticamente en sus guardados y colecciones y conserva su posición cronológica original mediante los valores existentes de `created_at` e `id`.

### Casos alternativos y errores

- Se rechaza un alta si el `username` o el correo normalizados ya existen.
- Se rechaza un avatar si solo se proporciona uno de sus dos identificadores de Cloudinary.
- Se rechaza una cantidad, rendimiento o posición fuera de sus rangos aprobados.
- Se rechaza una unidad de ingrediente cuando no existe una cantidad asociada.
- Se rechazan asociaciones que duplican un par declarado único.
- Se rechaza la publicación de una receta que no tenga al menos un ingrediente y un paso.
- Se rechaza una edición que deje sin ingredientes o sin pasos una receta publicada.
- Se rechaza una publicación que no tenga imágenes, que supere diez imágenes o que no contenga una imagen con posición `1`.
- Se rechaza la creación o edición de un enlace de imagen hacia una receta que en ese momento sea un borrador.
- Se rechaza una respuesta cuyo comentario padre pertenezca a otra publicación.
- Se rechaza una receta en una colección cuando no se garantiza su guardado para el propietario.
- Se rechaza el autosseguimiento y cualquier seguimiento duplicado.

## Convenciones generales del esquema

- Todas las tablas de dominio tienen `id BIGINT` autoincremental como clave primaria.
- Todas las claves foráneas son `BIGINT` obligatorias salvo las declaradas expresamente opcionales.
- Toda clave foránea dispone de un índice, excepto cuando ya sea la primera columna de otro índice equivalente.
- Los campos temporales usan `TIMESTAMP` en UTC.
- Las entidades y relaciones con datos mutables tienen `created_at TIMESTAMP NOT NULL` y `updated_at TIMESTAMP NOT NULL`.
- Las asociaciones sin datos mutables tienen únicamente `created_at TIMESTAMP NOT NULL`.
- Los textos obligatorios se almacenan recortados y no pueden estar vacíos.
- El correo, el `username` y los nombres de los catálogos se almacenan normalizados en minúsculas.
- Las restricciones de unicidad sobre valores normalizados deben impedir duplicados que difieran únicamente en la forma descartada por su normalización.
- Los `public_id` de Cloudinary utilizan `TEXT` para admitir rutas cuyo tamaño total no está limitado a 255 caracteres, manteniendo su unicidad.
- Las acciones de borrado de las claves foráneas permanecen sin decidir.

## Contrato de datos

### Usuarios y roles

#### `roles`

- `id BIGINT`: clave primaria autoincremental.
- `name VARCHAR(50) NOT NULL`: nombre normalizado del rol.
- `UNIQUE (name)`.
- No tiene timestamps.
- Los valores iniciales son `member` y `admin`; el catálogo admite futuros roles aprobados sin cambiar su estructura.

#### `users`

- `id BIGINT`: clave primaria autoincremental.
- `role_id BIGINT NOT NULL`: referencia a `roles` e índice.
- `username VARCHAR(30) NOT NULL`: identidad pública inmutable.
- `name VARCHAR(100) NOT NULL`: nombre visible.
- `bio VARCHAR(500) NULL`.
- `avatar_asset_id VARCHAR(255) NULL`: identificador inmutable del recurso en Cloudinary.
- `avatar_public_id TEXT NULL`: identificador de entrega del recurso en Cloudinary.
- `email VARCHAR(255) NOT NULL`.
- `email_verified_at TIMESTAMP NULL`.
- `password VARCHAR(255) NOT NULL`.
- `remember_token VARCHAR(100) NULL`.
- `created_at TIMESTAMP NOT NULL`.
- `updated_at TIMESTAMP NOT NULL`.
- `UNIQUE (username)`, `UNIQUE (email)`, `UNIQUE (avatar_asset_id)` y `UNIQUE (avatar_public_id)`.
- `username` contiene entre 3 y 30 caracteres y solo admite letras ASCII minúsculas, números y guion bajo.
- `avatar_asset_id` y `avatar_public_id` son ambos nulos o ambos no nulos.
- Las altas públicas resuelven el rol cuyo nombre es `member`; `role_id` no utiliza un ID numérico predeterminado codificado.

### Núcleo culinario

#### `recipes`

- `id BIGINT`: clave primaria autoincremental.
- `title VARCHAR(150) NOT NULL`.
- `description VARCHAR(2000) NULL`.
- `yield_quantity DECIMAL(8,2) NULL`.
- `yield_label VARCHAR(50) NULL`.
- `preparation_time_minutes INTEGER NOT NULL`: valor inicial `0`.
- `cooking_time_minutes INTEGER NOT NULL`: valor inicial `0`.
- `resting_time_minutes INTEGER NOT NULL`: valor inicial `0`.
- `published_at TIMESTAMP NULL`: fecha de publicación actual en los perfiles; nulo mientras la receta sea un borrador privado.
- `created_at TIMESTAMP NOT NULL`.
- `updated_at TIMESTAMP NOT NULL`.
- `yield_quantity` y `yield_label` son ambos nulos o ambos no nulos.
- `yield_quantity` es mayor que cero cuando existe.
- Los tres tiempos son mayores o iguales que cero; el tiempo total se deriva y no se almacena.
- `title` no es único.
- Cada nueva publicación de la receta asigna una fecha nueva a `published_at`.
- No contiene un estado adicional, slug ni referencia de imagen.

#### `recipe_authors`

- `id BIGINT`: clave primaria autoincremental.
- `recipe_id BIGINT NOT NULL`: referencia a `recipes`.
- `user_id BIGINT NOT NULL`: referencia a `users`.
- `created_at TIMESTAMP NOT NULL`.
- `UNIQUE (recipe_id, user_id)`.
- Cada receta conserva al menos una fila en esta tabla.

#### `ingredients`

- `id BIGINT`: clave primaria autoincremental.
- `name VARCHAR(100) NOT NULL`: nombre normalizado del ingrediente.
- `created_at TIMESTAMP NOT NULL`.
- `updated_at TIMESTAMP NOT NULL`.
- `UNIQUE (name)`.
- No contiene descripción, alias, información nutricional ni alérgenos.

#### `units`

- `id BIGINT`: clave primaria autoincremental.
- `name VARCHAR(50) NOT NULL`: nombre normalizado de la unidad.
- `symbol VARCHAR(20) NULL`.
- `created_at TIMESTAMP NOT NULL`.
- `updated_at TIMESTAMP NOT NULL`.
- `UNIQUE (name)` y `UNIQUE (symbol)` cuando `symbol` existe.
- No contiene dimensiones físicas ni factores de conversión.

#### `recipe_ingredients`

- `id BIGINT`: clave primaria autoincremental.
- `recipe_id BIGINT NOT NULL`: referencia a `recipes`.
- `ingredient_id BIGINT NOT NULL`: referencia a `ingredients`.
- `unit_id BIGINT NULL`: referencia opcional a `units`.
- `quantity DECIMAL(10,3) NULL`.
- `notes VARCHAR(255) NULL`.
- `position INTEGER NOT NULL`.
- `created_at TIMESTAMP NOT NULL`.
- `updated_at TIMESTAMP NOT NULL`.
- `UNIQUE (recipe_id, ingredient_id)` y `UNIQUE (recipe_id, position)`.
- `quantity` es mayor que cero cuando existe.
- `position` es mayor o igual que uno.
- Una unidad solo puede existir cuando también existe una cantidad; una cantidad puede existir sin unidad.

#### `recipe_steps`

- `id BIGINT`: clave primaria autoincremental.
- `recipe_id BIGINT NOT NULL`: referencia a `recipes`.
- `position INTEGER NOT NULL`.
- `instruction VARCHAR(2000) NOT NULL`.
- `created_at TIMESTAMP NOT NULL`.
- `updated_at TIMESTAMP NOT NULL`.
- `UNIQUE (recipe_id, position)`.
- `position` es mayor o igual que uno.
- No contiene título, duración ni imagen propios.

### Clasificación

#### `categories`

- `id BIGINT`: clave primaria autoincremental.
- `name VARCHAR(80) NOT NULL`: nombre normalizado de la categoría.
- `created_at TIMESTAMP NOT NULL`.
- `updated_at TIMESTAMP NOT NULL`.
- `UNIQUE (name)`.
- No contiene descripción, slug, imagen ni jerarquía.

#### `recipe_categories`

- `id BIGINT`: clave primaria autoincremental.
- `recipe_id BIGINT NOT NULL`: referencia a `recipes`.
- `category_id BIGINT NOT NULL`: referencia a `categories`.
- `created_at TIMESTAMP NOT NULL`.
- `UNIQUE (recipe_id, category_id)`.

#### `tags`

- `id BIGINT`: clave primaria autoincremental.
- `name VARCHAR(50) NOT NULL`: nombre normalizado de la etiqueta.
- `created_at TIMESTAMP NOT NULL`.
- `updated_at TIMESTAMP NOT NULL`.
- `UNIQUE (name)`.

#### `recipe_tags`

- `id BIGINT`: clave primaria autoincremental.
- `recipe_id BIGINT NOT NULL`: referencia a `recipes`.
- `tag_id BIGINT NOT NULL`: referencia a `tags`.
- `created_at TIMESTAMP NOT NULL`.
- `UNIQUE (recipe_id, tag_id)`.

### Publicaciones e interacción

#### `publications`

- `id BIGINT`: clave primaria autoincremental.
- `user_id BIGINT NOT NULL`: referencia al publicador en `users`.
- `caption VARCHAR(2200) NULL`.
- `created_at TIMESTAMP NOT NULL`.
- `updated_at TIMESTAMP NOT NULL`.
- `user_id` es inmutable después de crear la publicación.
- No contiene título, estado ni `published_at`; `created_at` representa el momento de publicación.
- No contiene una receta principal ni referencias directas a recetas.

#### `publication_images`

- `id BIGINT`: clave primaria autoincremental.
- `publication_id BIGINT NOT NULL`: referencia a `publications`.
- `recipe_id BIGINT NULL`: referencia opcional e indexada a `recipes`.
- `asset_id VARCHAR(255) NOT NULL`: identificador inmutable del recurso en Cloudinary.
- `public_id TEXT NOT NULL`: identificador de entrega del recurso en Cloudinary.
- `alt_text VARCHAR(255) NULL`.
- `position INTEGER NOT NULL`.
- `created_at TIMESTAMP NOT NULL`.
- `updated_at TIMESTAMP NOT NULL`.
- `UNIQUE (asset_id)`, `UNIQUE (public_id)` y `UNIQUE (publication_id, position)`.
- `position` es mayor o igual que uno; toda publicación incluye una fila con posición `1`, que identifica la portada.
- Cada publicación tiene entre una y diez filas en esta tabla.
- `recipe_id` no es único: varias imágenes pueden enlazar una misma receta.
- Al crear o cambiar el enlace, la receta referenciada debe tener `published_at` no nulo.
- Si la receta vuelve a borrador, la referencia se conserva, pero la imagen no muestra enlace, título ni otros metadatos de la receta hasta su republicación.
- No se almacena la URL derivable del recurso.

#### `comments`

- `id BIGINT`: clave primaria autoincremental.
- `user_id BIGINT NOT NULL`: referencia al autor en `users`.
- `publication_id BIGINT NOT NULL`: referencia a `publications`.
- `parent_comment_id BIGINT NULL`: autorreferencia opcional a `comments`.
- `content VARCHAR(2000) NOT NULL`.
- `created_at TIMESTAMP NOT NULL`.
- `updated_at TIMESTAMP NOT NULL`.
- `user_id`, `publication_id` y `parent_comment_id` son inmutables después de crear el comentario.
- Un comentario padre y su respuesta pertenecen a la misma publicación.
- El anidamiento no tiene un límite funcional predefinido.

#### `publication_likes`

- `id BIGINT`: clave primaria autoincremental.
- `user_id BIGINT NOT NULL`: referencia a `users`.
- `publication_id BIGINT NOT NULL`: referencia a `publications`.
- `created_at TIMESTAMP NOT NULL`.
- `UNIQUE (user_id, publication_id)`.
- No contiene tipo de reacción, contador ni `updated_at`.

### Guardados, colecciones y seguimiento

#### `saved_recipes`

- `id BIGINT`: clave primaria autoincremental.
- `user_id BIGINT NOT NULL`: referencia a `users`.
- `recipe_id BIGINT NOT NULL`: referencia a `recipes`.
- `created_at TIMESTAMP NOT NULL`.
- `UNIQUE (user_id, recipe_id)`.
- No contiene notas personales ni `updated_at`.

#### `collections`

- `id BIGINT`: clave primaria autoincremental.
- `user_id BIGINT NOT NULL`: referencia al propietario en `users`.
- `name VARCHAR(100) NOT NULL`.
- `description VARCHAR(500) NULL`.
- `created_at TIMESTAMP NOT NULL`.
- `updated_at TIMESTAMP NOT NULL`.
- El nombre es único por propietario después de ignorar mayúsculas y espacios exteriores.
- No contiene imagen ni atributo de visibilidad; todas las colecciones son privadas en esta fase.

#### `collection_recipes`

- `id BIGINT`: clave primaria autoincremental.
- `collection_id BIGINT NOT NULL`: referencia a `collections`.
- `recipe_id BIGINT NOT NULL`: referencia a `recipes`.
- `created_at TIMESTAMP NOT NULL`.
- `UNIQUE (collection_id, recipe_id)`.
- No contiene posición ni `updated_at`; el orden cronológico se deriva de `(created_at, id)`, usando `id` como desempate en la misma dirección elegida para la fecha.

#### `user_follows`

- `id BIGINT`: clave primaria autoincremental.
- `follower_id BIGINT NOT NULL`: referencia al usuario que sigue en `users`.
- `followed_id BIGINT NOT NULL`: referencia al usuario seguido en `users`.
- `created_at TIMESTAMP NOT NULL`.
- `UNIQUE (follower_id, followed_id)`.
- `follower_id` y `followed_id` deben ser diferentes.
- No contiene estado, solicitud ni `updated_at`.

## Reglas de negocio

- Las 20 tablas conservan el modelo conceptual de la especificación `001` salvo la relación publicación-receta revisada expresamente en este documento.
- Cada usuario tiene exactamente un rol y toda alta pública recibe `member` sin depender de un ID numérico fijo.
- El primer usuario administrador se creará mediante un seeder seguro cuyo contrato se definirá en la especificación de autorización.
- El `username` es inmutable; el nombre visible, la biografía y el avatar pueden modificarse.
- Cada receta conserva al menos un coautor equivalente.
- Una receta en borrador puede carecer de ingredientes o pasos; una receta publicada mantiene al menos uno de cada.
- `recipes.published_at` distingue los borradores privados de las recetas visibles en los perfiles de todos sus coautores y no existe un límite de recetas publicadas por perfil.
- Despublicar una receta conserva sus referencias, guardados y pertenencias a colecciones, pero oculta por completo el enlace y los metadatos de receta en las imágenes y la excluye de listados y contadores, sin marcadores visibles.
- Republicar una receta con una fecha nueva restaura automáticamente sus enlaces, guardados y pertenencias a colecciones; estas últimas conservan su posición cronológica original mediante `(created_at, id)`.
- Recetas y publicaciones se editan mediante ciclos CRUD independientes y no existe versionado histórico de recetas.
- Cada publicación contiene entre una y diez imágenes, siempre tiene portada en posición `1` y puede no enlazar recetas.
- Cada imagen enlaza como máximo una receta publicada; el enlace es editable y varias imágenes pueden apuntar a la misma receta.
- Los comentarios, likes, guardados, colecciones y seguimientos respetan las unicidades y coherencias descritas en su contrato de datos.
- Añadir una receta a una colección exige o crea `saved_recipes` para el propietario de la colección y esa receta.
- Cloudinary es el almacenamiento externo aprobado para avatares e imágenes de publicaciones; solo se persisten sus identificadores, no URLs ni credenciales.

## Criterios de aceptación

- `CA-01`: La especificación define atributos para exactamente 20 tablas, elimina `publication_recipe_mentions` y revisa únicamente la relación entre publicaciones y recetas del modelo `001`.
- `CA-02`: Todas las tablas tienen una clave primaria `id BIGINT` autoincremental y todas las claves foráneas declaran tipo, nulabilidad e índice conforme a las convenciones aprobadas.
- `CA-03`: Cada atributo declara su tipo conceptual, nulabilidad, límite y valor inicial cuando corresponda; los timestamps siguen la convención aprobada para entidades mutables y asociaciones.
- `CA-04`: Usuarios y roles recogen el rol `member` predeterminado sin ID fijo, la identidad pública inmutable, la normalización de correo y `username`, la compatibilidad con los campos de Breeze y la coherencia de los dos identificadores opcionales del avatar.
- `CA-05`: Recetas, ingredientes, unidades y pasos recogen límites, rangos, posiciones, parejas de campos y unicidades; `recipes.published_at` distingue borradores de recetas publicadas sin introducir imágenes, conversiones, nutrición ni jerarquías no aprobadas.
- `CA-06`: Categorías y etiquetas permanecen como catálogos globales y planos, con nombres normalizados únicos y asociaciones sin duplicados.
- `CA-07`: Una publicación solo puede existir con un publicador inmutable y entre una y diez imágenes, incluye una portada en posición `1` y cada imagen puede enlazar como máximo una receta publicada mediante una referencia opcional, editable y no única; si la receta vuelve a borrador, `publication_images.recipe_id` se conserva sin exponer enlace ni metadatos y ambos reaparecen automáticamente al republicarla.
- `CA-08`: Los comentarios permiten edición de contenido y anidamiento ilimitado, pero conservan autor, publicación y padre inmutables y coherentes.
- `CA-09`: Likes, guardados y seguimientos son asociaciones simples, fechadas y únicas; el seguimiento es inmediato y prohíbe el autosseguimiento.
- `CA-10`: Las colecciones son privadas, tienen un nombre único por propietario y mantienen la implicación obligatoria entre incorporar una receta y guardarla; las recetas en borrador no aparecen en listados, contadores ni marcadores, y al republicarse recuperan automáticamente su posición original ordenada por `(created_at, id)`.
- `CA-11`: Los identificadores de Cloudinary se almacenan sin URLs derivadas ni credenciales; `users.avatar_public_id` y `publication_images.public_id` utilizan `TEXT` y mantienen cada uno su restricción `UNIQUE`, y la integración concreta permanece fuera de alcance.
- `CA-12`: La especificación no crea migraciones, código de aplicación, `plan.md`, `tasks.md` ni decide políticas de borrado, migración de datos, autorización o bootstrap técnico del primer administrador.

## Decisiones aprobadas

- El desarrollador aprobó explícitamente el contrato de atributos, tipos, nulabilidad, límites, claves, índices, unicidades y reglas descrito en esta especificación.
- Los identificadores principales serán `BIGINT` autoincrementales y las tablas asociativas también tendrán un `id` propio junto con la unicidad de sus pares relacionados.
- Los timestamps serán `TIMESTAMP` en UTC; las entidades mutables tendrán `created_at` y `updated_at`, y las asociaciones inmutables solo `created_at`.
- Las claves foráneas se indexarán salvo que un índice equivalente ya cubra la columna como primer componente.
- Los roles serán un catálogo extensible cuyos valores iniciales son `member` y `admin`.
- Los avatares y las imágenes de publicaciones se almacenarán en Cloudinary y se referenciarán mediante `asset_id` y `public_id` sin persistir URLs derivables.
- Los campos `public_id` de Cloudinary utilizarán `TEXT` para no imponer un límite total incompatible con identificadores que contienen rutas.
- Las colecciones serán privadas y las publicaciones solo se persistirán cuando se publiquen.
- Las recetas se publicarán de forma independiente en los perfiles mediante `published_at` y aparecerán en los perfiles de todos sus coautores.
- La relación entre publicaciones y recetas se ubicará opcionalmente en cada `publication_image`; no existirán receta principal ni menciones a nivel de publicación.
- Las recetas y publicaciones tendrán ciclos CRUD independientes.
- Las recetas despublicadas no mostrarán marcadores, enlaces, metadatos ni contarán en guardados o colecciones; sus asociaciones reaparecerán en su posición original al republicarse.
- Los empates en el orden cronológico de `collection_recipes` se resolverán mediante `id`.

## Decisiones pendientes

- Las políticas `ON DELETE`, el borrado lógico y el tratamiento de relaciones al eliminar registros.
- La estrategia para adaptar o migrar los usuarios y datos existentes al esquema objetivo.
- La autorización, la moderación, la suspensión, la auditoría y la visibilidad efectiva del contenido.
- El contrato seguro del seeder del primer administrador, incluidas sus variables de entorno, idempotencia y credenciales.
- La integración técnica con Cloudinary, sus secretos, SDK, políticas de carga, sustitución, transformación y eliminación de recursos.
- El mecanismo técnico que aplicará las restricciones que abarcan varias filas o tablas.
