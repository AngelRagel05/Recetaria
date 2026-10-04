import { useState } from 'react';
import type { ReactNode } from 'react';
import type {
    PublicationEngagement,
    PublicationPresentation,
    SocialAction,
} from './types';
import styles from './SocialFeed.module.css';

interface PublicationCardProps {
    publication: PublicationPresentation;
    engagement: PublicationEngagement;
    isAuthenticated: boolean;
    loginHref: string;
    onAction: (publicationId: number, action: SocialAction) => void;
}

interface ActionControlProps {
    active: boolean;
    authenticated: boolean;
    children: ReactNode;
    loginHref: string;
    onClick: () => void;
    requireAccountLabel: string;
}

function ActionControl({
    active,
    authenticated,
    children,
    loginHref,
    onClick,
    requireAccountLabel,
}: ActionControlProps) {
    const className = active
        ? `${styles.action} ${styles.actionActive}`
        : styles.action;

    if (!authenticated) {
        return (
            <a
                aria-label={requireAccountLabel}
                className={className}
                href={loginHref}
            >
                {children}
            </a>
        );
    }

    return (
        <button
            aria-pressed={active}
            className={className}
            onClick={onClick}
            type="button"
        >
            {children}
        </button>
    );
}

export default function PublicationCard({
    publication,
    engagement,
    isAuthenticated,
    loginHref,
    onAction,
}: PublicationCardProps) {
    const [imageIndex, setImageIndex] = useState(0);
    const image = publication.images[imageIndex];
    const hasCarousel = publication.images.length > 1;
    const likeCount =
        publication.likeCount +
        Number(engagement.liked) -
        Number(publication.initialEngagement.liked);

    return (
        <article
            aria-label={`Publicación de ${publication.author.name}`}
            className={styles.card}
        >
            <header className={styles.cardHeader}>
                <span
                    aria-hidden="true"
                    className={styles.avatar}
                    style={{ backgroundColor: publication.author.accent }}
                >
                    {publication.author.initials}
                </span>
                <div className={styles.authorBlock}>
                    <strong>{publication.author.name}</strong>
                    <span>
                        @{publication.author.username} ·{' '}
                        {publication.publishedLabel}
                    </span>
                </div>
                <button
                    aria-label={`Más opciones para la publicación de ${publication.author.name}`}
                    className={styles.moreButton}
                    disabled
                    title="Disponible próximamente"
                    type="button"
                >
                    ···
                </button>
            </header>

            <figure className={styles.media}>
                <img src={image.src} alt={image.alt} />
                {hasCarousel && (
                    <>
                        <button
                            aria-disabled={imageIndex === 0}
                            aria-label="Imagen anterior"
                            className={`${styles.carouselButton} ${styles.carouselPrevious}`}
                            onClick={() => {
                                if (imageIndex > 0) {
                                    setImageIndex((current) => current - 1);
                                }
                            }}
                            type="button"
                        >
                            ←
                        </button>
                        <button
                            aria-disabled={
                                imageIndex === publication.images.length - 1
                            }
                            aria-label="Imagen siguiente"
                            className={`${styles.carouselButton} ${styles.carouselNext}`}
                            onClick={() => {
                                if (
                                    imageIndex <
                                    publication.images.length - 1
                                ) {
                                    setImageIndex((current) => current + 1);
                                }
                            }}
                            type="button"
                        >
                            →
                        </button>
                        <span
                            className={styles.imagePosition}
                            aria-hidden="true"
                        >
                            {imageIndex + 1} / {publication.images.length}
                        </span>
                        <span
                            aria-live="polite"
                            className={styles.visuallyHidden}
                        >
                            Imagen {imageIndex + 1} de{' '}
                            {publication.images.length}
                        </span>
                    </>
                )}
            </figure>

            <div className={styles.cardBody}>
                {publication.caption && (
                    <p className={styles.caption}>{publication.caption}</p>
                )}

                <section
                    aria-label="Receta enlazada"
                    className={styles.recipeReference}
                >
                    <span aria-hidden="true" className={styles.recipeIcon}>
                        ◇
                    </span>
                    <div>
                        <span className={styles.recipeEyebrow}>
                            Receta enlazada
                        </span>
                        <strong>{publication.recipe.title}</strong>
                        <span>
                            Por {publication.recipe.author} ·{' '}
                            {publication.recipe.time}
                        </span>
                    </div>
                </section>

                <div
                    aria-label="Acciones de la publicación"
                    className={styles.actions}
                    role="group"
                >
                    <ActionControl
                        active={engagement.liked}
                        authenticated={isAuthenticated}
                        loginHref={loginHref}
                        onClick={() => onAction(publication.id, 'like')}
                        requireAccountLabel={`Inicia sesión para indicar que te gusta la publicación de ${publication.author.name}`}
                    >
                        {engagement.liked ? '♥' : '♡'} {likeCount}
                    </ActionControl>
                    <ActionControl
                        active={engagement.commentsOpen}
                        authenticated={isAuthenticated}
                        loginHref={loginHref}
                        onClick={() => onAction(publication.id, 'comment')}
                        requireAccountLabel={`Inicia sesión para comentar la publicación de ${publication.author.name}`}
                    >
                        Comentar · {publication.commentCount}
                    </ActionControl>
                    <ActionControl
                        active={engagement.saved}
                        authenticated={isAuthenticated}
                        loginHref={loginHref}
                        onClick={() => onAction(publication.id, 'save')}
                        requireAccountLabel={`Inicia sesión para guardar la publicación de ${publication.author.name}`}
                    >
                        {engagement.saved ? 'Guardada' : 'Guardar'}
                    </ActionControl>
                </div>

                {engagement.commentsOpen && (
                    <p className={styles.commentPreview} role="status">
                        Vista previa de comentarios abierta. Las conversaciones
                        reales llegarán en una fase posterior.
                    </p>
                )}
            </div>
        </article>
    );
}
