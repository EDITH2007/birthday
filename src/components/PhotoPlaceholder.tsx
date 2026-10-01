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

  // Lively polaroid placeholder
  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden ${className}`}
      style={{
        aspectRatio,
        background: 'linear-gradient(135deg, #FFFBF2 0%, #FFF5E0 30%, #F0F4FF 60%, #E8FFF4 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradient-shift 8s ease-in-out infinite',
      }}
    >
      {/* Paper texture pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231F2340' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Shimmer sweep */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer-sweep 4s ease-in-out infinite',
        }}
      />

      {/* Taped corner (top-right) */}
      <div
        className="absolute top-2 right-2 z-10"
        style={{
          width: 40,
          height: 16,
          background: 'rgba(255, 211, 90, 0.45)',
          transform: 'rotate(30deg)',
          borderRadius: 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      />
      {/* Taped corner (bottom-left) */}
      <div
        className="absolute bottom-3 left-2 z-10"
        style={{
          width: 36,
          height: 14,
          background: 'rgba(124, 198, 254, 0.35)',
          transform: 'rotate(-15deg)',
          borderRadius: 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      />

      {/* Camera icon */}
      <svg
        width="44"
        height="44"
        viewBox="0 0 24 24"
        fill="none"
        className="opacity-25 mb-3 relative z-10"
      >
        <rect x="2" y="6" width="20" height="14" rx="2" stroke="#1F2340" strokeWidth="1.5" />
        <circle cx="12" cy="13" r="4" stroke="#1F2340" strokeWidth="1.5" />
        <path d="M8 6L9 3h6l1 3" stroke="#1F2340" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="12" cy="13" r="2" fill="#1F2340" opacity="0.15" />
      </svg>

      <span
        className="text-sm font-medium tracking-wide relative z-10"
        style={{
          color: '#1F2340',
          fontFamily: 'var(--font-manrope)',
          opacity: 0.3,
        }}
      >
        Photo goes here
      </span>
      <span
        className="text-[10px] mt-1 tracking-widest uppercase relative z-10"
        style={{
          color: '#1F2340',
          fontFamily: 'var(--font-manrope)',
          opacity: 0.2,
        }}
      >
        {photo.alt}
      </span>
    </div>
  );
}
