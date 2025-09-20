// 'use client';

// import { FaPlay } from 'react-icons/fa';
// import Image from 'next/image';

// type NowPlayingProps = {
//     title: string;
//     artist: string;
//     image: string;
// };

// const NowPlaying: React.FC<NowPlayingProps> = ({ title, artist, image }) => {
//     return (
//         <div className="fixed bottom-18 left-1/2 transform -translate-x-1/2 w-[400px] m-auto bg-white shadow-xl rounded-xl p-3 flex items-center justify-between z-50">
//             <div className="flex items-center">
//                 <div className="relative w-12 h-12 rounded-lg overflow-hidden">
//                     <Image
//                         src={`/images/${image}`}
//                         alt={title}
//                         fill
//                         sizes="48px"
//                         className="object-cover"
//                     />
//                 </div>
//                 <div className="ml-3">
//                     <h3 className="text-sm font-semibold text-black truncate w-[150px]">{title}</h3>
//                     <p className="text-xs text-gray-500">{artist}</p>
//                 </div>
//             </div>
//             <div>
//                 <button className="p-3 rounded-full bg-gradient-to-r from-[#6B0DFF] to-[#FF6B79] shadow-md">
//                     <FaPlay className="text-white" />
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default NowPlaying;

'use client';
import { usePathname } from 'next/navigation';
import { FaPause, FaPlay } from 'react-icons/fa';
import Image from 'next/image';
import { useAudio } from '../../hooks/useAudio';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useDashboard from '../../hooks/useDashboard';
import slugify from 'slugify';

const NowPlaying = () => {

    const router = useRouter();
    const { isPlaying, setIsPlaying, currentTrack, audioRef } = useAudio();
    const pathname = usePathname();
    const { setEpisodeId, setOpenPlayButton } = useDashboard();

    // if (!isPlaying || !currentTrack || pathname?.includes('/episode')) {
    //     return null; // don't show if not playing OR on podcast page
    // }

    if (pathname?.includes('/episode')) {
        return null; // don't show if not playing OR on podcast page
    }

    const togglePlayback = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const handleEpisode = (episode_id: any) => {
        console.log(episode_id, "episode_id");
        if(!episode_id) {
            setOpenPlayButton(false);
            router.push('/home');
            return;
        }
        setEpisodeId(episode_id);
        router.push(`/episode/${encodeURIComponent(episode_id)}/${slugify("1", { lower: true })}`);
        // router.push(`/episode?episode_id=${encodeURIComponent(episode_id)}`);
    }

    // useEffect(() => {
    //     console.log(JSON.parse(localStorage.getItem('seeAllData') || "{}"), "seeAllDataadafs");
    // }, [])

    return (
        <div className="fixed bottom-18 left-1/2 transform -translate-x-1/2 max-w-md w-full m-auto bg-white shadow-xl rounded-xl p-3 flex items-center justify-between z-60">
            <div className="flex items-center cursor-pointer" onClick={() => handleEpisode(JSON.parse(localStorage.getItem('episodeData') || "{}")?.episode_id)}>
                <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                    <Image
                        src={JSON.parse(localStorage.getItem('episodeData') || "").img_local_uri || '/images/download.png'}
                        alt={JSON.parse(localStorage.getItem('episodeData') || "")?.title || "playicon"}
                        fill
                        sizes="48px"
                        className="object-cover cursor-pointer"
                    />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-semibold text-black truncate w-[150px]">{JSON.parse(localStorage.getItem('episodeData') || "{}")?.title}</h3>
                    <p className="text-xs text-gray-500">{JSON.parse(localStorage.getItem('episodeData') || "{}")?.subtitle}</p>
                </div>
            </div>
            <button
                onClick={togglePlayback}
                className="p-3 rounded-full bg-gradient-to-r from-[#6B0DFF] to-[#FF6B79] shadow-md"
            >
                {isPlaying ? <FaPause className="text-white" /> : <FaPlay className="text-white" />}
            </button>
        </div>
    );
};

export default NowPlaying;

