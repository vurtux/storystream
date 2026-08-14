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
  buildTransactionData,
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

        // 6️⃣ Handle Subscription Tracking during SSO Login
        if (profile.vip === 1 && vipInfo) {
          // Ensure we haven't tracked this specific transaction yet on this device
          const transactionDateStr = vipInfo.last_transaction_date || vipInfo.sub_date;
          const trackedDate = localStorage.getItem("last_tracked_transaction");
          
          let isFreshSubscription = false;
          if (transactionDateStr && transactionDateStr !== trackedDate) {
            isFreshSubscription = true;
            localStorage.setItem("last_tracked_transaction", transactionDateStr);
          }

          if (isFreshSubscription) {
            let parsedRevenue = "0.00";
            let parsedType: any = "monthly";
            if (vipInfo.plan_name) {
              const amountMatch = vipInfo.plan_name.match(/[\d\.]+/);
              if (amountMatch) parsedRevenue = amountMatch[0];
              
              const lowerName = vipInfo.plan_name.toLowerCase();
              if (lowerName.includes("day") || lowerName.includes("daily")) parsedType = "daily";
              else if (lowerName.includes("week")) parsedType = "weekly";
              else if (lowerName.includes("month")) parsedType = "monthly";
              else if (lowerName.includes("quarter")) parsedType = "quarterly";
              else if (lowerName.includes("year") || lowerName.includes("annu")) parsedType = "yearly";
            }

            const transactionData = buildTransactionData({
              transactionId: vipInfo.transaction_id || Math.floor(Math.random() * 100000000).toString(),
              orderRevenue: parsedRevenue, 
              subscriptionType: parsedType, 
            });

            trackSubscriptionCompleted("/home", userId.toString(), subscriptionData, transactionData);
          }
        }

        router.push("/home");
      } catch (error) {
        console.error("Error validating user:", error);
      } finally {
        setIsValidating(false);
      }
    };

    validateUser();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);


  // Handle country & language change
  useEffect(() => {
    const countryParam = searchParams.get("country");
    const langParam = searchParams.get("lang");

    if (countryParam) {
      localStorage.setItem("country", countryParam);
    }

    if (langParam) {
      localStorage.setItem("language", langParam);
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