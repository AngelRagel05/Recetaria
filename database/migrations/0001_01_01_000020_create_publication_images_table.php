<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('publication_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('publication_id')->constrained('publications')->cascadeOnDelete();
            $table->foreignId('recipe_id')->nullable()->constrained('recipes')->nullOnDelete();
            $table->string('asset_id', 255)->unique();
            $table->text('public_id')->unique();
            $table->string('alt_text', 255)->nullable();
            $table->integer('position');
            $table->timestamp('created_at');
            $table->timestamp('updated_at');

            $table->unique(['publication_id', 'position']);
            $table->index('recipe_id');
        });

        DB::statement(<<<'SQL'
            ALTER TABLE publication_images
            ADD CONSTRAINT publication_images_asset_id_check
            CHECK (asset_id = btrim(asset_id) AND asset_id <> '')
        SQL);
        DB::statement(<<<'SQL'
            ALTER TABLE publication_images
            ADD CONSTRAINT publication_images_public_id_check
            CHECK (public_id = btrim(public_id) AND public_id <> '')
        SQL);
        DB::statement(<<<'SQL'
            ALTER TABLE publication_images
            ADD CONSTRAINT publication_images_position_check
            CHECK (position BETWEEN 1 AND 10)
        SQL);
    }

    public function down(): void
    {
        Schema::dropIfExists('publication_images');
    }
};
