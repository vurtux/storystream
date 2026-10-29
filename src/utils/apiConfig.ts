// src/utils/apiConfig.ts
/**
 * Centralized API configuration and key management.
 * Environment variables allow keys to be rotated or overridden at deploy-time without altering codebase.
 */

export const API_KEYS = {
  // Main feed & authentication key
  FEED_AUTH: process.env.NEXT_PUBLIC_FEED_AUTH_KEY || '3ab0242fb7a6f01b9c2467dd221a43a5',
  // Content & profile details key
  CONTENT_FEED: process.env.NEXT_PUBLIC_CONTENT_FEED_KEY || 'eb3fb92a88badce847f88fb8c9bb9be6',
  // Home layout & curation key
  HOME_FEED: process.env.NEXT_PUBLIC_HOME_FEED_KEY || 'a995570eea6c716c8305ea42213a853d',
};

export const API_HEADERS = {
  DEVICE_OS: 'web',
};
