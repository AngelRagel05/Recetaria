import type { PublicationImage } from '@/Components/SocialFeed/types/socialFeed';
import { useState } from 'react';
import styles from './PublicationCarousel.module.css';

interface PublicationCarouselProps {
    images: PublicationImage[];
}

export default function PublicationCarousel({
    images,
}: PublicationCarouselProps) {
    const [imageIndex, setImageIndex] = useState(0);
    const image = images[imageIndex];
    const hasCarousel = images.length > 1;

    return (
        <figure className={styles.media}>
            <img src={image.src} alt={image.alt} />
            {hasCarousel && (
                <>
                    <button
                        aria-disabled={imageIndex === 0}
                        aria-label="Imagen anterior"
                        className={`${styles.button} ${styles.previous}`}
                        onClick={() => {
                            if (imageIndex > 0) {
                                setImageIndex((current) => current - 1);
                            }
                        }}
                        type="button"
                    >
                        ←
                    </button>
                    <button
                        aria-disabled={imageIndex === images.length - 1}
                        aria-label="Imagen siguiente"
                        className={`${styles.button} ${styles.next}`}
                        onClick={() => {
                            if (imageIndex < images.length - 1) {
                                setImageIndex((current) => current + 1);
                            }
                        }}
                        type="button"
                    >
                        →
                    </button>
                    <span className={styles.position} aria-hidden="true">
                        {imageIndex + 1} / {images.length}
                    </span>
                    <span aria-live="polite" className={styles.visuallyHidden}>
                        Imagen {imageIndex + 1} de {images.length}
                    </span>
                </>
            )}
        </figure>
    );
}
