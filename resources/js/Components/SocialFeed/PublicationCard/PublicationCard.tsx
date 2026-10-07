import PublicationAction from '@/Components/SocialFeed/PublicationAction/PublicationAction';
import PublicationCarousel from '@/Components/SocialFeed/PublicationCarousel/PublicationCarousel';
import type {
    PublicationEngagement,
    PublicationPresentation,
    SocialAction,
} from '@/Components/SocialFeed/types/socialFeed';
import styles from './PublicationCard.module.css';

interface PublicationCardProps {
    publication: PublicationPresentation;
    engagement: PublicationEngagement;
    isAuthenticated: boolean;
    loginHref: string;
    onAction: (publicationId: number, action: SocialAction) => void;
}

export default function PublicationCard({
    publication,
    engagement,
    isAuthenticated,
    loginHref,
    onAction,
}: PublicationCardProps) {
    const likeCount =
        publication.likeCount +
        Number(engagement.liked) -
        Number(publication.initialEngagement.liked);

    return (
        <article
            aria-label={`Publicación de ${publication.author.name}`}
            className={styles.card}
        >
            <header className={styles.header}>
                <span
                    aria-hidden="true"
                    className={styles.avatar}
                    style={{ backgroundColor: publication.author.accent }}
                >
                    {publication.author.initials}
                </span>
                <div className={styles.author}>
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

            <PublicationCarousel images={publication.images} />

            <div className={styles.body}>
                {publication.caption && (
                    <p className={styles.caption}>{publication.caption}</p>
                )}

                <section aria-label="Receta enlazada" className={styles.recipe}>
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
                    <PublicationAction
                        active={engagement.liked}
                        authenticated={isAuthenticated}
                        loginHref={loginHref}
                        onClick={() => onAction(publication.id, 'like')}
                        requireAccountLabel={`Inicia sesión para indicar que te gusta la publicación de ${publication.author.name}`}
                    >
                        {engagement.liked ? '♥' : '♡'} {likeCount}
                    </PublicationAction>
                    <PublicationAction
                        active={engagement.commentsOpen}
                        authenticated={isAuthenticated}
                        loginHref={loginHref}
                        onClick={() => onAction(publication.id, 'comment')}
                        requireAccountLabel={`Inicia sesión para comentar la publicación de ${publication.author.name}`}
                    >
                        Comentar · {publication.commentCount}
                    </PublicationAction>
                    <PublicationAction
                        active={engagement.saved}
                        authenticated={isAuthenticated}
                        loginHref={loginHref}
                        onClick={() => onAction(publication.id, 'save')}
                        requireAccountLabel={`Inicia sesión para guardar la publicación de ${publication.author.name}`}
                    >
                        {engagement.saved ? 'Guardada' : 'Guardar'}
                    </PublicationAction>
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
