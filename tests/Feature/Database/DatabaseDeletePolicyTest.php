<?php

namespace Tests\Feature\Database;

use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class DatabaseDeletePolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_deleting_a_recipe_cascades_components_and_preserves_publication_images(): void
    {
        $user = User::factory()->create();
        $recipeId = $this->createRecipe();
        $ingredientId = DB::table('ingredients')->insertGetId([
            'name' => 'tomate',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $publicationId = $this->createPublication($user);

        DB::table('recipe_authors')->insert([
            'recipe_id' => $recipeId,
            'user_id' => $user->id,
            'created_at' => now(),
        ]);
        DB::table('recipe_ingredients')->insert([
            'recipe_id' => $recipeId,
            'ingredient_id' => $ingredientId,
            'quantity' => 1,
            'position' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('recipe_steps')->insert([
            'recipe_id' => $recipeId,
            'position' => 1,
            'instruction' => 'Cocinar',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $imageId = DB::table('publication_images')->insertGetId([
            'publication_id' => $publicationId,
            'recipe_id' => $recipeId,
            'asset_id' => 'asset-recipe',
            'public_id' => 'public-recipe',
            'position' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('recipes')->where('id', $recipeId)->delete();

        $this->assertDatabaseMissing('recipe_authors', ['recipe_id' => $recipeId]);
        $this->assertDatabaseMissing('recipe_ingredients', ['recipe_id' => $recipeId]);
        $this->assertDatabaseMissing('recipe_steps', ['recipe_id' => $recipeId]);
        $this->assertDatabaseHas('publications', ['id' => $publicationId]);
        $this->assertDatabaseHas('publication_images', [
            'id' => $imageId,
            'recipe_id' => null,
        ]);
    }

    public function test_deleting_a_publication_cascades_images_comments_and_likes(): void
    {
        $user = User::factory()->create();
        $publicationId = $this->createPublication($user);

        DB::table('publication_images')->insert([
            'publication_id' => $publicationId,
            'asset_id' => 'asset-publication',
            'public_id' => 'public-publication',
            'position' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('comments')->insert([
            'user_id' => $user->id,
            'publication_id' => $publicationId,
            'content' => 'Comentario',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('publication_likes')->insert([
            'user_id' => $user->id,
            'publication_id' => $publicationId,
            'created_at' => now(),
        ]);

        DB::table('publications')->where('id', $publicationId)->delete();

        $this->assertDatabaseMissing('publication_images', ['publication_id' => $publicationId]);
        $this->assertDatabaseMissing('comments', ['publication_id' => $publicationId]);
        $this->assertDatabaseMissing('publication_likes', ['publication_id' => $publicationId]);
    }

    public function test_deleting_a_parent_comment_preserves_its_replies(): void
    {
        $user = User::factory()->create();
        $publicationId = $this->createPublication($user);
        $parentId = DB::table('comments')->insertGetId([
            'user_id' => $user->id,
            'publication_id' => $publicationId,
            'content' => 'Comentario padre',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $replyId = DB::table('comments')->insertGetId([
            'user_id' => $user->id,
            'publication_id' => $publicationId,
            'parent_comment_id' => $parentId,
            'content' => 'Respuesta',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('comments')->where('id', $parentId)->delete();

        $this->assertDatabaseHas('comments', [
            'id' => $replyId,
            'parent_comment_id' => null,
        ]);
    }

    public function test_roles_catalogs_and_recipe_authors_restrict_deletion_while_in_use(): void
    {
        $user = User::factory()->create();
        $recipeId = $this->createRecipe();
        DB::table('recipe_authors')->insert([
            'recipe_id' => $recipeId,
            'user_id' => $user->id,
            'created_at' => now(),
        ]);

        $this->assertDeleteIsRestricted(
            fn () => DB::table('roles')->where('id', $user->role_id)->delete(),
        );
        $this->assertDeleteIsRestricted(
            fn () => DB::table('users')->where('id', $user->id)->delete(),
        );

        $ingredientId = DB::table('ingredients')->insertGetId([
            'name' => 'cebolla',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('recipe_ingredients')->insert([
            'recipe_id' => $recipeId,
            'ingredient_id' => $ingredientId,
            'quantity' => 1,
            'position' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->assertDeleteIsRestricted(
            fn () => DB::table('ingredients')->where('id', $ingredientId)->delete(),
        );
    }

    public function test_deleting_a_user_cascades_its_subordinate_social_data(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $recipeId = $this->createRecipe();
        $publicationId = $this->createPublication($user);
        $collectionId = DB::table('collections')->insertGetId([
            'user_id' => $user->id,
            'name' => 'Favoritas',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('saved_recipes')->insert([
            'user_id' => $user->id,
            'recipe_id' => $recipeId,
            'created_at' => now(),
        ]);
        DB::table('collection_recipes')->insert([
            'collection_id' => $collectionId,
            'recipe_id' => $recipeId,
            'created_at' => now(),
        ]);
        DB::table('user_follows')->insert([
            'follower_id' => $user->id,
            'followed_id' => $otherUser->id,
            'created_at' => now(),
        ]);

        $user->delete();

        $this->assertDatabaseMissing('publications', ['id' => $publicationId]);
        $this->assertDatabaseMissing('collections', ['id' => $collectionId]);
        $this->assertDatabaseMissing('saved_recipes', ['user_id' => $user->id]);
        $this->assertDatabaseMissing('user_follows', ['follower_id' => $user->id]);
        $this->assertDatabaseHas('users', ['id' => $otherUser->id]);
    }

    private function assertDeleteIsRestricted(callable $delete): void
    {
        DB::beginTransaction();

        try {
            $delete();
            DB::rollBack();
            $this->fail('PostgreSQL permitió un borrado que debía estar restringido.');
        } catch (QueryException $exception) {
            DB::rollBack();
            $this->assertSame('23503', $exception->errorInfo[0]);
        }
    }

    private function createRecipe(): int
    {
        return DB::table('recipes')->insertGetId([
            'title' => 'Receta',
            'preparation_time_minutes' => 0,
            'cooking_time_minutes' => 0,
            'resting_time_minutes' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    private function createPublication(User $user): int
    {
        return DB::table('publications')->insertGetId([
            'user_id' => $user->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
