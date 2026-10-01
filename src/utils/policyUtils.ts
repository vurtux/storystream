/**
 * Utility functions to get country-specific Privacy Policy and Terms & Conditions URLs.
 */

export interface PolicyUrls {
  privacyPolicyUrl: string;
  termsUrl: string;
}

/**
 * Returns the appropriate Privacy Policy and Terms & Conditions URLs based on country code.
 * @param countryCode Two-letter country code (e.g. 'ZA', 'KE', 'NG') or country name
 */
export const getPolicyUrls = (countryCode?: string): PolicyUrls => {
  let country = countryCode;
  if (!country && typeof window !== 'undefined') {
    country = localStorage.getItem('country') || '';
  }

  const normCountry = (country || '').trim().toLowerCase();

  // South Africa uses Vodacom-specific pp.html and tnc.html
  if (normCountry === 'za' || normCountry === 'south africa') {
    return {
      privacyPolicyUrl: '/pp.html',
      termsUrl: '/tnc.html',
    };
  }

  // Fallback for all other countries to global/general versions
  return {
    privacyPolicyUrl: '/pp_global.html',
    termsUrl: '/tnc_global.html',
  };
};
