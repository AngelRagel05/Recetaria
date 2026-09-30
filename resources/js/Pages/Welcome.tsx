import { Head, Link } from '@inertiajs/react';
import styles from './Welcome.module.css';

export default function Welcome({
    canLogin,
    canRegister,
}: {
    canLogin: boolean;
    canRegister: boolean;
}) {
    return (
        <main className={styles.page}>
            <Head title="Inicio" />
            <div className={styles.content}>
                <p className={styles.eyebrow}>Bienvenido a Recetaria</p>
                <h1>Un lugar para descubrir y compartir recetas.</h1>
                <p>Estamos preparando la base de la aplicación.</p>
                <nav aria-label="Acceso" className={styles.actions}>
                    {canLogin && (
                        <Link href={route('login')}>Iniciar sesión</Link>
                    )}
                    {canRegister && (
                        <Link href={route('register')}>Crear cuenta</Link>
                    )}
                </nav>
            </div>
        </main>
    );
}
