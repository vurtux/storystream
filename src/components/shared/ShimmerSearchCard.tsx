'use client';

import React from 'react';

const ShimmerSearchCard = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="p-2 border rounded-lg bg-white shadow-sm"
        >
          {/* Image placeholder */}
          <div className="w-full h-40 bg-gray-200 rounded-lg mb-2" />

          {/* Text placeholders */}
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
};

export default ShimmerSearchCard;
