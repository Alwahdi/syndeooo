import { cn } from '@repo/design-system/lib/utils';
import { GeistMono } from 'geist/font/mono';
import { Cairo, Ubuntu } from 'next/font/google';

const ubuntu = Ubuntu({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  variable: '--font-ubuntu',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cairo',
  display: 'swap',
});

export const fonts = cn(
  ubuntu.variable,
  cairo.variable,
  GeistMono.variable,
  'touch-manipulation font-sans antialiased'
);
