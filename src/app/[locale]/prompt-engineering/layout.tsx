import { generateMetadata as generateMetadataUtil, defaultMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const config = defaultMetadata.promptEngineering[locale as 'en' | 'zh'] || defaultMetadata.promptEngineering.en;
  
  return generateMetadataUtil({
    title: config.title,
    description: config.description,
    path: locale === 'zh' ? '/zh/prompt-engineering' : '/prompt-engineering',
    locale,
  });
}

export default function PromptEngineeringLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}