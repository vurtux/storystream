'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import slugify from 'slugify';

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

const HeaderSlider = ({ data }: { data: SpotlightBlock }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (data?.contents?.length > 0) {
            setLoading(false);
        }
    }, [data]);

    const handleDetail = (conId: number, conName: string) => {
        // router.push(`/home/podcast?conId=${encodeURIComponent(conId)}`);
        router.push(`/home/podcast/${encodeURIComponent(conId)}/${slugify(conName || "unknown", { lower: true })}`);
    };

    if (loading) {
        return (
            <div className="w-full h-[336px] bg-gray-200 rounded-xl animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-10 w-32 bg-white rounded-md" />
                </div>
            </div>
        );
    }

    return (
        <div>
            <Swiper
                spaceBetween={16}
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                modules={[Autoplay, Pagination]}
                className="rounded-xl"
            >
                {data.contents.map((slide, idx) => (
                    <SwiperSlide key={idx}>
                        <div className="relative h-[336px]">
                            <Image
                                src={slide.imgIrl}
                                alt={slide.conName || "headerimg"}
                                fill
                                className="rounded-xl object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center mt-[55%]">
                                <button
                                    onClick={() => handleDetail(slide.conId, slide.conName)}
                                    className="bg-white text-black font-semibold px-4 py-2 shadow-sm hover:shadow-md rounded-md cursor-pointer"
                                >
                                    Listen Now
                                </button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default HeaderSlider;
