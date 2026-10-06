<?php

namespace Tests\Feature\Database;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class DatabaseSchemaTest extends TestCase
{
    use RefreshDatabase;

    private const DOMAIN_TABLES = [
        'categories',
        'collection_recipes',
        'collections',
        'comments',
        'ingredients',
        'publication_images',
        'publication_likes',
        'publications',
        'recipe_authors',
        'recipe_categories',
        'recipe_ingredients',
        'recipe_steps',
        'recipe_tags',
        'recipes',
        'roles',
        'saved_recipes',
        'tags',
        'units',
        'user_follows',
        'users',
    ];

    private const EXPECTED_TABLES = [
        'cache',
        'cache_locks',
        'categories',
        'collection_recipes',
        'collections',
        'comments',
        'failed_jobs',
        'ingredients',
        'job_batches',
        'jobs',
        'migrations',
        'password_reset_tokens',
        'publication_images',
        'publication_likes',
        'publications',
        'recipe_authors',
        'recipe_categories',
        'recipe_ingredients',
        'recipe_steps',
        'recipe_tags',
        'recipes',
        'roles',
        'saved_recipes',
        'sessions',
        'tags',
        'units',
        'user_follows',
        'users',
    ];

    public function test_public_schema_contains_exactly_the_expected_tables(): void
    {
        $tables = collect(DB::select(<<<'SQL'
            SELECT tablename
            FROM pg_tables
            WHERE schemaname = 'public'
            ORDER BY tablename
        SQL))->pluck('tablename')->all();

        $this->assertSame(self::EXPECTED_TABLES, $tables);
    }

    public function test_all_application_tables_have_rls_without_policies(): void
    {
        $rlsTables = collect(DB::select(<<<'SQL'
            SELECT c.relname AS table_name
            FROM pg_class c
            JOIN pg_namespace n ON n.oid = c.relnamespace
            WHERE n.nspname = 'public'
              AND c.relkind = 'r'
              AND c.relrowsecurity = true
            ORDER BY c.relname
        SQL))->pluck('table_name')->all();

        $policies = DB::select("SELECT * FROM pg_policies WHERE schemaname = 'public'");

        $this->assertSame(self::EXPECTED_TABLES, $rlsTables);
        $this->assertSame([], $policies);
    }

    public function test_only_auto_incrementing_columns_have_sequences(): void
    {
        $sequenceColumns = collect(DB::select(<<<'SQL'
            SELECT
                table_name,
                column_name,
                pg_get_serial_sequence(
                    format('%I.%I', table_schema, table_name),
                    column_name
                ) AS sequence_name
            FROM information_schema.columns
            WHERE table_schema = 'public'
            ORDER BY table_name, ordinal_position
        SQL))->filter(
            fn (object $column): bool => $column->sequence_name !== null,
        );

        $actualColumns = $sequenceColumns->map(
            fn (object $column): string => "{$column->table_name}.{$column->column_name}",
        )->values()->all();

        $this->assertSame([
            'categories.id',
            'collection_recipes.id',
            'collections.id',
            'comments.id',
            'failed_jobs.id',
            'ingredients.id',
            'jobs.id',
            'migrations.id',
            'publication_images.id',
            'publication_likes.id',
            'publications.id',
            'recipe_authors.id',
            'recipe_categories.id',
            'recipe_ingredients.id',
            'recipe_steps.id',
            'recipe_tags.id',
            'recipes.id',
            'roles.id',
            'saved_recipes.id',
            'tags.id',
            'units.id',
            'user_follows.id',
            'users.id',
        ], $actualColumns);

        foreach ([
            'password_reset_tokens',
            'sessions',
            'cache',
            'cache_locks',
            'job_batches',
        ] as $tableWithoutSequence) {
            $this->assertFalse(
                $sequenceColumns->contains('table_name', $tableWithoutSequence),
            );
        }
    }

    public function test_domain_primary_keys_and_unique_indexes_match_the_approved_contract(): void
    {
        $indexRows = DB::select(<<<'SQL'
            SELECT
                table_class.relname AS table_name,
                index_class.relname AS index_name,
                index_definition.indisprimary AS is_primary,
                indexed_column.position,
                CASE
                    WHEN indexed_column.attribute_number = 0 THEN '<expression>'
                    ELSE attribute.attname
                END AS key_name
            FROM pg_index index_definition
            JOIN pg_class table_class
              ON table_class.oid = index_definition.indrelid
            JOIN pg_class index_class
              ON index_class.oid = index_definition.indexrelid
            JOIN pg_namespace namespace
              ON namespace.oid = table_class.relnamespace
            JOIN LATERAL unnest(index_definition.indkey)
                WITH ORDINALITY AS indexed_column(attribute_number, position)
              ON indexed_column.position <= index_definition.indnkeyatts
            LEFT JOIN pg_attribute attribute
              ON attribute.attrelid = table_class.oid
             AND attribute.attnum = indexed_column.attribute_number
            WHERE namespace.nspname = 'public'
              AND index_definition.indisunique = true
              AND table_class.relname = ANY(?::text[])
            ORDER BY table_class.relname, index_class.relname, indexed_column.position
        SQL, ['{'.implode(',', self::DOMAIN_TABLES).'}']);

        $actualIndexes = [];

        foreach ($indexRows as $indexRow) {
            $index = "{$indexRow->table_name}.{$indexRow->index_name}";
            $actualIndexes[$index] ??= [
                'primary' => (bool) $indexRow->is_primary,
                'keys' => [],
            ];
            $actualIndexes[$index]['keys'][] = $indexRow->key_name;
        }

        $expectedIndexes = $this->expectedPrimaryAndUniqueIndexes();

        ksort($actualIndexes);
        ksort($expectedIndexes);

        $this->assertSame($expectedIndexes, $actualIndexes);
    }

    /**
     * @param  array<string, array{string, bool}>  $expectedColumns
     */
    #[DataProvider('domainTableProvider')]
    public function test_domain_columns_match_the_approved_contract(
        string $table,
        array $expectedColumns,
    ): void {
        $columns = DB::select(<<<'SQL'
            SELECT
                column_name,
                data_type,
                character_maximum_length,
                numeric_precision,
                numeric_scale,
                is_nullable
            FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = ?
            ORDER BY ordinal_position
        SQL, [$table]);

        $actualColumns = [];

        foreach ($columns as $column) {
            $actualColumns[$column->column_name] = [
                $this->columnType($column),
                $column->is_nullable === 'YES',
            ];
        }

        $this->assertSame($expectedColumns, $actualColumns);
    }

    public function test_recipe_time_defaults_are_zero(): void
    {
        $defaults = collect(DB::select(<<<'SQL'
            SELECT column_name, column_default
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = 'recipes'
              AND column_name IN (
                'preparation_time_minutes',
                'cooking_time_minutes',
                'resting_time_minutes'
              )
        SQL))->mapWithKeys(fn (object $column): array => [
            $column->column_name => trim($column->column_default, "'::integer"),
        ])->all();

        ksort($defaults);

        $this->assertSame([
            'cooking_time_minutes' => '0',
            'preparation_time_minutes' => '0',
            'resting_time_minutes' => '0',
        ], $defaults);
    }

    public function test_foreign_keys_use_the_approved_delete_actions_and_are_indexed(): void
    {
        $foreignKeys = DB::select(<<<'SQL'
            SELECT
                tc.table_name,
                kcu.column_name,
                rc.delete_rule
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu
              ON kcu.constraint_schema = tc.constraint_schema
             AND kcu.constraint_name = tc.constraint_name
            JOIN information_schema.referential_constraints rc
              ON rc.constraint_schema = tc.constraint_schema
             AND rc.constraint_name = tc.constraint_name
            WHERE tc.table_schema = 'public'
              AND tc.constraint_type = 'FOREIGN KEY'
            ORDER BY tc.table_name, kcu.column_name
        SQL);

        $actualDeleteRules = collect($foreignKeys)->mapWithKeys(
            fn (object $foreignKey): array => [
                "{$foreignKey->table_name}.{$foreignKey->column_name}" => $foreignKey->delete_rule,
            ],
        )->all();

        $this->assertSame($this->expectedDeleteRules(), $actualDeleteRules);

        $indexedFirstColumns = collect(DB::select(<<<'SQL'
            SELECT DISTINCT
                table_class.relname AS table_name,
                attribute.attname AS column_name
            FROM pg_index index_definition
            JOIN pg_class table_class ON table_class.oid = index_definition.indrelid
            JOIN pg_namespace namespace ON namespace.oid = table_class.relnamespace
            JOIN LATERAL unnest(index_definition.indkey)
                WITH ORDINALITY AS indexed_column(attribute_number, position)
                ON indexed_column.position = 1
            JOIN pg_attribute attribute
              ON attribute.attrelid = table_class.oid
             AND attribute.attnum = indexed_column.attribute_number
            WHERE namespace.nspname = 'public'
        SQL))->map(fn (object $index): string => "{$index->table_name}.{$index->column_name}")
            ->all();

        foreach (array_keys($actualDeleteRules) as $foreignKey) {
            $this->assertContains($foreignKey, $indexedFirstColumns);
        }
    }

    public function test_named_checks_and_collection_functional_unique_index_exist(): void
    {
        $checks = collect(DB::select(<<<'SQL'
            SELECT constraint_definition.conname AS constraint_name
            FROM pg_constraint constraint_definition
            JOIN pg_namespace namespace ON namespace.oid = constraint_definition.connamespace
            WHERE namespace.nspname = 'public'
              AND constraint_definition.contype = 'c'
        SQL))->pluck('constraint_name')->all();

        foreach ($this->expectedCheckConstraints() as $constraint) {
            $this->assertContains($constraint, $checks);
        }

        $collectionIndex = DB::selectOne(<<<'SQL'
            SELECT indexdef
            FROM pg_indexes
            WHERE schemaname = 'public'
              AND tablename = 'collections'
              AND indexname = 'collections_user_normalized_name_unique'
        SQL);

        $this->assertNotNull($collectionIndex);
        $this->assertStringContainsString('UNIQUE INDEX', $collectionIndex->indexdef);
        $this->assertStringContainsString('lower(btrim', $collectionIndex->indexdef);
    }

    /**
     * @return iterable<string, array{string, array<string, array{string, bool}>}>
     */
    public static function domainTableProvider(): iterable
    {
        yield 'roles' => ['roles', [
            'id' => ['bigint', false],
            'name' => ['varchar:50', false],
        ]];

        yield 'users' => ['users', [
            'id' => ['bigint', false],
            'role_id' => ['bigint', false],
            'username' => ['varchar:30', false],
            'name' => ['varchar:100', false],
            'bio' => ['varchar:500', true],
            'avatar_asset_id' => ['varchar:255', true],
            'avatar_public_id' => ['text', true],
            'email' => ['varchar:255', false],
            'email_verified_at' => ['timestamp', true],
            'password' => ['varchar:255', false],
            'remember_token' => ['varchar:100', true],
            'created_at' => ['timestamp', false],
            'updated_at' => ['timestamp', false],
        ]];

        yield 'recipes' => ['recipes', [
            'id' => ['bigint', false],
            'title' => ['varchar:150', false],
            'description' => ['varchar:2000', true],
            'yield_quantity' => ['numeric:8:2', true],
            'yield_label' => ['varchar:50', true],
            'preparation_time_minutes' => ['integer', false],
            'cooking_time_minutes' => ['integer', false],
            'resting_time_minutes' => ['integer', false],
            'published_at' => ['timestamp', true],
            'created_at' => ['timestamp', false],
            'updated_at' => ['timestamp', false],
        ]];

        yield 'recipe_authors' => ['recipe_authors', [
            'id' => ['bigint', false],
            'recipe_id' => ['bigint', false],
            'user_id' => ['bigint', false],
            'created_at' => ['timestamp', false],
        ]];

        yield 'ingredients' => ['ingredients', [
            'id' => ['bigint', false],
            'name' => ['varchar:100', false],
            'created_at' => ['timestamp', false],
            'updated_at' => ['timestamp', false],
        ]];

        yield 'units' => ['units', [
            'id' => ['bigint', false],
            'name' => ['varchar:50', false],
            'symbol' => ['varchar:20', true],
            'created_at' => ['timestamp', false],
            'updated_at' => ['timestamp', false],
        ]];

        yield 'recipe_ingredients' => ['recipe_ingredients', [
            'id' => ['bigint', false],
            'recipe_id' => ['bigint', false],
            'ingredient_id' => ['bigint', false],
            'unit_id' => ['bigint', true],
            'quantity' => ['numeric:10:3', true],
            'notes' => ['varchar:255', true],
            'position' => ['integer', false],
            'created_at' => ['timestamp', false],
            'updated_at' => ['timestamp', false],
        ]];

        yield 'recipe_steps' => ['recipe_steps', [
            'id' => ['bigint', false],
            'recipe_id' => ['bigint', false],
            'position' => ['integer', false],
            'instruction' => ['varchar:2000', false],
            'created_at' => ['timestamp', false],
            'updated_at' => ['timestamp', false],
        ]];

        yield 'categories' => ['categories', [
            'id' => ['bigint', false],
            'name' => ['varchar:80', false],
            'created_at' => ['timestamp', false],
            'updated_at' => ['timestamp', false],
        ]];

        yield 'recipe_categories' => ['recipe_categories', [
            'id' => ['bigint', false],
            'recipe_id' => ['bigint', false],
            'category_id' => ['bigint', false],
            'created_at' => ['timestamp', false],
        ]];

        yield 'tags' => ['tags', [
            'id' => ['bigint', false],
            'name' => ['varchar:50', false],
            'created_at' => ['timestamp', false],
            'updated_at' => ['timestamp', false],
        ]];

        yield 'recipe_tags' => ['recipe_tags', [
            'id' => ['bigint', false],
            'recipe_id' => ['bigint', false],
            'tag_id' => ['bigint', false],
            'created_at' => ['timestamp', false],
        ]];

        yield 'publications' => ['publications', [
            'id' => ['bigint', false],
            'user_id' => ['bigint', false],
            'caption' => ['varchar:2200', true],
            'created_at' => ['timestamp', false],
            'updated_at' => ['timestamp', false],
        ]];

        yield 'publication_images' => ['publication_images', [
            'id' => ['bigint', false],
            'publication_id' => ['bigint', false],
            'recipe_id' => ['bigint', true],
            'asset_id' => ['varchar:255', false],
            'public_id' => ['text', false],
            'alt_text' => ['varchar:255', true],
            'position' => ['integer', false],
            'created_at' => ['timestamp', false],
            'updated_at' => ['timestamp', false],
        ]];

        yield 'comments' => ['comments', [
            'id' => ['bigint', false],
            'user_id' => ['bigint', false],
            'publication_id' => ['bigint', false],
            'parent_comment_id' => ['bigint', true],
            'content' => ['varchar:2000', false],
            'created_at' => ['timestamp', false],
            'updated_at' => ['timestamp', false],
        ]];

        yield 'publication_likes' => ['publication_likes', [
            'id' => ['bigint', false],
            'user_id' => ['bigint', false],
            'publication_id' => ['bigint', false],
            'created_at' => ['timestamp', false],
        ]];

        yield 'saved_recipes' => ['saved_recipes', [
            'id' => ['bigint', false],
            'user_id' => ['bigint', false],
            'recipe_id' => ['bigint', false],
            'created_at' => ['timestamp', false],
        ]];

        yield 'collections' => ['collections', [
            'id' => ['bigint', false],
            'user_id' => ['bigint', false],
            'name' => ['varchar:100', false],
            'description' => ['varchar:500', true],
            'created_at' => ['timestamp', false],
            'updated_at' => ['timestamp', false],
        ]];

        yield 'collection_recipes' => ['collection_recipes', [
            'id' => ['bigint', false],
            'collection_id' => ['bigint', false],
            'recipe_id' => ['bigint', false],
            'created_at' => ['timestamp', false],
        ]];

        yield 'user_follows' => ['user_follows', [
            'id' => ['bigint', false],
            'follower_id' => ['bigint', false],
            'followed_id' => ['bigint', false],
            'created_at' => ['timestamp', false],
        ]];
    }

    private function columnType(object $column): string
    {
        return match ($column->data_type) {
            'character varying' => "varchar:{$column->character_maximum_length}",
            'numeric' => "numeric:{$column->numeric_precision}:{$column->numeric_scale}",
            'timestamp without time zone' => 'timestamp',
            default => $column->data_type,
        };
    }

    /**
     * @return array<string, string>
     */
    private function expectedDeleteRules(): array
    {
        return [
            'collection_recipes.collection_id' => 'CASCADE',
            'collection_recipes.recipe_id' => 'CASCADE',
            'collections.user_id' => 'CASCADE',
            'comments.parent_comment_id' => 'SET NULL',
            'comments.publication_id' => 'CASCADE',
            'comments.user_id' => 'CASCADE',
            'publication_images.publication_id' => 'CASCADE',
            'publication_images.recipe_id' => 'SET NULL',
            'publication_likes.publication_id' => 'CASCADE',
            'publication_likes.user_id' => 'CASCADE',
            'publications.user_id' => 'CASCADE',
            'recipe_authors.recipe_id' => 'CASCADE',
            'recipe_authors.user_id' => 'RESTRICT',
            'recipe_categories.category_id' => 'RESTRICT',
            'recipe_categories.recipe_id' => 'CASCADE',
            'recipe_ingredients.ingredient_id' => 'RESTRICT',
            'recipe_ingredients.recipe_id' => 'CASCADE',
            'recipe_ingredients.unit_id' => 'RESTRICT',
            'recipe_steps.recipe_id' => 'CASCADE',
            'recipe_tags.recipe_id' => 'CASCADE',
            'recipe_tags.tag_id' => 'RESTRICT',
            'saved_recipes.recipe_id' => 'CASCADE',
            'saved_recipes.user_id' => 'CASCADE',
            'user_follows.followed_id' => 'CASCADE',
            'user_follows.follower_id' => 'CASCADE',
            'users.role_id' => 'RESTRICT',
        ];
    }

    /**
     * @return list<string>
     */
    private function expectedCheckConstraints(): array
    {
        return [
            'roles_name_normalized_check',
            'users_username_format_check',
            'users_name_trimmed_check',
            'users_email_normalized_check',
            'users_password_present_check',
            'users_avatar_pair_check',
            'users_avatar_values_check',
            'recipes_title_trimmed_check',
            'recipes_yield_pair_check',
            'recipes_yield_values_check',
            'recipes_times_nonnegative_check',
            'ingredients_name_normalized_check',
            'units_name_normalized_check',
            'units_symbol_present_check',
            'categories_name_normalized_check',
            'tags_name_normalized_check',
            'recipe_ingredients_quantity_check',
            'recipe_ingredients_unit_quantity_check',
            'recipe_ingredients_position_check',
            'recipe_steps_position_check',
            'recipe_steps_instruction_check',
            'publication_images_asset_id_check',
            'publication_images_public_id_check',
            'publication_images_position_check',
            'comments_content_trimmed_check',
            'collections_name_trimmed_check',
            'user_follows_different_users_check',
        ];
    }

    /**
     * @return array<string, array{primary: bool, keys: list<string>}>
     */
    private function expectedPrimaryAndUniqueIndexes(): array
    {
        return [
            'categories.categories_name_unique' => ['primary' => false, 'keys' => ['name']],
            'categories.categories_pkey' => ['primary' => true, 'keys' => ['id']],
            'collection_recipes.collection_recipes_collection_id_recipe_id_unique' => ['primary' => false, 'keys' => ['collection_id', 'recipe_id']],
            'collection_recipes.collection_recipes_pkey' => ['primary' => true, 'keys' => ['id']],
            'collections.collections_pkey' => ['primary' => true, 'keys' => ['id']],
            'collections.collections_user_normalized_name_unique' => ['primary' => false, 'keys' => ['user_id', '<expression>']],
            'comments.comments_pkey' => ['primary' => true, 'keys' => ['id']],
            'ingredients.ingredients_name_unique' => ['primary' => false, 'keys' => ['name']],
            'ingredients.ingredients_pkey' => ['primary' => true, 'keys' => ['id']],
            'publication_images.publication_images_asset_id_unique' => ['primary' => false, 'keys' => ['asset_id']],
            'publication_images.publication_images_pkey' => ['primary' => true, 'keys' => ['id']],
            'publication_images.publication_images_public_id_unique' => ['primary' => false, 'keys' => ['public_id']],
            'publication_images.publication_images_publication_id_position_unique' => ['primary' => false, 'keys' => ['publication_id', 'position']],
            'publication_likes.publication_likes_pkey' => ['primary' => true, 'keys' => ['id']],
            'publication_likes.publication_likes_user_id_publication_id_unique' => ['primary' => false, 'keys' => ['user_id', 'publication_id']],
            'publications.publications_pkey' => ['primary' => true, 'keys' => ['id']],
            'recipe_authors.recipe_authors_pkey' => ['primary' => true, 'keys' => ['id']],
            'recipe_authors.recipe_authors_recipe_id_user_id_unique' => ['primary' => false, 'keys' => ['recipe_id', 'user_id']],
            'recipe_categories.recipe_categories_pkey' => ['primary' => true, 'keys' => ['id']],
            'recipe_categories.recipe_categories_recipe_id_category_id_unique' => ['primary' => false, 'keys' => ['recipe_id', 'category_id']],
            'recipe_ingredients.recipe_ingredients_pkey' => ['primary' => true, 'keys' => ['id']],
            'recipe_ingredients.recipe_ingredients_recipe_id_ingredient_id_unique' => ['primary' => false, 'keys' => ['recipe_id', 'ingredient_id']],
            'recipe_ingredients.recipe_ingredients_recipe_id_position_unique' => ['primary' => false, 'keys' => ['recipe_id', 'position']],
            'recipe_steps.recipe_steps_pkey' => ['primary' => true, 'keys' => ['id']],
            'recipe_steps.recipe_steps_recipe_id_position_unique' => ['primary' => false, 'keys' => ['recipe_id', 'position']],
            'recipe_tags.recipe_tags_pkey' => ['primary' => true, 'keys' => ['id']],
            'recipe_tags.recipe_tags_recipe_id_tag_id_unique' => ['primary' => false, 'keys' => ['recipe_id', 'tag_id']],
            'recipes.recipes_pkey' => ['primary' => true, 'keys' => ['id']],
            'roles.roles_name_unique' => ['primary' => false, 'keys' => ['name']],
            'roles.roles_pkey' => ['primary' => true, 'keys' => ['id']],
            'saved_recipes.saved_recipes_pkey' => ['primary' => true, 'keys' => ['id']],
            'saved_recipes.saved_recipes_user_id_recipe_id_unique' => ['primary' => false, 'keys' => ['user_id', 'recipe_id']],
            'tags.tags_name_unique' => ['primary' => false, 'keys' => ['name']],
            'tags.tags_pkey' => ['primary' => true, 'keys' => ['id']],
            'units.units_name_unique' => ['primary' => false, 'keys' => ['name']],
            'units.units_pkey' => ['primary' => true, 'keys' => ['id']],
            'units.units_symbol_unique' => ['primary' => false, 'keys' => ['symbol']],
            'user_follows.user_follows_follower_id_followed_id_unique' => ['primary' => false, 'keys' => ['follower_id', 'followed_id']],
            'user_follows.user_follows_pkey' => ['primary' => true, 'keys' => ['id']],
            'users.users_avatar_asset_id_unique' => ['primary' => false, 'keys' => ['avatar_asset_id']],
            'users.users_avatar_public_id_unique' => ['primary' => false, 'keys' => ['avatar_public_id']],
            'users.users_email_unique' => ['primary' => false, 'keys' => ['email']],
            'users.users_pkey' => ['primary' => true, 'keys' => ['id']],
            'users.users_username_unique' => ['primary' => false, 'keys' => ['username']],
        ];
    }
}
