import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { FormEvent, ReactNode } from 'react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import Register from '@/Pages/Auth/Register';

const inertia = vi.hoisted(() => ({
    post: vi.fn(),
    reset: vi.fn(),
    setData: vi.fn(),
}));

vi.mock('@inertiajs/react', () => ({
    Head: () => null,
    Link: ({ children, href }: { children: ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
    useForm: (initialData: Record<string, string>) => ({
        data: initialData,
        errors: {},
        post: inertia.post,
        processing: false,
        reset: inertia.reset,
        setData: inertia.setData,
    }),
}));

beforeEach(() => {
    vi.stubGlobal('route', (name: string) => `/${name}`);
});

afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});

test('incluye username y conserva la normalización en el servidor', () => {
    render(<Register />);

    const username = screen.getByRole('textbox', {
        name: 'Nombre de usuario',
    });
    const email = screen.getByRole('textbox', {
        name: 'Correo electrónico',
    });

    expect(username.getAttribute('minlength')).toBe('3');
    expect(username.getAttribute('maxlength')).toBe('30');
    expect(username.getAttribute('pattern')).toBe('[A-Za-z0-9_]+');
    expect(email.getAttribute('autocomplete')).toBe('email');

    fireEvent.change(username, { target: { value: 'Angel_1' } });

    expect(inertia.setData).toHaveBeenCalledWith('username', 'Angel_1');
});

test('envía el formulario a la ruta de registro', () => {
    render(<Register />);

    fireEvent.submit(
        screen
            .getByRole('button', { name: 'Registrarme' })
            .closest('form') as HTMLFormElement,
    );

    expect(inertia.post).toHaveBeenCalledWith(
        '/register',
        expect.objectContaining({ onFinish: expect.any(Function) }),
    );

    const options = inertia.post.mock.calls[0][1] as {
        onFinish: (event?: FormEvent) => void;
    };
    options.onFinish();

    expect(inertia.reset).toHaveBeenCalledWith(
        'password',
        'password_confirmation',
    );
});
