'use client';

import { usePathname, useRouter } from 'next/navigation';
import { FaPause, FaPlay } from 'react-icons/fa';
import Image from 'next/image';
import { useAudio } from '../../hooks/useAudio';
import { useEffect, useState } from 'react';
import useDashboard from '../../hooks/useDashboard';
import slugify from 'slugify';

const NowPlaying = () => {
    const router = useRouter();
    const pathname = usePathname();

    const { isPlaying, setIsPlaying, audioRef } = useAudio();
    const { setEpisodeId, setOpenPlayButton } = useDashboard();

    const [episodeData, setEpisodeData] = useState<any>(null);

    // Load episode data safely
    useEffect(() => {
        try {
            const raw = localStorage.getItem("episodeData");
            setEpisodeData(raw ? JSON.parse(raw) : null);
        } catch {
            setEpisodeData(null);
        }
    }, []);

    // Hide on episode page
    if (pathname?.includes('/episode')) return null;

    const togglePlayback = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleEpisode = () => {
        setEpisodeId(episodeData?.episode_id);

        router.push(
            `/episode/${encodeURIComponent(episodeData.episode_id)}/${slugify(
                episodeData?.title,
                { lower: true }
            )}`
        );
    };

    return (
        <div className="fixed bottom-18 left-1/2 transform -translate-x-1/2 max-w-md w-full m-auto bg-white shadow-xl rounded-xl p-3 flex items-center justify-between z-60">

            <div className="flex items-center cursor-pointer" onClick={handleEpisode}>
                <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                    <Image
                        src={episodeData?.img_local_uri || '/images/download.png'}
                        alt={episodeData?.title || "playicon"}
                        fill
                        sizes="48px"
                        className="object-cover cursor-pointer"
                    />
                </div>

                <div className="ml-3">
                    <h3 className="text-sm font-semibold text-black truncate w-[150px]">
                        {episodeData?.title || "Unknown Title"}
                    </h3>
                    <p className="text-xs text-gray-500">
                        {episodeData?.subtitle || ""}
                    </p>
                </div>
            </div>

            <button
                onClick={togglePlayback}
                className="p-3 rounded-full bg-gradient-to-r from-[#6B0DFF] to-[#FF6B79] shadow-md"
            >
                {isPlaying ? (
                    <FaPause className="text-white" />
                ) : (
                    <FaPlay className="text-white" />
                )}
            </button>
        </div>
    );
};

export default NowPlaying;
