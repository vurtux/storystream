'use client';
import { FaArrowLeft, FaPlay, FaPause, FaForward, FaBackward } from "react-icons/fa";
import { useState } from "react";
import Image from "next/image";

export default function PodcastPlayer() {
    const [isPlaying, setIsPlaying] = useState(true);

    return (
        <div className="min-h-screen bg-white p-4 pt-8 max-w-md mx-auto font-sans">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <button className="text-gray-600">
                    <FaArrowLeft size={20} />
                </button>
                <h1 className="text-base font-semibold text-gray-800">Talking to Strangers</h1>
                <div className="w-5 h-5" />
            </div>

            {/* Podcast Cover */}
            <div className="mb-4">
                <Image
                    src="/images/audio.png"
                    alt="Ikigai Cover"
                    className="w-full rounded-2xl"
                />
            </div>

            {/* Title & Subtitle */}
            <div className="text-center mb-4">
                <h2 className="text-lg font-semibold">Question Assumptions to Uncover the Truth</h2>
                <p className="text-sm text-gray-500">Ikigai</p>
            </div>

            {/* Audio Progress */}
            <div className="mt-6 mb-2 px-2">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value="60"
                    className="w-full accent-purple-500"
                    readOnly
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>2:30</span>
                    <span>2:44</span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex justify-around items-center mt-6">
                <button className="text-gray-600">
                    <FaBackward size={24} />
                </button>
                <button
                    className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg"
                    onClick={() => setIsPlaying(!isPlaying)}
                >
                    {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
                </button>
                <button className="text-gray-600">
                    <FaForward size={24} />
                </button>
            </div>
        </div>
    );
}
