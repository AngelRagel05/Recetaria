import SocialFeed from '@/Components/SocialFeed/SocialFeed/SocialFeed';
import type {
    PublicationEngagement,
    PublicationPresentation,
    SocialAction,
} from '@/Components/SocialFeed/types/socialFeed';
import { Link } from '@inertiajs/react';
import styles from './GuestHome.module.css';

interface GuestHomeProps {
    canLogin: boolean;
    canRegister: boolean;
    engagement: Record<number, PublicationEngagement>;
    loginHref: string;
    onAction: (publicationId: number, action: SocialAction) => void;
    publications: PublicationPresentation[];
}

export default function GuestHome({
    canLogin,
    canRegister,
    engagement,
    loginHref,
    onAction,
    publications,
}: GuestHomeProps) {
    return (
        <>
            <section className={styles.hero}>
                <p className={styles.eyebrow}>Cocinar también es compartir</p>
                <h1>Recetas con historia, creadas por su comunidad.</h1>
                <p>
                    Descubre qué se está cocinando, guarda ideas y encuentra la
                    receta detrás de cada publicación.
                </p>
            </section>

            <div className={styles.contentGrid}>
                <div className={styles.feedColumn}>
                    <SocialFeed
                        engagement={engagement}
                        isAuthenticated={false}
                        loginHref={loginHref}
                        onAction={onAction}
                        publications={publications}
                    />

                    <section className={styles.guestCta}>
                        <p className={styles.eyebrow}>Sigue descubriendo</p>
                        <h2>Tu mesa tiene sitio en Recetaria.</h2>
                        <p>
                            Crea una cuenta para ver más publicaciones, guardar
                            recetas y participar en la conversación.
                        </p>
                        <div className={styles.ctaActions}>
                            {canRegister && (
                                <Link
                                    className={styles.primaryLink}
                                    href={route('register')}
                                >
                                    Crear cuenta
                                </Link>
                            )}
                            {canLogin && (
                                <Link href={route('login')}>
                                    Ya tengo cuenta
                                </Link>
                            )}
                        </div>
                    </section>
                </div>

                <aside className={styles.sideRail}>
                    <p className={styles.eyebrow}>En Recetaria</p>
                    <h2>De la inspiración a la receta.</h2>
                    <p>
                        Cada publicación mantiene visible quién creó la receta y
                        cuánto tiempo necesitas para prepararla.
                    </p>
                    <ol>
                        <li>Descubre platos de otras cocinas.</li>
                        <li>Consulta la receta enlazada.</li>
                        <li>Guarda lo que quieras cocinar después.</li>
                    </ol>
                </aside>
            </div>
        </>
    );
}
