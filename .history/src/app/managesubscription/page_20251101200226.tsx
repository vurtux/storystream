"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";

export default function ManageSubscription() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("loginData") || "{}");
    if (storedData?.profile?.userId) {
      setUserId(storedData.profile.userId);
      setIsSubscribed(storedData.profile?.isPaid || false);
    }
  }, []);

  const handleCancelSubscription = async () => {
    if (!userId) {
      toast.error("User not logged in");
      router.push("/subscribe");
      return;
    }

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel your subscription?"
    );
    if (!confirmCancel) return;

    try {
      setLoading(true);
      // TODO: replace with your API endpoint
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cancel-subscription/${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error("Failed to cancel subscription");

      toast.success("Subscription cancelled successfully");
      setIsSubscribed(false);
      // Optionally update localStorage
      const updatedData = JSON.parse(localStorage.getItem("loginData") || "{}");
      if (updatedData?.profile) updatedData.profile.isPaid = false;
      localStorage.setItem("loginData", JSON.stringify(updatedData));
      router.push("/subscribe");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <div className="bg-white shadow-md rounded-2xl p-6 max-w-md w-full text-center">
        <Image
          src="/images/subscriptionLogo.png"
          alt="Subscription"
          width={80}
          height={80}
          className="mx-auto mb-4"
        />
        <h2 className="text-2xl font-semibold text-purple-700 mb-3">
          Manage Subscription
        </h2>

        {isSubscribed ? (
          <>
            <p className="text-gray-700 mb-4">
              You are currently subscribed to a StoryStream package.
              <br />
              If you wish to change your package, please cancel your current
              subscription first and then subscribe to another package.
            </p>

            <button
              onClick={handleCancelSubscription}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-xl w-full transition font-semibold disabled:opacity-70"
            >
              {loading ? "Cancelling..." : "Cancel Subscription"}
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-700 mb-4">
              You currently don’t have an active subscription.
            </p>
            <button
              onClick={() => router.push("/subscribe")}
              className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-xl w-full transition font-semibold"
            >
              Subscribe Now
            </button>
          </>
        )}

        <div
          onClick={() => router.push("/dashboard/profile")}
          className="mt-6 text-purple-600 cursor-pointer underline text-sm"
        >
          ← Back to Profile
        </div>
      </div>
    </div>
  );
}
