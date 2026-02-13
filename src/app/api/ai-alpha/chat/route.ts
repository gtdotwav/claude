/**
 * AI Alpha Chat API Route
 * POST /api/ai-alpha/chat
 * Body: { query: string }
 * Response: { response: string; type: string; data?: any }
 *
 * Behavior:
 * - If ANTHROPIC_API_KEY is set, uses Claude (Anthropic) for responses.
 * - Otherwise falls back to the local pattern-matching AI Alpha Engine.
 */

import { NextRequest, NextResponse } from 'next/server';
import { processAIAlphaQuery } from '@/lib/ai-alpha-engine';
import Anthropic from '@anthropic-ai/sdk';

function getAnthropicClient(): Anthropic | null {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  return new Anthropic({ apiKey: key });
}

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

    const anthropic = getAnthropicClient();

    // 1) Claude path (if configured)
    if (anthropic) {
      const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-latest';

      const msg = await anthropic.messages.create({
        model,
        max_tokens: 700,
        temperature: 0.2,
        system:
          'Você é um assistente de CRM/Instagram focado em performance e automação. Responda em PT-BR, de forma direta e acionável.',
        messages: [{ role: 'user', content: query }],
      });

      const text = msg.content
        .filter((c) => c.type === 'text')
        .map((c) => c.text)
        .join('\n')
        .trim();

      return NextResponse.json({
        response: text || 'Sem resposta.',
        type: 'llm',
        data: { model },
      });
    }

    // 2) Fallback: local engine
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
