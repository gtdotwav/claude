'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { AppConfig } from './setup-wizard';
import {
  X,
  CheckCircle2,
  Shield,
  Eye,
  MessageCircle,
  Inbox,
  BarChart3,
  Zap,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

interface ConnectModalProps {
  onClose: () => void;
  onConnect: (account: any) => void;
  config: AppConfig | null;
}

const PERMISSIONS = [
  { icon: Eye, label: 'Ver perfil e publicacoes' },
  { icon: MessageCircle, label: 'Responder comentarios' },
  { icon: Inbox, label: 'Gerenciar Direct Messages' },
  { icon: BarChart3, label: 'Acessar metricas e insights' },
];

export default function ConnectModal({ onClose, onConnect }: ConnectModalProps) {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [igUsername, setIgUsername] = useState('');
  const [error, setError] = useState('');

  const handleInstagramLogin = () => {
    setConnecting(true);
    setError('');

    const popup = window.open(
      '/api/auth/instagram',
      'instagram-auth',
      'width=500,height=700,scrollbars=yes'
    );

    let resolved = false;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (resolved) return;

      if (event.data?.type === 'instagram-auth-success') {
        resolved = true;
        const account = {
          id: event.data.accountId || `ig-${Date.now()}`,
          igUsername: event.data.username || '@nova_conta',
          igName: event.data.name || 'Nova Conta',
          igProfilePic: event.data.profilePic || '',
          followers: event.data.followers || 0,
          status: 'active' as const,
        };
        setIgUsername(account.igUsername);
        setConnected(true);
        setConnecting(false);
        cleanup();

        setTimeout(() => {
          onConnect(account);
          onClose();
        }, 1500);
      }
      if (event.data?.type === 'instagram-auth-error') {
        resolved = true;
        setError(event.data.message || 'Erro ao conectar. Tente novamente.');
        setConnecting(false);
        cleanup();
      }
    };

    window.addEventListener('message', handleMessage);

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
            <div className="space-y-5">
              {/* Login Button */}
              <button
                onClick={handleInstagramLogin}
                disabled={connecting}
                className={cn(
                  'w-full py-4 rounded-xl text-white font-bold text-sm transition-all duration-300 relative overflow-hidden',
                  'bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737]',
                  'shadow-lg shadow-[#E1306C]/20',
                  connecting
                    ? 'opacity-80 cursor-wait'
                    : 'hover:shadow-[#E1306C]/35 hover:scale-[1.01] active:scale-[0.99]'
                )}
              >
                {connecting ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Conectando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                    Entrar com Instagram
                  </span>
                )}
              </button>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/15">
                  <AlertTriangle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}

              {/* Permissions */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={13} className="text-white/25" />
                  <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">
                    Permissoes
                  </span>
                </div>
                <div className="space-y-2">
                  {PERMISSIONS.map((p) => {
                    const Icon = p.icon;
                    return (
                      <div key={p.label} className="flex items-center gap-2.5">
                        <Icon size={12} className="text-white/15 flex-shrink-0" />
                        <span className="text-xs text-white/35">{p.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Requirement note */}
              <p className="text-[11px] text-white/20 text-center">
                Requer conta Instagram <strong className="text-white/30">Business</strong> ou{' '}
                <strong className="text-white/30">Creator</strong>
              </p>
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
                <strong className="text-white/50">{igUsername}</strong> adicionada com sucesso
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
