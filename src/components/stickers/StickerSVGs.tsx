'use client';

import React from 'react';

/** All sticker IDs */
export type StickerId =
  | 'cake'
  | 'party-popper'
  | 'balloons'
  | 'gift-box'
  | 'cupcake'
  | 'disco-ball'
  | 'sparkle-cluster'
  | 'crown'
  | 'confetti-cannon'
  | 'party-hat'
  | 'vinyl-record'
  | 'instant-camera'
  | 'film-strip'
  | 'ticket-stub'
  | 'level-up-badge'
  | 'certified-legend'
  | 'make-a-wish'
  | 'bunting';

interface StickerSVGProps {
  size?: number;
  className?: string;
}

const BORDER_STYLE = {
  stroke: '#FFFFFF',
  strokeWidth: 3,
  strokeLinejoin: 'round' as const,
};

/** Cake with candle */
export function CakeSticker({ size = 64, className }: StickerSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      {/* Cake body */}
      <rect x="12" y="32" width="40" height="20" rx="6" fill="#FFD35A" {...BORDER_STYLE} />
      {/* Frosting top */}
      <rect x="10" y="28" width="44" height="10" rx="5" fill="#FF9F43" {...BORDER_STYLE} />
      {/* Drip frosting */}
      <path d="M16 37Q19 44 22 37Q25 44 28 37Q31 44 34 37Q37 44 40 37Q43 44 46 37" stroke="#FFFBF2" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Candle */}
      <rect x="29" y="14" width="6" height="16" rx="2" fill="#8E9BFF" {...BORDER_STYLE} />
      {/* Flame */}
      <ellipse cx="32" cy="11" rx="4" ry="6" fill="#FFD35A" {...BORDER_STYLE} />
      <ellipse cx="32" cy="10" rx="2.5" ry="4" fill="#FF9F43" />
      <ellipse cx="32" cy="9" rx="1.2" ry="2.5" fill="#FFFBF2" />
      {/* Dots */}
      <circle cx="20" cy="42" r="2" fill="#7EE0B5" />
      <circle cx="32" cy="45" r="1.8" fill="#7CC6FE" />
      <circle cx="44" cy="40" r="2" fill="#8E9BFF" />
    </svg>
  );
}

/** Party popper */
export function PartyPopperSticker({ size = 64, className }: StickerSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      {/* Cone */}
      <path d="M20 52L32 16L44 52Z" fill="#FFD35A" {...BORDER_STYLE} />
      <path d="M24 44L32 22L40 44Z" fill="#FF9F43" opacity="0.5" />
      {/* Confetti bits */}
      <rect x="36" y="12" width="6" height="4" rx="1" fill="#7CC6FE" transform="rotate(25 39 14)" {...BORDER_STYLE} />
      <circle cx="46" cy="18" r="3" fill="#7EE0B5" {...BORDER_STYLE} />
      <rect x="14" y="14" width="5" height="5" rx="1" fill="#8E9BFF" transform="rotate(-15 16.5 16.5)" {...BORDER_STYLE} />
      <circle cx="50" cy="28" r="2.5" fill="#FFD35A" {...BORDER_STYLE} />
      <rect x="10" y="24" width="4" height="6" rx="1" fill="#FF9F43" transform="rotate(10 12 27)" {...BORDER_STYLE} />
      {/* Star */}
      <polygon points="28,8 30,12 34,13 31,16 32,20 28,18 24,20 25,16 22,13 26,12" fill="#FFD35A" {...BORDER_STYLE} />
    </svg>
  );
}

/** Balloons bunch */
export function BalloonsSticker({ size = 64, className }: StickerSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      {/* Strings */}
      <path d="M24 38C26 44 30 50 32 56" stroke="#1F2340" strokeWidth="1.5" opacity="0.3" fill="none" />
      <path d="M32 30C33 40 32 48 32 56" stroke="#1F2340" strokeWidth="1.5" opacity="0.3" fill="none" />
      <path d="M40 36C38 42 34 50 32 56" stroke="#1F2340" strokeWidth="1.5" opacity="0.3" fill="none" />
      {/* Balloon 1 - sky */}
      <ellipse cx="24" cy="24" rx="11" ry="14" fill="#7CC6FE" {...BORDER_STYLE} />
      <ellipse cx="21" cy="20" rx="3" ry="4" fill="#FFFBF2" opacity="0.4" />
      <polygon points="24,38 21,40 27,40" fill="#7CC6FE" {...BORDER_STYLE} />
      {/* Balloon 2 - butter */}
      <ellipse cx="32" cy="18" rx="10" ry="13" fill="#FFD35A" {...BORDER_STYLE} />
      <ellipse cx="29" cy="14" rx="3" ry="4" fill="#FFFBF2" opacity="0.4" />
      <polygon points="32,31 29,33 35,33" fill="#FFD35A" {...BORDER_STYLE} />
      {/* Balloon 3 - mint */}
      <ellipse cx="40" cy="22" rx="10" ry="13" fill="#7EE0B5" {...BORDER_STYLE} />
      <ellipse cx="37" cy="18" rx="3" ry="4" fill="#FFFBF2" opacity="0.4" />
      <polygon points="40,35 37,37 43,37" fill="#7EE0B5" {...BORDER_STYLE} />
    </svg>
  );
}

/** Gift box with ribbon */
export function GiftBoxSticker({ size = 64, className }: StickerSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      {/* Box body */}
      <rect x="14" y="28" width="36" height="26" rx="4" fill="#7CC6FE" {...BORDER_STYLE} />
      {/* Box lid */}
      <rect x="12" y="22" width="40" height="10" rx="4" fill="#8E9BFF" {...BORDER_STYLE} />
      {/* Vertical ribbon */}
      <rect x="29" y="22" width="6" height="32" fill="#FFD35A" {...BORDER_STYLE} />
      {/* Horizontal ribbon */}
      <rect x="14" y="34" width="36" height="5" fill="#FFD35A" {...BORDER_STYLE} />
      {/* Bow */}
      <ellipse cx="27" cy="20" rx="7" ry="5" fill="#FFD35A" {...BORDER_STYLE} />
      <ellipse cx="37" cy="20" rx="7" ry="5" fill="#FFD35A" {...BORDER_STYLE} />
      <circle cx="32" cy="20" r="3" fill="#FF9F43" {...BORDER_STYLE} />
    </svg>
  );
}

/** Cupcake */
export function CupcakeSticker({ size = 64, className }: StickerSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      {/* Wrapper */}
      <path d="M18 36L22 56H42L46 36Z" fill="#FF9F43" {...BORDER_STYLE} />
      <path d="M22 40L24 52H40L42 40Z" fill="#FFD35A" opacity="0.3" />
      {/* Frosting */}
      <path d="M16 36Q22 22 32 28Q42 22 48 36Z" fill="#7EE0B5" {...BORDER_STYLE} />
      <path d="M20 34Q26 26 32 30Q38 26 44 34Z" fill="#FFFBF2" opacity="0.3" />
      {/* Cherry */}
      <circle cx="32" cy="22" r="5" fill="#FF9F43" {...BORDER_STYLE} />
      <circle cx="30" cy="20" r="1.5" fill="#FFFBF2" opacity="0.5" />
      {/* Stem */}
      <path d="M32 17C34 14 36 12 38 10" stroke="#7EE0B5" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Wrapper lines */}
      <line x1="24" y1="38" x2="26" y2="54" stroke="#FFFBF2" strokeWidth="1" opacity="0.3" />
      <line x1="32" y1="36" x2="32" y2="56" stroke="#FFFBF2" strokeWidth="1" opacity="0.3" />
      <line x1="40" y1="38" x2="38" y2="54" stroke="#FFFBF2" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

/** Disco ball */
export function DiscoBallSticker({ size = 64, className }: StickerSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      {/* String */}
      <line x1="32" y1="4" x2="32" y2="16" stroke="#1F2340" strokeWidth="2" opacity="0.3" />
      {/* Ball */}
      <circle cx="32" cy="32" r="16" fill="#8E9BFF" {...BORDER_STYLE} />
      {/* Grid lines */}
      <ellipse cx="32" cy="32" rx="16" ry="6" stroke="#FFFBF2" strokeWidth="1" opacity="0.4" fill="none" />
      <ellipse cx="32" cy="32" rx="6" ry="16" stroke="#FFFBF2" strokeWidth="1" opacity="0.4" fill="none" />
      <line x1="16" y1="32" x2="48" y2="32" stroke="#FFFBF2" strokeWidth="1" opacity="0.4" />
      <line x1="32" y1="16" x2="32" y2="48" stroke="#FFFBF2" strokeWidth="1" opacity="0.4" />
      {/* Sparkle reflections */}
      <rect x="26" y="24" width="4" height="4" rx="0.5" fill="#FFFBF2" opacity="0.6" />
      <rect x="34" y="28" width="3" height="3" rx="0.5" fill="#FFD35A" opacity="0.5" />
      <rect x="28" y="34" width="3" height="3" rx="0.5" fill="#7CC6FE" opacity="0.5" />
      <rect x="36" y="36" width="4" height="4" rx="0.5" fill="#FFFBF2" opacity="0.4" />
      {/* Light rays */}
      <line x1="14" y1="18" x2="8" y2="12" stroke="#FFD35A" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <line x1="50" y1="20" x2="56" y2="14" stroke="#7CC6FE" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <line x1="50" y1="44" x2="56" y2="50" stroke="#7EE0B5" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

/** Sparkle cluster */
export function SparkleClusterSticker({ size = 64, className }: StickerSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      {/* Big sparkle */}
      <path d="M32 8L35 24L48 32L35 40L32 56L29 40L16 32L29 24Z" fill="#FFD35A" {...BORDER_STYLE} />
      <path d="M32 16L34 26L42 32L34 38L32 48L30 38L22 32L30 26Z" fill="#FFFBF2" opacity="0.4" />
      {/* Small sparkle 1 */}
      <path d="M48 12L49.5 16L53 18L49.5 20L48 24L46.5 20L43 18L46.5 16Z" fill="#7CC6FE" {...BORDER_STYLE} />
      {/* Small sparkle 2 */}
      <path d="M14 42L15.5 46L19 48L15.5 50L14 54L12.5 50L9 48L12.5 46Z" fill="#7EE0B5" {...BORDER_STYLE} />
      {/* Tiny dots */}
      <circle cx="52" cy="38" r="2" fill="#8E9BFF" {...BORDER_STYLE} />
      <circle cx="10" cy="20" r="2" fill="#FF9F43" {...BORDER_STYLE} />
    </svg>
  );
}

/** Paper crown */
export function CrownSticker({ size = 64, className }: StickerSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M10 44L14 20L24 32L32 14L40 32L50 20L54 44Z" fill="#FFD35A" {...BORDER_STYLE} />
      <rect x="10" y="42" width="44" height="8" rx="2" fill="#FF9F43" {...BORDER_STYLE} />
      {/* Jewels */}
      <circle cx="22" cy="46" r="2.5" fill="#7CC6FE" {...BORDER_STYLE} />
      <circle cx="32" cy="46" r="2.5" fill="#7EE0B5" {...BORDER_STYLE} />
      <circle cx="42" cy="46" r="2.5" fill="#8E9BFF" {...BORDER_STYLE} />
      {/* Crown points highlight */}
      <circle cx="32" cy="18" r="2" fill="#FFFBF2" opacity="0.6" />
    </svg>
  );
}

/** Confetti cannon */
export function ConfettiCannonSticker({ size = 64, className }: StickerSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      {/* Cannon tube */}
      <rect x="22" y="30" width="24" height="14" rx="4" fill="#1F2340" {...BORDER_STYLE} transform="rotate(-30 34 37)" />
      <rect x="24" y="32" width="8" height="10" rx="3" fill="#8E9BFF" {...BORDER_STYLE} transform="rotate(-30 28 37)" />
      {/* Confetti pieces */}
      <circle cx="42" cy="14" r="3" fill="#FFD35A" {...BORDER_STYLE} />
      <rect x="48" y="8" width="5" height="4" rx="1" fill="#7CC6FE" transform="rotate(20 50.5 10)" {...BORDER_STYLE} />
      <circle cx="52" cy="20" r="2.5" fill="#7EE0B5" {...BORDER_STYLE} />
      <rect x="36" y="6" width="4" height="5" rx="1" fill="#FF9F43" transform="rotate(-10 38 8.5)" {...BORDER_STYLE} />
      <polygon points="56,14 58,18 54,18" fill="#8E9BFF" {...BORDER_STYLE} />
      <rect x="44" y="22" width="3" height="4" rx="1" fill="#FFD35A" transform="rotate(30 45.5 24)" {...BORDER_STYLE} />
    </svg>
  );
}

/** Party hat (geometric, modern) */
export function PartyHatSticker({ size = 64, className }: StickerSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      {/* Hat cone */}
      <path d="M16 52L32 8L48 52Z" fill="#7CC6FE" {...BORDER_STYLE} />
      {/* Stripes */}
      <path d="M22 40L32 16L42 40Z" fill="#FFD35A" opacity="0.5" />
      <path d="M26 32L32 20L38 32Z" fill="#8E9BFF" opacity="0.4" />
      {/* Band */}
      <path d="M14 50Q20 44 32 48Q44 44 50 50" stroke="#FF9F43" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Pom pom */}
      <circle cx="32" cy="8" r="5" fill="#FFD35A" {...BORDER_STYLE} />
      <circle cx="30" cy="6" r="1.5" fill="#FFFBF2" opacity="0.5" />
      {/* Dots */}
      <circle cx="28" cy="38" r="2" fill="#FFFBF2" opacity="0.6" />
      <circle cx="36" cy="44" r="1.5" fill="#FFFBF2" opacity="0.6" />
    </svg>
  );
}

/** Vinyl record */
export function VinylRecordSticker({ size = 64, className }: StickerSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <circle cx="32" cy="32" r="26" fill="#1F2340" {...BORDER_STYLE} />
      {/* Grooves */}
      <circle cx="32" cy="32" r="22" stroke="#FFFBF2" strokeWidth="0.5" opacity="0.15" fill="none" />
      <circle cx="32" cy="32" r="18" stroke="#FFFBF2" strokeWidth="0.5" opacity="0.15" fill="none" />
      <circle cx="32" cy="32" r="14" stroke="#FFFBF2" strokeWidth="0.5" opacity="0.15" fill="none" />
      {/* Label */}
      <circle cx="32" cy="32" r="10" fill="#FFD35A" {...BORDER_STYLE} />
      <circle cx="32" cy="32" r="3" fill="#1F2340" {...BORDER_STYLE} />
      {/* Label text area */}
      <text x="32" y="30" textAnchor="middle" fill="#1F2340" fontSize="5" fontWeight="bold" fontFamily="sans-serif">PLAY</text>
      <text x="32" y="36" textAnchor="middle" fill="#1F2340" fontSize="3.5" fontFamily="sans-serif">ME</text>
      {/* Highlight */}
      <path d="M18 18Q24 12 32 10" stroke="#FFFBF2" strokeWidth="1.5" opacity="0.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Instant camera */
export function InstantCameraSticker({ size = 64, className }: StickerSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      {/* Body */}
      <rect x="10" y="14" width="44" height="36" rx="6" fill="#FFFBF2" {...BORDER_STYLE} />
      {/* Top section */}
      <rect x="10" y="14" width="44" height="12" rx="6" fill="#7CC6FE" {...BORDER_STYLE} />
      {/* Lens */}
      <circle cx="32" cy="34" r="10" fill="#1F2340" {...BORDER_STYLE} />
      <circle cx="32" cy="34" r="7" fill="#8E9BFF" {...BORDER_STYLE} />
      <circle cx="32" cy="34" r="4" fill="#1F2340" />
      <circle cx="30" cy="32" r="1.5" fill="#FFFBF2" opacity="0.6" />
      {/* Flash */}
      <rect x="38" y="17" width="8" height="6" rx="2" fill="#FFD35A" {...BORDER_STYLE} />
      {/* Viewfinder */}
      <rect x="16" y="18" width="6" height="4" rx="1" fill="#1F2340" opacity="0.3" />
      {/* Photo slot */}
      <rect x="20" y="48" width="24" height="4" rx="1" fill="#1F2340" opacity="0.1" />
    </svg>
  );
}

/** Film strip */
export function FilmStripSticker({ size = 64, className }: StickerSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      {/* Strip */}
      <rect x="12" y="8" width="40" height="48" rx="2" fill="#1F2340" {...BORDER_STYLE} />
      {/* Sprocket holes */}
      {[14, 22, 30, 38, 46].map((y) => (
        <React.Fragment key={y}>
          <rect x="14" y={y} width="4" height="3" rx="1" fill="#FFFBF2" />
          <rect x="46" y={y} width="4" height="3" rx="1" fill="#FFFBF2" />
        </React.Fragment>
      ))}
      {/* Frames */}
      <rect x="20" y="12" width="24" height="14" rx="1" fill="#FFD35A" opacity="0.8" />
      <rect x="20" y="30" width="24" height="14" rx="1" fill="#7CC6FE" opacity="0.8" />
      <rect x="20" y="48" width="24" height="6" rx="1" fill="#7EE0B5" opacity="0.8" />
    </svg>
  );
}

/** Ticket stub - ADMIT ONE */
export function TicketStubSticker({ size = 64, className }: StickerSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 48" fill="none" className={className}>
      {/* Ticket body */}
      <path d="M4 4H58C58 4 58 12 54 16C58 20 58 28 58 28H4C4 28 4 20 8 16C4 12 4 4 4 4Z" fill="#FFD35A" {...BORDER_STYLE} />
      <path d="M58 4H76V28H58C58 28 58 20 62 16C58 12 58 4 58 4Z" fill="#FF9F43" {...BORDER_STYLE} />
      {/* Dashed tear line */}
      <line x1="58" y1="4" x2="58" y2="28" stroke="#1F2340" strokeWidth="1" strokeDasharray="2 2" opacity="0.3" />
      {/* Text */}
      <text x="30" y="13" textAnchor="middle" fill="#1F2340" fontSize="5" fontWeight="bold" fontFamily="sans-serif" letterSpacing="1">ADMIT ONE</text>
      <text x="30" y="22" textAnchor="middle" fill="#1F2340" fontSize="4" fontFamily="sans-serif">BIRTHDAY PARTY</text>
      {/* Star */}
      <polygon points="67,16 69,12 71,16 67,18 71,18" fill="#FFD35A" />
    </svg>
  );
}

/** Level up badge */
export function LevelUpBadgeSticker({ size = 64, className }: StickerSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      {/* Badge circle */}
      <circle cx="32" cy="32" r="24" fill="#7EE0B5" {...BORDER_STYLE} />
      <circle cx="32" cy="32" r="20" fill="none" stroke="#FFFBF2" strokeWidth="2" strokeDasharray="4 3" opacity="0.5" />
      {/* Text */}
      <text x="32" y="28" textAnchor="middle" fill="#1F2340" fontSize="7" fontWeight="bold" fontFamily="sans-serif">LEVEL</text>
      <text x="32" y="38" textAnchor="middle" fill="#1F2340" fontSize="8" fontWeight="900" fontFamily="sans-serif">UP</text>
      {/* Arrow */}
      <path d="M32 44L28 48L32 42L36 48Z" fill="#FFD35A" {...BORDER_STYLE} />
      {/* Sparkles */}
      <circle cx="12" cy="12" r="2" fill="#FFD35A" {...BORDER_STYLE} />
      <circle cx="52" cy="14" r="1.5" fill="#8E9BFF" {...BORDER_STYLE} />
    </svg>
  );
}

/** Certified legend stamp */
export function CertifiedLegendSticker({ size = 64, className }: StickerSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      {/* Stamp border */}
      <circle cx="32" cy="32" r="26" fill="#8E9BFF" {...BORDER_STYLE} />
      <circle cx="32" cy="32" r="22" fill="none" stroke="#FFFBF2" strokeWidth="2" opacity="0.5" />
      <circle cx="32" cy="32" r="20" fill="none" stroke="#FFFBF2" strokeWidth="1" opacity="0.3" />
      {/* Text */}
      <text x="32" y="26" textAnchor="middle" fill="#FFFBF2" fontSize="5" fontWeight="bold" fontFamily="sans-serif" letterSpacing="1">CERTIFIED</text>
      <text x="32" y="38" textAnchor="middle" fill="#FFD35A" fontSize="8" fontWeight="900" fontFamily="sans-serif">LEGEND</text>
      {/* Stars */}
      <polygon points="16,32 18,30 20,32 18,34" fill="#FFD35A" />
      <polygon points="44,32 46,30 48,32 46,34" fill="#FFD35A" />
    </svg>
  );
}

/** Make a wish speech bubble */
export function MakeAWishSticker({ size = 64, className }: StickerSVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 56" fill="none" className={className}>
      {/* Bubble */}
      <path d="M8 4H72C74.2 4 76 5.8 76 8V36C76 38.2 74.2 40 72 40H28L18 50L20 40H8C5.8 40 4 38.2 4 36V8C4 5.8 5.8 4 8 4Z" fill="#FFFBF2" {...BORDER_STYLE} />
      {/* Text */}
      <text x="40" y="18" textAnchor="middle" fill="#1F2340" fontSize="6" fontFamily="sans-serif" fontStyle="italic">Make a</text>
      <text x="40" y="32" textAnchor="middle" fill="#FFD35A" fontSize="10" fontWeight="bold" fontFamily="sans-serif">wish ✦</text>
    </svg>
  );
}

/** Bunting / garland */
export function BuntingSticker({ size = 64, className }: StickerSVGProps) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 120 32" fill="none" className={className}>
      {/* String */}
      <path d="M0 4Q15 8 30 4Q45 0 60 4Q75 8 90 4Q105 0 120 4" stroke="#1F2340" strokeWidth="1.5" fill="none" opacity="0.3" />
      {/* Flags */}
      <polygon points="15,6 22,6 18.5,20" fill="#FFD35A" {...BORDER_STYLE} />
      <polygon points="30,4 37,4 33.5,18" fill="#7CC6FE" {...BORDER_STYLE} />
      <polygon points="45,6 52,6 48.5,20" fill="#7EE0B5" {...BORDER_STYLE} />
      <polygon points="60,4 67,4 63.5,18" fill="#FF9F43" {...BORDER_STYLE} />
      <polygon points="75,6 82,6 78.5,20" fill="#8E9BFF" {...BORDER_STYLE} />
      <polygon points="90,4 97,4 93.5,18" fill="#FFD35A" {...BORDER_STYLE} />
      <polygon points="105,6 112,6 108.5,20" fill="#7CC6FE" {...BORDER_STYLE} />
    </svg>
  );
}

/** Map sticker ID to component */
export const STICKER_MAP: Record<StickerId, React.FC<StickerSVGProps>> = {
  'cake': CakeSticker,
  'party-popper': PartyPopperSticker,
  'balloons': BalloonsSticker,
  'gift-box': GiftBoxSticker,
  'cupcake': CupcakeSticker,
  'disco-ball': DiscoBallSticker,
  'sparkle-cluster': SparkleClusterSticker,
  'crown': CrownSticker,
  'confetti-cannon': ConfettiCannonSticker,
  'party-hat': PartyHatSticker,
  'vinyl-record': VinylRecordSticker,
  'instant-camera': InstantCameraSticker,
  'film-strip': FilmStripSticker,
  'ticket-stub': TicketStubSticker,
  'level-up-badge': LevelUpBadgeSticker,
  'certified-legend': CertifiedLegendSticker,
  'make-a-wish': MakeAWishSticker,
  'bunting': BuntingSticker,
};
