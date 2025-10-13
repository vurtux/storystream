'use client'

import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Share2,
  Play,
  Download,
  BookOpen,
  Lightbulb,
  User,
  CheckCircle
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useDashboard from '../../hooks/useDashboard';
import { handlePodcastPaging } from '../../app/api/podcast';
import { useAudio } from '../../hooks/useAudio';
import slugify from 'slugify';

interface PodcastDetail {
  podcast_id: number;
  title: string;
  description: string;
  copyright: string;
  language: string;
  link_uri: string;
  img_remote_uri: string;
  img_local_uri: string;
  img_height: number;
  img_width: number;
  img_type: string;
  added_on: string;
  total_episode: number;
  total_following: number;
  category: string;
  artiste_id: number | null;
  artist_name: string | null;
  is_billable: number;
  ptype: string;
  total_duration: string;
}

interface PodcastEpisodeDetail {
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
  img_height: number | null;
  img_width: number | null;
  img_type: string | null;
  added_on: string;
  pubdate: string;
  duration_format: string;
  playback_count_format: string;
  player_icon_url: string;
  is_billable: number;
}

const DetailsClient = ({ conId, title }: any) => {
  const router = useRouter();
  const { setEpisodeId, detailData } = useDashboard();
  const { setCurrentAudio, setAudioList } = useAudio();
  const [bookDetails, setBookDetails] = useState<any>(null);
  const [podcastData, setPodcastData] = useState<PodcastDetail>();
  const [episodeData, setEpisodeData] = useState<PodcastEpisodeDetail[]>();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleEpisode = (item: PodcastEpisodeDetail, index: number) => {
    setCurrentAudio(index);
    setEpisodeId(item.episode_id);
    router.push(`/episode/${encodeURIComponent(item.episode_id)}/${slugify(item.title, { lower: true })}`);
  };

  const handlePlayButton = () => {
    if (episodeData && episodeData.length > 0) {
      handleEpisode(episodeData[0], 0);
    }
  };

  const handleShareClick = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ url: shareUrl });
      } catch (error) {
        console.log('Sharing failed:', error);
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  const fetchData = async () => {
    try {
      const lang: any = localStorage.getItem("language");
      const country = localStorage.getItem('country') || "";
      const result = await handlePodcastPaging({
        conId: Number(conId),
        page: 1,
        debug: false,
        test: '1122',
        lang: lang,
        country
      });
      const podcast_details = result.response.podcast.podcast_details;
      setPodcastData(podcast_details);
      setBookDetails(result.response.podcast.book_details);
      const episodeIds = result.response.podcast.podcast_episode_details.map((item: any) => item.episode_id);
      setAudioList(episodeIds);
      setEpisodeData(result.response.podcast.podcast_episode_details);
    } catch (error) {
      console.log("Failed to fetch podcast:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [detailData, conId]);

  const renderDescription = () => {
    const description = podcastData?.description || '';
    if (description?.length <= 150) return description;

    return showFullDescription ? (
      <>
        {description}
        <span
          className="text-purple-600 ml-2 cursor-pointer"
          onClick={() => setShowFullDescription(false)}
        >
          Read Less
        </span>
      </>
    ) : (
      <>
        {description.slice(0, 150)}...
        <span
          className="text-purple-600 ml-2 cursor-pointer"
          onClick={() => setShowFullDescription(true)}
        >
          Read More
        </span>
      </>
    );
  };

  const handleDownload = (item: any) => {
    const link = document.createElement("a");
    link.href = item.download_url || item.stream_url;
    link.download = `${item.title || "podcast"}.mp3`;
    link.click();
  };

  return (
    <div className="pb-20 max-w-md mx-auto text-gray-900">
      {/* Hero Section */}
      <div className="relative w-full h-[260px] flex items-center justify-center bg-gradient-to-b from-[#d2e9ff] to-white rounded-b-[2rem] shadow-sm overflow-hidden">
        {loading ? (
          <div className="w-40 h-40 bg-gray-200 animate-pulse rounded-full" />
        ) : podcastData?.img_local_uri ? (
          <div className="relative">
  <Image
    src={podcastData.img_local_uri}
    alt="Podcast Cover"
    height={400}
    width={428}
    className="w-full h-[400px] object-cover"
  />
  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/10 via-black/5 to-transparent pointer-events-none" />
</div>

        ) : null}

        <div className="absolute top-4 left-4 text-gray-900">
          <ArrowLeft onClick={() => router.back()} className="cursor-pointer w-[26px] h-[26px]" />
        </div>

        <div className="absolute top-4 right-4 text-gray-900">
          <Share2 onClick={handleShareClick} className="cursor-pointer w-[26px] h-[26px]" />
        </div>
      </div>

      {/* Book Details */}
      <div className="text-center mt-5 px-5">
        {loading ? (
          <div className="h-6 w-2/3 mx-auto bg-gray-200 animate-pulse rounded" />
        ) : (
          <>
            <h2 className="text-2xl font-bold">{podcastData?.title}</h2>
            {podcastData?.ptype === "book" && (
              <>
                <p className="text-gray-600 font-medium">{podcastData?.artist_name}</p>
                <p className="text-sm text-gray-500">{bookDetails?.duration_display_mins} minutes</p>
              </>
            )}
          </>
        )}
      </div>

      {/* Info Badges */}
      {podcastData?.ptype === "book" && (
        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-800">
            <User size={14} /> {bookDetails?.categories || "Self Growth"}
          </div>
          <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-800">
            <BookOpen size={14} /> {podcastData?.total_episode} Chapters
          </div>
          <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-800">
            <Lightbulb size={14} /> {bookDetails?.insights_count || 16} Insights
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between mt-6 px-4 gap-3">
        <button
          style={{
            color: "#6B0DFF",
            background: "radial-gradient(92.09% 394.93% at 7.91% 50%, rgba(107, 13, 255, 0.1) 0%, rgba(255, 107, 121, 0.1) 100%)"
          }}
          className="w-1/2 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <Download size={18} /> Download Now
        </button>

        <button
          onClick={handlePlayButton}
          style={{
            background: "radial-gradient(92.09% 394.93% at 7.91% 50%, #6B0DFF 0%, #FF6B79 100%)"
          }}
          className="w-1/2 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2"
        >
          <Play size={18} /> Play Now
        </button>
      </div>

      {/* Description */}
      {podcastData?.ptype === "book" && (
        <div className="mt-6 px-5">
          <h3 className="font-semibold text-lg text-gray-900">Description</h3>
          <p className="text-sm mt-2 text-gray-700 leading-relaxed">
            {loading ? <div className="h-20 bg-gray-100 animate-pulse rounded" /> : renderDescription()}
          </p>
        </div>
      )}

      {/* Chapters */}
      <div className="mt-6 px-5">
        <h3 className="font-semibold text-lg mb-2">{podcastData?.total_episode || 0} Chapters</h3>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          episodeData?.map((item, index) => (
            <div
              key={index}
              className="mt-2 bg-gray-50 rounded-xl p-4 flex items-center justify-between hover:bg-gray-100 transition"
            >
              <div onClick={() => handleEpisode(item, index)} className="flex items-center gap-3 cursor-pointer">
                <div
                  style={{ background: "linear-gradient(49.06deg, #6B0DFF 19.36%, #FF6B79 76.77%)" }}
                  className="p-2 rounded-full"
                >
                  <Play size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-black">{index + 1}. {item?.title}</p>
                  <p className="text-xs text-gray-500">{item?.duration_format} mins</p>
                </div>
              </div>
              <Download
                onClick={() => handleDownload(item)}
                size={18}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              />
            </div>
          ))
        )}
      </div>

      {/* Key Learnings */}
      {!loading && bookDetails && bookDetails.length !== 0 && (
        <div className="mt-8 px-5 py-6 bg-white rounded-2xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Key Learnings</h2>
          <ul className="space-y-4">
            {bookDetails?.insights?.map((point: any, index: any) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="text-pink-500 mt-1" size={18} />
                <p className="text-gray-800 text-sm leading-snug">{point}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DetailsClient;
