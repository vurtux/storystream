'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { showSuccess } from '../../../../utils/toastService';

export default function LanguageSelectPage() {

  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState<string>('hi');

  const languages = [
    { label: 'English', code: 'EN', value: 'en' },
    { label: 'हिंदी', code: 'HI', value: 'hi' },
    // { label: 'हिंदी', subLabel: 'Hindi', code: 'HI', value: 'hi' },
  ];

  const handleLanguageChange = (lang: any) => {
    setSelectedLang(lang);
  }

  const handleSetLanguage = () => {
    localStorage.setItem('language', selectedLang);
    showSuccess("Language changed successfully!");
  }

  useEffect(() => {
     setSelectedLang(localStorage.getItem('language') || 'hi');
  }, [])

  return (
    <div className="h-[600px] flex flex-col justify-between">
      {/* Back Arrow */}
      <div className="w-full flex justify-start cursor-pointer">
        <ArrowLeft onClick={() => router.back()} className="h-6 w-6" />
      </div>

      {/* Language Icon */}
      <div className="flex flex-col mt-6 ml-4">
        <img src="/images/Language_photo.jpeg" alt="language" className="h-20 w-20 mb-4" />
        <p className="font-bold text-lg">भाषा चुनें</p>
        <p className="text-lg">Please Select Language</p>
      </div>

      {/* Language Options */}
      <div className="w-full max-w-md mt-4 space-y-4">
        {languages.map((lang) => (
          <div
            key={lang.value}
            onClick={() => handleLanguageChange(lang.value)}
            className={`flex justify-between items-center px-4 py-6 rounded-xl border cursor-pointer transition-all ${
              selectedLang === lang.value
                ? 'bg-pink-400 text-white'
                : 'bg-white border-pink-200 text-black'
            }`}
          >
            <div>
              <p className="font-semibold text-lg">{lang.label}</p>
              {/* {lang.subLabel && <p className="text-sm text-gray-600">{lang.subLabel}</p>} */}
            </div>
            <span className="text-xl font-bold">{lang.code}</span>
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <button
        disabled={!selectedLang}
        onClick={handleSetLanguage}
        className={`w-full cursor-pointer max-w-md py-3 rounded-full mt-1 mb-10 text-white font-semibold text-center text-lg ${
          selectedLang
            ? 'bg-gradient-to-r from-yellow-300 to-pink-400'
            : 'bg-gradient-to-r from-yellow-100 to-pink-100 cursor-not-allowed'
        }`}
      >
        {selectedLang === "en" ? "Continue" : "जारी रखें"}
      </button>
    </div>
  );
}
