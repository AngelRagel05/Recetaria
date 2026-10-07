import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import styles from './GuestLayout.module.css';

export default function GuestLayout({ children }: PropsWithChildren) {
    return (
        <main className={styles.page}>
            <Link className={styles.brand} href="/">
                <span aria-hidden="true">R</span>
                Recetaria
            </Link>
            <div className={styles.card}>{children}</div>
        </main>
    );
}
