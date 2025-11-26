'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './login.css'; // Assuming this contains necessary custom styles
import { ValidateMDN, handleLogin } from '../../api/auth';
import { showError, showSuccess } from '../../../utils/toastService';
import { useEffect, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import useAuth from '../../../hooks/useAuth';

/**
 * LoginPage: A reusable, responsive component for mobile number login.
 * It will fit the dimensions of its parent container.
 */
export default function LoginPage() {

    const { setAuthData } = useAuth();
    const router = useRouter();
    const [mobileNo, setMobileNo] = useState("");
    const [isdCode, setIsdCode] = useState("91");

    const handleSendOtp = async () => {
        // ✅ Validation: Check if mobile number is entered
        if (!mobileNo || mobileNo.trim() === "") {
            showError("Please enter your mobile number");
            return;
        }

        try {
            // Load fingerprint
            const fp = await FingerprintJS.load();
            const result = await fp.get();

            const tempAuth = {
                mobileNo,
                deviceId: result.visitorId,
                isdCode,
            };

            setAuthData(tempAuth);
            localStorage.setItem("authData", JSON.stringify(tempAuth));
            localStorage.setItem("mobile", mobileNo);

            // 1 — Check MDN profile first
            const payloadMDN = { mobileNo, isdCode };
            const mdnRes = await ValidateMDN(payloadMDN);
            if (!mdnRes?.response?.status) {
                const isSubscribed = localStorage.getItem("isSubscribed");
                const storedPlan = localStorage.getItem("selectedPlan");
                if (isSubscribed === "true") {
                    const linkWithMobile = mobileNo
                        ? `${storedPlan}&msisdn=${mobileNo}`
                        : storedPlan;

                    window.location.href = linkWithMobile!;
                    return;
                } else {
                    showError("Please subscribe to continue");
                    router.push("/subscribe");
                    return;
                }
            }


            const profile = mdnRes.response.profile;
            const vipInfo = mdnRes.response.vipInfo;

            localStorage.setItem("loginData", JSON.stringify(mdnRes.response));

            // 2 — Send OTP if VIP
            if (vipInfo?.isActive === 5 || profile?.vip === 1) {
                const payload = { deviceId: result.visitorId, langCode: "en", mobileNo, isdCode };
                const loginRes = await handleLogin(payload);

                if (!loginRes?.response?.status) {
                    // showError("Failed to send OTP");
                    return;
                }

                showSuccess("OTP sent successfully!");
                router.push("/auth/verification");
                return;
            }

            // 3 — If user is NOT VIP → Redirect to Subscribe
            const isSubscribed = localStorage.getItem("isSubscribed");
            const storedPlan = localStorage.getItem("selectedPlan");
            if (isSubscribed === "true") {
                
                try {
                  
                     const linkWithMobile = mobileNo
                        ? `${storedPlan}&msisdn=${mobileNo}`
                        : storedPlan;

                    window.location.href = linkWithMobile!;
                    return;
                } catch (error) {
                    console.error("Invalid selectedPlan data:", error);
                }
            }

            else {
                showError("Please subscribe to continue");
                router.push("/subscribe");
                return;
            }

        } catch (error) {
            console.log("Error in login api", error);
            // showError("OTP send failed");

        }
    };


    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            // Use router.replace to prevent going back to login after logging out
            router.replace('/home'); 
        }
    }, [router]);

    const handlePhoneChange = (value: string, data: { dialCode: string }) => {
        const stdCode = data?.dialCode || '';

        // Remove dialCode from start of value
        const numberWithoutStd = value.startsWith(stdCode)
            ? value.slice(stdCode.length)
            : value;

        setIsdCode(stdCode);
        setMobileNo(numberWithoutStd);
    };

    const moveToProfile = () => {
        router.push('/home');
        localStorage.setItem('menu', 'home');
    }

    return (
        // RENDERED IN PARENT CONTEXT: 
        // We removed fixed/screen size classes. The component now scales with its parent.
        <div className="relative w-full h-full min-h-[500px] overflow-hidden bg-white flex items-center justify-center rounded-xl shadow-lg">
            
            {/* Inner Content Wrapper - Max width for content aesthetics, center aligned */}
            <div className="relative w-full max-w-[430px] h-full mx-auto">
                
                {/* Background Image Container */}
                {/* We use a height-control class like h-3/5 or h-full depending on visual need */}
                <div className="absolute top-0 left-0 right-0 h-[70%] md:h-[60%] lg:h-[70%]"> 
                    <Image
                        alt='login'
                        fill
                        src="/images/loginImage.png"
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Skip Button (relative to this inner container) */}
                <div className="absolute top-4 right-4 z-20">
                    <button
                        onClick={moveToProfile}
                        className="text-sm font-medium text-white bg-black/50 px-3 py-1 rounded-md cursor-pointer hover:bg-black/70 transition-colors"
                    >
                        Skip
                    </button>
                </div>

                {/* Login Form Container - Positioned at bottom */}
                <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-8 pt-6 bg-gradient-to-t from-white via-white to-transparent">
                    {/* Logo and Title */}
                    <div className="flex flex-col items-center mb-3">
                        <div className="mb-2">
                            <Image
                                src="/images/loginLogo.png"
                                height={80}
                                width={80}
                                alt="Logo"
                                className="h-16 w-16 md:h-20 md:w-20"
                            />
                        </div>
                        <h2 className="text-xl text-black font-semibold">
                            Login to your account
                        </h2>
                        <p className="text-sm text-gray-600 mb-3">
                            Enjoy Audio Books you like
                        </p>
                    </div>

                    {/* Phone Input */}
                    <div className="mb-4">
                        <PhoneInput
                            country={'za'}
                            onlyCountries={['za']}
                            disableDropdown
                            disableCountryGuess
                            enableSearch={false}
                            countryCodeEditable={false}
                            containerClass="w-full text-black rounded-md border border-gray-300 focus-within:border-purple-500 shadow-sm"
                            inputClass="!w-full !py-2.5 !pl-12 !pr-3 !text-sm !rounded-md !border-none focus:!ring-0"
                            buttonClass="!bg-transparent !border-none !left-2 absolute z-10"
                            dropdownClass="!z-50"
                            onChange={handlePhoneChange}
                        />
                    </div>

                    {/* Send OTP Button */}
                    <button
                        className="w-full cursor-pointer py-3 rounded-2xl text-white font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all shadow-md mb-2"
                        onClick={handleSendOtp}
                    >
                        Send OTP
                    </button>
                </div>
            </div>
        </div>
    );
}