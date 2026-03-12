"use client";
import React, { useEffect, useState } from "react";
import { handleHome } from "../../../app/api/home";
import SquareShape from "./SquareShape";
import HeaderSlider from "../DashboardHeader";
import { handleValidate, handleGetProfile } from "../../../app/api/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { showSuccess } from "../../../utils/toastService";
import useAuth from "../../../hooks/useAuth";
import Image from "next/image";
import {
  trackLogin,
  buildSubscriptionData,
  trackSubscriptionCompleted
} from "../../../lib/tealiumTracking";
type SpotlightContent = {
  conId: number;
  conName: string;
  imgIrl: string;
  cotDeepLink: string;
  spotlight_type: string;
  btn_tag: string;
};

type SquareContent = {
  conId: number;
  conName: string;
  imgIrl: string;
  cotDeepLink: string;
  artist_name: string;
  is_billable: number;
  ptype: string;
};

type SpotlightBlock = {
  bkId: number;
  bkName: string;
  bkType: string;
  shapeType: "spotlight";
  zoom: number;
  itype: number;
  contents: SpotlightContent[];
};

type SquareBlock = {
  bkId: number;
  bkName: string;
  bkType: string;
  shapeType: "square";
  zoom: number;
  itype: number;
  contents: SquareContent[];
};

type Block = SpotlightBlock | SquareBlock;

type HomeData = {
  [key: string]: Block[];
};

const HomeClient = () => {
  const router = useRouter();
  const searchParams: any = useSearchParams();
  const { setAuth } = useAuth();
  const [homeData, setHomeData] = useState<HomeData>();
  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupBody, setPopupBody] = useState("");
  const [popupButton, setPopupButton] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  // Fetch home data
  const getHomeData = async () => {
    try {
      const lang = localStorage.getItem("language") || "en";
      const country = localStorage.getItem("country") || "";
      const res = await handleHome(lang, country);
      setHomeData(res.response.home);
    } catch (error) {
      console.log("Error fetching home data:", error);
    }
  };

  // Initial auth validation if `sid` exists
  useEffect(() => {
    const sid = searchParams.get("sid");
    const countryParam = searchParams.get("country");
    const langParam = searchParams.get("lang");

    if (countryParam) {
      localStorage.setItem("country", countryParam);
    }

    if (langParam) {
      localStorage.setItem("language", langParam);
    }

    if (!sid || isValidating) return;

    setIsValidating(true);

    const validateUser = async () => {
      try {
        // 1️⃣ Validate session
        const validateRes = await handleValidate({ sid });

        if (!validateRes?.response?.status) {
          throw new Error("Session validation failed");
        }

        // 2️⃣ Fetch profile
        const userId = validateRes.response.profile.userId;
        const profileRes = await handleGetProfile(userId);

        const profile = profileRes.response.profile;
        const vipInfo = profileRes.response.vipInfo;

        // 3️⃣ Save auth & localStorage
        setAuth({ userInfo: profile });

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("loginData", JSON.stringify(profileRes.response));
        localStorage.setItem("mobile", profile.mobileNo);
        localStorage.setItem("menu", "home");

        // 5️⃣ Tracking login
        const userType = profile.vip === 1 ? "paid" : "free";
        const subscriptionData = (profile.vip === 1 && vipInfo) ? buildSubscriptionData({
          subscriptionId: vipInfo.plan_id,
          planName: vipInfo.plan_name,
          planId: vipInfo.plan_id,
          planType: "Subscription",
          planBrand: "audio",
          duration: calculateDuration(vipInfo.sub_date, vipInfo.expiry_date),
          assetType: "premium",
          dateStart: new Date(vipInfo.sub_date).toLocaleDateString("en-ZA"),
          dateEnd: new Date(vipInfo.expiry_date).toLocaleDateString("en-ZA"),
        }) : {};

        trackLogin(
          "/dashboard/home",
          userId.toString(),
          userType,
          subscriptionData
        );

        console.log("📊 Tracked login:", {
          userId,
          vip: profile.vip,
          mobileNo: profile.mobileNo,
        });

        router.push("/home");
      } catch (error) {
        console.error("Error validating user:", error);
        setPopupTitle("Login Failed");
        setPopupBody("Unable to verify your session. Please try again.");
        setPopupButton("Retry");
        setShowPopup(true);
      } finally {
        setIsValidating(false);
      }
    };

    validateUser();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);


  // Handle country change & popup display
  useEffect(() => {
    const popupParam = searchParams.get("popup");
    const countryParam = searchParams.get("country");
    const langParam = searchParams.get("lang");

    if (countryParam) {
      localStorage.setItem("country", countryParam);
    }

    if (langParam) {
      localStorage.setItem("language", langParam);
    }

    // Handle popup based on parameter value
    if (popupParam === "0") {
      setPopupTitle("Subscription Failed");
      setPopupBody(
        "We couldn't process your subscription. Please try again or contact support if the issue persists."
      );
      setPopupButton("Try Again");
      setShowPopup(true);
    } else if (popupParam === "1") {
      setPopupTitle("Welcome to Storystream!");
      setPopupBody(
        "Thank you for subscribing. Click Home below to continue with your subscription."
      );
      setPopupButton("Home");
      setShowPopup(true);

      // Track subscription completed
      try {
        const stored = JSON.parse(localStorage.getItem("loginData") || "{}");
        if (stored?.profile?.userId) {
          const userId = stored.profile.userId;
          const vipInfo = stored.vipInfo;

          if (vipInfo) {
            const subscriptionData = buildSubscriptionData({
              subscriptionId: vipInfo.plan_id,
              planName: vipInfo.plan_name,
              planId: vipInfo.plan_id,
              planType: "Subscription",
              planBrand: "audio",
              duration: calculateDuration(vipInfo.sub_date, vipInfo.expiry_date),
              assetType: "premium",
              dateStart: new Date(vipInfo.sub_date).toLocaleDateString("en-ZA"),
              dateEnd: new Date(vipInfo.expiry_date).toLocaleDateString("en-ZA"),
            });

            trackSubscriptionCompleted("/home", userId.toString(), subscriptionData);
          }
        }
      } catch (e) {
        console.error("Error tracking sub success:", e);
      }
    } else if (popupParam === "2") {
      setPopupTitle("Welcome Back");
      setPopupBody(
        "You are already a subscriber. Click Continue below to continue enjoying Storystream."
      );
      setPopupButton("Continue");
      setShowPopup(true);
    }

    // Fetch home data
    getHomeData();
  }, [searchParams]);

  // Render home blocks
  const renderBlocks = () => {
    if (!homeData) return null;

    return Object.keys(homeData).map((key) => {
      const blockArray = (homeData as HomeData)[key];
      if (!Array.isArray(blockArray) || blockArray.length === 0) return null;

      const shapeType = blockArray[0].shapeType;

      if (shapeType === "square") {
        return <SquareShape key={key} data={blockArray[0]} />;
      }

      if (shapeType === "spotlight") {
        return <HeaderSlider key={key} data={blockArray[0]} />;
      }

      return null;
    });
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    // Remove popup parameter from URL
    router.push("/home");
  };

  return (
    <div className="relative">
      {/* Sticky header with logo fully left-aligned */}
      <div className="sticky top-0 z-50 w-full bg-white flex items-center justify-center py-3">
        <Image
          src="/images/sslogo.png"
          alt="App Logo"
          width={200}
          height={50}
          className="object-contain"
        />
      </div>


      {/* Show loading state during validation */}
      {isValidating && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Validating your session...</p>
          </div>
        </div>
      )}

      {/* Render home sections */}
      {!isValidating && renderBlocks()}

      {/* Simple Centered Popup with semi-transparent background */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-full max-w-sm mx-4 bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="p-6 text-center">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">{popupTitle}</h2>
              <p className="text-gray-600 text-sm mb-5">{popupBody}</p>
              <button
                onClick={handlePopupClose}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium shadow hover:brightness-110 transition"
              >
                {popupButton}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
function calculateDuration(startDate: string, endDate: string): string {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 7) return '7 Days';
    if (diffDays === 30) return '30 Days';
    if (diffDays === 365) return 'Yearly';

    return `${diffDays} Days`;
  } catch (e) {
    return 'Active';
  }
}

export default HomeClient;