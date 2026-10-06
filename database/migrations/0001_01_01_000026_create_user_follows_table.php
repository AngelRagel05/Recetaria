<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_follows', function (Blueprint $table) {
            $table->id();
            $table->foreignId('follower_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('followed_id')->constrained('users')->cascadeOnDelete();
            $table->timestamp('created_at');

            $table->unique(['follower_id', 'followed_id']);
            $table->index('followed_id');
        });

        DB::statement(<<<'SQL'
            ALTER TABLE user_follows
            ADD CONSTRAINT user_follows_different_users_check
            CHECK (follower_id <> followed_id)
        SQL);
    }

    public function down(): void
    {
        Schema::dropIfExists('user_follows');
    }
};
