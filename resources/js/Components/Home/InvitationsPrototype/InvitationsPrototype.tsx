import PrototypePanel from '@/Components/Home/PrototypePanel/PrototypePanel';
import type { RefObject } from 'react';
import styles from './InvitationsPrototype.module.css';

interface InvitationsPrototypeProps {
    author: string;
    headingRef: RefObject<HTMLHeadingElement | null>;
    onBack: () => void;
    recipe: string;
}

export default function InvitationsPrototype({
    author,
    headingRef,
    onBack,
    recipe,
}: InvitationsPrototypeProps) {
    return (
        <PrototypePanel
            eyebrow="Colaboraciones"
            headingRef={headingRef}
            onBack={onBack}
            title="Invitaciones pendientes"
        >
            <article className={styles.card}>
                <span aria-hidden="true" className={styles.avatar}>
                    NV
                </span>
                <div className={styles.content}>
                    <h2>{recipe}</h2>
                    <p>{author} quiere escribir esta receta contigo.</p>
                </div>
                <div className={styles.actions}>
                    <button disabled type="button">
                        Aceptar
                    </button>
                    <button disabled type="button">
                        Rechazar
                    </button>
                </div>
            </article>
        </PrototypePanel>
    );
}
