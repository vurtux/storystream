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
      <div className={`w-[20%] text-center text-lg font-bold ${freeIconColor}`}>{freeIcon}</div>
      <div className={`w-[20%] text-center text-lg font-bold ${playIconColor}`}>{playIcon}</div>
    </div>
  );
};

export default function SubscriptionClient() {
  const plans = [
    { price: 'R 5', period: 'Daily', billing: 'R 5/day', savings: null, link: 'https://dcb.storystream.mobi/?deviceId=134018989792035997&country=za&serviceid=5020' },
    { price: 'R 25', period: 'Weekly', billing: 'R 25/week', savings: null, link: 'https://dcb.storystream.mobi/?deviceId=134018989792035997&country=za&serviceid=5239' },
    { price: 'R 80', period: 'Monthly', billing: 'R 80/month', savings: '36%', link: 'https://dcb.storystream.mobi/?deviceId=134018989792035997&country=za&serviceid=5240' },
  ];

  // Get saved mobile number from localStorage
  const mobile = typeof window !== 'undefined' ? localStorage.getItem('mobile') : null;

  // Add MDN to each plan
  const plansWithMDN = plans.map(plan => ({
    ...plan,
    link: mobile ? `${plan.link}&msisdn=${mobile}` : plan.link,
  }));

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
        window.location.href = plansWithMDN[selectedPlan].link;
      }
    }, 180);
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
          @keyframes scroll-x { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .animate-scroll-x { animation: scroll-x 40s linear infinite; will-change: transform; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 1; } 50% { transform: scale(1.2); opacity: 0.3; } 100% { transform: scale(0.8); opacity: 1; } }
          @keyframes bounce-loader { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
          .loader-container { position: fixed; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); z-index: 9999; display: flex; align-items:center; justify-content:center; flex-direction:column; gap:20px; }
          .loader-spinner { width:70px; height:70px; border:6px solid rgba(255,255,255,0.2); border-top:6px solid #9333ea; border-right:6px solid #ec4899; border-radius:50%; animation: spin 1s cubic-bezier(0.68,-0.55,0.265,1.55) infinite; box-shadow: 0 0 30px rgba(147,51,234,0.5); }
          .loader-ring { position:absolute; width:90px; height:90px; border:3px solid rgba(147,51,234,0.3); border-radius:50%; animation:pulse-ring 2s ease-in-out infinite; }
          .loader-dots { display:flex; gap:8px; }
          .loader-dot { width:12px; height:12px; background: linear-gradient(135deg, #9333ea, #ec4899); border-radius:50%; animation: bounce-loader 1s ease-in-out infinite; box-shadow:0 0 15px rgba(147,51,234,0.6); }
          .loader-dot:nth-child(2) { animation-delay: 0.2s; }
          .loader-dot:nth-child(3) { animation-delay: 0.4s; }
          .loader-text { color:white; font-size:16px; font-weight:700; letter-spacing:2px; text-transform:uppercase; text-shadow: 0 0 20px rgba(147,51,234,0.8); }
        `
      }} />

      <div className="min-h-screen w-full flex flex-col text-gray-800" style={{ background: 'linear-gradient(191.91deg, #C4A1FF -1.09%, #FF9AA5 100%)' }}>
        {loading && (
          <div className="loader-container">
            <div style={{ position: 'relative' }}>
              <div className="loader-ring"></div>
              <div className="loader-spinner"></div>
            </div>
            <div className="loader-dots">
              <div className="loader-dot"></div>
              <div className="loader-dot"></div>
              <div className="loader-dot"></div>
            </div>
            <div className="loader-text">Processing...</div>
          </div>
        )}

        {/* Banner */}
        <div className="w-full overflow-hidden relative h-[180px] bg-gradient-to-r from-purple-50 to-pink-50 m-0 p-0">
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="flex animate-scroll-x">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="flex-shrink-0" style={{ marginLeft: i === 0 ? '0' : '-2px' }}>
                  <Image
                    src="/images/subbanner.png"
                    alt="banner"
                    width={300}
                    height={160}
                    className="h-[180px] w-auto object-cover rounded-2xl shadow-xl m-0 p-0"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 w-full max-w-2xl mx-auto pb-40">
          <div className="p-4 pt-3 text-center">
            <div className="flex justify-center mb-1.5"><span className="text-3xl">⚡</span></div>
            <h1 className="text-2xl font-bold mb-1.5 text-gray-900">
              Subscribe to <span className="text-purple-700">storyStream</span>
            </h1>
            <p className="text-[13px] text-gray-700 mb-5 font-medium">
              Unlock 30,000+ podcasts, shows & stories — all in one app.
            </p>

            {/* Plans */}
            <div className="grid grid-cols-3 gap-2.5 px-2">
              {plansWithMDN.map((plan, i) => (
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
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-bl-lg rounded-tr-xl">
                      SAVE {plan.savings}
                    </div>
                  )}
                  {selectedPlan === i && (
                    <div className="absolute -top-1 -right-1 bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      ✓
                    </div>
                  )}
                  <span className={`text-xl font-extrabold block transition-colors ${selectedPlan === i ? 'text-purple-700' : 'text-gray-800'}`}>
                    {plan.price}
                  </span>
                  <span className="text-[11px] text-gray-600 font-semibold mt-0.5 block">
                    {plan.period}
                  </span>
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
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md p-2 bg-white shadow-2xl rounded-xl">
          <div className="max-w-md mx-auto">
            <div className="mb-2 text-center">
              <span className="text-[13px] font-bold text-purple-700">{plansWithMDN[selectedPlan].period} Plan</span>
              {plansWithMDN[selectedPlan].savings && (
                <span className="ml-1.5 text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">
                  Save {plansWithMDN[selectedPlan].savings}
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
              CONTINUE FOR <span className="ml-2 font-extrabold text-xl">{plansWithMDN[selectedPlan].price}</span>
            </button>
            <p className="text-[10px] mt-2.5 text-gray-600 font-semibold">
              Then {plansWithMDN[selectedPlan].billing}. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
