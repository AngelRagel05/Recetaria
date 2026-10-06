<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')->constrained('roles')->restrictOnDelete();
            $table->string('username', 30)->unique();
            $table->string('name', 100);
            $table->string('bio', 500)->nullable();
            $table->string('avatar_asset_id', 255)->nullable()->unique();
            $table->text('avatar_public_id')->nullable()->unique();
            $table->string('email', 255)->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password', 255);
            $table->string('remember_token', 100)->nullable();
            $table->timestamp('created_at');
            $table->timestamp('updated_at');

            $table->index('role_id');
        });

        DB::statement(<<<'SQL'
            ALTER TABLE users
            ADD CONSTRAINT users_username_format_check
            CHECK (username = lower(btrim(username)) AND username ~ '^[a-z0-9_]{3,30}$')
        SQL);
        DB::statement(<<<'SQL'
            ALTER TABLE users
            ADD CONSTRAINT users_name_trimmed_check
            CHECK (name = btrim(name) AND name <> '')
        SQL);
        DB::statement(<<<'SQL'
            ALTER TABLE users
            ADD CONSTRAINT users_email_normalized_check
            CHECK (email = lower(btrim(email)) AND email <> '')
        SQL);
        DB::statement(<<<'SQL'
            ALTER TABLE users
            ADD CONSTRAINT users_password_present_check
            CHECK (btrim(password) <> '')
        SQL);
        DB::statement(<<<'SQL'
            ALTER TABLE users
            ADD CONSTRAINT users_avatar_pair_check
            CHECK (
                (avatar_asset_id IS NULL AND avatar_public_id IS NULL)
                OR (avatar_asset_id IS NOT NULL AND avatar_public_id IS NOT NULL)
            )
        SQL);
        DB::statement(<<<'SQL'
            ALTER TABLE users
            ADD CONSTRAINT users_avatar_values_check
            CHECK (
                (avatar_asset_id IS NULL OR btrim(avatar_asset_id) <> '')
                AND (avatar_public_id IS NULL OR btrim(avatar_public_id) <> '')
            )
        SQL);
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
