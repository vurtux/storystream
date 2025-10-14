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
  const freeIconColor = freeIcon === 'x' ? 'text-gray-400' : 'text-blue-600';
  const playIconColor = playIcon === '✓' ? 'text-pink-600' : 'text-gray-400';

  return (
    <div className="flex items-center py-2 border-b border-gray-300 last:border-b-0">
      <div className="flex-1 pr-4 text-sm text-gray-800">{name}</div>
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
        background: 'linear-gradient(191.91deg, #E2D4FF -1.09%, #FFD5D9 100%)',
      }}
    >
      {/* 🎞️ Auto-scrolling Banner */}
      <div className="w-full overflow-hidden relative h-[180px]">
        <div className="absolute top-0 left-0 w-full h-full flex items-center">
          <div className="flex animate-scroll-x whitespace-nowrap">
            {[...Array(8)].map((_, i) => (
              <Image
                key={i}
                src={banner}
                alt="banner"
                className="h-[180px] w-auto object-cover mx-2 rounded-xl"
              />
            ))}
          </div>
        </div>
      </div>

      {/* 🌟 Content Section */}
      <div className="flex-1 w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="p-4 pt-6 text-center">
          <div className="flex justify-center mb-2">
            <span className="text-3xl">✨</span>
          </div>
          <h1 className="text-2xl font-bold mb-1 text-gray-800">
            Subscribe to <span className="text-pink-600">storyStream</span>
          </h1>
          <p className="text-xs text-gray-600 mb-6">
            Unlock 30,000+ podcasts, shows, and stories — all in one app.
          </p>

          {/* Plans */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {plans.map(({ price, period }, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white shadow-md border text-center border-gray-200 
                cursor-pointer transition-transform hover:scale-105 hover:border-pink-400"
              >
                <span className="text-lg font-bold block text-gray-800">{price}</span>
                <span className="text-xs text-gray-500">{period}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Features */}
        <div className="mt-6 p-6 pb-2 mx-auto bg-white/70 backdrop-blur-md rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-center mb-4 text-gray-800">
            Premium features with <span className="text-pink-600">storyStream</span>
          </h2>

          <div className="flex items-center mb-2 text-sm font-semibold border-b border-gray-300 pb-2">
            <div className="flex-1 pr-4"></div>
            <div className="w-[20%] text-center font-bold text-gray-500">Free</div>
            <div className="w-[20%] text-center font-extrabold text-pink-600">Pro</div>
          </div>

          {features.map((feature, i) => (
            <FeatureRow key={i} name={feature} freeIcon="x" playIcon="✓" />
          ))}
        </div>

        {/* Offer Terms */}
        <div className="p-4 pt-6 text-left">
          <h3 className="text-sm font-bold mb-2 text-gray-800">
            Promotional Offer Terms
          </h3>
          <ul className="list-disc pl-5 text-xs text-gray-600 space-y-2">
            <li>
              Subscriptions at the offer price remain valid at renewal unless changed.
            </li>
            <li>Cancel anytime via Profile → Manage storyStream.</li>
            <li>Free Trials (if any) are limited to one per user.</li>
          </ul>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-4 pt-6 sticky bottom-0 bg-white/80 backdrop-blur-md w-full text-center shadow-lg">
        <button
          className="w-full h-14 rounded-lg text-white font-bold uppercase 
                     bg-gradient-to-r from-pink-500 to-purple-500 
                     flex items-center justify-center transition duration-300 
                     hover:opacity-90 hover:shadow-lg"
        >
          CONTINUE FOR <span className="ml-1 font-extrabold">₹75</span>
        </button>
        <p className="text-[11px] mt-2 text-gray-600 font-medium">
          Then ₹75/weekly. Cancel anytime.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPage;
