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

  // Determine number of slides
  const slideCount = data.contents.length;
  const isSingleSlide = slideCount === 1;
  const isTwoSlides = slideCount === 2;

  // Slider settings based on slide count
  const settings = {
    dots: !isSingleSlide, // No dots for single slide
    arrows: false,
    infinite: slideCount >= 3, // Infinite only for 3+ slides
    centerMode: !isSingleSlide, // Center mode for 2+ slides
    centerPadding: isSingleSlide ? '0px' : isTwoSlides ? '5%' : '10%', // Tighter padding for 2 slides
    slidesToShow: isTwoSlides ? 2 : 1, // Show 2 slides for 2 images, 1 otherwise
    slidesToScroll: 1,
    speed: 500,
    autoplay: slideCount >= 3, // Autoplay only for 3+ slides
    autoplaySpeed: slideCount === 2 ? 4000 : 4000, // Slower for 2 slides
    responsive: [
      {
        breakpoint: 768, // Mobile
        settings: {
          slidesToShow: 1, // Always 1 slide on mobile
          centerPadding: isSingleSlide ? '0px' : isTwoSlides ? '10%' : '15%',
        },
      },
    ],
    appendDots: (dots: any) => (
      <div style={{ bottom: '-30px' }}>
        <ul className="!m-0 flex justify-center gap-1">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="custom-dot w-2 h-2 rounded-full bg-purple-500 pt-2" />
    ),
  };

  return (
    <div className="-m-0 pt-3 pb-6 rounded-xl overflow-hidden">
      <Slider {...settings}>
        {data.contents.map((slide, idx) => (
          <div
  key={idx}
  className={`relative overflow-hidden ${isSingleSlide ? 'w-full' : 'w-[336px]'}`}
>
  <Image
    src={slide.imgIrl}
    alt={slide.conName || 'headerimg'}
    height={336}
    width={336}
    className="object-cover px-1 rounded-2xl"
    priority={idx === 0}
  />

  {/* Button container positioned 10% above bottom */}
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