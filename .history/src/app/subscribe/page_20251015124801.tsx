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
    <div className="flex items-center py-2 border-b border-gray-200 last:border-b-0 hover:bg-purple-50 transition-colors text-sm font-medium">
      <div className="flex-1 pr-3">{name}</div>
      <div className={`w-[20%] text-center font-bold ${freeIconColor}`}>{freeIcon}</div>
      <div className={`w-[20%] text-center font-bold ${playIconColor}`}>{playIcon}</div>
    </div>
  );
};

export default function SubscriptionClient() {
  const plans = [
    { price: 'R 5', period: 'Daily', billing: 'R 5/day', savings: null, link: 'https://dcb.storystream.mobi/?deviceId=134018989792035997&country=za&serviceid=5020&m=t' },
    { price: 'R 25', period: 'Weekly', billing: 'R 25/week', savings: null, link: 'https://dcb.storystream.mobi/?deviceId=134018989792035997&country=za&serviceid=5239&m=t' },
    { price: 'R 80', period: 'Monthly', billing: 'R 80/month', savings: '36%', link: 'https://dcb.storystream.mobi/?deviceId=134018989792035997&country=za&serviceid=5240&m=t' },
  ];

  const [selectedPlan, setSelectedPlan] = useState(0);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('redirecting', 'true');
    }
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.href = plans[selectedPlan].link;
      }
    }, 1800);
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
          @font-face {
            font-family: 'SF Pro Rounded';
            src: url('/fonts/SFProRounded/SF-Pro-Rounded-Bold.ttf') format('truetype');
            font-weight: 700;
            font-style: normal;
            font-display: swap;
          }
          html, body {
            font-family: 'SF Pro Rounded', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          }
        `
      }} />

      <div className="min-h-screen w-full flex flex-col bg-gradient-to-r from-purple-50 to-pink-50 text-gray-800">
        {loading && (
          <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-black/70 backdrop-blur-sm z-50">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-2 border-purple-300 rounded-full animate-pulse"></div>
              <div className="w-full h-full border-4 border-t-purple-600 border-r-pink-500 rounded-full animate-spin"></div>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce delay-200"></div>
              <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce delay-400"></div>
            </div>
            <span className="text-white text-sm font-semibold tracking-wider">Processing...</span>
          </div>
        )}

        {/* Banner */}
        <div className="w-full relative h-[180px] overflow-hidden rounded-2xl m-0 p-0">
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="flex animate-scroll-x">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="flex-shrink-0" style={{ marginLeft: i === 0 ? 0 : -2 }}>
                  <Image
                    src="/images/subbanner.png"
                    alt="banner"
                    width={300}
                    height={160}
                    className="h-[180px] w-auto object-cover rounded-2xl shadow-xl"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 max-w-2xl mx-auto pb-36">
          <div className="p-4 pt-3 text-center">
            <div className="flex justify-center mb-1.5"><span className="text-2xl">⚡</span></div>
            <h1 className="text-2xl font-bold mb-1 text-gray-900">
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
                  className={`p-3.5 rounded-2xl bg-white shadow-lg border-2 text-center cursor-pointer transition-all duration-300 relative overflow-hidden
                    ${selectedPlan === i
                      ? 'border-purple-600 scale-105 shadow-2xl pulse-glow'
                      : 'border-purple-200 hover:border-purple-400 hover:scale-102'
                    }`}
                >
                  {plan.savings && (
                    <div className="absolute top-0 right-0 bg-green-100 text-green-700 text-[9px] font-bold px-1.5 py-0.5 rounded-bl-lg rounded-tr-xl">
                      SAVE {plan.savings}
                    </div>
                  )}
                  {selectedPlan === i && (
                    <div className="absolute -top-1 -right-1 bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      ✓
                    </div>
                  )}
                  <span className={`text-xl font-extrabold block ${selectedPlan === i ? 'text-purple-700' : 'text-gray-800'}`}>
                    {plan.price}
                  </span>
                  <span className="text-[11px] text-gray-600 font-semibold mt-0.5 block">{plan.period}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mt-5 p-5 pb-3 mx-4 bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-purple-100">
            <h2 className="text-lg font-bold text-center mb-4 text-gray-900">
              Premium features with <span className="text-purple-700">storyStream</span>
            </h2>
            <div className="flex items-center mb-2.5 text-xs font-bold border-b-2 border-purple-300 pb-2.5">
              <div className="flex-1 pr-3"></div>
              <div className="w-[20%] text-center font-bold text-gray-500">Free</div>
              <div className="w-[20%] text-center font-extrabold text-purple-700">Pro</div>
            </div>
            {features.map((f, i) => (
              <FeatureRow key={i} name={f} freeIcon="✗" playIcon="✓" />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-2xl">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-2.5">
              <span className="text-[13px] font-bold text-purple-700">{plans[selectedPlan].period} Plan</span>
              {plans[selectedPlan].savings && (
                <span className="ml-1.5 text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">
                  Save {plans[selectedPlan].savings}
                </span>
              )}
            </div>
            <button
              onClick={handleContinue}
              disabled={loading}
              className="w-full h-14 rounded-2xl text-white font-bold uppercase text-base
                         bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 
                         flex items-center justify-center transition-all duration-300 
                         hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]
                         shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              CONTINUE FOR <span className="ml-2 font-extrabold text-xl">{plans[selectedPlan].price}</span>
            </button>
            <p className="text-[10px] mt-2.5 text-gray-600 font-semibold">
              Then {plans[selectedPlan].billing}. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
