import React, { useState, useMemo } from 'react';
import { Project, Language, ProjectStatus } from '../types';
import { translations } from '../translations';
import { StatusBadge } from './StatusBadge';
import { SatelliteViewer } from './SatelliteViewer';
import { SatelliteSceneModal } from './SatelliteSceneModal';
import { EvidenceReportModal } from './EvidenceReportModal';
import {
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Building,
  Satellite,
  AlertOctagon,
  CheckCircle2,
  Trees,
  X,
  LayoutGrid,
  Layers,
  Maximize2,
  Calendar,
  Printer,
  Tag,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

interface DashboardViewProps {
  projects: Project[];
  lang: Language;
  onSelectProject: (p: Project) => void;
  onOpenUpload: () => void;
}

type SearchScope = 'all' | 'name' | 'location' | 'status';

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  lang,
  onSelectProject,
  onOpenUpload,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchScope, setSearchScope] = useState<SearchScope>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'satellite_matrix'>('cards');
  const [inspectModalProject, setInspectModalProject] = useState<Project | null>(null);
  const [printReportProject, setPrintReportProject] = useState<Project | null>(null);

  const t = translations[lang];

  // Unique lists for filter dropdowns
  const states = useMemo(() => ['all', ...new Set(projects.map((p) => p.state))], [projects]);
  const sectors = useMemo(() => ['all', ...new Set(projects.map((p) => p.sector))], [projects]);
  const statuses: ('all' | ProjectStatus)[] = [
    'all',
    'field_verification_priority',
    'evidence_discrepancy',
    'monitoring_required',
    'likely_recovery',
  ];

  // Status counts for badge counters
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: projects.length };
    projects.forEach((p) => {
      counts[p.status] = (counts[p.status] || 0) + 1;
    });
    return counts;
  }, [projects]);

  // Compute summary stats
  const totalAreaHa = useMemo(() => {
    return projects.reduce((acc, p) => acc + (p.mapData?.caPlotHa || 0), 0);
  }, [projects]);

  const priorityCount = useMemo(() => {
    return projects.filter((p) => p.status === 'field_verification_priority' || p.status === 'evidence_discrepancy').length;
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return projects.filter((p) => {
      // 1. Name matches (Project name, proponent, mandate claim)
      const matchesName =
        p.name.toLowerCase().includes(q) ||
        p.proponent.toLowerCase().includes(q) ||
        (p.promise?.shortClaim && p.promise.shortClaim.toLowerCase().includes(q));

      // 2. Location matches (District, State, combined, Cadastral plot, survey numbers, coordinates)
      const locationString = `${p.district} ${p.state} ${p.mapData?.caPlotName || ''} ${p.mapData?.surveyNumbers || ''} ${p.mapData?.coordinatesDisplay || ''}`.toLowerCase();
      const matchesLocation = locationString.includes(q);

      // 3. Clearance Status matches (Status enum, translated label, clearance file ref, risk level, and common keywords)
      const statusLabel = (t.statusLabels[p.status] || '').toLowerCase();
      const statusRaw = p.status.toLowerCase().replace(/_/g, ' ');
      const clearanceRef = (p.clearanceFileRef || '').toLowerCase();
      const riskLevel = (p.riskLevel || '').toLowerCase();

      const statusKeywords: string[] = [];
      if (p.status === 'field_verification_priority') {
        statusKeywords.push('priority', 'urgent', 'deficit', 'flagged', 'high risk', 'critical', 'non-compliant');
      } else if (p.status === 'evidence_discrepancy') {
        statusKeywords.push('discrepancy', 'mismatch', 'anomaly', 'discrepant', 'medium risk', 'warning');
      } else if (p.status === 'monitoring_required') {
        statusKeywords.push('monitoring', 'supervision', 'in progress', 'maturing', 'moderate');
      } else if (p.status === 'likely_recovery') {
        statusKeywords.push('recovery', 'compliant', 'climax', 'success', 'verified', 'low risk', 'pass', 'replanted');
      }

      const matchesStatus =
        statusLabel.includes(q) ||
        statusRaw.includes(q) ||
        clearanceRef.includes(q) ||
        riskLevel.includes(q) ||
        statusKeywords.some((kw) => kw.includes(q) || q.includes(kw));

      // Evaluate search query based on selected scope
      let matchesSearch = true;
      if (q) {
        if (searchScope === 'name') {
          matchesSearch = matchesName;
        } else if (searchScope === 'location') {
          matchesSearch = matchesLocation;
        } else if (searchScope === 'status') {
          matchesSearch = matchesStatus;
        } else {
          matchesSearch = matchesName || matchesLocation || matchesStatus;
        }
      }

      // Evaluate explicit dropdown & pill filters
      const matchesState = selectedState === 'all' || p.state === selectedState;
      const matchesSector = selectedSector === 'all' || p.sector === selectedSector;
      const matchesStatusFilter = selectedStatus === 'all' || p.status === selectedStatus;

      return matchesSearch && matchesState && matchesSector && matchesStatusFilter;
    });
  }, [projects, searchQuery, searchScope, selectedState, selectedSector, selectedStatus, t]);

  const hasActiveFilters = searchQuery.trim() !== '' || selectedState !== 'all' || selectedSector !== 'all' || selectedStatus !== 'all' || searchScope !== 'all';

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSearchScope('all');
    setSelectedState('all');
    setSelectedSector('all');
    setSelectedStatus('all');
  };

  return (
    <div className="space-y-8 py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header with Telemetry Summary Stats */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-[#A8C3A0]">
              <ShieldCheck size={14} className="text-[#A8C3A0]" />
              <span>Copernicus Environmental Intelligence Registry</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white font-serif-display">
              {t.navExplore}
            </h1>
            <p className="text-xs sm:text-sm text-white/70 max-w-2xl leading-relaxed">
              Autonomous satellite auditing registry comparing statutory forest clearance mandates against multi-spectral Sentinel-2 and SAR radar ground observations.
            </p>
          </div>

          <button
            onClick={onOpenUpload}
            className="px-5 py-3 rounded-xl bg-[#3E7C59] hover:bg-[#4a9169] text-white text-xs sm:text-sm font-semibold shadow-md border border-[#A8C3A0]/30 transition-all flex items-center justify-center gap-2 self-start md:self-auto cursor-pointer"
          >
            <span>Audit New Clearance Document</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* High-End Environmental Intelligence Telemetry Metrics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 shadow-md space-y-1">
            <div className="flex items-center justify-between text-xs text-white/70">
              <span className="font-semibold uppercase text-[10px] tracking-wider">Monitored Parcels</span>
              <Trees size={15} className="text-[#A8C3A0]" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white font-serif-display tabular-nums">
              {projects.length} Active Sites
            </div>
            <div className="text-[11px] text-white/60">Across 4 Indian States</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 shadow-md space-y-1">
            <div className="flex items-center justify-between text-xs text-white/70">
              <span className="font-semibold uppercase text-[10px] tracking-wider">Total Audited Area</span>
              <Satellite size={15} className="text-[#60A5FA]" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white font-serif-display tabular-nums">
              {totalAreaHa.toFixed(1)} ha
            </div>
            <div className="text-[11px] text-white/60">Cadastral Afforestation</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 shadow-md space-y-1">
            <div className="flex items-center justify-between text-xs text-white/70">
              <span className="font-semibold uppercase text-[10px] tracking-wider">Verification Urgency</span>
              <AlertOctagon size={15} className="text-[#FF8A8A]" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#FF8A8A] font-serif-display tabular-nums">
              {priorityCount} High Priority
            </div>
            <div className="text-[11px] text-[#FF8A8A]/90 font-medium">Flagged for field inspection</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 shadow-md space-y-1">
            <div className="flex items-center justify-between text-xs text-white/70">
              <span className="font-semibold uppercase text-[10px] tracking-wider">Evidence Fidelity</span>
              <CheckCircle2 size={15} className="text-[#6EE7B7]" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white font-serif-display tabular-nums">
              93.8% Mean
            </div>
            <div className="text-[11px] text-white/60">Sentinel-2 L2A BOA Passes</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/15 p-5 sm:p-6 shadow-xl space-y-5">
        
        {/* Search Header & Scope Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white font-mono uppercase tracking-wider">
            <Search size={14} className="text-[#A8C3A0]" />
            <span>Search & Filter Projects</span>
          </div>

          {/* Search Target Scope Selector */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/15 text-[11px] self-start sm:self-auto">
            <span className="text-white/50 px-2 font-mono text-[10px] hidden md:inline">Scope:</span>
            {(
              [
                { id: 'all', label: 'All Fields' },
                { id: 'name', label: 'Name' },
                { id: 'location', label: 'Location' },
                { id: 'status', label: 'Clearance Status' },
              ] as const
            ).map((scope) => (
              <button
                key={scope.id}
                onClick={() => setSearchScope(scope.id)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium ${
                  searchScope === scope.id
                    ? 'bg-[#3E7C59] text-white shadow-xs'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {scope.label}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Search Input */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              searchScope === 'name'
                ? 'Search by project name, proponent, or agency (e.g. Solapur, NTPC, Kudgi)...'
                : searchScope === 'location'
                ? 'Search by state, district, or survey coordinates (e.g. Maharashtra, Karnataka, Barshi)...'
                : searchScope === 'status'
                ? 'Search by clearance status or ref (e.g. Priority, Discrepancy, Recovery, FC-MH-2018)...'
                : 'Search projects by name, location (state/district), or clearance status (e.g. Solapur, Maharashtra, Priority)...'
            }
            className="w-full pl-12 pr-12 h-12 rounded-2xl border border-white/20 bg-black/35 text-xs sm:text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-[#3E7C59] focus:border-transparent transition-all placeholder:text-white/40 shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
              title="Clear search"
              aria-label="Clear search input"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Quick Search Preset Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] text-white/50 font-mono flex items-center gap-1 mr-1">
            <Sparkles size={12} className="text-[#A8C3A0]" />
            <span>Quick Filters:</span>
          </span>
          {[
            { label: '📍 Maharashtra', query: 'Maharashtra', scope: 'location' as SearchScope },
            { label: '📍 Karnataka', query: 'Karnataka', scope: 'location' as SearchScope },
            { label: '⚠️ Priority Verification', query: 'Priority', scope: 'status' as SearchScope },
            { label: '⚠️ Evidence Discrepancy', query: 'Discrepancy', scope: 'status' as SearchScope },
            { label: '✅ Likely Recovery', query: 'Recovery', scope: 'status' as SearchScope },
            { label: '🌱 Solapur', query: 'Solapur', scope: 'name' as SearchScope },
          ].map((preset) => {
            const isMatch = searchQuery.toLowerCase() === preset.query.toLowerCase();
            return (
              <button
                key={preset.label}
                onClick={() => {
                  setSearchQuery(preset.query);
                  setSearchScope(preset.scope);
                }}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                  isMatch
                    ? 'bg-[#3E7C59] text-white border-[#A8C3A0] shadow-xs font-semibold'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Clearance Status Filter Pills with Live Badges */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white/70 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#A8C3A0]" />
              <span>Clearance Status:</span>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {statuses.map((st) => {
              const isSelected = selectedStatus === st;
              const label = st === 'all' ? 'All Statuses' : t.statusLabels[st as ProjectStatus];
              const count = statusCounts[st] || 0;
              return (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer font-medium flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#3E7C59] text-white border-[#A8C3A0]/60 shadow-xs'
                      : 'bg-white/5 text-white/80 border-white/15 hover:bg-white/10'
                  }`}
                >
                  <span>{label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-semibold ${
                      isSelected
                        ? 'bg-white/25 text-white'
                        : 'bg-black/30 text-white/60'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dropdown Filters for State and Sector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-white/10">
          {/* State Filter */}
          <div>
            <label className="block text-[10px] font-semibold text-white/70 uppercase tracking-wider mb-1 flex items-center gap-1">
              <MapPin size={11} className="text-[#A8C3A0]" />
              <span>{t.filterByState}</span>
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-white/20 bg-[#0e291e] text-xs sm:text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-[#3E7C59] cursor-pointer"
            >
              <option value="all" className="bg-[#0e291e] text-white">{t.allStates}</option>
              {states.filter((s) => s !== 'all').map((s) => (
                <option key={s} value={s} className="bg-[#0e291e] text-white">{s}</option>
              ))}
            </select>
          </div>

          {/* Sector Filter */}
          <div>
            <label className="block text-[10px] font-semibold text-white/70 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Building size={11} className="text-[#A8C3A0]" />
              <span>{t.filterBySector}</span>
            </label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-white/20 bg-[#0e291e] text-xs sm:text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-[#3E7C59] cursor-pointer"
            >
              <option value="all" className="bg-[#0e291e] text-white">{t.allSectors}</option>
              {sectors.filter((s) => s !== 'all').map((s) => (
                <option key={s} value={s} className="bg-[#0e291e] text-white">{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {hasActiveFilters && (
          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] text-white/50 font-mono mr-1">Active Filters:</span>
              
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white/15 border border-white/20 text-white text-[11px]">
                  <span>Query ({searchScope}): &ldquo;{searchQuery}&rdquo;</span>
                  <button onClick={() => setSearchQuery('')} className="hover:text-[#FF8A8A] cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              )}

              {selectedStatus !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#3E7C59]/40 border border-[#A8C3A0]/40 text-[#A8C3A0] text-[11px]">
                  <span>Status: {t.statusLabels[selectedStatus as ProjectStatus] || selectedStatus}</span>
                  <button onClick={() => setSelectedStatus('all')} className="hover:text-white cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              )}

              {selectedState !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white/15 border border-white/20 text-white text-[11px]">
                  <span>State: {selectedState}</span>
                  <button onClick={() => setSelectedState('all')} className="hover:text-[#FF8A8A] cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              )}

              {selectedSector !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white/15 border border-white/20 text-white text-[11px]">
                  <span>Sector: {selectedSector}</span>
                  <button onClick={() => setSelectedSector('all')} className="hover:text-[#FF8A8A] cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>

            <button
              onClick={handleClearAllFilters}
              className="text-xs text-[#FF8A8A] hover:text-white flex items-center gap-1.5 cursor-pointer font-medium transition-colors"
            >
              <RotateCcw size={12} />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

      </div>

      {/* Results View Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 px-5 py-3 rounded-2xl border border-white/10">
        <div className="text-xs text-white/70">
          Showing <span className="font-bold text-white">{filteredProjects.length}</span> audited afforestation sites
        </div>

        <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-xl border border-white/15 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'cards'
                ? 'bg-[#3E7C59] text-white shadow-xs'
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            <LayoutGrid size={13} />
            <span>Card Grid</span>
          </button>

          <button
            onClick={() => setViewMode('satellite_matrix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'satellite_matrix'
                ? 'bg-[#3E7C59] text-white shadow-xs'
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            <Satellite size={13} className="text-[#A8C3A0]" />
            <span>Direct Satellite Matrix</span>
          </button>
        </div>
      </div>

      {/* Projects List Results */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/15 p-10 sm:p-14 text-center space-y-4 shadow-xl max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-[#A8C3A0] mx-auto shadow-inner">
            <Search size={26} />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg sm:text-xl font-bold text-white font-serif-display">
              No Afforestation Parcels Found
            </h3>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              {searchQuery ? (
                <span>
                  No statutory records matched &ldquo;<strong className="text-white">{searchQuery}</strong>&rdquo; under {searchScope === 'all' ? 'any field' : searchScope}.
                </span>
              ) : (
                <span>No records matched your selected state, sector, or clearance status filters.</span>
              )}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={handleClearAllFilters}
              className="px-4 py-2 rounded-xl bg-[#3E7C59] hover:bg-[#4a9169] text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 shadow-md border border-[#A8C3A0]/30"
            >
              <RotateCcw size={13} />
              <span>Reset All Filters</span>
            </button>
            <button
              onClick={() => {
                setSearchQuery('Maharashtra');
                setSearchScope('location');
                setSelectedStatus('all');
                setSelectedState('all');
              }}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 text-xs font-medium transition-all cursor-pointer border border-white/15"
            >
              Search &ldquo;Maharashtra&rdquo;
            </button>
            <button
              onClick={() => {
                setSearchQuery('Priority');
                setSearchScope('status');
                setSelectedStatus('all');
                setSelectedState('all');
              }}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 text-xs font-medium transition-all cursor-pointer border border-white/15"
            >
              Search &ldquo;Priority Status&rdquo;
            </button>
          </div>
        </div>
      ) : viewMode === 'satellite_matrix' ? (
        /* DIRECT SATELLITE MATRIX VIEW */
        <div className="space-y-8">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/15 p-6 sm:p-7 shadow-xl space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-white/10 text-white/90 border border-white/15 flex items-center gap-1.5">
                      <MapPin size={12} className="text-[#A8C3A0]" />
                      <span>{p.state} • {p.district}</span>
                    </span>
                    <StatusBadge status={p.status} lang={lang} size="sm" />
                  </div>
                  <h3 className="text-xl font-bold font-serif-display text-white">
                    {p.name}
                  </h3>
                  <p className="text-xs text-white/70">
                    {p.proponent} • {p.mapData.caPlotHa} ha Mandated CA
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPrintReportProject(p)}
                    className="px-3.5 py-2 rounded-xl bg-[#3E7C59] hover:bg-[#4a9169] text-white text-xs font-semibold border border-[#A8C3A0]/30 transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                    title="Print formal compliance report as PDF"
                  >
                    <Printer size={13} className="text-[#A8C3A0]" />
                    <span>Print PDF</span>
                  </button>
                  <button
                    onClick={() => setInspectModalProject(p)}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Maximize2 size={13} className="text-[#A8C3A0]" />
                    <span>Observatory</span>
                  </button>
                  <button
                    onClick={() => onSelectProject(p)}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Statutory Audit</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* Direct Satellite Imagery Viewer for each project */}
              <SatelliteViewer
                project={p}
                lang={lang}
                initialBand="false_color"
                showTimelineSelector={true}
                onOpenFullscreen={() => setInspectModalProject(p)}
              />
            </div>
          ))}
        </div>
      ) : (
        /* STANDARD CARD GRID WITH EMBEDDED SATELLITE THUMBNAIL */
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="group bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl border border-white/15 hover:border-[#A8C3A0]/60 p-6 sm:p-7 shadow-md transition-all duration-200 flex flex-col justify-between space-y-5"
              id={`project-card-${p.id}`}
            >
              <div className="space-y-4">
                {/* Header with location & status badge */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/10 text-white/90 border border-white/15 flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#A8C3A0]" />
                    <span>{p.state} • {p.district}</span>
                  </span>
                  <StatusBadge status={p.status} lang={lang} size="sm" />
                </div>

                {/* Project Title */}
                <h3
                  onClick={() => onSelectProject(p)}
                  className="text-lg sm:text-xl font-bold text-white font-serif-display group-hover:text-[#A8C3A0] transition-colors leading-snug cursor-pointer"
                >
                  {p.name}
                </h3>

                {/* Proponent & Sector */}
                <div className="text-xs text-white/70 flex items-center gap-2">
                  <Building size={13} className="shrink-0 text-white/50" />
                  <span className="line-clamp-1">{p.proponent} • {p.sector}</span>
                </div>

                {/* DIRECT SATELLITE MINI-VIEWPORT WITH ONE-CLICK INSPECT */}
                <div className="relative rounded-xl overflow-hidden border border-white/15 bg-black/40 h-36 group/sat">
                  <SatelliteViewer
                    project={p}
                    compact={true}
                    initialBand="false_color"
                    showTimelineSelector={false}
                  />

                  {/* Overlay Action Button on Hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/sat:opacity-100 transition-opacity backdrop-blur-[2px] flex items-center justify-center gap-2 pointer-events-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectModalProject(p);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#3E7C59] text-white font-semibold text-xs flex items-center gap-1.5 shadow-xl hover:bg-[#4a9169] transition-all cursor-pointer border border-[#A8C3A0]/40"
                    >
                      <Satellite size={13} />
                      <span>Inspect Satellite Scene</span>
                    </button>
                  </div>

                  {/* Satellite Metadata Badge */}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-mono text-white/90 border border-white/15 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    <span>Sentinel-2 (10m GSD)</span>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-mono text-[#A8C3A0] border border-white/15">
                    NDVI {p.proof.currentNdvi.toFixed(2)}
                  </div>
                </div>

                {/* Brief Promise vs Proof Snapshot */}
                <div className="p-4 rounded-xl bg-black/25 border border-white/10 space-y-2.5 text-xs">
                  <div>
                    <span className="font-semibold text-[#FDBA74] block text-[10px] uppercase tracking-wider">
                      Clearance Mandate:
                    </span>
                    <p className="text-white/90 font-medium line-clamp-1 mt-0.5">
                      “{p.promise.shortClaim}” ({p.promise.requiredArea})
                    </p>
                  </div>
                  <div className="pt-2 border-t border-white/10">
                    <span className="font-semibold text-[#60A5FA] block text-[10px] uppercase tracking-wider">
                      Ground Observation:
                    </span>
                    <p className="text-white/80 line-clamp-1 mt-0.5">
                      “{p.proof.latestObservation}”
                    </p>
                  </div>

                  {/* AI Compliance Flag highlight if present */}
                  {p.aiCompliance?.flags && p.aiCompliance.flags.length > 0 && (
                    <div className="pt-2 border-t border-white/10 flex items-start gap-1.5 text-[11px] text-[#FF8A8A]">
                      <AlertTriangle size={13} className="shrink-0 mt-0.5 text-[#FF8A8A]" />
                      <span className="line-clamp-1">AI Flag: {p.aiCompliance.flags[0]}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Card Footer: Risk, Confidence, Compliance, Recovery, CTA */}
              <div className="pt-4 border-t border-white/10 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="grid grid-cols-4 gap-2 w-full text-center">
                    <div className="p-1.5 rounded-lg bg-black/30 border border-white/5">
                      <span className="text-white/60 block text-[9px] uppercase font-semibold">Risk</span>
                      <span className={`font-bold text-xs tabular-nums ${
                        p.complianceRiskScore > 70 ? 'text-[#FF8A8A]' : p.complianceRiskScore > 40 ? 'text-[#FDE68A]' : 'text-[#6EE7B7]'
                      }`}>
                        {p.complianceRiskScore}/100
                      </span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-black/30 border border-white/5">
                      <span className="text-white/60 block text-[9px] uppercase font-semibold">Compliance</span>
                      <span className={`font-bold text-xs tabular-nums ${
                        (p.complianceScore ?? 0) < 50 ? 'text-[#FF8A8A]' : (p.complianceScore ?? 0) < 75 ? 'text-[#FDE68A]' : 'text-[#6EE7B7]'
                      }`}>
                        {p.complianceScore ?? (100 - p.complianceRiskScore)}%
                      </span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-black/30 border border-white/5">
                      <span className="text-white/60 block text-[9px] uppercase font-semibold">Recovery</span>
                      <span className="font-bold text-xs text-[#A8C3A0] tabular-nums">
                        {p.forestRecoveryScore ?? Math.round(p.proof.currentNdvi * 100)}%
                      </span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-black/30 border border-white/5">
                      <span className="text-white/60 block text-[9px] uppercase font-semibold">Confidence</span>
                      <span className="font-bold text-xs text-white tabular-nums">
                        {p.evidenceConfidenceScore}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    p.aiCompliance?.nonComplianceFlagged
                      ? 'bg-[#ef4444]/15 border-[#ef4444]/40 text-[#F87171]'
                      : 'bg-[#10b981]/15 border-[#10b981]/40 text-[#6EE7B7]'
                  }`}>
                    {p.aiCompliance?.nonComplianceFlagged ? 'AI Deficit Flagged' : 'AI Nominal Trajectory'}
                  </span>

                  <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPrintReportProject(p)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer"
                    title="Print Formal Compliance Report (PDF)"
                  >
                    <Printer size={14} className="text-[#A8C3A0]" />
                  </button>

                  <button
                    onClick={() => setInspectModalProject(p)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer"
                    title="Inspect Satellite Imagery"
                  >
                    <Satellite size={14} className="text-[#A8C3A0]" />
                  </button>

                  <button
                    onClick={() => onSelectProject(p)}
                    className="inline-flex items-center gap-1.5 font-bold text-xs text-[#A8C3A0] hover:text-white transition-all cursor-pointer"
                  >
                    <span>{t.viewProject}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Fullscreen Satellite Scene Observatory Modal */}
      {inspectModalProject && (
        <SatelliteSceneModal
          project={inspectModalProject}
          lang={lang}
          onClose={() => setInspectModalProject(null)}
          onNavigateToDetail={() => onSelectProject(inspectModalProject)}
        />
      )}

      {/* Downloadable / Printable Editorial Report Modal */}
      {printReportProject && (
        <EvidenceReportModal
          project={printReportProject}
          lang={lang}
          autoPrintOnOpen={true}
          onClose={() => setPrintReportProject(null)}
        />
      )}
    </div>
  );
};
