'use client'
import { createContext, useRef, useState, useEffect } from 'react';
import useDashboard from '../hooks/useDashboard';

interface AudioContextType {
    isPlaying: boolean;
    setIsPlaying: (value: boolean) => void;
    currentAudio: number;
    setCurrentAudio: (value: number) => void;
    setAudioSrc: (value: any) => void;
    currentTrack: any;
    setCurrentTrack: (track: any) => void;
    audioList: any;
    setAudioList: (track: any) => void;
    audioRef: React.RefObject<HTMLAudioElement | null>;
    handlePlay: (episodeData: any) => void;
    handlePlayPause: (episodeData: any) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {

    const { setOpenPlayButton } = useDashboard();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<any>(null);
    const [audioSrc, setAudioSrc] = useState<string>("");
    const [audioList, setAudioList] = useState<[]>();
    const [currentAudio, setCurrentAudio] = useState<number>(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Example: set audioSrc from localStorage (adjust as needed)
    // useEffect(() => {
    //     const data = localStorage.getItem('seeAllData');
    //     if (data) {
    //         const parsed = JSON.parse(data);
    //         if (parsed?.stream_url) setAudioSrc(parsed.stream_url);
    //     }
    // }, []);

    const handlePlay = (episodeData: any) => {
        if (episodeData.is_billable === 2) {
            // confirm()
            return;
        }

        const audio = audioRef.current;
        console.log(audio, "audio")
        if (!audio) return;

        audio.play();
        setOpenPlayButton(true);
        setIsPlaying(true);
    };

    const handlePlayPause = (episodeData: any) => {
        if (episodeData.is_billable === 2) {
            // confirm()
            return;
        }

        const audio = audioRef.current;
        console.log(audio, "audio")
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            setOpenPlayButton(false);
        } else {
            audio.play();
            setOpenPlayButton(true);
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <AudioContext.Provider value={{
            isPlaying,
            setIsPlaying,
            currentAudio,
            setCurrentAudio,
            currentTrack,
            setCurrentTrack,
            audioRef,
            audioList,
            setAudioList,
            handlePlay,
            handlePlayPause,
            setAudioSrc
        }}>
            {children}
            <audio ref={audioRef} src={audioSrc || "audio"} preload="metadata" />
        </AudioContext.Provider>
    );
};

export default AudioContext;
