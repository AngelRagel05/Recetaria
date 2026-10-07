import FormField from '@/Components/FormField/FormField';
import GuestLayout from '@/Layouts/GuestLayout/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import styles from './ForgotPassword.module.css';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        post(route('password.email'));
    }

    return (
        <GuestLayout>
            <Head title="Recuperar contraseña" />
            <h1 className={styles.title}>Recuperar contraseña</h1>
            <p className={styles.description}>
                Escribe tu correo y te enviaremos un enlace para elegir una
                nueva contraseña.
            </p>
            {status && (
                <p className={styles.status} role="status">
                    {status}
                </p>
            )}
            <form className={styles.form} onSubmit={submit}>
                <FormField
                    autoFocus
                    error={errors.email}
                    id="email"
                    label="Correo electrónico"
                    name="email"
                    onChange={(event) => setData('email', event.target.value)}
                    required
                    type="email"
                    value={data.email}
                />
                <button
                    className={styles.button}
                    disabled={processing}
                    type="submit"
                >
                    Enviar enlace
                </button>
            </form>
        </GuestLayout>
    );
}
