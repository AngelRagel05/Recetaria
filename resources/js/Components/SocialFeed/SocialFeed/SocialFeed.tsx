import PublicationCard from '@/Components/SocialFeed/PublicationCard/PublicationCard';
import type {
    PublicationEngagement,
    PublicationPresentation,
    SocialAction,
} from '@/Components/SocialFeed/types/socialFeed';
import styles from './SocialFeed.module.css';

interface SocialFeedProps {
    engagement: Record<number, PublicationEngagement>;
    isAuthenticated: boolean;
    loginHref: string;
    onAction: (publicationId: number, action: SocialAction) => void;
    publications: PublicationPresentation[];
}

export default function SocialFeed({
    engagement,
    isAuthenticated,
    loginHref,
    onAction,
    publications,
}: SocialFeedProps) {
    if (publications.length === 0) {
        return (
            <section className={styles.emptyState} role="status">
                <span aria-hidden="true">✦</span>
                <h2>Todavía no hay publicaciones aquí</h2>
                <p>
                    Cuando haya algo nuevo, aparecerá en este espacio sin que
                    pierdas la navegación principal.
                </p>
            </section>
        );
    }

    return (
        <section aria-label="Publicaciones" className={styles.feed}>
            {publications.map((publication) => (
                <PublicationCard
                    engagement={
                        engagement[publication.id] ??
                        publication.initialEngagement
                    }
                    isAuthenticated={isAuthenticated}
                    key={publication.id}
                    loginHref={loginHref}
                    onAction={onAction}
                    publication={publication}
                />
            ))}
        </section>
    );
}
