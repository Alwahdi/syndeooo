import { cn } from '@repo/design-system/lib/utils';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';

export const fonts = cn(
  GeistSans.variable,
  GeistMono.variable,
  'touch-manipulation font-sans antialiased'
);

/**
 * Font preconnect URLs for <head> inclusion.
 * Include these in layout files for Arabic/RTL Cairo font support.
 */
export const fontPreconnects = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
] as const;

/**
 * Google Fonts stylesheet URL for Cairo (Arabic RTL support).
 * Add to layout <head> when RTL is enabled:
 * <link href={cairoFontUrl} rel="stylesheet" />
 */
export const cairoFontUrl =
  'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap';
