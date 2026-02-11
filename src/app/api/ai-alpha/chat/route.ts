/**
 * AI Alpha Chat API Route
 * POST /api/ai-alpha/chat
 * Body: { query: string }
 * Response: { response: string; type: string; data?: any }
 */

import { NextRequest, NextResponse } from 'next/server';
import { processAIAlphaQuery } from '@/lib/ai-alpha-engine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body as { query?: string };

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: query is required' },
        { status: 400 }
      );
    }

    // Process query with AI Alpha Engine
    const result = processAIAlphaQuery(query);

    return NextResponse.json({
      response: result.text,
      type: result.type,
      data: result.data || null,
    });
  } catch (error) {
    console.error('AI Alpha Chat error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
