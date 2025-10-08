'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardContent from '../components/dashboard/DashboardContent';
import Image from "next/image";

const LandingPage = () => {
  return (
    <section className="flex items-center justify-center h-screen w-full bg-gradient-to-br from-[#FF6A3D] via-[#FF4E8B] to-[#7A3DE4] relative overflow-hidden">
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 bg-cover bg-center"></div>

      {/* Gradient Glow Effects */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-pink-400/40 blur-[160px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/40 blur-[160px] rounded-full"></div>

      {/* Center Content */}
      <div className="relative flex flex-col items-center justify-center text-center z-10">
        <div className="bg-white rounded-3xl p-6 shadow-lg flex items-center justify-center">
          <Image src="/images/audio.png" alt="StoryStream Logo" width={120} height={120} />
        </div>

        <h1 className="text-white font-extrabold text-3xl sm:text-4xl mt-6 tracking-wide">
          STORYSTREAM
        </h1>

        <p className="text-white/70 mt-2 text-sm sm:text-base">
          Stories that Speak. Voices that Inspire.
        </p>
      </div>

      {/* Bottom Glow Border */}
      <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-pink-400 via-orange-400 to-purple-500 blur-sm opacity-70"></div>
    </section>
  );
}


export default function Home() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');

        if (token) {
            setIsAuthenticated(true);
        } else {
            router.push('/home');
            localStorage.setItem('menu', 'home');
        }
        setIsLoading(false);
    }, [router]);

    if (isLoading) return <div>Loading...</div>;

    if (!isAuthenticated) return null;

    return (
        <main>
            <h1>Welcome to the Dashboard</h1>
            {/* Your protected content here */}
            <DashboardContent />
        </main>
    );
}
