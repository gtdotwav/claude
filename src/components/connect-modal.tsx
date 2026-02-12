'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { MockAccount } from '@/lib/mock-data';
import {
  X,
  CheckCircle2,
  Shield,
  Eye,
  Users,
  Heart,
  Image,
  Zap,
  Sparkles,
  AlertTriangle,
  Search,
} from '@/components/icons';

interface ConnectModalProps {
  onClose: () => void;
  onConnect: (account: MockAccount) => void;
  config?: any;
}

const DATA_ACCESS = [
  { icon: Eye, label: 'Perfil publico e bio' },
  { icon: Image, label: 'Posts recentes' },
  { icon: Users, label: 'Seguidores' },
  { icon: Heart, label: 'Engajamento' },
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

export default function ConnectModal({ onClose, onConnect }: ConnectModalProps) {
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
        `/api/instagram/lookup?handle=${encodeURIComponent(handle)}`
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

    setTimeout(() => {
      onConnect(account);
      onClose();
    }, 1200);
  }, [profile, onConnect, onClose]);

  const formatNumber = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return String(n);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[#0c0c14] border border-white/[0.06] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black',
                'bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737]'
              )}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-white/90">Conectar Conta Instagram</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-white/30 hover:text-white/50 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {!connected ? (
            <div className="space-y-4">
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
                  placeholder="username"
                  className={cn(
                    'w-full pl-9 pr-4 py-3.5 rounded-xl text-sm text-white placeholder-white/20',
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
                  'w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all duration-300',
                  'bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737]',
                  'shadow-lg shadow-[#E1306C]/20',
                  loading || !username.trim()
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:shadow-[#E1306C]/35 hover:scale-[1.01] active:scale-[0.99]'
                )}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Buscando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <Search size={16} />
                    Buscar Perfil
                  </span>
                )}
              </button>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/15">
                  <AlertTriangle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}

              {/* Profile Preview */}
              {profile && (
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] p-[1.5px]">
                        <img
                          src={profile.profilePicUrl}
                          alt={profile.username}
                          className="w-full h-full rounded-full object-cover bg-[#0c0c14]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://placehold.co/96x96/E1306C/fff?text=${profile.username.slice(0, 2).toUpperCase()}`;
                          }}
                        />
                      </div>
                      {profile.isVerified && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border-2 border-[#0c0c14]">
                          <CheckCircle2 size={8} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white/90 truncate">
                        {profile.fullName || profile.username}
                      </div>
                      <div className="text-[11px] text-white/40">@{profile.username}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold text-white/70">{formatNumber(profile.followerCount)}</div>
                      <div className="text-[10px] text-white/25">seguidores</div>
                    </div>
                  </div>

                  <button
                    onClick={handleConnect}
                    className={cn(
                      'w-full mt-3 py-3 rounded-xl text-sm font-bold text-white transition-all',
                      'bg-gradient-to-r from-emerald-600 to-emerald-500',
                      'shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.01]'
                    )}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Zap size={14} />
                      Conectar @{profile.username}
                    </span>
                  </button>
                </div>
              )}

              {/* Data Access */}
              {!profile && (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield size={13} className="text-white/25" />
                    <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">
                      Dados acessados
                    </span>
                  </div>
                  <div className="space-y-2">
                    {DATA_ACCESS.map((p) => {
                      const Icon = p.icon;
                      return (
                        <div key={p.label} className="flex items-center gap-2.5">
                          <Icon size={12} className="text-white/15 flex-shrink-0" />
                          <span className="text-xs text-white/30">{p.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Success State */
            <div className="text-center py-4">
              <div className="relative inline-block mb-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-emerald-400" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Sparkles size={16} className="text-amber-400 animate-pulse" />
                </div>
              </div>
              <h3 className="text-base font-bold text-white mb-1">Conta Conectada!</h3>
              <p className="text-sm text-white/30">
                <strong className="text-white/50">@{profile?.username}</strong> adicionada com sucesso
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <Zap size={11} className="text-emerald-400" />
                <span className="text-[11px] text-emerald-400 font-medium">Ativa</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
