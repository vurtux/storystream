"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MdChevronLeft } from "react-icons/md";
import { getOrFetchUserCountry } from "../../utils/geo";
import { showSuccess, showError } from "../../utils/toastService";
import { getPolicyUrls } from "../../utils/policyUtils";

type Plan = {
  plan_id: string;
  plan_name: string;
  price: string;
  period: string;
  billing: string;
  savings?: string | null;
};

// Static plans for ZA
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

export default function ManageSubscription() {
  const router = useRouter();

  const [country, setCountry] = useState("ZA");
  const [userId, setUserId] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [vipInfo, setVipInfo] = useState<any>(null);
  const [profileInfo, setProfileInfo] = useState<any>(null);

  const [currentPlanId, setCurrentPlanId] = useState("");
  const [currentPlan, setCurrentPlan] = useState("Daily");
  const [currentPrice, setCurrentPrice] = useState("R 5");
  const [nextChargeDate, setNextChargeDate] = useState("12 Nov 2025");

  const [showPopup, setShowPopup] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Load User Subscription & Country
  useEffect(() => {
    getOrFetchUserCountry().then((c) => {
      if (c) setCountry(c.toUpperCase());
    });

    try {
      const stored = JSON.parse(localStorage.getItem("loginData") || "{}");
      const profile = stored?.profile;
      const vip = stored?.vipInfo;

      setProfileInfo(profile);
      setVipInfo(vip);

      if (profile?.userId) {
        setUserId(String(profile.userId));
      }

      const vipActive = vip?.isActive === 1 || vip?.isActive === 5;
      const profileVip = profile?.vip === 1;
      setIsSubscribed(vipActive || profileVip);

      const apiPlanId = String(vip?.plan_id || "");
      setCurrentPlanId(apiPlanId);

      const matchedPlan = plans.find((plan) => plan.plan_id === apiPlanId);

      if (matchedPlan) {
        setCurrentPlan(matchedPlan.period);
        setCurrentPrice(matchedPlan.price);
      } else {
        setCurrentPlan(vip?.plan_name || profile?.planType || "Daily");
        setCurrentPrice(vip?.price || profile?.price || "R 5");
      }

      const rawDate = vip?.expiry_date || vip?.renew_date_tz || profile?.nextCharge;
      if (rawDate) {
        let dateValue: string | number = rawDate;
        if (!isNaN(Number(rawDate)) && String(rawDate).length > 8) {
          dateValue = Number(rawDate);
        }
        const date = new Date(dateValue);
        if (!isNaN(date.getTime())) {
          setNextChargeDate(
            date.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          );
        } else {
          setNextChargeDate(String(rawDate).split(/[T ]/)[0]);
        }
      }
    } catch (error) {
      console.error("Error loading subscription data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const upgradePlans = plans.filter((plan) => {
    if (currentPlanId === "1658") {
      return plan.plan_id === "1660" || plan.plan_id === "1659";
    }
    if (currentPlanId === "1660") {
      return plan.plan_id === "1659";
    }
    return false;
  });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "--";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "--";
      return (
        d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) +
        ", " +
        d.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    } catch {
      return "--";
    }
  };

  const getProgress = () => {
    const subDate = vipInfo?.sub_date_tz || vipInfo?.sub_date;
    const renewDate = vipInfo?.renew_date_tz || vipInfo?.renew_date || vipInfo?.expiry_date;
    if (!subDate || !renewDate) return 0;
    const now = new Date().getTime();
    const start = new Date(subDate).getTime();
    const end = new Date(renewDate).getTime();
    if (isNaN(start) || isNaN(end) || end <= start) return 0;
    if (now < start) return 0;
    if (now > end) return 1;
    return (now - start) / (end - start);
  };

  const handleConfirmCancel = () => {
    try {
      setIsSubscribed(false);
      const stored = JSON.parse(localStorage.getItem("loginData") || "{}");
      if (stored.vipInfo) stored.vipInfo.isActive = 0;
      if (stored.profile) stored.profile.vip = 0;
      localStorage.setItem("loginData", JSON.stringify(stored));
      localStorage.setItem("isSubscribed", "false");

      showSuccess("Successfully unsubscribed.");
      setShowCancelModal(false);
      setTimeout(() => {
        router.back();
      }, 800);
    } catch (err) {
      console.error(err);
      showError("Unable to unsubscribe.");
    }
  };

  const isZA = country.toUpperCase() === "ZA";

  // =====================================================
  // ZA (SOUTH AFRICA) UI
  // =====================================================
  if (isZA) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50 text-black">
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

          {isSubscribed ? (
            <>
              {/* CURRENT PLAN DETAILS */}
              <p className="text-gray-700 mb-4 leading-relaxed">
                <strong>Current Plan:</strong> {currentPlan}
                <br />
                <strong>Price:</strong> {currentPrice}
                <br />
                <strong>Next Charge Due On:</strong> {nextChargeDate}
              </p>

              {/* CANCEL INSTRUCTION */}
              <div className="bg-red-100 text-red-700 font-semibold p-4 rounded-xl mb-6">
                To Cancel dial <span className="font-bold">*135*997#</span>
              </div>

              {/* UPGRADE OPTIONS */}
              {upgradePlans.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Switch to another plan
                  </h3>
                  <div className="space-y-3">
                    {upgradePlans.map((plan) => (
                      <div
                        key={plan.plan_id}
                        onClick={() => setShowPopup(true)}
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

          {/* TERMS & CONDITIONS */}
          <div
            onClick={() => {
              const { termsUrl } = getPolicyUrls();
              window.open(termsUrl, "_self");
            }}
            className="mt-6 text-purple-600 cursor-pointer underline text-sm"
          >
            Terms & Conditions
          </div>

          {/* BACK TO PROFILE */}
          <div
            onClick={() => router.push("/dashboard/profile")}
            className="mt-2 text-purple-600 cursor-pointer underline text-sm"
          >
            ← Back to Profile
          </div>
        </div>

        {/* UPGRADE POPUP */}
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="relative w-full max-w-sm mx-4 bg-white rounded-2xl shadow-lg border border-gray-200">
              <div className="p-6 text-center">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Upgrade Plan
                </h2>
                <p className="text-gray-600 text-sm mb-5">
                  To upgrade your plan, cancel your existing subscription and re-subscribe.
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

  // =====================================================
  // NON-ZA (GLOBAL / OTHER COUNTRIES) UI
  // =====================================================
  const progress = getProgress();
  const isActive = isSubscribed;
  const renewDate = vipInfo?.renew_date_tz || vipInfo?.renew_date || vipInfo?.expiry_date;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black flex flex-col items-center">
      {/* App Bar / Header */}
      <div className="w-full max-w-md bg-white h-14 px-4 flex items-center justify-between border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="p-1 rounded-full hover:bg-gray-100 transition text-black"
          aria-label="Back"
        >
          <MdChevronLeft className="text-3xl text-gray-800" />
        </button>
        <h1 className="text-base font-semibold text-gray-900">
          Manage Subscription
        </h1>
        <div className="w-8" />
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md p-5 flex-1">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 transition-all">
            {/* Card Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Image
                  src="/images/loginLogo.png"
                  alt="StoryStream Logo"
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain"
                />
                <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  StoryStream Pro
                </span>
              </div>
              <div className="flex items-center space-x-1.5 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${isActive ? "bg-green-500 animate-pulse" : "bg-gray-400"
                    }`}
                />
                <span
                  className={`text-xs font-bold ${isActive ? "text-green-600" : "text-gray-500"
                    }`}
                >
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-green-100 rounded-full mb-4 overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(Math.max(progress * 100, 5), 100)}%` }}
              />
            </div>

            {/* Plan Name */}
            <h3 className="text-base font-bold text-gray-900 mb-4">
              {vipInfo?.plan_name || "StoryStream Pro"}
            </h3>

            {/* Info Table */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-medium text-gray-900">Subscription Plan</span>
                <span className="font-medium text-gray-500">StoryStream Pro</span>
              </div>

              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-medium text-gray-900">Amount</span>
                <span className="font-medium text-gray-500">
                  {vipInfo?.price || vipInfo?.plan_name || "R 5"}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-medium text-gray-900">Subscription Date</span>
                <span className="font-medium text-gray-500">
                  {formatDate(vipInfo?.sub_date_tz || vipInfo?.sub_date)}
                </span>
              </div>

              {isActive && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-900">Next Renewal Date</span>
                  <span className="font-medium text-gray-500">
                    {formatDate(renewDate)}
                  </span>
                </div>
              )}

              {isActive && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-900">Mode of Payment</span>
                  <span className="font-medium text-gray-500">
                    {vipInfo?.billing_mode || "Online"}
                  </span>
                </div>
              )}

              <div className="flex justify-between py-2">
                <span className="font-medium text-gray-900">Subscription Status</span>
                <span
                  className={`font-semibold ${isActive ? "text-green-600" : "text-gray-500"
                    }`}
                >
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {!isActive && (
                <div className="mt-4 p-3 bg-gray-50 border border-gray-200/60 rounded-xl">
                  <p className="font-medium text-gray-900 text-xs">
                    Your subscription is inactive.
                  </p>
                  <p className="font-medium text-gray-500 text-xs mt-1">
                    It will expire on {formatDate(renewDate)}.
                  </p>
                </div>
              )}
            </div>

            {/* Cancel Button */}
            {isActive && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="text-pink-600 hover:text-pink-700 font-bold text-sm flex items-center space-x-1 cursor-pointer transition active:scale-98"
                >
                  <span>Cancel Subscription ?</span>
                  <span>&gt;</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Cancel Subscription
            </h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Are you sure you want to cancel your subscription?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow transition cursor-pointer"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}