'use client';

import { cn } from '@/lib/utils';
import { Bot, TrendingUp, Eye, Heart, MessageCircle, Sparkles } from '@/components/icons';

interface AgentCard {
  name: string;
  avatar: string;
  role: string;
  thought: string;
  metric: string;
  metricLabel: string;
  color: string;
  icon: typeof Bot;
}

const AGENTS: AgentCard[] = [
  {
    name: 'Luna',
    avatar: '🌙',
    role: 'Classificadora',
    thought: 'Detectei 12 comentarios de alta intencao de compra nos ultimos 30min',
    metric: '98.2%',
    metricLabel: 'Precisao',
    color: '#833AB4',
    icon: Sparkles,
  },
  {
    name: 'Aria',
    avatar: '✨',
    role: 'Auto-Reply',
    thought: 'Respondi 47 comentarios automaticamente. 3 escalados para humano.',
    metric: '2.1s',
    metricLabel: 'Tempo medio',
    color: '#E1306C',
    icon: MessageCircle,
  },
  {
    name: 'Nova',
    avatar: '🔮',
    role: 'DM Manager',
    thought: 'Conversa com @maria_store encaminhada: cliente pediu catalogo PDF',
    metric: '23',
    metricLabel: 'DMs ativas',
    color: '#F77737',
    icon: Bot,
  },
  {
    name: 'Zenith',
    avatar: '⚡',
    role: 'Analytics',
    thought: 'Engagement subiu 34% esta semana. Melhor horario: terça 19h',
    metric: '+34%',
    metricLabel: 'Engagement',
    color: '#22c55e',
    icon: TrendingUp,
  },
  {
    name: 'Iris',
    avatar: '👁',
    role: 'Insights',
    thought: 'Hashtag #oferta gerou 3x mais salvamentos que a media',
    metric: '1.2k',
    metricLabel: 'Salvamentos',
    color: '#3b82f6',
    icon: Eye,
  },
  {
    name: 'Pulse',
    avatar: '💗',
    role: 'Sentimento',
    thought: 'Sentimento geral: 87% positivo. Reclamacoes caíram 22% no mes.',
    metric: '87%',
    metricLabel: 'Positivo',
    color: '#ec4899',
    icon: Heart,
  },
];

function AgentCardComponent({ agent }: { agent: AgentCard }) {
  const Icon = agent.icon;
  return (
    <div className="flex-shrink-0 w-[320px] group">
      <div
        className={cn(
          'relative rounded-2xl p-5 h-full',
          'bg-white/[0.03] border border-white/[0.06]',
          'backdrop-blur-xl',
          'hover:bg-white/[0.04] hover:border-white/[0.10]',
          'transition-all duration-200'
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
            style={{ backgroundColor: `${agent.color}15` }}
          >
            {agent.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-white/90">{agent.name}</span>
              <span
                className="px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider"
                style={{ backgroundColor: `${agent.color}15`, color: agent.color }}
              >
                {agent.role}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-white/30">Online agora</span>
            </div>
          </div>
        </div>

        {/* Thought bubble */}
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-3 mb-3">
          <p className="text-[12px] text-white/50 leading-relaxed italic">
            &ldquo;{agent.thought}&rdquo;
          </p>
        </div>

        {/* Metric */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon size={13} style={{ color: agent.color }} className="opacity-60" />
            <span className="text-[10px] text-white/25">{agent.metricLabel}</span>
          </div>
          <span className="text-[15px] font-bold" style={{ color: agent.color }}>
            {agent.metric}
          </span>
        </div>
      </div>
    </div>
  );
}

export function AgentMarquee() {
  return (
    <section className="w-full py-16 relative overflow-hidden">
      {/* Section header */}
      <div className="text-center mb-10 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] mb-4">
          <Bot size={12} className="text-[#E1306C]" />
          <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">
            Agentes IA Ativos
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white/90 mb-2">
          Sua equipe de IA, <span className="hero-title-gradient">trabalhando 24/7</span>
        </h2>
        <p className="text-sm text-white/50 max-w-lg mx-auto">
          Cada agente cuida de uma parte do seu Instagram. Veja o que estao pensando agora.
        </p>
      </div>

      {/* Marquee */}
      <div className="relative">
        <div className="flex overflow-hidden">
          <div className="flex gap-4 animate-marquee hover:[animation-play-state:paused]">
            {[...AGENTS, ...AGENTS, ...AGENTS, ...AGENTS].map((agent, i) => (
              <AgentCardComponent key={`${agent.name}-${i}`} agent={agent} />
            ))}
          </div>
        </div>

        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050508] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050508] to-transparent z-10" />
      </div>
    </section>
  );
}
