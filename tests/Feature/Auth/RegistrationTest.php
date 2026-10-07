<?php

namespace Tests\Feature\Auth;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Auth/Register', false));
    }

    public function test_new_users_can_register(): void
    {
        $response = $this->post('/register', [
            'name' => '  Test User  ',
            'username' => '  Test_User  ',
            'email' => '  TEST@EXAMPLE.COM  ',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));

        $user = User::query()->sole();

        $this->assertSame('test_user', $user->username);
        $this->assertSame('Test User', $user->name);
        $this->assertSame('test@example.com', $user->email);
        $this->assertSame('member', $user->role->name);
    }

    public function test_registration_resolves_member_by_name_instead_of_fixed_id(): void
    {
        Role::query()->where('name', 'member')->delete();
        $member = Role::query()->create(['name' => 'member']);

        $this->assertNotSame(1, $member->id);

        $response = $this->post('/register', [
            'name' => 'Test User',
            'username' => 'member_by_name',
            'email' => 'member@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertRedirect(route('dashboard', absolute: false));
        $this->assertSame($member->id, User::query()->sole()->role_id);
    }

    public function test_normalized_username_must_be_unique(): void
    {
        User::factory()->create(['username' => 'angel_1']);

        $response = $this->from('/register')->post('/register', [
            'name' => 'Another User',
            'username' => '  ANGEL_1 ',
            'email' => 'another@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response
            ->assertSessionHasErrors('username')
            ->assertRedirect('/register');
        $this->assertGuest();
        $this->assertDatabaseCount('users', 1);
    }

    public function test_registration_is_temporarily_unavailable_without_member_role(): void
    {
        Role::query()->where('name', 'member')->delete();
        Log::spy();

        $response = $this->post('/register', [
            'name' => 'Test User',
            'username' => 'test_user',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response
            ->assertStatus(503)
            ->assertSeeText('El registro no está disponible temporalmente.');
        $this->assertGuest();
        $this->assertDatabaseCount('users', 0);
        Log::shouldHaveReceived('error')
            ->once()
            ->with('No se pudo completar el registro porque falta el rol member.');
    }
}
