import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import UpdateProfileInformationForm from '@/Pages/Profile/Partials/UpdateProfileInformationForm';

const inertia = vi.hoisted(() => ({
    errors: {} as Record<string, string>,
    patch: vi.fn(),
    setData: vi.fn(),
    user: {
        id: 7,
        username: 'angel_1',
        name: 'Ángel',
        bio: 'Cocino en casa.',
        email: 'angel@example.com',
        email_verified_at: null,
    },
}));

vi.mock('@inertiajs/react', () => ({
    Link: ({ children, href }: { children: ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
    useForm: (initialData: Record<string, string>) => ({
        data: initialData,
        errors: inertia.errors,
        patch: inertia.patch,
        processing: false,
        recentlySuccessful: false,
        setData: inertia.setData,
    }),
    usePage: () => ({
        props: {
            auth: {
                user: inertia.user,
            },
        },
    }),
}));

beforeEach(() => {
    inertia.errors = {};
    vi.stubGlobal('route', (name: string) => `/${name}`);
});

afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});

test('muestra username como inmutable y permite editar la biografía', () => {
    render(
        <UpdateProfileInformationForm
            mustVerifyEmail={false}
            status={undefined}
        />,
    );

    const username = screen.getByRole('textbox', {
        name: 'Nombre de usuario',
    });
    const bio = screen.getByRole('textbox', { name: 'Biografía' });

    expect(username.getAttribute('readonly')).not.toBeNull();
    expect(username.getAttribute('value')).toBe('angel_1');
    expect(bio.textContent).toBe('Cocino en casa.');
    expect(
        screen.getByText('El nombre de usuario no se puede cambiar.'),
    ).toBeTruthy();

    fireEvent.change(bio, { target: { value: 'Nueva biografía' } });

    expect(inertia.setData).toHaveBeenCalledWith('bio', 'Nueva biografía');
});

test('envía únicamente los datos editables al actualizar el perfil', () => {
    render(
        <UpdateProfileInformationForm
            mustVerifyEmail={false}
            status={undefined}
        />,
    );

    fireEvent.submit(
        screen
            .getByRole('button', { name: 'Guardar' })
            .closest('form') as HTMLFormElement,
    );

    expect(inertia.patch).toHaveBeenCalledWith('/profile.update');
});

test('muestra el error de validación de la biografía', () => {
    inertia.errors = {
        bio: 'La biografía no puede superar los 500 caracteres.',
    };

    render(
        <UpdateProfileInformationForm
            mustVerifyEmail={false}
            status={undefined}
        />,
    );

    expect(screen.getByRole('alert').textContent).toBe(
        'La biografía no puede superar los 500 caracteres.',
    );
});
