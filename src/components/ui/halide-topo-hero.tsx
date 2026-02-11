'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Bot, Zap, MessageCircle, BarChart3, ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import { AIAlpha } from './ai-voice-input';
import { AgentMarquee } from './agent-marquee';

interface HalideTopoHeroProps {
  onConfigure: () => void;
  onDemo: () => void;
}

const FEATURES = [
  { icon: Bot, label: 'IA Classificadora', desc: 'GPT-4o-mini', color: '#833AB4' },
  { icon: Zap, label: 'Auto-Reply', desc: 'Regras + IA', color: '#E1306C' },
  { icon: MessageCircle, label: 'DM Flows', desc: 'Automacao', color: '#F77737' },
  { icon: BarChart3, label: 'CRM', desc: 'Prospects', color: '#6366f1' },
];

const TRUST_STATS = [
  { value: '1.2k+', label: 'Comentarios processados' },
  { value: '98.2%', label: 'Precisao IA' },
  { value: '2.1s', label: 'Tempo de resposta' },
  { value: '24/7', label: 'Monitoramento' },
];

const HalideTopoHero: React.FC<HalideTopoHeroProps> = ({ onConfigure, onDemo }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (window.innerWidth / 2 - e.pageX) / 30;
      const y = (window.innerHeight / 2 - e.pageY) / 30;
      canvas.style.transform = `rotateX(${55 + y / 2}deg) rotateZ(${-25 + x / 2}deg)`;
    };

    canvas.style.opacity = '0';
    canvas.style.transform = 'rotateX(90deg) rotateZ(0deg) scale(0.7)';

    const timeout = setTimeout(() => {
      canvas.style.transition = 'all 2.5s cubic-bezier(0.16, 1, 0.3, 1)';
      canvas.style.opacity = '1';
      canvas.style.transform = 'rotateX(55deg) rotateZ(-25deg) scale(1)';
      setEntered(true);
    }, 400);

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  const handleAIQuery = (query: string) => {
    console.log('[AI Alpha] Query:', query);
    // Will be wired to ElevenLabs + AI backend
  };

  return (
    <div className="relative w-full bg-[#050508] overflow-x-hidden">
      {/* ═══════════════════════════════════════════
          SECTION 1 — HERO VIEWPORT (above the fold)
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Ambient glow orbs */}
        <div className="absolute top-[-15%] right-[10%] w-[600px] h-[600px] rounded-full bg-[#833AB4]/[0.07] blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[5%] w-[500px] h-[500px] rounded-full bg-[#E1306C]/[0.06] blur-[130px] pointer-events-none" />
        <div className="absolute top-[30%] left-[40%] w-[400px] h-[400px] rounded-full bg-[#F77737]/[0.04] blur-[120px] pointer-events-none" />

        {/* SVG Grain Filter */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <filter id="hero-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </svg>
        <div className="hero-grain" style={{ filter: 'url(#hero-grain)' }} />

        {/* Interface Grid */}
        <div className="hero-interface-grid">
          {/* Top Bar */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </div>
            <div>
              <span className="text-[13px] font-bold tracking-wide text-white/90">IndustryOS</span>
              <span className="text-[13px] font-bold tracking-wide text-white/30"> 360</span>
            </div>
          </div>

          <div className="text-right font-mono text-[11px] text-white/25 self-center">
            <div>INSTAGRAM CRM</div>
            <div className="text-white/15">v1.0 &middot; AI POWERED</div>
          </div>

          {/* Hero Title */}
          <div className="hero-title-area">
            <div className={cn(
              'transition-all duration-[2000ms] ease-out',
              entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}>
              <h1 className="hero-title">
                <span className="hero-title-gradient">INSTAGRAM</span>
                <br />
                <span className="block text-white/[0.08] text-[clamp(1.2rem,3.5vw,3.5rem)] tracking-[0.1em] font-light mt-1">
                  AUTOMATION
                </span>
                <span className="hero-title-gradient">CRM</span>
              </h1>
              <p className="text-white/25 text-sm mt-6 max-w-md leading-relaxed tracking-wide">
                Automacao inteligente. Classificacao por IA.
                <br />
                DMs, comentarios e CRM em um so lugar.
              </p>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="hero-bottom-section">
            {/* Feature Cards */}
            <div className={cn(
              'flex gap-3 flex-wrap flex-1 transition-all duration-[1800ms] delay-700',
              entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            )}>
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.label} className="hero-feature-card group">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center mb-2"
                      style={{ backgroundColor: `${f.color}15` }}
                    >
                      <Icon size={16} style={{ color: f.color }} />
                    </div>
                    <div className="text-[11px] font-semibold text-white/70 group-hover:text-white/90 transition-colors">
                      {f.label}
                    </div>
                    <div className="text-[10px] text-white/25">{f.desc}</div>
                  </div>
                );
              })}
            </div>

            {/* CTAs */}
            <div className={cn(
              'flex gap-3 items-end flex-shrink-0 transition-all duration-[1800ms] delay-1000',
              entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            )} style={{ pointerEvents: 'auto' }}>
              <button
                onClick={onDemo}
                className="group px-6 py-3.5 rounded-xl text-[13px] font-semibold text-white/50 border border-white/[0.08] bg-white/[0.03] backdrop-blur-lg hover:bg-white/[0.06] hover:text-white/70 hover:border-white/[0.12] transition-all duration-300"
              >
                VER DEMO
              </button>
              <button
                onClick={onConfigure}
                className={cn(
                  'group flex items-center gap-2 px-6 py-3.5 rounded-xl text-[13px] font-bold text-white transition-all duration-300',
                  'bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737]',
                  'shadow-lg shadow-[#E1306C]/20 hover:shadow-[#E1306C]/35 hover:scale-[1.02] active:scale-[0.98]'
                )}
              >
                <Sparkles size={14} />
                CONFIGURAR
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 3D Viewport */}
        <div className="hero-viewport">
          <div className="hero-canvas-3d" ref={canvasRef}>
            <div className="hero-layer hero-layer-1" />
            <div className="hero-layer hero-layer-2">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-[-30px] rounded-[40px] bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] opacity-30 blur-[40px]" />
                  <div className="relative w-[180px] h-[180px] rounded-[40px] bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] p-[3px] shadow-2xl shadow-[#E1306C]/30">
                    <div className="w-full h-full rounded-[38px] bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] flex items-center justify-center">
                      <svg width="90" height="90" viewBox="0 0 24 24" fill="white" opacity="0.95">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-layer hero-layer-3" />
            <div className="hero-contours" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 animate-bounce-slow">
          <span className="text-[10px] text-white/20 uppercase tracking-widest">Conheca a IA</span>
          <ChevronDown size={16} className="text-white/20" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 2 — AI ALPHA (command center)
          ═══════════════════════════════════════════ */}
      <section className="relative py-24 px-4">
        {/* Background continuity */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-[#080810] to-[#050508]" />
        <div className="absolute top-[20%] left-[15%] w-[500px] h-[500px] rounded-full bg-[#833AB4]/[0.04] blur-[200px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-[#E1306C]/[0.03] blur-[180px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Section intro */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="hero-title-gradient">Pergunte qualquer coisa.</span>
            </h2>
            <p className="text-sm text-white/30 max-w-lg mx-auto leading-relaxed">
              O AI Alpha analisa seus dados, influencers, campanhas e metricas em tempo real.
              Pergunte por texto ou voz — ele responde com insights mastigados.
            </p>
          </div>

          {/* AI Alpha Input */}
          <AIAlpha onSubmit={handleAIQuery} />

          {/* Trust stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {TRUST_STATS.map((stat) => (
              <div
                key={stat.label}
                className="relative rounded-xl p-4 bg-white/[0.02] border border-white/[0.04] backdrop-blur-sm text-center group hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300"
              >
                <div className="text-xl font-bold hero-title-gradient">{stat.value}</div>
                <div className="text-[10px] text-white/25 mt-1 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 3 — AGENT MARQUEE
          ═══════════════════════════════════════════ */}
      <AgentMarquee />

      {/* ═══════════════════════════════════════════
          SECTION 4 — FINAL CTA
          ═══════════════════════════════════════════ */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050508] to-[#080810]" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#E1306C]/[0.05] blur-[200px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para <span className="hero-title-gradient">automatizar</span>?
          </h2>
          <p className="text-sm text-white/30 mb-10 max-w-md mx-auto">
            Configure em 5 minutos. Conecte sua conta Instagram e deixe a IA cuidar do resto.
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={onDemo}
              className="group px-8 py-4 rounded-xl text-[13px] font-semibold text-white/50 border border-white/[0.08] bg-white/[0.03] backdrop-blur-lg hover:bg-white/[0.06] hover:text-white/70 hover:border-white/[0.12] transition-all duration-300"
            >
              VER DEMO
            </button>
            <button
              onClick={onConfigure}
              className={cn(
                'group flex items-center gap-2 px-8 py-4 rounded-xl text-[13px] font-bold text-white transition-all duration-300',
                'bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737]',
                'shadow-lg shadow-[#E1306C]/20 hover:shadow-[#E1306C]/35 hover:scale-[1.02] active:scale-[0.98]'
              )}
            >
              <Sparkles size={14} />
              COMECAR AGORA
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HalideTopoHero;
