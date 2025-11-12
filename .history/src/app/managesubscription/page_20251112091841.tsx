"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ManageSubscription() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("Daily");
  const [currentPrice, setCurrentPrice] = useState("R 5");
  const [nextChargeDate, setNextChargeDate] = useState("12 Nov 2025");

  const plans = [
    {
      price: "R 25",
      period: "Weekly",
      billing: "R 25/week",
      savings: null,
    },
    {
      price: "R 80",
      period: "Monthly",
      billing: "R 80/month",
      savings: "36%",
    },
  ];

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("loginData") || "{}");

    if (stored?.profile?.userId) {
      setUserId(stored.profile.userId);

      // ✅ PRIORITY: Treat as subscribed if isActive === 5 OR profile.vip === 1
      const vipActive = stored?.vipInfo?.isActive === 5;
      const profileVip = stored?.profile?.vip === 1;
      setIsSubscribed(vipActive || profileVip);

      // Set current plan/price/date if available
      setCurrentPlan(stored.vipInfo?.plan_name || stored.profile?.planType || "Daily");
      setCurrentPrice(stored.vipInfo?.price || stored.profile?.price || "R 5");
     setNextChargeDate(
  (stored.vipInfo?.expiry_date || stored.profile?.nextCharge || "12 Nov 2025").split("T")[0]
);
;
    }
  }, []);

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
            <p className="text-gray-700 mb-4 leading-relaxed">
              <strong>Current Plan:</strong> {currentPlan} <br />
              <strong>Price:</strong> {currentPrice} <br />
              <strong>Next Charge Due On:</strong> {nextChargeDate}
            </p>

            <div className="bg-red-100 text-red-700 font-semibold p-4 rounded-xl mb-6">
              To Cancel dial <span className="font-bold">135*997#</span>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Switch to another plan
              </h3>

              <div className="space-y-3">
                {plans.map((plan) => (
                  <div
                    key={plan.period}
                    className="border border-purple-300 rounded-xl p-4 bg-purple-50 opacity-80 cursor-default"
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

                      <div className="text-purple-700 font-semibold">{plan.price}</div>
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
          onClick={() => window.open("/tnc.html", "_self")}
          className="mt-6 text-purple-600 cursor-pointer underline text-sm"
        >
          Terms & Conditions
        </div>

        <div
          onClick={() => router.push("/dashboard/profile")}
          className="mt-2 text-purple-600 cursor-pointer underline text-sm"
        >
          ← Back to Profile
        </div>
      </div>
    </div>
  );
}
