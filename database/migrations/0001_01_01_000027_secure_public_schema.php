<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /** @var list<string> */
    private array $tables = [
        'migrations',
        'roles',
        'users',
        'password_reset_tokens',
        'sessions',
        'cache',
        'cache_locks',
        'jobs',
        'job_batches',
        'failed_jobs',
        'recipes',
        'ingredients',
        'units',
        'categories',
        'tags',
        'recipe_authors',
        'recipe_ingredients',
        'recipe_steps',
        'recipe_categories',
        'recipe_tags',
        'publications',
        'publication_images',
        'comments',
        'publication_likes',
        'saved_recipes',
        'collections',
        'collection_recipes',
        'user_follows',
    ];

    /** @var list<string> */
    private array $apiRoles = [
        'anon',
        'authenticated',
        'service_role',
    ];

    public function up(): void
    {
        $sequencesByTable = $this->sequencesByTable();

        foreach ($this->tables as $table) {
            DB::statement(sprintf('ALTER TABLE public."%s" ENABLE ROW LEVEL SECURITY', $table));
        }

        foreach ($this->existingApiRoles() as $role) {
            foreach ($this->tables as $table) {
                DB::statement(sprintf(
                    'REVOKE ALL PRIVILEGES ON TABLE public."%s" FROM "%s"',
                    $table,
                    $role,
                ));

                foreach ($sequencesByTable[$table] as $sequence) {
                    DB::statement(sprintf(
                        'REVOKE ALL PRIVILEGES ON SEQUENCE %s FROM "%s"',
                        $sequence,
                        $role,
                    ));
                }
            }
        }
    }

    /**
     * @return array<string, list<string>>
     */
    private function sequencesByTable(): array
    {
        $sequencesByTable = [];

        foreach ($this->tables as $table) {
            $sequencesByTable[$table] = array_values(array_filter(array_map(
                static fn (object $column): ?string => $column->sequence_name,
                DB::select(<<<'SQL'
                    SELECT pg_get_serial_sequence(
                        format('%I.%I', table_schema, table_name),
                        column_name
                    ) AS sequence_name
                    FROM information_schema.columns
                    WHERE table_schema = 'public'
                      AND table_name = ?
                    ORDER BY ordinal_position
                SQL, [$table]),
            )));
        }

        return $sequencesByTable;
    }

    public function down(): void
    {
        foreach ($this->tables as $table) {
            if (Schema::hasTable($table)) {
                DB::statement(sprintf('ALTER TABLE public."%s" DISABLE ROW LEVEL SECURITY', $table));
            }
        }
    }

    /**
     * @return list<string>
     */
    private function existingApiRoles(): array
    {
        return array_values(array_filter(
            $this->apiRoles,
            fn (string $role): bool => DB::selectOne(
                'SELECT to_regrole(?) AS role_oid',
                [$role],
            )->role_oid !== null,
        ));
    }
};
