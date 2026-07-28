"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Plan = {
  plan_id: string;
  plan_name: string;
  price: string;
  period: string;
  billing: string;
  savings?: string | null;
};

export default function ManageSubscription() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const [currentPlanId, setCurrentPlanId] = useState("");
  const [currentPlan, setCurrentPlan] = useState("Daily");
  const [currentPrice, setCurrentPrice] = useState("R 5");
  const [nextChargeDate, setNextChargeDate] =
    useState("12 Nov 2025");

  const [showPopup, setShowPopup] = useState(false);

  // =====================================================
  // STATIC PLANS
  // =====================================================

  const plans: Plan[] = [
    {
      plan_id: "1658",
      plan_name: "Storystream (Daily)",
      price: "R 5",
      period: "Daily",
      billing: "R 5/day",
      savings: null,
    },
    {
      plan_id: "1660",
      plan_name: "Storystream (Weekly)",
      price: "R 25",
      period: "Weekly",
      billing: "R 25/week",
      savings: null,
    },
    {
      plan_id: "1659",
      plan_name: "Storystream (Monthly)",
      price: "R 80",
      period: "Monthly",
      billing: "R 80/month",
      savings: "36%",
    },
  ];

  // =====================================================
  // LOAD USER SUBSCRIPTION DATA
  // =====================================================

  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("loginData") || "{}"
      );

      const profile = stored?.profile;
      const vipInfo = stored?.vipInfo;

      if (!profile?.userId) {
        return;
      }

      // User ID
      setUserId(String(profile.userId));

      // =================================================
      // SUBSCRIPTION STATUS
      // =================================================

      const vipActive =
        vipInfo?.isActive === 1 ||
        vipInfo?.isActive === 5;

      const profileVip = profile?.vip === 1;

      setIsSubscribed(vipActive || profileVip);

      // =================================================
      // CURRENT PLAN ID FROM API
      // =================================================

      const apiPlanId = String(
        vipInfo?.plan_id || ""
      );

      setCurrentPlanId(apiPlanId);

      // =================================================
      // FIND CURRENT PLAN FROM STATIC PLANS
      // =================================================

      const matchedPlan = plans.find(
        (plan) => plan.plan_id === apiPlanId
      );

      if (matchedPlan) {
        setCurrentPlan(matchedPlan.period);
        setCurrentPrice(matchedPlan.price);
      } else {
        // Fallback if plan ID is not found
        setCurrentPlan(
          vipInfo?.plan_name ||
          profile?.planType ||
          "Daily"
        );

        setCurrentPrice(
          vipInfo?.price ||
          profile?.price ||
          "R 5"
        );
      }

      // =================================================
      // EXPIRY / NEXT CHARGE DATE
      // =================================================

      const rawDate =
        vipInfo?.expiry_date ||
        profile?.nextCharge;

      if (rawDate) {
        let dateValue: string | number = rawDate;

        // Handle timestamp if API returns timestamp
        if (
          !isNaN(Number(rawDate)) &&
          String(rawDate).length > 8
        ) {
          dateValue = Number(rawDate);
        }

        const date = new Date(dateValue);

        if (!isNaN(date.getTime())) {
          const formattedDate =
            date.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });

          setNextChargeDate(formattedDate);
        } else {
          setNextChargeDate(
            String(rawDate).split(/[T ]/)[0]
          );
        }
      }
    } catch (error) {
      console.error(
        "Error loading subscription data:",
        error
      );
    }
  }, []);

  // =====================================================
  // UPGRADE PLANS
  // =====================================================

  const upgradePlans = plans.filter((plan) => {
    // Daily (1658)
    // Upgrade options: Weekly + Monthly
    if (currentPlanId === "1658") {
      return (
        plan.plan_id === "1660" ||
        plan.plan_id === "1659"
      );
    }

    // Weekly (1660)
    // Upgrade option: Monthly
    if (currentPlanId === "1660") {
      return plan.plan_id === "1659";
    }

    // Monthly (1659)
    // No upgrade available
    if (currentPlanId === "1659") {
      return false;
    }

    return false;
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">

      <div className="bg-white shadow-md rounded-2xl p-6 max-w-md w-full text-center">

        {/* LOGO */}
        <Image
          src="/images/subscriptionLogo.png"
          alt="Subscription"
          width={80}
          height={80}
          className="mx-auto mb-4"
        />

        {/* TITLE */}
        <h2 className="text-2xl font-semibold text-purple-700 mb-3">
          Manage Subscription
        </h2>

        {/* ================================================= */}
        {/* ACTIVE SUBSCRIPTION */}
        {/* ================================================= */}

        {isSubscribed ? (
          <>
            {/* CURRENT PLAN DETAILS */}

            <p className="text-gray-700 mb-4 leading-relaxed">
              <strong>Current Plan:</strong>{" "}
              {currentPlan}
              <br />

              <strong>Price:</strong>{" "}
              {currentPrice}
              <br />

              <strong>Next Charge Due On:</strong>{" "}
              {nextChargeDate}
            </p>

            {/* CANCEL INSTRUCTION */}

            <div className="bg-red-100 text-red-700 font-semibold p-4 rounded-xl mb-6">
              To Cancel dial{" "}
              <span className="font-bold">
                135*997#
              </span>
            </div>

            {/* ================================================= */}
            {/* UPGRADE OPTIONS */}
            {/* ================================================= */}

            {upgradePlans.length > 0 && (
              <div className="border-t pt-4">

                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Switch to another plan
                </h3>

                <div className="space-y-3">

                  {upgradePlans.map((plan) => (
                    <div
                      key={plan.plan_id}
                      onClick={() => {
                        setShowPopup(true);
                      }}
                      className="border border-purple-300 rounded-xl p-4 bg-purple-50 cursor-pointer hover:bg-purple-100 transition"
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
            )}
          </>
        ) : (

          /* ================================================= */
          /* NO ACTIVE SUBSCRIPTION */
          /* ================================================= */

          <>
            <p className="text-gray-700 mb-4">
              You currently don’t have an active
              subscription.
            </p>

            <button
              onClick={() =>
                router.push("/subscribe")
              }
              className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-xl w-full transition font-semibold"
            >
              Subscribe Now
            </button>
          </>
        )}

        {/* TERMS & CONDITIONS */}

        <div
          onClick={() =>
            window.open("/tnc.html", "_self")
          }
          className="mt-6 text-purple-600 cursor-pointer underline text-sm"
        >
          Terms & Conditions
        </div>

        {/* BACK TO PROFILE */}

        <div
          onClick={() =>
            router.push("/dashboard/profile")
          }
          className="mt-2 text-purple-600 cursor-pointer underline text-sm"
        >
          ← Back to Profile
        </div>

      </div>

      {/* ================================================= */}
      {/* UPGRADE POPUP */}
      {/* ================================================= */}

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

          <div className="relative w-full max-w-sm mx-4 bg-white rounded-2xl shadow-lg border border-gray-200">

            <div className="p-6 text-center">

              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Upgrade Plan
              </h2>

              <p className="text-gray-600 text-sm mb-5">
                To upgrade your plan, cancel your
                existing subscription and re-subscribe.
              </p>

              <button
                onClick={() => {
                  setShowPopup(false);
                  router.push("/subscribe");
                }}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium shadow hover:brightness-110 transition"
              >
                Okay
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}