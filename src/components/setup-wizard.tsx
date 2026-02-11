'use client';

import { useState } from 'react';
import { InfoCard } from './ui';
import { cn } from '@/lib/utils';
import {
  Instagram,
  MessageCircle,
  Inbox,
  BarChart3,
  Bot,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Shield,
  Zap,
  Eye,
} from '@/components/icons';

export interface AppConfig {
  apiUrl: string;
  metaAppId: string;
  metaAppSecret: string;
  openaiKey: string;
  webhookToken: string;
  mode?: string;
}

interface SetupWizardProps {
  onComplete: (config: AppConfig) => void;
  onSkipDemo: () => void;
}

const FEATURES = [
  {
    icon: MessageCircle,
    label: 'Auto-Reply Comentarios',
    desc: 'IA classifica e responde comentarios automaticamente',
    color: '#E1306C',
  },
  {
    icon: Inbox,
    label: 'Automacao de DMs',
    desc: 'Fluxos conversacionais inteligentes via Direct',
    color: '#833AB4',
  },
  {
    icon: BarChart3,
    label: 'CRM Integrado',
    desc: 'Prospects, funil de vendas e metricas em tempo real',
    color: '#F77737',
  },
  {
    icon: Bot,
    label: 'IA GPT-4o-mini',
    desc: 'Classificacao de sentimento e respostas personalizadas',
    color: '#6366f1',
  },
];

const PERMISSIONS = [
  { icon: Eye, label: 'Ver perfil e posts' },
  { icon: MessageCircle, label: 'Ler e responder comentarios' },
  { icon: Inbox, label: 'Gerenciar mensagens Direct' },
  { icon: BarChart3, label: 'Acessar metricas da conta' },
];

export default function SetupWizard({ onComplete, onSkipDemo }: SetupWizardProps) {
  const [step, setStep] = useState(0);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [igUsername, setIgUsername] = useState('');
  const [error, setError] = useState('');

  const handleInstagramLogin = () => {
    setConnecting(true);
    setError('');

    // Opens OAuth flow — backend handles Meta credentials
    const popup = window.open(
      '/api/auth/instagram',
      'instagram-auth',
      'width=500,height=700,scrollbars=yes'
    );

    let resolved = false;

    // Listen for postMessage from the callback page
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (resolved) return;

      if (event.data?.type === 'instagram-auth-success') {
        resolved = true;
        setIgUsername(event.data.username || '@minha_conta');
        setConnected(true);
        setConnecting(false);
        cleanup();
      }
      if (event.data?.type === 'instagram-auth-error') {
        resolved = true;
        setError(event.data.message || 'Erro na autenticacao. Tente novamente.');
        setConnecting(false);
        cleanup();
      }
    };

    window.addEventListener('message', handleMessage);

    // Detect popup closed without completing auth
    const checkClosed = setInterval(() => {
      if (popup?.closed && !resolved) {
        resolved = true;
        setConnecting(false);
        cleanup();
      }
    }, 500);

    function cleanup() {
      window.removeEventListener('message', handleMessage);
      clearInterval(checkClosed);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#833AB4]/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#E1306C]/10 blur-[120px]" />
      <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-[#F77737]/5 blur-[100px]" />

      <div className="max-w-xl w-full relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className={cn(
              'inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 shadow-lg shadow-[#E1306C]/20',
              'bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737]'
            )}
          >
            <span className="text-2xl text-white font-black">IG</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Instagram CRM</h1>
          <p className="text-white/30 mt-2 text-sm">Automacao inteligente para seu Instagram</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {['Funcionalidades', 'Conectar Instagram'].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500',
                  step === i
                    ? 'bg-gradient-to-br from-[#E1306C] to-[#833AB4] text-white shadow-lg shadow-[#E1306C]/30'
                    : step > i
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white/5 text-white/20 border border-white/10'
                )}
              >
                {step > i ? <CheckCircle2 size={16} /> : i + 1}
              </div>
              <span
                className={cn(
                  'text-xs font-medium hidden sm:block',
                  step === i ? 'text-white/70' : 'text-white/20'
                )}
              >
                {label}
              </span>
              {i < 1 && <ChevronRight size={14} className="text-white/10 mx-1" />}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl shadow-2xl overflow-hidden">
          {/* Step 0: Features Overview */}
          {step === 0 && (
            <div className="p-8">
              <h2 className="text-lg font-bold text-white mb-1">O que o sistema faz?</h2>
              <p className="text-white/30 text-sm mb-6">Tudo que voce precisa para automatizar seu Instagram</p>

              <div className="grid gap-3">
                {FEATURES.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div
                      key={f.label}
                      className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all group"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${f.color}15` }}
                      >
                        <Icon size={20} style={{ color: f.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                          {f.label}
                        </div>
                        <div className="text-xs text-white/30 mt-0.5">{f.desc}</div>
                      </div>
                      <ChevronRight size={16} className="text-white/10 mt-0.5 flex-shrink-0 group-hover:text-white/20 transition-colors" />
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={onSkipDemo}
                  className="flex-1 px-4 py-3.5 rounded-xl text-sm font-semibold text-white/40 border border-white/[0.06] hover:bg-white/[0.04] hover:text-white/60 transition-all"
                >
                  Ver Demo
                </button>
                <button
                  onClick={() => setStep(1)}
                  className={cn(
                    'flex-1 px-4 py-3.5 rounded-xl text-sm font-semibold text-white transition-all',
                    'bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737]',
                    'shadow-lg shadow-[#E1306C]/20 hover:shadow-[#E1306C]/30 hover:scale-[1.02]'
                  )}
                >
                  <span className="flex items-center justify-center gap-2">
                    Conectar Instagram
                    <ArrowRight size={16} />
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Connect Instagram */}
          {step === 1 && !connected && (
            <div className="p-8">
              <h2 className="text-lg font-bold text-white mb-1">Conectar seu Instagram</h2>
              <p className="text-white/30 text-sm mb-6">
                Clique no botao abaixo para fazer login com sua conta do Instagram
              </p>

              {/* Instagram Login Button */}
              <button
                onClick={handleInstagramLogin}
                disabled={connecting}
                className={cn(
                  'w-full py-4 rounded-xl text-white font-bold text-sm transition-all duration-300 relative overflow-hidden',
                  'bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737]',
                  'shadow-lg shadow-[#E1306C]/25',
                  connecting
                    ? 'opacity-80 cursor-wait'
                    : 'hover:shadow-[#E1306C]/40 hover:scale-[1.01] active:scale-[0.99]'
                )}
              >
                {connecting ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Conectando ao Instagram...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                    Entrar com Instagram
                  </span>
                )}
              </button>

              {error && (
                <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Permissions preview */}
              <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={14} className="text-white/30" />
                  <span className="text-xs font-semibold text-white/30 uppercase tracking-wider">
                    Permissoes solicitadas
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {PERMISSIONS.map((p) => {
                    const Icon = p.icon;
                    return (
                      <div key={p.label} className="flex items-center gap-2 py-1.5">
                        <Icon size={13} className="text-white/20 flex-shrink-0" />
                        <span className="text-xs text-white/30">{p.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Requirements */}
              <div className="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <p className="text-xs text-amber-400/70">
                  <strong className="text-amber-400/90">Requisito:</strong> Conta Instagram{' '}
                  <strong>Business</strong> ou <strong>Creator</strong> vinculada a uma Pagina do Facebook.
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(0)}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-white/30 border border-white/[0.06] hover:bg-white/[0.04] hover:text-white/50 transition-all"
                >
                  ← Voltar
                </button>
                <button
                  onClick={onSkipDemo}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-medium text-white/30 hover:text-white/50 transition-all text-center"
                >
                  Pular e usar Demo
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Success */}
          {step === 1 && connected && (
            <div className="p-8 text-center">
              {/* Success animation */}
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 size={40} className="text-emerald-400" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Sparkles size={20} className="text-amber-400 animate-pulse" />
                </div>
              </div>

              <h2 className="text-xl font-bold text-white mb-2">Instagram Conectado!</h2>
              <p className="text-white/30 text-sm mb-6">
                Sua conta <strong className="text-white/60">{igUsername}</strong> foi conectada com sucesso
              </p>

              {/* Connected account card */}
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] mb-8">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-white/80">{igUsername}</div>
                  <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <Zap size={10} />
                    Conectado
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() =>
                    onComplete({
                      apiUrl: 'http://localhost:3001/api/v1',
                      metaAppId: '',
                      metaAppSecret: '',
                      openaiKey: '',
                      webhookToken: '',
                      mode: 'live',
                    })
                  }
                  className={cn(
                    'w-full px-4 py-3.5 rounded-xl text-sm font-bold text-white transition-all',
                    'bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737]',
                    'shadow-lg shadow-[#E1306C]/20 hover:shadow-[#E1306C]/30 hover:scale-[1.01]'
                  )}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles size={16} />
                    Abrir Dashboard
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-[11px] text-white/15">
            IndustryOS 360 — Instagram CRM &middot; Automacao com IA
          </p>
        </div>
      </div>
    </div>
  );
}
