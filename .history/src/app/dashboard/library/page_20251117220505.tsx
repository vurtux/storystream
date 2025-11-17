'use client';

import PodcastLibrary from '../../../components/library/Podcast';
import BookLibrary from '../../../components/library/Book';

const Library = () => {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center mb-4">
        <button className="text-pink-500 text-2xl mr-4">☰</button>
        <h1 className="text-xl font-bold">Library</h1>
      </div>

      {/* Always show downloaded content */}
      <PodcastLibrary />
      <BookLibrary />
    </div>
  );
};

export default Library;
