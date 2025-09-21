import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['pt-BR', 'en-US'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Skip middleware for Next.js internals and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Detect locale from Accept-Language header
  const acceptLanguage = req.headers.get('accept-language') || '';
  const detectedLocale = acceptLanguage
    .split(',')[0]
    ?.split('-')
    .slice(0, 2)
    .join('-');

  const locale = locales.includes(detectedLocale) ? detectedLocale : 'pt-BR';

  // Redirect to locale-prefixed path
  return NextResponse.redirect(
    new URL(`/${locale}${pathname}`, req.url)
  );
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};