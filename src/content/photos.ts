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
  { src: '/photos/The one that started it all..jpeg', caption: 'The one that started it all', alt: 'Photo 1' },
  { src: '/photos/photo2.jpg', caption: 'Golden hour vibes', alt: 'Photo 2' },
  { src: '/photos/photo3.jpg', caption: 'Uncontrollable laughter', alt: 'Photo 3' },
  { src: '/photos/photo4.jpg', caption: 'That spontaneous adventure', alt: 'Photo 4' },
  { src: '/photos/photo5.jpg', caption: 'Quiet moments matter too', alt: 'Photo 5' },
  { src: '/photos/photo6.jpg', caption: 'Us, being us', alt: 'Photo 6' },
];

/**
 * Gallery photos (8 slots).
 */
export const galleryPhotos: PhotoData[] = [
  { src: '/photos/gallery1.jpg', caption: 'Remember this?', alt: 'Gallery 1' },
  { src: '/photos/gallery2.jpg', caption: 'Classic us', alt: 'Gallery 2' },
  { src: '/photos/gallery3.jpg', caption: 'Best day ever', alt: 'Gallery 3' },
  { src: '/photos/gallery4.jpg', caption: 'We didn\u2019t plan this', alt: 'Gallery 4' },
  { src: '/photos/gallery5.jpg', caption: 'Candid gold', alt: 'Gallery 5' },
  { src: '/photos/gallery6.jpg', caption: 'The view was worth it', alt: 'Gallery 6' },
  { src: '/photos/gallery7.jpg', caption: 'Late nights, good talks', alt: 'Gallery 7' },
  { src: '/photos/gallery8.jpg', caption: 'Until next time', alt: 'Gallery 8' },
];
