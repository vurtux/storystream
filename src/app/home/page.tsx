// /app/home/page.tsx
import HomeClient from "../../components/dashboard/home/HomeClient";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeClient />
    </Suspense>
  );
}
