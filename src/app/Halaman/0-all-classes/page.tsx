"use client";

import Image from 'next/image';
import { useState } from 'react';
import { tradingData } from '../1-trading/data';
import { ebookData } from '../8-e-book/data';
import { margincallData } from '../5-margincall/data';
import { sekolahData } from '../6-sekolah/data';
import { soonData } from '../7-soon/data';
import { thenoiseData } from '../9-thenoise/data';

export default function AllClassesPage() {
  const [imgError, setImgError] = useState<{[key: string]: boolean}>({});

  function handleImageError(title: string): void {
    setImgError((prev) => ({ ...prev, [title]: true }));
  }

  const allData = [
    ...tradingData,
    ...ebookData,
    ...margincallData,
    ...sekolahData,
    ...soonData,
    ...thenoiseData
  ];
  
  return (
    <div>
      <h1 className="text-sm md:text-2xl font-bold text-white mb-2 md:mb-6">All Classes</h1>
      <div className="flex overflow-x-auto gap-2 md:gap-6 pb-2 md:pb-4 scrollbar-hide">
        {allData.map((item, index) => (
          <a
            key={index}
            href={item.link}
            rel="noopener noreferrer"
            className="flex-none w-28 md:w-56 bg-gray-800 rounded-md md:rounded-lg overflow-hidden hover:scale-105 transition-transform"
          >
            <div className="relative w-full h-16 md:h-32">
              {imgError[item.title] ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-700">
                  <span className="text-[8px] md:text-base text-gray-400">{item.title}</span>
                </div>
              ) : (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  onError={() => handleImageError(item.title)}
                />
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
