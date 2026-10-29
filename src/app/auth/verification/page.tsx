'use client';
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { handleVerification, handleLogin } from "../../api/auth";
import { showError, showSuccess } from "../../../utils/toastService";
import useAuth from "../../../hooks/useAuth";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import {
  trackLogin,
  buildSubscriptionData,
  trackSubscriptionCompleted
} from "../../../lib/tealiumTracking";
const OTPVerification: React.FC = () => {
  const { setAuth, authData } = useAuth();
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const MAX_FAILED_ATTEMPTS = 5;
  const LOCKOUT_TIME_SECONDS = 300; // 5 minutes lockout

  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSecondsLeft, setLockoutSecondsLeft] = useState(0);

  // Check existing lockout on mount
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      router.replace('/dashboard/home');
      return;
    }

    try {
      const storedLockoutUntil = localStorage.getItem('otp_lockout_until');
      if (storedLockoutUntil) {
        const remainingMs = parseInt(storedLockoutUntil, 10) - Date.now();
        if (remainingMs > 0) {
          setLockoutSecondsLeft(Math.ceil(remainingMs / 1000));
        } else {
          localStorage.removeItem('otp_lockout_until');
          localStorage.removeItem('otp_failed_attempts');
        }
      }

      const storedAttempts = localStorage.getItem('otp_failed_attempts');
      if (storedAttempts) {
        setFailedAttempts(parseInt(storedAttempts, 10));
      }
    } catch (e) {
      console.error("Error reading lockout storage:", e);
    }
  }, [router]);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSecondsLeft <= 0) return;

    const interval = setInterval(() => {
      setLockoutSecondsLeft((prev) => {
        if (prev <= 1) {
          localStorage.removeItem('otp_lockout_until');
          localStorage.removeItem('otp_failed_attempts');
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutSecondsLeft]);

  // Resend OTP Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  const isLocked = lockoutSecondsLeft > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (isLocked) return;
    const val = e.target.value;
    if (!/^\d?$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (isLocked) return;
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (isLocked) {
      showError(`Account locked. Try again in ${Math.ceil(lockoutSecondsLeft / 60)} minutes.`);
      return;
    }

    const otpCode = otp.join("");
    if (otpCode.length < 4) {
      showError("Please enter the complete 4-digit OTP.");
      return;
    }

    setIsVerifying(true);
    try {
      const authValue = JSON.parse(localStorage.getItem('authData') || '{}');

      const payload = {
        deviceId: authValue.deviceId,
        langCode: "en",
        mobileNo: authValue.mobileNo,
        isdCode: authValue.isdCode,
        otp: otpCode,
        last_login_source: "",
      };

      const res = await handleVerification(payload);

      if (!res?.response?.status) {
        throw new Error(res?.response?.msg || "Verification failed");
      }

      // Success: Reset rate-limiting tracking
      localStorage.removeItem('otp_lockout_until');
      localStorage.removeItem('otp_failed_attempts');
      setFailedAttempts(0);

      const { profile, vipInfo } = res.response;
      const userId = profile?.userId?.toString() || "guest";

      // Save auth
      setAuth({ userInfo: profile });
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("loginData", JSON.stringify(res.response));
      localStorage.setItem("menu", "home");

      // Track Login for all users
      const userType = profile.vip === 1 ? "paid" : "free";
      const subscriptionData = (profile.vip === 1 && vipInfo) ? buildSubscriptionData({
        subscriptionId: vipInfo.plan_id,
        planName: vipInfo.plan_name,
        planId: vipInfo.plan_id,
        planType: "Subscription",
        planBrand: "audio",
        duration: calculateDuration(vipInfo.sub_date, vipInfo.expiry_date),
        assetType: "premium",
        dateStart: new Date(vipInfo.sub_date).toLocaleDateString("en-ZA"),
        dateEnd: new Date(vipInfo.expiry_date).toLocaleDateString("en-ZA"),
      }) : {};

      trackLogin(
        "/Verification",
        userId.toString(),
        userType,
        subscriptionData
      );

      console.log("📊 Tracked login:", {
        userId,
        vip: profile.vip,
        mobileNo: profile.mobileNo,
      });

      showSuccess("Login successfully!");
      router.push("/home");

    } catch (error) {
      console.error("Error in login api:", error);
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= MAX_FAILED_ATTEMPTS) {
        const lockoutUntil = Date.now() + LOCKOUT_TIME_SECONDS * 1000;
        localStorage.setItem('otp_lockout_until', lockoutUntil.toString());
        localStorage.setItem('otp_failed_attempts', newAttempts.toString());
        setLockoutSecondsLeft(LOCKOUT_TIME_SECONDS);
        setOtp(["", "", "", ""]);
        showError("Too many failed attempts. Account temporarily locked for 5 minutes.");
      } else {
        localStorage.setItem('otp_failed_attempts', newAttempts.toString());
        const remaining = MAX_FAILED_ATTEMPTS - newAttempts;
        showError(`Invalid OTP. ${remaining} attempt${remaining > 1 ? 's' : ''} remaining.`);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSendOtp = async () => {
    setIsResending(true);
    try {
      const authValue = JSON.parse(localStorage.getItem('authData') || '{}');
      const payload = {
        deviceId: authValue.deviceId,
        langCode: "en",
        mobileNo: authValue.mobileNo,
        isdCode: authValue.isdCode
      };

      const res = await handleLogin(payload);
      showSuccess('OTP sent successfully!');
      setSecondsLeft(60);
    } catch (error) {
      console.log("Error in login api", error);
      showError("OTP resend failed");
    } finally {
      setIsResending(false);
    }
  };

  // useEffect(() => {
  //   console.log(authData, "authData");
  // }, [])

  return (
    <div className="min-h-screen bg-white relative px-4 pt-6">
      {/* Back button */}
      <div
        onClick={() => router.back()}
        className="text-xl text-black cursor-pointer absolute top-4 left-4"
      >
        <FaArrowLeft />
      </div>

      <div className="max-w-md mx-auto mt-16 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-2">OTP Verification</h1>
        <p className="text-md text-center mb-6">
          We have sent you a 4-digit verification code on your mobile number
        </p>

        {/* Lockout Warning Banner */}
        {isLocked ? (
          <div className="w-full max-w-xs mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-center">
            <p className="text-red-700 font-semibold text-sm">Account Temporarily Locked</p>
            <p className="text-red-600 text-xs mt-1">
              Too many invalid attempts. Please wait{' '}
              <span className="font-bold">
                {Math.floor(lockoutSecondsLeft / 60)}m {lockoutSecondsLeft % 60}s
              </span>
            </p>
          </div>
        ) : failedAttempts > 0 ? (
          <div className="w-full max-w-xs mb-4 text-center">
            <span className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
              {MAX_FAILED_ATTEMPTS - failedAttempts} attempt{MAX_FAILED_ATTEMPTS - failedAttempts > 1 ? 's' : ''} remaining
            </span>
          </div>
        ) : null}

        {/* OTP boxes */}
        <div className="flex gap-6 mb-6">
          {otp.map((digit, index) => (
            <div
              key={index}
              className={`w-12 h-12 border rounded-lg flex items-center justify-center text-xl font-semibold ${
                isLocked ? "opacity-50 cursor-not-allowed bg-gray-100" : ""
              }`}
            >
              <input
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                type="tel"
                maxLength={1}
                value={digit}
                disabled={isLocked || isVerifying}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`w-full bg-gray-100 rounded-lg text-center text-black px-4 py-2 outline-none ${
                  isLocked ? "cursor-not-allowed" : ""
                }`}
              />
            </div>
          ))}
        </div>

        <button
          style={{
            background: isLocked || isVerifying || otp.join("").length < 4
              ? "#9CA3AF"
              : "radial-gradient(92.09% 394.93% at 7.91% 50%, #6B0DFF 0%, #FF6B79 100%)",
          }}
          onClick={handleVerify}
          disabled={isLocked || isVerifying || otp.join("").length < 4}
          className={`w-full max-w-xs py-3 rounded-2xl text-white font-semibold mb-4 transition ${
            isLocked || isVerifying || otp.join("").length < 4 ? "cursor-not-allowed opacity-70" : "cursor-pointer"
          }`}
        >
          {isVerifying ? "Verifying..." : isLocked ? `Locked (${lockoutSecondsLeft}s)` : "Verify"}
        </button>

        {/* Resend timer logic */}
        <p className="text-lg text-center mt-2">
          Didn’t receive OTP?{' '}
          {secondsLeft > 0 ? (
            <span style={{ color: "#6B0DFF" }} className="font-medium">Resend in {secondsLeft}s</span>
          ) : (
            <span
              onClick={isLocked ? undefined : handleSendOtp}
              className={`font-medium ${
                isLocked ? "text-gray-400 cursor-not-allowed" : "text-purple-600 cursor-pointer"
              }`}
            >
              Resend
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

function calculateDuration(startDate: string, endDate: string): string {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 7) return '7 Days';
    if (diffDays === 30) return '30 Days';
    if (diffDays === 365) return 'Yearly';

    return `${diffDays} Days`;
  } catch (e) {
    return 'Active';
  }
}

export default OTPVerification;
