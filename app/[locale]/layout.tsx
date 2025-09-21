import '../globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import QueryProvider from '@/lib/queryClient';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { OnlineStatus } from '@/components/OnlineStatus';
import { Navigation } from '@/components/Navigation';
import { Toaster } from '@/components/ui/toaster';

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
  metadataBase: new URL('https://cnpjfy.com'),
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
    url: 'https://cnpjfy.com',
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
                  <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                      {/* Search will be added here */}
                    </div>
                    <nav className="flex items-center space-x-3">
                      <OnlineStatus />
                      <LanguageSwitcher />
                      <ThemeToggle />
                    </nav>
                  </div>
                </div>
              </header>
              <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                  {children}
                </div>
              </main>
              <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur py-8">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                  <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                      Desenvolvido pela comunidade{' '}
                      <a
                        href="https://github.com/opencnpj"
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 underline underline-offset-4 transition-colors duration-300"
                      >
                        CNPJfy
                      </a>
                      . Dados da Receita Federal do Brasil.
                    </p>
                  </div>
                </div>
              </footer>
            </div>
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}