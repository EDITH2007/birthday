# 🎂 For Shreya — Birthday Surprise Website

A handcrafted, cinematic 3-page birthday surprise built with Next.js, Framer Motion, GSAP, and canvas-confetti. Fully static, deployable on Vercel.

---

## ✨ Quick Start

```bash
npm install
npm run dev       # Development at http://localhost:3000
npm run build     # Production build
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout (fonts, metadata, cursor, grain)
│   ├── page.tsx             # Page 1 — "The Invitation"
│   ├── globals.css          # Global styles & animations
│   ├── wish/page.tsx        # Page 2 — "The Wish"
│   └── memories/page.tsx    # Page 3 — "The Memories"
├── components/
│   ├── CustomCursor.tsx     # Soft-blob cursor (desktop only)
│   ├── FilmGrain.tsx        # Film grain overlay
│   ├── ConfettiShapes.tsx   # Floating paper-cut confetti
│   ├── FloatingOrbs.tsx     # Ambient gradient orbs
│   ├── PageTransition.tsx   # AnimatePresence route wrapper
│   ├── MusicToggle.tsx      # Background music toggle
│   ├── WishLine.tsx         # Animated wish line (mask/slide/scale)
│   ├── SparkleReveal.tsx    # Tappable sparkle → hidden message
│   ├── CakeCandle.tsx       # Cake + blowable candle
│   ├── OTPVault.tsx         # 5-digit code entry vault
│   ├── Slideshow.tsx        # GSAP-powered Ken Burns slideshow
│   ├── PolaroidGallery.tsx  # Rotated polaroid grid
│   └── PhotoPlaceholder.tsx # Real photo or elegant placeholder
├── content/                 # ← ALL PERSONAL CONTENT LIVES HERE
│   ├── config.ts            # Code, hint, closing message, name
│   ├── wishes.ts            # Wish lines + hidden wish + candle text
│   └── photos.ts            # Photo arrays for slideshow & gallery
├── hooks/
│   ├── useReducedMotion.ts
│   ├── useIsMobile.ts
│   └── useMousePosition.ts
└── lib/
    └── easing.ts            # Shared easing curves & spring configs
public/
├── photos/                  # ← DROP PHOTOS HERE
├── music.mp3                # ← Optional background music
└── favicon.svg
```

---

## 🖼️ Adding Photos

1. **Drop your photo** into `public/photos/` (e.g., `beach.jpg`)
2. **Edit** `src/content/photos.ts`:

```ts
// BEFORE (placeholder):
{ caption: 'The one that started it all', alt: 'Photo 1' },

// AFTER (real photo):
{ src: '/photos/beach.jpg', caption: 'The one that started it all', alt: 'Beach trip' },
```

- **Slideshow photos**: `slideshowPhotos` array (6 slots)
- **Gallery photos**: `galleryPhotos` array (8 slots)
- Photos can be any size/orientation — they're displayed with `object-cover`
- If `src` is omitted, an elegant placeholder renders automatically

---

## ✏️ Editing Wishes

Open `src/content/wishes.ts`:

```ts
export const wishes: WishLine[] = [
  {
    text: 'Your wish text here.',
    animation: 'mask',     // Options: 'mask' | 'slide' | 'scale'
  },
  // ...
];

export const hiddenWish = 'The sparkle-hidden message.';
export const candleMomentText = 'The candle moment text.';
```

---

## 🔐 Changing the Secret Code & Hint

Open `src/content/config.ts`:

```ts
export const SECRET_CODE = 'SSVSS';    // Must be 5 characters, case-insensitive
export const CODE_HINT = 'Hint: the first letters of the five of us.';
```

---

## 💬 Editing the Closing Message

Also in `src/content/config.ts`:

```ts
export const CLOSING_MESSAGE =
  'Happy Birthday, Shreya. Thank you for being part of our story. — Somendra, Shruti, Vansh & Siddhu';
```

---

## 🎵 Adding Background Music

1. Place an MP3 file at `public/music.mp3`
2. That's it! The music toggle button appears automatically in the bottom-right corner
3. Music is **off by default** and respects autoplay rules

---

## 🚀 Deploying to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repo
4. Deploy (no config needed — it's fully static)

Or use the Vercel CLI:
```bash
npx -y vercel
```

---

## 🎨 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Ivory Base | `#FFFBF2` | Background |
| Deep Ink | `#1F2340` | Text |
| Butter Yellow | `#FFD35A` | Primary accent |
| Sky Blue | `#7CC6FE` | Secondary accent |
| Mint | `#7EE0B5` | Success / decorative |
| Tangerine | `#FF9F43` | Warm accent |
| Periwinkle | `#8E9BFF` | Tertiary accent |

---

## 📱 Responsive

- Mobile-first: flawless at **390px**
- Tablet: great at **768px**
- Desktop: beautiful at **1440px+**
- Custom cursor activates on desktop (hover devices only)
- Respects `prefers-reduced-motion`

---

## The Flow

```
/ (Invitation)  →  click "Open me"  →  confetti + clip-path reveal
                        ↓
/wish (The Wish)  →  scroll wishes  →  tap sparkle  →  blow candle
                        ↓
               Enter code "SSVSS"  →  unlock  →  confetti
                        ↓
/memories (Memories)  →  slideshow  →  gallery  →  closing  →  Replay
```

Page 3 (`/memories`) is session-gated: it redirects to `/wish` unless unlocked via the code vault.
