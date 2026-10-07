import type { AuthenticatedPageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import type { PropsWithChildren, ReactNode } from 'react';
import styles from './AuthenticatedLayout.module.css';

export default function AuthenticatedLayout({
    children,
    header,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage<AuthenticatedPageProps>().props.auth.user;

    return (
        <div className={styles.page}>
            <header className={styles.topbar}>
                <Link className={styles.brand} href="/">
                    <span aria-hidden="true">R</span>
                    Recetaria
                </Link>
                <nav
                    aria-label="Navegación principal"
                    className={styles.navigation}
                >
                    <Link href={route('dashboard')}>Inicio</Link>
                    <Link href={route('profile.edit')}>Perfil</Link>
                    <Link as="button" href={route('logout')} method="post">
                        Salir
                    </Link>
                </nav>
            </header>
            <main className={styles.content}>
                {header}
                <p className={styles.greeting}>
                    Sesión iniciada como {user.name}
                </p>
                {children}
            </main>
        </div>
    );
}
