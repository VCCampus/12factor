import { Inter, Noto_Sans_SC } from 'next/font/google';
import ThemeScript from './[locale]/theme-script';
import { cookies } from 'next/headers';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const notoSansSC = Noto_Sans_SC({
  variable: '--font-noto-sans-sc',
  subsets: ['latin'],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get theme from cookies
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value || 'system';
  const themeClass = theme === 'dark' ? 'dark' : theme === 'light' ? '' : '';
  
  return (
    <html lang="en" className={themeClass} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${inter.variable} ${notoSansSC.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}