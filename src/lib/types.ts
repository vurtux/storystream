// lib/types.ts

export interface Audio {
    id: string;
    title: string;
    description?: string;
    coverImage: string;
    duration?: number;
    author?: string;
    category?: string;
    publishDate?: string;
    badge?: string;
    isNew?: boolean;
    isTrending?: boolean;
    episodes?: Episode[];
}

export interface Episode {
    id: string;
    title: string;
    duration: number;
    audioUrl: string;
    releaseDate: string;
}

export interface Category {
    id: string;
    name: string;
    icon: string;
    badge?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    subscription?: {
        plan: 'free' | 'premium';
        expiresAt: string;
    };
}