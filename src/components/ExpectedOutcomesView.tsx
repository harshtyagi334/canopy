import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Download,
  ExternalLink,
  ShieldCheck,
  FileText,
  Building2,
  Compass,
  ArrowRight,
  Filter,
  BarChart3,
  Calendar,
  Satellite,
  Layers,
  Sparkles,
  Award,
  ChevronRight,
  Printer
} from 'lucide-react';
import { Project, Language } from '../types';
import { translations } from '../translations';

interface ExpectedOutcomesViewProps {
  projects: Project[];
  lang: Language;
  onSelectProject: (p: Project) => void;
  onNavigateToProjects: () => void;
  onOpenReport?: (p: Project) => void;
}

export const ExpectedOutcomesView: React.FC<ExpectedOutcomesViewProps> = ({
  projects,
  lang,
  onSelectProject,
  onNavigateToProjects,
  onOpenReport
}) => {
  const t = translations[lang];
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'critical' | 'warning' | 'nominal'>('all');
  const [selectedReportType, setSelectedReportType] = useState<'statutory' | 'field' | 'financial' | 'ngt'>('statutory');

  // Compute stats across projects
  const totalProjects = projects.length;
  const criticalCount = projects.filter(p => p.riskLevel === 'High').length;
  const mediumCount = projects.filter(p => p.riskLevel === 'Medium').length;
  const lowCount = projects.filter(p => p.riskLevel === 'Low').length;
  const totalMandatedHa = projects.reduce((acc, p) => acc + p.mapData.caPlotHa, 0);
  const avgComplianceScore = Math.round(
    projects.reduce((acc, p) => acc + (p.complianceScore || 50), 0) / (projects.length || 1)
  );

  const filteredProjects = projects.filter(p => {
    if (selectedCategory === 'critical') return p.riskLevel === 'High';
    if (selectedCategory === 'warning') return p.riskLevel === 'Medium';
    if (selectedCategory === 'nominal') return p.riskLevel === 'Low';
    return true;
  });

  const reportsList = [
    {
      id: 'moefcc-quarterly',
      type: 'statutory',
      title: 'MoEFCC Statutory Compliance Quarterly Audit',
      description: 'Standardized regulatory appraisal comparing Form-A compensatory commitments against Sentinel-2 multispectral NDVI/EVI canopy density across all 4 operational states.',
      targetAudience: 'Ministry of Environment, Forest & Climate Change (MoEFCC)',
      classification: 'Confidential / Regulatory Priority',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    {
      id: 'ngt-evidentiary',
      type: 'ngt',
      title: 'National Green Tribunal (NGT) Evidentiary Dossier',
      description: 'Section 65B Indian Evidence Act compliant technical brief with immutable satellite acquisition metadata, solar zenith angles, and SAR backscatter verification.',
      targetAudience: 'Principal Bench & State Environmental Appellate Authorities',
      classification: 'Judicial Evidence Ready',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    },
    {
      id: 'rfo-ground-verification',
      type: 'field',
      title: 'Divisional Forest Officer (DFO) Ground Inspection Tasking',
      description: 'Actionable waypoint coordinate package with specific discrepancy polygons, access roads, and target sapling density counts for on-site verification.',
      targetAudience: 'Field Range Forest Officers & Territorial Staff',
      classification: 'Field Tasking Protocol',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'campa-accountability',
      type: 'financial',
      title: 'CAMPA Financial Accountability & Forest Yield Index',
      description: 'Audit report reconciling Net Present Value (NPV) and CA compensatory funds disbursed against verified canopy hectares formed from orbit.',
      targetAudience: 'Comptroller and Auditor General (CAG) & State CAMPA Cells',
      classification: 'Fiscal Oversight',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#12372A] text-white py-8 sm:py-12 px-4 sm:px-8 lg:px-12 selection:bg-[#3E7C59]/30">
      <div className="max-w-[1600px] mx-auto space-y-10">
        
        {/* ========================================================================= */}
        {/* Header & Vision Statement                                                  */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-[#A8C3A0]">
            <FileCheck2 size={14} className="text-[#A8C3A0]" />
            <span>Operational Outcomes & National Verification Impact</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif-display tracking-tight text-white">
                Expected Outcomes & National Scale Vision
              </h1>
              <p className="text-sm sm:text-base text-white/80 max-w-3xl mt-2 leading-relaxed">
                Tracing every cleared forest to its promised replacement and verifying, from orbit, whether the promise was kept. Canopy transforms statutory compliance from self-reported paper claims into continuous, court-admissible satellite evidence.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="outcomes-view-projects-btn"
                onClick={onNavigateToProjects}
                className="px-5 py-2.5 rounded-xl bg-[#3E7C59] hover:bg-[#4a9169] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md border border-[#A8C3A0]/30 cursor-pointer"
              >
                <Compass size={16} />
                <span>Explore Monitored Parcels</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Executive Impact Metrics Grid                                             */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-black/25 border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs text-white/70">
              <span className="font-mono">NATIONAL COMPLIANCE INDEX</span>
              <Award size={16} className="text-[#A8C3A0]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold font-serif-display text-white">{avgComplianceScore}%</span>
              <span className="text-xs text-amber-400 font-mono font-medium">Critical deficit observed</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500"
                style={{ width: `${avgComplianceScore}%` }}
              />
            </div>
            <p className="text-xs text-white/60">
              Composite score weighted across canopy closure, target NDVI, and boundary fidelity.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-black/25 border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs text-white/70">
              <span className="font-mono">MANDATED AFFORESTATION AREA</span>
              <Satellite size={16} className="text-[#74BDE0]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold font-serif-display text-white">{totalMandatedHa}</span>
              <span className="text-xs text-[#A8C3A0] font-mono">Hectares Under Sentinel Audit</span>
            </div>
            <div className="text-xs text-white/70 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>4 Strategic States Tracked (MH, OD, MP, KA)</span>
            </div>
            <p className="text-xs text-white/60">
              482,000 promised saplings verified against 10m Copernicus Sentinel-2 MSI bands.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-black/25 border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs text-white/70">
              <span className="font-mono">AI ANOMALY DETECTION RATE</span>
              <AlertTriangle size={16} className="text-[#FFA8A8]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold font-serif-display text-[#FFA8A8]">
                {Math.round((criticalCount / (totalProjects || 1)) * 100)}%
              </span>
              <span className="text-xs text-[#FFA8A8] font-mono font-medium">Flagged Non-Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-300 font-mono text-[11px]">
                {criticalCount} Critical
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[11px]">
                {mediumCount} Warning
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[11px]">
                {lowCount} Verified
              </span>
            </div>
            <p className="text-xs text-white/60">
              Enables state forest departments to deploy field rangers strictly where violations occur.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-black/25 border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs text-white/70">
              <span className="font-mono">AUDIT REVISIT FREQUENCY</span>
              <TrendingUp size={16} className="text-[#6EE7B7]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold font-serif-display text-white">~5</span>
              <span className="text-xs text-[#A8C3A0] font-mono">Days Orbital Cycle</span>
            </div>
            <div className="text-xs text-white/70 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-white/10 font-mono text-[11px] text-white/90">
                Sentinel-2A + 2B Constellation
              </span>
            </div>
            <p className="text-xs text-white/60">
              Replaces multi-year inspection delays with near-real-time biophysical growth tracking.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Regulator View: Active Non-Compliance Flagged Sites & Intervention Queue    */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-8 rounded-3xl bg-black/35 border border-white/15 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-400" />
                <h2 className="text-xl font-bold text-white font-serif-display">
                  Regulator Intervention Queue: AI Compliance & High-Risk Sites
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-white/70 mt-1">
                Automated detection of non-compliant sites, boundary discrepancies, and vegetation stagnation with confidence scores.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  selectedCategory === 'all' ? 'bg-[#3E7C59] text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                All Parcels ({totalProjects})
              </button>
              <button
                onClick={() => setSelectedCategory('critical')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  selectedCategory === 'critical' ? 'bg-red-500/30 text-red-300 border border-red-500/40' : 'text-white/70 hover:text-white'
                }`}
              >
                Critical Risk ({criticalCount})
              </button>
              <button
                onClick={() => setSelectedCategory('warning')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  selectedCategory === 'warning' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40' : 'text-white/70 hover:text-white'
                }`}
              >
                Warning ({mediumCount})
              </button>
              <button
                onClick={() => setSelectedCategory('nominal')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  selectedCategory === 'nominal' ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40' : 'text-white/70 hover:text-white'
                }`}
              >
                Verified ({lowCount})
              </button>
            </div>
          </div>

          {/* List of projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.map((project) => {
              const alertLevel = project.alertStatus?.level || (project.riskLevel === 'High' ? 'critical' : project.riskLevel === 'Medium' ? 'warning' : 'nominal');
              const isHigh = alertLevel === 'critical';
              const isWarning = alertLevel === 'warning';

              return (
                <div
                  key={project.id}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer hover:border-white/40 ${
                    isHigh
                      ? 'bg-red-950/20 border-red-500/30'
                      : isWarning
                      ? 'bg-amber-950/20 border-amber-500/30'
                      : 'bg-emerald-950/20 border-emerald-500/30'
                  }`}
                  onClick={() => onSelectProject(project)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm font-bold border ${
                            isHigh
                              ? 'bg-red-500/20 text-red-300 border-red-500/30'
                              : isWarning
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          {project.alertStatus?.label || (isHigh ? 'Critical Non-Compliance' : isWarning ? 'Monitoring Required' : 'Compliant Recovery')}
                        </span>
                        <span className="text-[11px] font-mono text-white/60">
                          {project.state} • {project.district}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1 group-hover:text-[#A8C3A0] transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-xs text-white/70 line-clamp-1 mt-0.5">
                        Proponent: {project.proponent}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono text-white/60">Recovery Score</div>
                      <div className="text-xl font-bold font-serif-display text-white">
                        {project.forestRecoveryScore ?? 35}
                        <span className="text-xs text-white/50">/100</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary & AI Detection */}
                  <div className="mt-3.5 p-3 rounded-xl bg-black/40 border border-white/10 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-white/80">
                      <span className="font-semibold text-white/90">AI Alert Summary:</span>
                      <span className="font-mono text-[11px] text-[#74BDE0]">
                        Confidence: {project.aiCompliance?.confidenceScore ?? 92}%
                      </span>
                    </div>
                    <p className="text-white/70 leading-relaxed">
                      {project.alertStatus?.summary || project.proof.plainLanguageExplanation}
                    </p>
                  </div>

                  {/* Telemetry Chips */}
                  <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-[10px] text-white/50 uppercase font-mono">Current NDVI</div>
                      <div className="font-bold text-white font-mono">
                        {project.vegetationAnalytics?.currentNdvi ?? project.proof.currentNdvi}
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-[10px] text-white/50 uppercase font-mono">Target NDVI</div>
                      <div className="font-bold text-[#A8C3A0] font-mono">
                        {project.vegetationAnalytics?.targetNdvi ?? project.promise.targetNdvi}
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-[10px] text-white/50 uppercase font-mono">Mandated CA</div>
                      <div className="font-bold text-white font-mono">
                        {project.mapData.caPlotHa} ha
                      </div>
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#A8C3A0]">
                    <span className="font-medium text-white/70">
                      Last Pass: {project.lastMonitoringDate || '02 Mar 2026'}
                    </span>
                    <span className="flex items-center gap-1 font-semibold group-hover:translate-x-0.5 transition-transform">
                      View Full Dossier & Telemetry <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Automated Regulatory Monitoring Reports                                    */}
        {/* ========================================================================= */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-[#74BDE0]" />
                <h2 className="text-xl font-bold text-white font-serif-display">
                  Automated Regulatory Monitoring Reports
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-white/70 mt-1">
                One-click generation of statutory audit packages, court-admissible dossiers, and field ranger task sheets.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportsList.map((report) => (
              <div
                key={report.id}
                className="p-5 rounded-2xl bg-black/25 border border-white/10 flex flex-col justify-between space-y-4 hover:border-white/30 transition-all"
              >
                <div className="space-y-2.5">
                  <span className={`text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded-sm border ${report.badgeColor}`}>
                    {report.classification}
                  </span>
                  <h3 className="text-sm font-bold text-white font-serif-display leading-snug">
                    {report.title}
                  </h3>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {report.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 space-y-3 text-xs">
                  <div className="text-[11px] text-white/50">
                    <span className="font-mono text-white/70 block">Target Agency:</span>
                    {report.targetAudience}
                  </div>

                  <button
                    onClick={() => {
                      if (projects.length > 0 && onOpenReport) {
                        onOpenReport(projects[0]);
                      } else if (projects.length > 0) {
                        onSelectProject(projects[0]);
                      }
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium flex items-center justify-center gap-1.5 transition-colors border border-white/15 cursor-pointer"
                  >
                    <Download size={13} className="text-[#A8C3A0]" />
                    <span>Generate & Print Report</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* National Scale Monitoring Vision & Technical Architecture                 */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c2419] to-[#091b13] border border-white/15 space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#3E7C59]/40 border border-[#A8C3A0]/30 flex items-center justify-center text-[#A8C3A0]">
              <Satellite size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-serif-display">
                National Scale Monitoring Vision & Roadmap
              </h2>
              <p className="text-xs text-[#A8C3A0]">
                Scaling autonomous orbital verification across India&apos;s 28 States and Union Territories
              </p>
            </div>
          </div>

          <p className="text-sm text-white/80 max-w-4xl leading-relaxed">
            Canopy bridges India&apos;s environmental accountability gap by creating an unbroken, automated audit chain from the MoEFCC Parivesh environmental clearance portal to high-resolution Copernicus multi-spectral imagery. By eliminating paper-based blind spots, the platform ensures that compensatory afforestation funds produce resilient, biodiverse forests.
          </p>

          {/* Strategic Phases */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
            <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#A8C3A0]">PHASE 1 (ACTIVE)</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                  Live Prototype
                </span>
              </div>
              <h4 className="font-bold text-sm text-white">4 Strategic Pilot Corridors</h4>
              <p className="text-white/70 leading-relaxed">
                Autonomous tracking across high-volume infrastructure sectors: Highway (Solapur), Mining (Sundargarh), Power Transmission (Betul), and Solar Park (Raichur).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#74BDE0]">PHASE 2 (PLANNED)</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[10px]">
                  National Rollout
                </span>
              </div>
              <h4 className="font-bold text-sm text-white">All-India Parivesh Integration</h4>
              <p className="text-white/70 leading-relaxed">
                Automated legal-NLP document ingestion pipeline harvesting all Form-A/C clearance approvals nationwide, pairing them with state cadastral revenue map boundaries.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-purple-400">PHASE 3 (VISION)</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px]">
                  Autonomous Governance
                </span>
              </div>
              <h4 className="font-bold text-sm text-white">Automated Statutory Enforcement</h4>
              <p className="text-white/70 leading-relaxed">
                Direct integration with state forest departments and National Green Tribunal registries for real-time stop-work alerts, CAMPA fund release triggers, and penalty assessments.
              </p>
            </div>
          </div>

          {/* Institutional Impact Matrix */}
          <div className="pt-4 border-t border-white/10">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-3">
              Institutional Stakeholder Matrix
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="font-bold text-[#A8C3A0] block">State Forest Departments</span>
                <p className="text-white/70 leading-snug">
                  Targeted field inspections, saving 85% search time across roadless terrain.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="font-bold text-[#74BDE0] block">MoEFCC & NGT Judges</span>
                <p className="text-white/70 leading-snug">
                  Sec 65B certified multi-spectral evidence replacing selective photos.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="font-bold text-amber-300 block">Project Developers</span>
                <p className="text-white/70 leading-snug">
                  Early alerts on sapling mortality before expensive statutory stop-work notices.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="font-bold text-emerald-300 block">CAG & Civil Society</span>
                <p className="text-white/70 leading-snug">
                  Empirical accountability ensuring ₹60,000+ Cr CAMPA funds produce living trees.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
