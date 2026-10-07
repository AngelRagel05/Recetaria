import FormField from '@/Components/FormField/FormField';
import type { AuthenticatedPageProps } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';
import styles from './UpdateProfileInformationForm.module.css';

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
            bio: user.bio ?? '',
        });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        patch(route('profile.update'));
    }

    return (
        <section className={styles.section}>
            <h2>Datos de la cuenta</h2>
            <p className={styles.description}>
                Actualiza tu nombre, correo electrónico y biografía.
            </p>
            <form className={styles.form} onSubmit={submit}>
                <FormField
                    autoComplete="username"
                    id="username"
                    label="Nombre de usuario"
                    name="username"
                    readOnly
                    value={user.username}
                />
                <p className={styles.hint}>
                    El nombre de usuario no se puede cambiar.
                </p>
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
                    autoComplete="email"
                    error={errors.email}
                    id="email"
                    label="Correo electrónico"
                    onChange={(event) => setData('email', event.target.value)}
                    required
                    type="email"
                    value={data.email}
                />
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="bio">
                        Biografía
                    </label>
                    <textarea
                        aria-describedby={errors.bio ? 'bio-error' : 'bio-help'}
                        aria-invalid={Boolean(errors.bio)}
                        className={styles.textarea}
                        id="bio"
                        maxLength={500}
                        name="bio"
                        onChange={(event) => setData('bio', event.target.value)}
                        rows={5}
                        value={data.bio}
                    />
                    <p className={styles.hint} id="bio-help">
                        Máximo 500 caracteres.
                    </p>
                    {errors.bio && (
                        <p className={styles.error} id="bio-error" role="alert">
                            {errors.bio}
                        </p>
                    )}
                </div>
                {mustVerifyEmail && !user.email_verified_at && (
                    <p className={styles.verification}>
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
                    <p className={styles.status} role="status">
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
                        <span className={styles.status} role="status">
                            Guardado.
                        </span>
                    )}
                </div>
            </form>
        </section>
    );
}
