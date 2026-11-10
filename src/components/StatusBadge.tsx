import React from 'react';
import { ProjectStatus, Language } from '../types';
import { translations } from '../translations';
import { CheckCircle2, Clock, AlertTriangle, AlertOctagon, HelpCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: ProjectStatus;
  lang?: Language;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  lang = 'en',
  size = 'md',
  showIcon = true
}) => {
  const label = translations[lang]?.statusLabels[status] || translations.en.statusLabels[status];

  // Configure styling and accessible icons for each status (high contrast on dark green canvas)
  const config = {
    likely_recovery: {
      bg: 'bg-[#10B981]/20',
      border: 'border-[#10B981]/40',
      text: 'text-[#6EE7B7]',
      icon: CheckCircle2,
      dotColor: 'bg-[#10B981]',
      labelColor: 'text-[#6EE7B7]',
      iconColor: 'text-[#6EE7B7]'
    },
    monitoring_required: {
      bg: 'bg-[#F59E0B]/20',
      border: 'border-[#F59E0B]/40',
      text: 'text-[#FDE68A]',
      icon: Clock,
      dotColor: 'bg-[#F59E0B]',
      labelColor: 'text-[#FDE68A]',
      iconColor: 'text-[#FDE68A]'
    },
    evidence_discrepancy: {
      bg: 'bg-[#F97316]/20',
      border: 'border-[#F97316]/40',
      text: 'text-[#FDBA74]',
      icon: AlertTriangle,
      dotColor: 'bg-[#F97316]',
      labelColor: 'text-[#FDBA74]',
      iconColor: 'text-[#FDBA74]'
    },
    field_verification_priority: {
      bg: 'bg-[#E5484D]/20',
      border: 'border-[#E5484D]/40',
      text: 'text-[#FF8A8A]',
      icon: AlertOctagon,
      dotColor: 'bg-[#E5484D]',
      labelColor: 'text-[#FF8A8A]',
      iconColor: 'text-[#FF8A8A]'
    },
    insufficient_evidence: {
      bg: 'bg-white/10',
      border: 'border-white/20',
      text: 'text-white/80',
      icon: HelpCircle,
      dotColor: 'bg-white/50',
      labelColor: 'text-white/80',
      iconColor: 'text-white/80'
    }
  }[status];

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[11px] tracking-wide px-2.5 py-0.5 gap-1.5 font-semibold',
    md: 'text-xs tracking-wide px-3 py-1 gap-2 font-semibold',
    lg: 'text-xs sm:text-sm tracking-wide px-3.5 py-1.5 gap-2.5 font-semibold'
  }[size];

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.border} ${sizeClasses} whitespace-nowrap select-none backdrop-blur-2xs transition-all shadow-2xs`}
      role="status"
      aria-label={`Status: ${label}`}
    >
      {showIcon && (
        <span className="inline-flex items-center justify-center">
          <Icon size={iconSizes} className={`shrink-0 ${config.iconColor}`} aria-hidden="true" />
        </span>
      )}
      <span className={config.labelColor}>{label}</span>
    </span>
  );
};
