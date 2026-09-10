import React, { useState } from 'react';
import { Project, TimelineMilestone, Language } from '../types';
import { translations } from '../translations';
import { StatusBadge } from './StatusBadge';
import { PromiseVsProofCard } from './PromiseVsProofCard';
import { ProofTimeline } from './ProofTimeline';
import { ComplianceMap } from './ComplianceMap';
import { NdviTrendChart } from './NdviTrendChart';
import { TechnicalEvidence } from './TechnicalEvidence';
import { EvidenceDrawer } from './EvidenceDrawer';
import { EvidenceReportModal } from './EvidenceReportModal';
import { ShapExplainView } from './ShapExplainView';
import { WhatIfSimulationView } from './WhatIfSimulationView';
import { DataIngestView } from './DataIngestView';
import { MlRegistryView } from './MlRegistryView';
import { ApiDocsView } from './ApiDocsView';
import { AuditTrailView } from './AuditTrailView';
import {
  ArrowLeft,
  Download,
  ShieldCheck,
  Building,
  ChevronRight,
  MapPin,
  Compass,
  Sliders,
  Brain,
  Layers,
  Cpu,
  Code2,
  Lock,
  Eye,
  Printer,
  FileText,
  AlertTriangle,
  Activity,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Satellite,
} from 'lucide-react';

interface ProjectDetailViewProps {
  project: Project;
  lang: Language;
  onBackToProjects: () => void;
  onOpenSourcePdfModal: () => void;
  initialTab?: 'overview' | 'gis' | 'shap' | 'whatif' | 'ingest' | 'ml' | 'api' | 'audit';
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  lang,
  onBackToProjects,
  onOpenSourcePdfModal,
  initialTab = 'overview',
}) => {
  const [selectedMilestone, setSelectedMilestone] = useState<TimelineMilestone | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [autoPrintOnOpen, setAutoPrintOnOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'gis' | 'shap' | 'whatif' | 'ingest' | 'ml' | 'api' | 'audit'>(initialTab);
  const t = translations[lang];

  const handleOpenReport = (autoPrint = false) => {
    setAutoPrintOnOpen(autoPrint);
    setReportModalOpen(true);
  };

  return (
    <>
      <div className={`space-y-8 sm:space-y-10 py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${reportModalOpen ? 'no-print' : ''}`}>
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/70">
          <button
            onClick={onBackToProjects}
            className="hover:text-white font-semibold transition-colors flex items-center gap-1.5 cursor-pointer bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 hover:bg-white/15 text-white"
          >
            <ArrowLeft size={13} />
            <span>{t.backToProjects}</span>
          </button>
          <ChevronRight size={13} className="text-white/40" />
          <span className="font-medium text-white/80">{project.state}</span>
          <ChevronRight size={13} className="text-white/40" />
          <span className="text-white font-semibold truncate max-w-[200px] sm:max-w-none">
            {project.name}
          </span>
        </nav>

        {/* Project Header Card */}
        <section className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-black/30 text-[#A8C3A0] border border-white/15 font-mono">
                  {project.state} • {project.sector}
                </span>
                <StatusBadge status={project.status} lang={lang} size="md" />
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white font-serif-display leading-tight">
                {project.name}
              </h1>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-white/70 pt-1">
                <Building size={16} className="text-[#A8C3A0] shrink-0" />
                <span>
                  <strong className="text-white font-semibold">User Agency / Proponent:</strong>{' '}
                  {project.proponent}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="shrink-0 flex flex-wrap sm:flex-nowrap items-center gap-2.5">
              <button
                id="print-pdf-compliance-report-btn"
                onClick={() => handleOpenReport(true)}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-[#3E7C59] hover:bg-[#4a9169] text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-98 border border-[#A8C3A0]/40"
                title="Print or Save formal Statutory Compliance Report as PDF"
              >
                <Printer size={16} className="text-[#A8C3A0] group-hover:scale-110 transition-transform" />
                <span>Print to PDF</span>
              </button>

              <button
                id="download-evidence-report-btn"
                onClick={() => handleOpenReport(false)}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
                title="Inspect interactive Evidence Dossier"
              >
                <FileText size={16} className="text-[#FDBA74]" />
                <span>{t.downloadReport}</span>
              </button>
            </div>
          </div>

          {/* Score & Telemetry Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 pt-6 border-t border-white/10 text-xs">
            <div className="p-3.5 rounded-xl bg-black/25 border border-white/10">
              <span className="text-white/60 block text-[10px] uppercase tracking-wider font-semibold">
                Compliance Score
              </span>
              <span className={`text-xl sm:text-2xl font-bold font-serif-display block mt-1 tabular-nums ${
                (project.complianceScore ?? 0) < 50
                  ? 'text-[#FF8A8A]'
                  : (project.complianceScore ?? 0) < 75
                  ? 'text-[#FDBA74]'
                  : 'text-[#6EE7B7]'
              }`}>
                {project.complianceScore ?? (100 - project.complianceRiskScore)}%
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-black/25 border border-white/10">
              <span className="text-white/60 block text-[10px] uppercase tracking-wider font-semibold">
                Forest Recovery
              </span>
              <span className="text-xl sm:text-2xl font-bold font-serif-display text-[#A8C3A0] block mt-1 tabular-nums">
                {project.forestRecoveryScore ?? Math.round(project.proof.currentNdvi * 100)}%
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-black/25 border border-white/10">
              <span className="text-white/60 block text-[10px] uppercase tracking-wider font-semibold">
                {t.complianceRiskScore}
              </span>
              <span className={`text-xl sm:text-2xl font-bold font-serif-display block mt-1 tabular-nums ${
                project.complianceRiskScore > 70
                  ? 'text-[#FF8A8A]'
                  : project.complianceRiskScore > 40
                  ? 'text-[#FDBA74]'
                  : 'text-[#6EE7B7]'
              }`}>
                {project.complianceRiskScore}<span className="text-xs text-white/60 font-sans font-normal">/100</span>
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-black/25 border border-white/10">
              <span className="text-white/60 block text-[10px] uppercase tracking-wider font-semibold">
                {t.evidenceConfidence}
              </span>
              <span className="text-xl sm:text-2xl font-bold font-serif-display text-white block mt-1 tabular-nums">
                {project.evidenceConfidenceScore}% <span className="text-xs font-sans font-semibold text-[#6EE7B7]">({project.confidenceLevel})</span>
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-black/25 border border-white/10">
              <span className="text-white/60 block text-[10px] uppercase tracking-wider font-semibold">
                Approved Mandate
              </span>
              <span className="font-bold text-white block mt-1 text-sm tabular-nums">
                {project.mapData.caPlotHa} ha
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-black/25 border border-white/10">
              <span className="text-white/60 block text-[10px] uppercase tracking-wider font-semibold">
                Clearance Ref
              </span>
              <span className="font-mono text-xs text-white block mt-1.5 truncate font-semibold" title={project.clearanceFileRef}>
                {project.clearanceFileRef}
              </span>
            </div>
          </div>
        </section>

        {/* Unified Sub-Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-white/15 subtle-scrollbar">
          {[
            { id: 'overview', label: 'Overview & Timeline', icon: Eye },
            { id: 'gis', label: 'GIS Map', icon: Compass },
            { id: 'shap', label: 'SHAP Explain', icon: Brain },
            { id: 'whatif', label: 'What-If Simulation', icon: Sliders },
            { id: 'ingest', label: 'Data Ingest', icon: Layers },
            { id: 'ml', label: 'ML Registry', icon: Cpu },
            { id: 'api', label: 'API Docs', icon: Code2 },
            { id: 'audit', label: 'Audit Trail', icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#3E7C59] text-white shadow-md border border-[#A8C3A0]/40'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-transparent'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-[#A8C3A0]' : 'text-white/60'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sub-Tab Contents */}
        {activeSubTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* AI Compliance & Vegetation Analytics Module */}
            {project.aiCompliance && (
              <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-[#10B981]/15 text-[#6EE7B7]">
                      <Brain size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-white font-serif-display">
                          AI Compliance & Multi-Temporal Anomaly Detection
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-[#A8C3A0] border border-white/15">
                          {project.aiCompliance.confidenceScore}% Confidence
                        </span>
                      </div>
                      <p className="text-xs text-white/70">
                        {project.aiCompliance.modelType}
                      </p>
                    </div>
                  </div>

                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border self-start sm:self-auto ${
                    project.aiCompliance.nonComplianceFlagged
                      ? 'bg-[#ef4444]/20 border-[#ef4444]/40 text-[#F87171]'
                      : 'bg-[#10b981]/20 border-[#10b981]/40 text-[#6EE7B7]'
                  }`}>
                    {project.aiCompliance.anomalySeverity}
                  </span>
                </div>

                {/* AI Flags & Vegetation Telemetry Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Left: AI Flags */}
                  <div className="space-y-3 p-4 rounded-2xl bg-black/30 border border-white/10">
                    <span className="text-xs font-mono font-bold text-white/80 uppercase tracking-wider flex items-center gap-2">
                      <AlertTriangle size={14} className="text-[#FBBF24]" />
                      <span>Model Audit Flags ({project.aiCompliance.flags.length})</span>
                    </span>
                    <ul className="space-y-2 text-xs">
                      {project.aiCompliance.flags.map((flag, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-white/85">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A8A] shrink-0 mt-1.5" />
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: Vegetation Analytics */}
                  {project.vegetationAnalytics && (
                    <div className="space-y-3 p-4 rounded-2xl bg-black/30 border border-white/10">
                      <span className="text-xs font-mono font-bold text-[#A8C3A0] uppercase tracking-wider flex items-center gap-2">
                        <Activity size={14} />
                        <span>Biophysical Spectral Indices</span>
                      </span>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                          <span className="text-[10px] text-white/60 block font-mono">NDVI (Current / Target)</span>
                          <span className="text-base font-bold text-white font-mono mt-0.5 block">
                            {project.vegetationAnalytics.currentNdvi.toFixed(2)}{' '}
                            <span className="text-xs text-white/50">/ {project.vegetationAnalytics.targetNdvi.toFixed(2)}</span>
                          </span>
                          <span className="text-[10px] text-white/50">Baseline: {project.vegetationAnalytics.baselineNdvi.toFixed(2)}</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                          <span className="text-[10px] text-white/60 block font-mono">EVI (Enhanced Vegetation)</span>
                          <span className="text-base font-bold text-white font-mono mt-0.5 block">
                            {project.vegetationAnalytics.currentEvi.toFixed(2)}{' '}
                            <span className="text-xs text-white/50">/ {project.vegetationAnalytics.targetEvi.toFixed(2)}</span>
                          </span>
                          <span className="text-[10px] text-white/50">Baseline: {project.vegetationAnalytics.baselineEvi.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-white/70 pt-1 border-t border-white/10 flex items-center justify-between">
                        <span>Trajectory: {project.vegetationAnalytics.growthTrend}</span>
                        <span className="text-[#A8C3A0] font-mono">{project.vegetationAnalytics.revisitFrequency}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Two-Column Promise vs Proof Card */}
            <PromiseVsProofCard
              project={project}
              lang={lang}
              onOpenSourcePdf={onOpenSourcePdfModal}
            />

            {/* Signature ProofTimeline */}
            <ProofTimeline
              timeline={project.timeline}
              lang={lang}
              onSelectMilestone={(m) => setSelectedMilestone(m)}
              selectedMilestoneId={selectedMilestone?.id}
            />

            {/* Vegetation Recovery Trajectory (NDVI) Chart */}
            <NdviTrendChart
              project={project}
              lang={lang}
            />

            {/* Technical Evidence Accordion */}
            <TechnicalEvidence
              project={project}
              lang={lang}
            />
          </div>
        )}

        {activeSubTab === 'gis' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <ComplianceMap project={project} lang={lang} />
          </div>
        )}

        {activeSubTab === 'shap' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <ShapExplainView project={project} lang={lang} />
          </div>
        )}

        {activeSubTab === 'whatif' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <WhatIfSimulationView project={project} lang={lang} />
          </div>
        )}

        {activeSubTab === 'ingest' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <DataIngestView project={project} lang={lang} />
          </div>
        )}

        {activeSubTab === 'ml' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <MlRegistryView project={project} lang={lang} />
          </div>
        )}

        {activeSubTab === 'api' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <ApiDocsView project={project} lang={lang} />
          </div>
        )}

        {activeSubTab === 'audit' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <AuditTrailView project={project} lang={lang} />
          </div>
        )}

        {/* Expanded Evidence Drawer / Modal */}
        {selectedMilestone && (
          <EvidenceDrawer
            milestone={selectedMilestone}
            project={project}
            lang={lang}
            onClose={() => setSelectedMilestone(null)}
            onOpenSourcePdf={onOpenSourcePdfModal}
          />
        )}
      </div>

      {/* Downloadable Editorial Report Modal */}
      {reportModalOpen && (
        <EvidenceReportModal
          project={project}
          lang={lang}
          autoPrintOnOpen={autoPrintOnOpen}
          onClose={() => {
            setReportModalOpen(false);
            setAutoPrintOnOpen(false);
          }}
        />
      )}
    </>
  );
};
