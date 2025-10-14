'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardContent from '../components/dashboard/DashboardContent';
import Image from "next/image";

const LandingPage = () => {
  return (
    <div className="relative w-full h-screen block md:hidden overflow-hidden">
      {/* Only visible on mobile (md:hidden) */}
      <div className="relative w-full h-full">
        <Image
          src="/images/landing.png"
          alt="Landing Background"
          fill
          className="object-contain"
          priority
          quality={100}
        />
      </div>
    </div>
  );
};

export default function Home() {
  const router = useRouter();
  const [showLanding, setShowLanding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Detect screen width
    const isMobile = window.innerWidth < 768; // md breakpoint
    if (isMobile) setShowLanding(true);

    const timer = setTimeout(() => {
      const token = localStorage.getItem('authToken');

      if (token) {
        setIsAuthenticated(true);
      } else {
        router.push('/home');
        localStorage.setItem('menu', 'home');
      }

      setShowLanding(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  // Show landing page only if mobile
  if (showLanding) return <LandingPage />;

  // If authenticated, show dashboard
  if (isAuthenticated) {
    return (
      <main>
        <h1>Welcome to the Dashboard</h1>
        <DashboardContent />
      </main>
    );
  }

  return null;
}
