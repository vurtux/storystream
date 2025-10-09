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
  const [showPopup, setShowPopup] = useState(false); // 👈 added for popup

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

  // 👇 New effect to detect ?popup=0
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
    <div className="">
      {renderBlocks()}

      {/* 👇 Popup Dialog */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-4">Welcome!</h2>
            <p className="text-gray-600 mb-4">
              This is your popup triggered by ?popup=0 in URL.
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
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
