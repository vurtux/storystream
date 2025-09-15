'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useDashboard from '../../../hooks/useDashboard';
import { MdHome, MdLibraryBooks } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import NowPlaying from '../../../components/audio/PlayIcon';
import { GoHomeFill } from "react-icons/go";

const Menubar = () => {
    const router = useRouter();
    const [activeMenu, setActiveMenu] = useState('');
    const { openPlayButton } = useDashboard();

    const handleMenuBar = (des: string) => {
        setActiveMenu(des);
        localStorage.setItem('menu', des);
        router.push(`/${des}`);
    };

    useEffect(() => {
        const currentDes: any = localStorage.getItem('menu');
        setActiveMenu(currentDes);
    }, []);

    return (
        <div className='mt-12'>
            {/* Floating Play Button */}
            {openPlayButton && <NowPlaying />}

            {/* Bottom Navigation */}
            <nav style={{ backgroundColor: "#FFFFFF" , borderTopLeftRadius: "24px", borderTopRightRadius: "24px"}} className="fixed bottom-0 inset-x-0 m-auto mt-4 max-w-md w-full m-auto shadow-md px-6 py-2 z-50">
                <div className="flex justify-between items-center">

                    {/* Home */}
                    <div
                        onClick={() => handleMenuBar('home')}
                        className="flex flex-col items-center cursor-pointer"
                    >
                        <GoHomeFill
                            className={`h-5 w-5 ${activeMenu === 'home'
                                ? 'text-purple-700'
                                : 'text-gray-500'
                                }`}
                        />
                        <span className={`text-[13px] ${activeMenu === 'home' ? 'font-semibold text-black' : 'text-gray-500'}`}>
                            Home
                        </span>
                    </div>

                    {/* Search */}
                    <div
                        onClick={() => handleMenuBar('search')}
                        className="flex flex-col items-center cursor-pointer"
                    >
                        <FaSearch
                            className={`h-5 w-5 ${activeMenu === 'search'
                                ? 'text-purple-700'
                                : 'text-gray-500'
                                }`}
                        />
                        <span className={`text-[13px] ${activeMenu === 'search' ? 'font-semibold text-black' : 'text-gray-500'}`}>
                            Search
                        </span>
                    </div>

                    {/* Category */}
                    <div
                        onClick={() => handleMenuBar('category')}
                        className="flex flex-col items-center cursor-pointer"
                    >
                        <BiSolidCategory
                            className={`h-5 w-5 ${activeMenu === 'category'
                                ? 'text-purple-700'
                                : 'text-gray-500'
                                }`}
                        />
                        <span className={`text-[13px] ${activeMenu === 'category' ? 'font-semibold text-black' : 'text-gray-500'}`}>
                            Category
                        </span>
                    </div>

                    {/* Library (no route in your code, so left inactive) */}
                    <div
                        onClick={() => handleMenuBar('library')}
                        className="flex flex-col items-center cursor-pointer"
                    >
                        <MdLibraryBooks
                            className={`h-5 w-5 ${activeMenu === 'library'
                                ? 'text-purple-700'
                                : 'text-gray-500'
                                }`}
                        />
                        <span className={`text-[13px]  ${activeMenu === 'library' ? 'font-semibold text-black' : 'text-gray-500'}`}>
                            Library
                        </span>
                    </div>

                    {/* Profile */}
                    <div
                        onClick={() => handleMenuBar('profile')}
                        className="flex flex-col items-center cursor-pointer"
                    >
                        <CgProfile
                            className={`h-5 w-5 ${activeMenu === 'profile'
                                ? 'text-purple-700'
                                : 'text-gray-500'
                                }`}
                        />
                        <span className={`text-[13px] ${activeMenu === 'profile' ? 'font-semibold text-black' : 'text-gray-500'}`}>
                            Profile
                        </span>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Menubar;
