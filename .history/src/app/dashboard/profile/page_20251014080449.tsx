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
            fontSize: '18px',
            lineHeight: '140%',
            letterSpacing: '0.2px',
            verticalAlign: 'middle',
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
            fontSize: '18px',
            lineHeight: '140%',
            letterSpacing: '0.2px',
            verticalAlign: 'middle',
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
  const [country, setCountry] = useState("ZA"); // default country

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('loginData');
    localStorage.removeItem('authData');
    setLoggedIn(false);
    // router.push('/auth/login');
    router.push('/dashboard/buysubscription');
  };

  const handleLogin = () => {
    // router.push('/auth/login');
    router.push('/dashboard/buysubscription');
  };

  const handleManageAccount = () => {
    router.push('/dashboard/profile/edit');
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setLoggedIn(isLoggedIn);

    const savedCountry = localStorage.getItem('country');
    if (savedCountry) setCountry(savedCountry);
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

      {/* Banner */}
      <div className="w-full mb-6">
        <Image height={251} width={380} alt="banner" src="/images/Promo_Discount.png" />
      </div>

      {/* Menu Options */}
      <div className="space-y-4 flex-1">
        {/* Logged out only */}
        {!loggedIn && (
          <MenuItem
            imgSrc="/profile/Logout.png"
            label={<div onClick={handleLogin} className="font-semibold">Login</div>}
            textColor="text-red-500"
          />
        )}

        {/* Logged in only */}
        {loggedIn && (
          <>
            <MenuItem
              imgSrc="/profile/Profile.png"
              label="Manage Account"
              value={<IoIosArrowForward />}
              onClick={handleManageAccount}
            />
            <MenuItem
              imgSrc="/profile/Group 36707.png"
              label="Manage Subscription"
              value={<IoIosArrowForward />}
            />
          </>
        )}

        {/* Always visible */}
        <MenuItem
          imgSrc="/profile/Calling.png"
          label="Contact Us"
          value={<IoIosArrowForward />}
        />
        <MenuItem
          imgSrc="/profile/Shield Done.png"
          label="Privacy Policy"
          value={<IoIosArrowForward />}
          onClick={() => window.open("https://www.myuzeplay.com/static/pp", "_self")}
        />
        <MenuItem
          imgSrc="/profile/Paper.png"
          label="Terms of Service"
          value={<IoIosArrowForward />}
          onClick={() => window.open("https://www.myuzeplay.com/static/tnc", "_self")}
        />

        {/* Logout at bottom for logged in */}
        {loggedIn && (
          <MenuItem
            imgSrc="/profile/Logout.png"
            label={<div onClick={handleLogout} className="font-semibold">Logout</div>}
            textColor="text-red-500"
          />
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        Version: 1.0.0 ({country})
      </div>
    </div>
  );
}
