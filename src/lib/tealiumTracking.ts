// lib/tealiumTracking.ts

export interface UtagViewData {
  tealium_event: string;
  event_name: string;
  page_name: string;
  page_section: string;
  page_parent_domain: string;
  page_country: string;
  page_url: string;
  page_locale: string;
  page_title: string;
  page_platform: string;
  visitor_id_asset_active?: string;
  visitor_login_status: string;
  visitor_login_loyalty_points?: string;
  visitor_login_loyalty_redeemed?: string;
  page_load?: number;
  site_version: string;
  site_type: string;
  // Product data (optional)
  product_id?: string[];
  product_name?: string[];
  product_price?: string[];
  product_category?: string[];
  product_sku?: string[];
  product_type?: string;
  // Subscription data (optional)
  visitor_asset_plan_active?: string[];
  visitor_asset_plan_id_active?: string;
  visitor_asset_subscription_id_active?: string;
  visitor_asset_plan_name_active?: string[];
  visitor_asset_plan_type_active?: string;
  visitor_asset_plan_brand_active?: string;
  visitor_asset_duration_active?: string;
  visitor_assest_type_active?: string;
  visitor_assest_date_end_active?: string;
  visitor_assest_date_start_active?: string;
  visitor_addon_name_active?: string;
  visitor_addon_type_active?: string;
  visitor_addon_date_end_active?: string;
  visitor_addon_date_start_active?: string;
  // Transaction data (optional)
  transaction_id?: string;
  order_revenue?: string;
  subscription_type?: string;
  registration_date?: string;
  [key: string]: any; // Allow additional custom properties
}

declare global {
  interface Window {
    utag: {
      view: (data: UtagViewData) => void;
    };
  }
}

/**
 * Get platform type based on user agent
 */
export function getPlatform(): string {
  if (typeof navigator === 'undefined') return 'web-desktop';

  const ua = navigator.userAgent.toLowerCase();

  if (/mobile|android|iphone|ipod/.test(ua)) {
    if (/iphone|ipod|ipad/.test(ua)) {
      return 'ios';
    } else if (/android/.test(ua)) {
      return 'android';
    }
    return 'web-mobile';
  }

  if (/tablet|ipad/.test(ua)) {
    return 'web-tablet';
  }

  return 'web-desktop';
}

/**
 * Get last path segment from URL pathname
 */
export function getPageSection(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  return segments[segments.length - 1] || 'home';
}

/**
 * Build page name in Adobe Analytics format
 */
export function buildPageName(pathname: string): string {
  const domain = 'storystream';
  const segments = pathname.split('/').filter(Boolean);

  const section = segments[0] || 'home';
  const subsection = segments[1] || '';

  let pageName = `${domain}:${section}`;

  if (subsection) {
    pageName += `:${subsection}`;
  }

  pageName = pageName.toLowerCase().trim();
  pageName = pageName.replace(/[^a-z0-9:-]/g, '');

  if (pageName.length > 100) {
    pageName = pageName.substring(0, 100);
  }

  return pageName;
}

/**
 * Get event name based on pathname or custom event
 */
export function getEventName(pathname: string, customEvent?: string): string {
  if (customEvent) return customEvent;

  if (pathname.includes('login') || pathname.includes('auth')) return 'login';
  if (pathname.includes('signup') || pathname.includes('register')) return 'registration';
  if (pathname.includes('subscription')) return 'subscription';

  return 'page_view';
}

/**
 * Get user country (default: South Africa for StoryStream)
 */
export function getUserCountry(): string {
  // TODO: Get from user's location or settings
  return 'South Africa';
}

/**
 * Get login status (default: loggedout)
 */
export function getLoginStatus(isLoggedIn?: boolean): string {
  return isLoggedIn ? 'loggedin' : 'loggedout';
}

/**
 * Main function to track page view with utag.view()
 */
export function trackPageView(options: {
  pathname: string;
  isLoggedIn?: boolean;
  userId?: string;
  loyaltyPoints?: string;
  loyaltyRedeemed?: string;
  customEvent?: string;
  productData?: Partial<UtagViewData>;
  subscriptionData?: Partial<UtagViewData>;
  transactionData?: Partial<UtagViewData>;
}): void {
  if (typeof window === 'undefined' || !window.utag || typeof window.utag.view !== 'function') {
    console.warn('⚠️ Tealium utag.view not loaded yet');
    return;
  }

  const {
    pathname,
    isLoggedIn = false,
    userId,
    loyaltyPoints,
    loyaltyRedeemed,
    customEvent,
    productData = {},
    subscriptionData = {},
    transactionData = {},
  } = options;

  const pageName = buildPageName(pathname);
  const pageSection = getPageSection(pathname);
  const platform = getPlatform();
  const country = getUserCountry();
  const loginStatus = getLoginStatus(isLoggedIn);

  // Base view data (ALWAYS required)
  const baseData: UtagViewData = {
    tealium_event: 'view',
    event_name: getEventName(pathname, customEvent),
    page_name: pageName,
    page_section: `storystream:${pageSection}`,
    page_parent_domain: 'storystream',
    page_country: country,
    page_url: typeof window !== 'undefined' ? window.location.href : '',
    page_locale: 'za',
    page_title: typeof document !== 'undefined' ? document.title : '',
    page_platform: platform,
    visitor_login_status: loginStatus,
    page_load: 1,
    site_version: '1.7',
    site_type: 'web',
  };

  // Add optional user data
  if (userId) {
    baseData.visitor_id_asset_active = userId;
  }
  if (loyaltyPoints) {
    baseData.visitor_login_loyalty_points = loyaltyPoints;
  }
  if (loyaltyRedeemed) {
    baseData.visitor_login_loyalty_redeemed = loyaltyRedeemed;
  }

  // Merge all data (product, subscription, transaction, custom)
  const finalData: UtagViewData = {
    ...baseData,
    ...productData,
    ...subscriptionData,
    ...transactionData,
  };

  console.log('📊 Tealium View Data:', finalData);

  // Send to Tealium
  window.utag.view(finalData);
}

/**
 * Track login event
 */
export function trackLogin(userId: string, pathname: string): void {
  trackPageView({
    pathname,
    isLoggedIn: true,
    userId,
    customEvent: 'login_successful',
  });
}

/**
 * Track signup event
 */
export function trackSignup(
  userId: string,
  pathname: string,
  registrationDate: string
): void {
  trackPageView({
    pathname,
    isLoggedIn: true,
    userId,
    customEvent: 'signup_successful',
    transactionData: {
      registration_date: registrationDate,
    },
  });
}

/**
 * Track signout event
 */
export function trackSignout(pathname: string): void {
  trackPageView({
    pathname,
    isLoggedIn: false,
    customEvent: 'signout',
  });
}

/**
 * Track order/purchase event
 */
export function trackOrderCompleted(
  pathname: string,
  userId: string,
  transactionData: Partial<UtagViewData>
): void {
  trackPageView({
    pathname,
    isLoggedIn: true,
    userId,
    customEvent: 'order_completed',
    transactionData,
  });
}

/**
 * Track subscription event
 */
export function trackSubscriptionCompleted(
  pathname: string,
  userId: string,
  subscriptionData: Partial<UtagViewData>
): void {
  trackPageView({
    pathname,
    isLoggedIn: true,
    userId,
    customEvent: 'subscription_completed',
    subscriptionData,
  });
}