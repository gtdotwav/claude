'use client';

import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { HelpCircle } from '@/components/icons';

export function Badge({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold border', className)}>
      {children}
    </span>
  );
}

export function Tooltip({ text, children }: { text: string; children: ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2.5 px-3 py-2 bg-[#16162a] text-white/80 text-[11px] rounded-xl shadow-2xl shadow-black/40 whitespace-nowrap max-w-xs text-center leading-relaxed border border-white/[0.08]">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-[#16162a] rotate-45 border-r border-b border-white/[0.08]" />
        </div>
      )}
    </div>
  );
}

export function HelpBadge({ text }: { text: string }) {
  return (
    <Tooltip text={text}>
      <button className="w-4 h-4 rounded-full bg-white/[0.06] text-white/30 flex items-center justify-center hover:bg-white/[0.10] hover:text-white/50 flex-shrink-0 transition-all duration-200">
        <HelpCircle size={10} />
      </button>
    </Tooltip>
  );
}

export function KPI({
  title, value, color, sub, help, pulse,
}: {
  title: string; value: string | number; color: string; sub?: string; help?: string; pulse?: boolean;
}) {
  return (
    <div className={cn(
      'bg-white/[0.03] rounded-2xl border border-white/[0.06] p-5',
      'hover:bg-white/[0.04] hover:border-white/[0.10]',
      'transition-all duration-200'
    )}>
      <div className="flex items-center gap-2 mb-2">
        {pulse && <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />}
        <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">{title}</span>
        {help && <HelpBadge text={help} />}
      </div>
      <div className="text-2xl font-black leading-none tracking-tight" style={{ color }}>{value}</div>
      {sub && <p className="text-[10px] text-white/30 mt-2">{sub}</p>}
    </div>
  );
}

export function EmptyState({
  icon, title, description, action, onAction,
}: {
  icon: React.ReactNode; title: string; description: string; action?: string; onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="mb-5 text-white/15">{icon}</div>
      <h3 className="text-lg font-bold text-white/90 mb-2">{title}</h3>
      <p className="text-sm text-white/30 max-w-md mb-8 leading-relaxed">{description}</p>
      {action && (
        <button
          onClick={onAction}
          className={cn(
            'px-6 py-3 rounded-xl text-sm font-bold shadow-sm transition-all duration-200',
            'bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737]',
            'text-white hover:shadow-lg hover:shadow-[#E1306C]/20 hover:scale-[1.02] active:scale-[0.98]'
          )}
        >
          {action}
        </button>
      )}
    </div>
  );
}

export function SentBar({ v }: { v: number }) {
  const p = Math.max(0, Math.min(100, (v + 1) * 50));
  const c = v < -0.3 ? 'bg-red-500' : v < 0.3 ? 'bg-amber-400' : 'bg-emerald-500';
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all duration-500', c)} style={{ width: `${p}%` }} />
      </div>
      <span className="text-[10px] text-white/30 w-10 text-right tabular-nums font-medium">{v.toFixed(1)}</span>
    </div>
  );
}

export function IntBar({ v }: { v: number }) {
  const p = Math.max(0, Math.min(100, v * 100));
  const c = v < 0.3 ? 'bg-blue-400' : v < 0.7 ? 'bg-cyan-500' : 'bg-emerald-500';
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all duration-500', c)} style={{ width: `${p}%` }} />
      </div>
      <span className="text-[10px] text-white/30 w-10 text-right tabular-nums font-medium">{(v * 100).toFixed(0)}%</span>
    </div>
  );
}

export function Toggle({ enabled, onChange, size = 'md' }: { enabled: boolean; onChange: () => void; size?: 'sm' | 'md' }) {
  return (
    <button
      onClick={onChange}
      className={cn(
        'relative inline-flex rounded-full transition-colors duration-200 flex-shrink-0',
        size === 'sm' ? 'w-9 h-5' : 'w-11 h-6',
        enabled ? 'bg-emerald-500' : 'bg-white/[0.10]'
      )}
    >
      <span
        className={cn(
          'inline-block rounded-full bg-white shadow-sm transition-transform duration-200',
          size === 'sm' ? 'h-3 w-3 mt-1' : 'h-4 w-4 mt-1',
          size === 'sm'
            ? enabled ? 'translate-x-[18px]' : 'translate-x-[3px]'
            : enabled ? 'translate-x-[22px]' : 'translate-x-[3px]'
        )}
      />
    </button>
  );
}

export function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200',
              i < current
                ? 'bg-emerald-500 text-white'
                : i === current
                  ? 'bg-[#E1306C] text-white ring-4 ring-[#E1306C]/20'
                  : 'bg-white/[0.06] text-white/15 border border-white/[0.08]'
            )}
          >
            {i < current ? '\u2713' : i + 1}
          </div>
          {i < steps.length - 1 && (
            <div className={cn('w-10 h-0.5 rounded-full transition-colors duration-300', i < current ? 'bg-emerald-500' : 'bg-white/[0.06]')} />
          )}
        </div>
      ))}
    </div>
  );
}

export function InfoCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl p-5 border bg-white/[0.03] border-white/[0.06]">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5 text-white/30">{icon}</div>
        <div>
          <h4 className="font-semibold text-white/90 mb-1 text-sm">{title}</h4>
          <div className="text-xs text-white/30 leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
