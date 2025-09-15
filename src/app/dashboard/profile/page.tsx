'use client';

import { useEffect, useState } from "react";
import { FaUser, FaHeadset, FaFileAlt, FaSignOutAlt } from "react-icons/fa";
import { MdSubscriptions } from "react-icons/md";
import { IoLanguage } from "react-icons/io5";
import { BsShieldLock } from "react-icons/bs";
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi";
import { IoIosArrowForward } from "react-icons/io";
import { useRouter } from "next/navigation";
import { Dialog } from 'primereact/dialog';
import Image from "next/image";

type MenuItemProps = {
    icon?: React.ReactNode;
    imgSrc?: string; // new prop for image
    label: React.ReactNode | string;
    value?: React.ReactNode | string;
    textColor?: string;
    onClick?: () => void;
};

function MenuItem({ icon, imgSrc, label, value, textColor = "text-gray-900", onClick }: MenuItemProps) {
    return (
        <div
            onClick={onClick}
            className="flex items-center justify-between py-3 cursor-pointer px-2 rounded select-none"
        >
            <div className="flex items-center space-x-3">
                {/* {icon && <div className="text-gray-400">{icon}</div>} */}
                {imgSrc && (
                    <div>
                        <Image src={imgSrc} alt="icon" width={24} height={24} />
                    </div>
                )}
                <span 
                style={{
                fontWeight: 600,
                fontSize: '18px',
                lineHeight: '140%',
                letterSpacing: '0.2px',
                verticalAlign: 'middle',
                }}
                className={`text-base ${textColor}`}>
                    {label}
                </span>
            </div>
            {value && <span
            style={{
                fontWeight: 600,
                fontSize: '18px',
                lineHeight: '140%',
                letterSpacing: '0.2px',
                verticalAlign: 'middle',
                }}
                >
                  {value}
                </span>}
        </div>
    );
}

export default function ProfilePage() {

    const router = useRouter();
    const [selectedLanguage, setSelectedLanguage] = useState("English");
    const [showLanguageDialog, setShowLanguageDialog] = useState(false);
    const [loggedIn, setLoggedIn] = useState("false");

    const handleLogout = () => {
        router.push('/auth/login');
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.setItem('loginData', '');
    };

    const handleManageAccount = () => {
        router.push('/dashboard/profile/edit');
    };

    const availableLanguages = ["English", "Hindi"];

  useEffect(() => {
    const isLoggedIn: any = localStorage.getItem('isLoggedIn');
    console.log(isLoggedIn, "isLoggedIn");
    setLoggedIn(isLoggedIn);
  }, []);

  useEffect(() => {
    const lang = localStorage.getItem('language')
    const langName = lang === 'en' ? "English" : "Hindi";
    setSelectedLanguage(langName);
  }, [])

    return (
        <div>
            {/* Top Bar */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Image height={24} width={24} alt="banner" src="/images/Profile.png" />
                    <h1 className="text-2xl text font-semibold">Profile</h1>
                </div>
                <div className="rounded-full cursor-pointer">
                    {/* <HiOutlineDotsCircleHorizontal className="text-black w-7 h-7" /> */}
                    <Image height={28} width={28} alt="banner" src="/images/Auto Layout Horizontal.png" />
                </div>
            </div>

            {/* Banner */}
            {/* <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 text-white relative overflow-hidden mb-6">
                <div className="flex items-center">
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold">Enjoy All Benefits!</h2>
                        <p className="text-sm">Enjoy listening podcast with better audio quality, without restrictions, and without ads</p>
                        <button className="mt-3 bg-white text-purple-600 px-4 py-1.5 rounded-full text-sm font-medium shadow">
                            StoryStream Pro
                        </button>
                    </div>
                </div>
            </div> */}
            <div className="w-full">
                <Image height={251} width={380} alt="banner" src="/images/Promo & Discount.png" />
            </div>

            {/* Options */}
            <div className="space-y-4">
                {loggedIn === "true" && <MenuItem
                    icon={<FaUser />}
                    imgSrc="/profile/Profile.png"
                    label="Manage Account"
                    value={<IoIosArrowForward />}
                    onClick={handleManageAccount}
                />}
                {loggedIn === "true" && <MenuItem
                    icon={<MdSubscriptions />}
                    imgSrc="/profile/Group 36707.png"
                    label="Manage Subscription"
                    value={<IoIosArrowForward />}
                />}
                <MenuItem
                    icon={<IoLanguage />}
                    imgSrc="/profile/language.png"
                    label="Language"
                    value={
                        <div className="flex items-center gap-3">
                            <span>{selectedLanguage}</span>
                            <IoIosArrowForward />
                        </div>
                    }
                    // onClick={() => setShowLanguageDialog(true)}
                    onClick={() => { router.push("/profile/language")}}
                />
                <MenuItem
                    icon={<FaHeadset />}
                    imgSrc="/profile/Calling.png"
                    label="Contact Us"
                    value={<IoIosArrowForward />}
                />
                <MenuItem
                    icon={<BsShieldLock />}
                    imgSrc="/profile/Shield Done.png"
                    label="Privacy Policy"
                    value={<IoIosArrowForward />}
                    onClick={() => window.open("https://www.myuzeplay.com/static/pp", "_self")}
                />
                <MenuItem
                    icon={<FaFileAlt />}
                    imgSrc="/profile/Paper.png"
                    label="Terms of Service"
                    value={<IoIosArrowForward />}
                    onClick={() => window.open("https://www.myuzeplay.com/static/tnc", "_self")}
                />
                <MenuItem
                    icon={<FaSignOutAlt />}
                    imgSrc="/profile/Logout.png"
                    label={<div onClick={handleLogout} className="font-semibold">{loggedIn === "true" ? 'Logout' : 'Login'}</div>}
                    textColor="text-red-500"
                />
            </div>

            {/* Language Dialog */}
            {/* <Dialog
                header="Select Language"
                visible={showLanguageDialog}
                onHide={() => setShowLanguageDialog(false)}
                style={{ width: '300px' }}
                modal
            >
                <div className="flex flex-col gap-3">
                    {availableLanguages.map((lang) => (
                        <button
                            key={lang}
                            onClick={() => {
                                setSelectedLanguage(lang);
                                setShowLanguageDialog(false);
                            }}
                            className={`py-2 px-4 rounded-md text-white ${selectedLanguage === lang ? "bg-purple-600" : "bg-gray-400"}`}
                        >
                            {lang}
                        </button>
                    ))}
                </div>
            </Dialog> */}
        </div>
    );
}
