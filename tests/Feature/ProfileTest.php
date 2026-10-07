<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_page_is_displayed(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get('/profile');

        $response
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Profile/Edit', false));
    }

    public function test_profile_information_can_be_updated(): void
    {
        $user = User::factory()->create();
        $originalUsername = $user->username;

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'name' => '  Test User  ',
                'username' => 'attempted_change',
                'email' => '  TEST@EXAMPLE.COM  ',
                'bio' => '  Cocino cada día.  ',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profile');

        $user->refresh();

        $this->assertSame('Test User', $user->name);
        $this->assertSame('test@example.com', $user->email);
        $this->assertSame('Cocino cada día.', $user->bio);
        $this->assertSame($originalUsername, $user->username);
        $this->assertNull($user->email_verified_at);
    }

    public function test_empty_bio_is_stored_as_null(): void
    {
        $user = User::factory()->create(['bio' => 'Biografía anterior']);

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'name' => $user->name,
                'email' => $user->email,
                'bio' => '   ',
            ]);

        $response->assertSessionHasNoErrors();
        $this->assertNull($user->refresh()->bio);
    }

    public function test_bio_longer_than_500_characters_is_rejected(): void
    {
        $user = User::factory()->create(['bio' => 'Biografía anterior']);

        $response = $this
            ->actingAs($user)
            ->from('/profile')
            ->patch('/profile', [
                'name' => $user->name,
                'email' => $user->email,
                'bio' => str_repeat('a', 501),
            ]);

        $response
            ->assertSessionHasErrors('bio')
            ->assertRedirect('/profile');

        $this->assertSame('Biografía anterior', $user->refresh()->bio);
    }

    public function test_email_verification_status_is_unchanged_when_the_email_address_is_unchanged(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'name' => 'Test User',
                'email' => $user->email,
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profile');

        $this->assertNotNull($user->refresh()->email_verified_at);
    }

    public function test_user_can_delete_their_account(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->delete('/profile', [
                'password' => 'password',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/');

        $this->assertGuest();
        $this->assertNull($user->fresh());
    }

    public function test_correct_password_must_be_provided_to_delete_account(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->from('/profile')
            ->delete('/profile', [
                'password' => 'wrong-password',
            ]);

        $response
            ->assertSessionHasErrors('password')
            ->assertRedirect('/profile');

        $this->assertNotNull($user->fresh());
    }
}
