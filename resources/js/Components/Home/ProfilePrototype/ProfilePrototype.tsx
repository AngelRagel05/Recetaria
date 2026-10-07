import PrototypePanel from '@/Components/Home/PrototypePanel/PrototypePanel';
import type { RefObject } from 'react';
import styles from './ProfilePrototype.module.css';

interface ProfilePrototypeProps {
    bio: string;
    headingRef: RefObject<HTMLHeadingElement | null>;
    name: string;
    onBack: () => void;
    publicationCount: number;
    recipeCount: number;
    username: string;
}

export default function ProfilePrototype({
    bio,
    headingRef,
    name,
    onBack,
    publicationCount,
    recipeCount,
    username,
}: ProfilePrototypeProps) {
    const initials = name
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

    return (
        <PrototypePanel
            eyebrow="Perfil"
            headingRef={headingRef}
            onBack={onBack}
            title={name}
        >
            <div className={styles.preview}>
                <span aria-hidden="true" className={styles.avatar}>
                    {initials}
                </span>
                <div>
                    <p className={styles.username}>@{username}</p>
                    <p>{bio}</p>
                    <dl>
                        <div>
                            <dt>Recetas</dt>
                            <dd>{recipeCount}</dd>
                        </div>
                        <div>
                            <dt>Publicaciones</dt>
                            <dd>{publicationCount}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </PrototypePanel>
    );
}
