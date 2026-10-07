import PrototypePanel from '@/Components/Home/PrototypePanel/PrototypePanel';
import type { RefObject } from 'react';
import styles from './CreatePrototype.module.css';

interface CreatePrototypeProps {
    headingRef: RefObject<HTMLHeadingElement | null>;
    onBack: () => void;
}

export default function CreatePrototype({
    headingRef,
    onBack,
}: CreatePrototypeProps) {
    return (
        <PrototypePanel
            eyebrow="Crear"
            headingRef={headingRef}
            onBack={onBack}
            title="¿Qué quieres compartir?"
        >
            <div className={styles.choices}>
                <article>
                    <span aria-hidden="true">◇</span>
                    <h2>Nueva receta</h2>
                    <p>Organiza ingredientes, pasos y detalles culinarios.</p>
                    <button disabled type="button">
                        Empezar receta
                    </button>
                </article>
                <article>
                    <span aria-hidden="true">▣</span>
                    <h2>Nueva publicación</h2>
                    <p>Comparte imágenes y enlaza la receta que las inspira.</p>
                    <button disabled type="button">
                        Empezar publicación
                    </button>
                </article>
            </div>
        </PrototypePanel>
    );
}
