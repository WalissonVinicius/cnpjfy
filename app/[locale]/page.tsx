"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Building2, TrendingUp, Clock, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cnpjMask, cnpjClean, isValidCnpj } from '@/lib/cnpj';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from '@/lib/i18n';

interface HomePageProps {
  params: { locale: string };
}

export default function HomePage({ params }: HomePageProps) {
  const [cnpjInput, setCnpjInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation('home');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanCnpj = cnpjClean(cnpjInput);

    if (!isValidCnpj(cleanCnpj)) {
      toast({
        title: t('invalidCnpj'),
        description: t('invalidCnpjDesc', 'Por favor, verifique se o CNPJ foi digitado corretamente.'),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Pequeno delay para garantir que o modal apareça
      await new Promise(resolve => setTimeout(resolve, 100));

      // Navigate to company page
      router.push(`/${params.locale}/empresa/${cleanCnpj}`);

      // Não resetar isLoading aqui - deixar o modal visível durante a navegação
      // O estado será resetado automaticamente quando a página mudar
    } catch (error) {
      setIsLoading(false);
      toast({
        title: t('error', 'Erro'),
        description: t('searchError', 'Ocorreu um erro ao buscar a empresa. Tente novamente.'),
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCnpjInput(cnpjMask(value));
  };

  // Resetar loading ao desmontar o componente
  useEffect(() => {
    return () => {
      setIsLoading(false);
    };
  }, []);

  // Implementar atalho Ctrl+K para busca rápida
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Verificar se Ctrl+K foi pressionado
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        // Focar no campo de busca
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
    };

    // Adicionar listener de teclado
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const features = [
    {
      icon: Building2,
      title: t('features.realtime'),
      description: t('features.realtimeDesc'),
    },
    {
      icon: Clock,
      title: t('features.history'),
      description: t('features.historyDesc'),
    },
    {
      icon: Download,
      title: t('features.export'),
      description: t('features.exportDesc'),
    },
    {
      icon: TrendingUp,
      title: t('features.offline'),
      description: t('features.offlineDesc'),
    },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-200px)] space-y-6 sm:space-y-8 overflow-hidden px-4">
      {/* Loading Overlay Modal */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center space-y-6">
              {/* Animated Logo/Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-accent-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-brand-500 to-accent-500 rounded-full p-6 shadow-lg">
                  <Search className="h-12 w-12 text-white animate-pulse" />
                </div>
              </div>

              {/* Loading Spinner */}
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-brand-200 dark:border-brand-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-brand-600 rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-4 border-transparent border-t-accent-500 rounded-full animate-spin animation-delay-150" style={{ animationDuration: '1s' }}></div>
              </div>

              {/* Loading Text */}
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-foreground">
                  {t('loading', 'Buscando empresa...')}
                </h3>
                <p className="text-sm text-muted-foreground animate-pulse">
                  Aguarde enquanto consultamos os dados
                </p>
              </div>

              {/* Progress Animation */}
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full animate-loading-bar"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-r from-brand-500/20 to-accent-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-accent-500/20 to-cyan-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <div className="text-center space-y-4 sm:space-y-6 max-w-4xl relative z-10 w-full">
        <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-brand-500/10 to-accent-500/10 border border-brand-500/20 mb-2 sm:mb-4">
          <span className="text-xs sm:text-sm font-medium text-brand-600 dark:text-brand-400">{t('newExperience', '✨ Nova experiência visual')}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-brand-600 via-purple-600 to-accent-500 bg-clip-text text-transparent animate-pulse">
            CNPJfy
          </span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl font-semibold bg-gradient-to-r from-gray-700 to-gray-500 dark:from-gray-300 dark:to-gray-100 bg-clip-text text-transparent px-4">
          {t('subtitle')}
        </p>

        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {t('description')}
        </p>
      </div>

      {/* Search Form */}
      <div className="w-full max-w-lg space-y-4 sm:space-y-6 relative z-10">
        <form onSubmit={handleSearch} className="space-y-4 sm:space-y-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-accent-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-brand-500" />
              <Input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={cnpjInput}
                onChange={handleInputChange}
                className="pl-10 sm:pl-12 pr-3 sm:pr-4 text-center text-base sm:text-lg h-12 sm:h-14 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-2 border-brand-200 dark:border-brand-800 rounded-xl focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-300"
                maxLength={18}
                autoComplete="off"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-brand-600 to-accent-500 hover:from-brand-700 hover:to-accent-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isLoading || !cnpjInput.trim()}
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-5 h-5 border-3 border-transparent border-t-white/50 rounded-full animate-spin animation-delay-150"></div>
                </div>
                <span className="animate-pulse">{t('loading', 'Buscando empresa...')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                {t('searchButton')}
              </div>
            )}
          </Button>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground px-2">
          <span className="hidden sm:inline">{t('pressKey', 'Pressione')}</span>
          <kbd className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-semibold text-gray-800 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-lg dark:from-gray-700 dark:to-gray-600 dark:text-gray-100 dark:border-gray-500">Ctrl</kbd>
          <span>+</span>
          <kbd className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-semibold text-gray-800 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-lg dark:from-gray-700 dark:to-gray-600 dark:text-gray-100 dark:border-gray-500">K</kbd>
          <span className="text-center">{t('quickSearch', 'para buscar rapidamente')}</span>
        </div>
      </div>

      {/* Features Grid */}
      <div className="w-full max-w-6xl mt-12 sm:mt-20 relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent mb-3 sm:mb-4">
            {t('features.title')}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            {t('featuresDescription', 'Tudo que você precisa para consultar empresas de forma eficiente e moderna')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="group relative overflow-hidden border-0 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="text-center pb-4 relative z-10">
                  <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold mt-4 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center relative z-10">
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex flex-wrap justify-center gap-6 mt-16 relative z-10">
        <Button
          variant="outline"
          asChild
          className="h-12 px-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-2 border-brand-200 dark:border-brand-800 hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950/50 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <a href={`/${params.locale}/historico`}>{t('viewHistory', 'Ver histórico')}</a>
        </Button>
        <Button
          variant="outline"
          asChild
          className="h-12 px-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-2 border-accent-200 dark:border-accent-800 hover:border-accent-500 hover:bg-accent-50 dark:hover:bg-accent-950/50 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <a href={`/${params.locale}/comparar`}>{t('compareCompanies', 'Comparar empresas')}</a>
        </Button>
        <Button
          variant="outline"
          asChild
          className="h-12 px-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-2 border-purple-200 dark:border-purple-800 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/50 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <a href={`/${params.locale}/sobre`}>{t('aboutProject', 'Sobre o projeto')}</a>
        </Button>
      </div>
    </div>
  );
}