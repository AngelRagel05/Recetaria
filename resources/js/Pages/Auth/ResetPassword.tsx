import FormField from '@/Components/FormField';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import styles from './Auth.module.css';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    }

    return (
        <GuestLayout>
            <Head title="Nueva contraseña" />
            <h1 className={styles.title}>Nueva contraseña</h1>
            <form className={styles.form} onSubmit={submit}>
                <FormField
                    autoComplete="username"
                    error={errors.email}
                    id="email"
                    label="Correo electrónico"
                    name="email"
                    onChange={(event) => setData('email', event.target.value)}
                    required
                    type="email"
                    value={data.email}
                />
                <FormField
                    autoComplete="new-password"
                    autoFocus
                    error={errors.password}
                    id="password"
                    label="Contraseña nueva"
                    name="password"
                    onChange={(event) =>
                        setData('password', event.target.value)
                    }
                    required
                    type="password"
                    value={data.password}
                />
                <FormField
                    autoComplete="new-password"
                    error={errors.password_confirmation}
                    id="password_confirmation"
                    label="Confirmar contraseña"
                    name="password_confirmation"
                    onChange={(event) =>
                        setData('password_confirmation', event.target.value)
                    }
                    required
                    type="password"
                    value={data.password_confirmation}
                />
                <button
                    className={styles.button}
                    disabled={processing}
                    type="submit"
                >
                    Guardar contraseña
                </button>
            </form>
        </GuestLayout>
    );
}
