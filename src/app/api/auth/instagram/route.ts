import { NextResponse } from 'next/server';

/**
 * Legacy OAuth entry point — no longer used.
 *
 * The CRM now connects via username lookup through
 * the ScrapeCreators API (/api/instagram/lookup).
 * This route is kept as a no-op for backward compat.
 */
export async function GET() {
  return NextResponse.json(
    {
      message: 'OAuth desabilitado. Use o fluxo de conexao por username no dashboard.',
      redirect: '/',
    },
    { status: 410 }
  );
}
