import CreatePrototype from '@/Components/Home/CreatePrototype/CreatePrototype';
import {
    createInitialEngagement,
    explorePublications,
    guestPublications,
    homePublications,
    invitationPreview,
    profilePreview,
} from '@/Components/Home/data/prototypeData';
import GuestHome from '@/Components/Home/GuestHome/GuestHome';
import HomeHeader from '@/Components/Home/HomeHeader/HomeHeader';
import InvitationsPrototype from '@/Components/Home/InvitationsPrototype/InvitationsPrototype';
import MemberHome from '@/Components/Home/MemberHome/MemberHome';
import ProfilePrototype from '@/Components/Home/ProfilePrototype/ProfilePrototype';
import type { FeedMode, PrototypeView } from '@/Components/Home/types/home';
import type { SocialAction } from '@/Components/SocialFeed/types/socialFeed';
import type { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import styles from './Home.module.css';

interface HomeProps {
    canLogin: boolean;
    canRegister: boolean;
}

export default function Home({ canLogin, canRegister }: HomeProps) {
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

    function openPrototypeView(
        view: Exclude<PrototypeView, 'feed'>,
        origin: HTMLButtonElement,
    ) {
        navigationOriginRef.current = origin;
        setActiveView(view);
    }

    function returnToFeed() {
        setRestoreNavigationFocus(true);
        setActiveView('feed');
    }

    function handleSocialAction(publicationId: number, action: SocialAction) {
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
    }

    const activePublications =
        feedMode === 'home' ? homePublications : explorePublications;

    return (
        <div className={styles.page}>
            <Head title="Inicio" />
            <HomeHeader
                canLogin={canLogin}
                canRegister={canRegister}
                isAuthenticated={isAuthenticated}
                onOpenPrototype={openPrototypeView}
            />

            <main className={styles.main}>
                {!isAuthenticated ? (
                    <GuestHome
                        canLogin={canLogin}
                        canRegister={canRegister}
                        engagement={engagement}
                        loginHref={route('login')}
                        onAction={handleSocialAction}
                        publications={guestPublications}
                    />
                ) : (
                    <>
                        <MemberHome
                            engagement={engagement}
                            feedMode={feedMode}
                            hidden={activeView !== 'feed'}
                            loginHref={route('login')}
                            onAction={handleSocialAction}
                            onFeedModeChange={setFeedMode}
                            publications={activePublications}
                            userName={user.name}
                        />
                        {activeView === 'create' && (
                            <CreatePrototype
                                headingRef={panelHeadingRef}
                                onBack={returnToFeed}
                            />
                        )}
                        {activeView === 'invitations' && (
                            <InvitationsPrototype
                                author={invitationPreview.author}
                                headingRef={panelHeadingRef}
                                onBack={returnToFeed}
                                recipe={invitationPreview.recipe}
                            />
                        )}
                        {activeView === 'profile' && (
                            <ProfilePrototype
                                bio={profilePreview.bio}
                                headingRef={panelHeadingRef}
                                name={user.name}
                                onBack={returnToFeed}
                                publicationCount={
                                    profilePreview.publicationCount
                                }
                                recipeCount={profilePreview.recipeCount}
                                username={profilePreview.username}
                            />
                        )}
                    </>
                )}
            </main>

            <footer className={styles.footer}>
                <span>Recetaria · prototipo visual</span>
                <span>Hecho para cocinar y compartir</span>
            </footer>
        </div>
    );
}
