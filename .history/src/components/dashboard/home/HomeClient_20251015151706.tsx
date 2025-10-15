"use client";
import React, { useEffect, useState } from "react";
import { handleHome } from "../../../app/api/home";
import SquareShape from "./SquareShape";
import HeaderSlider from "../DashboardHeader";
import { handleValidate } from "../../../app/api/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { showSuccess } from "../../../utils/toastService";
import useAuth from "../../../hooks/useAuth";
import Image from "next/image";
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

  // Fetch home data
  const getHomeData = async () => {
    try {
      const lang = localStorage.getItem("language");
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

    if (countryParam) {
      localStorage.setItem("country", countryParam);
    }

    if (!sid) return;

    const validateUser = async () => {
      try {
        const payload = { sid };
        const res = await handleValidate(payload);

        setAuth({ userInfo: res.response.profile });

        if (res.response.status) {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("loginData", JSON.stringify(res.response));
          router.push("/home");
          localStorage.setItem("menu", "home");
          showSuccess("Login successfully!");
        } else {
          throw new Error("Verification failed");
        }
      } catch (error) {
        console.log("Error validating user:", error);
      }
    };

    validateUser();
  }, [searchParams, router, setAuth]);

  // Handle country change & popup display
  useEffect(() => {
    const popupParam = searchParams.get("popup");
    const countryParam = searchParams.get("country");

    if (countryParam) {
      localStorage.setItem("country", countryParam);
    }

    if (popupParam === "1") {
      setPopupTitle("Welcome to Storystream!");
      setPopupBody(
        "Thank you for subscribing. Click Home below to continue with your subscription."
      );
      setPopupButton("Home");
      setShowPopup(true);
    } else if (popupParam === "2") {
      setPopupTitle("Welcome Back");
      setPopupBody(
        "You are already a subscriber. Click Continue below to continue enjoying Storystream."
      );
      setPopupButton("Continue");
      setShowPopup(true);
    }

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
    router.push("/home");
  };

  return (
    <div className="relative">
      <div className="sticky top-0 z-50 w-full bg-white flex items-center py-0">
        <Image
          src="/images/android-chrome-512x512.png"
          alt="App Logo"
          width={48}
          height={48}
          className="w-12 h-12 object-cover"
        />
      </div>


      {/* Render home sections */}
      {renderBlocks()}

      {/* Simple Centered Popup with transparent background */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
          <div className="relative w-full max-w-sm mx-4 bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="p-6 text-center">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {popupTitle}
              </h2>
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

export default HomeClient;
