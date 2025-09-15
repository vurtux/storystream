'use client'

import { useEffect, useState } from 'react';
import { BiCategory } from 'react-icons/bi';
import { handleCategory, handleCategoryDetail } from '../../api/category';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { showError } from '../../../utils/toastService';
import slugify from 'slugify';

// Shimmer component
const ShimmerCard = ({ width = 200, height = 50 }) => (
    <div className="relative flex animate-pulse">
        <div
            className="bg-gray-300 rounded-md"
            style={{ width: `${width}px`, height: `${height}px` }}
        />
    </div>
);

export default function CategoryGrid() {
    const router = useRouter();
    const [topCategoryData, setTopCategoryData] = useState([]);
    const [allCategoryData, setAllCategoryData] = useState([]);
    const [loading, setLoading] = useState(true); // 🟡 Loading state

    const getCategoryData = async () => {
        try {
            const res = await handleCategory();
            setTopCategoryData(res.response.data.featured_contents);
            setAllCategoryData(res.response.data.contents);
        } catch (error) {
            console.log("Error in login api", error);
            showError("Category data fetch failed");
        } finally {
            setLoading(false);
        }
    };

    const handleSeeAll = async (heading, conId) => {
        const lang = localStorage.getItem('language');
        const result = await handleCategoryDetail(conId, lang);
        localStorage.setItem('seeAllData', JSON.stringify(result.response.data.contents));
        router.push(`/home/seeall/${slugify(heading || "unknown", { lower: true })}`);
    };

    useEffect(() => {
        getCategoryData();
    }, []);

    return (
        <div>
            {/* Top Category Heading */}
            <div className="flex items-center mb-6">
                <Image className='mr-2' height={24} width={24} alt='category' src="/images/Category.png" />
                <div className="text-2xl text-gray-900 font-bold">
                    Top Category
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {loading
                    ? Array(2).fill(null).map((_, index) => (
                        <ShimmerCard key={index} width={200} height={100} />
                    ))
                    : topCategoryData?.map((category, index) => (
                        <div
                            onClick={() => handleSeeAll(category?.conName, category?.conId)}
                            className='relative flex cursor-pointer'
                            key={index}
                        >
                            <span className='absolute top-10 left-2 text-sm text-white whitespace-normal break-words'>{category.conName}</span>
                            <Image width={200} height={200} src={category?.imgIrl} alt="category" />
                        </div>
                    ))
                }
            </div>

            {/* All Category Heading */}
            <div className="flex items-center my-6">
                <Image className='mr-2' height={24} width={24} alt='category' src="/images/Category.png" />
                <div className="text-2xl text-gray-900 font-bold">All Category</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {loading
                    ? Array(10).fill(null).map((_, index) => (
                        <ShimmerCard key={index} width={200} height={100} />
                    ))
                    : allCategoryData?.map((category, index) => (
                        <div
                            onClick={() => handleSeeAll(category?.conName, category?.conId)}
                            className='relative flex cursor-pointer'
                            key={index}
                        >
                            <span className='absolute top-10 left-2 text-sm text-white'>{category.conName}</span>
                            <Image src={category?.imgIrl} alt="category" width={200} height={100} />
                        </div>
                    ))
                }
            </div>
        </div>
    );
}
