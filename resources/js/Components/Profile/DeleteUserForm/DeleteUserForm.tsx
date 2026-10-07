import FormField from '@/Components/FormField/FormField';
import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useRef, useState } from 'react';
import styles from './DeleteUserForm.module.css';

export default function DeleteUserForm() {
    const [confirmingDeletion, setConfirmingDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);
    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({ password: '' });

    function closeConfirmation() {
        setConfirmingDeletion(false);
        clearErrors();
        reset();
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: closeConfirmation,
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    }

    return (
        <section className={styles.section}>
            <h2>Eliminar cuenta</h2>
            <p className={styles.description}>
                Esta acción eliminará permanentemente tu cuenta y sus datos.
            </p>
            {!confirmingDeletion ? (
                <button
                    className={styles.dangerButton}
                    onClick={() => setConfirmingDeletion(true)}
                    type="button"
                >
                    Eliminar cuenta
                </button>
            ) : (
                <form className={styles.form} onSubmit={submit}>
                    <p className={styles.confirmation}>
                        Introduce tu contraseña para confirmar la eliminación.
                    </p>
                    <FormField
                        autoFocus
                        error={errors.password}
                        id="delete_password"
                        label="Contraseña"
                        onChange={(event) =>
                            setData('password', event.target.value)
                        }
                        ref={passwordInput}
                        required
                        type="password"
                        value={data.password}
                    />
                    <div className={styles.actions}>
                        <button
                            className={styles.secondaryButton}
                            onClick={closeConfirmation}
                            type="button"
                        >
                            Cancelar
                        </button>
                        <button
                            className={styles.dangerButton}
                            disabled={processing}
                            type="submit"
                        >
                            Confirmar eliminación
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
}
