import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import PublicationCard from '@/Components/SocialFeed/PublicationCard';
import SocialFeed from '@/Components/SocialFeed/SocialFeed';
import type { PublicationPresentation } from '@/Components/SocialFeed/types';

const publication: PublicationPresentation = {
    id: 10,
    author: {
        name: 'Ana Salas',
        username: 'ana_cocina',
        initials: 'AS',
        accent: '#325c3f',
    },
    publishedLabel: 'Ahora',
    images: [
        { src: '/primera.svg', alt: 'Primer plato del carrusel' },
        { src: '/segunda.svg', alt: 'Segundo plato del carrusel' },
    ],
    caption: 'Una publicación de prueba.',
    recipe: {
        title: 'Receta de prueba',
        author: 'Ana Salas',
        time: '20 min',
    },
    likeCount: 4,
    commentCount: 2,
    initialEngagement: {
        liked: false,
        commentsOpen: false,
        saved: false,
    },
};

afterEach(cleanup);

test('mantiene los controles del carrusel, el foco y anuncia la posición', () => {
    render(
        <PublicationCard
            engagement={publication.initialEngagement}
            isAuthenticated
            loginHref="/login"
            onAction={vi.fn()}
            publication={publication}
        />,
    );

    const previous = screen.getByRole('button', {
        name: 'Imagen anterior',
    });
    const next = screen.getByRole('button', { name: 'Imagen siguiente' });

    expect(previous.getAttribute('aria-disabled')).toBe('true');
    expect(next.getAttribute('aria-disabled')).toBe('false');
    expect(screen.getByText('Imagen 1 de 2').getAttribute('aria-live')).toBe(
        'polite',
    );

    next.focus();
    fireEvent.click(next);

    expect(document.activeElement).toBe(next);
    expect(next.getAttribute('aria-disabled')).toBe('true');
    expect(previous.getAttribute('aria-disabled')).toBe('false');
    expect(screen.getByText('Imagen 2 de 2')).toBeTruthy();
    expect(
        screen.getByRole('img', { name: 'Segundo plato del carrusel' }),
    ).toBeTruthy();

    previous.focus();
    fireEvent.click(previous);

    expect(document.activeElement).toBe(previous);
    expect(previous.getAttribute('aria-disabled')).toBe('true');
    expect(screen.getByText('Imagen 1 de 2')).toBeTruthy();
});

test('omite controles de carrusel cuando solo existe una imagen', () => {
    render(
        <PublicationCard
            engagement={publication.initialEngagement}
            isAuthenticated
            loginHref="/login"
            onAction={vi.fn()}
            publication={{ ...publication, images: [publication.images[0]] }}
        />,
    );

    expect(
        screen.queryByRole('button', { name: 'Imagen anterior' }),
    ).toBeNull();
    expect(
        screen.queryByRole('button', { name: 'Imagen siguiente' }),
    ).toBeNull();
});

test('muestra el estado vacío reutilizable del feed', () => {
    render(
        <SocialFeed
            engagement={{}}
            isAuthenticated
            loginHref="/login"
            onAction={vi.fn()}
            publications={[]}
        />,
    );

    expect(screen.getByRole('status').textContent).toContain(
        'Todavía no hay publicaciones aquí',
    );
});
