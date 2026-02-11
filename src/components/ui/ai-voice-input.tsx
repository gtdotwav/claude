'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Mic, Send, Sparkles, ArrowRight, Volume2, VolumeX, Loader2 } from 'lucide-react';

interface AIAlphaProps {
  className?: string;
  onSubmit?: (query: string) => void;
}

const SUGGESTIONS = [
  'Qual influencer teve mais engajamento essa semana?',
  'Melhor horario pra postar stories?',
  'Quem seria ideal pra campanha de Black Friday?',
  'Resume os insights dos ultimos 7 dias',
  'Qual post teve mais salvamentos no mes?',
  'Compare @luna_tech vs @glow_by_ai em alcance',
];

// Typing animation for responses
function useTypewriterEffect(text: string, speed = 30) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    setDisplayedText('');

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return displayedText;
}

export function AIAlpha({ className, onSubmit }: AIAlphaProps) {
  const [query, setQuery] = useState('');
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; content: string; type?: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Audio playback
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Typewriter effect for placeholder suggestions
  useEffect(() => {
    let charIndex = 0;
    let timeout: ReturnType<typeof setTimeout>;
    const text = SUGGESTIONS[currentSuggestion];

    setIsTyping(true);
    setDisplayText('');

    const typeChar = () => {
      if (charIndex <= text.length) {
        setDisplayText(text.slice(0, charIndex));
        charIndex++;
        timeout = setTimeout(typeChar, 35 + Math.random() * 25);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
          setTimeout(() => {
            setCurrentSuggestion((prev) => (prev + 1) % SUGGESTIONS.length);
          }, 800);
        }, 2500);
      }
    };

    timeout = setTimeout(typeChar, 600);
    return () => clearTimeout(timeout);
  }, [currentSuggestion]);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'pt-BR';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setQuery(transcript);
          } else {
            interimTranscript += transcript;
          }
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const toggleVoiceInput = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const playAudio = useCallback(async (text: string) => {
    try {
      setIsSpeaking(true);

      const response = await fetch('/api/ai-alpha/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        console.warn('TTS failed:', response.status);
        setIsSpeaking(false);
        return;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };
        audioRef.current.play().catch((e) => {
          console.warn('Audio playback failed:', e);
          setIsSpeaking(false);
        });
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      setIsSpeaking(false);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (query.trim()) {
      const userQuery = query.trim();
      setQuery('');

      // Add user message
      setMessages((prev) => [...prev, { role: 'user', content: userQuery }]);
      setIsLoading(true);

      try {
        // Call chat API
        const response = await fetch('/api/ai-alpha/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: userQuery }),
        });

        if (!response.ok) {
          throw new Error('Chat API error');
        }

        const data = await response.json();
        const aiResponse = data.response || 'Não consegui processar essa pergunta.';
        const responseType = data.type || 'insight';

        // Add AI message
        setMessages((prev) => [
          ...prev,
          { role: 'ai', content: aiResponse, type: responseType },
        ]);

        // Auto-play TTS
        playAudio(aiResponse);

        // Call onSubmit callback
        onSubmit?.(userQuery);
      } catch (error) {
        console.error('Chat error:', error);
        setMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            content: '❌ Erro ao processar sua pergunta. Tente novamente.',
            type: 'error',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  }, [query, playAudio, onSubmit]);

  const toggleAudio = useCallback(() => {
    if (audioRef.current) {
      if (isSpeaking) {
        audioRef.current.pause();
        setIsSpeaking(false);
      } else if (audioRef.current.src) {
        audioRef.current.play();
        setIsSpeaking(true);
      }
    }
  }, [isSpeaking]);

  return (
    <div className={cn('relative w-full max-w-3xl mx-auto', className)} style={{ pointerEvents: 'auto' }}>
      {/* Audio element for playback */}
      <audio ref={audioRef} />

      {/* Messages container */}
      <div className="mb-6 space-y-4 max-h-[400px] overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div
              className={cn(
                'max-w-[70%] rounded-2xl p-4 text-sm leading-relaxed',
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-[#833AB4] to-[#E1306C] text-white'
                  : 'bg-white/[0.05] border border-white/[0.08] text-white/90 backdrop-blur-xl'
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/[0.05] border border-white/[0.08] text-white/70 rounded-2xl p-4 backdrop-blur-xl flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm">Processando...</span>
            </div>
          </div>
        )}
      </div>

      {/* Glow behind input */}
      <div className="absolute inset-0 -inset-x-8 -inset-y-4 rounded-3xl bg-gradient-to-r from-[#833AB4]/[0.06] via-[#E1306C]/[0.04] to-[#F77737]/[0.06] blur-xl" />

      {/* Main container */}
      <div className="relative">
        {/* Label */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
            <Sparkles size={10} className="text-[#E1306C]" />
            <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">
              AI Alpha — Voice Enabled
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* Input area */}
        <div
          className={cn(
            'relative flex items-center gap-3 rounded-2xl p-1.5',
            'bg-white/[0.04] border border-white/[0.08]',
            'backdrop-blur-xl',
            'focus-within:border-[#E1306C]/30 focus-within:bg-white/[0.05]',
            'transition-all duration-300',
            'shadow-lg shadow-black/20'
          )}
        >
          {/* Voice button */}
          <button
            onClick={toggleVoiceInput}
            disabled={isLoading}
            className={cn(
              'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300',
              isListening
                ? 'bg-[#E1306C]/20 text-[#E1306C]'
                : 'bg-white/[0.04] text-white/25 hover:text-white/40 hover:bg-white/[0.06]',
              isLoading && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isListening ? (
              <div className="flex items-center gap-[2px] h-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-[2px] rounded-full bg-[#E1306C]"
                    style={{
                      animation: `voiceBar 0.6s ease-in-out ${i * 0.1}s infinite alternate`,
                    }}
                  />
                ))}
              </div>
            ) : (
              <Mic size={16} />
            )}
          </button>

          {/* Text input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSubmit()}
              placeholder=""
              disabled={isLoading}
              className={cn(
                'w-full bg-transparent text-[14px] text-white/90 placeholder-transparent outline-none py-2.5 pr-2',
                isLoading && 'opacity-50 cursor-not-allowed'
              )}
            />
            {/* Animated placeholder */}
            {!query && (
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                <span className="text-[14px] text-white/20">
                  {displayText}
                  {isTyping && (
                    <span className="inline-block w-[2px] h-[14px] bg-[#E1306C]/50 ml-0.5 align-middle animate-pulse" />
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Audio control button */}
          {isSpeaking && (
            <button
              onClick={toggleAudio}
              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 bg-[#F77737]/20 text-[#F77737] hover:bg-[#F77737]/30"
              title={isSpeaking ? 'Mute' : 'Unmute'}
            >
              {isSpeaking ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
          )}

          {/* Send button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading || !query.trim()}
            className={cn(
              'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300',
              query.trim() && !isLoading
                ? 'bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] text-white shadow-md shadow-[#E1306C]/20'
                : 'bg-white/[0.04] text-white/15',
              isLoading && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : query.trim() ? <ArrowRight size={16} /> : <Send size={14} />}
          </button>
        </div>

        {/* Quick suggestions (only show when no messages) */}
        {messages.length === 0 && (
          <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
            {SUGGESTIONS.slice(0, 3).map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                disabled={isLoading}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-[10px] text-white/25 bg-white/[0.02] border border-white/[0.04]',
                  'hover:bg-white/[0.04] hover:text-white/40 hover:border-white/[0.08] transition-all',
                  isLoading && 'opacity-50 cursor-not-allowed'
                )}
              >
                {s.length > 35 ? s.slice(0, 35) + '...' : s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CSS animation for voice bars */}
      <style>{`
        @keyframes voiceBar {
          0% { height: 0.25rem; }
          100% { height: 1rem; }
        }
      `}</style>
    </div>
  );
}
