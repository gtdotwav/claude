/**
 * Solar Icon System — via @iconify/react
 *
 * Drop-in replacement for lucide-react.
 * Every export mirrors the old lucide name so the only change in each file
 * is the import path:
 *   from '@/components/icons'  →  from '@/components/icons'
 *
 * Solar icon set reference: https://icon-sets.iconify.design/solar/
 */

import { Icon, type IconProps as BaseIconProps } from '@iconify/react';
import React from 'react';

// ─── Shared props that mirror lucide-react's API ───────────────────
export interface IconComponentProps {
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
  /** lucide compat — ignored for Solar but accepted so JSX won't break */
  fill?: string;
  /** lucide compat */
  stroke?: string;
  /** lucide compat */
  strokeWidth?: number | string;
}

function solar(name: string, displayName: string) {
  const Comp = React.forwardRef<SVGSVGElement, IconComponentProps>(
    ({ size = 24, className, style, ...rest }, ref) => (
      <Icon
        icon={name}
        width={typeof size === 'string' ? size : size}
        height={typeof size === 'string' ? size : size}
        className={className}
        style={style}
        ref={ref as any}
      />
    ),
  );
  Comp.displayName = displayName;
  return Comp;
}

// ─── Navigation & UI ────────────────────────────────────────────────
export const ChevronRight = solar('solar:alt-arrow-right-linear', 'ChevronRight');
export const ChevronLeft = solar('solar:alt-arrow-left-linear', 'ChevronLeft');
export const ChevronDown = solar('solar:alt-arrow-down-linear', 'ChevronDown');
export const ArrowRight = solar('solar:arrow-right-bold', 'ArrowRight');
export const ArrowUpRight = solar('solar:arrow-right-up-bold', 'ArrowUpRight');
export const ArrowDownRight = solar('solar:arrow-right-down-bold', 'ArrowDownRight');
export const X = solar('solar:close-circle-bold', 'X');
export const Plus = solar('solar:add-circle-bold', 'Plus');
export const ExternalLink = solar('solar:square-arrow-right-up-bold', 'ExternalLink');
export const Search = solar('solar:magnifer-bold', 'Search');
export const Settings = solar('solar:settings-bold', 'Settings');
export const LayoutGrid = solar('solar:widget-2-bold', 'LayoutGrid');
export const GripVertical = solar('solar:hamburger-menu-bold', 'GripVertical');
export const HelpCircle = solar('solar:question-circle-bold', 'HelpCircle');

// ─── Communication ──────────────────────────────────────────────────
export const MessageCircle = solar('solar:chat-round-dots-bold', 'MessageCircle');
export const Inbox = solar('solar:inbox-bold', 'Inbox');
export const Send = solar('solar:plain-bold', 'Send');

// ─── Media ──────────────────────────────────────────────────────────
const ImageComponent = solar('solar:gallery-bold', 'ImageIcon');
export { ImageComponent as Image };
export const Film = solar('solar:clapperboard-play-bold', 'Film');
export const Layers = solar('solar:layers-bold', 'Layers');
export const Mic = solar('solar:microphone-bold', 'Mic');
export const Volume2 = solar('solar:volume-loud-bold', 'Volume2');
export const VolumeX = solar('solar:volume-cross-bold', 'VolumeX');

// ─── Data / Analytics ───────────────────────────────────────────────
export const BarChart3 = solar('solar:chart-2-bold', 'BarChart3');
export const TrendingUp = solar('solar:graph-up-bold', 'TrendingUp');
export const TrendingDown = solar('solar:graph-down-bold', 'TrendingDown');
export const Activity = solar('solar:health-bold', 'Activity');
export const Target = solar('solar:target-bold', 'Target');
export const Eye = solar('solar:eye-bold', 'Eye');
export const Hash = solar('solar:hashtag-bold', 'Hash');

// ─── Social / People ────────────────────────────────────────────────
export const Users = solar('solar:users-group-two-rounded-bold', 'Users');
export const UserPlus = solar('solar:user-plus-rounded-bold', 'UserPlus');
export const Heart = solar('solar:heart-bold', 'Heart');
export const Bookmark = solar('solar:bookmark-bold', 'Bookmark');

// ─── Status / Feedback ──────────────────────────────────────────────
export const CheckCircle2 = solar('solar:check-circle-bold', 'CheckCircle2');
export const AlertCircle = solar('solar:danger-circle-bold', 'AlertCircle');
export const AlertTriangle = solar('solar:danger-triangle-bold', 'AlertTriangle');
export const Loader2 = solar('solar:refresh-circle-2-bold', 'Loader2');

// ─── Objects ────────────────────────────────────────────────────────
export const CalendarDays = solar('solar:calendar-bold', 'CalendarDays');
export const Clock = solar('solar:clock-circle-bold', 'Clock');
export const Globe = solar('solar:global-bold', 'Globe');
export const Star = solar('solar:star-bold', 'Star');
export const Award = solar('solar:medal-ribbons-star-bold', 'Award');
export const Shield = solar('solar:shield-bold', 'Shield');
export const Lock = solar('solar:lock-bold', 'Lock');
export const Link2 = solar('solar:link-round-bold', 'Link2');

// ─── AI / Automation ────────────────────────────────────────────────
export const Sparkles = solar('solar:stars-bold', 'Sparkles');
export const Zap = solar('solar:bolt-bold', 'Zap');
export const Bot = solar('solar:ghost-bold', 'Bot');
export const GitBranch = solar('solar:branching-paths-up-bold', 'GitBranch');

// ─── Devices ────────────────────────────────────────────────────────
export const Smartphone = solar('solar:smartphone-bold', 'Smartphone');
export const Monitor = solar('solar:monitor-bold', 'Monitor');

// ─── Instagram (Solar set includes it) ──────────────────────────────
export const Instagram = solar('mdi:instagram', 'Instagram');
