'use client';

import Image from 'next/image';
import { useState } from 'react';
import PodcastLibrary from '../../../components/library/Podcast';
import BookLibrary from '../../../components/library/Book';

const Library = () => {
    const [activeTab, setActiveTab] = useState<'podcasts' | 'books'>('podcasts');

    return (
        <div>
            {/* Header */}
            <div className="flex items-center mb-4">
                <button className="text-pink-500 text-2xl mr-4">☰</button>
                <h1 className="text-xl font-bold">Library</h1>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    onClick={() => setActiveTab('podcasts')}
                    className={`mr-8 pb-2 px-12 font-semibold cursor-pointer ${activeTab === 'podcasts' ? 'border-b-4 border-pink-500' : 'text-gray-400'
                        }`}
                >
                    Podcasts
                </button>
                <button
                    onClick={() => setActiveTab('books')}
                    className={`pb-2 px-12 font-semibold cursor-pointer  ${activeTab === 'books' ? 'border-b-4 border-pink-500' : 'text-gray-400'
                        }`}
                >
                    Books
                </button>
            </div>

            {activeTab === "podcasts" ? <>
            <PodcastLibrary />
            </> : 
            <>
            <BookLibrary />
            </>}
        </div>
    );
};

export default Library;
