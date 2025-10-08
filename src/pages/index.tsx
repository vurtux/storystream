'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardContent from '../components/dashboard/DashboardContent';
import Image from "next/image";

const LandingPage = () => {
  return (
    <div className="w-screen h-screen">
      <Image
        src="/images/landing.png"
        alt="Landing Background"
        fill
        className="object-cover"
        priority
      />
    </div>
  );
};

export default function Home() {
  const router = useRouter();
  const [showLanding, setShowLanding] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
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

  // Show landing page for 5 seconds
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
