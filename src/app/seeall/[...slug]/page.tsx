import { Suspense } from 'react';
import SeeAllClient from '../../../components/dashboard/SeeAllClient';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ slug: string[] }>;
};

export default async function SeeAllPage({ params }: Props) {
    const { slug } = await params;
        
    if (!slug || slug.length === 0) return notFound();
    
    const heading = slug.join(' ').replace(/-/g, ' ');
    
    return (
        <Suspense fallback={<div><AiOutlineLoading3Quarters /></div>}>
            <SeeAllClient heading={heading} />
        </Suspense>
    );
}