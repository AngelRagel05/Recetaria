import FormField from '@/Components/FormField/FormField';
import GuestLayout from '@/Layouts/GuestLayout/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import styles from './Login.module.css';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    }

    return (
        <GuestLayout>
            <Head title="Iniciar sesión" />
            <h1 className={styles.title}>Iniciar sesión</h1>
            {status && (
                <p className={styles.status} role="status">
                    {status}
                </p>
            )}
            <form className={styles.form} onSubmit={submit}>
                <FormField
                    autoComplete="username"
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
                <FormField
                    autoComplete="current-password"
                    error={errors.password}
                    id="password"
                    label="Contraseña"
                    name="password"
                    onChange={(event) =>
                        setData('password', event.target.value)
                    }
                    required
                    type="password"
                    value={data.password}
                />
                <label className={styles.checkbox}>
                    <input
                        checked={data.remember}
                        name="remember"
                        onChange={(event) =>
                            setData('remember', event.target.checked)
                        }
                        type="checkbox"
                    />
                    Recordarme
                </label>
                <div className={styles.actions}>
                    {canResetPassword && (
                        <Link href={route('password.request')}>
                            ¿Olvidaste tu contraseña?
                        </Link>
                    )}
                    <button
                        className={styles.button}
                        disabled={processing}
                        type="submit"
                    >
                        Entrar
                    </button>
                </div>
                <p className={styles.registerPrompt}>
                    ¿No tienes cuenta?{' '}
                    <Link href={route('register')}>Regístrate</Link>
                </p>
            </form>
        </GuestLayout>
    );
}
