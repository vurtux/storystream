import { Suspense } from "react";
import DetailsClient from "../../../components/dashboard/DetailsClient";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export default async function Page({ params }: Props) {
    const { slug } = await params;

    if (!slug || slug.length === 0) {
        return notFound();
    }

    const conId = slug[0];
    const title = slug[1] ?? null;
    
    return (
        <Suspense fallback={<div><AiOutlineLoading3Quarters /></div>}>
            <DetailsClient conId={conId} title={title} />
        </Suspense>
    );
}