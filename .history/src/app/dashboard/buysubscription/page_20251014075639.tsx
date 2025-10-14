'use client';
import React from 'react';
import Image from 'next/image';
import banner from './../../../../public/images/subbanner.png';

interface FeatureRowProps {
  name: string;
  freeIcon: string;
  playIcon: string;
}

const FeatureRow: React.FC<FeatureRowProps> = ({ name, freeIcon, playIcon }) => {
  const freeIconColor = freeIcon === 'x' ? 'text-gray-400' : 'text-blue-700';
  const playIconColor = playIcon === '✓' ? 'text-purple-700' : 'text-gray-400';

  return (
    <div className="flex items-center py-3 border-b border-gray-200 last:border-b-0">
      <div className="flex-1 pr-4 text-sm text-gray-800 font-medium">{name}</div>
      <div className={`w-[20%] text-center text-lg font-bold ${freeIconColor}`}>
        {freeIcon}
      </div>
      <div className={`w-[20%] text-center text-lg font-bold ${playIconColor}`}>
        {playIcon}
      </div>
    </div>
  );
};

const SubscriptionPage: React.FC = () => {
  const plans = [
    { price: '₹75', period: 'Weekly' },
    { price: '₹99', period: 'Monthly' },
    { price: '₹249', period: 'Quarterly' },
    { price: '₹599', period: 'Yearly' },
  ];

  const features = [
    'All Shows Unlocked',
    'All Audiobooks Unlocked',
    'Ad-Free Experience',
    'Download to listen Offline',
    'Unlimited Downloads',
    'Bonus Content',
    'High Quality Audio',
  ];

  return (
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
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🌟 Content Section */}
      <div className="flex-1 w-full max-w-2xl mx-auto">
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-2">
            {plans.map(({ price, period }, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white shadow-xl border-2 text-center border-purple-200 
                cursor-pointer transition-all duration-300 hover:scale-105 hover:border-purple-500 hover:shadow-2xl
                active:scale-95"
              >
                <span className="text-2xl font-extrabold block text-purple-700">{price}</span>
                <span className="text-xs text-gray-600 font-semibold mt-1 block">{period}</span>
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

      {/* Bottom CTA */}
      <div className="p-4 pt-6 sticky bottom-0 bg-white/95 backdrop-blur-xl w-full text-center shadow-2xl border-t-2 border-purple-200">
        <button
          className="w-full max-w-md mx-auto h-16 rounded-2xl text-white font-bold uppercase text-lg
                     bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 
                     flex items-center justify-center transition-all duration-300 
                     hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]
                     shadow-xl"
        >
          CONTINUE FOR <span className="ml-2 font-extrabold text-2xl">₹75</span>
        </button>
        <p className="text-xs mt-3 text-gray-600 font-semibold">
          Then ₹75/weekly. Cancel anytime.
        </p>
      </div>

      {/* Custom Animation Styles */}
      <style jsx>{`
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
      `}</style>
    </div>
  );
};

export default SubscriptionPage;