import type { FeedMode } from '@/Components/Home/types/home';
import SocialFeed from '@/Components/SocialFeed/SocialFeed/SocialFeed';
import type {
    PublicationEngagement,
    PublicationPresentation,
    SocialAction,
} from '@/Components/SocialFeed/types/socialFeed';
import styles from './MemberHome.module.css';

interface MemberHomeProps {
    engagement: Record<number, PublicationEngagement>;
    feedMode: FeedMode;
    hidden: boolean;
    loginHref: string;
    onAction: (publicationId: number, action: SocialAction) => void;
    onFeedModeChange: (mode: FeedMode) => void;
    publications: PublicationPresentation[];
    userName: string;
}

export default function MemberHome({
    engagement,
    feedMode,
    hidden,
    loginHref,
    onAction,
    onFeedModeChange,
    publications,
    userName,
}: MemberHomeProps) {
    return (
        <section
            aria-labelledby={feedMode === 'home' ? 'home-tab' : 'explore-tab'}
            className={styles.feedPanel}
            hidden={hidden}
            id="feed-panel"
            role="tabpanel"
        >
            <div className={styles.heading}>
                <div>
                    <p className={styles.eyebrow}>Hola, {userName}</p>
                    <h1 id="member-feed-heading">¿Qué se está cocinando?</h1>
                </div>
                <div
                    aria-label="Feed de publicaciones"
                    className={styles.tabs}
                    role="tablist"
                >
                    <button
                        aria-controls="feed-panel"
                        aria-selected={feedMode === 'home'}
                        className={
                            feedMode === 'home' ? styles.activeTab : undefined
                        }
                        id="home-tab"
                        onClick={() => onFeedModeChange('home')}
                        role="tab"
                        type="button"
                    >
                        Inicio
                    </button>
                    <button
                        aria-controls="feed-panel"
                        aria-selected={feedMode === 'explore'}
                        className={
                            feedMode === 'explore'
                                ? styles.activeTab
                                : undefined
                        }
                        id="explore-tab"
                        onClick={() => onFeedModeChange('explore')}
                        role="tab"
                        type="button"
                    >
                        Explorar
                    </button>
                </div>
            </div>

            <div className={styles.grid}>
                <div className={styles.feedColumn}>
                    <SocialFeed
                        engagement={engagement}
                        isAuthenticated
                        loginHref={loginHref}
                        onAction={onAction}
                        publications={publications}
                    />
                </div>
                <aside className={styles.sideRail}>
                    <p className={styles.eyebrow}>Tu espacio</p>
                    <h2>Todo listo para compartir.</h2>
                    <p>
                        Este prototipo conserva tus cambios mientras visitas las
                        vistas de creación, invitaciones y perfil.
                    </p>
                    <span className={styles.localBadge}>
                        Interacciones solo locales
                    </span>
                </aside>
            </div>
        </section>
    );
}
