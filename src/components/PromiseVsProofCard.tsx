import React from 'react';
import { Project, Language } from '../types';
import { translations } from '../translations';
import { FileText, Satellite, ArrowUpRight, ShieldAlert, Sparkles, CheckCircle2, TrendingDown, TrendingUp } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface PromiseVsProofCardProps {
  project: Project;
  lang: Language;
  onOpenSourcePdf?: () => void;
}

export const PromiseVsProofCard: React.FC<PromiseVsProofCardProps> = ({
  project,
  lang,
  onOpenSourcePdf,
}) => {
  const t = translations[lang];
  const ndviDiff = project.proof.currentNdvi - project.promise.targetNdvi;
  const isDeficit = ndviDiff < 0;

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-serif-display">
            {t.promiseVsProofHeading}
          </h2>
          <p className="text-xs text-white/70">
            Autonomous juxtaposition of legal statutory commitments vs. Sentinel-2 multi-spectral observations.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 text-xs font-mono px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#A8C3A0] font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>Copernicus Sentinel-2 L2A</span>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/15">
        {/* LEFT SIDE — PROMISE */}
        <div className="p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FDBA74] flex items-center gap-1.5">
                <FileText size={15} />
                {t.promiseLabel}
              </span>
              <button
                onClick={onOpenSourcePdf}
                className="text-xs font-mono px-3 py-1 rounded-lg bg-white/10 text-[#A8C3A0] border border-white/15 hover:bg-white/15 transition-colors flex items-center gap-1 cursor-pointer font-semibold"
                title="View original clearance condition clause"
              >
                <span>{project.promise.sourcePdfPage}</span>
                <ArrowUpRight size={12} />
              </button>
            </div>

            {/* Exact short claim */}
            <div>
              <span className="text-[11px] text-white/60 font-semibold uppercase tracking-wider block mb-1">
                Mandated Statutory Commitment:
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-serif-display leading-snug">
                “{project.promise.shortClaim}”
              </h3>
            </div>

            {/* Specific Condition text excerpt */}
            <div className="p-4 rounded-xl bg-black/25 border border-white/10 space-y-1.5">
              <span className="text-[11px] font-bold text-[#FDBA74] uppercase tracking-wider block">
                Official Condition Text:
              </span>
              <p className="text-xs text-white/80 leading-relaxed">
                {project.promise.specificCondition}
              </p>
            </div>
          </div>

          {/* Metadata metrics */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-white/60 block text-[10px] uppercase tracking-wider font-semibold">{t.requiredArea}</span>
                <span className="font-bold text-white block mt-1 text-sm">{project.promise.requiredArea}</span>
              </div>
              <div>
                <span className="text-white/60 block text-[10px] uppercase tracking-wider font-semibold">{t.deadline}</span>
                <span className="font-bold text-white block mt-1 text-sm">{project.promise.deadline}</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-white/60 block text-[10px] uppercase tracking-wider font-semibold">Target Density</span>
                <span className="font-bold text-[#A8C3A0] block mt-1 text-sm tabular-nums">
                  ≥ {project.promise.targetNdvi.toFixed(2)} NDVI
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE — PROOF */}
        <div className="p-6 sm:p-8 space-y-6 bg-black/20 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#60A5FA] flex items-center gap-1.5">
                <Satellite size={15} />
                {t.proofLabel}
              </span>
              <StatusBadge status={project.status} lang={lang} size="sm" />
            </div>

            {/* Latest observation */}
            <div>
              <span className="text-[11px] text-white/60 font-semibold uppercase tracking-wider block mb-1">
                Earth Observation Finding:
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-serif-display leading-snug">
                “{project.proof.latestObservation}”
              </h3>
            </div>

            {/* Plain-language AI explanation */}
            <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-1.5 shadow-xs">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#A8C3A0]">
                <Sparkles size={14} className="text-[#A8C3A0]" />
                <span className="uppercase tracking-wider">Plain-Language Synthesis</span>
              </div>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                {project.proof.plainLanguageExplanation}
              </p>
            </div>
          </div>

          {/* Key proof indicators & recommended next action */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            {/* Visual NDVI Comparison Bar */}
            <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white/70">Observed vs Mandated Canopy:</span>
                <span className={`font-mono font-bold flex items-center gap-1 ${
                  isDeficit ? 'text-[#FF8A8A]' : 'text-[#6EE7B7]'
                }`}>
                  {isDeficit ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                  <span>{isDeficit ? `Δ ${ndviDiff.toFixed(2)} Deficit` : `Δ +${ndviDiff.toFixed(2)} Target Met`}</span>
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden flex">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${isDeficit ? 'bg-[#E5484D]' : 'bg-[#10B981]'}`}
                    style={{ width: `${Math.min(100, (project.proof.currentNdvi / 0.8) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-white/60 font-mono">
                  <span>Current: {project.proof.currentNdvi.toFixed(2)} NDVI</span>
                  <span>Target: {project.promise.targetNdvi.toFixed(2)} NDVI</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-white/60 block text-[10px] uppercase tracking-wider font-semibold">{t.recoveryTrend}</span>
                <span className="font-semibold text-white block mt-0.5">{project.proof.recoveryTrend}</span>
              </div>
              <div>
                <span className="text-white/60 block text-[10px] uppercase tracking-wider font-semibold">{t.evidenceConfidence}</span>
                <span className="font-semibold text-white block mt-0.5">{project.proof.evidenceQuality}</span>
              </div>
            </div>

            {/* Recommended Action Callout */}
            <div className="p-3.5 rounded-xl bg-[#E5484D]/15 border border-[#E5484D]/30 text-xs">
              <div className="flex items-start gap-2.5">
                <ShieldAlert size={16} className="text-[#FF8A8A] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#FF8A8A] block">{t.recommendedAction}:</span>
                  <span className="text-white/90 leading-relaxed">{project.proof.recommendedAction}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
