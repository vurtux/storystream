'use client';

import { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useRouter } from "next/navigation";
import Image from "next/image";

type MenuItemProps = {
  imgSrc?: string;
  label: React.ReactNode | string;
  value?: React.ReactNode | string;
  textColor?: string;
  onClick?: () => void;
};

function MenuItem({ imgSrc, label, value, textColor = "text-gray-900", onClick }: MenuItemProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between py-3 cursor-pointer px-2 rounded select-none"
    >
      <div className="flex items-center space-x-3">
        {imgSrc && <Image src={imgSrc} alt="icon" width={24} height={24} />}
        <span
          style={{
            fontWeight: 600,
            fontSize: "18px",
            lineHeight: "140%",
            letterSpacing: "0.2px",
            verticalAlign: "middle",
          }}
          className={`text-base ${textColor}`}
        >
          {label}
        </span>
      </div>
      {value && (
        <span
          style={{
            fontWeight: 600,
            fontSize: "18px",
            lineHeight: "140%",
            letterSpacing: "0.2px",
            verticalAlign: "middle",
          }}
        >
          {value}
        </span>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [country, setCountry] = useState("ZA");
  const [isVip, setIsVip] = useState(false);

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    localStorage.removeItem("loginData");
    localStorage.removeItem("authData");
    setLoggedIn(false);
    setIsVip(false);
    router.push("/auth/login");
  };

  const handleLogin = () => {
    router.push("/auth/login");
  };
   const handleSubscription = () => {
    localStorage.setItem("loginData", JSON.stringify(mdnRes.response));
    router.push("/subscribe");
  };

  const handleManageAccount = () => {
    router.push("/dashboard/profile/edit");
  };

  const handleManageAccountSubscription = () => {
    router.push("/managesubscription");
  };

  const handleBannerClick = () => {
     const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
     if (isLoggedIn) {
       router.push("/subscribe");
     }else{
       router.push("/auth/login");
     }
   
  };

  

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setLoggedIn(isLoggedIn);

    const savedCountry = localStorage.getItem("country");
    if (savedCountry) setCountry(savedCountry);

    const stored = JSON.parse(localStorage.getItem("loginData") || "{}");

    // Treat as VIP if profile.vip === 1 OR vipInfo.isActive === 5
    if (stored?.profile?.vip === 1 || stored?.vipInfo?.isActive === 5) {
      setIsVip(true);
    } else {
      setIsVip(false);
    }
  }, []);

  return (
    <div className="p-4 flex flex-col min-h-screen">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <Image height={24} width={24} alt="banner" src="/images/Profile.png" />
          <h1 className="text-2xl font-semibold">Profile</h1>
        </div>
      </div>

      {/* Banner (only if not VIP) */}
      {!isVip && (
        <div className="w-full mb-6 cursor-pointer" onClick={handleBannerClick}>
          <Image height={251} width={380} alt="banner" src="/images/Promo_Discount.png" />
        </div>
      )}

      {/* Menu Items */}
      <div className="space-y-4 flex-1">

        {/* Subscribe Now - only when logged in */}
        {!isVip && (
          <MenuItem
            imgSrc="/images/subscriptionLogo.png"
            label="Subscribe Now"
            value={<IoIosArrowForward />}
            onClick={handleSubscription}
          />
        )}

        {/* Login - only when NOT logged in */}
        {!loggedIn && (
          <MenuItem
            imgSrc="/profile/Logout.png"
            label={<div onClick={handleLogin} className="font-semibold">Login</div>}
            textColor="text-red-500"
          />
        )}

        {/* Logged-in Options */}
        {loggedIn && (
          <>
            <MenuItem
              imgSrc="/profile/Profile.png"
              label="Manage Account"
              value={<IoIosArrowForward />}
              onClick={handleManageAccount}
            />

            {isVip && (
              <MenuItem
                imgSrc="/profile/Group 36707.png"
                label="Manage Subscription"
                value={<IoIosArrowForward />}
                onClick={handleManageAccountSubscription}
              />
            )}
          </>
        )}

        {/* Common Items */}
        <MenuItem
          imgSrc="/profile/Calling.png"
          label="Contact Us"
          value={<IoIosArrowForward />}
          onClick={() => window.open("https://www.myuzeplay.com/static/support", "_self")}
        />
        <MenuItem
          imgSrc="/profile/Shield Done.png"
          label="Privacy Policy"
          value={<IoIosArrowForward />}
          onClick={() => window.open("/pp.html", "_self")}
        />
        <MenuItem
          imgSrc="/profile/Paper.png"
          label="Terms of Service"
          value={<IoIosArrowForward />}
          onClick={() => window.open("/tnc.html", "_self")}
        />

        {/* Logout - only when logged in */}
        {loggedIn && (
          <MenuItem
            imgSrc="/profile/Logout.png"
            label={<div onClick={handleLogout} className="font-semibold">Logout</div>}
            textColor="text-red-500"
          />
        )}
      </div>

      <div className="mt-8 text-center text-gray-500 text-sm">
        Version: 1.0.1 ({country})
      </div>
    </div>
  );
}
