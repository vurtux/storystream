'use client';
import React from 'react';

interface FeatureRowProps {
  name: string;
  freeIcon: string;
  playIcon: string;
}

const FeatureRow: React.FC<FeatureRowProps> = ({ name, freeIcon, playIcon }) => {
  const freeIconColor = freeIcon === 'x' ? 'text-gray-400' : 'text-blue-700';
  const playIconColor = playIcon === '✓' ? 'text-purple-700' : 'text-gray-400';

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
        background: 'linear-gradient(191.91deg, #C4A1FF -1.09%, #FF9AA5 100%)',
      }}
    >
      {/* 🎞️ Auto-scrolling Banner */}
      <div className="w-full overflow-hidden relative h-[200px] bg-gradient-to-r from-purple-100 to-pink-100">
        <div className="absolute top-0 left-0 w-full h-full flex items-center">
          <div className="flex animate-scroll-x">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="h-[180px] w-[320px] bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl shadow-lg flex items-center justify-center text-white font-bold text-xl"
                style={{ marginRight: '-4px' }}
              >
                Banner {i + 1}
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
            <span className="text-3xl">⚡</span>
          </div>
          <h1 className="text-2xl font-bold mb-1 text-gray-900">
            Subscribe to <span className="text-purple-700">storyStream</span>
          </h1>
          <p className="text-xs text-gray-700 mb-6">
            Unlock 30,000+ podcasts, shows & stories — all in one app.
          </p>

          {/* Plans */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {plans.map(({ price, period }, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white shadow-lg border-2 text-center border-purple-200 
                cursor-pointer transition-all hover:scale-105 hover:border-purple-500 hover:shadow-xl"
              >
                <span className="text-xl font-extrabold block text-purple-700">{price}</span>
                <span className="text-xs text-gray-600 font-medium">{period}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Features */}
        <div className="mt-6 p-6 pb-3 mx-4 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-purple-100">
          <h2 className="text-xl font-bold text-center mb-5 text-gray-800">
            Premium features with <span className="text-purple-700">storyStream</span>
          </h2>

          <div className="flex items-center mb-3 text-sm font-semibold border-b-2 border-purple-200 pb-2">
            <div className="flex-1 pr-4"></div>
            <div className="w-[20%] text-center font-bold text-gray-500">Free</div>
            <div className="w-[20%] text-center font-extrabold text-purple-700">Pro</div>
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
          <ul className="list-disc pl-5 text-xs text-gray-700 space-y-2">
            <li>
              Subscriptions at the offer price remain valid at renewal unless changed.
            </li>
            <li>Cancel anytime via Profile → Manage storyStream.</li>
            <li>Free Trials (if any) are limited to one per user.</li>
          </ul>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-4 pt-6 sticky bottom-0 bg-white/95 backdrop-blur-lg w-full text-center shadow-2xl border-t border-purple-100">
        <button
          className="w-full h-16 rounded-2xl text-white font-bold uppercase text-lg
                     bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 
                     flex items-center justify-center transition-all duration-300 
                     hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]"
        >
          CONTINUE FOR <span className="ml-2 font-extrabold text-2xl">₹75</span>
        </button>
        <p className="text-xs mt-3 text-gray-600 font-medium">
          Then ₹75/weekly. Cancel anytime.
        </p>
      </div>

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
          animation: scroll-x 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SubscriptionPage;