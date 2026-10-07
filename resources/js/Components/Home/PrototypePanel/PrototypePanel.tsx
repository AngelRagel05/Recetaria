import type { ReactNode, RefObject } from 'react';
import styles from './PrototypePanel.module.css';

interface PrototypePanelProps {
    children: ReactNode;
    eyebrow: string;
    headingRef: RefObject<HTMLHeadingElement | null>;
    onBack: () => void;
    title: string;
}

export default function PrototypePanel({
    children,
    eyebrow,
    headingRef,
    onBack,
    title,
}: PrototypePanelProps) {
    return (
        <section className={styles.panel}>
            <button
                className={styles.backButton}
                onClick={onBack}
                type="button"
            >
                ← Volver al feed
            </button>
            <p className={styles.eyebrow}>{eyebrow}</p>
            <h1 ref={headingRef} tabIndex={-1}>
                {title}
            </h1>
            <p className={styles.note}>
                Vista del prototipo · no envía ni guarda información.
            </p>
            {children}
        </section>
    );
}
