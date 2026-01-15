// lib/utagData.js

export function initializeUtagData() {
  
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const url = typeof window !== 'undefined' ? window.location.href : '';
  
  
  window.utag_data = {
    page_name: getPageName(pathname),
    page_type: getPageType(pathname),
    page_title: typeof document !== 'undefined' ? document.title : '',
    page_url: url,
  };
  
  console.log('utag_data initialized:', window.utag_data);
}

function getPageName(pathname) {
 
  const segments = pathname.split('/').filter(Boolean);
  return segments[0] || 'home';
}

function getPageType(pathname) {
  
  if (pathname.includes('blog')) return 'blog';
  if (pathname.includes('products')) return 'product';
  if (pathname.includes('contact')) return 'contact';
  if (pathname.includes('about')) return 'about';
  return 'standard';
}