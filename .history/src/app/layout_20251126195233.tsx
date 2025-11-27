'use client';
import { ReactNode } from 'react';
import Script from 'next/script';
import './globals.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { usePathname } from 'next/navigation';
import Menubar from './dashboard/menubar/page';
import { DashboardProvider } from '../context/DashboardProvider';
import ToastProvider from '../components/common/ToastProvider';
import { AudioProvider } from '../context/AudioProvider';

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? '';

  const hideNavbarOnRoutes = ['/auth/login', '/auth/verification'];
  const shouldShowNavbar = !hideNavbarOnRoutes.includes(pathname);

  return (
    <html lang="en">
      <head>
        {/* 🔹 StoryStream Meta Tags */}
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <title>StoryStream: Audio Books & Shows</title>
        <meta
          name="description"
          content="Discover a world of immersive audio experiences with StoryStream. Stream audio shows, audiobooks, podcasts, and much more. Available on iOS and Android."
        />
        <meta
          name="keywords"
          content="storystream, audio shows, audiobooks, podcasts, streaming audio, iOS, Android"
        />
        <meta name="author" content="StoryStream" />
        <link rel="canonical" href="https://www.storystream.mobi" />
        <meta name="robots" content="index, follow" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no"
        />

        {/* Favicons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
        <link rel="icon" href="/images/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
        <link rel="manifest" href="/images/site.webmanifest" />
        <link rel="icon" type="image/png" sizes="192x192" href="/images/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/images/android-chrome-512x512.png" />

        {/* Apple */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="StoryStream" />

        {/* OG Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="StoryStream: Audio Books & Shows" />
        <meta
          property="og:description"
          content="Discover immersive audio experiences. Stream audiobooks, podcasts, and shows."
        />
        <meta property="og:url" content="https://www.storystream.mobi" />
        <meta property="og:image" content="https://www.storystream.mobi/images/og-image.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="StoryStream: Audio Books & Shows" />
        <meta name="twitter:description" content="Discover immersive audio experiences." />
        <meta name="twitter:image" content="https://www.storystream.mobi/images/og-image.png" />
      </head>

      <body>
        {/* Tealium Config */}
        <Script id="utag-config">
          {`
            window.utag_cfg_ovrd = window.utag_cfg_ovrd || {};
            window.utag_cfg_ovrd.noview = true;
          `}
        </Script>

        {/* Load Tealium Async */}
        <Script
          src="https://tags.tiqcdn.com/utag/vodafone/za-storystream/prod/utag.js"
          strategy="afterInteractive"
        />

        <DashboardProvider>
          <AudioProvider>
            <main
              style={{ backgroundColor: '#FFFFFF' }}
              className={`flex-1 min-h-screen max-w-md w-full m-auto pt-0 px-3 overflow-y-auto thin-scrollbar ${
                shouldShowNavbar ? 'pb-16' : ''
              }`}
            >
              <ToastProvider />
              {children}
            </main>

            {shouldShowNavbar && <Menubar />}
          </AudioProvider>
        </DashboardProvider>
      </body>
    </html>
  );
}
