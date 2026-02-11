# AI Alpha Voice Conversation System

Complete ElevenLabs voice conversation system for the Instagram CRM Dashboard.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    AI Alpha System                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Frontend (Client)              Backend (Next.js)           │
│  ┌──────────────────┐           ┌─────────────────────┐    │
│  │ AIAlpha          │           │ /api/ai-alpha/chat  │    │
│  │ Component        │◄──────────►│                     │    │
│  │ (ai-voice-input) │           │ → Query Processing  │    │
│  └──────────────────┘           └─────────────────────┘    │
│         │                                                   │
│    Voice Input ├──────┬──────────┐                         │
│   (Web Speech)        │          │                         │
│                       │          │                         │
│                ┌──────▼──────┐ ┌─▼──────────────┐        │
│                │ TTS Playback │ │ AI Alpha       │        │
│                │              │ │ Engine         │        │
│                │ /api/ai-alpha/│ │                │        │
│                │ tts           │ │ Pattern        │        │
│                │ (ElevenLabs)  │ │ Matching       │        │
│                │              │ │ Logic          │        │
│                └──────────────┘ └────────────────┘        │
│                                   │                        │
│                                   ▼                        │
│                              Mock Data                     │
│                              - Accounts                    │
│                              - Influencers                 │
│                              - Posts                       │
│                              - Metrics                     │
└─────────────────────────────────────────────────────────────┘
```

## Components & Files

### 1. AI Alpha Engine (`src/lib/ai-alpha-engine.ts`)

Pure logic-based query processor that analyzes mock data without LLM calls.

**Key Features:**
- Intent detection from Portuguese queries
- Pattern-matching based on keywords
- Data aggregation and formatting
- 7 intent types supported

**Query Intent Patterns:**

| Intent | Keywords | Example |
|--------|----------|---------|
| `influencer_comparison` | compare, versus, vs, qual influencer | "Compare @luna_tech vs @glow_by_ai" |
| `best_posting_time` | melhor horario, quando postar | "Melhor horário pra postar?" |
| `campaign_recommendation` | campanha, black friday, ideal para | "Quem seria ideal pra Black Friday?" |
| `weekly_summary` | resume, ultimos 7 dias, insights | "Resume os insights dos últimos 7 dias" |
| `top_posts` | qual post, mais salvamentos, alcance | "Qual post teve mais salvamentos?" |
| `account_metrics` | contas, total, processados | "Quanto foi processado?" |
| `automation_rules` | regras, automacao, como funciona | "Quais são as regras ativas?" |

**Response Structure:**
```typescript
interface AIAlphaResponse {
  text: string;                          // Formatted response in Portuguese
  type: 'insight' | 'comparison' | 'recommendation' | 'summary' | 'metric';
  data?: Record<string, any>;            // Raw data for debugging/analytics
}
```

**Data Sources:**
- `DEMO_METRICS` - Overall platform metrics
- `DEMO_ACCOUNTS` - Connected Instagram accounts
- `DEMO_INFLUENCERS` - AI-generated influencer profiles
- `DEMO_POSTS` - Feed posts with engagement metrics
- `DEMO_RULES` - Active automation rules
- `DEMO_FLOWS` - DM automation flows

### 2. Chat API Route (`src/app/api/ai-alpha/chat/route.ts`)

POST endpoint that processes queries and returns AI Alpha responses.

**Endpoint:** `POST /api/ai-alpha/chat`

**Request Body:**
```json
{
  "query": "Qual influencer teve mais engajamento?"
}
```

**Response:**
```json
{
  "response": "📊 **Comparação de Influenciadores**\n\n🥇 **Luna Tech** lidera...",
  "type": "comparison",
  "data": {
    "influencers": [...],
    "engagement_rates": [...]
  }
}
```

**Error Handling:**
- Returns 400 if query is missing
- Returns 500 on internal server error
- All errors logged to console

### 3. TTS API Route (`src/app/api/ai-alpha/tts/route.ts`)

POST endpoint that converts text to speech using ElevenLabs API.

**Endpoint:** `POST /api/ai-alpha/tts`

**Request Body:**
```json
{
  "text": "Qual influencer teve mais engajamento?"
}
```

**Configuration:**
- **Voice ID:** `JBFqnCBsd6RMkjVDRZzb` (Portuguese-optimized)
- **Model:** `eleven_multilingual_v2`
- **Stability:** 0.5 (balanced)
- **Similarity Boost:** 0.75 (higher quality voice)

**Response:**
- `Content-Type: audio/mpeg`
- Returns audio stream (binary)

**Graceful Degradation:**
- Returns 503 if `ELEVENLABS_API_KEY` not set
- Client silently skips TTS if unavailable
- No breaking errors

### 4. STT API Route (`src/app/api/ai-alpha/stt/route.ts`)

Placeholder endpoint for future server-side speech recognition.

**Current Implementation:**
- Uses browser's native Web Speech API (WebkitSpeechRecognition)
- Set to Portuguese (pt-BR)
- Auto-submits query on final result

**Endpoint:** `POST /api/ai-alpha/stt`

**Response:**
```json
{
  "supported": true,
  "method": "browser_native_webspeechapi",
  "language": "pt-BR"
}
```

### 5. AIAlpha Component (`src/components/ui/ai-voice-input.tsx`)

Full conversational interface with voice, text, and audio playback.

**Features:**
- Voice input (Web Speech API)
- Text input with animated suggestions
- Message history display
- Auto-play TTS responses
- Audio control (mute/unmute)
- Loading states with spinners
- Graceful fallbacks

**Props:**
```typescript
interface AIAlphaProps {
  className?: string;           // Optional CSS classes
  onSubmit?: (query: string) => void;  // Callback when query submitted
}
```

**User Flow:**

1. **Voice Input**
   - Click mic button → "Listening..." state with animated bars
   - Speak in Portuguese
   - Web Speech API transcribes automatically
   - Text appears in input
   - Auto-submits on final result

2. **Text Input**
   - Type query in input
   - Press Enter or click Send
   - Input clears
   - Shows "Processando..." spinner

3. **AI Response**
   - Response displays in glass panel
   - Auto-plays TTS audio
   - Volume button appears
   - Can mute/unmute audio
   - Message history preserved

4. **Quick Suggestions**
   - 3 cycling suggestions in placeholder
   - Click to fill input
   - Only shown when no messages

**Styling:**

All colors follow Instagram theme:
- **Primary:** `#833AB4` (Purple)
- **Secondary:** `#E1306C` (Pink)
- **Accent:** `#F77737` (Orange)

Dark theme with glass-morphism effects:
- Background: `bg-white/[0.03-0.05]`
- Borders: `border-white/[0.06-0.08]`
- Text: `text-white/90`
- Backdrop blur: `backdrop-blur-xl`

**Key Behaviors:**

| State | Button | Input | Behavior |
|-------|--------|-------|----------|
| Idle | Mic icon | Placeholder cycles | Ready for input |
| Listening | Animated bars | Shows interim text | Web Speech active |
| Loading | Spinner | Disabled | Processing query |
| Speaking | Volume2 icon | Input active | TTS playing |

## Environment Setup

### Required

Add to `.env.local`:
```env
ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxx
```

Get your API key from https://elevenlabs.io/app/api-keys

### Optional

If API key is missing:
- TTS gracefully fails
- Component still works for text-only
- No console errors
- Voice icon still functional

## Usage Examples

### Basic Integration

```tsx
import { AIAlpha } from '@/components/ui/ai-voice-input';

export default function Dashboard() {
  return (
    <div className="p-8">
      <AIAlpha
        onSubmit={(query) => {
          console.log('User asked:', query);
        }}
      />
    </div>
  );
}
```

### With Analytics

```tsx
const handleSubmit = (query: string) => {
  analytics.track('ai_alpha_query', {
    query,
    timestamp: new Date().toISOString(),
  });
};

<AIAlpha onSubmit={handleSubmit} />;
```

## Query Examples

### Influencer Analysis

```
Input: "Qual influencer teve mais engajamento?"
Output: Ranking by engagement rate with follower counts and niches
```

### Posting Strategy

```
Input: "Melhor horário pra postar?"
Output: Analysis of DEMO_POSTS publishedAt distribution, recommended hour
```

### Campaign Planning

```
Input: "Quem seria ideal pra Black Friday?"
Output: Top 3 influencer recommendations with fit analysis
```

### Weekly Review

```
Input: "Resume os insights dos ultimos 7 dias"
Output: Summary of metrics, classifications, conversion rates
```

### Post Performance

```
Input: "Qual post teve mais salvamentos?"
Output: Top post with all metrics and hashtags
```

### Account Overview

```
Input: "Quanto foi processado?"
Output: Connected accounts with total comments, DMs, auto-replies
```

## Error Handling

### Network Errors
- Chat API: Returns 500 with error message
- TTS API: Returns 503 if API key missing
- Client silently catches and logs errors

### Input Validation
- Empty query: Shows placeholder
- Whitespace-only: Treated as empty
- Non-string: Rejected at API level

### Audio Playback
- If TTS fails: No error shown, component continues
- If audio element unavailable: Graceful fallback
- Browser autoplay restrictions: User can click to play

## Performance Considerations

### Query Processing
- Intent detection: O(n) keyword matching
- Data aggregation: Filters DEMO_* at request time
- No caching (intentionally simple for demo)

### TTS Streaming
- Audio returned as binary stream
- Blob created in browser
- URL revoked after playback
- Memory efficient

### Component Rendering
- Messages rendered incrementally
- 400px max height with scroll
- Suggestions hidden after first message
- Minimal re-renders with useCallback

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Web Speech API | ✅ | ✅ | ⚠️ (webkit) | ✅ |
| Web Audio API | ✅ | ✅ | ✅ | ✅ |
| Blob URLs | ✅ | ✅ | ✅ | ✅ |
| Fetch API | ✅ | ✅ | ✅ | ✅ |

**Notes:**
- Safari: Uses `webkitSpeechRecognition`, limited support
- Firefox: Full support
- Older browsers: Fallback to text-only input

## Future Enhancements

1. **Server-side STT Integration**
   - Replace Web Speech API with Whisper/ElevenLabs STT
   - Better accuracy for Portuguese
   - Offline fallback option

2. **Conversation Context**
   - Store message history in database
   - Follow-up question handling
   - Persistent context per user

3. **Advanced Query Types**
   - Trend detection ("Qual é a tendência?")
   - Predictive recommendations
   - Comparative analysis across time periods

4. **Multiple Languages**
   - Auto-detect language
   - Support for Spanish, Italian, French
   - Language-specific voice selection

5. **Analytics & Logging**
   - Query success rates
   - Average response latency
   - User engagement metrics
   - Most common query types

## Troubleshooting

### TTS Not Playing

1. Check `ELEVENLABS_API_KEY` is set
2. Check browser console for network errors
3. Check browser autoplay permissions
4. Try clicking volume button to manually start

### Voice Input Not Working

1. Check browser permission for microphone
2. Reload page to reinitialize Web Speech API
3. Check browser console for errors
4. Try different browser (Firefox/Chrome recommended)

### Slow Responses

1. Check network latency to `/api/ai-alpha/chat`
2. Verify mock data generation isn't slow
3. Check browser DevTools Performance tab
4. TTS latency depends on ElevenLabs API

### Styling Issues

1. Ensure Tailwind CSS is configured
2. Check `cn()` utility from `@/lib/utils`
3. Verify dark theme classes are present
4. Clear browser cache if styles not updating

## File Structure

```
src/
├── lib/
│   ├── ai-alpha-engine.ts         # Core query processor
│   ├── mock-data.ts               # Demo data (existing)
│   └── utils.ts                   # cn() utility (existing)
├── app/
│   └── api/
│       └── ai-alpha/
│           ├── chat/
│           │   └── route.ts       # Chat endpoint
│           ├── tts/
│           │   └── route.ts       # Text-to-speech endpoint
│           └── stt/
│               └── route.ts       # Speech-to-text placeholder
└── components/
    └── ui/
        └── ai-voice-input.tsx     # Main component (rewritten)
```

## License & Credits

- **ElevenLabs API** - Text-to-speech service
- **Web Speech API** - Browser native speech recognition
- **Tailwind CSS** - Styling framework
- **Next.js 14** - React framework with App Router

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review component props and usage
3. Check browser console for errors
4. Verify environment variables
5. Test in different browser
