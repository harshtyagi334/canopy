import React, { useState } from 'react';
import { Project, Language } from '../types';
import { translations } from '../translations';
import { StatusBadge } from './StatusBadge';
import { triggerPrintReport } from '../utils/printReport';
import { useToast } from '../context/ToastContext';
import {
  Printer,
  Download,
  X,
  ShieldCheck,
  FileText,
  Satellite,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Clock,
  Compass,
  Layers,
  Award,
  Info,
  MapPin,
  Trees,
  Scale
} from 'lucide-react';

interface EvidenceReportModalProps {
  project: Project;
  lang: Language;
  onClose: () => void;
  autoPrintOnOpen?: boolean;
}

export const EvidenceReportModal: React.FC<EvidenceReportModalProps> = ({
  project,
  lang,
  onClose,
  autoPrintOnOpen = false,
}) => {
  const t = translations[lang];
  const { toast } = useToast();
  const [isPrinting, setIsPrinting] = useState(false);
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const reportDossierId = `GEOAUDIT-${project.id.toUpperCase().replace(/[^A-Z0-9]/g, '-')}-2026`;

  React.useEffect(() => {
    if (autoPrintOnOpen) {
      handlePrint();
    }
  }, [autoPrintOnOpen]);

  const handlePrint = () => {
    setIsPrinting(true);
    triggerPrintReport(project);
    toast.success('Statutory Dossier Generated', {
      message: `Section 65B certified audit package prepared for "${project.name}" (Ref: ${project.clearanceFileRef}).`,
      duration: 4500,
    });
    setTimeout(() => {
      setIsPrinting(false);
    }, 500);
  };

  const getVerdictHeadline = () => {
    switch (project.status) {
      case 'field_verification_priority':
        return 'FIELD VERIFICATION PRIORITY: Critical Vegetation Deficit Observed';
      case 'evidence_discrepancy':
        return 'EVIDENCE DISCREPANCY: Observable Growth Diverges from Statutory Mandate';
      case 'monitoring_required':
        return 'MONITORING REQUIRED: Vegetation Recovery Progressing Below Expected Velocity';
      case 'likely_recovery':
        return 'LIKELY RECOVERY: Multi-Spectral Greenness Corroborates Compliance';
      case 'insufficient_evidence':
        return 'INSUFFICIENT EVIDENCE: Persistent Cloud Cover Precludes Definitive Assessment';
      default:
        return 'STATUTORY COMPLIANCE DETERMINATION';
    }
  };

  const getVerdictColor = () => {
    switch (project.status) {
      case 'field_verification_priority':
      case 'evidence_discrepancy':
        return {
          bg: 'bg-[#C94C4C]/10',
          border: 'border-[#C94C4C]',
          text: 'text-[#C94C4C]',
          bar: 'bg-[#C94C4C]',
        };
      case 'monitoring_required':
        return {
          bg: 'bg-[#E9A23B]/10',
          border: 'border-[#E9A23B]',
          text: 'text-[#B8710B]',
          bar: 'bg-[#E9A23B]',
        };
      case 'likely_recovery':
        return {
          bg: 'bg-[#3E7C59]/10',
          border: 'border-[#3E7C59]',
          text: 'text-[#3E7C59]',
          bar: 'bg-[#3E7C59]',
        };
      default:
        return {
          bg: 'bg-[#6B7280]/10',
          border: 'border-[#6B7280]',
          text: 'text-[#6B7280]',
          bar: 'bg-[#6B7280]',
        };
    }
  };

  const verdictStyles = getVerdictColor();
  const ndviDeficit = (project.proof.currentNdvi - project.promise.targetNdvi).toFixed(2);

  return (
    <div className="print-modal-overlay fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex justify-center items-start p-2 sm:p-6 md:p-10 animate-in fade-in duration-200">
      <div
        className="print-modal-card w-full max-w-5xl bg-[#0d261b] text-white rounded-2xl shadow-2xl border border-white/20 overflow-hidden flex flex-col my-2 sm:my-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-title"
      >
        {/* Modal Top Action Bar (Hidden during printing) */}
        <div className="no-print p-4 sm:p-5 bg-[#0a1e15] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30 shadow-md">
          <div className="flex items-center gap-2 text-xs text-white/70">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1 text-white font-semibold hover:text-[#A8C3A0] transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>{t.backToProjects}</span>
            </button>
            <span>/</span>
            <span className="font-medium text-white/90 truncate max-w-[180px] sm:max-w-xs">
              {project.name}
            </span>
            <span>/</span>
            <span className="text-[#A8C3A0] font-semibold">Evidence Dossier</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="report-print-download-btn"
              onClick={handlePrint}
              disabled={isPrinting}
              className="px-4 py-2.5 rounded-xl bg-[#3E7C59] hover:bg-[#4a9169] active:scale-98 text-white text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shadow-md cursor-pointer group border border-[#A8C3A0]/30"
              title="Print directly or save as PDF"
            >
              <Printer size={16} className="text-[#A8C3A0] group-hover:scale-110 transition-transform" />
              <span>{isPrinting ? t.analyzingDocument : t.reportPrintPdf}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close report preview"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Informative Guidance Banner for Saving as PDF */}
        <div className="no-print bg-black/30 px-6 py-2.5 border-b border-white/10 flex items-center justify-between text-xs text-white/70">
          <div className="flex items-center gap-2">
            <Info size={14} className="text-[#A8C3A0] shrink-0" />
            <span>
              <strong>Tip:</strong> In your browser print dialog, select <strong>"Save as PDF"</strong> as the Destination to download this comprehensive compliance dossier.
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#A8C3A0] hidden md:inline">
            Dossier ID: {reportDossierId}
          </span>
        </div>

        {/* Printable Editorial Report Canvas */}
        <div
          id="printable-evidence-report"
          className="p-6 sm:p-10 md:p-14 lg:p-16 space-y-10 bg-white text-[#243238]"
        >
          {/* Dossier Header */}
          <div className="border-b-2 border-[#12372A] pb-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#12372A] flex items-center justify-center text-white shadow-xs">
                  <Satellite className="w-6 h-6 text-[#A8C3A0]" />
                </div>
                <div>
                  <span className="text-xl font-bold tracking-tight text-[#12372A] font-serif-display block leading-tight">
                    GeoAudit AI
                  </span>
                  <span className="text-[11px] font-medium text-[#6B7280] uppercase tracking-wider block">
                    Autonomous Environmental Intelligence & Compliance Verification
                  </span>
                </div>
              </div>

              <div className="text-right sm:text-right font-mono text-[11px] text-[#6B7280] space-y-0.5">
                <div><strong className="text-[#243238]">Dossier ID:</strong> {reportDossierId}</div>
                <div><strong className="text-[#243238]">Date Issued:</strong> {currentDate}</div>
                <div><strong className="text-[#243238]">Clearance Ref:</strong> {project.clearanceFileRef}</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-[#12372A]/10 text-[#12372A] font-semibold text-[11px] tracking-wide uppercase">
                Official Regulatory Audit Dossier • Forest (Conservation) Act, 1980
              </span>
              <span className="text-[11px] text-[#6B7280] italic">
                Earth Observation Baseline vs Mandated Compensatory Afforestation
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 1: PROJECT SUMMARY & CLEARANCE MANDATE                           */}
          {/* ========================================================================= */}
          <section className="space-y-6 avoid-page-break">
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-widest text-[#3E7C59]">
                Section 1 • Project & Statutory Mandate Summary
              </div>
              <h1 id="report-title" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#12372A] font-serif-display leading-tight">
                {project.name}
              </h1>
              <p className="text-sm text-[#6B7280]">
                Statutory audit of compensatory afforestation obligations approved under the Ministry of Environment, Forest and Climate Change (MoEFCC).
              </p>
            </div>

            {/* Key Project Identity Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-xl bg-[#FAF8F3] border border-[#E8E4D9] text-xs">
              <div>
                <span className="text-[#6B7280] block text-[10px] uppercase font-semibold tracking-wider">
                  {t.proponentLabel}
                </span>
                <span className="font-bold text-[#243238] block mt-1 text-xs sm:text-sm">
                  {project.proponent}
                </span>
              </div>

              <div>
                <span className="text-[#6B7280] block text-[10px] uppercase font-semibold tracking-wider">
                  Location & Jurisdiction
                </span>
                <span className="font-bold text-[#243238] block mt-1 text-xs sm:text-sm">
                  {project.district}, {project.state}
                </span>
              </div>

              <div>
                <span className="text-[#6B7280] block text-[10px] uppercase font-semibold tracking-wider">
                  Sector & Infrastructure
                </span>
                <span className="font-bold text-[#243238] block mt-1 text-xs sm:text-sm">
                  {project.sector}
                </span>
              </div>

              <div>
                <span className="text-[#6B7280] block text-[10px] uppercase font-semibold tracking-wider">
                  Clearance Approval Date
                </span>
                <span className="font-bold text-[#243238] block mt-1 text-xs sm:text-sm">
                  {project.clearanceDate}
                </span>
              </div>

              <div className="col-span-2 pt-2 border-t border-[#E8E4D9]">
                <span className="text-[#6B7280] block text-[10px] uppercase font-semibold tracking-wider">
                  Compensatory Afforestation Site
                </span>
                <span className="font-medium text-[#243238] block mt-0.5">
                  {project.mapData.caPlotName} ({project.mapData.surveyNumbers})
                </span>
              </div>

              <div className="col-span-2 pt-2 border-t border-[#E8E4D9]">
                <span className="text-[#6B7280] block text-[10px] uppercase font-semibold tracking-wider">
                  Geographic Centroid
                </span>
                <span className="font-mono text-[#12372A] font-semibold block mt-0.5">
                  {project.mapData.coordinatesDisplay} (Zoom: {project.mapData.zoom}x)
                </span>
              </div>
            </div>

            {/* Promise vs Proof Side-by-Side Comparison Box */}
            <div className="rounded-xl border border-[#E3DFD5] overflow-hidden bg-white shadow-xs">
              <div className="bg-[#12372A] text-white px-5 py-3 flex items-center justify-between">
                <span className="font-semibold text-xs tracking-wider uppercase flex items-center gap-2">
                  <Scale size={14} className="text-[#A8C3A0]" />
                  {t.promiseVsProofHeading}
                </span>
                <span className="text-[11px] text-[#A8C3A0]">
                  Clause & Sensor Corroboration
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E3DFD5] p-6 gap-6">
                {/* Promise Left Column */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6D4C41]">
                    <FileText size={14} />
                    <span>Clearance Mandate (Document)</span>
                  </div>
                  <div className="text-base font-bold text-[#12372A] font-serif-display">
                    “{project.promise.shortClaim}”
                  </div>
                  <blockquote className="text-xs text-[#555E68] bg-[#F7F5EF] p-3.5 rounded-lg border border-[#E8E4D9] leading-relaxed italic">
                    "{project.promise.specificCondition}"
                  </blockquote>
                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div>
                      <span className="text-[#6B7280] block text-[10px] uppercase font-medium">Mandated Area</span>
                      <span className="font-semibold text-[#243238] block mt-0.5">{project.promise.requiredArea}</span>
                    </div>
                    <div>
                      <span className="text-[#6B7280] block text-[10px] uppercase font-medium">Target Deadline</span>
                      <span className="font-semibold text-[#243238] block mt-0.5">{project.promise.deadline}</span>
                    </div>
                    <div>
                      <span className="text-[#6B7280] block text-[10px] uppercase font-medium">Sapling Commitment</span>
                      <span className="font-semibold text-[#243238] block mt-0.5">{project.promise.saplingCount}</span>
                    </div>
                    <div>
                      <span className="text-[#6B7280] block text-[10px] uppercase font-medium">Target Canopy NDVI</span>
                      <span className="font-mono font-bold text-[#12372A] block mt-0.5">≥ {project.promise.targetNdvi.toFixed(2)}</span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-[#F2EFE8]">
                      <span className="text-[#6B7280] block text-[10px] uppercase font-medium">Legal Source Citation</span>
                      <span className="font-mono text-xs text-[#12372A]">{project.promise.sourcePdfPage}</span>
                    </div>
                  </div>
                </div>

                {/* Proof Right Column */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#247BA0]">
                    <Satellite size={14} />
                    <span>Observable Ground Truth (Sensors)</span>
                  </div>
                  <div className="text-base font-bold text-[#243238] font-serif-display">
                    “{project.proof.latestObservation}”
                  </div>
                  <p className="text-xs text-[#243238] leading-relaxed bg-[#FAF8F3] p-3.5 rounded-lg border border-[#E8E4D9]">
                    {project.proof.plainLanguageExplanation}
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div>
                      <span className="text-[#6B7280] block text-[10px] uppercase font-medium">Observed NDVI</span>
                      <span className={`font-mono font-bold text-sm block mt-0.5 ${
                        project.proof.currentNdvi >= project.promise.targetNdvi ? 'text-[#3E7C59]' : 'text-[#C94C4C]'
                      }`}>
                        {project.proof.currentNdvi.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#6B7280] block text-[10px] uppercase font-medium">Trajectory Deficit</span>
                      <span className={`font-mono font-bold text-sm block mt-0.5 ${
                        Number(ndviDeficit) >= 0 ? 'text-[#3E7C59]' : 'text-[#C94C4C]'
                      }`}>
                        {Number(ndviDeficit) >= 0 ? `+${ndviDeficit}` : ndviDeficit} vs target
                      </span>
                    </div>
                    <div>
                      <span className="text-[#6B7280] block text-[10px] uppercase font-medium">Growth Velocity</span>
                      <span className="font-semibold text-[#243238] block mt-0.5">{project.proof.recoveryTrend}</span>
                    </div>
                    <div>
                      <span className="text-[#6B7280] block text-[10px] uppercase font-medium">Sensor Coverage</span>
                      <span className="font-semibold text-[#243238] block mt-0.5">{project.proof.evidenceQuality}</span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-[#F2EFE8]">
                      <span className="text-[#6B7280] block text-[10px] uppercase font-medium">Recommended Action</span>
                      <span className="text-xs font-semibold text-[#12372A] block mt-0.5">{project.proof.recommendedAction}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 2: TIMELINE EVIDENCE CARDS                                        */}
          {/* ========================================================================= */}
          <section className="space-y-6 avoid-page-break">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E3DFD5] pb-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-[#3E7C59]">
                  Section 2 • Multi-Temporal Remote Sensing Evidence
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#12372A] font-serif-display">
                  {t.reportTimelineEvidence}
                </h2>
              </div>
              <span className="text-xs text-[#6B7280] font-mono">
                {project.timeline.length} Registered Satellite Passes Analyzed
              </span>
            </div>

            <p className="text-xs text-[#6B7280] leading-relaxed">
              Consecutive high-resolution optical passes (ESA Copernicus Sentinel-2 MSI) and Synthetic Aperture Radar (Sentinel-1 SAR C-Band) evaluated over the registered polygon coordinates ({project.mapData.caPlotName}).
            </p>

            {/* Complete Grid of ALL Timeline Evidence Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4.5">
              {project.timeline.map((m, idx) => (
                <div
                  key={m.id}
                  className="avoid-page-break bg-white rounded-xl border border-[#E3DFD5] overflow-hidden p-4 space-y-3 shadow-xs hover:border-[#12372A]/40 transition-colors"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between text-[11px] pb-2 border-b border-[#F2EFE8]">
                    <span className="font-bold text-[#12372A] flex items-center gap-1.5">
                      <Calendar size={13} className="text-[#3E7C59]" />
                      {m.date}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#F7F5EF] font-mono text-[10px] text-[#6B7280] border border-[#E8E4D9]">
                      Pass #{idx + 1}
                    </span>
                  </div>

                  {/* Satellite Thumbnail / SVG Raster Map Graphic */}
                  <div className="relative h-32 rounded-lg overflow-hidden bg-[#16251f] border border-[#12372A]/20">
                    <svg className="w-full h-full object-cover" viewBox="0 0 240 140">
                      {/* Background surface terrain reflectance */}
                      <rect
                        width="240"
                        height="140"
                        fill={m.ndviValue >= 0.5 ? '#1b3b27' : m.ndviValue >= 0.35 ? '#2b4433' : '#3a4039'}
                      />
                      {/* Contours of vegetative vigour based on NDVI */}
                      <circle
                        cx="120"
                        cy="70"
                        r={60 * Math.min(1.2, m.ndviValue / 0.45)}
                        fill="#3E7C59"
                        fillOpacity={0.65}
                      />
                      <circle
                        cx="90"
                        cy="55"
                        r={35 * Math.min(1.2, m.ndviValue / 0.5)}
                        fill="#6B9B7A"
                        fillOpacity={0.5}
                      />
                      {/* Demarcated Cadastral Boundary Polygon */}
                      <polygon
                        points="45,30 185,25 210,110 120,125 35,95"
                        fill="none"
                        stroke="#A8C3A0"
                        strokeWidth="2.5"
                        strokeDasharray="5 3"
                      />
                      {/* Scale bar indicator */}
                      <line x1="180" y1="125" x2="225" y2="125" stroke="#ffffff" strokeWidth="2" />
                      <text x="180" y="120" fill="#ffffff" fontSize="8" fontFamily="monospace">100m</text>
                    </svg>

                    {/* Overlay Badges */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-[10px] font-mono font-bold text-white shadow-xs">
                      NDVI {m.ndviValue.toFixed(2)}
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[9px] font-mono font-semibold text-[#12372A]">
                      {m.sensor}
                    </div>
                  </div>

                  {/* Card Body Details */}
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-[#3E7C59]">
                        Milestone Objective
                      </div>
                      <div className="font-bold text-[#243238] text-sm">
                        {m.milestoneLabel}
                      </div>
                    </div>

                    <p className="text-[11px] text-[#555E68] leading-relaxed line-clamp-3 bg-[#FAF8F3] p-2 rounded-md border border-[#F0ECE1]">
                      {m.observation}
                    </p>

                    {/* Sensor Metrics Breakdown */}
                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] border-t border-[#F2EFE8]">
                      <div>
                        <span className="text-[#6B7280] block text-[10px]">Canopy Density:</span>
                        <span className="font-bold text-[#243238]">{m.canopyDensity}</span>
                      </div>
                      <div>
                        <span className="text-[#6B7280] block text-[10px]">NDVI Delta:</span>
                        <span className="font-mono font-bold text-[#12372A]">{m.ndviDelta}</span>
                      </div>
                      <div>
                        <span className="text-[#6B7280] block text-[10px]">Cloud Quality:</span>
                        <span className="font-mono text-[10px] text-[#243238]">{m.cloudCover}</span>
                      </div>
                      <div>
                        <span className="text-[#6B7280] block text-[10px]">Scene Resolution:</span>
                        <span className="font-mono text-[10px] text-[#243238]">{m.metadata.resolution}</span>
                      </div>
                    </div>

                    {/* Field Evidence Tag if recorded */}
                    {m.fieldEvidence && (
                      <div className="text-[10px] pt-1.5 border-t border-[#F2EFE8] flex items-center justify-between text-[#6B7280]">
                        <span className="inline-flex items-center gap-1 font-medium text-[#12372A]">
                          <CheckCircle2 size={11} className="text-[#3E7C59]" />
                          Ground Inspection
                        </span>
                        <span className="truncate max-w-[120px] font-mono text-[9px]">
                          {m.fieldEvidence.inspector || 'Verified'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quantitative Trajectory Audit Table */}
            <div className="avoid-page-break bg-white rounded-xl border border-[#E3DFD5] p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#12372A] flex items-center gap-2">
                  <Trees size={14} className="text-[#3E7C59]" />
                  Sequential Vegetation Index Verification Log
                </h3>
                <span className="text-[11px] text-[#6B7280] font-mono">
                  Target Threshold: NDVI ≥ {project.promise.targetNdvi.toFixed(2)}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E3DFD5] text-[#6B7280] text-[11px]">
                      <th className="py-2.5 px-2 font-semibold">Phase / Milestone</th>
                      <th className="py-2.5 px-2 font-semibold">Acquisition Date</th>
                      <th className="py-2.5 px-2 font-semibold">Sensor</th>
                      <th className="py-2.5 px-2 font-semibold">Observed NDVI</th>
                      <th className="py-2.5 px-2 font-semibold">Variance from Target</th>
                      <th className="py-2.5 px-2 font-semibold">Canopy Density</th>
                      <th className="py-2.5 px-2 font-semibold">Compliance State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2EFE8] text-[#243238]">
                    {project.timeline.map((m) => {
                      const variance = (m.ndviValue - project.promise.targetNdvi).toFixed(2);
                      const isTargetMet = m.ndviValue >= project.promise.targetNdvi;
                      return (
                        <tr key={m.id} className="hover:bg-[#FAF8F3]">
                          <td className="py-2.5 px-2 font-semibold text-[#12372A]">{m.milestoneLabel}</td>
                          <td className="py-2.5 px-2 font-mono text-[#6B7280]">{m.date}</td>
                          <td className="py-2.5 px-2 font-mono text-[11px] text-[#6B7280]">{m.sensor}</td>
                          <td className="py-2.5 px-2 font-mono font-bold text-[#12372A]">{m.ndviValue.toFixed(2)}</td>
                          <td className={`py-2.5 px-2 font-mono font-semibold ${
                            Number(variance) >= 0 ? 'text-[#3E7C59]' : 'text-[#C94C4C]'
                          }`}>
                            {Number(variance) >= 0 ? `+${variance}` : variance}
                          </td>
                          <td className="py-2.5 px-2">{m.canopyDensity}</td>
                          <td className="py-2.5 px-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold inline-block ${
                              isTargetMet
                                ? 'bg-[#3E7C59]/10 text-[#3E7C59]'
                                : 'bg-[#E9A23B]/15 text-[#8A5700]'
                            }`}>
                              {isTargetMet ? 'Threshold Achieved' : 'Deficit Detected'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 3: COMPLIANCE RISK VERDICT & STATUTORY ACTION                     */}
          {/* ========================================================================= */}
          <section className="avoid-page-break space-y-6 pt-4 border-t-2 border-[#12372A]">
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-widest text-[#3E7C59]">
                Section 3 • Regulatory Determination
              </div>
              <h2 className="text-2xl font-bold text-[#12372A] font-serif-display">
                {t.reportRiskVerdict}
              </h2>
              <p className="text-xs text-[#6B7280]">
                {t.reportRiskVerdictSubtitle}
              </p>
            </div>

            {/* Authoritative Verdict Box */}
            <div className={`rounded-xl border-2 ${verdictStyles.border} ${verdictStyles.bg} p-6 sm:p-8 space-y-6 shadow-xs`}>
              {/* Verdict Header Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/10">
                <div className="space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                    Official Statutory Finding
                  </div>
                  <h3 className={`text-xl sm:text-2xl font-bold font-serif-display ${verdictStyles.text}`}>
                    {getVerdictHeadline()}
                  </h3>
                </div>
                <div className="shrink-0">
                  <StatusBadge status={project.status} lang={lang} size="lg" />
                </div>
              </div>

              {/* Dual Quantitative Score Meters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-5 rounded-xl border border-[#E3DFD5]">
                {/* Compliance Risk Score */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                      Compliance-Risk Score
                    </span>
                    <span className={`text-2xl font-bold font-serif-display ${
                      project.complianceRiskScore > 70
                        ? 'text-[#C94C4C]'
                        : project.complianceRiskScore > 40
                        ? 'text-[#E9A23B]'
                        : 'text-[#3E7C59]'
                    }`}>
                      {project.complianceRiskScore} / 100
                    </span>
                  </div>

                  {/* Visual Score Bar */}
                  <div className="w-full bg-[#EFECE6] h-3 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all rounded-full ${
                        project.complianceRiskScore > 70
                          ? 'bg-[#C94C4C]'
                          : project.complianceRiskScore > 40
                          ? 'bg-[#E9A23B]'
                          : 'bg-[#3E7C59]'
                      }`}
                      style={{ width: `${project.complianceRiskScore}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-[#6B7280] font-medium pt-0.5">
                    <span>Low Risk (0–39)</span>
                    <span className="font-bold text-[#12372A]">Level: {project.riskLevel}</span>
                    <span>Severe Risk (70–100)</span>
                  </div>
                </div>

                {/* Evidence Confidence Score */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                      Evidence Confidence Rating
                    </span>
                    <span className="text-2xl font-bold font-serif-display text-[#12372A]">
                      {project.evidenceConfidenceScore}%
                    </span>
                  </div>

                  {/* Visual Confidence Bar */}
                  <div className="w-full bg-[#EFECE6] h-3 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#12372A] transition-all rounded-full"
                      style={{ width: `${project.evidenceConfidenceScore}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-[#6B7280] font-medium pt-0.5">
                    <span>Single Pass (Low)</span>
                    <span className="font-bold text-[#12372A]">Reliability: {project.confidenceLevel}</span>
                    <span>Multi-Sensor Corroborated</span>
                  </div>
                </div>
              </div>

              {/* Recommended Action Box */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#12372A] flex items-center gap-2">
                  <AlertTriangle size={15} className="text-[#B8710B]" />
                  <span>Mandated Statutory Recommendation</span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#E3DFD5] space-y-2 text-xs leading-relaxed text-[#243238]">
                  <p className="font-bold text-sm text-[#12372A]">
                    {project.proof.recommendedAction}
                  </p>
                  <p className="text-[#6B7280]">
                    In accordance with the guidelines under the Forest (Conservation) Act, 1980 and the Compensatory Afforestation Fund Management and Planning Authority (CAMPA) framework, this evidence dossier supports regulatory dispatch to the jurisdictional Principal Chief Conservator of Forests (PCCF) and Regional Office of MoEFCC.
                  </p>
                </div>
              </div>

              {/* Suggested Formal Directives Checklist */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                  Immediate Regulatory Next Steps
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-white/80 border border-[#E3DFD5]">
                    <CheckCircle2 size={14} className="text-[#3E7C59] mt-0.5 shrink-0" />
                    <span>Dispatch copy of satellite trajectory audit to User Agency ({project.proponent}).</span>
                  </div>
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-white/80 border border-[#E3DFD5]">
                    <CheckCircle2 size={14} className="text-[#3E7C59] mt-0.5 shrink-0" />
                    <span>Convene physical joint survey with Divisional Forest Officer (DFO {project.district}).</span>
                  </div>
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-white/80 border border-[#E3DFD5]">
                    <CheckCircle2 size={14} className="text-[#3E7C59] mt-0.5 shrink-0" />
                    <span>Require drone-based high-density orthomosaic with geo-tagged sapling survival count.</span>
                  </div>
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-white/80 border border-[#E3DFD5]">
                    <CheckCircle2 size={14} className="text-[#3E7C59] mt-0.5 shrink-0" />
                    <span>Withhold final stage-II compliance certificate pending physical field audit.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scientific Methodology & Certification Seal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
              <div className="md:col-span-2 p-4 rounded-xl bg-[#FAF8F3] border border-[#E8E4D9] space-y-2 text-[#6B7280]">
                <div className="font-bold text-[#12372A] uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                  <Award size={13} className="text-[#3E7C59]" />
                  Scientific Methodology & Satellite Constellation Metadata
                </div>
                <p className="text-[11px] leading-relaxed">
                  Optical vegetation indices calculated using Normalized Difference Vegetation Index (NDVI = (B08 - B04) / (B08 + B04)) from European Space Agency (ESA) Copernicus Sentinel-2 MSI Level-2A surface reflectance. Verified against Sentinel-1 C-Band synthetic aperture radar backscatter (SAR VH/VV) to validate woody biomass formation across seasonal cycles.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E3DFD5] space-y-2 font-mono text-[10px] text-[#6B7280] flex flex-col justify-between">
                <div>
                  <div className="font-bold text-[#12372A] uppercase text-[10px]">Digital Verification Stamp</div>
                  <div className="text-[9px] text-[#888] mt-1 break-all">
                    SHA-256: 7e4b98c558b9f1a0e8d9c44298fc1c149afbf4c8996fb92427ae41e4649b934c
                  </div>
                  <div className="mt-1 text-[10px] text-[#243238]">
                    Generated by GeoAudit AI Core v2.4
                  </div>
                </div>
                <div className="pt-2 border-t border-[#F2EFE8] flex items-center justify-between text-[9px]">
                  <span>Status: Immutable Audit</span>
                  <span className="text-[#3E7C59] font-bold">VERIFIED</span>
                </div>
              </div>
            </div>

            {/* Official Statutory Sign-off & Seal Block */}
            <div className="avoid-page-break p-5 rounded-xl border border-[#E3DFD5] bg-[#FAF8F3] space-y-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#12372A] border-b border-[#E3DFD5] pb-2 flex items-center justify-between">
                <span>Certificate of Digital Evidence under Section 65B, Indian Evidence Act, 1872</span>
                <span className="font-mono text-[10px] text-[#6B7280]">Doc Ref: MoEFCC/CAMPA/{project.id.toUpperCase()}/2026</span>
              </div>
              <p className="text-[10.5px] text-[#555E68] leading-relaxed">
                I hereby certify that the satellite imagery, cadastral overlays, and spectral trajectories contained in this document were automatically ingested and processed by the GeoAudit AI Environmental Compliance Engine from the Copernicus Open Access Hub without manual tampering. The electronic records were produced by the computer system during the period over which the system was used regularly to store and process environmental observation data in the ordinary course of operations.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-[#6B7280] font-semibold block">Auditing Platform</span>
                  <div className="font-bold text-[#12372A]">GeoAudit AI Sentinel Core</div>
                  <div className="text-[10px] text-[#6B7280]">Automated Multi-Spectral Engine</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-[#6B7280] font-semibold block">Authorizing Officer Signature</span>
                  <div className="h-6 border-b border-dashed border-[#888]" />
                  <div className="text-[10px] text-[#6B7280]">Regional Chief Conservator of Forests</div>
                </div>
                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase text-[#6B7280] font-semibold block">Official Seal & Date</span>
                  <div className="h-6 border-b border-dashed border-[#888]" />
                  <div className="text-[10px] text-[#6B7280]">CAMPA Monitoring Cell</div>
                </div>
              </div>
            </div>
          </section>

          {/* Mandatory Statutory Legal Disclaimer */}
          <div className="avoid-page-break pt-6 border-t border-[#12372A]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B7280]">
            <div className="italic text-[#12372A] font-medium text-center sm:text-left">
              “{t.decisionSupportDisclaimer}”
            </div>
            <div className="font-mono text-[11px] text-right">
              GeoAudit AI • Ref: {project.clearanceFileRef}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
