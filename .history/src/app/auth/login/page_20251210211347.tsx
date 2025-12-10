'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './login.css';
import { ValidateMDN, handleLogin } from '../../api/auth';
import { showError, showSuccess } from '../../../utils/toastService';
import { useEffect, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import useAuth from '../../../hooks/useAuth';

export default function LoginPage() {
    const { setAuthData } = useAuth();
    const router = useRouter();
    const [mobileNo, setMobileNo] = useState("");
    const [isdCode, setIsdCode] = useState("27"); // South Africa code is 27, not 91
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOtp = async () => {
        // Validation: Check if mobile number is entered
        if (!mobileNo || mobileNo.trim() === "") {
            showError("Please enter your mobile number");
            return;
        }

        // Validation: Check minimum length (SA numbers are typically 9 digits without country code)
        if (mobileNo.length < 9) {
            showError("Please enter a valid mobile number");
            return;
        }

        setIsLoading(true);

        try {
            // Load fingerprint with error handling
            let deviceId = '';
            try {
                const fp = await FingerprintJS.load();
                const result = await fp.get();
                deviceId = result.visitorId;
            } catch (fpError) {
                console.error("Fingerprint error:", fpError);
                // Generate fallback device ID
                deviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            }

            const tempAuth = {
                mobileNo,
                deviceId,
                isdCode,
            };

            setAuthData(tempAuth);
            
            // Use try-catch for localStorage operations (some browsers may block it)
            try {
                localStorage.setItem("authData", JSON.stringify(tempAuth));
                localStorage.setItem("mobile", mobileNo);
            } catch (storageError) {
                console.error("localStorage error:", storageError);
            }

            // Check MDN profile first
            const payloadMDN = { mobileNo, isdCode };
            const mdnRes = await ValidateMDN(payloadMDN);
            
            if (!mdnRes?.response?.status) {
                const isSubscribed = localStorage.getItem("isSubscribed");
                const storedPlan = localStorage.getItem("selectedPlan");
                
                if (isSubscribed === "true" && storedPlan) {
                    const linkWithMobile = `${storedPlan}&msisdn=${mobileNo}`;
                    window.location.href = linkWithMobile;
                    return;
                } else {
                    showError("Please subscribe to continue");
                    router.push("/subscribe");
                    return;
                }
            }

            const profile = mdnRes.response.profile;
            const vipInfo = mdnRes.response.vipInfo;
            try {
                localStorage.setItem("loginData", JSON.stringify(mdnRes.response));
            } catch (storageError) {
                console.error("localStorage error:", storageError);
            }

            // Send OTP if VIP
            if (vipInfo?.isActive === 5 || profile?.vip === 1) {
                const payload = { 
                    deviceId, 
                    langCode: "en", 
                    mobileNo, 
                    isdCode 
                };
                const loginRes = await handleLogin(payload);

                if (!loginRes?.response?.status) {
                    showError("Failed to send OTP. Please try again.");
                    return;
                }

                showSuccess("OTP sent successfully!");
                router.push("/auth/verification");
                return;
            }

            // If user is NOT VIP → Check subscription
            const isSubscribed = localStorage.getItem("isSubscribed");
            const storedPlan = localStorage.getItem("selectedPlan");
            
            if (isSubscribed === "true" && storedPlan) {
                try {
                    const linkWithMobile = `${storedPlan}&msisdn=${mobileNo}`;
                    window.location.href = linkWithMobile;
                    return;
                } catch (error) {
                    console.error("Invalid selectedPlan data:", error);
                    showError("Invalid subscription data. Please try again.");
                }
            } else {
                showError("Please subscribe to continue");
                router.push("/subscribe");
            }

        } catch (error) {
            console.error("Error in login api:", error);
            showError("Login failed. Please check your connection and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        try {
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            if (isLoggedIn === 'true') {
                router.replace('/home');
            }
        } catch (error) {
            console.error("localStorage access error:", error);
        }
    }, [router]);

    const handlePhoneChange = (value: string, data: any) => {
        const stdCode = data?.dialCode || '27';

        // Remove dialCode from start of value
        const numberWithoutStd = value.startsWith(stdCode)
            ? value.slice(stdCode.length)
            : value;

        setIsdCode(stdCode);
        setMobileNo(numberWithoutStd);
    };

    const moveToProfile = () => {
        try {
            localStorage.setItem('menu', 'home');
        } catch (error) {
            console.error("localStorage error:", error);
        }
        router.push('/home');
    };

    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-white flex items-center justify-center">
            {/* Mobile View Container - Max width for desktop */}
            <div className="relative w-full max-w-[430px] h-full mx-auto shadow-2xl">
                {/* Background Image */}
                <div className="absolute inset-0 w-full h-full">
                    <Image
                        alt='login background'
                        fill
                        src="/images/loginImage.png"
                        className="object-cover"
                        priority
                        sizes="(max-width: 430px) 100vw, 430px"
                    />
                </div>

                {/* Skip Button */}
                <div className="absolute top-4 right-4 z-20">
                    <button
                        onClick={moveToProfile}
                        className="text-sm font-medium text-white bg-black/50 px-3 py-1 rounded-md cursor-pointer hover:bg-black/70 transition-colors active:scale-95"
                        aria-label="Skip login"
                    >
                        Skip
                    </button>
                </div>

                {/* Login Form Container - Positioned at bottom with 100px upshift */}
                <div className="absolute bottom-[100px] left-0 right-0 z-10 px-6 pb-12 pt-6 bg-gradient-to-t from-white via-white to-transparent">
                    {/* Logo and Title */}
                    <div className="flex flex-col items-center mb-3">
                        <div className="mb-2">
                            <Image
                                src="/images/loginLogo.png"
                                height={80}
                                width={80}
                                alt="App Logo"
                                className="h-20 w-20"
                            />
                        </div>
                        <h1 className="text-xl text-black font-semibold">
                            Login to your account
                        </h1>
                        <p className="text-sm text-gray-600 mb-3">
                            Enjoy Audio Books you like
                        </p>
                    </div>

                    {/* Phone Input */}
                    <div className="mb-4">
                        <label htmlFor="phone-input" className="sr-only">
                            Phone Number
                        </label>
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
                            disabled={isLoading}
                            placeholder="Enter phone number"
                            inputProps={{
                                id: 'phone-input',
                                'aria-label': 'Phone number',
                                autoComplete: 'tel',
                            }}
                        />
                    </div>

                    {/* Send OTP Button */}
                    <button
                        className="w-full cursor-pointer py-3 rounded-2xl text-white font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all shadow-md mb-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                        onClick={handleSendOtp}
                        disabled={isLoading}
                        aria-label="Send OTP"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Sending...
                            </span>
                        ) : (
                            'Send OTP'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}