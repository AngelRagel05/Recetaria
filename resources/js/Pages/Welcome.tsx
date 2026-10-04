import SocialFeed from '@/Components/SocialFeed/SocialFeed';
import type { SocialAction } from '@/Components/SocialFeed/types';
import type { PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import {
    createInitialEngagement,
    explorePublications,
    guestPublications,
    homePublications,
    invitationPreview,
    profilePreview,
} from './Welcome.fixtures';
import styles from './Welcome.module.css';

type FeedMode = 'home' | 'explore';
type PrototypeView = 'feed' | 'create' | 'invitations' | 'profile';

interface PrototypePanelProps {
    children: ReactNode;
    eyebrow: string;
    headingRef: RefObject<HTMLHeadingElement | null>;
    onBack: () => void;
    title: string;
}

function PrototypePanel({
    children,
    eyebrow,
    headingRef,
    onBack,
    title,
}: PrototypePanelProps) {
    return (
        <section className={styles.prototypePanel}>
            <button
                className={styles.backButton}
                onClick={onBack}
                type="button"
            >
                ← Volver al feed
            </button>
            <p className={styles.eyebrow}>{eyebrow}</p>
            <h1 ref={headingRef} tabIndex={-1}>
                {title}
            </h1>
            <p className={styles.prototypeNote}>
                Vista del prototipo · no envía ni guarda información.
            </p>
            {children}
        </section>
    );
}

export default function Welcome({
    canLogin,
    canRegister,
}: {
    canLogin: boolean;
    canRegister: boolean;
}) {
    const user = usePage<PageProps>().props.auth.user;
    const isAuthenticated = user !== null;
    const [feedMode, setFeedMode] = useState<FeedMode>('home');
    const [activeView, setActiveView] = useState<PrototypeView>('feed');
    const [engagement, setEngagement] = useState(createInitialEngagement);
    const [restoreNavigationFocus, setRestoreNavigationFocus] = useState(false);
    const panelHeadingRef = useRef<HTMLHeadingElement>(null);
    const navigationOriginRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (activeView !== 'feed') {
            panelHeadingRef.current?.focus();
            return;
        }

        if (restoreNavigationFocus) {
            navigationOriginRef.current?.focus();
            setRestoreNavigationFocus(false);
        }
    }, [activeView, restoreNavigationFocus]);

    const openPrototypeView = (
        view: Exclude<PrototypeView, 'feed'>,
        origin: HTMLButtonElement,
    ) => {
        navigationOriginRef.current = origin;
        setActiveView(view);
    };

    const returnToFeed = () => {
        setRestoreNavigationFocus(true);
        setActiveView('feed');
    };

    const handleSocialAction = (
        publicationId: number,
        action: SocialAction,
    ) => {
        if (!isAuthenticated) {
            return;
        }

        setEngagement((current) => {
            const publicationEngagement = current[publicationId];

            if (!publicationEngagement) {
                return current;
            }

            const key =
                action === 'like'
                    ? 'liked'
                    : action === 'comment'
                      ? 'commentsOpen'
                      : 'saved';

            return {
                ...current,
                [publicationId]: {
                    ...publicationEngagement,
                    [key]: !publicationEngagement[key],
                },
            };
        });
    };

    const activePublications =
        feedMode === 'home' ? homePublications : explorePublications;

    return (
        <div className={styles.page}>
            <Head title="Inicio" />
            <header className={styles.topbar}>
                <Link aria-current="page" className={styles.brand} href="/">
                    <span aria-hidden="true">R</span>
                    Recetaria
                </Link>

                {!isAuthenticated ? (
                    <nav aria-label="Acceso" className={styles.guestNav}>
                        {canLogin && (
                            <Link href={route('login')}>Iniciar sesión</Link>
                        )}
                        {canRegister && (
                            <Link
                                className={styles.primaryLink}
                                href={route('register')}
                            >
                                Crear cuenta
                            </Link>
                        )}
                    </nav>
                ) : (
                    <nav
                        aria-label="Navegación principal"
                        className={styles.memberNav}
                    >
                        <button
                            onClick={(event) =>
                                openPrototypeView('create', event.currentTarget)
                            }
                            type="button"
                        >
                            Crear
                        </button>
                        <button
                            onClick={(event) =>
                                openPrototypeView(
                                    'invitations',
                                    event.currentTarget,
                                )
                            }
                            type="button"
                        >
                            Invitaciones
                        </button>
                        <button
                            onClick={(event) =>
                                openPrototypeView(
                                    'profile',
                                    event.currentTarget,
                                )
                            }
                            type="button"
                        >
                            Perfil
                        </button>
                        <Link as="button" href={route('logout')} method="post">
                            Salir
                        </Link>
                    </nav>
                )}
            </header>

            {!isAuthenticated ? (
                <main className={styles.main}>
                    <section className={styles.hero}>
                        <p className={styles.eyebrow}>
                            Cocinar también es compartir
                        </p>
                        <h1>Recetas con historia, creadas por su comunidad.</h1>
                        <p>
                            Descubre qué se está cocinando, guarda ideas y
                            encuentra la receta detrás de cada publicación.
                        </p>
                    </section>

                    <div className={styles.contentGrid}>
                        <div className={styles.feedColumn}>
                            <SocialFeed
                                engagement={engagement}
                                isAuthenticated={false}
                                loginHref={route('login')}
                                onAction={handleSocialAction}
                                publications={guestPublications}
                            />

                            <section className={styles.guestCta}>
                                <p className={styles.eyebrow}>
                                    Sigue descubriendo
                                </p>
                                <h2>Tu mesa tiene sitio en Recetaria.</h2>
                                <p>
                                    Crea una cuenta para ver más publicaciones,
                                    guardar recetas y participar en la
                                    conversación.
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
                                Cada publicación mantiene visible quién creó la
                                receta y cuánto tiempo necesitas para
                                prepararla.
                            </p>
                            <ol>
                                <li>Descubre platos de otras cocinas.</li>
                                <li>Consulta la receta enlazada.</li>
                                <li>Guarda lo que quieras cocinar después.</li>
                            </ol>
                        </aside>
                    </div>
                </main>
            ) : (
                <main className={styles.main}>
                    <section
                        aria-labelledby={
                            feedMode === 'home' ? 'home-tab' : 'explore-tab'
                        }
                        className={styles.memberFeed}
                        hidden={activeView !== 'feed'}
                        id="feed-panel"
                        role="tabpanel"
                    >
                        <div className={styles.memberHeading}>
                            <div>
                                <p className={styles.eyebrow}>
                                    Hola, {user.name}
                                </p>
                                <h1 id="member-feed-heading">
                                    ¿Qué se está cocinando?
                                </h1>
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
                                        feedMode === 'home'
                                            ? styles.activeTab
                                            : undefined
                                    }
                                    id="home-tab"
                                    onClick={() => setFeedMode('home')}
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
                                    onClick={() => setFeedMode('explore')}
                                    role="tab"
                                    type="button"
                                >
                                    Explorar
                                </button>
                            </div>
                        </div>

                        <div className={styles.memberGrid}>
                            <div className={styles.feedColumn}>
                                <SocialFeed
                                    engagement={engagement}
                                    isAuthenticated
                                    loginHref={route('login')}
                                    onAction={handleSocialAction}
                                    publications={activePublications}
                                />
                            </div>
                            <aside className={styles.sideRail}>
                                <p className={styles.eyebrow}>Tu espacio</p>
                                <h2>Todo listo para compartir.</h2>
                                <p>
                                    Este prototipo conserva tus cambios mientras
                                    visitas las vistas de creación, invitaciones
                                    y perfil.
                                </p>
                                <span className={styles.localBadge}>
                                    Interacciones solo locales
                                </span>
                            </aside>
                        </div>
                    </section>

                    {activeView === 'create' && (
                        <PrototypePanel
                            eyebrow="Crear"
                            headingRef={panelHeadingRef}
                            onBack={returnToFeed}
                            title="¿Qué quieres compartir?"
                        >
                            <div className={styles.prototypeChoices}>
                                <article>
                                    <span aria-hidden="true">◇</span>
                                    <h2>Nueva receta</h2>
                                    <p>
                                        Organiza ingredientes, pasos y detalles
                                        culinarios.
                                    </p>
                                    <button disabled type="button">
                                        Empezar receta
                                    </button>
                                </article>
                                <article>
                                    <span aria-hidden="true">▣</span>
                                    <h2>Nueva publicación</h2>
                                    <p>
                                        Comparte imágenes y enlaza la receta que
                                        las inspira.
                                    </p>
                                    <button disabled type="button">
                                        Empezar publicación
                                    </button>
                                </article>
                            </div>
                        </PrototypePanel>
                    )}

                    {activeView === 'invitations' && (
                        <PrototypePanel
                            eyebrow="Colaboraciones"
                            headingRef={panelHeadingRef}
                            onBack={returnToFeed}
                            title="Invitaciones pendientes"
                        >
                            <article className={styles.invitationCard}>
                                <span
                                    aria-hidden="true"
                                    className={styles.previewAvatar}
                                >
                                    NV
                                </span>
                                <div>
                                    <h2>{invitationPreview.recipe}</h2>
                                    <p>
                                        {invitationPreview.author} quiere
                                        escribir esta receta contigo.
                                    </p>
                                </div>
                                <div className={styles.invitationActions}>
                                    <button disabled type="button">
                                        Aceptar
                                    </button>
                                    <button disabled type="button">
                                        Rechazar
                                    </button>
                                </div>
                            </article>
                        </PrototypePanel>
                    )}

                    {activeView === 'profile' && (
                        <PrototypePanel
                            eyebrow="Perfil"
                            headingRef={panelHeadingRef}
                            onBack={returnToFeed}
                            title={user.name}
                        >
                            <div className={styles.profilePreview}>
                                <span
                                    aria-hidden="true"
                                    className={styles.profileAvatar}
                                >
                                    {user.name
                                        .split(' ')
                                        .slice(0, 2)
                                        .map((part) => part[0])
                                        .join('')
                                        .toUpperCase()}
                                </span>
                                <div>
                                    <p>@{profilePreview.username}</p>
                                    <p>{profilePreview.bio}</p>
                                    <dl>
                                        <div>
                                            <dt>Recetas</dt>
                                            <dd>
                                                {profilePreview.recipeCount}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt>Publicaciones</dt>
                                            <dd>
                                                {
                                                    profilePreview.publicationCount
                                                }
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </PrototypePanel>
                    )}
                </main>
            )}

            <footer className={styles.footer}>
                <span>Recetaria · prototipo visual</span>
                <span>Hecho para cocinar y compartir</span>
            </footer>
        </div>
    );
}
