import curryImage from '../../images/prototype-feed/green-curry.svg';
import breakfastImage from '../../images/prototype-feed/berry-breakfast.svg';
import cakeImage from '../../images/prototype-feed/citrus-cake.svg';
import pastaImage from '../../images/prototype-feed/tomato-pasta.svg';
import sourdoughImage from '../../images/prototype-feed/sourdough.svg';
import vegetablesImage from '../../images/prototype-feed/roasted-vegetables.svg';
import type {
    PublicationEngagement,
    PublicationPresentation,
} from '@/Components/SocialFeed/types';

const publications: PublicationPresentation[] = [
    {
        id: 1,
        author: {
            name: 'Elena Martín',
            username: 'elenaenlacocina',
            initials: 'EM',
            accent: '#d55b3e',
        },
        publishedLabel: 'Hace 18 min',
        images: [
            {
                src: pastaImage,
                alt: 'Pasta con salsa de tomate asado, albahaca y queso',
            },
            {
                src: vegetablesImage,
                alt: 'Verduras de temporada asadas sobre una fuente clara',
            },
        ],
        caption:
            'Tomates bien maduros, fuego lento y una cena que sabe a domingo.',
        recipe: {
            title: 'Pasta con tomate asado',
            author: 'Elena Martín',
            time: '35 min',
        },
        likeCount: 128,
        commentCount: 16,
        initialEngagement: {
            liked: false,
            commentsOpen: false,
            saved: true,
        },
    },
    {
        id: 2,
        author: {
            name: 'Álex Ríos',
            username: 'masa_y_tiempo',
            initials: 'AR',
            accent: '#9b6a3b',
        },
        publishedLabel: 'Hace 42 min',
        images: [
            {
                src: sourdoughImage,
                alt: 'Hogaza de masa madre recién cortada sobre una tabla',
            },
        ],
        caption:
            'La espera mereció la pena: corteza fina, miga abierta y mucho aroma.',
        recipe: {
            title: 'Hogaza de masa madre',
            author: 'Álex Ríos',
            time: '18 h',
        },
        likeCount: 94,
        commentCount: 11,
        initialEngagement: {
            liked: true,
            commentsOpen: false,
            saved: false,
        },
    },
    {
        id: 3,
        author: {
            name: 'Nora Vidal',
            username: 'cuchara_verde',
            initials: 'NV',
            accent: '#4f7c55',
        },
        publishedLabel: 'Hace 1 h',
        images: [
            {
                src: curryImage,
                alt: 'Cuenco de curry verde con arroz, hierbas y lima',
            },
            {
                src: vegetablesImage,
                alt: 'Bandeja de verduras asadas con hierbas frescas',
            },
        ],
        caption:
            'Picante amable, muchas hierbas frescas y lima justo antes de servir.',
        recipe: {
            title: 'Curry verde de verduras',
            author: 'Nora Vidal',
            time: '45 min',
        },
        likeCount: 203,
        commentCount: 27,
        initialEngagement: {
            liked: false,
            commentsOpen: false,
            saved: false,
        },
    },
    {
        id: 4,
        author: {
            name: 'Mara León',
            username: 'mara_hornea',
            initials: 'ML',
            accent: '#c58736',
        },
        publishedLabel: 'Hace 2 h',
        images: [
            {
                src: cakeImage,
                alt: 'Bizcocho de cítricos con glaseado y rodajas de naranja',
            },
        ],
        caption:
            'Un bizcocho sencillo con naranja, limón y un glaseado muy ligero.',
        recipe: {
            title: 'Bizcocho de cítricos',
            author: 'Mara León',
            time: '55 min',
        },
        likeCount: 176,
        commentCount: 19,
        initialEngagement: {
            liked: false,
            commentsOpen: false,
            saved: true,
        },
    },
    {
        id: 5,
        author: {
            name: 'Diego Soler',
            username: 'desayunos_despacio',
            initials: 'DS',
            accent: '#7f566e',
        },
        publishedLabel: 'Hace 3 h',
        images: [
            {
                src: breakfastImage,
                alt: 'Bol de desayuno con yogur, frutos rojos y granola',
            },
        ],
        caption:
            'Crujiente, cremoso y listo en diez minutos para empezar con calma.',
        recipe: {
            title: 'Bol de frutos rojos y granola',
            author: 'Diego Soler',
            time: '10 min',
        },
        likeCount: 81,
        commentCount: 8,
        initialEngagement: {
            liked: true,
            commentsOpen: false,
            saved: true,
        },
    },
    {
        id: 6,
        author: {
            name: 'Inés Campos',
            username: 'mesa_de_temporada',
            initials: 'IC',
            accent: '#7a703d',
        },
        publishedLabel: 'Hace 5 h',
        images: [
            {
                src: vegetablesImage,
                alt: 'Verduras asadas de colores con romero y aceite de oliva',
            },
            {
                src: curryImage,
                alt: 'Curry verde terminado con lima y hojas frescas',
            },
        ],
        caption:
            'Una bandeja, verduras de temporada y el horno haciendo casi todo el trabajo.',
        recipe: {
            title: 'Verduras asadas con romero',
            author: 'Inés Campos',
            time: '50 min',
        },
        likeCount: 147,
        commentCount: 13,
        initialEngagement: {
            liked: false,
            commentsOpen: false,
            saved: false,
        },
    },
];

export const guestPublications = publications;
export const homePublications = publications.slice(0, 4);
export const explorePublications = [
    publications[4],
    publications[2],
    publications[5],
    publications[1],
];

export function createInitialEngagement(): Record<
    number,
    PublicationEngagement
> {
    return Object.fromEntries(
        publications.map((publication) => [
            publication.id,
            { ...publication.initialEngagement },
        ]),
    );
}

export const invitationPreview = {
    author: 'Nora Vidal',
    recipe: 'Curry verde de verduras',
};

export const profilePreview = {
    username: 'tu_perfil',
    bio: 'Cocino sin prisa, comparto lo que merece repetirse.',
    recipeCount: 12,
    publicationCount: 28,
};
