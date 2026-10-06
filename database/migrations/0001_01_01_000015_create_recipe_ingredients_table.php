<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recipe_ingredients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recipe_id')->constrained('recipes')->cascadeOnDelete();
            $table->foreignId('ingredient_id')->constrained('ingredients')->restrictOnDelete();
            $table->foreignId('unit_id')->nullable()->constrained('units')->restrictOnDelete();
            $table->decimal('quantity', 10, 3)->nullable();
            $table->string('notes', 255)->nullable();
            $table->integer('position');
            $table->timestamp('created_at');
            $table->timestamp('updated_at');

            $table->unique(['recipe_id', 'ingredient_id']);
            $table->unique(['recipe_id', 'position']);
            $table->index('ingredient_id');
            $table->index('unit_id');
        });

        DB::statement(<<<'SQL'
            ALTER TABLE recipe_ingredients
            ADD CONSTRAINT recipe_ingredients_quantity_check
            CHECK (quantity IS NULL OR quantity > 0)
        SQL);
        DB::statement(<<<'SQL'
            ALTER TABLE recipe_ingredients
            ADD CONSTRAINT recipe_ingredients_unit_quantity_check
            CHECK (unit_id IS NULL OR quantity IS NOT NULL)
        SQL);
        DB::statement(<<<'SQL'
            ALTER TABLE recipe_ingredients
            ADD CONSTRAINT recipe_ingredients_position_check
            CHECK (position >= 1)
        SQL);
    }

    public function down(): void
    {
        Schema::dropIfExists('recipe_ingredients');
    }
};
