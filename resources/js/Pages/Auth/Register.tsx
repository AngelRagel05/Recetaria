import FormField from '@/Components/FormField';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import styles from './Auth.module.css';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    }

    return (
        <GuestLayout>
            <Head title="Crear cuenta" />
            <h1 className={styles.title}>Crear cuenta</h1>
            <form className={styles.form} onSubmit={submit}>
                <FormField
                    autoComplete="name"
                    autoFocus
                    error={errors.name}
                    id="name"
                    label="Nombre"
                    name="name"
                    onChange={(event) => setData('name', event.target.value)}
                    required
                    value={data.name}
                />
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
                <div className={styles.actions}>
                    <Link href={route('login')}>Ya tengo cuenta</Link>
                    <button
                        className={styles.button}
                        disabled={processing}
                        type="submit"
                    >
                        Registrarme
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
