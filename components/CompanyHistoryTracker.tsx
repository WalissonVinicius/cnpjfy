'use client'

import { useEffect } from 'react'
import { addRecentSearch } from '@/lib/storage'
import type { Company } from '@/lib/api'

interface CompanyHistoryTrackerProps {
  company: Company
}

export function CompanyHistoryTracker({ company }: CompanyHistoryTrackerProps) {
  useEffect(() => {
    // Add to search history when component mounts
    if (company && company.cnpj && company.razaoSocial) {
      addRecentSearch({
        cnpj: company.cnpj,
        razaoSocial: company.razaoSocial,
      })
    }
  }, [company.cnpj, company.razaoSocial])

  // This component doesn't render anything
  return null
}