"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { History, GitCompare, Info, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';

interface NavigationProps {
  locale: string;
}

export function Navigation({ locale }: NavigationProps) {
  const pathname = usePathname();
  const { t } = useTranslation('navigation');

  const navigation = [
    {
      name: t('home', 'Início'),
      href: `/${locale}`,
      icon: History, // Usando History temporariamente para o ícone de Início
      current: pathname === `/${locale}`,
    },
    {
      name: t('history', 'Histórico'),
      href: `/${locale}/historico`,
      icon: History,
      current: pathname.startsWith(`/${locale}/historico`),
    },
    {
      name: t('compare', 'Comparar'),
      href: `/${locale}/comparar`,
      icon: GitCompare,
      current: pathname.startsWith(`/${locale}/comparar`),
    },
    {
      name: t('apiDocs', 'API Docs'),
      href: `/${locale}/api-docs`,
      icon: BookOpen,
      current: pathname.startsWith(`/${locale}/api-docs`),
    },
    {
      name: t('about', 'Sobre'),
      href: `/${locale}/sobre`,
      icon: Info,
      current: pathname.startsWith(`/${locale}/sobre`),
    },
  ];

  return (
    <div className="mr-4 hidden md:flex">
      <Link href={`/${locale}`} className="mr-8 flex items-center group">
        <Image 
          src="/cnpjfy-logo.svg" 
          alt="CNPJfy Logo" 
          width={120} 
          height={32} 
          className="group-hover:scale-105 transition-transform duration-300"
          priority
        />
      </Link>
      <nav className="flex items-center space-x-8 text-sm font-semibold">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105',
                item.current 
                  ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 shadow-sm' 
                  : 'text-foreground/70 hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}