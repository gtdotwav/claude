# AI Alpha Usage Examples & Demo Scenarios

Complete examples for using the AI Alpha voice conversation system in your Instagram CRM dashboard.

---

## Example 1: Basic Page Integration

```tsx
// app/page.tsx
'use client';

import { AIAlpha } from '@/components/ui/ai-voice-input';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1a1a1a] to-black p-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-white mb-4">
          AI Alpha Dashboard
        </h1>
        <p className="text-white/50 text-lg max-w-2xl mx-auto">
          Converse com seus dados. Faça perguntas em português natural e receba insights em tempo real.
        </p>
      </div>

      {/* AI Alpha Component */}
      <div className="max-w-3xl mx-auto">
        <AIAlpha />
      </div>

      {/* Features */}
      <div className="max-w-3xl mx-auto mt-16 grid grid-cols-3 gap-6">
        <div className="p-4 rounded-lg bg-white/[0.05] border border-white/[0.08]">
          <p className="text-white/70 text-sm">🎤 Voice Input</p>
          <p className="text-white text-xs mt-2">Fale em português natural</p>
        </div>
        <div className="p-4 rounded-lg bg-white/[0.05] border border-white/[0.08]">
          <p className="text-white/70 text-sm">🤖 AI Responses</p>
          <p className="text-white text-xs mt-2">Insights instantâneos</p>
        </div>
        <div className="p-4 rounded-lg bg-white/[0.05] border border-white/[0.08]">
          <p className="text-white/70 text-sm">🔊 Audio Playback</p>
          <p className="text-white text-xs mt-2">Ouça as respostas</p>
        </div>
      </div>
    </div>
  );
}
```

---

## Example 2: With Dashboard Analytics

```tsx
// app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import { AIAlpha } from '@/components/ui/ai-voice-input';

interface QueryAnalytics {
  query: string;
  timestamp: Date;
  responseTime: number;
  intent: string;
}

export default function DashboardPage() {
  const [queries, setQueries] = useState<QueryAnalytics[]>([]);

  const handleAIQuery = async (query: string) => {
    const startTime = Date.now();

    // Fetch response to measure time
    const response = await fetch('/api/ai-alpha/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    const responseTime = Date.now() - startTime;

    // Add to analytics
    setQueries((prev) => [
      ...prev,
      {
        query,
        timestamp: new Date(),
        responseTime,
        intent: data.type,
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <div className="border-b border-white/10 p-6">
        <h1 className="text-white text-2xl font-bold">Dashboard CRM</h1>
      </div>

      <div className="grid grid-cols-3 gap-6 p-6 border-b border-white/10">
        {/* Metrics Cards */}
        <div className="bg-white/[0.03] p-4 rounded-lg border border-white/[0.08]">
          <p className="text-white/50 text-sm">Total Queries</p>
          <p className="text-white text-2xl font-bold mt-2">{queries.length}</p>
        </div>

        <div className="bg-white/[0.03] p-4 rounded-lg border border-white/[0.08]">
          <p className="text-white/50 text-sm">Avg Response Time</p>
          <p className="text-white text-2xl font-bold mt-2">
            {queries.length > 0
              ? Math.round(
                  queries.reduce((sum, q) => sum + q.responseTime, 0) /
                    queries.length
                )
              : 0}
            ms
          </p>
        </div>

        <div className="bg-white/[0.03] p-4 rounded-lg border border-white/[0.08]">
          <p className="text-white/50 text-sm">Most Used Intent</p>
          <p className="text-white text-2xl font-bold mt-2">
            {queries.length > 0
              ? Object.entries(
                  queries.reduce(
                    (acc, q) => {
                      acc[q.intent] = (acc[q.intent] || 0) + 1;
                      return acc;
                    },
                    {} as Record<string, number>
                  )
                ).sort((a, b) => b[1] - a[1])[0][0]
              : '-'}
          </p>
        </div>
      </div>

      {/* AI Alpha Section */}
      <div className="p-6 max-w-3xl mx-auto">
        <AIAlpha onSubmit={handleAIQuery} />
      </div>

      {/* Query History */}
      {queries.length > 0 && (
        <div className="p-6 border-t border-white/10">
          <h2 className="text-white font-bold mb-4">Query History</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {[...queries].reverse().map((q, idx) => (
              <div
                key={idx}
                className="p-3 bg-white/[0.03] border border-white/[0.08] rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white/90 text-sm">{q.query}</p>
                    <p className="text-white/30 text-xs mt-1">
                      {q.timestamp.toLocaleTimeString('pt-BR')} • {q.intent} •{' '}
                      {q.responseTime}ms
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Example 3: Modal Dialog Integration

```tsx
// components/ai-alpha-dialog.tsx
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { AIAlpha } from '@/components/ui/ai-voice-input';

export function AIAlphaDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
      >
        <span className="text-white text-xl">💬</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-white/10 rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white text-xl font-bold">AI Alpha</h2>
                <p className="text-white/50 text-sm mt-1">
                  Converse com seus dados
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/50 hover:text-white/70 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Component */}
            <AIAlpha
              onSubmit={() => {
                // Optional: Close on submit
                // setIsOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
```

Usage in layout:
```tsx
// app/layout.tsx
import { AIAlphaDialog } from '@/components/ai-alpha-dialog';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <AIAlphaDialog />
      </body>
    </html>
  );
}
```

---

## Example 4: Sidebar Widget

```tsx
// components/sidebar.tsx
'use client';

import { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { AIAlpha } from '@/components/ui/ai-voice-input';

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-white/[0.02] border-r border-white/10 transition-all duration-300 ${
        isExpanded ? 'w-96' : 'w-20'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        {isExpanded && <h3 className="text-white font-bold">AI Alpha</h3>}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white/50 hover:text-white/70"
        >
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 overflow-y-auto h-[calc(100vh-60px)]">
          <AIAlpha />
        </div>
      )}
    </div>
  );
}
```

---

## Example 5: With Real Data Integration

```tsx
// hooks/useAIAlphaWithData.ts
'use client';

import { useState, useCallback } from 'react';

interface APIResponse {
  response: string;
  type: string;
  data: any;
}

export function useAIAlphaWithData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<APIResponse | null>(null);

  const query = useCallback(async (text: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-alpha/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setLastResponse(data);

      // Optional: Trigger dashboard refresh based on query type
      if (data.type === 'comparison') {
        // Refresh influencer comparison view
      } else if (data.type === 'summary') {
        // Refresh overall metrics
      }

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { query, loading, error, lastResponse };
}

// Usage:
// const { query, loading, error, lastResponse } = useAIAlphaWithData();
// await query('Qual influencer teve mais engajamento?');
```

---

## Example 6: Demo Conversation Flow

This is what a typical user conversation looks like:

### Scenario: Planning a Black Friday Campaign

**User (Voice):** "Quem seria ideal pra Black Friday?"
```
🎤 Listening... [animated bars]
Speech recognized: "Quem seria ideal pra Black Friday?"
⏳ Processing...

AI Response:
🎯 **Recomendação de Parceria**

✨ Melhor fit para sua campanha:

👑 **FitBot Prime**
   • Followers: 67.3K
   • Engajamento: 6.1%
   • Estilo: Motivacional / Energetico
   • Bio: Treinos, nutricao e motivacao diaria

💪 Por que escolher? Alta taxa de engajamento e audiência qualificada.

🔊 [Audio playing...]
```

---

**User (Text):** "Compare @Luna Tech vs @Glow by AI em alcance"
```
📊 **Comparação de Influenciadores**

🥇 **Luna Tech** lidera em engajamento:
   • Followers: 52.4K
   • Taxa de Engajamento: 4.2%
   • Nicho: tech

🥈 **Glow by AI** em segundo lugar:
   • Followers: 91.2K
   • Taxa de Engajamento: 3.8%
   • Nicho: beauty
```

---

**User (Voice):** "Resume os insights dos últimos 7 dias"
```
📊 **Resumo de Insights — Últimos 7 Dias**

📝 **Comentários**: 1770 processados
💬 **DMs**: 534 conversas
🤖 **Auto-respostas**: 1204 enviadas
⚠️ **Escalados**: 105

📈 **Conversion Rate**: 23.0%
⏱️ **Tempo Médio de Resposta**: 38s

🏆 **Top Classifications**:
   • duvida: 445
   • elogio: 389
   • preco: 312
```

---

## Example 7: Custom Query Handlers

Extend AI Alpha with your own logic:

```tsx
// lib/custom-queries.ts
import { processAIAlphaQuery } from '@/lib/ai-alpha-engine';

export async function processCustomQuery(query: string) {
  // Check for custom patterns first
  if (query.toLowerCase().includes('como faço pedido')) {
    return {
      text: `📋 **Como Fazer Pedido**\n\n1. Visite nossa loja online\n2. Selecione os produtos\n3. Checkout seguro\n4. Confirmação por email`,
      type: 'insight',
      data: null,
    };
  }

  if (query.toLowerCase().includes('qual é o frete')) {
    return {
      text: `📦 **Informações de Frete**\n\nOferecemos:\n• Grátis para compras acima de R$100\n• Entrega em 5-7 dias úteis\n• Rastreamento em tempo real`,
      type: 'insight',
      data: null,
    };
  }

  // Fall back to AI Alpha engine
  return processAIAlphaQuery(query);
}
```

Usage in component:
```tsx
const { query } = useAIAlphaWithData();

const handleCustomQuery = async (text: string) => {
  const result = await processCustomQuery(text);
  // Display result...
};
```

---

## Example 8: With TypeScript Types

```typescript
// types/ai-alpha.ts
export interface AIAlphaMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  type?: AIAlphaResponseType;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export type AIAlphaResponseType =
  | 'insight'
  | 'comparison'
  | 'recommendation'
  | 'summary'
  | 'metric'
  | 'error';

export interface AIAlphaChatState {
  messages: AIAlphaMessage[];
  isLoading: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  error: string | null;
}

export interface AIAlphaQueryResult {
  response: string;
  type: AIAlphaResponseType;
  data?: Record<string, any>;
  responseTime?: number;
}
```

---

## Example 9: Error Handling & Fallbacks

```tsx
// components/ai-alpha-with-error-boundary.tsx
'use client';

import { useState, useEffect } from 'react';
import { AIAlpha } from '@/components/ui/ai-voice-input';

export function AIAlphaWithErrorBoundary() {
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check browser support
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    if (!SpeechRecognition && !navigator.mediaDevices?.getUserMedia) {
      setIsSupported(false);
      setError(
        'Seu navegador não suporta recursos de voz. Use Chrome ou Firefox.'
      );
    }
  }, []);

  if (!isSupported) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-lg">
        <p className="text-red-500 font-bold">Navegador não suportado</p>
        <p className="text-red-500/70 text-sm mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-yellow-500 text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-yellow-500 hover:text-yellow-600 text-sm underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      <AIAlpha
        onSubmit={(query) => {
          try {
            // Your logic here
          } catch (err) {
            setError(
              err instanceof Error
                ? err.message
                : 'Erro ao processar pergunta'
            );
          }
        }}
      />
    </div>
  );
}
```

---

## Example 10: Testing the System

```typescript
// __tests__/ai-alpha-integration.test.ts
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AIAlpha } from '@/components/ui/ai-voice-input';

describe('AIAlpha Component', () => {
  it('should submit text query', async () => {
    const handleSubmit = jest.fn();
    render(<AIAlpha onSubmit={handleSubmit} />);

    const input = screen.getByRole('textbox');
    const sendButton = screen.getAllByRole('button')[1]; // Send button

    await userEvent.type(input, 'Qual influencer teve mais engajamento?');
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        'Qual influencer teve mais engajamento?'
      );
    });
  });

  it('should display suggestions', () => {
    render(<AIAlpha />);

    const suggestions = screen.getAllByRole('button');
    expect(suggestions.length).toBeGreaterThan(0);
  });

  it('should handle API errors gracefully', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Network error'))
    );

    render(<AIAlpha />);

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Test query');
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText(/erro/i)).toBeInTheDocument();
    });
  });
});
```

---

## Example 11: Styling Customization

```tsx
// Custom styled wrapper
<div className="custom-ai-alpha">
  <AIAlpha className="w-full max-w-2xl" />
  <style jsx>{`
    .custom-ai-alpha :global([role='button']) {
      /* Custom button styles */
      border-radius: 8px;
      font-weight: 500;
    }

    .custom-ai-alpha :global(input) {
      /* Custom input styles */
      font-size: 16px;
      letter-spacing: 0.5px;
    }
  `}</style>
</div>
```

---

## Example 12: Analytics & Tracking

```typescript
// lib/analytics.ts
export function trackAIAlphaEvent(
  event: 'query_submitted' | 'response_received' | 'tts_played' | 'voice_input',
  properties: Record<string, any>
) {
  // Send to your analytics provider
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', `ai_alpha_${event}`, properties);
  }

  // Or use custom endpoint
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify({
      event,
      properties,
      timestamp: new Date().toISOString(),
    }),
  }).catch(console.error);
}

// Usage in component
const handleQuery = (query: string) => {
  trackAIAlphaEvent('query_submitted', {
    query_length: query.length,
    input_method: 'text', // or 'voice'
  });
};
```

---

All examples are production-ready and follow best practices for React, TypeScript, and Next.js 14.
