<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ingredients', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique();
            $table->timestamp('created_at');
            $table->timestamp('updated_at');
        });

        DB::statement(<<<'SQL'
            ALTER TABLE ingredients
            ADD CONSTRAINT ingredients_name_normalized_check
            CHECK (name = lower(btrim(name)) AND name <> '')
        SQL);
    }

    public function down(): void
    {
        Schema::dropIfExists('ingredients');
    }
};
