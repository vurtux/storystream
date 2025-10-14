'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import banner from './../../../public/images/subbanner.png';

interface FeatureRowProps {
  name: string;
  freeIcon: string;
  playIcon: string;
}

const FeatureRow: React.FC<FeatureRowProps> = ({ name, freeIcon, playIcon }) => {
  const freeIconColor = freeIcon === '✗' ? 'text-red-400' : 'text-blue-700';
  const playIconColor = playIcon === '✓' ? 'text-green-500' : 'text-gray-400';

  return (
    <div className="flex items-center py-3 border-b border-gray-200 last:border-b-0 hover:bg-purple-50 transition-colors">
      <div className="flex-1 pr-4 text-sm text-gray-800 font-medium">{name}</div>
      <div className={`w-[20%] text-center text-xl font-bold ${freeIconColor}`}>
        {freeIcon}
      </div>
      <div className={`w-[20%] text-center text-xl font-bold ${playIconColor}`}>
        {playIcon}
      </div>
    </div>
  );
};

export default function SubscriptionPage() {
  const plans = [
    { 
      price: 'R 5', 
      period: 'Daily', 
      billing: 'R 5/day', 
      savings: null,
      link: 'https://dcb.storystream.mobi/?deviceId=134018989792035997&country=za&serviceid=5020&m=t'
    },
    { 
      price: 'R 25', 
      period: 'Weekly', 
      billing: 'R 25/week', 
      savings: null,
      link: 'https://dcb.storystream.mobi/?deviceId=134018989792035997&country=za&serviceid=5239&m=t'
    },
    { 
      price: 'R 80', 
      period: 'Monthly', 
      billing: 'R 80/month', 
      savings: '36%',
      link: 'https://dcb.storystream.mobi/?deviceId=134018989792035997&country=za&serviceid=5240&m=t'
    },
  ];

  const [selectedPlan, setSelectedPlan] = useState(0);

  const features = [
    'All Shows Unlocked',
    'All Audiobooks Unlocked',
    'Ad-Free Experience',
    'Download to listen Offline',
    'Unlimited Downloads',
    'Bonus Content',
    'High Quality Audio',
  ];

  const handleContinue = () => {
    const selectedLink = plans[selectedPlan].link;
    window.location.href = selectedLink;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scroll-x {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-scroll-x {
            animation: scroll-x 40s linear infinite;
            will-change: transform;
          }
          @keyframes pulse-glow {
            0%, 100% {
              box-shadow: 0 0 20px rgba(147, 51, 234, 0.4);
            }
            50% {
              box-shadow: 0 0 30px rgba(147, 51, 234, 0.6);
            }
          }
          .pulse-glow {
            animation: pulse-glow 2s ease-in-out infinite;
          }
        `
      }} />
      
      <div
        className="min-h-screen w-full flex flex-col text-gray-800"
        style={{
          background: 'linear-gradient(191.91deg, #C4A1FF -1.09%, #FF9AA5 100%)',
        }}
      >
        {/* 🎞️ Auto-scrolling Banner - NO GAP */}
        <div className="w-full overflow-hidden relative h-[200px] bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="flex animate-scroll-x">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="flex-shrink-0" style={{ marginLeft: i === 0 ? '0' : '-2px' }}>
                  <Image
                    src={banner}
                    alt="banner"
                    className="h-[180px] w-auto object-cover rounded-2xl shadow-xl"
                    priority={i < 3}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 🌟 Content Section */}
        <div className="flex-1 w-full max-w-2xl mx-auto pb-40">
          {/* Header */}
          <div className="p-4 pt-6 text-center">
            <div className="flex justify-center mb-2">
              <span className="text-4xl">⚡</span>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900">
              Subscribe to <span className="text-purple-700">storyStream</span>
            </h1>
            <p className="text-sm text-gray-700 mb-6 font-medium">
              Unlock 30,000+ podcasts, shows & stories — all in one app.
            </p>

            {/* Plans */}
            <div className="grid grid-cols-3 gap-3 px-2">
              {plans.map((plan, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedPlan(i)}
                  className={`p-4 rounded-2xl bg-white shadow-lg border-2 text-center 
                  cursor-pointer transition-all duration-300 relative overflow-hidden
                  ${selectedPlan === i 
                    ? 'border-purple-600 scale-105 shadow-2xl pulse-glow' 
                    : 'border-purple-200 hover:border-purple-400 hover:scale-102'
                  }`}
                >
                  {plan.savings && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl">
                      SAVE {plan.savings}
                    </div>
                  )}
                  {selectedPlan === i && (
                    <div className="absolute -top-1 -right-1 bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                      ✓
                    </div>
                  )}
                  <span className={`text-2xl font-extrabold block transition-colors ${
                    selectedPlan === i ? 'text-purple-700' : 'text-gray-800'
                  }`}>
                    {plan.price}
                  </span>
                  <span className="text-xs text-gray-600 font-semibold mt-1 block">
                    {plan.period}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Features */}
          <div className="mt-6 p-6 pb-4 mx-4 bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-purple-100">
            <h2 className="text-xl font-bold text-center mb-5 text-gray-900">
              Premium features with <span className="text-purple-700">storyStream</span>
            </h2>

            <div className="flex items-center mb-3 text-sm font-bold border-b-2 border-purple-300 pb-3">
              <div className="flex-1 pr-4"></div>
              <div className="w-[20%] text-center font-bold text-gray-500">Free</div>
              <div className="w-[20%] text-center font-extrabold text-purple-700">Pro</div>
            </div>

            {features.map((feature, i) => (
              <FeatureRow key={i} name={feature} freeIcon="✗" playIcon="✓" />
            ))}
          </div>

          {/* Offer Terms */}
          <div className="p-5 pt-6 mx-4 text-left">
            <h3 className="text-sm font-bold mb-3 text-gray-900">
              Promotional Offer Terms
            </h3>
            <ul className="list-disc pl-5 text-xs text-gray-700 space-y-2 leading-relaxed">
              <li>
                Subscriptions at the offer price remain valid at renewal unless changed.
              </li>
              <li>Cancel anytime via Profile → Manage storyStream.</li>
              <li>Free Trials (if any) are limited to one per user.</li>
            </ul>
          </div>
        </div>

        {/* Bottom CTA - Fixed with Selected Plan */}
        <div className="fixed bottom-0 left-0 right-0 p-5 bg-white shadow-2xl">
          <div className="max-w-md mx-auto">
            <div className="mb-3 text-center">
              <span className="text-sm font-bold text-purple-700">{plans[selectedPlan].period} Plan</span>
              {plans[selectedPlan].savings && (
                <span className="ml-2 text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded-full">
                  Save {plans[selectedPlan].savings}
                </span>
              )}
            </div>
            <button
              onClick={handleContinue}
              className="w-full h-16 rounded-2xl text-white font-bold uppercase text-lg
                         bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 
                         flex items-center justify-center transition-all duration-300 
                         hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]
                         shadow-xl"
            >
              CONTINUE FOR <span className="ml-2 font-extrabold text-2xl">{plans[selectedPlan].price}</span>
            </button>
            <p className="text-xs mt-3 text-center text-gray-600 font-semibold">
              Then {plans[selectedPlan].billing}. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}