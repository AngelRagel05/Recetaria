import { forwardRef, type ComponentPropsWithRef } from 'react';
import styles from './FormField.module.css';

type Props = ComponentPropsWithRef<'input'> & {
    label: string;
    error?: string;
};

const FormField = forwardRef<HTMLInputElement, Props>(function FormField(
    { label, error, id, ...inputProps },
    ref,
) {
    return (
        <div className={styles.field}>
            <label className={styles.label} htmlFor={id}>
                {label}
            </label>
            <input
                {...inputProps}
                aria-describedby={error ? `${id}-error` : undefined}
                aria-invalid={Boolean(error)}
                className={styles.input}
                id={id}
                ref={ref}
            />
            {error && (
                <p className={styles.error} id={`${id}-error`} role="alert">
                    {error}
                </p>
            )}
        </div>
    );
});

export default FormField;
