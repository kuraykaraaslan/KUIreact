import type { Metadata } from 'next';
import { SkipLink } from '@/modules/ui/SkipLink';
import { THEME_TITLES } from '@/libs/config/showcase.config';

export const metadata: Metadata = {
  title: { absolute: THEME_TITLES['promozone'] },
  description:
    'Personalise — a B2B catalog demo where promotional products are customized with color, print and quantity options and collected into a single quote request.',
};

export default function PromozoneThemeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink href="#main-content" label="Ana içeriğe geç" />
      {children}
    </>
  );
}
