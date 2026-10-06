<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('collections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('name', 100);
            $table->string('description', 500)->nullable();
            $table->timestamp('created_at');
            $table->timestamp('updated_at');

            $table->index('user_id');
        });

        DB::statement(<<<'SQL'
            ALTER TABLE collections
            ADD CONSTRAINT collections_name_trimmed_check
            CHECK (name = btrim(name) AND name <> '')
        SQL);
        DB::statement(<<<'SQL'
            CREATE UNIQUE INDEX collections_user_normalized_name_unique
            ON collections (user_id, lower(btrim(name)))
        SQL);
    }

    public function down(): void
    {
        Schema::dropIfExists('collections');
    }
};
