import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getCompanyByCNPJ } from '@/lib/api';
import { CompanyHeader } from '@/components/CompanyHeader';
import { CompanyBasicInfo } from '@/components/CompanyBasicInfo';
import { CompanyAddress } from '@/components/CompanyAddress';
import { CompanyCNAE } from '@/components/CompanyCNAE';
import { CompanyPartners } from '@/components/CompanyPartners';
import { CompanyActions } from '@/components/CompanyActions';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { CompanyHistoryTracker } from '@/components/CompanyHistoryTracker';

interface CompanyPageProps {
  params: {
    locale: string;
    cnpj: string;
  };
}

async function CompanyData({ cnpj, locale }: { cnpj: string; locale: string }) {
  try {
    const company = await getCompanyByCNPJ(cnpj);

    return (
      <div className="space-y-6 company-content">
        <CompanyHistoryTracker company={company} />
        <CompanyHeader company={company} />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Coluna Principal - 2/3 do espaço */}
          <div className="lg:col-span-2 space-y-6">
            <CompanyBasicInfo company={company} />
            <CompanyCNAE company={company} />
            <CompanyPartners company={company} />
          </div>

          {/* Barra Lateral - 1/3 do espaço */}
          <div className="space-y-6">
            <CompanyAddress company={company} />
            <div className="no-print">
              <CompanyActions company={company} locale={locale} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error: any) {
    if (error.message?.includes('não encontrado')) {
      notFound();
    }

    throw error;
  }
}

export default function CompanyPage({ params }: CompanyPageProps) {
  return (
    <div className="container mx-auto px-4 py-6">
      <Suspense fallback={<LoadingSkeleton />}>
        <CompanyData cnpj={params.cnpj} locale={params.locale} />
      </Suspense>
    </div>
  );
}

export async function generateMetadata({ params }: CompanyPageProps) {
  try {
    const company = await getCompanyByCNPJ(params.cnpj);

    return {
      title: `${company.razaoSocial} - CNPJfy`,
      description: `Informações da empresa ${company.razaoSocial} (CNPJ: ${company.cnpj}). Consulta gratuita de dados empresariais.`,
      openGraph: {
        title: `${company.razaoSocial} - CNPJfy`,
        description: `Informações da empresa ${company.razaoSocial} (CNPJ: ${company.cnpj})`,
      },
    };
  } catch {
    return {
      title: 'Empresa não encontrada - CNPJfy',
      description: 'A empresa solicitada não foi encontrada em nossa base de dados.',
    };
  }
}