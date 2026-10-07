import type { PrototypeView } from '@/Components/Home/types/home';
import { Link } from '@inertiajs/react';
import styles from './HomeHeader.module.css';

interface HomeHeaderProps {
    canLogin: boolean;
    canRegister: boolean;
    isAuthenticated: boolean;
    onOpenPrototype: (
        view: Exclude<PrototypeView, 'feed'>,
        origin: HTMLButtonElement,
    ) => void;
}

export default function HomeHeader({
    canLogin,
    canRegister,
    isAuthenticated,
    onOpenPrototype,
}: HomeHeaderProps) {
    return (
        <header className={styles.topbar}>
            <Link aria-current="page" className={styles.brand} href="/">
                <span aria-hidden="true" className={styles.brandMark}>
                    R
                </span>
                <span className={styles.brandText}>Recetaria</span>
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
                            onOpenPrototype('create', event.currentTarget)
                        }
                        type="button"
                    >
                        Crear
                    </button>
                    <button
                        onClick={(event) =>
                            onOpenPrototype('invitations', event.currentTarget)
                        }
                        type="button"
                    >
                        Invitaciones
                    </button>
                    <button
                        onClick={(event) =>
                            onOpenPrototype('profile', event.currentTarget)
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
    );
}
