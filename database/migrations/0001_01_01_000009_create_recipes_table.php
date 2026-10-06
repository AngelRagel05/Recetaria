<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recipes', function (Blueprint $table) {
            $table->id();
            $table->string('title', 150);
            $table->string('description', 2000)->nullable();
            $table->decimal('yield_quantity', 8, 2)->nullable();
            $table->string('yield_label', 50)->nullable();
            $table->integer('preparation_time_minutes')->default(0);
            $table->integer('cooking_time_minutes')->default(0);
            $table->integer('resting_time_minutes')->default(0);
            $table->timestamp('published_at')->nullable();
            $table->timestamp('created_at');
            $table->timestamp('updated_at');
        });

        DB::statement(<<<'SQL'
            ALTER TABLE recipes
            ADD CONSTRAINT recipes_title_trimmed_check
            CHECK (title = btrim(title) AND title <> '')
        SQL);
        DB::statement(<<<'SQL'
            ALTER TABLE recipes
            ADD CONSTRAINT recipes_yield_pair_check
            CHECK (
                (yield_quantity IS NULL AND yield_label IS NULL)
                OR (yield_quantity IS NOT NULL AND yield_label IS NOT NULL)
            )
        SQL);
        DB::statement(<<<'SQL'
            ALTER TABLE recipes
            ADD CONSTRAINT recipes_yield_values_check
            CHECK (
                (yield_quantity IS NULL OR yield_quantity > 0)
                AND (yield_label IS NULL OR (yield_label = btrim(yield_label) AND yield_label <> ''))
            )
        SQL);
        DB::statement(<<<'SQL'
            ALTER TABLE recipes
            ADD CONSTRAINT recipes_times_nonnegative_check
            CHECK (
                preparation_time_minutes >= 0
                AND cooking_time_minutes >= 0
                AND resting_time_minutes >= 0
            )
        SQL);
    }

    public function down(): void
    {
        Schema::dropIfExists('recipes');
    }
};
