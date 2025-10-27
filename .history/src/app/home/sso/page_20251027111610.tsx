
import { Suspense } from "react";
import HomeClient from "../../../components/dashboard/home/HomeClient";

// Loading component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export default function SSOPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomeClient />
    </Suspense>
  );
}