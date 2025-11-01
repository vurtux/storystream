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
  const [currentPlan, setCurrentPlan] = useState("Daily");

  const plans = [

    {
      price: "R 25",
      period: "Weekly",
      billing: "R 25/week",
      savings: null,
      link: "https://dcb.storystream.mobi/?deviceId=134018989792035997&country=za&serviceid=5239&m=t",
    },
    {
      price: "R 80",
      period: "Monthly",
      billing: "R 80/month",
      savings: "36%",
      link: "https://dcb.storystream.mobi/?deviceId=134018989792035997&country=za&serviceid=5240&m=t",
    },
  ];

 
  useEffect(() => {
  if (typeof window !== "undefined") {
    const storedData = JSON.parse(localStorage.getItem("loginData") || "{}");
    if (storedData?.profile?.userId) {
      setUserId(storedData.profile.userId);
      setIsSubscribed(storedData.profile?.vip === 1);
      setCurrentPlan(storedData.profile?.planType || "Daily");
    }
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
      const updatedData = JSON.parse(localStorage.getItem("loginData") || "{}");
      if (updatedData?.profile) {
        updatedData.profile.isPaid = false;
        updatedData.profile.planType = "";
      }
      localStorage.setItem("loginData", JSON.stringify(updatedData));
      router.push("/subscribe");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (link: string) => {
    window.open(link, "_self");
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
              <strong>Current Plan:</strong> {currentPlan} Plan
              <br />
              If you wish to change your package, please cancel your current
              subscription first and then subscribe to another plan.
            </p>

            <button
              onClick={handleCancelSubscription}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-xl w-full transition font-semibold disabled:opacity-70"
            >
              {loading ? "Cancelling..." : "Cancel Subscription"}
            </button>

            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Switch to another plan
              </h3>
              <div className="space-y-3">
                {plans
                  .filter((p) => p.period !== currentPlan)
                  .map((plan) => (
                    <div
                      key={plan.period}
                      onClick={() => handlePlanSelect(plan.link)}
                      className="border border-purple-300 rounded-xl p-4 cursor-pointer hover:bg-purple-50 transition"
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-left">
                          <h4 className="font-semibold text-purple-700">
                            {plan.period} Plan
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {plan.billing}
                            {plan.savings && (
                              <span className="ml-2 text-green-600 font-medium">
                                Save {plan.savings}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="text-purple-700 font-semibold">
                          {plan.price}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
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
