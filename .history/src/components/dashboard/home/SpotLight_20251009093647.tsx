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
      {/* Block Title */}
      <div className="flex justify-between items-center my-4">
        <h2 className="text-lg font-semibold">
          {loading ? (
            <div className="w-32 h-5 bg-gray-300 rounded animate-pulse" />
          ) : (
            data.bkName
          )}
        </h2>
        {loading ? (
          <div className="w-16 h-4 bg-gray-300 rounded animate-pulse" />
        ) : (
          <a href="#" className="text-purple-600 text-sm font-medium">
            See All
          </a>
        )}
      </div>

      {/* Card */}
      {loading ? (
        <div className="flex items-center justify-center w-48 h-48 bg-gray-200 rounded-xl animate-pulse" />
      ) : (
        <div className="flex flex-col items-center justify-between w-48 h-48 bg-white rounded-xl shadow p-3">
          {/* Image */}
          <Image
            src={data.contents[0]?.imgIrl || '/images/playListImage.png'}
            alt={data.contents[0]?.conName || 'Spotlight'}
            width={180}
            height={180}
            className="w-40 h-40 rounded-lg object-cover"
          />

          {/* Title */}
          <h3 className="text-sm text-black font-semibold mt-2 text-center">
            {data.contents[0]?.conName}
          </h3>

          {/* Actions */}
          <div className="flex items-center gap-1 mt-2">
            <button
              onClick={handlePlay}
              className="bg-pink-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
            >
              <Play size={12} /> Play
            </button>
            <button>
              <List size={16} className="text-gray-600" />
            </button>
            <button>
              <Download size={16} className="text-gray-600" />
            </button>
            <button>
              <MoreHorizontal size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpotLight;
