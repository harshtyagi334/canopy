import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import {
  Satellite,
  ShieldCheck,
  Scale,
  Trees,
  CheckCircle2,
  FileText,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  Compass,
  AlertTriangle,
  Building2,
  Users,
  ExternalLink,
  BookOpen,
  Lock,
  BarChart3
} from 'lucide-react';

interface AboutSectionViewProps {
  lang: Language;
  onNavigateToPipeline: () => void;
  onNavigateToProjects: () => void;
  onNavigateToExplorer: () => void;
}

export const AboutSectionView: React.FC<AboutSectionViewProps> = ({
  lang,
  onNavigateToPipeline,
  onNavigateToProjects,
  onNavigateToExplorer,
}) => {
  const t = translations[lang];

  return (
    <div className="w-full bg-[#12372A] text-white selection:bg-[#3E7C59]/30 min-h-screen relative overflow-hidden py-8 sm:py-12">
      {/* Background Topographic Contour Grid */}
      <div
        className="fixed inset-0 opacity-[0.05] pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(#A8C3A0 1.2px, transparent 1.2px), linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '32px 32px, 64px 64px',
        }}
      />

      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* ===================================================================== */}
        {/* HERO BANNER: PLATFORM CHARTER & PURPOSE                               */}
        {/* ===================================================================== */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-white/10 via-black/30 to-black/50 border border-white/15 backdrop-blur-md space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#3E7C59]/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          
          <div className="flex items-center gap-2 text-xs font-mono text-[#A8C3A0] tracking-wider uppercase">
            <Satellite size={16} />
            <span>Autonomous Earth Observation & Statutory Forestry Verification Platform</span>
          </div>

          <div className="max-w-4xl space-y-4">
            <h1 className="text-3xl sm:text-5xl font-extrabold font-serif-display text-white tracking-tight leading-tight">
              Canopy: Tracing Every Cleared Forest to Its Promised Replacement.
            </h1>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed font-sans">
              When natural forests in India are diverted for national highways, mining leases, or power transmission, the statutory clearance demands an exact ecological trade-off: compensatory afforestation on equivalent non-forest land.
              <strong className="text-white block mt-2">
                Canopy closes the regulatory loophole between developer declarations on paper and the physical biophysical ground reality visible from space.
              </strong>
            </p>
          </div>

          {/* Core Telemetry Stats */}
          <div className="pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10">
              <span className="text-2xl font-bold font-serif-display text-[#6EE7B7]">10m GSD</span>
              <span className="text-xs text-white/60 block mt-0.5">Sentinel-2 Native Pixel Size</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10">
              <span className="text-2xl font-bold font-serif-display text-[#74BDE0]">5-Day Revisit</span>
              <span className="text-xs text-white/60 block mt-0.5">Orbital Pass Constellation</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10">
              <span className="text-2xl font-bold font-serif-display text-[#FDE68A]">₹60,000+ Cr</span>
              <span className="text-xs text-white/60 block mt-0.5">Statutory CAMPA Corpus Scope</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10">
              <span className="text-2xl font-bold font-serif-display text-white">FCA 1980</span>
              <span className="text-xs text-white/60 block mt-0.5">Enforcement Legal Baseline</span>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* THE THREE CORE PILLARS OF STATUTORY AUDIT                             */}
        {/* ===================================================================== */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono text-[#A8C3A0] uppercase tracking-widest block">
              Triangulated Governance Framework
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-display text-white">
              Why Paper Declarations Fail and Space Verification Succeeds
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/15 backdrop-blur-sm space-y-4 hover:border-[#A8C3A0]/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#3E7C59]/30 border border-[#A8C3A0]/40 flex items-center justify-center text-[#A8C3A0]">
                <Satellite size={20} />
              </div>
              <h3 className="text-lg font-bold font-serif-display text-white">
                Multi-Mission Orbital Truth
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                Rather than relying on self-reported inspection certificates or delayed manual visits, Canopy ingests multispectral optical bands (B2, B3, B4, B8, B11) from Copernicus Sentinel-2 alongside all-weather C-Band Synthetic Aperture Radar (SAR) from Sentinel-1. Clouds and terrain shadows are algorithmically masked.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/15 backdrop-blur-sm space-y-4 hover:border-[#A8C3A0]/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#247BA0]/30 border border-[#74BDE0]/40 flex items-center justify-center text-[#74BDE0]">
                <Scale size={20} />
              </div>
              <h3 className="text-lg font-bold font-serif-display text-white">
                Objective Statutory Accounting
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                Forest clearance conditions specify strict minimum canopy density targets and sapling survival rates (typically 70–80% after Year 3). Canopy tracks the Normalized Difference Vegetation Index (NDVI) curve over multi-year baselines, flagging vegetative stagnation or dead zones.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/15 backdrop-blur-sm space-y-4 hover:border-[#A8C3A0]/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/30 border border-[#6EE7B7]/40 flex items-center justify-center text-[#6EE7B7]">
                <Building2 size={20} />
              </div>
              <h3 className="text-lg font-bold font-serif-display text-white">
                Sovereign Regulatory Audit Trail
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                Every calculation generates cryptographic evidence trails. State Principal Chief Conservators of Forests (PCCF), Comptroller and Auditor General (CAG) audit teams, and judicial tribunals can inspect exact geo-referenced coordinates, band reflectances, and clearance mandate clauses.
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* HOW THE VERIFICATION PIPELINE OPERATES                                */}
        {/* ===================================================================== */}
        <div className="p-8 sm:p-10 rounded-3xl bg-black/30 border border-white/15 backdrop-blur-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-mono text-[#A8C3A0] uppercase tracking-wider block">
                Scientific Workflow Architecture
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-serif-display text-white">
                From Clearance PDF to Orbital Audit Verdict
              </h3>
            </div>
            <button
              onClick={onNavigateToPipeline}
              className="px-4 py-2 rounded-xl bg-[#3E7C59] hover:bg-[#478f66] text-xs font-semibold text-white flex items-center gap-2 cursor-pointer transition-colors shrink-0"
            >
              <span>Test Interactive Pipeline</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <div className="text-xs font-mono text-[#A8C3A0] font-bold">STAGE 01</div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText size={16} className="text-[#6EE7B7]" />
                Mandate Extraction
              </h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Extracts diverted forest acreage, compensatory plantation village/khasra numbers, mandated species mix, and statutory survival milestones directly from official MoEFCC clearance orders.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <div className="text-xs font-mono text-[#A8C3A0] font-bold">STAGE 02</div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Compass size={16} className="text-[#74BDE0]" />
                Cadastral Geofencing
              </h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Converts revenue survey boundary sketches and KML files into clean WGS84 and UTM Zone polygon geofences, eliminating overlap with existing reserved forests or barren rocky cliffs.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <div className="text-xs font-mono text-[#A8C3A0] font-bold">STAGE 03</div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu size={16} className="text-[#FDE68A]" />
                Multi-Temporal NDVI
              </h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Computes cloud-filtered pre-diversion baseline NDVI versus current post-plantation vegetative vigor using Sentinel-2 MSI surface reflectance to measure actual photosynthetic biomass.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <div className="text-xs font-mono text-[#A8C3A0] font-bold">STAGE 04</div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#10B981]" />
                Auditor Compliance Verdict
              </h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Flags green compliance when canopy density crosses statutory criteria, or issues warning tickets with Net Present Value (NPV) deficit liabilities when vegetation stagnates or fails.
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* STATUTORY & LEGAL BASIS (FCA, CAMPA, PARIVESH)                        */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/15 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#A8C3A0]">
              <BookOpen size={16} />
              <span>Statutory Compliance Architecture</span>
            </div>
            <h3 className="text-xl font-bold font-serif-display text-white">
              Indian Forestry Legal Directives
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-white/80">
              <div className="p-3 rounded-xl bg-black/30 border border-white/10 space-y-1">
                <strong className="text-white block font-mono text-xs text-[#6EE7B7]">
                  Forest (Conservation) Act, 1980 / Van Adhiniyam 2023
                </strong>
                <p className="text-white/70 text-xs">
                  Prohibits non-forestry use of designated forest land without prior approval of the Central Government. Mandates equivalent compensatory afforestation land and maintenance for up to 10 years.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/30 border border-white/10 space-y-1">
                <strong className="text-white block font-mono text-xs text-[#74BDE0]">
                  Compensatory Afforestation Fund Act (CAMPA), 2016
                </strong>
                <p className="text-white/70 text-xs">
                  Regulates the collection and utilization of Net Present Value (NPV) and compensatory funds deposited by user agencies, mandating transparent geospatial tracking of afforestation work.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/30 border border-white/10 space-y-1">
                <strong className="text-white block font-mono text-xs text-[#FDE68A]">
                  PARIVESH 2.0 Integration Standards
                </strong>
                <p className="text-white/70 text-xs">
                  Aligns with the Ministry of Environment, Forest and Climate Change (MoEFCC) single-window clearance portal for automated proposal tracking and condition compliance verification.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/15 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#A8C3A0]">
                <Users size={16} />
                <span>Empowered User Communities</span>
              </div>
              <h3 className="text-xl font-bold font-serif-display text-white">
                Built for Officers, Auditors & Citizens Alike
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                Canopy serves as a shared source of verifiable environmental truth. State forest departments use it to monitor nursery survival rates; developers use it to demonstrate proactive fulfillment of stage-II clearance terms; and CAG audit teams use it to prevent misallocation of environmental compensation funds.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-black/30 border border-white/10">
                  <span className="font-bold text-white block">State Forest Officers</span>
                  <span className="text-[11px] text-white/60">Field geo-tagging & sapling survival tracking</span>
                </div>
                <div className="p-3 rounded-xl bg-black/30 border border-white/10">
                  <span className="font-bold text-white block">CAG Auditors</span>
                  <span className="text-[11px] text-white/60">Forensic statutory expenditure verification</span>
                </div>
                <div className="p-3 rounded-xl bg-black/30 border border-white/10">
                  <span className="font-bold text-white block">Infrastructure Proponents</span>
                  <span className="text-[11px] text-white/60">Clearance milestone compliance proof</span>
                </div>
                <div className="p-3 rounded-xl bg-black/30 border border-white/10">
                  <span className="font-bold text-white block">Ecological Researchers</span>
                  <span className="text-[11px] text-white/60">Corridor continuity & canopy health datasets</span>
                </div>
              </div>
            </div>

            {/* Quick Navigation Footer */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={onNavigateToExplorer}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/20 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Satellite size={14} className="text-[#A8C3A0]" />
                <span>Launch Satellite Explorer</span>
              </button>
              <button
                onClick={onNavigateToProjects}
                className="px-4 py-2 rounded-xl bg-[#3E7C59] hover:bg-[#478f66] text-xs font-semibold text-white flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Compass size={14} />
                <span>Explore Monitored Corridors</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
