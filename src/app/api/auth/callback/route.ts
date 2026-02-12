import { NextResponse } from 'next/server';

/**
 * Legacy OAuth callback — no longer used.
 *
 * The CRM now connects via username lookup through
 * the ScrapeCreators API (/api/instagram/lookup).
 */
export async function GET() {
  return NextResponse.json(
    {
      message: 'OAuth callback desabilitado. Use o fluxo de conexao por username.',
      redirect: '/',
    },
    { status: 410 }
  );
}
