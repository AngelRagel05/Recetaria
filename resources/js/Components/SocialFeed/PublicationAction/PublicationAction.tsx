import type { ReactNode } from 'react';
import styles from './PublicationAction.module.css';

interface PublicationActionProps {
    active: boolean;
    authenticated: boolean;
    children: ReactNode;
    loginHref: string;
    onClick: () => void;
    requireAccountLabel: string;
}

export default function PublicationAction({
    active,
    authenticated,
    children,
    loginHref,
    onClick,
    requireAccountLabel,
}: PublicationActionProps) {
    const className = active
        ? `${styles.action} ${styles.active}`
        : styles.action;

    if (!authenticated) {
        return (
            <a
                aria-label={requireAccountLabel}
                className={className}
                href={loginHref}
            >
                {children}
            </a>
        );
    }

    return (
        <button
            aria-pressed={active}
            className={className}
            onClick={onClick}
            type="button"
        >
            {children}
        </button>
    );
}
