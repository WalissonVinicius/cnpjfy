"use client";

import { useTranslation } from '@/lib/i18n';

export function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            {t('footer.developedBy', 'Desenvolvido pela comunidade')}{' '}
            <a
              href="https://github.com/WalissonVinicius/cnpjfy"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 underline underline-offset-4 transition-colors duration-300"
            >
              CNPJfy
            </a>
            . {t('footer.dataSource', 'Dados da Receita Federal do Brasil')}.
          </p>
        </div>
      </div>
    </footer>
  );
}