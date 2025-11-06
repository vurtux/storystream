// "use client";

// import React, { useEffect, useState, useRef, useCallback } from "react";
// import {
//   ArrowLeft,
//   Share2,
//   Play,
//   Download,
//   CircleCheckBig,
//   BookOpen,
//   Lightbulb,
//   User,
//   CheckCircle,
// } from "lucide-react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import useDashboard from "../../hooks/useDashboard";
// import { handlePodcastPaging } from "../../app/api/podcast";
// import { useAudio } from "../../hooks/useAudio";
// import slugify from "slugify";
// import SubscribePage from "./SubscribePage";
// import { isPodcastDownloaded, savePodcast } from "../../utils/indexDB";
// import { showSuccess } from "../../utils/toastService";

// interface PodcastDetail {
//   podcast_id: number;
//   title: string;
//   description: string;
//   copyright: string;
//   language: string;
//   link_uri: string;
//   img_remote_uri: string;
//   img_local_uri: string;
//   img_height: number;
//   img_width: number;
//   img_type: string;
//   added_on: string;
//   total_episode: number;
//   total_following: number;
//   category: string;
//   artiste_id: number | null;
//   artist_name: string | null;
//   is_billable: number;
//   ptype: string;
//   total_duration: string;
// }

// interface PodcastEpisodeDetail {
//   episode_id: number;
//   title: string;
//   description: string;
//   subtitle: string;
//   imgid: number;
//   episodetype: string;
//   keywords: string;
//   episode_seq: number;
//   duration: number;
//   playback_count: number;
//   isexplicit: string;
//   stream_uri: string;
//   stream_url: string;
//   download_url: string;
//   length: number;
//   img_remote_uri: string;
//   img_local_uri: string;
//   img_height: number | null;
//   img_width: number | null;
//   img_type: string | null;
//   added_on: string;
//   pubdate: string;
//   duration_format: string;
//   playback_count_format: string;
//   player_icon_url: string;
//   is_billable: number;
// }

// const DetailsClient = ({ conId, title }: any) => {
//   const router = useRouter();

//   const { setEpisodeId, detailData, setShowSubscriptionDialog } =
//     useDashboard();
//   const [downloadedEpisodes, setDownloadedEpisodes] = useState<Record<number, boolean>>({});
//   const { setCurrentAudio, setAudioList } = useAudio();
//   const [bookDetails, setBookDetails] = useState<any>(null);
//   const [podcastData, setPodcastData] = useState<PodcastDetail>();
//   const [episodeData, setEpisodeData] = useState<PodcastEpisodeDetail[]>([]);
//   const [showFullDescription, setShowFullDescription] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [isPaid, setIsPaid] = useState(false);

//   useEffect(() => {
//     const isVip = localStorage.getItem("loginData");
//     if (isVip) {
//       try {
//         const parsed = JSON.parse(isVip);
//         if (parsed?.profile?.vip === 1) {
//           setIsPaid(true);
//         }
//       } catch (err) {
//         console.log("Invalid loginData:", err);
//       }
//     }
//   }, []);

//   const observerTarget = useRef<HTMLDivElement>(null);

//   const confirm = () => {
//     setShowSubscriptionDialog(true);
//   };

//   const handleEpisode = (item: PodcastEpisodeDetail, index: number) => {
//     try {
//       const isVip: any = localStorage.getItem("loginData");
//       if (!isVip) {
//         confirm();
//         return;
//       }

//       // Check if it's already an object or needs parsing
//       let parsedData;
//       try {
//         parsedData = typeof isVip === 'string' ? JSON.parse(isVip) : isVip;
//       } catch (e) {
//         console.log("Failed to parse loginData:", e);
//         confirm();
//         return;
//       }

//       if (!parsedData?.profile || parsedData?.profile?.vip !== 1) {
//         confirm();
//       } else {
//         setCurrentAudio(index);
//         setEpisodeId(item.episode_id);
//         router.push(
//           `/episode/${encodeURIComponent(item.episode_id)}/${slugify(item.title, {
//             lower: true,
//           })}`
//         );
//       }
//     } catch (error) {
//       console.log("Error in handle episode", error);
//     }
//   };

//   const handlePlayButton = () => {
//     if (episodeData && episodeData.length > 0) {
//       handleEpisode(episodeData[0], 0);
//     }
//   };

//   const handleShareClick = async () => {
//     const shareUrl = window.location.href;

//     if (navigator.share) {
//       try {
//         await navigator.share({
//           url: shareUrl,
//         });
//       } catch (error) {
//         console.log("Sharing failed:", error);
//       }
//     } else {
//       await navigator.clipboard.writeText(shareUrl);
//       alert("Link copied to clipboard!");
//     }
//   };

//   const fetchData = async (pageNum: number = 1, isLoadMore: boolean = false) => {
//     try {
//       if (isLoadMore) {
//         setLoadingMore(true);
//       } else {
//         setLoading(true);
//       }

//       const lang: any = localStorage.getItem("language") || "";
//       const country = localStorage.getItem("country") || "";

//       const result = await handlePodcastPaging({
//         conId: Number(conId),
//         page: pageNum,
//         debug: false,
//         test: "1122",
//         lang: lang,
//         country,
//       });

//       const podcast_details = result.response.podcast.podcast_details;
//       const new_episodes = result.response.podcast.podcast_episode_details;

//       if (!isLoadMore) {
//         setPodcastData(podcast_details);
//         setBookDetails(result.response.podcast.book_details);
//         setEpisodeData(new_episodes);
//         for (const ep of new_episodes) {
//           const exists = await isPodcastDownloaded(ep.episode_id.toString());
//           setDownloadedEpisodes(prev => ({
//           ...prev,
//           [ep.episode_id]: exists,
//         }));
//         }

//         const episodeIds = new_episodes.map((item: any) => item.episode_id);
//         setAudioList(episodeIds);
//       } else {
//         // Append new episodes to existing ones
//         for (const ep of new_episodes) {
//           const exists = await isPodcastDownloaded(ep.episode_id);
//           setDownloadedEpisodes(prev => ({
//           ...prev,
//           [ep.episode_id]: exists,
//         }));
//         }
//         setEpisodeData(prev => {
//           const updated = [...prev, ...new_episodes];
//           return updated;
//         });

//         setAudioList((prevList: number[]) => [...prevList, ...new_episodes.map((item: any) => item.episode_id)]);
//       }

//       // Check if there are more episodes to load
//       const totalLoaded = isLoadMore ? episodeData.length + new_episodes.length : new_episodes.length;

//       if (new_episodes.length === 0 || totalLoaded >= podcast_details.total_episode) {
//         setHasMore(false);
//       }
//     } catch (error) {
//       console.log("Failed to fetch podcast:", error);
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//     }
//   };

//   // Load more episodes when observer triggers
//   const loadMore = useCallback(() => {
//     if (!loadingMore && hasMore) {
//       setPage(prev => prev + 1);
//     }
//   }, [loadingMore, hasMore]);

//   // Intersection Observer setup
//   useEffect(() => {
//     if (!observerTarget.current) return; // avoid null ref

//     const observer = new IntersectionObserver(
//       entries => {
//         if (entries[0].isIntersecting && hasMore && !loadingMore) {
//           loadMore();
//         }
//       },
//       { threshold: 0.1, rootMargin: '100px' }
//     );

//     const currentTarget = observerTarget.current;
//     observer.observe(currentTarget);

//     return () => {
//       if (currentTarget) observer.unobserve(currentTarget);
//     };
//   }, [episodeData, loadMore, hasMore, loadingMore]);


//   // Fetch more data when page changes
//   useEffect(() => {
//     if (page > 1) {
//       fetchData(page, true);
//     }
//   }, [page]);

//   // Initial fetch
//   useEffect(() => {
//     fetchData(1, false);
//   }, [detailData, conId]);

//   const renderDescription = () => {
//     const description = podcastData?.description || "";
//     if (description?.length <= 150) return description;

//     return showFullDescription ? (
//       <>
//         {description}
//         <span
//           className="text-blue-500 ml-2 cursor-pointer"
//           onClick={() => setShowFullDescription(false)}
//         >
//           Read Less
//         </span>
//       </>
//     ) : (
//       <>
//         {description.slice(0, 150)}...
//         <span
//           className="text-blue-500 ml-2 cursor-pointer"
//           onClick={() => setShowFullDescription(true)}
//         >
//           Read More
//         </span>
//       </>
//     );
//   };

//   const handleDownload = async(item: any) => {
//     try {
//       const isVip: any = localStorage.getItem("loginData");
//       if (!isVip) {
//         confirm();
//         return;
//       }

//       // Check if it's already an object or needs parsing
//       let parsedData;
//       try {
//         parsedData = typeof isVip === 'string' ? JSON.parse(isVip) : isVip;
//       } catch (e) {
//         console.log("Failed to parse loginData:", e);
//         confirm();
//         return;
//       }

//       if (!parsedData?.profile || parsedData?.profile?.vip !== 1) {
//         confirm();
//       } else {
//         const isAlreadyDownloaded = await isPodcastDownloaded(item?.episode_id);
//         if(isAlreadyDownloaded) {
//             showSuccess("Already Downloaded!");
//             return;
//         }
//         savePodcast(item?.stream_uri, item?.episode_id?.toString());
//         setDownloadedEpisodes(prev => ({
//           ...prev,
//           [item.episode_id]: true,
//         }));
//         showSuccess("Downloaded successfully!");
//         // const link = document.createElement("a");
//         // link.href = item.download_url || item.stream_url;
//         // link.download = `${item.title || "podcast"}.mp3`;
//         // link.click();
//       }
//     } catch (error) {
//       console.log("Error downloading:", error);
//     }
//   };

//   return (
//     <div>
//       {/* Hero Section */}
//       <div className="relative rounded-tl-lg rounded-tr-lg max-h-[400px] mx-[-12px]">
//         <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/30 to-transparent z-10" />

//         {loading ? (
//           <div className="w-full h-[400px] bg-gray-300 animate-pulse" />
//         ) : podcastData?.img_local_uri ? (
//           <>
//             <Image
//               src={podcastData.img_local_uri}
//               alt="Podcast Cover"
//               height={400}
//               width={428}
//               className="w-full h-[400px] object-cover"
//             />
//             <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-white/100 to-transparent"></div>
//           </>
//         ) : null}

//         <div className="absolute top-4 left-4 text-white z-20">
//           <ArrowLeft
//             onClick={() => router.back()}
//             className="cursor-pointer w-[25px] h-[30px]"
//           />
//         </div>

//         <div className="absolute top-4 right-4 text-white z-20">
//           <Share2
//             onClick={handleShareClick}
//             className="cursor-pointer w-[25px] h-[30px]"
//           />
//         </div>
//       </div>

//       <div className="text-center mt-4">
//         {loading ? (
//           <div className="h-6 w-2/3 mx-auto bg-gray-200 animate-pulse rounded" />
//         ) : (
//           <>
//             <h2 className="text-2xl font-bold mx-4">{podcastData?.title}</h2>
//             {podcastData?.ptype === "book" && (
//               <>
//                 <p className="text-gray-800 font-semibold">
//                   {podcastData?.artist_name}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   {bookDetails?.duration_display_mins} mins
//                 </p>
//               </>
//             )}
//           </>
//         )}
//       </div>

//       {podcastData?.ptype === "book" && (
//         <div className="flex justify-center gap-1 mt-4 flex-wrap">
//           {loading ? (
//             <div className="w-full h-6 bg-gray-100 animate-pulse rounded" />
//           ) : (
//             <>
//               <div className="flex items-center gap-1 px-3 py-1 rounded-md text-sm">
//                 <User size={14} /> {bookDetails?.categories || "Self Growth"}
//               </div>
//               <div className="flex items-center gap-1 px-3 py-1 rounded-md text-sm">
//                 <BookOpen size={14} /> {podcastData?.total_episode} Chapters
//               </div>
//               <div className="flex items-center gap-1 px-3 py-1 rounded-md text-sm">
//                 <Lightbulb size={14} /> {bookDetails?.insights_count || 16}{" "}
//                 Insights
//               </div>
//             </>
//           )}
//         </div>
//       )}

//       <div className="mt-6">
//         {isPaid ? (
//           <button
//             onClick={handlePlayButton}
//             style={{
//               background:
//                 "radial-gradient(92.09% 394.93% at 7.91% 50%, #6B0DFF 0%, #FF6B79 100%)",
//             }}
//             className="w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 cursor-pointer"
//           >
//             <Play size={18} /> Play Now
//           </button>
//         ) : (
//           <button
//             onClick={() => router.push("/subscribe")}
//             style={{
//               background:
//                 "radial-gradient(92.09% 394.93% at 7.91% 50%, #6B0DFF 0%, #FF6B79 100%)",
//             }}
//             className="w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 cursor-pointer"
//           >
//             <Play size={18} /> Subscribe Now
//           </button>
//         )}
//       </div>


//       {podcastData?.ptype === "book" && (
//         <div className="mt-6">
//           <h3 className="font-semibold text-xl text-gray-900">Description</h3>
//           <div className="text-sm mt-2">
//             {loading ? (
//               <div className="h-20 bg-gray-100 animate-pulse rounded" />
//             ) : (
//               renderDescription()
//             )}
//           </div>
//         </div>
//       )}

//       <div className="mt-6">
//         <h3 className="font-semibold text-lg">
//           {podcastData?.total_episode || 0}{" "}
//           {podcastData?.ptype === "book" ? "Chapters" : "Episodes"}
//         </h3>

//         {loading ? (
//           <div className="space-y-3 mt-4">
//             {[...Array(3)].map((_, i) => (
//               <div
//                 key={i}
//                 className="h-16 bg-gray-100 animate-pulse rounded-xl"
//               />
//             ))}
//           </div>
//         ) : (
//           <>
//             {episodeData?.map((item, index) => (
//               <div
//                 className="mt-1 bg-gray-100 rounded-xl p-4 flex items-center justify-between"
//                 key={item.episode_id}
//               >
//                 <div
//                   onClick={() => handleEpisode(item, index)}
//                   className="flex items-center gap-3 select-none"
//                 >
//                   <div
//                     style={{
//                       background:
//                         "linear-gradient(49.06deg, #6B0DFF 19.36%, #FF6B79 76.77%)",
//                     }}
//                     className="p-2 rounded-full"
//                   >
//                     <Play size={20} className="text-white cursor-pointer" />
//                   </div>
//                   <div>
//                     <p className="font-semibold text-sm text-black">
//                       {index + 1}. {item?.title}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       {item?.duration_format} mins
//                     </p>
//                   </div>
//                 </div>
//                 {downloadedEpisodes[item.episode_id] ? (
//                 <CircleCheckBig
//                   size={18}
//                   className="text-green-600 cursor-default"
//                 />
//               ) : (
//                 <Download
//                   onClick={() => handleDownload(item)}
//                   size={18}
//                   className="text-gray-700 cursor-pointer hover:text-black"
//                 />
//               )}
//               </div>
//             ))}

//             {/* Loading indicator for more episodes */}
//             {loadingMore && (
//               <div className="space-y-3 mt-4">
//                 {[...Array(2)].map((_, i) => (
//                   <div
//                     key={i}
//                     className="h-16 bg-gray-100 animate-pulse rounded-xl"
//                   />
//                 ))}
//               </div>
//             )}

//             {/* Observer target - invisible element at the end */}
//             {hasMore && (
//               <div
//                 ref={observerTarget}
//                 className="h-10 w-full flex items-center justify-center"
//                 style={{ minHeight: '40px' }}
//               >
//                 <span className="text-gray-400 text-sm">Loading more...</span>
//               </div>
//             )}

//             {/* No more episodes message */}

//           </>
//         )}
//       </div>

//       {!loading && bookDetails && bookDetails.length !== 0 && (
//         <div className="max-w-2xl mx-auto mt-6 p-6 bg-white shadow-md rounded-xl border border-gray-100">
//           <h2 className="text-2xl font-semibold mb-6">Key Learnings</h2>
//           <ul className="space-y-6">
//             {bookDetails?.insights?.map((point: any, index: any) => (
//               <li key={index} className="flex items-start space-x-3">
//                 <CheckCircle className="text-pink-500 mt-1" size={20} />
//                 <p className="text-gray-800">{point}</p>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       <SubscribePage />
//     </div>
//   );
// };

// export default DetailsClient;

"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  ArrowLeft,
  Share2,
  Play,
  Download,
  CircleCheckBig,
  BookOpen,
  Lightbulb,
  User,
  CheckCircle,
  X,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useDashboard from "../../hooks/useDashboard";
import { handlePodcastPaging } from "../../app/api/podcast";
import { useAudio } from "../../hooks/useAudio";
import slugify from "slugify";
import SubscribePage from "./SubscribePage";
import { isPodcastDownloaded, savePodcast } from "../../utils/indexDB";
import { showSuccess } from "../../utils/toastService";

interface PodcastDetail {
  podcast_id: number;
  title: string;
  description: string;
  total_episode: number;
  artist_name: string;
  ptype: string;
  img_local_uri: string;
}

interface PodcastEpisodeDetail {
  episode_id: number;
  title: string;
  duration_format: string;
  stream_uri: string;
}

const DetailsClient = ({ conId }: any) => {
  const router = useRouter();

  const { detailData, setShowSubscriptionDialog, setEpisodeId } = useDashboard();
  const { setAudioList, setCurrentAudio } = useAudio();

  const [podcastData, setPodcastData] = useState<PodcastDetail | null>(null);
  const [episodeData, setEpisodeData] = useState<PodcastEpisodeDetail[]>([]);
  const [bookDetails, setBookDetails] = useState<any>(null);

  const [downloadedEpisodes, setDownloadedEpisodes] = useState<Record<number, boolean>>({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [isPaid, setIsPaid] = useState(false);
  const [showPendingSheet, setShowPendingSheet] = useState(false);

  const observerRef = useRef<HTMLDivElement>(null);

  // ✅ LOGIN CHECK — redirect if user is not logged in
  useEffect(() => {
    try {
      const raw = localStorage.getItem("loginData");
      if (!raw) {
        router.replace("/auth/login");
        return;
      }

      const data = JSON.parse(raw);

      if (data?.profile?.isLoggedin !== 1) {
        router.replace("/auth/login");
        return;
      }
    } catch {
      router.replace("/auth/login");
    }
  }, []);

  // ✅ subscription check
  const checkSubscriptionStatus = () => {
    try {
      const raw = localStorage.getItem("loginData");
      if (!raw) return { isPending: false, isPaid: false };

      const data = JSON.parse(raw);

      const isPending = data?.vipInfo?.isActive === 5;
      const isPaid = isPending ? true : data?.profile?.vip === 1;

      return { isPending, isPaid };
    } catch {
      return { isPending: false, isPaid: false };
    }
  };

  useEffect(() => {
    const { isPending, isPaid } = checkSubscriptionStatus();
    setIsPaid(isPaid);
  }, []);

  const openSubscribe = () => setShowSubscriptionDialog(true);
  const openPending = () => setShowPendingSheet(true);

  // ✅ Play episode button
  const handleEpisode = (item: PodcastEpisodeDetail, index: number) => {
    const raw = localStorage.getItem("loginData");
    if (!raw) return openSubscribe();

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return openSubscribe();
    }

    if (data?.vipInfo?.isActive === 5) return openPending();
    if (!data?.profile?.vip) return openSubscribe();

    setCurrentAudio(index);
    setEpisodeId(item.episode_id);

    router.push(`/episode/${item.episode_id}/${slugify(item.title, { lower: true })}`);
  };

  const handlePlayButton = () => {
    if (episodeData.length > 0) handleEpisode(episodeData[0], 0);
  };

  // ✅ downloading episode
  const handleDownload = async (item: PodcastEpisodeDetail) => {
    try {
      const raw = localStorage.getItem("loginData");
      if (!raw) return openSubscribe();

      const data = JSON.parse(raw);

      if (data?.vipInfo?.isActive === 5) return openPending();
      if (!data?.profile?.vip) return openSubscribe();

      const exists = await isPodcastDownloaded(item.episode_id.toString);
      if (exists) return showSuccess("Already Downloaded");

      await savePodcast(item.stream_uri, item.episode_id.toString());
      setDownloadedEpisodes((prev) => ({ ...prev, [item.episode_id]: true }));
      showSuccess("Downloaded!");
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ loading episodes
  const fetchData = async (pageNum = 1, loadMore = false) => {
    try {
      loadMore ? setLoadingMore(true) : setLoading(true);

      const lang = localStorage.getItem("language") || "";
      const country = localStorage.getItem("country") || "";

      const res = await handlePodcastPaging({
        conId: Number(conId),
        page: pageNum,
        lang,
        country,
        debug: false,
      });

      const pd = res.response.podcast.podcast_details;
      const eps = res.response.podcast.podcast_episode_details;

      if (!loadMore) {
        setPodcastData(pd);
        setBookDetails(res.response.podcast.book_details);
        setEpisodeData(eps);

        const ids = eps.map((e: any) => e.episode_id);
        setAudioList(ids);
      } else {
        setEpisodeData((prev) => [...prev, ...eps]);
      }

      if (eps.length === 0 || (episodeData.length + eps.length) >= pd.total_episode) {
        setHasMore(false);
      }

      for (const e of eps) {
        const exists = await isPodcastDownloaded(e.episode_id);
        setDownloadedEpisodes((prev) => ({ ...prev, [e.episode_id]: exists }));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // ✅ infinite scroll
  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) setPage((p) => p + 1);
  }, [loadingMore, hasMore]);

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.2 }
    );

    const current = observerRef.current;
    observer.observe(current);

    return () => current && observer.unobserve(current);
  }, [episodeData, hasMore, loadingMore]);

  useEffect(() => {
    if (page > 1) fetchData(page, true);
  }, [page]);

  useEffect(() => {
    fetchData(1, false);
  }, [detailData, conId]);

  return (
    <div>
      {/* ✅ HERO IMAGE */}
      <div className="relative max-h-[400px] mx-[-12px]">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/20 to-transparent z-10"></div>

        {loading ? (
          <div className="w-full h-[370px] bg-gray-200 animate-pulse" />
        ) : (
          <>
            <Image
              src={podcastData?.img_local_uri || ""}
              height={400}
              width={428}
              alt="cover"
              className="w-full h-[370px] object-cover"
            />
            <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-white"></div>
          </>
        )}

        <ArrowLeft
          onClick={() => router.back()}
          className="absolute top-4 left-4 text-white cursor-pointer"
        />
        <Share2
          onClick={() => navigator.share?.({ url: window.location.href })}
          className="absolute top-4 right-4 text-white cursor-pointer"
        />
      </div>

      {/* ✅ HEADER TEXT */}
      <div className="text-center mt-4">
        <h2 className="text-2xl font-bold">{podcastData?.title}</h2>
        {podcastData?.ptype === "book" && (
          <p className="text-gray-600">{podcastData?.artist_name}</p>
        )}
      </div>

      {/* ✅ PLAY BUTTON */}
      <div className="mt-6">
        {isPaid ? (
          <button
            onClick={handlePlayButton}
            className="w-full py-3 rounded-xl text-white font-semibold"
            style={{ background: "linear-gradient(45deg,#6B0DFF,#FF6B79)" }}
          >
            <Play size={20} /> Play Now
          </button>
        ) : (
          <button
            onClick={() => router.push("/subscribe")}
            className="w-full py-3 rounded-xl text-white font-semibold"
            style={{ background: "linear-gradient(45deg,#6B0DFF,#FF6B79)" }}
          >
            <Play size={20} /> Subscribe Now
          </button>
        )}
      </div>

      {/* ✅ EPISODES LIST */}
      <div className="mt-6">
        <h3 className="font-semibold text-lg mb-3">
          {podcastData?.total_episode} Episodes
        </h3>

        {episodeData.map((ep, index) => (
          <div
            key={ep.episode_id}
            className="bg-gray-100 rounded-xl p-4 flex justify-between items-center mb-2"
          >
            <div className="flex items-center w-full">
              <div
                className="p-2 rounded-full cursor-pointer"
                style={{
                  background: "linear-gradient(49deg,#6B0DFF,#FF6B79)",
                }}
                onClick={() => handleEpisode(ep, index)}
              >
                <Play size={18} className="text-white" />
              </div>

              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">
                  {index + 1}. {ep.title}
                </p>
                <p className="text-xs text-gray-500">{ep.duration_format} mins</p>
              </div>
            </div>

            {downloadedEpisodes[ep.episode_id] ? (
              <CircleCheckBig size={18} className="text-green-600" />
            ) : (
              <Download
                size={18}
                className="text-gray-700 cursor-pointer"
                onClick={() => handleDownload(ep)}
              />
            )}
          </div>
        ))}

        {loadingMore && <p className="text-center text-gray-400 mt-4">Loading...</p>}

        {hasMore && (
          <div ref={observerRef} className="h-10 flex items-center justify-center">
            <span className="text-gray-400 text-sm">Loading more…</span>
          </div>
        )}
      </div>

      {/* ✅ PENDING SUBSCRIPTION SHEET */}
      {showPendingSheet && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center"
          onClick={() => setShowPendingSheet(false)}
        >
          <div
            className="bg-white rounded-t-3xl p-6 w-full max-w-md mb-10 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-full">
                  <AlertCircle size={24} className="text-orange-600" />
                </div>
                <h3 className="text-xl font-bold">Subscription Pending</h3>
              </div>
              <X size={24} className="cursor-pointer" onClick={() => setShowPendingSheet(false)} />
            </div>

            <p className="text-gray-700 mb-6">
              Your subscription payment is pending. Please complete payment to continue.
            </p>

            <div className="flex gap-3">
              <button
                className="flex-1 py-3 border rounded-xl"
                onClick={() => setShowPendingSheet(false)}
              >
                Cancel
              </button>
              <button
                onClick={() => router.push("/subscribe")}
                className="flex-1 py-3 rounded-xl text-white"
                style={{ background: "linear-gradient(45deg,#6B0DFF,#FF6B79)" }}
              >
                Complete Payment
              </button>
            </div>
          </div>
        </div>
      )}

      <SubscribePage />

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.35s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DetailsClient;
