// "use client";
// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import { Trash2 } from "lucide-react";
// import {
//   deleteEpisodeOffline,
//   getAllDownloadedPodcasts,
// } from "../../utils/indexDB";
// import slugify from "slugify";
// import { useRouter } from "next/navigation";

// interface OfflinePodcast {
//   episode_id: string;
//   imageBlob: Blob;
//   audioBlob: Blob;
//   createdAt: string;
//   imageUrl?: string;
//   title: string;
// }

// const PodcastLibrary = () => {
//   const router = useRouter();
//   const [podcasts, setPodcasts] = useState<OfflinePodcast[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Modal state
//   const [showModal, setShowModal] = useState(false);
//   const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null);

//   const handleEpisode = (episode_id: string, title: string) => {
//     router.push(
//       `/episode/${encodeURIComponent(episode_id)}/${slugify(title, {
//         lower: true,
//       })}`
//     );
//   };

//   const confirmDelete = (episode_id: string) => {
//     setSelectedEpisode(episode_id);
//     setShowModal(true);
//   };

//   const handleDelete = async () => {
//     if (!selectedEpisode) return;

//     const success = await deleteEpisodeOffline(selectedEpisode);
//     if (success) {
//       setPodcasts((prev) =>
//         prev.filter((p) => p.episode_id !== selectedEpisode)
//       );
//       setShowModal(false);
//       setSelectedEpisode(null);
//     }
//   };
//   useEffect(() => {
//     async function loadOfflinePodcasts() {
//       try {
//         const episodes = await getAllDownloadedPodcasts();
// console.log(episodes, "episodes");

// // Convert image blob to URL with validation
// const withUrls = episodes.map((ep: any) => {
//   let imageUrl = "/images/loginLogo.png"; // fallback
  
//   // if (ep.imageBlob) {
//   //   // Check if blob has correct image type
//   //   if (ep.imageBlob.type.startsWith('image/')) {
//   //     imageUrl = URL.createObjectURL(ep.imageBlob);
//   //   } else {
//   //     console.log('Invalid image blob type:', ep.imageBlob.type, 'for episode:', ep.episode_id);
//   //     // If blob has wrong type but valid image data, recreate with correct type
//   //     // You might need to determine the correct type based on your data
//   //   }
//   // }
  
//   return {
//     ...ep,
//     imageUrl,
//   };
// });
// console.log(withUrls, "withUrls");

// setPodcasts(withUrls);
//       } catch (err) {
//         console.error("❌ Error loading offline podcasts:", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadOfflinePodcasts();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen">
//         <p className="text-gray-500 text-lg">Loading your downloads...</p>
//       </div>
//     );
//   }

//   if (podcasts.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen">
//         <Image
//           src="/images/not-found.png"
//           alt="No Data"
//           width={200}
//           height={200}
//         />
//         <p className="mt-4 text-lg font-semibold">No Downloaded Podcasts</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white pb-20">
//       {/* Podcast List */}
//       <div className="mt-5 space-y-5 px-5">
//         {podcasts.map((podcast: any) => (
//           <div key={podcast.episode_id} className="flex items-center gap-4">
//             <img
//               src={podcast.imageDataUrl ?? "/images/loginLogo.png"}
//               onClick={() => handleEpisode(podcast.episode_id, podcast?.title)}
//               alt={podcast.episode_id}
//               width={40}
//               height={40}
//               className="rounded-lg object-cover mr-4 cursor-pointer"
//             />
//             <div className="flex-1">
//               <h3 className="text-md font-semibold text-gray-800">
//                 Episode {podcast.episode_id}
//               </h3>
//               <p className="text-sm text-gray-500">
//                 Saved | {new Date(podcast.createdAt).toLocaleTimeString()}
//               </p>
//             </div>
//             <Trash2
//               className="text-gray-500 cursor-pointer hover:text-red-500"
//               size={22}
//               onClick={() => confirmDelete(podcast.episode_id)}
//             />
//           </div>
//         ))}
//       </div>
//       {/* 🟢 Delete Confirmation Modal */}
//       {showModal && (
//         <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/10 z-50">
//           <div className="bg-white rounded-2xl shadow-lg p-6 w-80 text-center">
//             <h2 className="text-lg font-semibold text-gray-800">
//               Delete Downloaded File?
//             </h2>
//             <p className="text-gray-500 text-sm mt-2">
//              Are you sure you want to delete this downloaded file??
//             </p>

//             <div className="flex justify-center gap-4 mt-6">
//               <button
//                 className="px-4 py-2 bg-gray-200 rounded-lg text-gray-800 hover:bg-gray-300"
//                 onClick={() => setShowModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
//                 onClick={handleDelete}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PodcastLibrary;
