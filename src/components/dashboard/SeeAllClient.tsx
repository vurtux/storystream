'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { IoArrowBackOutline } from "react-icons/io5";
import { useRouter } from 'next/navigation';
import useDashboard from '../../hooks/useDashboard';
import slugify from 'slugify';

export default function SeeAllClient({ heading }: any) {
    const router = useRouter();
    const { setDetailData } = useDashboard();

    const [seeAllData, setSeeAllData] = useState<any[]>([]);

    useEffect(() => {
        const data = localStorage.getItem('seeAllData');
        console.log(data, "data====");
        if (data) {
            setSeeAllData(JSON.parse(data));
            // setTimeout(() => {
            //     setSeeAllData(JSON.parse(data));
            // }, 500); // simulate slight delay for shimmer
        }
    }, []);

    const handleDetail = (conId: number, conName: string, imgIrl: string) => {
        setDetailData({ conId, bkName: "bkName", conName, imgIrl });
        router.push(`/home/podcast/${encodeURIComponent(conId)}/${slugify(conName || "unknown", { lower: true })}`);
    };

    return (
        <div>
            <div className="flex items-center gap-24 mb-6">
                <IoArrowBackOutline onClick={() => router.back()} className='cursor-pointer' size={24} />
                <h2 className="text-lg font-semibold">{heading}</h2>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-3 gap-4">
                {seeAllData?.length === 0
                    ? Array.from({ length: 15 }).map((_, idx) => (
                        <div key={idx} className="animate-pulse">
                            <div className="w-full aspect-square bg-gray-300 rounded-lg"></div>
                            <div className="mt-2 h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                        </div>
                    ))
                    : (seeAllData)?.map((item: any, idx: number) => (
                        <div key={idx} className="text-center">
                            <div onClick={() => handleDetail(item.conId || item.podcast_id, item.conName, item.imgIrl)} className="relative w-full aspect-square rounded-lg overflow-hidden cursor-pointer">
                                <Image
                                    src={item.imgIrl}
                                    alt={item.conName || "conName"}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-2 right-2">
                                    <Image
                                        style={{ borderRadius: "20%" }}
                                        src="/images/myuze1.jpeg"
                                        alt="Badge"
                                        width={20}
                                        height={20}
                                    />
                                </div>
                            </div>
                            <p className="mt-2 text-xs font-medium">{item.conName}</p>
                        </div>
                    ))}
            </div>
        </div>
    );
}
