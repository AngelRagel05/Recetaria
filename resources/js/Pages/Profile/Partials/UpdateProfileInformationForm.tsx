import FormField from '@/Components/FormField';
import type { AuthenticatedPageProps } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';
import styles from '../Profile.module.css';

export default function UpdateProfileInformationForm({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const user = usePage<AuthenticatedPageProps>().props.auth.user;
    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        patch(route('profile.update'));
    }

    return (
        <section className={styles.section}>
            <h2>Datos de la cuenta</h2>
            <p>Actualiza tu nombre y correo electrónico.</p>
            <form className={styles.form} onSubmit={submit}>
                <FormField
                    autoComplete="name"
                    error={errors.name}
                    id="name"
                    label="Nombre"
                    onChange={(event) => setData('name', event.target.value)}
                    required
                    value={data.name}
                />
                <FormField
                    autoComplete="username"
                    error={errors.email}
                    id="email"
                    label="Correo electrónico"
                    onChange={(event) => setData('email', event.target.value)}
                    required
                    type="email"
                    value={data.email}
                />
                {mustVerifyEmail && !user.email_verified_at && (
                    <p>
                        Tu correo no está verificado.{' '}
                        <Link
                            as="button"
                            href={route('verification.send')}
                            method="post"
                        >
                            Reenviar enlace de verificación
                        </Link>
                    </p>
                )}
                {status === 'verification-link-sent' && (
                    <p className={styles.status}>
                        Te hemos enviado un enlace nuevo.
                    </p>
                )}
                <div className={styles.actions}>
                    <button
                        className={styles.button}
                        disabled={processing}
                        type="submit"
                    >
                        Guardar
                    </button>
                    {recentlySuccessful && (
                        <span className={styles.status}>Guardado.</span>
                    )}
                </div>
            </form>
        </section>
    );
}
