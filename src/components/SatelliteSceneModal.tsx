import React, { useState } from 'react';
import { Project, Language } from '../types';
import { translations } from '../translations';
import { SatelliteViewer, SatelliteBandMode } from './SatelliteViewer';
import { StatusBadge } from './StatusBadge';
import {
  X,
  Satellite,
  Layers,
  Calendar,
  Cloud,
  MapPin,
  Compass,
  FileCheck,
  ShieldAlert,
  Download,
  Info,
  ExternalLink,
  Cpu,
  Radio,
  Sparkles
} from 'lucide-react';

interface SatelliteSceneModalProps {
  project: Project;
  lang: Language;
  onClose: () => void;
  onNavigateToDetail?: () => void;
}

export const SatelliteSceneModal: React.FC<SatelliteSceneModalProps> = ({
  project,
  lang,
  onClose,
  onNavigateToDetail,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'interactive' | 'multispectral' | 'metadata'>('interactive');
  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="w-full max-w-5xl bg-[#0e271d] text-white rounded-3xl border border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Navigation Bar */}
        <div className="p-5 sm:p-6 bg-[#0a1e15] border-b border-white/15 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-[#A8C3A0] border border-white/15 flex items-center gap-1.5">
                <Satellite size={12} className="text-[#A8C3A0]" />
                <span>Copernicus Earth Observation Stream</span>
              </span>
              <StatusBadge status={project.status} lang={lang} size="sm" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-display text-white">
              {project.name} • Satellite Imagery Observatory
            </h2>
            <p className="text-xs text-white/70 flex items-center gap-2">
              <MapPin size={12} className="text-[#A8C3A0]" />
              <span>{project.district}, {project.state} ({project.mapData.coordinatesDisplay})</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/15"
            aria-label="Close Satellite Observatory"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-6 py-2 bg-black/30 border-b border-white/10 flex items-center gap-3 text-xs">
          <button
            onClick={() => setActiveSubTab('interactive')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              activeSubTab === 'interactive'
                ? 'bg-[#3E7C59] text-white shadow-xs border border-[#A8C3A0]/40'
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            Interactive Satellite Viewport
          </button>
          <button
            onClick={() => setActiveSubTab('multispectral')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              activeSubTab === 'multispectral'
                ? 'bg-[#3E7C59] text-white shadow-xs border border-[#A8C3A0]/40'
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            4-Band Spectral Comparison Matrix
          </button>
          <button
            onClick={() => setActiveSubTab('metadata')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              activeSubTab === 'metadata'
                ? 'bg-[#3E7C59] text-white shadow-xs border border-[#A8C3A0]/40'
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            Orbital Scene Telemetry & Audit
          </button>
        </div>

        {/* Modal Scrollable Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 subtle-scrollbar">
          {activeSubTab === 'interactive' && (
            <div className="space-y-6">
              <SatelliteViewer
                project={project}
                lang={lang}
                initialBand="false_color"
                showTimelineSelector={true}
              />

              {/* Bottom Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-black/25 border border-white/10 space-y-1">
                  <span className="text-white/60 block text-[10px] uppercase font-semibold">Current Mean NDVI</span>
                  <span className="text-xl font-bold text-white font-mono">{project.proof.currentNdvi.toFixed(2)}</span>
                  <span className="text-[11px] text-[#A8C3A0] block">Target: ≥ {project.promise.targetNdvi}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/25 border border-white/10 space-y-1">
                  <span className="text-white/60 block text-[10px] uppercase font-semibold">Mandated CA Plot</span>
                  <span className="text-xl font-bold text-white font-mono">{project.mapData.caPlotHa} ha</span>
                  <span className="text-[11px] text-white/60 block">Cadastral Survey</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/25 border border-white/10 space-y-1">
                  <span className="text-white/60 block text-[10px] uppercase font-semibold">SAR Radar Backscatter</span>
                  <span className="text-xl font-bold text-[#74BDE0] font-mono">{project.technicalEvidence.sarBackscatterDb.split(' ')[0]}</span>
                  <span className="text-[11px] text-white/60 block">C-Band VH/VV</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/25 border border-white/10 space-y-1">
                  <span className="text-white/60 block text-[10px] uppercase font-semibold">Cloud-Free Passes</span>
                  <span className="text-xl font-bold text-[#6EE7B7] font-mono">{project.technicalEvidence.cloudFreeObservations} scenes</span>
                  <span className="text-[11px] text-white/60 block">Verified Sentinel-2</span>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'multispectral' && (
            <div className="space-y-4">
              <div className="text-xs text-white/70">
                Direct comparative view of all 4 spectral sensor representations for {project.name}:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. True Color RGB */}
                <div className="p-4 rounded-2xl bg-black/30 border border-white/15 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-white">
                    <span>1. Natural True Color (RGB: B04, B03, B02)</span>
                    <span className="text-[10px] font-mono text-[#A8C3A0]">10m GSD</span>
                  </div>
                  <div className="h-44 rounded-xl overflow-hidden border border-white/10">
                    <SatelliteViewer project={project} compact={true} initialBand="true_color" showTimelineSelector={false} />
                  </div>
                  <p className="text-[11px] text-white/70 leading-snug">
                    Standard human-eye optical representation revealing cleared access roads, surface water drainage, and soil coloration.
                  </p>
                </div>

                {/* 2. False Color NIR */}
                <div className="p-4 rounded-2xl bg-black/30 border border-white/15 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#FFA8A8]">
                    <span>2. Near-Infrared False Color (NIR: B08, B04, B03)</span>
                    <span className="text-[10px] font-mono text-[#FFA8A8]">Chlorophyll Active</span>
                  </div>
                  <div className="h-44 rounded-xl overflow-hidden border border-white/10">
                    <SatelliteViewer project={project} compact={true} initialBand="false_color" showTimelineSelector={false} />
                  </div>
                  <p className="text-[11px] text-white/70 leading-snug">
                    Vigorous green vegetation reflects heavily in Near-Infrared wavelengths, appearing vivid ruby red against inert soil.
                  </p>
                </div>

                {/* 3. NDVI Raster Heatmap */}
                <div className="p-4 rounded-2xl bg-black/30 border border-white/15 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#6EE7B7]">
                    <span>3. NDVI Spectral Biomass Heatmap</span>
                    <span className="text-[10px] font-mono text-[#6EE7B7]">Graded 0.0 - 1.0</span>
                  </div>
                  <div className="h-44 rounded-xl overflow-hidden border border-white/10">
                    <SatelliteViewer project={project} compact={true} initialBand="ndvi" showTimelineSelector={false} />
                  </div>
                  <p className="text-[11px] text-white/70 leading-snug">
                    Normalized Difference Vegetation Index calculating photosynthetically active canopy density per 100m² ground cell.
                  </p>
                </div>

                {/* 4. Sentinel-1 SAR Radar */}
                <div className="p-4 rounded-2xl bg-black/30 border border-white/15 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#74BDE0]">
                    <span>4. Sentinel-1 C-SAR Radar Backscatter</span>
                    <span className="text-[10px] font-mono text-[#74BDE0]">All-Weather Radar</span>
                  </div>
                  <div className="h-44 rounded-xl overflow-hidden border border-white/10">
                    <SatelliteViewer project={project} compact={true} initialBand="sar_radar" showTimelineSelector={false} />
                  </div>
                  <p className="text-[11px] text-white/70 leading-snug">
                    Dual-polarized active microwave pulses penetrate cloud layers to quantify woody biomass structure and soil moisture roughness.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'metadata' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-black/30 border border-white/15 space-y-4 text-xs">
                <h4 className="text-sm font-bold text-white font-serif-display flex items-center gap-2">
                  <Cpu size={16} className="text-[#A8C3A0]" />
                  <span>Orbital Constellation Ingestion & Evidentiary Provenance</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-white/60 block text-[10px] uppercase font-semibold">Copernicus Scene Product</span>
                    <span className="font-mono text-white text-xs block truncate">{project.technicalEvidence.sentinelSceneId}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-white/60 block text-[10px] uppercase font-semibold">Bounding Box Lat/Long</span>
                    <span className="font-mono text-[#A8C3A0] text-xs block">{project.technicalEvidence.latLongBBox}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-white/60 block text-[10px] uppercase font-semibold">Sensor Constellation</span>
                    <span className="text-white text-xs block">{project.technicalEvidence.sensorConstellation}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-white/60 block text-[10px] uppercase font-semibold">Atmospheric Correction</span>
                    <span className="text-[#6EE7B7] text-xs block">Sen2Cor Level-2A Bottom-Of-Atmosphere (BOA)</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <span className="font-semibold text-white block">Chain of Custody Cryptographic Hash:</span>
                  <div className="p-2 rounded-lg bg-black/50 font-mono text-[11px] text-[#A8C3A0] break-all border border-white/10">
                    sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                  </div>
                  <span className="text-[11px] text-white/60 block">
                    Statutorily admissible under Section 65B of the Indian Evidence Act for National Green Tribunal submission.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-5 bg-[#0a1e15] border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-white/70">
            <span>Viewing Sentinel-2 10m Ground Sample Resolution Imagery</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onNavigateToDetail && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToDetail();
                }}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Full Project Dossier</span>
                <ExternalLink size={13} />
              </button>
            )}

            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#3E7C59] hover:bg-[#4a9169] text-white font-semibold transition-all cursor-pointer shadow-md border border-[#A8C3A0]/30"
            >
              Close Satellite View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
