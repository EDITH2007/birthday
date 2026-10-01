export interface PhotoData {
  /** Path relative to /public, e.g. '/photos/beach.jpg'. Leave undefined for placeholder. */
  src?: string;
  caption: string;
  alt: string;
}

/**
 * Slideshow photos (6 slots).
 * To add a real photo:
 *   1. Drop the file in /public/photos/
 *   2. Set src to '/photos/your-file.jpg'
 */
export const slideshowPhotos: PhotoData[] = [
  { caption: 'The one that started it all', alt: 'Photo 1' },
  { caption: 'Golden hour vibes', alt: 'Photo 2' },
  { caption: 'Uncontrollable laughter', alt: 'Photo 3' },
  { caption: 'That spontaneous adventure', alt: 'Photo 4' },
  { caption: 'Quiet moments matter too', alt: 'Photo 5' },
  { caption: 'Us, being us', alt: 'Photo 6' },
];

/**
 * Gallery photos (8 slots).
 */
export const galleryPhotos: PhotoData[] = [
  { caption: 'Remember this?', alt: 'Gallery 1' },
  { caption: 'Classic us', alt: 'Gallery 2' },
  { caption: 'Best day ever', alt: 'Gallery 3' },
  { caption: 'We didn\u2019t plan this', alt: 'Gallery 4' },
  { caption: 'Candid gold', alt: 'Gallery 5' },
  { caption: 'The view was worth it', alt: 'Gallery 6' },
  { caption: 'Late nights, good talks', alt: 'Gallery 7' },
  { caption: 'Until next time', alt: 'Gallery 8' },
];
