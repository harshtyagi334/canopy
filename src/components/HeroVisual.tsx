import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, Project } from '../types';
import { translations } from '../translations';
import {
  FileText,
  MapPin,
  Satellite,
  ShieldCheck,
  ArrowRight,
  Upload,
  Layers,
  Scale,
  Trees,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Eye,
  Activity,
  Award,
  Compass,
  FileCheck2,
  Cpu,
  TrendingUp,
  RotateCcw,
  Volume2,
  Zap,
  Search,
  ScanLine,
  Users
} from 'lucide-react';
import { TreeReplanting3DSimulation } from './TreeReplanting3DSimulation';

interface HeroVisualProps {
  lang: Language;
  onExploreDemo: () => void;
  onUploadPdf: () => void;
  onLaunchPipeline: () => void;
  sampleProject: Project;
  onSelectProject: (p: Project) => void;
}

export const HeroVisual: React.FC<HeroVisualProps> = ({
  lang,
  onExploreDemo,
  onUploadPdf,
  onLaunchPipeline,
  sampleProject,
  onSelectProject,
}) => {
  const t = translations[lang];
  const [activeStakeholderTab, setActiveStakeholderTab] = useState<'forestry' | 'regulators' | 'developers' | 'citizens'>('forestry');

  const stakeholderUtilities = [
    {
      id: 'forestry' as const,
      label: 'State Forest Departments',
      shortLabel: 'Forestry Rangers',
      icon: Trees,
      color: '#A8C3A0',
      bgLight: 'bg-[#3E7C59]/30',
      border: 'border-[#A8C3A0]/30',
      headline: 'Ranger Force Multiplier & Targeted Ground Audits',
      description: 'With individual forest range officers managing over 1,000 hectares of rugged terrain, physical inspections of every clearance site are impossible. VanGuard acts as an autonomous digital sentinel, scanning all plots every 5 days and dispatching GPS discrepancy pins directly to field teams.',
      benefits: [
        '85% reduction in search time for remote, roadless plantation blocks',
        'Direct GPS coordinates and KML routes uploaded to ranger hand-helds',
        'Verifiable ground photos matched against Sentinel-2 spectral passes',
        'Objective survival rate auditing before signing off developer releases'
      ],
      badge: 'Operational Force Multiplier'
    },
    {
      id: 'regulators' as const,
      label: 'MoEFCC & Green Tribunals (NGT)',
      shortLabel: 'Judicial & Regulatory',
      icon: Scale,
      color: '#74BDE0',
      bgLight: 'bg-[#247BA0]/30',
      border: 'border-[#74BDE0]/30',
      headline: 'Statutory Verification & Court-Admissible Dossiers',
      description: 'Regulatory authorities no longer need to depend on self-certified developer affidavits or selective ground photography. VanGuard produces empirical, multi-temporal spectral and radar curves meeting strict standards of admissibility under Section 65B of the Indian Evidence Act.',
      benefits: [
        'Pre-diversion baseline vs multi-year recovery curve comparisons',
        'Automated detection of unauthorized mine pit or quarry boundary creep',
        'Standardized evidentiary dossiers ready for judicial tribunals',
        'Full cryptographic chain of custody with SHA-256 block ledger'
      ],
      badge: 'Statutory Admissibility'
    },
    {
      id: 'developers' as const,
      label: 'Infrastructure & Mining Proponents',
      shortLabel: 'Project Proponents',
      icon: Cpu,
      color: '#E0B494',
      bgLight: 'bg-[#E0B494]/20',
      border: 'border-[#E0B494]/30',
      headline: 'Proactive Compliance Tracking & Risk Mitigation',
      description: 'Public and private developers investing in infrastructure projects can verify their afforestation contractors in real time. Rather than learning of sapling failures 3 years later during an MoEFCC audit, developers receive weekly canopy growth telemetry and remediation recommendations.',
      benefits: [
        'Early detection of sapling mortality and soil moisture deficits',
        'What-If algorithmic simulation for optimal replanting density',
        'Prevention of severe statutory stop-work notices or bank guarantee forfeiture',
        'Audited ESG disclosures backed by Copernicus satellite ground truth'
      ],
      badge: 'Proactive Risk Assurance'
    },
    {
      id: 'citizens' as const,
      label: 'Civil Society & CAMPA Oversight',
      shortLabel: 'Public & Research',
      icon: Users,
      color: '#6EE7B7',
      bgLight: 'bg-[#10B981]/20',
      border: 'border-[#10B981]/30',
      headline: 'Transparent Public Accounting for ₹60,000+ Cr CAMPA Funds',
      description: 'Under CAMPA legislation, project developers have deposited tens of thousands of crores to compensate for lost ecological services. VanGuard provides open, public-interest transparency to ensure these public funds translate into living, thriving forests rather than remaining paper entries on revenue records.',
      benefits: [
        'Open geospatial polygon maps of all mandated compensatory plots',
        'Longitudinal NDVI analysis accessible to ecological researchers',
        'Empirical accountability for public environmental compensation funds',
        'Protection of critical wildlife corridors and contiguous biodiversity zones'
      ],
      badge: 'Public Accountability'
    }
  ];

  return (
    <div className="w-full bg-[#12372A] text-white selection:bg-[#3E7C59]/30 min-h-screen relative overflow-hidden">
      {/* Background Topographic Contour & Satellite Grid */}
      <div
        className="fixed inset-0 opacity-[0.06] pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(#A8C3A0 1.2px, transparent 1.2px), linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '32px 32px, 64px 64px',
        }}
      />

      {/* Ambient Emerald & Cyan Glows */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#3E7C59]/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[#247BA0]/15 rounded-full blur-3xl pointer-events-none"
      />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION: Authoritative Entrance & Direct Action Launchpad         */}
      {/* ========================================================================= */}
      <section className="relative z-10 w-full border-b border-white/10 overflow-hidden">
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 pt-12 sm:pt-20 pb-16 sm:pb-24">
          <div className="max-w-5xl xl:max-w-6xl mx-auto text-center space-y-6 sm:space-y-8">
            
            {/* Regulatory Identity Badge with Animated Pulse */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-[#A8C3A0] shadow-xs select-none"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A8C3A0] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#A8C3A0]"></span>
              </span>
              <span className="font-semibold tracking-wide">
                Autonomous Environmental Intelligence & Statutory Audit Platform
              </span>
              <span className="hidden sm:inline text-white/40">•</span>
              <span className="hidden sm:inline text-xs font-mono text-white/80">
                Copernicus Sentinel-2 & Sentinel-1
              </span>
            </motion.div>

            {/* Authoritative Display Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="space-y-4"
            >
              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-white font-serif-display leading-[1.08]">
                {t.heroHeadline1}
                <br />
                <span className="text-[#A8C3A0] italic">{t.heroHeadline2}</span>
              </h1>
              <p className="text-base sm:text-xl lg:text-2xl text-[#F7F5EF]/90 max-w-4xl xl:max-w-5xl mx-auto font-normal leading-relaxed pt-2">
                GeoAudit AI is India&apos;s sovereign satellite verification platform that reads forest clearance mandates, maps compensatory afforestation plots, and monitors actual vegetation canopy recovery from orbit—closing the regulatory gap between developer self-declarations and ground reality.
              </p>
            </motion.div>

            {/* Primary Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4"
            >
              <button
                id="hero-launch-pipeline-btn"
                onClick={onLaunchPipeline}
                className="w-full sm:w-auto h-13 px-6 rounded-xl bg-[#3E7C59] hover:bg-[#468c64] active:scale-[0.98] text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5 group cursor-pointer border border-[#A8C3A0]/40"
              >
                <Cpu size={18} className="text-[#A8C3A0]" />
                <span>Launch Verification Pipeline</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>

              <button
                id="hero-explore-projects-btn"
                onClick={onExploreDemo}
                className="w-full sm:w-auto h-13 px-6 rounded-xl bg-white/10 hover:bg-white/15 active:scale-[0.98] text-white font-semibold text-sm border border-white/25 backdrop-blur-md transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-xs hover:border-white/40"
              >
                <Compass size={17} className="text-[#A8C3A0]" />
                <span>Explore Monitored Projects</span>
              </button>

              <button
                id="hero-upload-pdf-btn"
                onClick={onUploadPdf}
                className="w-full sm:w-auto h-13 px-5 rounded-xl bg-black/30 hover:bg-black/40 active:scale-[0.98] text-white/90 hover:text-white font-semibold text-sm border border-white/15 backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload size={16} className="text-[#A8C3A0]" />
                <span>Upload Clearance PDF</span>
              </button>
            </motion.div>

            {/* Telemetry Metrics Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="pt-8 border-t border-white/15 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-center"
            >
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-center">
                <span className="text-xl sm:text-2xl font-bold font-serif-display text-white block">10m GSD</span>
                <span className="text-xs text-[#A8C3A0] block mt-1">Multi-spectral Resolution</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-center">
                <span className="text-xl sm:text-2xl font-bold font-serif-display text-white block">₹60,000+ Cr</span>
                <span className="text-xs text-[#A8C3A0] block mt-1">CAMPA Monitoring Scope</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-center">
                <span className="text-xl sm:text-2xl font-bold font-serif-display text-white block">Zero Bias</span>
                <span className="text-xs text-[#A8C3A0] block mt-1">Space-Verified Ground Truth</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-center">
                <span className="text-xl sm:text-2xl font-bold font-serif-display text-white block">FCA 1980</span>
                <span className="text-xs text-[#A8C3A0] block mt-1">Indian Forest Act Compliant</span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-20 space-y-20 sm:space-y-28 relative z-10">

        {/* ========================================================================= */}
        {/* TRUE WEBGL 3D TREE REPLANTING & COMPENSATORY AFFORESTATION SIMULATION     */}
        {/* ========================================================================= */}
        <section className="space-y-4">
          <TreeReplanting3DSimulation
            lang={lang}
            onExplorePipeline={onLaunchPipeline}
          />
        </section>

        {/* ========================================================================= */}
        {/* 1. PLATFORM OVERVIEW: MISSION & UTILITY                                   */}
        {/* ========================================================================= */}
        <section id="platform-overview" className="space-y-12">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#A8C3A0] shadow-xs select-none">
              <ShieldCheck size={14} className="text-[#A8C3A0]" />
              <span className="uppercase tracking-widest text-[11px] font-mono">Platform Overview</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif-display text-white tracking-tight">
              Mission & Core Utility
            </h2>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl mx-auto">
              Bridging the regulatory gap between developer self-declarations and physical planetary truth through autonomous satellite Earth observation.
            </p>
          </div>

          {/* Aesthetic 3-Card Mission Architecture */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Statutory Mission */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-7 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 space-y-5 flex flex-col justify-between hover:border-[#A8C3A0]/50 hover:bg-white/15 transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#3E7C59]/40 border border-[#A8C3A0]/30 flex items-center justify-center text-[#A8C3A0] group-hover:scale-105 transition-transform">
                    <ShieldCheck size={22} />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-mono font-bold px-2.5 py-1 rounded-md bg-white/10 text-[#A8C3A0] border border-white/15">
                    Foundational Mission
                  </span>
                </div>
                <h3 className="text-xl font-bold font-serif-display text-white group-hover:text-[#A8C3A0] transition-colors">
                  Statutory Fidelity & Mandate Realization
                </h3>
                <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                  Every year, thousands of hectares of biodiverse Indian forests are diverted for mining, energy, and linear corridors. Our mission is to ensure that legal promises made in Ministry clearance orders are transformed into real, living canopy on the ground.
                </p>
              </div>

              <div className="pt-4 border-t border-white/15 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-white/60 block text-[11px]">Enforcement Mandate</span>
                  <span className="font-semibold text-white font-mono">FCA 1980 & CAMPA</span>
                </div>
                <div>
                  <span className="text-white/60 block text-[11px]">Audit Rigor</span>
                  <span className="font-semibold text-[#A8C3A0] font-mono">100% Objective</span>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Space Observation Utility */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-7 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 space-y-5 flex flex-col justify-between hover:border-[#74BDE0]/50 hover:bg-white/15 transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#247BA0]/40 border border-[#74BDE0]/30 flex items-center justify-center text-[#74BDE0] group-hover:scale-105 transition-transform">
                    <Satellite size={22} />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-mono font-bold px-2.5 py-1 rounded-md bg-white/10 text-[#74BDE0] border border-white/15">
                    Orbital Utility
                  </span>
                </div>
                <h3 className="text-xl font-bold font-serif-display text-white group-hover:text-[#74BDE0] transition-colors">
                  Continuous Space-Based Verification
                </h3>
                <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                  Replacing delayed paper self-reports with continuous Earth observation. GeoAudit AI fuses 10m Sentinel-2 multi-spectral reflectance and Sentinel-1 SAR radar to track tree canopy density, vegetation recovery curves, and seasonal biomass accumulation.
                </p>
              </div>

              <div className="pt-4 border-t border-white/15 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-white/60 block text-[11px]">Spatial Resolution</span>
                  <span className="font-semibold text-white font-mono">10m GSD Optical</span>
                </div>
                <div>
                  <span className="text-white/60 block text-[11px]">Revisit Cadence</span>
                  <span className="font-semibold text-[#74BDE0] font-mono">Every 5 Days</span>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Evidentiary & Legal Utility */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-7 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 space-y-5 flex flex-col justify-between hover:border-[#E0B494]/50 hover:bg-white/15 transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#E0B494]/30 border border-[#E0B494]/30 flex items-center justify-center text-[#E0B494] group-hover:scale-105 transition-transform">
                    <Scale size={22} />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-mono font-bold px-2.5 py-1 rounded-md bg-white/10 text-[#E0B494] border border-white/15">
                    Judicial Utility
                  </span>
                </div>
                <h3 className="text-xl font-bold font-serif-display text-white group-hover:text-[#E0B494] transition-colors">
                  Court-Admissible Evidence Dossiers
                </h3>
                <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                  Translates terabytes of spectral data into calm, non-accusatory legal evidence dossiers. Every telemetry observation is timestamped and cryptographically hashed with SHA-256 signatures, admissible under Section 65B of the Indian Evidence Act.
                </p>
              </div>

              <div className="pt-4 border-t border-white/15 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-white/60 block text-[11px]">Evidentiary Standard</span>
                  <span className="font-semibold text-white font-mono">IEA §65B Ready</span>
                </div>
                <div>
                  <span className="text-white/60 block text-[11px]">Jurisdiction</span>
                  <span className="font-semibold text-[#E0B494] font-mono">NGT & High Courts</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Interactive Stakeholder Utility Matrix */}
          <div className="p-7 sm:p-10 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#A8C3A0] block">
                  Interactive Utility Matrix
                </span>
                <h3 className="text-2xl font-bold font-serif-display text-white">
                  Practical Utility Across Critical Stakeholders
                </h3>
              </div>
              <span className="text-xs text-white/60 max-w-sm">
                Select an institutional actor to explore how GeoAudit AI directly enhances regulatory and operational workflows:
              </span>
            </div>

            {/* Stakeholder Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-1.5 bg-black/30 rounded-2xl border border-white/10">
              {stakeholderUtilities.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeStakeholderTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveStakeholderTab(item.id)}
                    className={`px-3 py-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isActive
                        ? 'bg-[#3E7C59] text-white shadow-md border border-[#A8C3A0]/40'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <IconComponent size={16} className={isActive ? 'text-[#A8C3A0]' : 'text-white/60'} />
                    <span className="truncate">{item.shortLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Stakeholder Detailed Card */}
            {(() => {
              const active = stakeholderUtilities.find((s) => s.id === activeStakeholderTab) || stakeholderUtilities[0];
              const IconComp = active.icon;

              return (
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 sm:p-8 rounded-2xl bg-black/25 border border-white/15 space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${active.bgLight} border ${active.border} flex items-center justify-center`} style={{ color: active.color }}>
                        <IconComp size={20} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold font-serif-display text-white">
                          {active.label}
                        </h4>
                        <span className="text-xs text-white/70">{active.headline}</span>
                      </div>
                    </div>

                    <span className={`self-start sm:self-auto text-[11px] font-mono font-semibold px-3 py-1 rounded-full border ${active.border} ${active.bgLight}`} style={{ color: active.color }}>
                      {active.badge}
                    </span>
                  </div>

                  <p className="text-sm text-white/85 leading-relaxed">
                    {active.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {active.benefits.map((benefit, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                        <CheckCircle2 size={16} className="text-[#A8C3A0] shrink-0 mt-0.5" />
                        <span className="text-xs text-white/90 leading-snug">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })()}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. WHAT IS VANGUARD AI? (Purpose, Essence, and Core Use)                 */}
        {/* ========================================================================= */}
        <section className="space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-[#A8C3A0]">
              System Overview & Core Purpose
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif-display text-white">
              What is VanGuard AI?
            </h2>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              An autonomous regulatory intelligence system designed to bridge the chasm between paper environmental clearances and physical planetary reality.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Core Narrative Explainer */}
            <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#3E7C59]/30 border border-[#A8C3A0]/30 text-xs font-semibold text-[#A8C3A0]">
                  <ShieldCheck size={14} />
                  <span>The Fundamental Problem & Solution</span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-bold font-serif-display text-white leading-snug">
                  Transforming dense regulatory clearance orders into continuous, un-falsifiable orbital oversight.
                </h3>
                
                <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                  When project developers divert forest land for mining, dams, or infrastructure, statutory law mandates compensatory afforestation (CA) and greenbelts. Traditionally, state regulators rely on <strong>self-certified compliance reports</strong> submitted years later, which are rarely inspected due to inaccessible terrains and severe forestry staff shortages.
                </p>

                <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                  <strong>GeoAudit AI replaces paper trust with space-based proof.</strong> It autonomously digests scanned Ministry of Environment, Forest and Climate Change (MoEFCC) clearance documents, extracts legal covenants, maps revenue survey boundaries, and uses European Space Agency (ESA) Copernicus satellite telemetry to mathematically verify whether trees were actually planted.
                </p>
              </div>

              <div className="pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-black/25 border border-white/10 space-y-1">
                  <span className="font-bold text-[#FF8A8A] block uppercase tracking-wider">Traditional Process</span>
                  <p className="text-white/70 leading-relaxed">
                    Paper self-declarations, manual inspections delayed by 3–5 years, ₹60,000+ Cr in unverified CAMPA funds.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#3E7C59]/20 border border-[#A8C3A0]/30 space-y-1">
                  <span className="font-bold text-[#A8C3A0] block uppercase tracking-wider">GeoAudit AI Process</span>
                  <p className="text-white/90 leading-relaxed">
                    Zero human bias, 10m multi-spectral Sentinel watch, autonomous anomaly alerts, and court-admissible dossiers.
                  </p>
                </div>
              </div>
            </div>

            {/* 3 Core Principles Cards with Subtle 3D Hover Lift */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-4">
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2 hover:bg-white/15 transition-all cursor-default"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#3E7C59]/40 border border-[#A8C3A0]/30 flex items-center justify-center text-[#A8C3A0]">
                    <Eye size={18} />
                  </div>
                  <h4 className="font-bold font-serif-display text-lg text-white">1. Zero Human Bias</h4>
                </div>
                <p className="text-xs sm:text-sm text-white/75 leading-relaxed pl-12">
                  Direct surface reflectance (optical bands B02–B12) and radar backscatter (SAR VH/VV) cannot be influenced, hidden, or delayed by paper bureaucracy.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2 hover:bg-white/15 transition-all cursor-default"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#247BA0]/40 border border-[#74BDE0]/30 flex items-center justify-center text-[#74BDE0]">
                    <Activity size={18} />
                  </div>
                  <h4 className="font-bold font-serif-display text-lg text-white">2. Multi-temporal Cadence</h4>
                </div>
                <p className="text-xs sm:text-sm text-white/75 leading-relaxed pl-12">
                  Instead of a single isolated visit, GeoAudit AI audits sites across every monsoon season, pre-monsoon dry spell, and 5-year recovery trajectory.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2 hover:bg-white/15 transition-all cursor-default"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E0B494]/30 border border-[#E0B494]/30 flex items-center justify-center text-[#E0B494]">
                    <Scale size={18} />
                  </div>
                  <h4 className="font-bold font-serif-display text-lg text-white">3. Court-Ready Explainability</h4>
                </div>
                <p className="text-xs sm:text-sm text-white/75 leading-relaxed pl-12">
                  Produces transparent, mathematically verifiable evidence packages ready for the National Green Tribunal (NGT) and High Courts.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. THE CRITICAL IMPORTANCE OF GEOAUDIT AI (Why GeoAudit AI Matters)        */}
        {/* ========================================================================= */}
        <section className="space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-[#A8C3A0]">
              Planetary & Governance Imperative
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif-display text-white">
              Why GeoAudit AI Matters
            </h2>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              Four fundamental pillars illustrating why autonomous satellite verification is vital for India&apos;s ecological future and statutory compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Pillar 1 */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-7 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 space-y-4 hover:border-[#A8C3A0]/50 hover:bg-white/15 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#3E7C59]/30 border border-[#A8C3A0]/30 flex items-center justify-center text-[#A8C3A0]">
                <TrendingUp size={22} />
              </div>
              <h3 className="text-xl font-bold font-serif-display text-white">
                Closing the ₹60,000+ Crore CAMPA Accountability Void
              </h3>
              <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                Under the Compensatory Afforestation Fund Act (CAMPA), project developers deposited over ₹60,000 crore ($7.2B) into government coffers. Yet, without independent remote sensing, vast tracts of land suffer from &quot;paper afforestation&quot;—marked as planted on revenue ledgers, but remaining barren rock or degraded scrub on the ground. GeoAudit AI tracks every allocated hectare to ensure public funds produce living trees.
              </p>
            </motion.div>

            {/* Pillar 2 */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-7 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 space-y-4 hover:border-[#A8C3A0]/50 hover:bg-white/15 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#247BA0]/30 border border-[#74BDE0]/30 flex items-center justify-center text-[#74BDE0]">
                <Trees size={22} />
              </div>
              <h3 className="text-xl font-bold font-serif-display text-white">
                Overcoming Crippling Forest Field Staff Shortages
              </h3>
              <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                State forest departments face severe resource constraints, with individual forest range officers often responsible for over 1,000 hectares of dense, roadless jungle. Inspecting hundreds of remote clearance sites is physically impossible. GeoAudit AI acts as a digital force multiplier, highlighting specific discrepancy zones so rangers travel only where violations occur.
              </p>
            </motion.div>

            {/* Pillar 3 */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-7 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 space-y-4 hover:border-[#A8C3A0]/50 hover:bg-white/15 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#E0B494]/30 border border-[#E0B494]/30 flex items-center justify-center text-[#E0B494]">
                <FileCheck2 size={22} />
              </div>
              <h3 className="text-xl font-bold font-serif-display text-white">
                Un-Falsifiable, Court-Admissible Space Truth
              </h3>
              <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                Self-certified compliance affidavits accompanied by cherry-picked ground photos can be easily staged or misrepresented. Copernicus Sentinel-2 multi-spectral reflectance cannot be manipulated. GeoAudit AI generates empirical, timestamped satellite evidence packages capable of withstanding the highest judicial scrutiny in National Green Tribunal (NGT) hearings.
              </p>
            </motion.div>

            {/* Pillar 4 */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-7 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 space-y-4 hover:border-[#A8C3A0]/50 hover:bg-white/15 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#C94C4C]/30 border border-[#FF8A8A]/30 flex items-center justify-center text-[#FF8A8A]">
                <AlertTriangle size={22} />
              </div>
              <h3 className="text-xl font-bold font-serif-display text-white">
                Halting Irreversible Ecological Destruction Early
              </h3>
              <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                When an open-cast mine breaches its approved boundary or compensatory saplings wither during summer, traditional audits detect the failure 4–6 years later—when topsoil has eroded and native seed banks are gone. GeoAudit AI flags vegetation anomalies within 5 days of orbital flyovers, enabling statutory stop-work notices and immediate remedial planting.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. HOW IT WORKS (The 4-Step Technical Workflow)                           */}
        {/* ========================================================================= */}
        <section className="space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-[#A8C3A0]">
              Operational Mechanics
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif-display text-white">
              How GeoAudit AI Works
            </h2>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              An autonomous four-stage pipeline bridging statutory clearance documents with European Space Agency orbital constellations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Step 1 */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-4 flex flex-col justify-between hover:bg-white/15 transition-all relative overflow-hidden group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center font-serif-display font-bold text-xl text-[#A8C3A0] group-hover:scale-110 transition-transform">
                  01
                </div>
                <h3 className="text-lg font-bold font-serif-display text-white">
                  PDF Mandate Extraction
                </h3>
                <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                  Deep learning NLP models ingest scanned MoEFCC Stage-I and Stage-II approval orders, extracting exact hectare quotas, tree species requirements, survival targets, and legal deadlines.
                </p>
              </div>
              <div className="pt-3 border-t border-white/10 font-mono text-[11px] text-[#A8C3A0]">
                Output: Structured JSON Covenants
              </div>
              {/* Subtle Scanning Line Animation on hover */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#A8C3A0] opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
            </motion.div>

            {/* Step 2 */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-4 flex flex-col justify-between hover:bg-white/15 transition-all relative overflow-hidden group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center font-serif-display font-bold text-xl text-[#74BDE0] group-hover:scale-110 transition-transform">
                  02
                </div>
                <h3 className="text-lg font-bold font-serif-display text-white">
                  Cadastral GIS Geofencing
                </h3>
                <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                  Pinpoints state land revenue records (Gut/Khasra numbers) and GPS boundary tables into calibrated WGS84 polygon meshes, isolating the compensatory plot from adjacent non-project land.
                </p>
              </div>
              <div className="pt-3 border-t border-white/10 font-mono text-[11px] text-[#74BDE0]">
                Output: Verified KML/GeoJSON Boundaries
              </div>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#74BDE0] opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
            </motion.div>

            {/* Step 3 */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-4 flex flex-col justify-between hover:bg-white/15 transition-all relative overflow-hidden group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center font-serif-display font-bold text-xl text-[#E0B494] group-hover:scale-110 transition-transform">
                  03
                </div>
                <h3 className="text-lg font-bold font-serif-display text-white">
                  Multi-temporal Telemetry
                </h3>
                <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                  Continuously pulls 10m Copernicus Sentinel-2 multi-spectral (Red-Edge/NIR) and Sentinel-1 SAR radar passes, tracking historical NDVI greenness curves and canopy density growth across seasons.
                </p>
              </div>
              <div className="pt-3 border-t border-white/10 font-mono text-[11px] text-[#E0B494]">
                Output: Multi-year NDVI & SAR Time-series
              </div>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#E0B494] opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
            </motion.div>

            {/* Step 4 */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-4 flex flex-col justify-between hover:bg-white/15 transition-all relative overflow-hidden group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center font-serif-display font-bold text-xl text-[#FF8A8A] group-hover:scale-110 transition-transform">
                  04
                </div>
                <h3 className="text-lg font-bold font-serif-display text-white">
                  Autonomous Audit Verdict
                </h3>
                <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                  Synthesizes promise vs proof, computing a 0–100 Compliance Risk Score. High discrepancies automatically generate statutory inspection briefs and formal memos for forest conservators.
                </p>
              </div>
              <div className="pt-3 border-t border-white/10 font-mono text-[11px] text-[#FF8A8A]">
                Output: Statutory Evidence Dossier (PDF/GIS)
              </div>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#FF8A8A] opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
            </motion.div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. CORE USE CASES & JURISDICTIONS                                         */}
        {/* ========================================================================= */}
        <section className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-[#A8C3A0]">
              Statutory Application Scope
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif-display text-white">
              Core Use Cases & Regulatory Mandates
            </h2>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              Designed for state forest departments, regional MoEFCC offices, and legal oversight bodies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-black/25 border border-white/15 space-y-2">
              <span className="text-xs font-mono font-bold text-[#A8C3A0] block">01 / AFFORESTATION</span>
              <h4 className="text-base font-bold font-serif-display text-white">Compensatory Plantations</h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Verifying that user agencies plant 1,000–1,200 native trees per hectare on non-forest revenue land and sustain at least 40% crown canopy cover.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/25 border border-white/15 space-y-2">
              <span className="text-xs font-mono font-bold text-[#74BDE0] block">02 / EXTRACTIVE INDUSTRY</span>
              <h4 className="text-base font-bold font-serif-display text-white">Mine Overburden Reclamation</h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Auditing progressive biological stabilization of dump slopes, topsoil preservation, and mandatory 7.5m safety greenbelt zones around open-cast pits.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/25 border border-white/15 space-y-2">
              <span className="text-xs font-mono font-bold text-[#E0B494] block">03 / HYDROELECTRIC</span>
              <h4 className="text-base font-bold font-serif-display text-white">Catchment Area Treatment (CAT)</h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Tracking afforestation along upstream reservoir basins to prevent siltation, preserve reservoir live capacity, and maintain Himalayan riparian habitats.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/25 border border-white/15 space-y-2">
              <span className="text-xs font-mono font-bold text-[#A8C3A0] block">04 / INFRASTRUCTURE</span>
              <h4 className="text-base font-bold font-serif-display text-white">Linear Infrastructure Greenbelts</h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Monitoring tree-felling compliance and mandatory avenue plantations along national highways, railway alignments, and power transmission corridors.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. DEDICATED PIPELINE TEASER & QUICK ACCESS LAUNCHPAD                     */}
        {/* ========================================================================= */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#1b4b39] via-[#163f30] to-[#0e2a20] border border-white/20 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono text-[#A8C3A0]">
                <Cpu size={14} />
                <span>Dedicated Verification Engine & DAGs</span>
              </div>
              
              <h3 className="text-2xl sm:text-4xl font-bold font-serif-display text-white tracking-tight">
                Inspect the Live Satellite Pipeline on a Dedicated Workspace
              </h3>
              
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                Examine interactive DAG stages (PDF Mandate, Cadastral GIS, Multi-temporal Telemetry, Audit Verdict), inspect flagged case studies like Solapur Green Corridor Phase-II, and download exportable evidence artifacts (KML, GeoJSON, CSV, and MoEFCC PDF briefs).
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3.5 shrink-0 w-full sm:w-auto">
              <button
                onClick={onLaunchPipeline}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white text-[#12372A] hover:bg-[#FAF8F3] font-bold text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.98]"
              >
                <span>Open Dedicated Pipeline Page</span>
                <ArrowRight size={17} />
              </button>

              <button
                onClick={onExploreDemo}
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border border-white/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Browse All Projects</span>
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
