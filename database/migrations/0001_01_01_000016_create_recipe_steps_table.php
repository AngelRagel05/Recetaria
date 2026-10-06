<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recipe_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recipe_id')->constrained('recipes')->cascadeOnDelete();
            $table->integer('position');
            $table->string('instruction', 2000);
            $table->timestamp('created_at');
            $table->timestamp('updated_at');

            $table->unique(['recipe_id', 'position']);
        });

        DB::statement(<<<'SQL'
            ALTER TABLE recipe_steps
            ADD CONSTRAINT recipe_steps_position_check
            CHECK (position >= 1)
        SQL);
        DB::statement(<<<'SQL'
            ALTER TABLE recipe_steps
            ADD CONSTRAINT recipe_steps_instruction_check
            CHECK (instruction = btrim(instruction) AND instruction <> '')
        SQL);
    }

    public function down(): void
    {
        Schema::dropIfExists('recipe_steps');
    }
};
