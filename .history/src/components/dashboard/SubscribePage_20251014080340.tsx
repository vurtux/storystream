"use client";
import Image from "next/image";
import { useRouter } from "next/navigation"
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import useDashboard from "../../hooks/useDashboard";

type UserData = {
  userId: string | number;
  isdCode: string;
  mobileNo: string;
  vip: number;
  country: string;
};

const SubscribePage = () => {

  const router = useRouter();
  const { timer, setTimer, showSubscriptionDialog, setShowSubscriptionDialog } = useDashboard();

  const [userData, setUserData] = useState<UserData>({
    userId: "",
    isdCode: "",
    mobileNo: "",
    vip: 0,
    country: "ZA",
  });

  const handleSubscribe = async () => {
    if (
      !userData?.userId ||
      userData?.userId === null ||
      userData?.userId === ""
    ) {
      // router.push("/auth/login");
      router.push('/dashboard/buysubscription');
    } else {
      // window.open(
      //   `https://payment.myuze.app/p/index.php?&userid=${
      //     userData.userId
      //   }&deviceId=${20030107}&country=${userData?.country}&mobileNo=${
      //     userData?.mobileNo
      //   }&isdCode=${
      //     userData?.isdCode
      //   }&langCode=en&app_version=3.0.3&build_number=10060&upi=&platform=web&plan=`,
      //   "_self"
      // );
      router.push('/dashboard/buysubscription');
    }
    setShowSubscriptionDialog(false);
  };

  useEffect(() => {
    if (typeof window === "undefined") return; // SSR safe

    const rawData = localStorage.getItem("loginData");

    if (!rawData) {
      // no login data, keep default
      return;
    }

    try {
      const parsed = JSON.parse(rawData);

      // Check if parsed data has expected structure
      if (parsed?.profile) {
        setUserData({
          userId: parsed.profile.userId || "",
          isdCode: parsed.profile.isdCode || "",
          mobileNo: parsed.profile.mobileNo || "",
          vip: parsed.profile.vip || 0,
          country: parsed.profile.country || "",
        });
      }
    } catch (error) {
      console.error("Failed to parse loginData:", error);
      // Keep default safe values
      setUserData({
        userId: "",
        isdCode: "",
        mobileNo: "",
        vip: 0,
        country: "",
      });
    }
  }, []);

  useEffect(() => {
    if (!showSubscriptionDialog || timer <= 1) return;
    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(countdown);
  }, [showSubscriptionDialog, timer]);

  return (
    <div>
      <Dialog
        visible={showSubscriptionDialog}
        onHide={() => setShowSubscriptionDialog(false)}
        header={null}
        closable={false}
        modal
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          borderTopLeftRadius: "1.5rem",
          borderTopRightRadius: "1.5rem",
        }}
        className="bottom-dialog custom-dialog-no-header max-w-md w-full"
      >
        <div className="bg-white text-center w-full px-6 py-4">
          <div className="w-[60px] h-[60px] m-auto mt-6">
            <Image
              width={200}
              height={200}
              className="w-full h-full"
              src="/images/subscriptionLogo.png"
              alt="Subscription Logo"
            />
          </div>
          <h2 className="text-xl font-semibold text-purple-600 mt-4">
            StoryStream Pro
          </h2>
          <p className="text-lg font-bold text-gray-900 my-3">
            Unlock All Shows & Books
            <br />
            with StoryStream Pro
          </p>
          <div className="border border-gray-200"></div>
          <p className="text-gray-600 my-4">
            Subscribe now to enjoy Unlimited Access
          </p>
          <button
            onClick={handleSubscribe}
            style={{
              background:
                "radial-gradient(92.09% 394.93% at 7.91% 50%, #6B0DFF 0%, #FF6B79 100%)",
            }}
            className="text-white py-3 px-6 rounded-xl text-lg font-medium w-full transition hover:opacity-90"
          >
            Subscribe Now {timer > 1 ? `(${timer} Sec)` : "(Pro)"}
          </button>
          <div
            className="text-sm text-gray-600 mt-4 cursor-pointer hover:underline"
            onClick={() => timer === 1 && setShowSubscriptionDialog(false)}
          >
            &larr; I’ll try this later, take me back
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default SubscribePage;
