import FormField from '@/Components/FormField';
import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useRef } from 'react';
import styles from '../Profile.module.css';

export default function UpdatePasswordForm() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (formErrors) => {
                if (formErrors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
                if (formErrors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    }

    return (
        <section className={styles.section}>
            <h2>Contraseña</h2>
            <p>Actualiza la contraseña de tu cuenta.</p>
            <form className={styles.form} onSubmit={submit}>
                <FormField
                    autoComplete="current-password"
                    error={errors.current_password}
                    id="current_password"
                    label="Contraseña actual"
                    onChange={(event) =>
                        setData('current_password', event.target.value)
                    }
                    ref={currentPasswordInput}
                    required
                    type="password"
                    value={data.current_password}
                />
                <FormField
                    autoComplete="new-password"
                    error={errors.password}
                    id="new_password"
                    label="Contraseña nueva"
                    onChange={(event) =>
                        setData('password', event.target.value)
                    }
                    ref={passwordInput}
                    required
                    type="password"
                    value={data.password}
                />
                <FormField
                    autoComplete="new-password"
                    error={errors.password_confirmation}
                    id="new_password_confirmation"
                    label="Confirmar contraseña nueva"
                    onChange={(event) =>
                        setData('password_confirmation', event.target.value)
                    }
                    required
                    type="password"
                    value={data.password_confirmation}
                />
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
