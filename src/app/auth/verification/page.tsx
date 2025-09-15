'use client';
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { handleVerification, handleLogin } from "../../api/auth";
import { showError, showSuccess } from "../../../utils/toastService";
import useAuth from "../../../hooks/useAuth";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const OTPVerification: React.FC = () => {
  const { setAuth, authData } = useAuth();
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      router.replace('/dashboard/home');
    }
  }, [router]);

  // Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
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
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const authValue = JSON.parse(localStorage.getItem('authData') || '{}');
    try {
      const payload = {
        deviceId: authValue.deviceId,
        langCode: "en",
        mobileNo: authValue.mobileNo,
        isdCode: authValue.isdCode,
        otp: otp.join(""),
        last_login_source: ""
      };

      const res = await handleVerification(payload);
      setAuth({
        userInfo: res.response.profile
      });

      if (res.response.status) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loginData', JSON.stringify(res.response));
        router.push('/profile');
        localStorage.setItem('menu', 'profile');
        showSuccess('Login successfully!');
      } else {
        throw new Error("Verification failed");
      }
    } catch (error) {
      console.log("Error in login api", error);
      showError("Login failed");
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

  useEffect(() => {
    console.log(authData, "authData");
  }, [])

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

        {/* OTP boxes */}
        <div className="flex gap-6 mb-6">
          {otp.map((digit, index) => (
            <div
              key={index}
              className="w-12 h-12 border rounded-lg flex items-center justify-center text-xl font-semibold"
            >
              <input
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                type="tel"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-full bg-gray-100 rounded-lg text-center text-black px-4 py-2 outline-none"
              />
            </div>
          ))}
        </div>

        <button
          style={{ background: "radial-gradient(92.09% 394.93% at 7.91% 50%, #6B0DFF 0%, #FF6B79 100%)" }}
          onClick={handleVerify}
          className="w-full cursor-pointer max-w-xs py-3 rounded-2xl text-white font-semibold mb-4"
        >
          Verify
        </button>

        {/* Resend timer logic */}
        <p className="text-lg text-center mt-2">
          Didn’t receive OTP?{' '}
          {secondsLeft > 0 ? (
            <span style={{ color: "#6B0DFF"}} className="font-medium">Resend in {secondsLeft}s</span>
          ) : (
            <span
              onClick={handleSendOtp}
              className="text-purple-600 font-medium cursor-pointer"
            >
              Resend
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default OTPVerification;
