export interface WishLine {
  text: string;
  animation?: 'mask' | 'slide' | 'scale';
}

export const wishes: WishLine[] = [
  {
    text: 'Another year around the sun, and the world got a little brighter because you\u2019re in it.',
    animation: 'mask',
  },
  {
    text: 'You turn ordinary days into stories we end up retelling for years.',
    animation: 'slide',
  },
  {
    text: 'May this year be loud with laughter and quiet with peace, whichever you need more.',
    animation: 'scale',
  },
  {
    text: 'Here\u2019s to chai breaks, late-night talks, and plans that never go as planned.',
    animation: 'mask',
  },
  {
    text: 'Keep being the kind of person people feel lucky to know.',
    animation: 'slide',
  },
];

export const hiddenWish =
  'P.S. You\u2019re stuck with us forever. No refunds.';

export const candleMomentText =
  'Make a wish. We\u2019re all wishing it with you.';
