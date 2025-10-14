'use client';

import Image from 'next/image';
import Slider from 'react-slick';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import slugify from 'slugify';
import './HeaderSlider.css'; // Custom styles for dots

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
    if (data?.contents?.length > 0) setLoading(false);
  }, [data]);

  const handleDetail = (conId: number, conName: string) => {
    router.push(
      `/home/podcast/${encodeURIComponent(conId)}/${slugify(conName || 'unknown', { lower: true })}`
    );
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

  const slideCount = data.contents.length;

  // ✅ Corrected slider settings (always horizontal)
  const settings = {
    dots: slideCount > 1,
    arrows: false,
    infinite: true,
    centerMode: true,
    centerPadding: slideCount === 1 ? '0px' : '8%',
    slidesToShow: 1, // Always show 1 at a time (prevents vertical stacking)
    slidesToScroll: 1,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: '10%',
        },
      },
    ],
    appendDots: (dots: any) => (
      <div style={{ bottom: '-25px' }}>
        <ul className="!m-0 flex justify-center gap-1">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="custom-dot w-2 h-2 rounded-full bg-purple-500 pt-2" />
    ),
  };

  return (
    <div className="pt-1 pb-4 rounded-xl overflow-hidden">
      <Slider {...settings}>
        {data.contents.map((slide, idx) => (
          <div key={idx} className="relative flex justify-center items-center px-2">
            <Image
              src={slide.imgIrl}
              alt={slide.conName || 'headerimg'}
              height={336}
              width={336}
              className="object-cover rounded-2xl"
              priority={idx === 0}
            />

            {/* Button container */}
            <div className="absolute bottom-[10%] inset-x-0 flex justify-center z-10">
              <button
                onClick={() => handleDetail(slide.conId, slide.conName)}
                className="bg-white/90 text-black font-semibold px-5 py-2 rounded-md shadow-md hover:bg-white hover:shadow-lg transition-all cursor-pointer"
              >
                Listen Now
              </button>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeaderSlider;
