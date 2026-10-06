<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('publication_id')->constrained('publications')->cascadeOnDelete();
            $table->foreignId('parent_comment_id')->nullable()->constrained('comments')->nullOnDelete();
            $table->string('content', 2000);
            $table->timestamp('created_at');
            $table->timestamp('updated_at');

            $table->index('user_id');
            $table->index('publication_id');
            $table->index('parent_comment_id');
        });

        DB::statement(<<<'SQL'
            ALTER TABLE comments
            ADD CONSTRAINT comments_content_trimmed_check
            CHECK (content = btrim(content) AND content <> '')
        SQL);
    }

    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
