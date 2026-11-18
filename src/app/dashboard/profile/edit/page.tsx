'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { HiOutlineChevronDown } from "react-icons/hi";
import { MdArrowBack } from "react-icons/md";
import { handleUpdateProfile } from '../../../api/profile';
import { showError, showSuccess } from '../../../../utils/toastService';

export default function EditProfilePage() {
    const router = useRouter();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("M");

    const handleUpdate = async () => {
        try {
            const res = await handleUpdateProfile({
                firstName,
                lastName,
                email,
                gender,
            });
            console.log(res, "API response");
            showSuccess('Profile updated successfully!');
        } catch (error) {
            console.log("Error in update profile", error);
        }
    };

    const handleDelete = () => {
        showError('You are not authorize to delete profile!');
    };

    useEffect(() => {
  if (typeof window === "undefined") return;

  try {
    const raw = localStorage.getItem("loginData");

    if (!raw) {
      console.log("No loginData found");
      return;
    }

    // ✅ Safe parse
    const stored = JSON.parse(raw);

    // ✅ Extract profile
    const profile = stored?.profile || {};

    console.log("Loaded profile:", profile);

    setFirstName(profile.firstname || "");
    setLastName(profile.lastname || "");
    setEmail(profile.email || "");
    // the number is stored without its country code; without it the widget guesses the
    // country from the leading digits (a 65... number showed as Singapore)
    const isd = String(profile.isdCode || "").replace(/\D/g, "");
    const mobile = String(profile.mobileNo || "").replace(/\D/g, "");
    setPhone(isd && !mobile.startsWith(isd) ? `${isd}${mobile}` : mobile);
    setGender(profile.gender || "M");

  } catch (err) {
    console.log("Failed to read loginData", err);
  }
}, []);


    return (
        <div className="h-[800px] flex flex-col">
            {/* Header */}
            <div className="flex space-x-16 items-center px-4 py-4">
                <MdArrowBack onClick={() => router.back()} className="text-2xl text-black cursor-pointer" />
                <h1 className="text-xl font-semibold text-black">Manage Profile</h1>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full border rounded-xl py-3 px-4 dark:bg-gray-50 text-black dark:text-black focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full border rounded-xl py-3 px-4 dark:bg-gray-50 text-black dark:text-black focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                <div className="relative">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded-xl py-3 px-4 dark:bg-gray-50 text-black dark:text-black pr-10 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-500">
                        <HiOutlineChevronDown />
                    </div>
                </div>

                {/* The mobile number is the login identity, so it is shown but not editable here */}
                <PhoneInput
                    value={phone}
                    disabled
                    disableDropdown
                    inputClass="!w-full !rounded-xl !py-3 !pl-12 !pr-4 !text-base dark:bg-gray-50 text-black dark:text-black"
                    buttonClass="!rounded-l-xl"
                    containerClass="!w-full !border !rounded-xl"
                    enableSearch={true}
                />

                {/* <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full border rounded-xl py-3 px-4 dark:bg-gray-50 text-black dark:text-black focus:outline-none focus:ring-2 focus:ring-pink-300"
                >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                </select> */}
            </div>

            {/* Fixed bottom buttons */}
            <div className="px-4 py-4 space-y-3 bg-white sticky bottom-0 z-10">
                <button
                    onClick={handleUpdate}
                    className="w-full py-3 rounded-full text-white font-medium text-base"
                    style={{
                        background: 'linear-gradient(to right, #FFE29F, #FFA99F)',
                    }}
                >
                    Update
                </button>
                <button
                    onClick={handleDelete}
                    className="w-full py-3 rounded-full text-white font-medium text-base"
                    style={{
                        background: 'linear-gradient(to right, #FF512F, #DD2476)',
                    }}
                >
                    Delete Account
                </button>
            </div>
        </div>
    );
}
