/**
 * Speech-to-Text API Route — Placeholder
 * POST /api/ai-alpha/stt
 *
 * Note: STT is handled by the browser's native Web Speech API (webkitSpeechRecognition)
 * This route exists for potential future server-side STT integration.
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Browser-side speech recognition is used instead
    // This endpoint just confirms the client supports speech recognition
    return NextResponse.json({
      supported: true,
      method: 'browser_native_webspeechapi',
      language: 'pt-BR',
    });
  } catch (error) {
    console.error('STT route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
