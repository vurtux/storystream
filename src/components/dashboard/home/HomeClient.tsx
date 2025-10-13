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

    if (popupParam === "0") {
      setPopupTitle("Title(0)");
      setPopupBody("Click on ok to proceed for home page.");
      setShowPopup(true);
    } else if (popupParam === "1") {
      setPopupTitle("Title(1)");
      setPopupBody("Click on ok to proceed for home page.");
      setShowPopup(true);
    }

    // Fetch home data after updating country
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
      <div className="sticky top-0 z-40 flex items-center justify-between text-dark py-4 w-full max-w-[728px] mx-auto">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-sm">
            <Image
              src="/images/loginLogo.png"
              alt={"icon"}
              width={30}
              height={30}
              className="w-12 h-12 rounded-lg object-cover"
            />
          </span>
          {/* <h1 className="text-center text-2xl sm:text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 bg-clip-text text-transparent drop-shadow-md">
            Story Stream
          </h1> */}
        </div>
      </div>
      {/* Fixed Header */}
      {renderBlocks()}

      {/* Centered Popup (No background overlay) */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
          <div className="relative w-full max-w-md mx-4 bg-gradient-to-b from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-100">
            {/* Close Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Content */}
            <div className="p-8 text-center">
              {/* Icon */}
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-orange-500 to-pink-500 text-white shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-7 w-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M12 9v.01M12 3a9 9 0 100 18 9 9 0 000-18z"
                  />
                </svg>
              </div>

              {/* Title */}
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {popupTitle}
              </h2>

              {/* Body */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {popupBody}
              </p>

              {/* Button */}
              <button
                onClick={() => setShowPopup(false)}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium shadow-md hover:shadow-lg hover:brightness-110 transition-all duration-150"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeClient;
