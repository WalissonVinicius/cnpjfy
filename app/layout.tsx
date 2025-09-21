import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CNPJfy — O retrato inteligente do CNPJ',
  description: 'Consulta de CNPJ gratuita e completa com interface moderna',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}