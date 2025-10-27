// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4" style={{ color: '#000000' }}>
      <div className="text-center">
        {/* Error Code */}
        <h1 className="text-6xl font-bold mb-4" style={{ color: '#000000' }}>
          404
        </h1>
        
        {/* Error Message */}
        <h2 className="text-2xl font-semibold mb-2" style={{ color: '#1F2937' }}>
          Page Not Found
        </h2>
        
        {/* Description */}
        <p className="mb-8 max-w-md" style={{ color: '#4B5563' }}>
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        
        {/* Back to Home Button */}
        <Link
          href="/dashboard"
          className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}