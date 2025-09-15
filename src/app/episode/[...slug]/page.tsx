import { Suspense } from 'react';
import PodcastClient from '../../../components/dashboard/PodcastClient';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export default async function Podcast({ params }: Props) {
    const { slug } = await params;
    
        if (!slug || slug.length === 0) {
            return notFound();
        }
    
        const episode_id = slug[0];
        const title = slug[1] ?? null;
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PodcastClient episode_id={episode_id} title={title} />
        </Suspense>
    );
}
