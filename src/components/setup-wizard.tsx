'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import {
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
  Search,
  Users,
  Heart,
  Image,
  AlertTriangle,
} from '@/components/icons';
import type { MockAccount } from '@/lib/mock-data';

interface SetupWizardProps {
  onComplete: (account: MockAccount) => void;
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

const DATA_ACCESS = [
  { icon: Eye, label: 'Perfil publico e bio' },
  { icon: Image, label: 'Posts recentes e metricas' },
  { icon: Users, label: 'Contagem de seguidores' },
  { icon: Heart, label: 'Engajamento e interacoes' },
];

interface ProfileData {
  username: string;
  fullName: string;
  profilePicUrl: string;
  followerCount: number;
  followingCount: number;
  postCount: number;
  isVerified: boolean;
  biography: string;
  category: string;
  id: string;
}

export default function SetupWizard({ onComplete, onSkipDemo }: SetupWizardProps) {
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');

  const handleLookup = useCallback(async () => {
    const handle = username.replace(/^@/, '').trim();
    if (!handle) {
      setError('Digite um username valido');
      return;
    }

    setLoading(true);
    setError('');
    setProfile(null);

    try {
      const res = await fetch(
        `/api/instagram/lookup?handle=${encodeURIComponent(handle)}&posts=true`
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Perfil nao encontrado');
      }

      setProfile({
        username: data.profile.username,
        fullName: data.profile.fullName,
        profilePicUrl: data.profile.profilePicUrl,
        followerCount: data.profile.followerCount,
        followingCount: data.profile.followingCount,
        postCount: data.profile.postCount,
        isVerified: data.profile.isVerified,
        biography: data.profile.biography,
        category: data.profile.category,
        id: data.profile.id,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar perfil');
    } finally {
      setLoading(false);
    }
  }, [username]);

  const handleConnect = useCallback(() => {
    if (!profile) return;

    setConnected(true);

    // Build MockAccount from profile data
    const account: MockAccount = {
      id: `ig-${profile.id || Date.now()}`,
      username: profile.username,
      igAccountId: profile.id,
      fbPageId: '',
      status: 'active',
      tokenExpiresAt: '',
      features: { autoReplyComments: true, autoReplyDMs: true, aiClassification: true },
      totalCommentsProcessed: 0,
      totalDmsProcessed: 0,
      totalAutoReplies: 0,
      createdAt: new Date().toISOString(),
      igName: profile.fullName,
      igProfilePic: profile.profilePicUrl,
      followers: profile.followerCount,
      following: profile.followingCount,
      postCount: profile.postCount,
      biography: profile.biography,
      isVerified: profile.isVerified,
      category: profile.category,
    };

    // Small delay for the success animation
    setTimeout(() => onComplete(account), 1200);
  }, [profile, onComplete]);

  const formatNumber = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return String(n);
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

          {/* Step 1: Connect via Username */}
          {step === 1 && !connected && (
            <div className="p-8">
              <h2 className="text-lg font-bold text-white mb-1">Conectar seu Instagram</h2>
              <p className="text-white/30 text-sm mb-6">
                Digite seu username para conectar automaticamente
              </p>

              {/* Username Input */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">@</div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                    setProfile(null);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && !loading && handleLookup()}
                  placeholder="seu_username"
                  className={cn(
                    'w-full pl-9 pr-4 py-4 rounded-xl text-sm text-white placeholder-white/20',
                    'bg-white/[0.04] border border-white/[0.08]',
                    'focus:outline-none focus:border-[#E1306C]/40 focus:bg-white/[0.06]',
                    'transition-all duration-200'
                  )}
                  autoFocus
                  disabled={loading}
                />
              </div>

              {/* Search Button */}
              <button
                onClick={handleLookup}
                disabled={loading || !username.trim()}
                className={cn(
                  'w-full mt-3 py-4 rounded-xl text-white font-bold text-sm transition-all duration-300 relative overflow-hidden',
                  'bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737]',
                  'shadow-lg shadow-[#E1306C]/25',
                  loading || !username.trim()
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:shadow-[#E1306C]/40 hover:scale-[1.01] active:scale-[0.99]'
                )}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Buscando perfil...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <Search size={18} />
                    Buscar Perfil
                  </span>
                )}
              </button>

              {/* Error */}
              {error && (
                <div className="mt-4 flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertTriangle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Profile Preview */}
              {profile && (
                <div className="mt-5 p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] animate-in fade-in duration-300">
                  <div className="flex items-center gap-4">
                    {/* Profile Pic */}
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] p-[2px]">
                        <img
                          src={profile.profilePicUrl}
                          alt={profile.username}
                          className="w-full h-full rounded-full object-cover bg-[#0c0c14]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://placehold.co/128x128/E1306C/fff?text=${profile.username.slice(0, 2).toUpperCase()}`;
                          }}
                        />
                      </div>
                      {profile.isVerified && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-[#0c0c14]">
                          <CheckCircle2 size={10} className="text-white" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white/90 truncate">
                          {profile.fullName || profile.username}
                        </span>
                        {profile.category && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.06] text-white/30 flex-shrink-0">
                            {profile.category}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-white/40 mt-0.5">@{profile.username}</div>
                      {profile.biography && (
                        <p className="text-[11px] text-white/25 mt-1.5 line-clamp-2 leading-relaxed">
                          {profile.biography}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/[0.04]">
                    <div className="text-center">
                      <div className="text-sm font-bold text-white/80">{formatNumber(profile.postCount)}</div>
                      <div className="text-[10px] text-white/25 mt-0.5">posts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-white/80">{formatNumber(profile.followerCount)}</div>
                      <div className="text-[10px] text-white/25 mt-0.5">seguidores</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-white/80">{formatNumber(profile.followingCount)}</div>
                      <div className="text-[10px] text-white/25 mt-0.5">seguindo</div>
                    </div>
                  </div>

                  {/* Connect This Account */}
                  <button
                    onClick={handleConnect}
                    className={cn(
                      'w-full mt-4 py-3.5 rounded-xl text-sm font-bold text-white transition-all',
                      'bg-gradient-to-r from-emerald-600 to-emerald-500',
                      'shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.01] active:scale-[0.99]'
                    )}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Zap size={16} />
                      Conectar @{profile.username}
                    </span>
                  </button>
                </div>
              )}

              {/* Data Access Info */}
              {!profile && (
                <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield size={14} className="text-white/30" />
                    <span className="text-xs font-semibold text-white/30 uppercase tracking-wider">
                      Dados acessados
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {DATA_ACCESS.map((p) => {
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
              )}

              {/* Info note */}
              {!profile && (
                <div className="mt-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                  <p className="text-xs text-emerald-400/70">
                    <strong className="text-emerald-400/90">Sem complicacao:</strong> Apenas digite seu
                    username. Nao precisa de Meta Developer, App ID, nem configuracao extra.
                  </p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setStep(0);
                    setProfile(null);
                    setError('');
                  }}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-white/30 border border-white/[0.06] hover:bg-white/[0.04] hover:text-white/50 transition-all"
                >
                  Voltar
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

          {/* Step 1: Success State */}
          {step === 1 && connected && profile && (
            <div className="p-8 text-center">
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
                <strong className="text-white/60">@{profile.username}</strong> foi conectado com sucesso
              </p>

              {/* Connected account card */}
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] mb-8">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] p-[1.5px]">
                  <img
                    src={profile.profilePicUrl}
                    alt={profile.username}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/80x80/E1306C/fff?text=${profile.username.slice(0, 2).toUpperCase()}`;
                    }}
                  />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-white/80">@{profile.username}</div>
                  <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <Zap size={10} />
                    Conectado
                  </div>
                </div>
              </div>

              <div className="text-xs text-white/20 mb-4">Carregando dashboard...</div>
              <svg className="animate-spin h-5 w-5 text-white/30 mx-auto" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
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
