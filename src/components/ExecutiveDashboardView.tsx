import React, { useState, useMemo } from 'react';
import { Project, Language, ProjectStatus } from '../types';
import { translations } from '../translations';
import { StatusBadge } from './StatusBadge';
import { SatelliteViewer } from './SatelliteViewer';
import { SatelliteSceneModal } from './SatelliteSceneModal';
import { EvidenceReportModal } from './EvidenceReportModal';
import {
  ShieldCheck,
  Trees,
  Satellite,
  AlertOctagon,
  CheckCircle2,
  TrendingUp,
  MapPin,
  ArrowRight,
  Activity,
  Layers,
  FileText,
  Clock,
  Sparkles,
  Maximize2,
  Sliders,
  Eye,
  FileCheck,
  Printer,
  Download,
  Search,
  X,
  Filter
} from 'lucide-react';

interface ExecutiveDashboardViewProps {
  projects: Project[];
  lang: Language;
  onSelectProject: (p: Project) => void;
  onNavigateToProjects: () => void;
  onNavigateToPipeline: () => void;
  onNavigateToExplorer?: () => void;
  onOpenUpload: () => void;
}

export const ExecutiveDashboardView: React.FC<ExecutiveDashboardViewProps> = ({
  projects,
  lang,
  onSelectProject,
  onNavigateToProjects,
  onNavigateToPipeline,
  onNavigateToExplorer,
  onOpenUpload,
}) => {
  const t = translations[lang];

  const [activeSatelliteProjectId, setActiveSatelliteProjectId] = useState<string>(
    projects[0]?.id || ''
  );
  const [parcelSearchQuery, setParcelSearchQuery] = useState('');
  const [parcelStatusFilter, setParcelStatusFilter] = useState<'all' | ProjectStatus>('all');
  const [satelliteModalProject, setSatelliteModalProject] = useState<Project | null>(null);
  const [reportModalProject, setReportModalProject] = useState<Project | null>(null);
  const [autoPrintOnOpen, setAutoPrintOnOpen] = useState(false);

  // Filtered parcels for direct satellite inspection
  const filteredParcels = useMemo(() => {
    const q = parcelSearchQuery.toLowerCase().trim();
    return projects.filter((p) => {
      // Name
      const matchesName =
        p.name.toLowerCase().includes(q) ||
        p.proponent.toLowerCase().includes(q) ||
        (p.promise?.shortClaim && p.promise.shortClaim.toLowerCase().includes(q));

      // Location
      const loc = `${p.district} ${p.state} ${p.mapData?.caPlotName || ''} ${p.mapData?.surveyNumbers || ''}`.toLowerCase();
      const matchesLocation = loc.includes(q);

      // Clearance Status
      const statusLabel = (t.statusLabels[p.status] || '').toLowerCase();
      const statusRaw = p.status.toLowerCase().replace(/_/g, ' ');
      const clearanceRef = (p.clearanceFileRef || '').toLowerCase();
      const statusKeywords: string[] = [];
      if (p.status === 'field_verification_priority') {
        statusKeywords.push('priority', 'urgent', 'deficit', 'flagged', 'high risk');
      } else if (p.status === 'evidence_discrepancy') {
        statusKeywords.push('discrepancy', 'mismatch', 'anomaly');
      } else if (p.status === 'monitoring_required') {
        statusKeywords.push('monitoring', 'supervision');
      } else if (p.status === 'likely_recovery') {
        statusKeywords.push('recovery', 'compliant', 'climax', 'success');
      }

      const matchesStatus =
        statusLabel.includes(q) ||
        statusRaw.includes(q) ||
        clearanceRef.includes(q) ||
        statusKeywords.some((kw) => kw.includes(q) || q.includes(kw));

      const matchesSearch = !q || matchesName || matchesLocation || matchesStatus;
      const matchesStatusFilter = parcelStatusFilter === 'all' || p.status === parcelStatusFilter;

      return matchesSearch && matchesStatusFilter;
    });
  }, [projects, parcelSearchQuery, parcelStatusFilter, t]);

  // Ensure active parcel is selected correctly
  const activeSatelliteProject = useMemo(() => {
    const found = filteredParcels.find((p) => p.id === activeSatelliteProjectId);
    if (found) return found;
    if (filteredParcels.length > 0) return filteredParcels[0];
    return projects[0];
  }, [filteredParcels, activeSatelliteProjectId, projects]);

  const handlePrintReport = (project: Project, autoPrint = true) => {
    setAutoPrintOnOpen(autoPrint);
    setReportModalProject(project);
  };

  const totalAreaHa = projects.reduce((acc, p) => acc + (p.mapData?.caPlotHa || 0), 0);
  const totalImpactHa = projects.reduce((acc, p) => acc + (p.mapData?.impactAreaHa || 0), 0);
  const priorityProjects = projects.filter(
    (p) => p.status === 'field_verification_priority' || p.status === 'evidence_discrepancy'
  );
  const compliantProjects = projects.filter((p) => p.status === 'likely_recovery');

  // State grouping
  const stateStats = projects.reduce((acc, p) => {
    acc[p.state] = acc[p.state] || { count: 0, area: 0, priority: 0 };
    acc[p.state].count += 1;
    acc[p.state].area += p.mapData?.caPlotHa || 0;
    if (p.status === 'field_verification_priority' || p.status === 'evidence_discrepancy') {
      acc[p.state].priority += 1;
    }
    return acc;
  }, {} as Record<string, { count: number; area: number; priority: number }>);

  return (
    <div className="space-y-8 py-6 sm:py-8 w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12">
      {/* Executive Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-[#A8C3A0]">
            <ShieldCheck size={14} className="text-[#A8C3A0]" />
            <span>Autonomous Statutory Compliance Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-serif-display tracking-tight">
            National Environmental Telemetry Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
            Real-time cross-verification of CAMPA afforestation mandates against European Space Agency Sentinel-2 multi-spectral reflectance and Copernicus SAR radar ground observations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onNavigateToExplorer && (
            <button
              onClick={onNavigateToExplorer}
              className="h-10 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Satellite size={15} className="text-[#74BDE0]" />
              <span>Satellite Explorer</span>
            </button>
          )}
          <button
            onClick={onNavigateToPipeline}
            className="h-10 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Layers size={15} className="text-[#A8C3A0]" />
            <span>Open Pipeline DAGs</span>
          </button>
          <button
            onClick={onOpenUpload}
            className="h-10 px-4 rounded-xl bg-[#3E7C59] hover:bg-[#4a9169] text-white border border-[#A8C3A0]/30 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <span>Upload Clearance PDF</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 shadow-md flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs text-white/70">
            <span className="uppercase text-[10px] tracking-wider font-semibold">Active Parcels</span>
            <Trees size={16} className="text-[#A8C3A0]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-serif-display tabular-nums">
            {projects.length} Parcels
          </div>
          <div className="text-xs text-white/60 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span>100% Sat-Pass Coverage</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 shadow-md flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs text-white/70">
            <span className="uppercase text-[10px] tracking-wider font-semibold">Audited Afforestation</span>
            <Satellite size={16} className="text-[#60A5FA]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-serif-display tabular-nums">
            {totalAreaHa.toFixed(1)} ha
          </div>
          <div className="text-xs text-white/60">
            Mandated compensatory offset
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 shadow-md flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs text-white/70">
            <span className="uppercase text-[10px] tracking-wider font-semibold">Immediate Inspection</span>
            <AlertOctagon size={16} className="text-[#FF8A8A]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#FF8A8A] font-serif-display tabular-nums">
            {priorityProjects.length} Flagged
          </div>
          <div className="text-xs text-[#FF8A8A]/80">
            Persistent biomass deficit detected
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 shadow-md flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs text-white/70">
            <span className="uppercase text-[10px] tracking-wider font-semibold">Evidence Confidence</span>
            <CheckCircle2 size={16} className="text-[#6EE7B7]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-serif-display tabular-nums">
            94.2%
          </div>
          <div className="text-xs text-[#6EE7B7]">
            Multi-sensor consensus index
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DIRECT SATELLITE EARTH OBSERVATION LIVE CONSOLE                           */}
      {/* ========================================================================= */}
      <section className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/15 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#247BA0]/30 border border-[#74BDE0]/40 text-xs font-semibold text-[#74BDE0]">
              <Satellite size={14} />
              <span className="uppercase tracking-wider text-[11px] font-mono">Direct Orbital Stream</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-display text-white">
              Direct Satellite Earth Observation Console
            </h2>
            <p className="text-xs sm:text-sm text-white/75">
              Live multi-spectral and radar telemetry from European Space Agency Copernicus Sentinel-2 MSI & Sentinel-1 SAR.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handlePrintReport(activeSatelliteProject, true)}
              className="h-9 px-3.5 rounded-xl bg-[#3E7C59] hover:bg-[#4a9169] text-white border border-[#A8C3A0]/40 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-md"
              title="Print formal statutory compliance report for this parcel as PDF"
            >
              <Printer size={13} className="text-[#A8C3A0]" />
              <span>Print Compliance PDF</span>
            </button>
            <button
              onClick={() => setSatelliteModalProject(activeSatelliteProject)}
              className="h-9 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Maximize2 size={13} className="text-[#A8C3A0]" />
              <span>Expand Observatory</span>
            </button>
            <button
              onClick={() => onSelectProject(activeSatelliteProject)}
              className="h-9 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Statutory Audit</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Search & Filter Bar for Executive Monitored Parcels */}
        <div className="bg-black/30 p-3 sm:p-4 rounded-2xl border border-white/10 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
              <input
                type="text"
                value={parcelSearchQuery}
                onChange={(e) => setParcelSearchQuery(e.target.value)}
                placeholder="Search parcels by name, location (state/district), or clearance status..."
                className="w-full pl-10 pr-9 h-9.5 rounded-xl border border-white/15 bg-black/40 text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-[#3E7C59] placeholder:text-white/40 transition-all"
              />
              {parcelSearchQuery && (
                <button
                  onClick={() => setParcelSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-1 cursor-pointer"
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 shrink-0">
              {(
                [
                  { id: 'all', label: 'All Parcels' },
                  { id: 'field_verification_priority', label: 'Priority' },
                  { id: 'evidence_discrepancy', label: 'Discrepancy' },
                  { id: 'likely_recovery', label: 'Recovery' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setParcelStatusFilter(f.id)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-medium shrink-0 ${
                    parcelStatusFilter === f.id
                      ? 'bg-[#3E7C59] text-white border-[#A8C3A0]/60 shadow-xs'
                      : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-white/60 font-mono">
            <span>
              Showing <strong className="text-white">{filteredParcels.length}</strong> of {projects.length} parcels
            </span>
            {(parcelSearchQuery || parcelStatusFilter !== 'all') && (
              <button
                onClick={() => {
                  setParcelSearchQuery('');
                  setParcelStatusFilter('all');
                }}
                className="text-[#FF8A8A] hover:text-white cursor-pointer font-sans"
              >
                Reset filter
              </button>
            )}
          </div>
        </div>

        {/* Project Selector Ribbon for Satellite Imagery */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-white/60 font-semibold block">
            Select Active Monitored Parcel:
          </span>
          {filteredParcels.length === 0 ? (
            <div className="bg-black/20 rounded-2xl border border-dashed border-white/15 p-6 text-center text-xs text-white/60">
              No parcels match &ldquo;{parcelSearchQuery}&rdquo;. Try adjusting your search or status filter.
            </div>
          ) : (
            <div className="flex gap-2.5 overflow-x-auto pb-2 subtle-scrollbar">
              {filteredParcels.map((p) => {
                const isSelected = activeSatelliteProject.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActiveSatelliteProjectId(p.id)}
                    className={`px-4 py-3 rounded-2xl border text-left shrink-0 transition-all cursor-pointer flex flex-col justify-between space-y-1.5 ${
                      isSelected
                        ? 'bg-[#3E7C59] text-white border-[#A8C3A0] shadow-lg ring-2 ring-[#A8C3A0]/40'
                        : 'bg-black/30 hover:bg-black/50 text-white/80 border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold font-serif-display line-clamp-1">
                        {p.name}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold ${
                          p.status === 'likely_recovery'
                            ? 'bg-[#10B981]/20 text-[#6EE7B7]'
                            : 'bg-[#E5484D]/20 text-[#FFA8A8]'
                        }`}
                      >
                        NDVI {p.proof.currentNdvi.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-white/70">
                      <MapPin size={11} className={isSelected ? 'text-[#A8C3A0]' : 'text-white/50'} />
                      <span>{p.district}, {p.state} • {p.mapData.caPlotHa} ha</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Embedded Interactive Satellite Viewer */}
        <SatelliteViewer
          key={activeSatelliteProject.id}
          project={activeSatelliteProject}
          lang={lang}
          initialBand="false_color"
          showTimelineSelector={true}
          onOpenFullscreen={() => setSatelliteModalProject(activeSatelliteProject)}
        />
      </section>

      {/* Two Columns: State Breakdown & Flagged Action Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: State Distribution (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-6 shadow-md space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white font-serif-display">
                  State-by-State Compliance Landscape
                </h3>
                <p className="text-xs text-white/70">
                  Regional compensatory plantation progress vs statutory mandates
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white/10 text-[#A8C3A0] border border-white/15">
                4 Jurisdictions
              </span>
            </div>

            <div className="space-y-4">
              {Object.entries(stateStats).map(([stName, data]: [string, { count: number; area: number; priority: number }]) => {
                const complianceRatio = Math.max(10, Math.round(((data.count - data.priority) / data.count) * 100));
                return (
                  <div key={stName} className="p-4 rounded-xl bg-black/25 border border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-[#A8C3A0]" />
                        <span className="font-semibold text-white text-sm">{stName}</span>
                      </div>
                      <div className="flex items-center gap-3 font-mono text-xs">
                        <span className="text-white/70">{data.area.toFixed(1)} ha</span>
                        {data.priority > 0 ? (
                          <span className="text-[#FF8A8A] font-semibold">{data.priority} flagged</span>
                        ) : (
                          <span className="text-[#6EE7B7] font-semibold">100% verified</span>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          complianceRatio > 75 ? 'bg-[#10B981]' : complianceRatio > 40 ? 'bg-[#F59E0B]' : 'bg-[#E5484D]'
                        }`}
                        style={{ width: `${complianceRatio}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-white/60">
              <span>Updated automatically every 5 days via Sentinel-2 orbital pass</span>
              <button
                onClick={onNavigateToProjects}
                className="text-[#A8C3A0] hover:text-white font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>View all parcels</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Environmental Telemetry Constellation Status */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-6 shadow-md space-y-4">
            <h3 className="text-lg font-bold text-white font-serif-display flex items-center gap-2">
              <Satellite size={18} className="text-[#A8C3A0]" />
              <span>Copernicus Sensor Health & Data Ingestion Stream</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-black/20 border border-white/10 space-y-1">
                <span className="text-white/60 block text-[10px] uppercase font-semibold">Optical Sensor</span>
                <span className="text-white font-bold text-sm block">Sentinel-2A/B MSI</span>
                <span className="text-[#6EE7B7] block text-[11px]">10m L2A BOA Reflectance</span>
              </div>
              <div className="p-3 rounded-xl bg-black/20 border border-white/10 space-y-1">
                <span className="text-white/60 block text-[10px] uppercase font-semibold">Synthetic Aperture Radar</span>
                <span className="text-white font-bold text-sm block">Sentinel-1 C-SAR</span>
                <span className="text-[#6EE7B7] block text-[11px]">Dual-Polarized VH/VV</span>
              </div>
              <div className="p-3 rounded-xl bg-black/20 border border-white/10 space-y-1">
                <span className="text-white/60 block text-[10px] uppercase font-semibold">Statutory NLP Parser</span>
                <span className="text-white font-bold text-sm block">MoEFCC Legal OCR</span>
                <span className="text-[#6EE7B7] block text-[11px]">Sha256 Audit Trail</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: High-Priority Verification Queue */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-6 shadow-md space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertOctagon size={16} className="text-[#FF8A8A]" />
                <h3 className="text-base font-bold text-white font-serif-display">
                  High-Priority Action Queue
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E5484D]/20 text-[#FF8A8A] border border-[#E5484D]/30 font-semibold">
                Urgent
              </span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Autonomous machine learning algorithms have flagged these sites for immediate on-site field verification due to anomalous vegetation deficit.
            </p>

            <div className="space-y-3">
              {priorityProjects.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectProject(p)}
                  className="p-4 rounded-xl bg-black/30 hover:bg-black/40 border border-white/10 hover:border-[#FF8A8A]/50 transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-white group-hover:text-[#A8C3A0] transition-colors line-clamp-1">
                      {p.name}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/80">
                        Score {p.complianceScore ?? (100 - p.complianceRiskScore)}%
                      </span>
                      <span className="text-xs font-mono font-bold text-[#FF8A8A]">
                        Risk {p.complianceRiskScore}
                      </span>
                    </div>
                  </div>
                  <div className="text-[11px] text-white/60 line-clamp-1">
                    {p.district}, {p.state} • {p.proponent}
                  </div>
                  <div className="text-[11px] text-[#FF8A8A]/90 bg-[#E5484D]/10 px-2 py-1 rounded-md border border-[#E5484D]/20">
                    Deficit: {p.proof.latestObservation}
                  </div>
                  {p.aiCompliance?.flags && p.aiCompliance.flags.length > 0 && (
                    <div className="text-[10px] text-[#FDBA74] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FDBA74]" />
                      <span className="line-clamp-1">AI Flag: {p.aiCompliance.flags[0]}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button
              onClick={onNavigateToProjects}
              className="w-full py-2.5 px-4 rounded-xl bg-[#3E7C59] hover:bg-[#4a9169] text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs border border-[#A8C3A0]/30"
            >
              <span>Explore All {projects.length} Projects</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Satellite Scene Observatory Modal */}
      {satelliteModalProject && (
        <SatelliteSceneModal
          project={satelliteModalProject}
          lang={lang}
          onClose={() => setSatelliteModalProject(null)}
          onNavigateToDetail={() => onSelectProject(satelliteModalProject)}
        />
      )}

      {/* Downloadable Editorial Report Modal */}
      {reportModalProject && (
        <EvidenceReportModal
          project={reportModalProject}
          lang={lang}
          autoPrintOnOpen={autoPrintOnOpen}
          onClose={() => {
            setReportModalProject(null);
            setAutoPrintOnOpen(false);
          }}
        />
      )}
    </div>
  );
};
