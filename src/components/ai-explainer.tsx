'use client';

import { CLS } from '@/lib/design-tokens';
import { Badge, HelpBadge, SentBar, IntBar } from './ui';
import { Bot } from '@/components/icons';
import type { MockComment } from '@/lib/mock-data';

interface AiExplainerProps {
  comment: MockComment | null;
}

export default function AiExplainer({ comment }: AiExplainerProps) {
  if (!comment) return null;
  const cl = CLS[comment.classification];

  return (
    <div className="bg-white/[0.03] rounded-xl border border-[#E1306C]/20 p-5 space-y-4 shadow-sm">
      <h4 className="font-semibold text-white/90 flex items-center gap-2">
        <Bot size={20} /> Como a IA processou este comentario
        <HelpBadge text="A IA analisa texto, contexto e padroes para classificar e responder" />
      </h4>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/[0.04] rounded-lg p-3">
          <p className="text-xs text-white/40 mb-1">Classificacao</p>
          <Badge className={cl?.bg || ''}>{cl?.l || '?'}</Badge>
          <p className="text-xs text-white/30 mt-1">{cl?.desc || ''}</p>
          <p className="text-xs font-mono text-white/40 mt-1">
            Confianca: {(comment.classificationConfidence * 100).toFixed(0)}%
          </p>
        </div>

        <div className="bg-white/[0.04] rounded-lg p-3">
          <p className="text-xs text-white/40 mb-1">Sentimento</p>
          <SentBar v={comment.sentiment} />
          <p className="text-xs text-white/30 mt-1">
            {comment.sentiment < -0.3 ? 'Negativo' : comment.sentiment < 0.3 ? 'Neutro' : 'Positivo'}
          </p>
        </div>

        <div className="bg-white/[0.04] rounded-lg p-3">
          <p className="text-xs text-white/40 mb-1">Intencao de Compra</p>
          <IntBar v={comment.purchaseIntent} />
          <p className="text-xs text-white/30 mt-1">
            {comment.purchaseIntent < 0.3 ? 'Baixa' : comment.purchaseIntent < 0.7 ? 'Media' : 'Alta'}
          </p>
        </div>
      </div>

      {comment.aiReply && (
        <div className="bg-[#E1306C]/10 border border-[#E1306C]/10 rounded-lg p-4">
          <p className="text-xs font-medium text-[#E1306C] mb-1">Resposta gerada pela IA:</p>
          <p className="text-sm text-[#E1306C] italic">&quot;{comment.aiReply}&quot;</p>
        </div>
      )}

      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 text-xs text-emerald-400">
        <strong>Pipeline completo:</strong> Comentario recebido → Classificacao IA (
        {(comment.classificationConfidence * 100).toFixed(0)}% confianca) → Regra matcheada →{' '}
        {comment.actionStatus === 'auto_replied'
          ? 'Resposta automatica enviada'
          : comment.actionStatus === 'escalated'
            ? 'Escalado para humano'
            : comment.actionStatus === 'dm_invited'
              ? 'Convite DM enviado'
              : 'Aguardando acao'}{' '}
        → Prospect atualizado no CRM com tags
      </div>
    </div>
  );
}
