// lib/imageUtils.ts

export function getPlaceholderImage(width: number, height: number, text: string = 'Audio'): string {
    // In a production app, you would use real images
    // For development, we'll use placeholder images
    return `https://via.placeholder.com/${width}x${height}/${getRandomColor()}/FFFFFF?text=${text}`;
}

function getRandomColor(): string {
    const colors = [
        'FF5733', // Red-Orange
        '33FF57', // Green
        '3357FF', // Blue
        'F333FF', // Purple
        'FF33A6', // Pink
        '33FFF5', // Cyan
        'FFD133', // Yellow
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

export function getCategoryIcon(category: string): string {
    // In a real app, these would be actual icon paths
    return `https://via.placeholder.com/64x64/F5F5F5/333333?text=${category.charAt(0)}`;
}

// Helper to generate dynamic category images based on category ID
export function getCategoryImage(categoryId: string): string {
    const colors: { [key: string]: string } = {
        'motivation': 'FF5733',
        'love': 'FF33A6',
        'new-releases': '33FF57',
        'horror': '333333',
        'health': '33FFF5',
        'fiction': '3357FF',
        'business': 'FFD133',
        'spiritual': 'F333FF',
    };

    const color = colors[categoryId] || 'CCCCCC';
    return `https://via.placeholder.com/120/${color}/FFFFFF?text=${categoryId}`;
}