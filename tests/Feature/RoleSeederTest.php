<?php

namespace Tests\Feature;

use App\Models\Role;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_role_seeder_is_idempotent_and_preserves_other_roles(): void
    {
        Role::query()->create(['name' => 'editor']);

        $this->seed(RoleSeeder::class);
        $this->seed(RoleSeeder::class);

        $this->assertSame(1, Role::query()->where('name', 'member')->count());
        $this->assertSame(1, Role::query()->where('name', 'admin')->count());
        $this->assertSame(1, Role::query()->where('name', 'editor')->count());
        $this->assertDatabaseCount('roles', 3);
        $this->assertDatabaseCount('users', 0);
    }
}
