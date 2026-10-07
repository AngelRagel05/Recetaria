import Home from '@/Pages/Home/Home/Home';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

const inertia = vi.hoisted(() => ({
    page: {
        props: {
            auth: {
                user: null as null | {
                    id: number;
                    name: string;
                    email: string;
                },
            },
        },
    },
}));

vi.mock('@inertiajs/react', () => ({
    Head: () => null,
    Link: ({
        'aria-label': ariaLabel,
        children,
        href,
    }: {
        'aria-label'?: string;
        children: ReactNode;
        href: string;
    }) => (
        <a aria-label={ariaLabel} href={href}>
            {children}
        </a>
    ),
    usePage: () => inertia.page,
}));

const routes: Record<string, string> = {
    login: '/login',
    logout: '/logout',
    register: '/register',
};

beforeEach(() => {
    inertia.page.props.auth.user = null;
    vi.stubGlobal('route', (name: string) => routes[name]);
});

afterEach(cleanup);

test('limita la portada visitante a seis publicaciones y deriva las acciones al acceso', () => {
    render(<Home canLogin canRegister />);

    expect(
        screen.getAllByRole('article', { name: /Publicación de/ }),
    ).toHaveLength(6);
    expect(
        screen.getByRole('heading', {
            name: 'Tu mesa tiene sitio en Recetaria.',
        }),
    ).toBeTruthy();
    expect(screen.queryByRole('tab')).toBeNull();

    const loginActions = screen.getAllByRole('link', {
        name: /Inicia sesión para indicar que te gusta/,
    });

    expect(loginActions).toHaveLength(6);
    expect(loginActions[0].getAttribute('href')).toBe('/login');
});

test('mantiene el foco y las interacciones al cambiar de feed y visitar paneles', () => {
    inertia.page.props.auth.user = {
        id: 1,
        name: 'Lucía Ramos',
        email: 'lucia@example.test',
    };

    render(<Home canLogin canRegister />);

    const homeTab = screen.getByRole('tab', { name: 'Inicio' });
    const exploreTab = screen.getByRole('tab', { name: 'Explorar' });

    expect(homeTab.getAttribute('aria-selected')).toBe('true');
    expect(homeTab.getAttribute('aria-controls')).toBe('feed-panel');
    expect(exploreTab.getAttribute('aria-selected')).toBe('false');

    exploreTab.focus();
    fireEvent.click(exploreTab);

    expect(document.activeElement).toBe(exploreTab);
    expect(exploreTab.getAttribute('aria-selected')).toBe('true');
    expect(homeTab.getAttribute('aria-selected')).toBe('false');
    expect(
        screen.getByText(
            'Crujiente, cremoso y listo en diez minutos para empezar con calma.',
        ),
    ).toBeTruthy();

    const likeButton = screen.getByRole('button', { name: '♡ 203' });
    fireEvent.click(likeButton);
    expect(
        screen
            .getByRole('button', { name: '♥ 204' })
            .getAttribute('aria-pressed'),
    ).toBe('true');

    const invitationsButton = screen.getByRole('button', {
        name: 'Invitaciones',
    });
    invitationsButton.focus();
    fireEvent.click(invitationsButton);

    const panelHeading = screen.getByRole('heading', {
        name: 'Invitaciones pendientes',
        level: 1,
    });
    expect(document.activeElement).toBe(panelHeading);
    expect(screen.getByText(/no envía ni guarda información/)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '← Volver al feed' }));

    expect(document.activeElement).toBe(invitationsButton);
    expect(screen.getByRole('button', { name: '♥ 204' })).toBeTruthy();
    expect(exploreTab.getAttribute('aria-selected')).toBe('true');
});

test('representa creación y perfil, y reinicia el prototipo al remontarse', () => {
    inertia.page.props.auth.user = {
        id: 1,
        name: 'Lucía Ramos',
        email: 'lucia@example.test',
    };

    const view = render(<Home canLogin canRegister />);

    fireEvent.click(screen.getByRole('button', { name: '♡ 128' }));
    expect(screen.getByRole('button', { name: '♥ 129' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Crear' }));
    expect(
        screen.getByRole('heading', {
            name: '¿Qué quieres compartir?',
            level: 1,
        }),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '← Volver al feed' }));

    fireEvent.click(screen.getByRole('button', { name: 'Perfil' }));
    expect(
        screen.getByRole('heading', { name: 'Lucía Ramos', level: 1 }),
    ).toBeTruthy();

    view.unmount();
    render(<Home canLogin canRegister />);

    expect(screen.getByRole('button', { name: '♡ 128' })).toBeTruthy();
});
