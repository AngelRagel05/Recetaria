<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /**
     * Seed the minimum catalog required by application tests.
     */
    protected bool $seed = true;

    /**
     * Prevent destructive test migrations from reaching a non-local database.
     */
    protected function beforeRefreshingDatabase()
    {
        $connection = config('database.default');
        $database = config("database.connections.{$connection}.database");
        $host = config("database.connections.{$connection}.host");
        $url = config("database.connections.{$connection}.url");

        $isSafeTestingDatabase = $this->testing_database_configuration_is_safe(
            $connection,
            $database,
            $host,
            $url,
        );

        if (! $isSafeTestingDatabase) {
            throw new \LogicException(
                'Las pruebas con RefreshDatabase solo pueden usar PostgreSQL local y la base recetaria_testing.'
            );
        }
    }

    protected function testing_database_configuration_is_safe(
        mixed $connection,
        mixed $database,
        mixed $host,
        mixed $url,
    ): bool {
        return $connection === 'pgsql'
            && $database === 'recetaria_testing'
            && in_array($host, ['127.0.0.1', 'localhost'], true)
            && blank($url);
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }
}
