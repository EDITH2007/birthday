import type { Metadata, Viewport } from 'next';
import { Fraunces, Manrope, Instrument_Serif, Allura, Pinyon_Script } from 'next/font/google';
import './globals.css';
import CustomCursor from '@/components/CustomCursor';
import FilmGrain from '@/components/FilmGrain';
import MusicToggle from '@/components/MusicToggle';
import PageTransition from '@/components/PageTransition';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const instrument = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
  weight: ['400'],
  style: ['normal', 'italic'],
});

const allura = Allura({
  subsets: ['latin'],
  variable: '--font-allura',
  display: 'swap',
  weight: ['400'],
});

const pinyon = Pinyon_Script({
  subsets: ['latin'],
  variable: '--font-pinyon',
  display: 'swap',
  weight: ['400'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#FFFBF2',
};

export const metadata: Metadata = {
  title: 'For Shreya',
  description: 'A handcrafted birthday surprise for someone special.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'For Shreya',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'For Shreya ✦',
    description: 'You\u2019ve got a birthday surprise waiting. Open it!',
    type: 'website',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${manrope.variable} ${instrument.variable} ${allura.variable} ${pinyon.variable}`}
      data-scroll-behavior="smooth"
    >
      <body
        className="antialiased overflow-x-clip"
        style={{
          fontFamily: 'var(--font-manrope), sans-serif',
          backgroundColor: '#FFFBF2',
          color: '#1F2340',
        }}
      >
        <CustomCursor />
        <FilmGrain />
        <PageTransition>{children}</PageTransition>
        <MusicToggle />
      </body>
    </html>
  );
}

