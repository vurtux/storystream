'use client';
import { ReactNode } from 'react';
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
        <meta httpEquiv="X-UA-Compatible" content="IE=Edge" />
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
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no"
        />
        <link rel="icon" href="/images/loginLogo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/loginLogo.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>

      <body className="">
        <DashboardProvider>
          <AudioProvider>
            <main
              style={{ backgroundColor: "#FFFFFF" }}
              className={`flex-1 min-h-screen max-w-md w-full m-auto pt-10 px-3 overflow-y-auto thin-scrollbar ${shouldShowNavbar ? 'pb-16' : ''
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
