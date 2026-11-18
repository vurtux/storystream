// src/utils/apiConfig.ts
/**
 * Centralized API configuration and key management.
 * Environment variables allow keys to be rotated or overridden at deploy-time without altering codebase.
 */

// One key for every call: the content routes answer the same for any valid key, and
// the iOS/Android app keys must not ship in this website's JavaScript.
export const API_KEYS = {
  FEED_AUTH: process.env.NEXT_PUBLIC_FEED_AUTH_KEY ?? '',
};

export const API_HEADERS = {
  DEVICE_OS: 'web',
};
