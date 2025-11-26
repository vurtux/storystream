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

export const metadata = {
  title: 'StoryStream: Audio Books & Shows',
  description:
    'Discover a world of immersive audio experiences with StoryStream. Stream audio shows, audiobooks, podcasts, and more.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? '';
  const hideNavbarOnRoutes = ['/auth/login', '/auth/verification'];
  const shouldShowNavbar = !hideNavbarOnRoutes.includes(pathname);

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no"
        />

        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
        />
        <link rel="icon" href="/images/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/apple-touch-icon.png"
        />
        <link rel="manifest" href="/images/site.webmanifest" />
      </head>

      <body>
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

        {/* Tealium Config Script */}
        <Script id="utag-config">
          {`window.utag_cfg_ovrd = window.utag_cfg_ovrd || {};
           window.utag_cfg_ovrd.noview = true;`}
        </Script>

        {/* Tealium Async Loader */}
        <Script
          id="utag-loader"
          src="https://tags.tiqcdn.com/utag/vodafone/za-storystream/prod/utag.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
