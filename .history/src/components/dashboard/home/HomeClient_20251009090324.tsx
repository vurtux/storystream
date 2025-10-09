"use client";
import React, { useEffect, useState } from "react";
const [showPopup, setShowPopup] = useState(false);

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
  const [homeData, setHomeData] = useState();

  const getHomeData = async () => {
    try {
      const lang = localStorage.getItem("language");
      const country = localStorage.getItem('country') || "";
      const res = await handleHome(lang, country);
      setHomeData(res.response.home);
      // router.push('/auth/verification');
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

    if (!sid) return; // no sid, stay here or show error

    // Save country to localStorage
    if (country) {
      localStorage.setItem("country", country);
    }

    // Validate user via API
    const validateUser = async () => {
      try {
        const payload = {
          sid: sid,
        };
        const res = await handleValidate(payload);

        setAuth({
           userInfo: res.response.profile
        });
        
        if (res.response.status) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('loginData', JSON.stringify(res.response));
            router.push('/home');
            localStorage.setItem('menu', 'home');
            showSuccess('Login successfully!');
        } else {
            throw new Error("Verification failed");
        }
      } catch (error) {
        console.log("Error validating user:", error);
      }
    };

    validateUser();
  }, [searchParams, router]);

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
        // return <SpotLight key={key} data={blockArray[0]} />;
        return <HeaderSlider key={key} data={blockArray[0]} />;
      }

      return null;
    });
  };

  return <div className="">{renderBlocks()}</div>;
};

export default HomeClient;
