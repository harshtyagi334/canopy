import React, { useState } from 'react';
import { Project, Language } from '../types';
import { translations } from '../translations';
import { ChevronDown, ChevronUp, Cpu, Radio, Droplets, CloudSun, Eye, Activity, ShieldCheck, FileCheck } from 'lucide-react';

interface TechnicalEvidenceProps {
  project: Project;
  lang: Language;
}

export const TechnicalEvidence: React.FC<TechnicalEvidenceProps> = ({ project, lang }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = translations[lang];

  return (
    <section className="space-y-4">
      {/* Progressive Disclosure Toggle Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Cpu size={18} className="text-[#A8C3A0]" />
              <h3 className="text-lg sm:text-xl font-bold text-white font-serif-display">
                {t.technicalEvidenceTitle}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-white/70">
              {t.technicalEvidenceSubtitle}
            </p>
          </div>

          <button
            id="toggle-technical-evidence-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-xs sm:text-sm font-semibold text-white transition-all self-start sm:self-auto cursor-pointer shadow-xs"
          >
            <span>{isExpanded ? t.collapseTechnical : t.expandTechnical}</span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* Expanded Deep Scientific & Sensor Metrics */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-white/10 space-y-6 animate-in fade-in duration-200">
            {/* 4 Technical Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Radar SAR Backscatter */}
              <div className="p-4 rounded-xl bg-black/25 border border-white/10 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <Radio size={14} className="text-[#60A5FA]" />
                  <span>Sentinel-1 SAR Radar</span>
                </div>
                <div className="text-lg font-bold text-white font-mono">
                  {project.technicalEvidence.sarBackscatterDb}
                </div>
                <p className="text-[11px] text-white/60 leading-snug">
                  C-band dual polarization (VH/VV) penetration past dry grass cover to sense woody stems.
                </p>
              </div>

              {/* Surface Canopy Cover */}
              <div className="p-4 rounded-xl bg-black/25 border border-white/10 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <Activity size={14} className="text-[#10B981]" />
                  <span>Canopy Cover Fraction</span>
                </div>
                <div className="text-lg font-bold text-white font-mono">
                  {project.technicalEvidence.canopyCoverPercent}%
                </div>
                <p className="text-[11px] text-white/60 leading-snug">
                  Calculated from Sentinel-2 10m spectral unmixing model over the 100 ha plot.
                </p>
              </div>

              {/* Moisture & Soil Index */}
              <div className="p-4 rounded-xl bg-black/25 border border-white/10 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <Droplets size={14} className="text-[#60A5FA]" />
                  <span>NDWI Moisture Index</span>
                </div>
                <div className="text-lg font-bold text-white font-mono">
                  {project.technicalEvidence.moistureIndex.toFixed(2)}
                </div>
                <p className="text-[11px] text-white/60 leading-snug">
                  Normalized Difference Water Index assessing plant cellular water retention.
                </p>
              </div>

              {/* Quality Observations */}
              <div className="p-4 rounded-xl bg-black/25 border border-white/10 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <CloudSun size={14} className="text-[#FDBA74]" />
                  <span>Cloud-Free Passes</span>
                </div>
                <div className="text-lg font-bold text-white font-mono">
                  {project.technicalEvidence.cloudFreeObservations} Scenes
                </div>
                <p className="text-[11px] text-white/60 leading-snug">
                  Zero cloud contamination passes used for time-series smoothing and outlier rejection.
                </p>
              </div>
            </div>

            {/* Advanced Multi-Spectral Reflectance Breakdown Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/60">
                Spectral Band Calibration & Sensor Products
              </h4>
              <div className="overflow-x-auto rounded-xl border border-white/15">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/40 text-[#A8C3A0] border-b border-white/15 font-semibold">
                    <tr>
                      <th className="py-2.5 px-4">Band / Sensor Layer</th>
                      <th className="py-2.5 px-4">Wavelength / Polarisation</th>
                      <th className="py-2.5 px-4">Resolution</th>
                      <th className="py-2.5 px-4">Latest Plot Value</th>
                      <th className="py-2.5 px-4">Interpretation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-white/80 bg-black/20">
                    <tr>
                      <td className="py-2.5 px-4 font-mono font-semibold text-white">B04 (Red)</td>
                      <td className="py-2.5 px-4">665 nm</td>
                      <td className="py-2.5 px-4">10 m</td>
                      <td className="py-2.5 px-4 font-mono text-white">0.182 BOA</td>
                      <td className="py-2.5 px-4 text-white/60">High reflectance indicative of dry bare soil exposure</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-mono font-semibold text-white">B08 (NIR)</td>
                      <td className="py-2.5 px-4">842 nm</td>
                      <td className="py-2.5 px-4">10 m</td>
                      <td className="py-2.5 px-4 font-mono text-white">0.345 BOA</td>
                      <td className="py-2.5 px-4 text-white/60">Moderate cellular scattering; low dense canopy structure</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-mono font-semibold text-white">B11 (SWIR-1)</td>
                      <td className="py-2.5 px-4">1610 nm</td>
                      <td className="py-2.5 px-4">20 m</td>
                      <td className="py-2.5 px-4 font-mono text-white">0.291 BOA</td>
                      <td className="py-2.5 px-4 text-white/60">Elevated soil dryness; low soil-moisture retention</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-mono font-semibold text-white">Sentinel-1 VH</td>
                      <td className="py-2.5 px-4">5.405 GHz (C-Band)</td>
                      <td className="py-2.5 px-4">10 m</td>
                      <td className="py-2.5 px-4 font-mono text-white">{project.technicalEvidence.sarBackscatterDb}</td>
                      <td className="py-2.5 px-4 text-white/60">Limited volume scattering from multi-tiered tree branches</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Scientific Rigor & Cadastral Reference Information */}
            <div className="p-4 rounded-xl bg-black/30 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-semibold text-white block">Bounding Box & Scene Reference:</span>
                <span className="font-mono text-white/70">{project.technicalEvidence.latLongBBox}</span>
              </div>
              <div className="text-[11px] text-[#A8C3A0] font-mono">
                Product: {project.technicalEvidence.sentinelSceneId}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
