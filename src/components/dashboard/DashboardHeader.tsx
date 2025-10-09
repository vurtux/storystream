'use client';

import Image from 'next/image';
import Slider from 'react-slick';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import slugify from 'slugify';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./HeaderSlider.css"; // custom styles for dots

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

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    centerMode: true,
    centerPadding: "10%",
    slidesToShow: 1,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 2000,
    appendDots: (dots: any) => (
      <div style={{ bottom: "-30px" }}>
        <ul className="!m-0 flex justify-center gap-1">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="custom-dot w-2 h-2 rounded-full bg-purple-500 pt-2" />
    ),
  };

  return (
    <div className="-m-3 pt-3 pb-6 rounded-xl overflow-hidden">
      <Slider {...settings}>
        {data.contents.map((slide, idx) => (
          <div key={idx} className="relative w-[336px] h-[300px]">
            <Image
              src={slide.imgIrl}
              alt={slide.conName || 'headerimg'}
              width={336}
              height={300}
              className="w-[336px] h-[300px] object-cover rounded-xl px-1"
            />
            <div className="absolute inset-0 flex items-center justify-center mt-[80%]">
              <button
                onClick={() => handleDetail(slide.conId, slide.conName)}
                className="bg-white text-black font-semibold px-5 py-2 shadow-sm hover:shadow-md rounded-md cursor-pointer"
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
