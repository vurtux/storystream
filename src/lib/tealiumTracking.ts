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
  [key: string]: any;
}

declare global {
  interface Window {
    utag: {
      view: (data: UtagViewData) => void;
    };
    utag_cfg_ovrd: any;
  }
}

/**
 * Get platform type based on user agent
 */
export function getPlatform(): string {
  
    return 'web-mobile';

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
 * Format: domain:section:subsection
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
 * Get page URL
 */
export function getPageUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.href;
  }
  return '';
}

/**
 * Get page title
 */
export function getPageTitle(): string {
  if (typeof document !== 'undefined') {
    return document.title;
  }
  return '';
}

/**
 * Build product data for e-commerce tracking
 */
export function buildProductData(options: {
  productId?: string;
  productName?: string;
  productPrice?: string;
  productCategory?: string;
  productSku?: string;
  productType?: 'free' | 'paid';
}): Partial<UtagViewData> {
  const data: Partial<UtagViewData> = {};

  if (options.productId) {
    data.product_id = [options.productId];
  }
  if (options.productName) {
    data.product_name = [options.productName];
  }
  if (options.productPrice) {
    data.product_price = [options.productPrice];
  }
  if (options.productCategory) {
    data.product_category = [options.productCategory];
  }
  if (options.productSku) {
    data.product_sku = [options.productSku];
  }
  if (options.productType) {
    data.product_type = options.productType;
  }

  return data;
}

/**
 * Build subscription data
 */
export function buildSubscriptionData(options: {
  planActive?: string;
  planId?: string;
  subscriptionId?: string;
  planName?: string;
  planType?: string;
  planBrand?: 'video' | 'games' | 'audio';
  duration?: string;
  assetType?: 'free trial' | 'premium' | 'standard';
  dateStart?: string;
  dateEnd?: string;
  addonName?: string;
  addonType?: string;
  addonDateStart?: string;
  addonDateEnd?: string;
}): Partial<UtagViewData> {
  const data: Partial<UtagViewData> = {};

  if (options.planActive) {
    data.visitor_asset_plan_active = [options.planActive];
  }
  if (options.planId) {
    data.visitor_asset_plan_id_active = options.planId;
  }
  if (options.subscriptionId) {
    data.visitor_asset_subscription_id_active = options.subscriptionId;
  }
  if (options.planName) {
    data.visitor_asset_plan_name_active = [options.planName];
  }
  if (options.planType) {
    data.visitor_asset_plan_type_active = options.planType;
  }
  if (options.planBrand) {
    data.visitor_asset_plan_brand_active = options.planBrand;
  }
  if (options.duration) {
    data.visitor_asset_duration_active = options.duration;
  }
  if (options.assetType) {
    data.visitor_assest_type_active = options.assetType;
  }
  if (options.dateStart) {
    data.visitor_assest_date_start_active = options.dateStart;
  }
  if (options.dateEnd) {
    data.visitor_assest_date_end_active = options.dateEnd;
  }
  if (options.addonName) {
    data.visitor_addon_name_active = options.addonName;
  }
  if (options.addonType) {
    data.visitor_addon_type_active = options.addonType;
  }
  if (options.addonDateStart) {
    data.visitor_addon_date_start_active = options.addonDateStart;
  }
  if (options.addonDateEnd) {
    data.visitor_addon_date_end_active = options.addonDateEnd;
  }

  return data;
}

/**
 * Build transaction/order data
 */
export function buildTransactionData(options: {
  transactionId?: string;
  orderRevenue?: string;
  subscriptionType?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  registrationDate?: string;
}): Partial<UtagViewData> {
  const data: Partial<UtagViewData> = {};

  if (options.transactionId) {
    data.transaction_id = options.transactionId;
  }
  if (options.orderRevenue) {
    data.order_revenue = options.orderRevenue;
  }
  if (options.subscriptionType) {
    data.subscription_type = options.subscriptionType;
  }
  if (options.registrationDate) {
    data.registration_date = options.registrationDate;
  }

  return data;
}

/**
 * Combine multiple data objects
 */
export function combineData(...dataObjects: Partial<UtagViewData>[]): Partial<UtagViewData> {
  return dataObjects.reduce((acc, obj) => {
    return {
      ...acc,
      ...obj,
    };
  }, {});
}

/**
 * Main function to track page view with utag.view()
 * Pass only the data you have, rest is auto-generated
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

  // Auto-generate from pathname/document
  const pageName = buildPageName(pathname);
  const pageSection = getPageSection(pathname);
  const platform = getPlatform();
  const pageUrl = getPageUrl();
  const pageTitle = getPageTitle();
  const loginStatus = isLoggedIn ? 'loggedin' : 'loggedout';

  // Base view data (ALWAYS required)
  const baseData: UtagViewData = {
    tealium_event: 'view',
    event_name: getEventName(pathname, customEvent),
    page_name: pageName,
    page_section: `storystream:${pageSection}`,
    page_parent_domain: 'storystream',
    page_country: 'South Africa',
    page_url: pageUrl,
    page_locale: 'za',
    page_title: pageTitle,
    page_platform: platform,
    visitor_login_status: loginStatus,
    page_load: 1,
    site_version: '1.0.1',
    site_type: 'web',
  };

  // Add optional user data only if provided
  if (userId) {
    baseData.visitor_id_asset_active = userId;
  }
  if (loyaltyPoints) {
    baseData.visitor_login_loyalty_points = loyaltyPoints;
  }
  if (loyaltyRedeemed) {
    baseData.visitor_login_loyalty_redeemed = loyaltyRedeemed;
  }

  // Merge all data - only provided data is included
  const finalData: UtagViewData = {
    ...baseData,
    ...(Object.keys(productData).length > 0 && productData),
    ...(Object.keys(subscriptionData).length > 0 && subscriptionData),
    ...(Object.keys(transactionData).length > 0 && transactionData),
  };

  console.log('📊 Tealium View Data:', finalData);

  // Send to Tealium
  window.utag.view(finalData);
}

/**
 * Track login event
 * USAGE: trackLogin('user123', '/dashboard')
 */
// export function trackLogin(userId: string, pathname: string): void {
//   trackPageView({
//     pathname,
//     isLoggedIn: true,
//     userId,
//     customEvent: 'login_successful',
//   });
// }
export function trackLogin(
  pathname: string,
  userId: string,
  subscriptionData: Partial<UtagViewData>
): void {
  trackPageView({
    pathname,
    isLoggedIn: true,
    userId,
    customEvent: 'login_successful',
    subscriptionData,
  });
}

/**
 * Track signup event
 * USAGE: trackSignup('user123', '/dashboard', '2024-01-15')
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
    transactionData: buildTransactionData({ registrationDate }),
  });
}

/**
 * Track signout event
 * USAGE: trackSignout('/home')
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

/**
 * Track product view
 * USAGE: trackProductView(product, 'user123', '/podcast/details')
 */
export function trackProductView(
  product: any,
  userId: string,
  pathname: string
): void {
  const productData = buildProductData({
    productId: product.id,
    productName: product.name,
    productPrice: product.price?.toString() || '0',
    productCategory: product.category || 'Product',
    productSku: product.sku || product.id,
    productType: product.isPaid ? 'paid' : 'free',
  });

  trackPageView({
    pathname,
    isLoggedIn: true,
    userId,
    productData,
  });
}

/**
 * Track multiple products (list view)
 * USAGE: trackProductsList(products, 'user123', '/search')
 */
export function trackProductsList(
  products: any[],
  userId: string,
  pathname: string
): void {
  const productData = {
    product_id: products.map((p) => p.id),
    product_name: products.map((p) => p.name),
    product_price: products.map((p) => p.price?.toString() || '0'),
    product_category: products.map((p) => p.category || 'Product'),
    product_sku: products.map((p) => p.sku || p.id),
    product_type: products.some((p) => p.isPaid) ? 'paid' : 'free',
  };

  trackPageView({
    pathname,
    isLoggedIn: true,
    userId,
    productData,
  });
}