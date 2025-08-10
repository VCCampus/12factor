import { generateMetadata as generateMetadataUtil, defaultMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const config = defaultMetadata.flashcards[locale as 'en' | 'zh'] || defaultMetadata.flashcards.en;
  
  return generateMetadataUtil({
    title: config.title,
    description: config.description,
    path: locale === 'zh' ? '/zh/flashcards' : '/flashcards',
    locale,
  });
}

export default function FlashcardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}