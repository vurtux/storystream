'use client';

import { useState } from 'react';
import Image from 'next/image';

interface FeatureRowProps {
  name: string;
  freeIcon: string;
  playIcon: string;
}

const FeatureRow = ({ name, freeIcon, playIcon }: FeatureRowProps) => {
  const freeIconColor = freeIcon === '✗' ? 'text-red-400' : 'text-blue-700';
  const playIconColor = playIcon === '✓' ? 'text-green-500' : 'text-gray-400';

  return (
    <div className="flex items-center py-2.5 border-b border-gray-200 last:border-b-0 hover:bg-purple-50 transition-colors">
      <div className="flex-1 pr-3 text-[13px] text-gray-800 font-medium">{name}</div>
      <div className={`w-[20%] text-center text-lg font-bold ${freeIconColor}`}>
        {freeIcon}
      </div>
      <div className={`w-[20%] text-center text-lg font-bold ${playIconColor}`}>
        {playIcon}
      </div>
    </div>
  );
};

export default function SubscriptionClient() {
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
    if (typeof window !== 'undefined') {
      window.location.href = plans[selectedPlan].link;
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @font-face {
            font-family: 'SF Pro Rounded';
            src: url('/fonts/SFProRounded/FontsFree-Net-SF-Pro-Rounded-Regular.ttf') format('truetype');
            font-weight: 400;
            font-style: normal;
            font-display: swap;
          }
          
          * {
            font-family: 'SF Pro Rounded', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          }
          
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
        {/* Auto-scrolling Banner */}
        <div className="w-full overflow-hidden relative h-[180px] bg-gradient-to-r from-purple-50 to-pink-50 mt-0 pt-0">

          {/* <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="flex animate-scroll-x">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="flex-shrink-0" style={{ marginLeft: i === 0 ? '0' : '-2px' }}>
                  <Image
                    src="/images/subbanner.png"
                    alt="banner"
                    width={300}
                    height={160}
                    className="h-[160px] w-auto object-cover rounded-2xl shadow-xl m-0 p-0"
                    unoptimized
                  />
                </div>
              ))}
            </div> */}
          {/* </div> */}
        </div>

        {/* Content Section */}
        <div className="flex-1 w-full max-w-2xl mx-auto pb-40">
          {/* Header */}
          <div className="p-4 pt-4 text-center">
            <div className="flex justify-center mb-1.5">
              <span className="text-3xl">⚡</span>
            </div>
            <h1 className="text-2xl font-bold mb-1.5 text-gray-900">
              Subscribe to <span className="text-purple-700">storyStream</span>
            </h1>
            <p className="text-[13px] text-gray-700 mb-5 font-medium">
              Unlock 30,000+ podcasts, shows & stories — all in one app.
            </p>

            {/* Plans */}
            <div className="grid grid-cols-3 gap-2.5 px-2">
              {plans.map((plan, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedPlan(i)}
                  className={`p-3.5 rounded-2xl bg-white shadow-lg border-2 text-center 
                  cursor-pointer transition-all duration-300 relative overflow-hidden
                  ${selectedPlan === i
                      ? 'border-purple-600 scale-105 shadow-2xl pulse-glow'
                      : 'border-purple-200 hover:border-purple-400 hover:scale-102'
                    }`}
                >
                  {plan.savings && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-bl-lg rounded-tr-xl">
                      SAVE {plan.savings}
                    </div>
                  )}
                  {selectedPlan === i && (
                    <div className="absolute -top-1 -right-1 bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      ✓
                    </div>
                  )}
                  <span className={`text-xl font-extrabold block transition-colors ${selectedPlan === i ? 'text-purple-700' : 'text-gray-800'
                    }`}>
                    {plan.price}
                  </span>
                  <span className="text-[11px] text-gray-600 font-semibold mt-0.5 block">
                    {plan.period}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Features */}
          <div className="mt-5 p-5 pb-3 mx-4 bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-purple-100">
            <h2 className="text-lg font-bold text-center mb-4 text-gray-900">
              Premium features with <span className="text-purple-700">storyStream</span>
            </h2>

            <div className="flex items-center mb-2.5 text-xs font-bold border-b-2 border-purple-300 pb-2.5">
              <div className="flex-1 pr-3"></div>
              <div className="w-[20%] text-center font-bold text-gray-500">Free</div>
              <div className="w-[20%] text-center font-extrabold text-purple-700">Pro</div>
            </div>

            {features.map((feature, i) => (
              <FeatureRow key={i} name={feature} freeIcon="✗" playIcon="✓" />
            ))}
          </div>

          {/* Offer Terms */}
          <div className="p-4 pt-5 mx-4 text-left">
            <h3 className="text-[13px] font-bold mb-2.5 text-gray-900">
              Promotional Offer Terms
            </h3>
            <ul className="list-disc pl-4 text-[11px] text-gray-700 space-y-1.5 leading-relaxed">
              <li>
                Subscriptions at the offer price remain valid at renewal unless changed.
              </li>
              <li>Cancel anytime via Profile → Manage storyStream.</li>
              <li>Free Trials (if any) are limited to one per user.</li>
            </ul>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-2xl">
          <div className="max-w-md mx-auto">
            <div className="mb-2.5 text-center">
              <span className="text-[13px] font-bold text-purple-700">{plans[selectedPlan].period} Plan</span>
              {plans[selectedPlan].savings && (
                <span className="ml-1.5 text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">
                  Save {plans[selectedPlan].savings}
                </span>
              )}
            </div>
            <button
              onClick={handleContinue}
              className="w-full h-14 rounded-2xl text-white font-bold uppercase text-base
                         bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 
                         flex items-center justify-center transition-all duration-300 
                         hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]
                         shadow-xl"
            >
              CONTINUE FOR <span className="ml-2 font-extrabold text-xl">{plans[selectedPlan].price}</span>
            </button>
            <p className="text-[10px] mt-2.5 text-center text-gray-600 font-semibold">
              Then {plans[selectedPlan].billing}. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}