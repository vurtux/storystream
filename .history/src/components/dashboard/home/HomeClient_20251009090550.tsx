"use client";
import React, { useEffect, useState } from "react";
import { handleHome } from "../../../app/api/home";
import SquareShape from "./SquareShape";
import HeaderSlider from "../DashboardHeader";
import { handleValidate } from "../../../app/api/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { showSuccess } from "../../../utils/toastService";
import useAuth from "../../../hooks/useAuth";

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
  const { setAuth, authData } = useAuth();
  const [homeData, setHomeData] = useState<HomeData>();
  const [showPopup, setShowPopup] = useState(false); // popup state

  const getHomeData = async () => {
    try {
      const lang = localStorage.getItem("language");
      const country = localStorage.getItem("country") || "";
      const res = await handleHome(lang, country);
      setHomeData(res.response.home);
    } catch (error) {
      console.log("Error in login api", error);
    }
  };

  useEffect(() => {
    getHomeData();
  }, []);

  useEffect(() => {
    const sid = searchParams.get("sid");
    const country = searchParams.get("country");

    if (!sid) return;

    if (country) {
      localStorage.setItem("country", country);
    }

    const validateUser = async () => {
      try {
        const payload = { sid };
        const res = await handleValidate(payload);

        setAuth({
          userInfo: res.response.profile,
        });

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
  }, [searchParams, router]);

  // Detect ?popup=0
  useEffect(() => {
    const popupParam = searchParams.get("popup");
    if (popupParam === "0") {
      setShowPopup(true);
    }
  }, [searchParams]);

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
      {renderBlocks()}

      {/* Floating Popup Card */}
      {showPopup && (
        <div className="fixed top-6 right-6 z-50 animate-fadeIn">
          <div className="bg-white border border-gray-200 shadow-xl rounded-xl px-6 py-5 max-w-sm">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">
              Welcome!
            </h2>
            <p className="text-gray-600 mb-4 text-sm">
              This popup appears because your URL contains <b>?popup=0</b>.
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="bg-blue-500 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeClient;
