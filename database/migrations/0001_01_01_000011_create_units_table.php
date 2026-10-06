<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50)->unique();
            $table->string('symbol', 20)->nullable()->unique();
            $table->timestamp('created_at');
            $table->timestamp('updated_at');
        });

        DB::statement(<<<'SQL'
            ALTER TABLE units
            ADD CONSTRAINT units_name_normalized_check
            CHECK (name = lower(btrim(name)) AND name <> '')
        SQL);
        DB::statement(<<<'SQL'
            ALTER TABLE units
            ADD CONSTRAINT units_symbol_present_check
            CHECK (symbol IS NULL OR (symbol = btrim(symbol) AND symbol <> ''))
        SQL);
    }

    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
