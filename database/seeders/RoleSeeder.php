<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function (): void {
            Role::query()->firstOrCreate(['name' => 'member']);
            Role::query()->firstOrCreate(['name' => 'admin']);
        });
    }
}
