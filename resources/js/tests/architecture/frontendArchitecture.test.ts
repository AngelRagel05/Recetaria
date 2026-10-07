import { readdirSync, readFileSync, type Dirent } from 'node:fs';
import {
    basename,
    dirname,
    extname,
    join,
    relative,
    resolve,
    sep,
} from 'node:path';
import { describe, expect, test } from 'vitest';

const jsRoot = resolve(process.cwd(), 'resources/js');
const visualRoots = ['Pages', 'Components', 'Layouts'] as const;
const forbiddenDirectories = new Set([
    'Partials',
    'Common',
    'Sections',
    'Features',
]);
const rootDirectories = new Set([
    'Components',
    'Hooks',
    'Layouts',
    'Pages',
    'Utils',
    'tests',
    'types',
]);
const supportDirectories = new Set([
    join('Components', 'Home', 'data'),
    join('Components', 'Home', 'types'),
    join('Components', 'SocialFeed', 'types'),
]);
const requiredVisualLeaves = [
    join('Components', 'FormField'),
    join('Components', 'Home', 'CreatePrototype'),
    join('Components', 'Home', 'GuestHome'),
    join('Components', 'Home', 'HomeHeader'),
    join('Components', 'Home', 'InvitationsPrototype'),
    join('Components', 'Home', 'MemberHome'),
    join('Components', 'Home', 'ProfilePrototype'),
    join('Components', 'Home', 'PrototypePanel'),
    join('Components', 'Profile', 'DeleteUserForm'),
    join('Components', 'Profile', 'UpdatePasswordForm'),
    join('Components', 'Profile', 'UpdateProfileInformationForm'),
    join('Components', 'SocialFeed', 'PublicationAction'),
    join('Components', 'SocialFeed', 'PublicationCard'),
    join('Components', 'SocialFeed', 'PublicationCarousel'),
    join('Components', 'SocialFeed', 'SocialFeed'),
    join('Layouts', 'AuthenticatedLayout'),
    join('Layouts', 'GuestLayout'),
    join('Pages', 'Auth', 'ConfirmPassword'),
    join('Pages', 'Auth', 'ForgotPassword'),
    join('Pages', 'Auth', 'Login'),
    join('Pages', 'Auth', 'Register'),
    join('Pages', 'Auth', 'ResetPassword'),
    join('Pages', 'Auth', 'VerifyEmail'),
    join('Pages', 'Home', 'Home'),
    join('Pages', 'Profile', 'Dashboard'),
    join('Pages', 'Profile', 'Edit'),
].sort();

function walk(directory: string): string[] {
    return readdirSync(directory, { withFileTypes: true }).flatMap(
        (entry: Dirent) => {
            const path = join(directory, entry.name);
            return entry.isDirectory() ? walk(path) : [path];
        },
    );
}

function relativeParts(path: string): string[] {
    return relative(jsRoot, path).split(sep);
}

function isInside(path: string, directory: string): boolean {
    const relation = relative(join(jsRoot, directory), path);
    return relation !== '..' && !relation.startsWith(`..${sep}`);
}

function visualFiles(): string[] {
    return visualRoots.flatMap((root) => walk(join(jsRoot, root)));
}

function visualLeafDirectories(files: string[]): string[] {
    return [
        ...new Set(
            files
                .filter(
                    (path) =>
                        path.endsWith('.tsx') || path.endsWith('.module.css'),
                )
                .map((path) => relative(jsRoot, dirname(path))),
        ),
    ].sort();
}

function expectedDepth(root: (typeof visualRoots)[number]): number[] {
    if (root === 'Pages') {
        return [4];
    }

    if (root === 'Layouts') {
        return [3];
    }

    return [3, 4];
}

describe('arquitectura frontend', () => {
    test('mantiene una pareja TSX y CSS homónima en cada carpeta visual', () => {
        const leaves = visualLeafDirectories(visualFiles());

        expect(leaves).toEqual(requiredVisualLeaves);

        for (const leaf of leaves) {
            const directory = join(jsRoot, leaf);
            const folderName = basename(directory);
            const componentPath = join(directory, `${folderName}.tsx`);
            const parts = relativeParts(componentPath);
            const root = parts[0] as (typeof visualRoots)[number];
            const directoryFiles = readdirSync(directory).sort();

            expect(
                expectedDepth(root),
                `${relative(jsRoot, componentPath)} tiene una profundidad no permitida`,
            ).toContain(parts.length);
            expect(
                directoryFiles,
                `${leaf} debe contener solo su pareja visual`,
            ).toEqual([`${folderName}.module.css`, `${folderName}.tsx`]);
        }
    });

    test('descubre una carpeta aunque solo contenga un CSS Module', () => {
        const cssOnlyPath = join(
            jsRoot,
            'Components',
            'Example',
            'Example.module.css',
        );

        expect(visualLeafDirectories([cssOnlyPath])).toEqual([
            join('Components', 'Example'),
        ]);
    });

    test('limita los archivos auxiliares a las rutas aprobadas', () => {
        const rootEntries = readdirSync(jsRoot, { withFileTypes: true });
        const unexpectedRootEntries = rootEntries
            .filter((entry) =>
                entry.isDirectory()
                    ? !rootDirectories.has(entry.name)
                    : entry.name !== 'app.tsx',
            )
            .map((entry) => entry.name);

        expect(unexpectedRootEntries).toEqual([]);

        const files = walk(jsRoot);
        const invalidFiles = files
            .filter((path) => {
                const extension = extname(path);
                const parts = relativeParts(path);

                if (path === join(jsRoot, 'app.tsx')) {
                    return false;
                }

                if (isInside(path, 'tests')) {
                    return (
                        !path.endsWith('.test.ts') &&
                        !path.endsWith('.test.tsx')
                    );
                }

                if (isInside(path, 'types')) {
                    return !path.endsWith('.d.ts');
                }

                if (supportDirectories.has(dirname(relative(jsRoot, path)))) {
                    return extension !== '.ts' || parts.at(-1) === 'index.ts';
                }

                if (
                    visualRoots.includes(
                        parts[0] as (typeof visualRoots)[number],
                    )
                ) {
                    return (
                        extension !== '.tsx' && !path.endsWith('.module.css')
                    );
                }

                return true;
            })
            .map((path) => relative(jsRoot, path));

        expect(invalidFiles).toEqual([]);
    });

    test('rechaza carpetas prohibidas y barrels TypeScript', () => {
        const directories = walkDirectories(jsRoot);
        const prohibited = directories
            .filter((path) => forbiddenDirectories.has(basename(path)))
            .map((path) => relative(jsRoot, path));
        const barrels = walk(jsRoot)
            .filter((path) => basename(path) === 'index.ts')
            .map((path) => relative(jsRoot, path));

        expect(prohibited).toEqual([]);
        expect(barrels).toEqual([]);
    });

    test('usa el alias interno y solo importa relativamente el CSS propio', () => {
        const violations: string[] = [];

        for (const path of visualFiles().filter((file) =>
            file.endsWith('.tsx'),
        )) {
            const source = readFileSync(path, 'utf8');
            const specifiers = [
                ...source.matchAll(/\bfrom\s+['"]([^'"]+)['"]/g),
                ...source.matchAll(/\bimport\s+['"]([^'"]+)['"]/g),
            ].map((match) => match[1]);
            const componentName = basename(path, '.tsx');
            const relativeImports = specifiers.filter((specifier) =>
                specifier.startsWith('.'),
            );

            if (
                relativeImports.length !== 1 ||
                relativeImports[0] !== `./${componentName}.module.css`
            ) {
                violations.push(
                    `${relative(jsRoot, path)}: ${relativeImports.join(', ') || 'sin CSS propio'}`,
                );
            }
        }

        expect(violations).toEqual([]);
    });
});

function walkDirectories(directory: string): string[] {
    return readdirSync(directory, { withFileTypes: true }).flatMap(
        (entry: Dirent) => {
            if (!entry.isDirectory()) {
                return [];
            }

            const path = join(directory, entry.name);
            return [path, ...walkDirectories(path)];
        },
    );
}
