import React, { useRef } from 'react';
import { TimelineMilestone, ProjectStatus, Language } from '../types';
import { translations } from '../translations';
import { StatusBadge } from './StatusBadge';
import { ChevronLeft, ChevronRight, Calendar, Maximize2, Sparkles, Cloud, Layers } from 'lucide-react';

interface ProofTimelineProps {
  timeline: TimelineMilestone[];
  lang: Language;
  onSelectMilestone: (m: TimelineMilestone) => void;
  selectedMilestoneId?: string;
}

export const ProofTimeline: React.FC<ProofTimelineProps> = ({
  timeline,
  lang,
  onSelectMilestone,
  selectedMilestoneId,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="space-y-4">
      {/* Header with Title and Scroll buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif-display">
              {t.proofTimelineTitle}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[#A8C3A0] font-semibold">
              {timeline.length} Milestones
            </span>
          </div>
          <p className="text-xs sm:text-sm text-white/70">
            {t.proofTimelineSubtitle}
          </p>
        </div>

        {/* Scroll navigation arrows for desktop */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2.5 rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer shadow-xs active:scale-95"
            aria-label="Scroll timeline backward"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2.5 rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer shadow-xs active:scale-95"
            aria-label="Scroll timeline forward"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Horizontally scrollable timeline on desktop, vertically stacked on mobile */}
      <div
        ref={scrollContainerRef}
        className="flex flex-col sm:flex-row sm:overflow-x-auto gap-4 sm:gap-5 pb-4 subtle-scrollbar scroll-smooth"
      >
        {timeline.map((m) => {
          const isSelected = selectedMilestoneId === m.id;

          return (
            <div
              key={m.id}
              onClick={() => onSelectMilestone(m)}
              className={`group cursor-pointer shrink-0 w-full sm:w-[330px] bg-white/10 backdrop-blur-md rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between hover:shadow-xl ${
                isSelected
                  ? 'border-[#A8C3A0] ring-2 ring-[#A8C3A0]/40 shadow-xl'
                  : 'border-white/15 hover:border-[#A8C3A0]/60'
              }`}
              id={`milestone-card-${m.id}`}
            >
              {/* Card Header */}
              <div className="p-4 sm:p-4.5 border-b border-white/10 space-y-1.5 bg-black/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#A8C3A0]" />
                    <span className="tabular-nums font-mono">{m.date}</span>
                  </span>
                  <StatusBadge status={m.status} lang={lang} size="sm" />
                </div>
                <h4 className="text-sm font-bold text-white font-serif-display line-clamp-1">
                  {m.milestoneLabel}
                </h4>
              </div>

              {/* Satellite Image Visual with Demarcated Plantation Boundary */}
              <div className="relative h-44 bg-[#0a1f16] overflow-hidden">
                {/* SVG Synthetic Multi-spectral imagery representation */}
                <svg className="w-full h-full object-cover" viewBox="0 0 320 180" preserveAspectRatio="none">
                  <defs>
                    <radialGradient id={`sat-bg-${m.id}`} cx="50%" cy="50%" r="70%">
                      <stop offset="0%" stopColor={m.satelliteLayer === 'false_color' ? '#5a2233' : m.satelliteLayer === 'ndvi' ? '#184728' : '#344e41'} />
                      <stop offset="100%" stopColor="#0c2017" />
                    </radialGradient>
                    <pattern id={`soil-grain-${m.id}`} width="12" height="12" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="0.8" fill="#ffffff" fillOpacity="0.08" />
                      <circle cx="8" cy="7" r="0.6" fill="#ffffff" fillOpacity="0.05" />
                    </pattern>
                  </defs>

                  {/* Terrain background base */}
                  <rect width="320" height="180" fill={`url(#sat-bg-${m.id})`} />
                  <rect width="320" height="180" fill={`url(#soil-grain-${m.id})`} />

                  {/* Natural terrain contour lines */}
                  <path d="M 0 60 Q 90 40 180 80 T 320 50" fill="none" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1" />
                  <path d="M 0 120 Q 140 150 250 110 T 320 140" fill="none" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1" />

                  {/* Water feature */}
                  <path d="M 240 20 Q 280 40 290 80 T 260 160" fill="none" stroke="#247BA0" strokeOpacity="0.7" strokeWidth="8" strokeLinecap="round" />

                  {/* Vegetation patches inside and around */}
                  <g fill={m.ndviValue > 0.45 ? '#43895a' : '#52694b'} fillOpacity={m.ndviValue * 0.9}>
                    <ellipse cx="140" cy="90" rx={45 * (m.ndviValue / 0.5)} ry={35 * (m.ndviValue / 0.5)} />
                    <ellipse cx="180" cy="85" rx={35 * (m.ndviValue / 0.5)} ry={28 * (m.ndviValue / 0.5)} />
                    <ellipse cx="120" cy="115" rx={28 * (m.ndviValue / 0.5)} ry={22 * (m.ndviValue / 0.5)} />
                  </g>

                  {/* Clearly visible plantation boundary outline (Forest Green / White Dash) */}
                  <polygon
                    points="90,45 230,40 250,135 160,155 80,120"
                    fill="none"
                    stroke="#A8C3A0"
                    strokeWidth="2.5"
                    strokeDasharray="5 3"
                  />

                  {/* Corner boundary pillar markers */}
                  <circle cx="90" cy="45" r="3" fill="#ffffff" stroke="#12372A" strokeWidth="1.5" />
                  <circle cx="230" cy="40" r="3" fill="#ffffff" stroke="#12372A" strokeWidth="1.5" />
                  <circle cx="250" cy="135" r="3" fill="#ffffff" stroke="#12372A" strokeWidth="1.5" />
                  <circle cx="160" cy="155" r="3" fill="#ffffff" stroke="#12372A" strokeWidth="1.5" />
                  <circle cx="80" cy="120" r="3" fill="#ffffff" stroke="#12372A" strokeWidth="1.5" />
                </svg>

                {/* Plantation Boundary label overlay */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[10px] font-mono text-white flex items-center gap-1 border border-white/15">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A8C3A0]" />
                  <span>Mandated CA Polygon</span>
                </div>

                {/* NDVI Indicator badge */}
                <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-xs text-xs font-mono text-white flex items-center gap-1.5 shadow-md border border-white/15">
                  <span className="text-[#A8C3A0] font-bold">NDVI:</span>
                  <span className="font-semibold tabular-nums">{m.ndviValue.toFixed(2)}</span>
                </div>

                {/* Inspect hover action icon */}
                <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-white/20 hover:bg-white/40 backdrop-blur-xs flex items-center justify-center text-white transition-opacity">
                  <Maximize2 size={13} />
                </div>
              </div>

              {/* Card Footer: Metadata & One-sentence observation */}
              <div className="p-4 sm:p-4.5 space-y-3 bg-black/25">
                {/* Small source / date / cloud-quality label */}
                <div className="flex items-center justify-between text-[11px] text-white/60">
                  <span className="font-medium text-white/80 flex items-center gap-1">
                    <Layers size={11} className="text-[#60A5FA]" />
                    {m.sensor}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[10px] text-white/60">
                    <Cloud size={11} />
                    {m.cloudCover}
                  </span>
                </div>

                {/* One-sentence observation */}
                <p className="text-xs text-white/80 leading-relaxed line-clamp-2">
                  {m.observation}
                </p>

                {/* Action CTA hint */}
                <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-[#6EE7B7] font-mono font-semibold">{m.ndviDelta}</span>
                  <span className="text-[#A8C3A0] font-bold group-hover:text-white flex items-center gap-0.5">
                    <span>{t.viewDetails}</span>
                    <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
