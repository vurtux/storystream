'use client'

import { useEffect, useState } from 'react';
import { BiCategory } from 'react-icons/bi';
import { handleCategory, handleCategoryDetail } from '../../api/category';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { showError } from '../../../utils/toastService';
import slugify from 'slugify';

// Shimmer component
const ShimmerCard = () => (
    <div className="relative w-full aspect-[4/3] animate-pulse bg-gray-200 rounded-2xl" />
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
        const country = localStorage.getItem('country') || "";
        const result = await handleCategoryDetail(conId, lang, country);
        localStorage.setItem('seeAllData', JSON.stringify(result.response.data.contents));
        router.push(`/home/see-all/${slugify(heading || "unknown", { lower: true })}`);
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
                        <ShimmerCard key={index} />
                    ))
                    : topCategoryData?.map((category, index) => (
                        <div
                            onClick={() => handleSeeAll(category?.conName, category?.conId)}
                            className='relative flex cursor-pointer overflow-hidden rounded-2xl aspect-[4/3] w-full shadow-sm hover:shadow-md transition-shadow'
                            key={index}
                        >
                            <span className='absolute top-4 left-4 z-10 text-sm font-semibold text-white drop-shadow-sm whitespace-normal break-words'>
                                {category.conName}
                            </span>
                            <Image 
                                fill 
                                sizes="(max-width: 768px) 50vw, 33vw"
                                src={category?.imgIrl} 
                                alt={category?.conName || "category"} 
                                className="object-cover w-full h-full rounded-2xl"
                            />
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
                        <ShimmerCard key={index} />
                    ))
                    : allCategoryData?.map((category, index) => (
                        <div
                            onClick={() => handleSeeAll(category?.conName, category?.conId)}
                            className='relative flex cursor-pointer overflow-hidden rounded-2xl aspect-[4/3] w-full shadow-sm hover:shadow-md transition-shadow'
                            key={index}
                        >
                            <span className='absolute top-4 left-4 z-10 text-sm font-semibold text-white drop-shadow-sm whitespace-normal break-words'>
                                {category.conName}
                            </span>
                            <Image 
                                fill 
                                sizes="(max-width: 768px) 50vw, 33vw"
                                src={category?.imgIrl} 
                                alt={category?.conName || "category"} 
                                className="object-cover w-full h-full rounded-2xl"
                            />
                        </div>
                    ))
                }
            </div>
        </div>
    );
}
