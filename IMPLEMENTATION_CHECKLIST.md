# AI Alpha Implementation Checklist

## Quick Start (5 minutes)

### Step 1: Set Environment Variable
```bash
# Add to .env.local
ELEVENLABS_API_KEY=sk_your_api_key_here
```

Get your free API key: https://elevenlabs.io/app/api-keys

### Step 2: Verify Files Are in Place

```bash
# Check all files exist
ls -la src/lib/ai-alpha-engine.ts
ls -la src/app/api/ai-alpha/chat/route.ts
ls -la src/app/api/ai-alpha/tts/route.ts
ls -la src/app/api/ai-alpha/stt/route.ts
ls -la src/components/ui/ai-voice-input.tsx
```

Expected: All 5 files should exist with content

### Step 3: Import Component in Your Page

```tsx
// app/page.tsx or any page where you want AI Alpha
'use client';

import { AIAlpha } from '@/components/ui/ai-voice-input';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black p-8">
      <h1 className="text-white text-3xl mb-12 text-center">AI Alpha Dashboard</h1>
      <AIAlpha className="mb-8" />
    </div>
  );
}
```

### Step 4: Start Development Server

```bash
npm run dev
# App opens at http://localhost:3000
```

### Step 5: Test the System

1. **Text Input Test**
   - Type: "Qual influencer teve mais engajamento?"
   - Click Send or press Enter
   - Should see response in chat

2. **Voice Input Test**
   - Click mic button
   - Speak: "Melhor horário pra postar?"
   - Should transcribe and auto-submit

3. **TTS Playback Test**
   - After AI response appears
   - Should auto-play audio (if microphone allowed)
   - Click Volume2 icon to mute

---

## Detailed Integration Guide

### For Dashboard Page

```tsx
// app/page.tsx
'use client';

import { useState } from 'react';
import { AIAlpha } from '@/components/ui/ai-voice-input';

export default function DashboardPage() {
  const [lastQuery, setLastQuery] = useState('');

  const handleAISubmit = (query: string) => {
    console.log('New AI query:', query);
    setLastQuery(query);

    // Optional: Track analytics
    // analytics.track('ai_alpha_query', { query });

    // Optional: Trigger dashboard updates
    // refreshDashboardData(query);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-white/10 p-6">
        <h1 className="text-white text-2xl font-bold">Dashboard CRM</h1>
        <p className="text-white/50 text-sm">Powered by AI Alpha</p>
      </div>

      {/* AI Alpha Section */}
      <div className="p-8">
        <div className="mb-6">
          <p className="text-white/70 text-sm mb-4">
            Faça perguntas sobre seus dados, influenciadores e campanhas.
          </p>
        </div>

        <AIAlpha onSubmit={handleAISubmit} />
      </div>

      {/* Display last query (optional) */}
      {lastQuery && (
        <div className="p-8 border-t border-white/10">
          <p className="text-white/50 text-xs">Última pergunta:</p>
          <p className="text-white text-sm">{lastQuery}</p>
        </div>
      )}
    </div>
  );
}
```

### For Modal/Dialog

```tsx
// components/ai-alpha-modal.tsx
'use client';

import { AIAlpha } from '@/components/ui/ai-voice-input';

interface AIAlphaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIAlphaModal({ isOpen, onClose }: AIAlphaModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 max-w-2xl w-full">
        <div className="mb-6">
          <h2 className="text-white text-xl font-bold">AI Alpha</h2>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white/70 ml-auto"
          >
            ✕
          </button>
        </div>

        <AIAlpha onSubmit={() => {}} />
      </div>
    </div>
  );
}
```

### For Sidebar Integration

```tsx
// components/sidebar-ai.tsx
'use client';

import { useState } from 'react';
import { AIAlpha } from '@/components/ui/ai-voice-input';

export function SidebarAI() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-80 bg-white/[0.02] border-l border-white/10 p-4">
      {isExpanded ? (
        <>
          <div className="mb-4">
            <button
              onClick={() => setIsExpanded(false)}
              className="text-white/50 hover:text-white/70"
            >
              ← Collapse
            </button>
          </div>
          <AIAlpha />
        </>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full py-2 px-4 bg-[#E1306C]/20 text-[#E1306C] rounded-lg hover:bg-[#E1306C]/30"
        >
          Abrir AI Alpha
        </button>
      )}
    </div>
  );
}
```

---

## Testing Checklist

### Unit Tests

```typescript
// __tests__/ai-alpha-engine.test.ts
import { processAIAlphaQuery } from '@/lib/ai-alpha-engine';

describe('AI Alpha Engine', () => {
  it('should handle influencer comparison', () => {
    const result = processAIAlphaQuery(
      'Qual influencer teve mais engajamento?'
    );
    expect(result.type).toBe('comparison');
    expect(result.data.influencers).toBeDefined();
  });

  it('should detect best posting time', () => {
    const result = processAIAlphaQuery('Melhor horário pra postar?');
    expect(result.type).toBe('insight');
    expect(result.data.bestHour).toBeDefined();
  });

  it('should fallback to general summary', () => {
    const result = processAIAlphaQuery('random query');
    expect(result.type).toBe('summary');
  });
});
```

### API Tests

```bash
# Test Chat API
curl -X POST http://localhost:3000/api/ai-alpha/chat \
  -H "Content-Type: application/json" \
  -d '{"query":"Qual influencer teve mais engajamento?"}'

# Test TTS API (should return audio/mpeg)
curl -X POST http://localhost:3000/api/ai-alpha/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Teste de audio"}' \
  -o audio.mp3
```

### Manual Testing Scenarios

- [ ] Type query and press Enter
- [ ] Type query and click Send button
- [ ] Click suggestion button
- [ ] Click mic and speak
- [ ] Verify voice bars animate while listening
- [ ] Verify audio plays after response
- [ ] Click volume button to mute
- [ ] Test without ELEVENLABS_API_KEY set
- [ ] Test in different browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test with slow network (DevTools throttling)

---

## Customization Guide

### Change Voice

Edit `/src/app/api/ai-alpha/tts/route.ts`:

```typescript
// Find this line
const ELEVENLABS_VOICE_ID = 'JBFqnCBsd6RMkjVDRZzb';

// Replace with your voice ID from:
// https://elevenlabs.io/voice-lab
const ELEVENLABS_VOICE_ID = 'YOUR_NEW_VOICE_ID';
```

Available voices: https://elevenlabs.io/voice-lab

### Change Colors

Edit `/src/components/ui/ai-voice-input.tsx`:

```tsx
// Find these color definitions
'bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737]'
// Replace hex codes with your colors

// Examples:
// 'bg-gradient-to-r from-[#3b82f6] via-[#8b5cf6] to-[#ec4899]'
// 'bg-gradient-to-r from-[#06b6d4] via-[#10b981] to-[#f59e0b]'
```

### Change Language

Edit `/src/components/ui/ai-voice-input.tsx`:

```typescript
// Find this line
recognitionRef.current.lang = 'pt-BR';

// Change to:
recognitionRef.current.lang = 'en-US';      // English
recognitionRef.current.lang = 'es-ES';      // Spanish
recognitionRef.current.lang = 'it-IT';      // Italian
recognitionRef.current.lang = 'fr-FR';      // French
```

And update `/src/app/api/ai-alpha/tts/route.ts`:

```typescript
body: JSON.stringify({
  text,
  model_id: 'eleven_multilingual_v2',  // Supports multilingual
  voice_settings: { ... }
})
```

### Add Custom Query Handlers

Edit `/src/lib/ai-alpha-engine.ts`:

```typescript
// Add new intent pattern in detectIntent()
'my_custom_intent': [
  'keyword1', 'keyword2', 'keyword3'
]

// Add new handler function
function handleMyCustomIntent(query: string): AIAlphaResponse {
  return {
    text: 'Custom response',
    type: 'insight',
    data: { /* custom data */ }
  };
}

// Add case in processAIAlphaQuery()
case 'my_custom_intent':
  return handleMyCustomIntent(query);
```

---

## Deployment Checklist

### Before Production

- [ ] Set ELEVENLABS_API_KEY in production .env
- [ ] Test all voice recognition in target browsers
- [ ] Verify TTS latency is acceptable
- [ ] Enable CORS if needed
- [ ] Set up rate limiting on API routes
- [ ] Monitor API usage and costs
- [ ] Test error states thoroughly
- [ ] Add analytics tracking
- [ ] Security audit API endpoints

### Environment Variables

```bash
# Production (.env.production)
ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxx

# Staging (.env.staging)
ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxx

# Development (.env.local)
ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxx
```

### Rate Limiting (Optional)

Add to `/src/app/api/ai-alpha/chat/route.ts`:

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 requests per hour
});

export async function POST(request: NextRequest) {
  const ip = request.ip || 'anonymous';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }
  // ... rest of handler
}
```

---

## Troubleshooting Guide

### Issue: "TTS failed: 503"

**Solution:**
- Check ELEVENLABS_API_KEY is set in .env.local
- Restart dev server after setting env var
- Verify API key is valid: https://elevenlabs.io/app/api-keys

### Issue: Voice input not working

**Solution:**
- Check browser microphone permissions
- Reload page to reinitialize Web Speech API
- Try different browser (Chrome/Firefox recommended)
- Check browser console for errors

### Issue: Slow TTS playback

**Solution:**
- Check network latency (DevTools Network tab)
- ElevenLabs may be under load, try again
- Consider caching responses for common queries
- Monitor your API quota: https://elevenlabs.io/app/billing

### Issue: Component not updating after response

**Solution:**
- Clear browser cache
- Check React DevTools for component state
- Verify fetch response is JSON
- Check console for error messages

### Issue: Portuguese text not recognized properly

**Solution:**
- Speak clearly and slowly
- Remove background noise
- Try different accent/dialect
- Switch to text input if voice doesn't work
- Consider server-side STT alternative

---

## Monitoring & Analytics

### Recommended Metrics to Track

```typescript
// Track successful queries
analytics.track('ai_alpha_query_success', {
  intent_type: result.type,
  response_time_ms: Date.now() - startTime,
  text_length: query.length,
});

// Track TTS usage
analytics.track('ai_alpha_tts_play', {
  text_length: responseText.length,
  voice_id: 'JBFqnCBsd6RMkjVDRZzb',
});

// Track voice input usage
analytics.track('ai_alpha_voice_input', {
  duration_ms: recordingDuration,
  transcription_length: transcribedText.length,
});

// Track errors
analytics.track('ai_alpha_error', {
  error_type: errorType,
  component: 'chat' | 'tts' | 'voice',
});
```

### ElevenLabs Dashboard

Monitor your usage: https://elevenlabs.io/app/usage

- Characters processed
- API calls made
- Cost breakdown
- Voice usage statistics

---

## Performance Tips

1. **Cache Common Responses**
   - Cache influencer rankings
   - Cache posting time analysis
   - Set 1-hour TTL

2. **Optimize TTS**
   - Reduce response text length
   - Use shorter voice IDs
   - Enable audio compression

3. **Lazy Load Component**
   - Load AIAlpha only when needed
   - Use React.lazy() for code splitting

4. **Reduce Bundle Size**
   - Web Speech API is native (no extra code)
   - No external voice library needed
   - Minimal dependencies

---

## Support & Resources

- **ElevenLabs Docs:** https://elevenlabs.io/docs
- **Web Speech API:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs

---

## Success Criteria

Your implementation is complete when:

- ✅ Component renders without errors
- ✅ Text input works (Enter to submit)
- ✅ Voice input works (click mic, speak, auto-submit)
- ✅ AI responses appear in chat
- ✅ Audio plays automatically (or on click)
- ✅ Volume button mutes/unmutes
- ✅ Works without API key (graceful fallback)
- ✅ Tested in Chrome, Firefox, Safari
- ✅ Error messages are helpful
- ✅ Performance is acceptable (<500ms response time)

Done! 🚀
