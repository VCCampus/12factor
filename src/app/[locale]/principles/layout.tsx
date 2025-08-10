import { generateMetadata as generateMetadataUtil, defaultMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const config = defaultMetadata.principles[locale as 'en' | 'zh'] || defaultMetadata.principles.en;
  
  return generateMetadataUtil({
    title: config.title,
    description: config.description,
    path: locale === 'zh' ? '/zh/principles' : '/principles',
    locale,
  });
}

export default function PrinciplesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}