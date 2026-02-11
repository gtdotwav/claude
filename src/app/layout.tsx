'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './globals.css';
import { AppProvider, useApp } from '@/context/app-context';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  MessageCircle,
  Inbox,
  GitBranch,
  Zap,
  Link2,
  CalendarDays,
  ChevronRight,
  Sparkles,
  Settings,
  Bot,
  Search,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', id: 'dashboard', label: 'Dashboard', desc: 'Visao geral', icon: BarChart3 },
  { href: '/comments', id: 'comments', label: 'Comentarios', desc: 'Classificacao IA', icon: MessageCircle },
  { href: '/inbox', id: 'inbox', label: 'Inbox DMs', desc: 'Conversas', icon: Inbox },
  { href: '/flows', id: 'flows', label: 'Fluxos', desc: 'Automacao DM', icon: GitBranch },
  { href: '/rules', id: 'rules', label: 'Auto-Reply', desc: 'Regras IA', icon: Zap },
  { href: '/feed', id: 'feed', label: 'Planejamento', desc: 'Feed & Agenda', icon: CalendarDays },
  { href: '/analytics', id: 'analytics', label: 'Analytics', desc: 'Pesquisa & Insights', icon: Search },
  { href: '/influencers', id: 'influencers', label: 'IA Influencers', desc: 'Galeria IA', icon: Bot },
  { href: '/settings', id: 'settings', label: 'Contas', desc: 'Conexoes', icon: Link2 },
];

function Sidebar() {
  const pathname = usePathname();
  const { isDemo, setPhase } = useApp();

  return (
    <aside className="w-[260px] bg-[#080810] text-white fixed inset-y-0 z-20 flex flex-col border-r border-white/[0.06]">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shadow-lg',
              'bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737]'
            )}
          >
            IG
          </div>
          <div>
            <div className="text-[13px] font-bold tracking-wide text-white/90">IndustryOS 360</div>
            <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium">
              Instagram CRM
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        <div className="px-3 mb-3">
          <span className="text-[10px] font-semibold text-white/20 uppercase tracking-[0.15em]">
            Principal
          </span>
        </div>
        {NAV_ITEMS.map((n) => {
          const isActive = pathname === n.href || (n.href !== '/' && pathname.startsWith(n.href));
          const Icon = n.icon;
          return (
            <Link
              key={n.id}
              href={n.href}
              className={cn(
                'group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200',
                isActive
                  ? 'bg-white/[0.08] text-white shadow-sm shadow-white/[0.02]'
                  : 'text-white/40 hover:bg-white/[0.04] hover:text-white/70'
              )}
            >
              <Icon
                size={18}
                className={cn(
                  'flex-shrink-0 transition-colors',
                  isActive ? 'text-[#E1306C]' : 'text-white/30 group-hover:text-white/50'
                )}
              />
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium">{n.label}</div>
                <div className={cn('text-[10px] transition-colors', isActive ? 'text-white/40' : 'text-white/20')}>
                  {n.desc}
                </div>
              </div>
              {isActive && (
                <ChevronRight size={14} className="text-white/20 flex-shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="px-3 pb-2 space-y-2">
        {isDemo && (
          <button
            onClick={() => setPhase('setup')}
            className={cn(
              'w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300',
              'bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737]',
              'text-white shadow-lg shadow-[#E1306C]/20 hover:shadow-[#E1306C]/30 hover:scale-[1.02]'
            )}
          >
            <span className="flex items-center justify-center gap-2">
              <Sparkles size={14} />
              Conectar Conta Real
            </span>
          </button>
        )}
        <button
          onClick={() => setPhase('hero')}
          className="w-full px-3 py-2 rounded-xl text-[11px] text-white/25 hover:text-white/40 hover:bg-white/[0.03] transition-all flex items-center justify-center gap-1.5"
        >
          <Settings size={12} />
          Voltar ao Inicio
        </button>
      </div>

      {/* User */}
      <div className="p-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold',
              'bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm'
            )}
          >
            GT
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-white/80">GTzen</div>
            <div className="text-[10px] text-white/25">Admin</div>
          </div>
          {isDemo && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/15 text-amber-400/80 border border-amber-500/20">
              DEMO
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}

function LayoutInner({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[#08080f]">
      <Sidebar />
      <main className="flex-1 ml-[260px] min-h-screen">
        <div className="p-6 lg:p-8 max-w-[1400px]">{children}</div>
      </main>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <title>IndustryOS 360 — Instagram CRM</title>
        <meta name="description" content="Automacao de Instagram com IA, CRM integrado e fluxos de DM" />
      </head>
      <body className="min-h-screen antialiased">
        <AppProvider>
          <LayoutInner>{children}</LayoutInner>
        </AppProvider>
      </body>
    </html>
  );
}
