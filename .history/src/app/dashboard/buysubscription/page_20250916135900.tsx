'use client';

import Image from 'next/image';
import { Check, X } from 'lucide-react';

export default function SubscriptionPage() {
    return (
        <div className="max-w-sm mx-auto p-4 bg-white rounded-3xl shadow-md">
            {/* Top Banner */}
            <Image alt='login' height={1000} width={1000} src="/images/loginImage.png" />

            <h2 className="text-center text-xl font-bold text-purple-700 mb-1">
                StoryStream <span className="text-pink-500">Pro</span>
            </h2>
            <p className="text-center text-sm text-gray-700 mb-4">
                Unlock All Audio Books with StoryStream Pro
            </p>

            <p className="text-center text-sm text-gray-500 mb-6">
                Join now & enjoy over 30,000 audio books & audio stories with No Ads
            </p>

            {/* Pricing Boxes */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white border rounded-xl p-3 text-center shadow-sm">
                    <p className="text-purple-700 font-bold">ZAR 299</p>
                    <p className="text-sm text-gray-600">Monthly</p>
                </div>
                <div className="bg-white border rounded-xl p-3 text-center shadow-sm">
                    <p className="text-purple-700 font-bold">ZAR 79</p>
                    <p className="text-sm text-gray-600">Weekly</p>
                </div>
                <div className="bg-white border rounded-xl p-3 text-center shadow-sm">
                    <p className="text-purple-700 font-bold">ZAR 2999</p>
                    <p className="text-sm text-gray-600">Yearly</p>
                </div>
                <div className="bg-white border rounded-xl p-3 text-center shadow-sm">
                    <p className="text-purple-700 font-bold">ZAR 799</p>
                    <p className="text-sm text-gray-600">Quarterly</p>
                </div>
            </div>

            {/* Feature Table */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                <p className="font-semibold mb-3">Premium features with StoryStream Pro</p>
                <div className="grid grid-cols-3 text-sm text-gray-700">
                    <div className="font-medium">Features</div>
                    <div className="text-center font-medium">Free</div>
                    <div className="text-center font-medium">Pro</div>

                    <div>All Shows Unlocked</div>
                    <div className="text-center"><X className="text-red-500 w-4 h-4 inline" /></div>
                    <div className="text-center"><Check className="text-green-500 w-4 h-4 inline" /></div>

                    <div>All Audiobooks Unlocked</div>
                    <div className="text-center"><X className="text-red-500 w-4 h-4 inline" /></div>
                    <div className="text-center"><Check className="text-green-500 w-4 h-4 inline" /></div>

                    <div>No Ads</div>
                    <div className="text-center"><X className="text-red-500 w-4 h-4 inline" /></div>
                    <div className="text-center"><Check className="text-green-500 w-4 h-4 inline" /></div>
                </div>
            </div>

            {/* Terms */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                <p className="font-semibold mb-3">Promotion Offer Terms</p>
                <div className="text-xs text-gray-500 mb-6 space-y-1">
                    <ul className="list-disc list-inside text-gray-700">
                        <li>Subscriptions purchased on the offer price above are recurring at the same price at time of purchase.</li>
                        <li>Subscriptions can be cancelled anytime from within the App by visiting Profile → Manage Storystream Pro section.</li>
                        <li>Free Trials (if any) are applicable only once in a lifetime to a user.</li>
                    </ul>
                </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
                <button className="w-full bg-gradient-to-r from-[#FF6B79] to-[#6B0DFF] text-white font-semibold py-3 rounded-xl shadow-md">
                    Continue for ZAR 299
                </button>
                <p className="text-xs text-gray-400 mt-1">thereafter ZAR 299/Monthly. Cancel anytime</p>
            </div>
        </div>
    );
}
