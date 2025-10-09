'use client';
import { ReactNode} from 'react';
import './globals.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { usePathname } from 'next/navigation'
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
      <body className="">
        <DashboardProvider>
          <AudioProvider>
            <main
              style={{ backgroundColor: "#FFFFFF" }}
              className={`flex-1 min-h-screen max-w-md w-full m-auto p-3 overflow-y-auto thin-scrollbar ${shouldShowNavbar ? 'pb-16' : ''}`}
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
