import { generateMetadata as generateMetadataUtil, defaultMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const config = defaultMetadata.quiz[locale as 'en' | 'zh'] || defaultMetadata.quiz.en;
  
  return generateMetadataUtil({
    title: config.title,
    description: config.description,
    path: locale === 'zh' ? '/zh/quiz' : '/quiz',
    locale,
  });
}

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}