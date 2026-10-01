'use client';

import { PhotoData } from '@/content/photos';
import Image from 'next/image';

export default function PhotoPlaceholder({
  photo,
  className = '',
  aspectRatio = '4/3',
}: {
  photo: PhotoData;
  className?: string;
  aspectRatio?: string;
}) {
  if (photo.src) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio }}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkZGQkYyIi8+PC9zdmc+"
        />
      </div>
    );
  }

  // Elegant placeholder
  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden ${className}`}
      style={{
        aspectRatio,
        background: 'linear-gradient(135deg, #FFFBF2 0%, #FFF5E0 40%, #F0F4FF 100%)',
      }}
    >
      {/* Paper texture pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231F2340' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Camera icon */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        className="opacity-20 mb-3"
      >
        <rect x="2" y="6" width="20" height="14" rx="2" stroke="#1F2340" strokeWidth="1.5" />
        <circle cx="12" cy="13" r="4" stroke="#1F2340" strokeWidth="1.5" />
        <path d="M8 6L9 3h6l1 3" stroke="#1F2340" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>

      <span
        className="text-sm font-medium opacity-25 tracking-wide"
        style={{ color: '#1F2340', fontFamily: 'var(--font-manrope)' }}
      >
        {photo.alt}
      </span>
    </div>
  );
}
