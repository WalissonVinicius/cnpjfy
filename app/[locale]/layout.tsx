import '../globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import QueryProvider from '@/lib/queryClient';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { OnlineStatus } from '@/components/OnlineStatus';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ClientWrapper } from '@/components/ClientWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CNPJfy — O retrato inteligente do CNPJ',
  description: 'Consulte informações de empresas brasileiras de forma gratuita e rápida. Dados atualizados da Receita Federal.',
  keywords: 'CNPJ, consulta, empresa, receita federal, brasil, gratuito, cnpjfy',
  authors: [{ name: 'CNPJfy Team' }],
  creator: 'CNPJfy',
  publisher: 'CNPJfy',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://cnpjfy.walisson.dev/'),
  alternates: {
    canonical: '/',
    languages: {
      'pt-BR': '/pt-BR',
      'en-US': '/en-US',
    },
  },
  icons: {
    icon: '/cnpjfy-icon.svg',
    shortcut: '/cnpjfy-icon.svg',
    apple: '/cnpjfy-icon.svg',
  },
  openGraph: {
    title: 'CNPJfy — O retrato inteligente do CNPJ',
    description: 'Consulte informações de empresas brasileiras de forma gratuita e rápida.',
    url: 'https://cnpjfy.walisson.dev/',
    siteName: 'CNPJfy',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CNPJfy — O retrato inteligente do CNPJ',
    description: 'Consulte informações de empresas brasileiras de forma gratuita e rápida.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={params.locale} suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 font-sans antialiased">
              <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
                <div className="container flex h-16 items-center">
                  <Navigation locale={params.locale} />
                  {/* Desktop only - no mobile já está tudo no Navigation */}
                  <div className="hidden md:flex flex-1 items-center justify-end space-x-3">
                    <OnlineStatus />
                    <LanguageSwitcher />
                    <ThemeToggle />
                  </div>
                </div>
              </header>
              <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                  {children}
                </div>
              </main>
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}