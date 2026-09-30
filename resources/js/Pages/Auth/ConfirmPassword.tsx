import FormField from '@/Components/FormField';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import styles from './Auth.module.css';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    }

    return (
        <GuestLayout>
            <Head title="Confirmar contraseña" />
            <h1 className={styles.title}>Confirmar contraseña</h1>
            <p className={styles.description}>
                Confirma tu contraseña para continuar en esta zona protegida.
            </p>
            <form className={styles.form} onSubmit={submit}>
                <FormField
                    autoComplete="current-password"
                    autoFocus
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
                <button
                    className={styles.button}
                    disabled={processing}
                    type="submit"
                >
                    Confirmar
                </button>
            </form>
        </GuestLayout>
    );
}
