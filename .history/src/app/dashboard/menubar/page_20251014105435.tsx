'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useDashboard from '../../../hooks/useDashboard';
import { FaSearch } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import NowPlaying from '../../../components/audio/PlayIcon';
import { GoHomeFill } from "react-icons/go";

const Menubar = () => {
    const router = useRouter();
    const [activeMenu, setActiveMenu] = useState('home');
    const { openPlayButton } = useDashboard();

    const handleMenuBar = (des: string) => {
        setActiveMenu(des);
        localStorage.setItem('menu', des);
        router.push(`/${des}`);
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const currentDes = localStorage.getItem('menu');
            if (currentDes) setActiveMenu(currentDes);
        }
    }, []);

    return (
        <>
            {/* Floating Play Button */}
            {openPlayButton && <NowPlaying />}

            {/* Bottom Navigation */}
            <nav
                style={{ backgroundColor: "#FFFFFF", borderTopLeftRadius: "24px", borderTopRightRadius: "24px" }}
                className="fixed bottom-0 inset-x-0 max-w-md w-full mx-auto shadow-md px-6 py-2 z-50"
            >
                <div className="flex justify-between items-center">
                    {/* Home */}
                    <MenuItem
                        icon={<GoHomeFill className="h-5 w-5" />}
                        label="Home"
                        active={activeMenu === 'home'}
                        onClick={() => handleMenuBar('home')}
                    />

                    {/* Search */}
                    <MenuItem
                        icon={<FaSearch className="h-5 w-5" />}
                        label="Search"
                        active={activeMenu === 'search'}
                        onClick={() => handleMenuBar('search')}
                    />

                    {/* Category */}
                    <MenuItem
                        icon={<BiSolidCategory className="h-5 w-5" />}
                        label="Category"
                        active={activeMenu === 'category'}
                        onClick={() => handleMenuBar('category')}
                    />

                    {/* Profile */}
                    <MenuItem
                        icon={<CgProfile className="h-5 w-5" />}
                        label="Profile"
                        active={activeMenu === 'profile'}
                        onClick={() => handleMenuBar('profile')}
                    />
                </div>
            </nav>
        </>
    );
};

interface MenuItemProps {
    icon: JSX.Element;
    label: string;
    active: boolean;
    onClick: () => void;
}

const MenuItem = ({ icon, label, active, onClick }: MenuItemProps) => {
    return (
        <div onClick={onClick} className="flex flex-col items-center cursor-pointer">
            {React.cloneElement(icon, { className: `${active ? 'text-purple-700' : 'text-gray-500'} h-5 w-5` })}
            <span className={`text-[13px] ${active ? 'font-semibold text-black' : 'text-gray-500'}`}>{label}</span>
        </div>
    );
};

export default Menubar;
