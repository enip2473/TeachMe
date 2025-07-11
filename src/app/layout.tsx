import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/common/header';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@/components/common/analytics';
import { AuthProvider } from '@/components/auth-provider';

export const metadata: Metadata = {
  title: 'TeachMe 教我 - 你的學習宇宙',
  description: 'TeachMe 教我 - 一個全面的線上學習平台。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="google-site-verification" content="ReUfML1e4IAyjuyW7FFNiioT1ZLf8R5nFyYEiGIiqEs" />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
        <Analytics />
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container mx-auto">{children}</main>
          </div>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
