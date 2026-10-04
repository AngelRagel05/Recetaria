export type SocialAction = 'like' | 'comment' | 'save';

export interface PublicationImage {
    src: string;
    alt: string;
}

export interface PublicationAuthor {
    name: string;
    username: string;
    initials: string;
    accent: string;
}

export interface RecipeReference {
    title: string;
    author: string;
    time: string;
}

export interface PublicationEngagement {
    liked: boolean;
    commentsOpen: boolean;
    saved: boolean;
}

export interface PublicationPresentation {
    id: number;
    author: PublicationAuthor;
    publishedLabel: string;
    images: PublicationImage[];
    caption?: string;
    recipe: RecipeReference;
    likeCount: number;
    commentCount: number;
    initialEngagement: PublicationEngagement;
}
