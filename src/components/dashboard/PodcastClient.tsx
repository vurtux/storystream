"use client";
import { useEffect, useRef, useState } from "react";
import { FaBackward, FaForward, FaPlay, FaPause } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdArrowBack, MdSpeed } from "react-icons/md";
import { Clock3, Share2, MoreVertical, Download } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Dialog } from "primereact/dialog";
import useDashboard from "../../hooks/useDashboard";
import { getEpisodeDetail } from "../../app/api/podcast";
import { useAudio } from "../../hooks/useAudio";
import slugify from "slugify";

interface Episode {
    episode_id: number;
    title: string;
    description: string;
    subtitle: string;
    imgid: number;
    episodetype: string;
    keywords: string;
    episode_seq: number;
    duration: number;
    playback_count: number;
    isexplicit: string;
    stream_uri: string;
    stream_url: string;
    download_url: string;
    length: number;
    img_remote_uri: string;
    img_local_uri: string;
    img_height: number;
    img_width: number;
    img_type: string;
    duration_format: string;
    playback_count_format: string;
    added_on: string;
    pubdate: string;
    player_icon_url: string;
    is_billable: number;
}

const defaultEpisode: Episode = {
    episode_id: 0,
    title: "",
    description: "",
    subtitle: "",
    imgid: 0,
    episodetype: "",
    keywords: "",
    episode_seq: 0,
    duration: 0,
    playback_count: 0,
    isexplicit: "",
    stream_uri: "",
    stream_url: "",
    download_url: "",
    length: 0,
    img_remote_uri: "",
    img_local_uri: "",
    img_height: 0,
    img_width: 0,
    img_type: "",
    duration_format: "",
    playback_count_format: "",
    added_on: "",
    pubdate: "",
    player_icon_url: "",
    is_billable: 0,
};

export default function PodcastClient({ episode_id, title }: any) {
    const router = useRouter();
    const searchParams = useSearchParams();
    // const episode_id = searchParams?.get("episode_id");

    const { audioRef, isPlaying, setIsPlaying, handlePlayPause, handlePlay, setAudioSrc, currentAudio, setCurrentAudio, audioList } = useAudio();
    const [episodeData, setEpisodeData] = useState<Episode>(defaultEpisode);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showSpeedDialog, setShowSpeedDialog] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showSleepTimer, setShowSleepTimer] = useState(false);
    const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
    const [timer, setTimer] = useState(5);

    const handleClockClick = () => setShowSleepTimer(true);

    const handleShareClick = async () => {
        const shareUrl = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: episodeData.title,
                    text: episodeData.subtitle || "Check out this podcast!",
                    url: shareUrl,
                });
            } catch (error) {
                console.error("Sharing failed:", error);
            }
        } else {
            await navigator.clipboard.writeText(shareUrl);
            alert("Link copied to clipboard!");
        }
    };

    const handleDownload = () => {
        const fileUrl = episodeData.download_url || episodeData.stream_url;
        const encoded = encodeURIComponent(fileUrl);
        const downloadUrl = `/api/download?url=${encoded}`;

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `${episodeData.title || "podcast"}.mp3`;
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const confirm = () => {
        setShowSubscriptionDialog(true);
        setTimer(5);
    };

    const handleAudioChange = (temp: any) => {
        console.log(audioList, "audioList");
        setIsPlaying(false);
        if(temp === "plus" && currentAudio < audioList.length - 1) {
            setCurrentAudio(currentAudio + 1);
            router.push(`/episode/${encodeURIComponent(audioList[currentAudio + 1])}/${slugify(currentAudio.toString(), { lower: true })}`);
            // router.push(`/episode?episode_id=${encodeURIComponent(audioList[currentAudio + 1])}`);
        }
        if(temp === "minus" && currentAudio > 0) {
            setCurrentAudio(currentAudio - 1);
            router.push(`/episode/${encodeURIComponent(audioList[currentAudio - 1])}/${slugify(currentAudio.toString(), { lower: true })}`);
            // router.push(`/episode?episode_id=${encodeURIComponent(audioList[currentAudio - 1])}`);
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.playbackRate = playbackRate;
        }
    }, [playbackRate, audioRef]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const lang = localStorage.getItem("language")
                const result = await getEpisodeDetail(Number(episode_id), lang);
                const ep = result.response.podcast.podcast_episode_details[0];
                setEpisodeData(ep);
                localStorage.setItem("episodeData", JSON.stringify(ep));
                setAudioSrc(ep?.stream_url);
                setTimeout(() => {
                    handlePlay(ep);
                }, 1000);
            } catch (error) {
                console.error("Failed to fetch podcast:", error);
            }
        };
        fetchData();
    }, [episode_id, setAudioSrc, currentAudio]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => {
            setCurrentTime(audio.currentTime);
            setDuration(audio.duration);
        };

        audio.addEventListener("timeupdate", updateTime);
        return () => {
            audio.removeEventListener("timeupdate", updateTime);
        };
    }, [audioRef]);

    useEffect(() => {
        if (!showSubscriptionDialog || timer <= 1) return;
        const countdown = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);
        return () => clearInterval(countdown);
    }, [showSubscriptionDialog, timer]);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60).toString().padStart(2, "0");
        const seconds = Math.floor(time % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    return (
        <main className="flex flex-col items-center justify-center">
            <div className="w-full flex items-center justify-between mb-4">
                <button onClick={() => router.back()}>
                    <MdArrowBack className="text-2xl cursor-pointer" />
                </button>
                <h1 className="font-semibold text-lg">Now Playing</h1>
                <button>
                    <HiOutlineDotsVertical className="text-2xl" />
                </button>
            </div>

            <div className="w-full rounded-xl overflow-hidden shadow-lg">
                {episodeData?.img_local_uri ? (
                    <Image
                        src={episodeData.img_local_uri}
                        alt="Podcast Cover"
                        height={400}
                        width={1000}
                        className="w-full h-[400px] object-cover"
                    />
                ) : (
                    <div className="w-full h-[400px] flex items-center justify-center animate-pulse bg-gray-100">
                        <span>Loading...</span>
                    </div>
                )}
            </div>

            <div className="text-center mt-4">
                <h2 className="font-bold text-lg">{episodeData.title || "No title"}</h2>
                <p className="text-sm">{episodeData?.subtitle}</p>
            </div>

            <div className="w-full max-w-sm mt-6">
                <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    value={currentTime}
                    className="w-full accent-purple-500"
                    onChange={(e) => {
                        const newTime = parseFloat(e.target.value);
                        if (audioRef.current) {
                            audioRef.current.currentTime = newTime;
                        }
                        setCurrentTime(newTime);
                    }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{duration ? formatTime(duration) : "00:00"}</span>
                </div>
            </div>

            <div className="flex items-center justify-between w-full max-w-sm mt-6 px-6">
                <button onClick={() => handleAudioChange("minus")}><FaBackward className="text-2xl" /></button>
                <button title="Back 10s" onClick={() => {
                    if (audioRef.current) audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
                }}>
                    <Image height={32} width={32} alt="backward" src="/images/backward-icon.png" />
                </button>
                <button
                    style={{ background: "radial-gradient(92.09% 394.93% at 7.91% 50%, #6B0DFF 0%, #FF6B79 100%)" }}
                    className="p-4 rounded-full text-white shadow-lg"
                    onClick={() => episodeData?.is_billable === 0 ? confirm() : handlePlayPause(episodeData)}
                >
                    {isPlaying ? 
                    <FaPause className="text-2xl" /> 
                    : 
                    <FaPlay className="text-2xl cursor-pointer" />
                    // <Image height={80} width={80} alt="play" src="/images/Play.png" />
                    }
                </button>
                <button title="Forward 10s" onClick={() => {
                    if (audioRef.current) audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, duration);
                }}>
                    <Image height={32} width={32} alt="forward" src="/images/forward-icon.png" />
                </button>
                <button onClick={() => handleAudioChange("plus")}><FaForward className="text-2xl" /></button>
            </div>

            <div className="w-full flex justify-around items-center py-3 mt-6">
                <MdSpeed className="w-5 h-5 text-gray-600 cursor-pointer" onClick={() => setShowSpeedDialog(true)} />
                {/* <Image height={28} width={28} alt="vector" src="/images/Vector.png" /> */}
                <Clock3 className="w-5 h-5 text-gray-600 cursor-pointer" onClick={handleClockClick} />
                {/* <Image height={28} width={28} alt="timer" src="/images/timer.png" /> */}
                <Share2 className="w-5 h-5 text-gray-600 cursor-pointer" onClick={handleShareClick} />
                <Download className="w-5 h-5 text-gray-600 cursor-pointer" onClick={handleDownload} />
            </div>

            {/* Playback Speed Dialog */}
            <Dialog header="Playback Speed" visible={showSpeedDialog} onHide={() => setShowSpeedDialog(false)} style={{ width: "300px" }} modal>
                <div className="flex flex-col gap-3">
                    {[0.5, 1, 1.5, 2].map((rate) => (
                        <button
                            key={rate}
                            onClick={() => {
                                setPlaybackRate(rate);
                                if (audioRef.current) audioRef.current.playbackRate = rate;
                                setShowSpeedDialog(false);
                            }}
                            className={`py-2 px-4 rounded-md text-white ${playbackRate === rate ? "bg-purple-600" : "bg-gray-400"}`}
                        >
                            {rate}x
                        </button>
                    ))}
                </div>
            </Dialog>

            {/* Sleep Timer Dialog */}
            <Dialog visible={showSleepTimer} onHide={() => setShowSleepTimer(false)} header="Set Sleep Timer" className="w-80" modal>
                <div className="flex flex-col gap-2">
                    <button className="bg-purple-500 text-white py-2 rounded" onClick={() => { setTimer(15); setShowSleepTimer(false); }}>15 Minutes</button>
                    <button className="bg-purple-500 text-white py-2 rounded" onClick={() => { setTimer(30); setShowSleepTimer(false); }}>30 Minutes</button>
                </div>
            </Dialog>

            {/* Subscription Dialog */}
                <Dialog
                visible={showSubscriptionDialog}
                onHide={() => setShowSubscriptionDialog(false)}
                header={null}
                closable={false}
                modal
                style={{
                    position: "fixed",
                    bottom: 0,
                    width: '100%',
                    borderTopLeftRadius: "1.5rem",
                    borderTopRightRadius: "1.5rem",
                }}
                className="bottom-dialog custom-dialog-no-header max-w-md w-full"
                >
                <div className="bg-white text-center w-full px-6 py-4">
                    <div className="w-[60px] h-[60px] m-auto mt-6">
                        <Image width={200} height={200} className="w-full h-full" src="/images/subscriptionLogo.png" alt="Subscription Logo" />
                    </div>
                    <h2 className="text-xl font-semibold text-purple-600 mt-4">StoryStream Pro</h2>
                    <p className="text-lg font-bold text-gray-900 my-3">
                        Unlock All Shows & Books
                        <br />
                        with StoryStream Pro
                    </p>
                    <div className="border border-gray-200"></div>
                    <p className="text-gray-600 my-4">
                        Subscribe now to enjoy Unlimited Access
                    </p>
                    <button
                        onClick={() => {
                            window.open("https://payment.myuze.app/p/index.php?&userid=17178329&deviceId=20030107&country=IN&mobileNo=&isdCode=&langCode=en&app_version=3.0.3&build_number=10060&upi=&platform=web&plan=", "_self");
                            setShowSubscriptionDialog(false);
                        }}
                        style={{ background: "radial-gradient(92.09% 394.93% at 7.91% 50%, #6B0DFF 0%, #FF6B79 100%)" }}
                        className="text-white py-3 px-6 rounded-xl text-lg font-medium w-full transition hover:opacity-90"
                    >
                        Subscribe Now {timer > 1 ? `(${timer} Sec)` : "(Pro)"}
                    </button>
                    <div
                        className="text-sm text-gray-600 mt-4 cursor-pointer hover:underline"
                        onClick={() => timer === 1 && setShowSubscriptionDialog(false)}
                    >
                        &larr; I’ll try this later, take me back
                    </div>
                </div>
            </Dialog>
        </main>
    );
}
