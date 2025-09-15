// lib/data.ts

export interface AudioItem {
    id: string;
    title: string;
    image: string;
    badge?: string;
    subtitle?: string;
}

export interface Category {
    id: string;
    name: string;
    icon: string;
    badge?: string;
}

// Categories data
export const categories: Category[] = [
    {
        id: 'motivation',
        name: 'Motivation',
        icon: '/images/category-motivation.png',
    },
    {
        id: 'love',
        name: 'Love',
        icon: '/images/category-love.png',
    },
    {
        id: 'new-releases',
        name: 'New Releases',
        icon: '/images/category-new.png',
        badge: 'NEW',
    },
    {
        id: 'horror',
        name: 'Horror',
        icon: '/images/category-horror.png',
    },
    {
        id: 'health',
        name: 'Health',
        icon: '/images/category-health.png',
    },
    {
        id: 'fiction',
        name: 'Fiction',
        icon: '/images/category-fiction.png',
    },
    {
        id: 'business',
        name: 'Business',
        icon: '/images/category-business.png',
    },
    {
        id: 'spiritual',
        name: 'Spiritual',
        icon: '/images/category-spiritual.png',
    },
];

// Featured audio data
export const featuredAudio: AudioItem[] = [
    {
        id: 'subconcious',
        title: 'Unlock Your Subconscious Power',
        image: '/images/featured-subconscious.jpg',
    },
    {
        id: 'billionaire',
        title: "Billionaire's Choice",
        image: '/images/featured-billionaire.jpg',
        badge: 'NEW EPISODE DAILY',
    },
    {
        id: 'shiv-puran',
        title: 'Shiv Puran',
        image: '/images/featured-shiv.jpg',
        subtitle: 'आदि से अंत की कथा',
    },
    {
        id: 'divine',
        title: 'Divine Divorce',
        image: '/images/featured-divine.jpg',
    },
];

// K-Drama audio data
export const kDramaAudio: AudioItem[] = [
    {
        id: 'handsome-bodyguard',
        title: 'Handsome Bodyguard',
        image: '/images/drama-bodyguard.jpg',
    },
    {
        id: 'winter-love',
        title: 'Winter Love',
        image: '/images/drama-winter.jpg',
    },
    {
        id: 'restart',
        title: 'Restart',
        image: '/images/drama-restart.jpg',
    },
    {
        id: 'business-affair',
        title: 'Business Affair',
        image: '/images/drama-business.jpg',
    },
    {
        id: 'haunted-love',
        title: 'Haunted Love',
        image: '/images/drama-haunted.jpg',
    },
    {
        id: 'golden-night',
        title: 'Golden Night',
        image: '/images/drama-golden.jpg',
    },
];

// Popular audio data
export const popularAudio: AudioItem[] = [
    {
        id: 'money-mindset',
        title: 'Money Mindset',
        image: '/images/popular-money.jpg',
    },
    {
        id: 'morning-motivation',
        title: 'Morning Motivation',
        image: '/images/popular-morning.jpg',
        badge: 'TRENDING',
    },
    {
        id: 'sleep-stories',
        title: 'Sleep Stories',
        image: '/images/popular-sleep.jpg',
    },
    {
        id: 'meditation',
        title: 'Meditation for Beginners',
        image: '/images/popular-meditation.jpg',
    },
];