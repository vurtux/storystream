'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardContent from '../components/dashboard/DashboardContent';

export default function Home() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');

        if (token) {
            setIsAuthenticated(true);
        } else {
            router.push('/auth/login');
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
