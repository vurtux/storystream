'use client';

import Image from 'next/image';
import Slider from 'react-slick';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import slugify from 'slugify';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './HeaderSlider.css'; // your custom dots styles

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

  const settings = {
    dots: slideCount > 1,
    arrows: false,
    infinite: true,
    centerMode: true,
    centerPadding: '10%',
    slidesToShow: 1,
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
