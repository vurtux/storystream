"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
    if (!userData?.userId || userData?.userId === null || userData?.userId === "") {
      router.push("/subscribe");
    } else {
      router.push("/subscribe");
    }
    setShowSubscriptionDialog(false);
  };

  useEffect(() => {
  if (typeof window === "undefined") return;

  const raw = localStorage.getItem("loginData");

  let data: any = null;

  // ✅ If nothing found
  if (!raw) {
    return;
  }

  // ✅ If stored incorrectly as "[object Object]"
  if (raw.startsWith("[object")) {
    console.log("Corrupted loginData detected. Skipping parse.");
    return;
  }

  // ✅ Try parsing normally
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.log("Failed to parse loginData:", err);
    return;
  }

  // ✅ If no profile → skip
  if (!data?.profile) return;

  // ✅ Set user data safely
  setUserData({
    userId: data.profile.userId || "",
    isdCode: data.profile.isdCode || "",
    mobileNo: data.profile.mobileNo || "",
    vip: data.profile.vip || 0,
    country: data.profile.country || "ZA",
  });
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

          <h2 className="text-xl font-semibold text-purple-600 mt-4">StoryStream</h2>

          <p className="text-gray-600 my-4">
            Subscribe now to enjoy unlimited access to StoryStream for R5/day on your Vodacom
            Account/Airtime. First day is free.
          </p>

          <button
            onClick={handleSubscribe}
            style={{
              background:
                "radial-gradient(92.09% 394.93% at 7.91% 50%, #6B0DFF 0%, #FF6B79 100%)",
            }}
            className="text-white py-3 px-6 rounded-xl text-lg font-medium w-full transition hover:opacity-90"
          >
            Subscribe Now
          </button>

          <div
            className="text-sm text-gray-600 mt-4 cursor-pointer hover:underline"
            onClick={() => timer === 1 && setShowSubscriptionDialog(false)}
          >
            &larr; I’ll try this later, take me back
          </div>

          {/* ✅ Terms & Conditions placed below */}
          <p className="text-xs text-gray-500 mt-3">
            By subscribing, you agree to our{" "}
            <a
              href="https://www.storystream.mobi/tnc.html"
              className="text-purple-600 underline hover:text-purple-800"
            >
              Terms and Conditions
            </a>.
          </p>

        </div>
      </Dialog>
    </div>
  );
};

export default SubscribePage;
