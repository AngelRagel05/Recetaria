<?php

namespace Tests\Feature\Database;

use App\Models\Role;
use App\Models\User;
use Closure;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class DatabaseConstraintsTest extends TestCase
{
    use RefreshDatabase;

    public function test_normalized_catalog_names_are_enforced_by_postgresql(): void
    {
        $catalogs = [
            'roles' => 50,
            'ingredients' => 100,
            'units' => 50,
            'categories' => 80,
            'tags' => 50,
        ];

        foreach ($catalogs as $table => $length) {
            $this->assertDatabaseRejects(function () use ($table, $length): void {
                $data = ['name' => str_pad('INVALID', min($length, 7), 'X')];

                if ($table !== 'roles') {
                    $data['created_at'] = now();
                    $data['updated_at'] = now();
                }

                DB::table($table)->insert($data);
            });
        }
    }

    public function test_user_format_and_avatar_pair_are_enforced_by_postgresql(): void
    {
        $this->assertDatabaseRejects(function (): void {
            DB::table('users')->insert([
                ...$this->validUserData('Invalid_User', 'invalid-user@example.test'),
            ]);
        });

        $this->assertDatabaseRejects(function (): void {
            DB::table('users')->insert([
                ...$this->validUserData('valid_user', 'invalid-avatar@example.test'),
                'avatar_asset_id' => 'avatar-asset',
                'avatar_public_id' => null,
            ]);
        });
    }

    public function test_recipe_ranges_and_paired_yield_are_enforced_by_postgresql(): void
    {
        $this->assertDatabaseRejects(function (): void {
            DB::table('recipes')->insert([
                ...$this->validRecipeData(),
                'title' => '   ',
            ]);
        });

        $this->assertDatabaseRejects(function (): void {
            DB::table('recipes')->insert([
                ...$this->validRecipeData(),
                'preparation_time_minutes' => -1,
            ]);
        });

        $this->assertDatabaseRejects(function (): void {
            DB::table('recipes')->insert([
                ...$this->validRecipeData(),
                'yield_quantity' => 2,
                'yield_label' => null,
            ]);
        });
    }

    public function test_recipe_component_values_are_enforced_by_postgresql(): void
    {
        $recipeId = DB::table('recipes')->insertGetId($this->validRecipeData());
        $ingredientId = DB::table('ingredients')->insertGetId([
            'name' => 'tomate',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $unitId = DB::table('units')->insertGetId([
            'name' => 'gramo',
            'symbol' => 'g',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->assertDatabaseRejects(function () use ($ingredientId, $recipeId, $unitId): void {
            DB::table('recipe_ingredients')->insert([
                'recipe_id' => $recipeId,
                'ingredient_id' => $ingredientId,
                'unit_id' => $unitId,
                'quantity' => null,
                'position' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });

        $this->assertDatabaseRejects(function () use ($ingredientId, $recipeId): void {
            DB::table('recipe_ingredients')->insert([
                'recipe_id' => $recipeId,
                'ingredient_id' => $ingredientId,
                'quantity' => 1,
                'position' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });

        $this->assertDatabaseRejects(function () use ($recipeId): void {
            DB::table('recipe_steps')->insert([
                'recipe_id' => $recipeId,
                'position' => 1,
                'instruction' => '   ',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });
    }

    public function test_publication_comment_collection_and_follow_checks_are_enforced(): void
    {
        $user = User::factory()->create();
        $publicationId = DB::table('publications')->insertGetId([
            'user_id' => $user->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->assertDatabaseRejects(function () use ($publicationId): void {
            DB::table('publication_images')->insert([
                'publication_id' => $publicationId,
                'asset_id' => 'asset-1',
                'public_id' => 'public-1',
                'position' => 11,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });

        $this->assertDatabaseRejects(function () use ($publicationId, $user): void {
            DB::table('comments')->insert([
                'user_id' => $user->id,
                'publication_id' => $publicationId,
                'content' => '',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });

        $this->assertDatabaseRejects(function () use ($user): void {
            DB::table('collections')->insert([
                'user_id' => $user->id,
                'name' => ' Favoritas',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        });

        DB::table('collections')->insert([
            'user_id' => $user->id,
            'name' => 'Favoritas',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->assertDatabaseRejects(function () use ($user): void {
            DB::table('collections')->insert([
                'user_id' => $user->id,
                'name' => 'FAVORITAS',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }, '23505');

        $this->assertDatabaseRejects(function () use ($user): void {
            DB::table('user_follows')->insert([
                'follower_id' => $user->id,
                'followed_id' => $user->id,
                'created_at' => now(),
            ]);
        });
    }

    private function assertDatabaseRejects(Closure $operation, string $expectedSqlState = '23514'): void
    {
        DB::beginTransaction();

        try {
            $operation();
            DB::rollBack();
            $this->fail('PostgreSQL aceptó datos que debía rechazar.');
        } catch (QueryException $exception) {
            DB::rollBack();
            $this->assertSame($expectedSqlState, $exception->errorInfo[0]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function validUserData(string $username, string $email): array
    {
        return [
            'role_id' => Role::query()->where('name', 'member')->soleValue('id'),
            'username' => $username,
            'name' => 'Usuario válido',
            'email' => $email,
            'password' => 'hashed-password',
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function validRecipeData(): array
    {
        return [
            'title' => 'Receta válida',
            'preparation_time_minutes' => 0,
            'cooking_time_minutes' => 0,
            'resting_time_minutes' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
