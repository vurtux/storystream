/**
 * Utility to retrieve user's country code.
 * Priority Flow:
 * 1. localStorage (if previously cached)
 * 2. CDN headers (via /api/geo)
 * 3. Geo API fallback (ipify + GetGeoInfo)
 * 4. Default fallback ('ZA')
 */

export const getOrFetchUserCountry = async (): Promise<string> => {
  if (typeof window === 'undefined') {
    return 'ZA';
  }

  // 1. Check if country is already saved in localStorage
  const savedCountry = localStorage.getItem('country');
  if (savedCountry && savedCountry.trim() !== '') {
    return savedCountry;
  }

  // 2. Check CDN headers via /api/geo endpoint
  try {
    const cdnRes = await fetch('/api/geo');
    if (cdnRes.ok) {
      const cdnData = await cdnRes.json();
      if (cdnData?.country && typeof cdnData.country === 'string' && cdnData.country.trim() !== '') {
        const countryCode = cdnData.country.trim().toUpperCase();
        localStorage.setItem('country', countryCode);
        return countryCode;
      }
    }
  } catch (err) {
    console.warn('CDN country detection skipped or failed:', err);
  }

  // 3. Fallback: Fetch via GetGeoInfo API
  try {
    const ipRes = await fetch('https://api.ipify.org?format=json');
    if (!ipRes.ok) {
      throw new Error(`Failed to fetch IP: ${ipRes.statusText}`);
    }

    const ipData = await ipRes.json();
    const userIp = ipData?.ip;

    if (userIp) {
      const geoRes = await fetch(`https://capi.myuze.app/api/v1/feed/GetGeoInfo/1/${userIp}`);
      if (!geoRes.ok) {
        throw new Error(`Failed to fetch GeoInfo: ${geoRes.statusText}`);
      }

      const geoData = await geoRes.json();
      const result = geoData?.response?.result;

      if (geoData?.response?.status && result?.country) {
        const countryCode = result.country;
        localStorage.setItem('country', countryCode);

        if (result?.state) {
          localStorage.setItem('state', result.state);
        }

        return countryCode;
      }
    }
  } catch (error) {
    console.error('Error fetching country geo info:', error);
  }

  // 4. Default fallback if all detections fail
  const fallbackCountry = 'ZA';
  localStorage.setItem('country', fallbackCountry);
  return fallbackCountry;
};
