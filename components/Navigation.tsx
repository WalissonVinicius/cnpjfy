"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { History, GitCompare, Info, BookOpen, Menu, X, Home, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { OnlineStatus } from '@/components/OnlineStatus';

interface NavigationProps {
  locale: string;
}

export function Navigation({ locale }: NavigationProps) {
  const pathname = usePathname();
  const { t } = useTranslation('navigation');
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Toda a navegação vai no menu dropdown mobile
  const allNavigation = [
    {
      name: t('home', 'Início'),
      href: `/${locale}`,
      icon: Home,
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

  const hasMenuActive = allNavigation.some(item => item.current);

  return (
    <>
      {/* Desktop Navigation */}
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
          {allNavigation.map((item) => {
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

      {/* Mobile: Logo + Menu (3 pontinhos) */}
      <div className="flex md:hidden items-center gap-2 w-full">
        <Link href={`/${locale}`} className="flex items-center">
          <Image
            src="/cnpjfy-logo.svg"
            alt="CNPJfy"
            width={100}
            height={28}
            className="hover:scale-105 transition-transform duration-300"
            priority
          />
        </Link>

        <div className="ml-auto flex items-center gap-2">
          {/* Conectividade - fica fora do menu */}
          <OnlineStatus />

          {/* Menu com 3 pontinhos */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'h-10 w-10 rounded-full transition-all duration-300',
                  hasMenuActive && 'bg-brand-100 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400'
                )}
              >
                <MoreHorizontal className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {/* Páginas de navegação */}
              {allNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors',
                        item.current
                          ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-semibold'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </DropdownMenuItem>
                );
              })}

              {/* Separador */}
              <div className="my-1 h-px bg-gray-200 dark:bg-gray-800" />

              {/* Idioma */}
              <div className="px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('language', 'Idioma')}
                  </span>
                  <LanguageSwitcher />
                </div>
              </div>

              {/* Tema */}
              <div className="px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('theme', 'Tema')}
                  </span>
                  <ThemeToggle />
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}