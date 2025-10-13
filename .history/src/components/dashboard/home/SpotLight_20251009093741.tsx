'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Play, MoreHorizontal, Download, List } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SpotlightContent {
    conId: number;
    conName: string;
    imgIrl: string;
    cotDeepLink: string;
    spotlight_type: string;
    btn_tag: string;
}

interface SpotlightBlock {
    bkId: number;
    bkName: string;
    bkType: string;
    shapeType: 'spotlight';
    zoom: number;
    itype: number;
    contents: SpotlightContent[];
}

const SpotLight = ({ data }: { data: SpotlightBlock }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (data?.contents?.length > 0) {
            setLoading(false);
        }
    }, [data]);

    const handlePlay = () => {
        router.push('/dashboard/prodcast');
    };

    return (
        <div>
            <div className="flex justify-between items-center my-4">
                <h2 className="text-lg font-semibold">
                    {loading ? <div className="w-32 h-5 bg-gray-300 rounded animate-pulse" /> : data.bkName}
                </h2>
                {loading ? (
                    <div className="w-16 h-4 bg-gray-300 rounded animate-pulse" />
                ) : (
                    <a href="#" className="text-purple-600 text-sm font-medium">See All</a>
                )}
            </div>

            {loading ? (
                <div className="flex gap-4 items-center bg-white rounded-xl shadow p-4 animate-pulse">
                    <div className="w-40 h-40 bg-gray-300 rounded-lg" />
                    <div className="flex flex-col flex-1 gap-3">
                        <div className="h-5 w-3/4 bg-gray-300 rounded" />
                        <div className="h-4 w-1/2 bg-gray-300 rounded" />
                        <div className="flex gap-2 mt-2">
                            <div className="w-20 h-8 bg-gray-300 rounded-full" />
                            <div className="w-8 h-8 bg-gray-300 rounded-full" />
                            <div className="w-8 h-8 bg-gray-300 rounded-full" />
                            <div className="w-8 h-8 bg-gray-300 rounded-full" />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex gap-4 items-center bg-white rounded-xl shadow p-4">
                    <Image
                        src={data.contents[0]?.imgIrl || '/images/playListImage.png'}
                        alt={data.contents[0]?.conName || 'Spotlight'}
                        width={200}
                        height={200}
                        className="w-40 h-40 rounded-lg object-cover"
                    />

                    <div className="flex flex-col flex-1">
                        <h3 className="text-lg text-black font-semibold leading-tight">
                            {data.contents[0]?.conName}
                        </h3>
                        <p className="text-sm text-gray-500">Apple Talk &nbsp; | &nbsp; 52:27 mins</p>

                        <div className="flex items-center mt-3 gap-2">
                            <button
                                onClick={handlePlay}
                                className="bg-pink-600 text-white text-sm px-4 py-1.5 rounded-full flex items-center gap-2 cursor-pointer"
                            >
                                <Play size={16} /> Play
                            </button>
                            <button><List size={20} className="text-gray-600" /></button>
                            <button><Download size={20} className="text-gray-600" /></button>
                            <button><MoreHorizontal size={20} className="text-gray-600" /></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpotLight;
