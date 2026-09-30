import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import styles from './Auth.module.css';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        post(route('verification.send'));
    }

    return (
        <GuestLayout>
            <Head title="Verificar correo" />
            <h1 className={styles.title}>Verificar correo</h1>
            <p className={styles.description}>
                Revisa el enlace que te hemos enviado por correo antes de
                continuar.
            </p>
            {status === 'verification-link-sent' && (
                <p className={styles.status}>
                    Te hemos enviado un enlace nuevo.
                </p>
            )}
            <form className={styles.form} onSubmit={submit}>
                <div className={styles.actions}>
                    <button
                        className={styles.button}
                        disabled={processing}
                        type="submit"
                    >
                        Reenviar enlace
                    </button>
                    <Link as="button" href={route('logout')} method="post">
                        Cerrar sesión
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
