import { openDB } from "idb";

const DB_NAME = "PodcastDB";
const STORE_NAME = "podcasts";

export async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      // Create object store if not exists
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
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

export async function playOfflinePodcast(id: any, audioRef: any) {
  const db = await getDB();
  const blob = await db.get(STORE_NAME, id);

  if (blob) {
    const url = URL.createObjectURL(blob);
    audioRef.current.src = url;
    await audioRef.current.play();
    console.log("▶️ Playing offline:", id);
  } else {
    console.log("⚠️ No offline file found for:", id);
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
  return value; // returns undefined if not found
}
