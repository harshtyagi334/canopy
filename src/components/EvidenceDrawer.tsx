import React, { useState } from 'react';
import { TimelineMilestone, Project, Language } from '../types';
import { translations } from '../translations';
import { StatusBadge } from './StatusBadge';
import { X, ExternalLink, Calendar, Cloud, Layers, CheckCircle2, UserCheck, ShieldAlert, Sparkles, FileText, Compass, Info } from 'lucide-react';

interface EvidenceDrawerProps {
  milestone: TimelineMilestone | null;
  project: Project;
  lang: Language;
  onClose: () => void;
  onOpenSourcePdf: () => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({
  milestone,
  project,
  lang,
  onClose,
  onOpenSourcePdf,
}) => {
  const [activeLayer, setActiveLayer] = useState<'ndvi' | 'false_color' | 'true_color'>('ndvi');
  const t = translations[lang];

  if (!milestone) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#0d261b] text-white min-h-screen shadow-2xl flex flex-col justify-between border-l border-white/20 animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Drawer Header */}
        <div className="p-6 bg-[#0a1e15] border-b border-white/10 sticky top-0 z-10 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
                <Calendar size={13} className="text-[#A8C3A0]" />
                {milestone.date}
              </span>
              <StatusBadge status={milestone.status} lang={lang} size="sm" />
            </div>
            <h3 id="drawer-title" className="text-xl sm:text-2xl font-bold text-white font-serif-display">
              {milestone.milestoneLabel}
            </h3>
            <p className="text-xs text-white/70">
              {project.name} • {project.state}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close evidence drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto subtle-scrollbar">
          {/* Layer Selector Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 bg-black/30 rounded-xl border border-white/15 text-xs">
            <span className="text-[11px] font-semibold text-white/70 px-2">Satellite Layer:</span>
            <div className="flex gap-1">
              <button
                onClick={() => setActiveLayer('ndvi')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  activeLayer === 'ndvi'
                    ? 'bg-[#3E7C59] text-white shadow-xs border border-[#A8C3A0]/30'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                NDVI Heatmap
              </button>
              <button
                onClick={() => setActiveLayer('false_color')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  activeLayer === 'false_color'
                    ? 'bg-[#3E7C59] text-white shadow-xs border border-[#A8C3A0]/30'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                False-Color NIR
              </button>
              <button
                onClick={() => setActiveLayer('true_color')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  activeLayer === 'true_color'
                    ? 'bg-[#3E7C59] text-white shadow-xs border border-[#A8C3A0]/30'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                Natural RGB
              </button>
            </div>
          </div>

          {/* Large Satellite Observation Canvas Visual */}
          <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black/40 shadow-inner">
            <svg className="w-full h-72 sm:h-80 object-cover" viewBox="0 0 600 360">
              <defs>
                <radialGradient id="drawer-sat-grad" cx="50%" cy="50%" r="70%">
                  <stop
                    offset="0%"
                    stopColor={
                      activeLayer === 'false_color'
                        ? '#6a283b'
                        : activeLayer === 'ndvi'
                        ? milestone.ndviValue > 0.45
                          ? '#1c5e32'
                          : '#425838'
                        : '#3b5245'
                    }
                  />
                  <stop offset="100%" stopColor="#102018" />
                </radialGradient>
                <pattern id="drawer-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="0.8" />
                </pattern>
              </defs>

              {/* Base terrain */}
              <rect width="600" height="360" fill="url(#drawer-sat-grad)" />
              <rect width="600" height="360" fill="url(#drawer-grid)" />

              {/* Water reservoir / stream */}
              <path d="M 450 40 Q 520 80 540 180 T 490 320" fill="none" stroke="#60A5FA" strokeOpacity="0.75" strokeWidth="16" strokeLinecap="round" />

              {/* Vegetation biomass patches */}
              <g
                fill={
                  activeLayer === 'false_color'
                    ? '#c94c4c'
                    : activeLayer === 'ndvi'
                    ? '#10B981'
                    : '#486847'
                }
                fillOpacity={activeLayer === 'ndvi' ? 0.85 : 0.7}
              >
                <ellipse cx="260" cy="180" rx={110 * (milestone.ndviValue / 0.5)} ry={80 * (milestone.ndviValue / 0.5)} />
                <ellipse cx="340" cy="160" rx={80 * (milestone.ndviValue / 0.5)} ry={60 * (milestone.ndviValue / 0.5)} />
                <ellipse cx="210" cy="220" rx={60 * (milestone.ndviValue / 0.5)} ry={45 * (milestone.ndviValue / 0.5)} />
              </g>

              {/* Mandated Compensatory Afforestation Boundary Polygon */}
              <polygon
                points="160,80 440,70 480,260 300,300 140,240"
                fill="rgba(16, 185, 129, 0.1)"
                stroke="#A8C3A0"
                strokeWidth="3.5"
                strokeDasharray="8 5"
              />

              {/* Corner pillars with IDs */}
              {[
                { x: 160, y: 80, id: 'BP-01' },
                { x: 440, y: 70, id: 'BP-02' },
                { x: 480, y: 260, id: 'BP-03' },
                { x: 300, y: 300, id: 'BP-04' },
                { x: 140, y: 240, id: 'BP-05' },
              ].map((p) => (
                <g key={p.id}>
                  <circle cx={p.x} cy={p.y} r="5" fill="#FFFFFF" stroke="#12372A" strokeWidth="2.5" />
                  <text x={p.x + 8} y={p.y - 6} fill="#FFFFFF" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    {p.id}
                  </text>
                </g>
              ))}
            </svg>

            {/* Overlaid Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              <div className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-xs font-mono text-white flex items-center gap-1.5 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-[#A8C3A0]" />
                <span>{project.mapData.caPlotHa} ha Mandated Polygon</span>
              </div>
              <div className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-xs font-mono text-white border border-white/10">
                {activeLayer.toUpperCase()} Composite
              </div>
            </div>

            <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md text-xs font-mono text-white flex items-center gap-2 border border-white/10">
              <Compass size={14} className="text-[#A8C3A0]" />
              <span>North 0° • Scale 1:5,000</span>
            </div>
          </div>

          {/* Quantitative Metrics: NDVI & Change from Baseline */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
                Mean NDVI Value
              </span>
              <div className="text-2xl font-bold text-white font-serif-display">
                {milestone.ndviValue.toFixed(2)}
              </div>
              <span className="text-[11px] text-white/60">Target: ≥ {project.promise.targetNdvi}</span>
            </div>

            <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
                Baseline Delta
              </span>
              <div className={`text-2xl font-bold font-serif-display ${
                milestone.ndviValue >= project.proof.baselineNdvi + 0.2 ? 'text-[#6EE7B7]' : 'text-[#FF8A8A]'
              }`}>
                {milestone.ndviDelta}
              </div>
              <span className="text-[11px] text-white/60">Pre-clearing: {project.proof.baselineNdvi}</span>
            </div>

            <div className="col-span-2 sm:col-span-1 p-4 rounded-xl bg-black/30 border border-white/10 space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
                Canopy Density
              </span>
              <div className="text-2xl font-bold text-white font-serif-display">
                {milestone.canopyDensity}
              </div>
              <span className="text-[11px] text-white/60">Crown cover est.</span>
            </div>
          </div>

          {/* AI Explanation & Scientific Finding */}
          <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Sparkles size={14} className="text-[#A8C3A0]" />
              <span>Multi-temporal Spectral Analysis</span>
            </div>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              {milestone.observation}
            </p>
          </div>

          {/* Field Evidence if recorded */}
          {milestone.fieldEvidence && (
            <div className={`p-4 rounded-xl border space-y-2 ${
              milestone.fieldEvidence.available
                ? 'bg-[#10B981]/15 border-[#10B981]/30 text-white'
                : 'bg-black/20 border-white/10 text-white/70'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <UserCheck size={15} className="text-[#6EE7B7]" />
                  <span>Ground Inspection Record</span>
                </span>
                {milestone.fieldEvidence.available ? (
                  <span className="px-2 py-0.5 rounded bg-[#10B981]/30 text-[#6EE7B7] font-medium text-[11px] border border-[#10B981]/40">
                    Verified Field Observation
                  </span>
                ) : (
                  <span className="text-white/60 text-[11px]">
                    No concurrent ground visit logged
                  </span>
                )}
              </div>

              {milestone.fieldEvidence.available && (
                <div className="text-xs space-y-1 pt-1 text-white/90">
                  <div className="font-semibold text-white">{milestone.fieldEvidence.inspector}:</div>
                  <p className="italic text-white/80">"{milestone.fieldEvidence.notes}"</p>
                  <div className="text-[10px] text-white/60 pt-1">Logged: {milestone.fieldEvidence.dateRecorded}</div>
                </div>
              )}
            </div>
          )}

          {/* Image & Sensor Metadata */}
          <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/60">
              Satellite Sensor Metadata
            </h4>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
              <div>
                <span className="text-white/60 block">Sensor / Platform:</span>
                <span className="font-semibold text-white">{milestone.sensor}</span>
              </div>
              <div>
                <span className="text-white/60 block">Cloud Cover Quality:</span>
                <span className="font-semibold text-[#6EE7B7]">{milestone.cloudCover}</span>
              </div>
              <div>
                <span className="text-white/60 block">Spatial Resolution:</span>
                <span className="font-semibold text-white">{milestone.metadata.resolution}</span>
              </div>
              <div>
                <span className="text-white/60 block">Solar Zenith Angle:</span>
                <span className="font-semibold text-white">{milestone.metadata.solarZenith}</span>
              </div>
              <div className="col-span-2">
                <span className="text-white/60 block">Spectral Bands:</span>
                <span className="font-mono text-[11px] text-[#A8C3A0]">{milestone.metadata.bandsUsed}</span>
              </div>
              <div className="col-span-2">
                <span className="text-white/60 block">Copernicus Scene Product ID:</span>
                <span className="font-mono text-[10px] text-white/70 break-all select-all">
                  {milestone.metadata.sceneId}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-6 bg-[#0a1e15] border-t border-white/10 sticky bottom-0 z-10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onOpenSourcePdf}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 text-xs sm:text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText size={16} className="text-[#FDBA74]" />
            <span>View Original Clearance Clause</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#3E7C59] hover:bg-[#4a9169] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer border border-[#A8C3A0]/30 shadow-md"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
