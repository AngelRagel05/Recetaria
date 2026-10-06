<?php

namespace Tests\Unit;

use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class TestingDatabaseGuardTest extends TestCase
{
    public function test_local_postgresql_testing_database_is_allowed(): void
    {
        $this->assertTrue($this->testing_database_configuration_is_safe(
            'pgsql',
            'recetaria_testing',
            '127.0.0.1',
            null,
        ));

        $this->assertTrue($this->testing_database_configuration_is_safe(
            'pgsql',
            'recetaria_testing',
            'localhost',
            '',
        ));
    }

    #[DataProvider('unsafeConfigurationProvider')]
    public function test_other_database_configurations_are_rejected(
        mixed $connection,
        mixed $database,
        mixed $host,
        mixed $url,
    ): void {
        $this->assertFalse($this->testing_database_configuration_is_safe(
            $connection,
            $database,
            $host,
            $url,
        ));
    }

    /**
     * @return iterable<string, array{mixed, mixed, mixed, mixed}>
     */
    public static function unsafeConfigurationProvider(): iterable
    {
        yield 'SQLite' => ['sqlite', ':memory:', null, null];
        yield 'base normal' => ['pgsql', 'postgres', '127.0.0.1', null];
        yield 'host remoto' => ['pgsql', 'recetaria_testing', 'db.example.test', null];
        yield 'URL alternativa' => [
            'pgsql',
            'recetaria_testing',
            '127.0.0.1',
            'postgresql://example.test/database',
        ];
    }
}
