import { openDB } from "idb";

const DB_NAME = "PodcastDB";
const DB_VERSION = 2; // ⬅️ bump this if you change store structure
const STORE_NAME = "episodes";

export async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      console.log("🆙 Running upgrade for DB version", DB_VERSION);

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "episode_id" });
        console.log("🎉 Object store created:", STORE_NAME);
      }
    },
  });
}

export async function savePodcast(podcastUrl: any, id: any) {
  const res = await fetch(podcastUrl);
  const blob = await res.blob();

  const db = await getDB();
  console.log(db, "db");
  await db.put(STORE_NAME, blob, id);
  console.log("✅ Saved for offline:", id);
}

// Helper function to convert blob to base64
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function saveEpisodeOffline(data: any) {
  const { episode_id, img_local_uri, stream_uri, title, podcast_name } = data;

  try {
    const db = await getDB();

    // Fetch audio
    const audioRes = await fetch(stream_uri);
    const audioBlob = await audioRes.blob();

        // Fetch image directly (no proxy)
    console.log('Fetching image from:', img_local_uri);
    const imageRes = await fetch(img_local_uri, {
      mode: 'cors', // Try direct CORS request
    });
    
    if (!imageRes.ok) {
      throw new Error(`Image fetch failed: ${imageRes.status} ${imageRes.statusText}`);
    }
    
    const imageBlob = await imageRes.blob();
    console.log('Image blob type:', imageBlob.type, 'size:', imageBlob.size);

    // Convert to base64
    const imageDataUrl = await blobToBase64(imageBlob);
    
    // Store both in IndexedDB
    await db.put("episodes", {
      episode_id,
      audioBlob,
      imageDataUrl,
      createdAt: new Date().toISOString(),
      title,
      podcast_name
    });

    console.log(`✅ Saved episode ${episode_id} for offline use`);
  } catch (err) {
    console.log("❌ Failed to save episode:", err);
  }
}

export async function getOfflineEpisode(episode_id: string) {
  const db = await getDB();
  const record = await db.get("episodes", episode_id);
  if (!record) {
    console.warn("⚠️ Episode not found offline:", episode_id);
    return null;
  }

  const audioUrl = URL.createObjectURL(record.audioBlob);
  const imageUrl = record.imageDataUrl;
  console.log(audioUrl, imageUrl, "audioUrl, imageUrl");

  return { audioUrl, imageUrl };
}

export async function playOfflinePodcast(id: any, audioRef: any) {
  const { audioUrl, imageUrl }: any = await getOfflineEpisode(id);

  if (audioUrl) {
    audioRef.current.src = audioUrl;
    await audioRef.current.play();
    console.log("▶️ Playing offline:", id);
    return { success: true, audioUrl, imageUrl };
  } else {
    console.log("⚠️ No offline file found for:", id);
    return {success: false};
  }
}

/**
 * ✅ Check if podcast is already downloaded
 * @param {string} id - The podcast ID
 * @returns {Promise<boolean>} true if already downloaded, false otherwise
 */
export async function isPodcastDownloaded(id: string): Promise<boolean> {
  const db = await getDB();
  const blob = await db.get(STORE_NAME, id);
  return !!blob;
}

export async function getValueByKey(key: string): Promise<any> {
  const db = await getDB();
  const value = await db.get(STORE_NAME, key);
  return value;
}

export async function getAllDownloadedPodcasts() {
  const db = await getDB();
  const tx = db.transaction("episodes", "readonly");
  const store = tx.objectStore("episodes");
  const allItems = await store.getAll();
  await tx.done;
  return allItems;
}

export async function deleteEpisodeOffline(episode_id: string) {
  try {
    const db = await getDB();
    await db.delete("episodes", episode_id);
    console.log(`🗑️ Deleted episode ${episode_id} from offline storage`);
    return true;
  } catch (err) {
    console.error("❌ Failed to delete episode:", err);
    return false;
  }
}
