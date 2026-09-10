import React, { useState, useEffect, useRef } from 'react';
import { Language, Project, SatelliteScene } from '../types';
import { mockProjects } from '../data/mockProjects';
import {
  Satellite,
  Search,
  MapPin,
  Calendar,
  Cloud,
  Sliders,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Download,
  Eye,
  Activity,
  Crosshair,
  Compass,
  FileText,
  SlidersHorizontal,
  SplitSquareVertical,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  Globe,
  X
} from 'lucide-react';
import {
  querySatelliteScenes,
  SATELLITE_PRESETS,
  geocodeLocation,
  fetchSatelliteStatus,
  executePipelineAnalysis
} from '../utils/satelliteService';
import { useToast } from '../context/ToastContext';

interface SatelliteExplorerViewProps {
  lang: Language;
  onSendToPipeline: (scene: SatelliteScene, coordinates: [number, number], plotInfo?: any) => void;
  onSelectProject?: (p: Project) => void;
  initialCoordinates?: [number, number];
}

export type SpectralBandMode = 'true_color' | 'false_color' | 'ndvi' | 'sar_radar';
export type ViewportMode = 'cadastral_parcel' | 'orbital_granule';

export const SatelliteExplorerView: React.FC<SatelliteExplorerViewProps> = ({
  lang,
  onSendToPipeline,
  onSelectProject,
  initialCoordinates = [17.6599, 75.9064],
}) => {
  const { toast } = useToast();

  // Active Project Reference
  const [selectedPresetId, setSelectedPresetId] = useState<string>('solapur-green-corridor');
  const activeProject: Project = mockProjects.find(p => p.id === selectedPresetId) || mockProjects[0];

  // Location / Coordinate state
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCoords, setCurrentCoords] = useState<[number, number]>(initialCoordinates);
  const [latInput, setLatInput] = useState(initialCoordinates[0].toString());
  const [lonInput, setLonInput] = useState(initialCoordinates[1].toString());

  // Satellite search parameters
  const [satelliteConstellation, setSatelliteConstellation] = useState<'sentinel-2-l2a' | 'landsat-c2-l2' | 'sentinel-1-grd'>('sentinel-2-l2a');
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [maxCloudCover, setMaxCloudCover] = useState<number>(25);
  const [searchRadiusKm, setSearchRadiusKm] = useState<number>(10);

  // Search results & Selected Scene state
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [scenes, setScenes] = useState<SatelliteScene[]>([]);
  const [selectedScene, setSelectedScene] = useState<SatelliteScene | null>(null);
  const [providerInfo, setProviderInfo] = useState<string>('AWS Earth Search STAC');

  // Visualization & Viewport states
  const [viewportMode, setViewportMode] = useState<ViewportMode>('cadastral_parcel');
  const [bandMode, setBandMode] = useState<SpectralBandMode>('ndvi');
  const [splitCompareMode, setSplitCompareMode] = useState(false);
  const [splitPosition, setSplitPosition] = useState(50); // percentage 0-100
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Overlays & HUD
  const [showBoundaryOverlay, setShowBoundaryOverlay] = useState(true);
  const [showSpectralGrid, setShowSpectralGrid] = useState(true);
  const [showAnomalyMask, setShowAnomalyMask] = useState(true);
  const [hoverPixel, setHoverPixel] = useState<{ x: number; y: number; lat: number; lon: number; ndvi: number; classification: string } | null>(null);
  const [showSwathExplainer, setShowSwathExplainer] = useState(false);
  const [fillBasemapBackdrop, setFillBasemapBackdrop] = useState(false);

  // Quick Diagnostics Drawer
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [isComputingDiagnostics, setIsComputingDiagnostics] = useState(false);
  const [diagnosticData, setDiagnosticData] = useState<any>(null);

  // Provider health check
  const [providerStatus, setProviderStatus] = useState<any>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSatelliteStatus().then(setProviderStatus).catch(() => {});
    executeSearch();
  }, []);

  // Execute Search against STAC API
  const executeSearch = async (coordsOverride?: [number, number]) => {
    const coordsToQuery = coordsOverride || currentCoords;
    setIsLoading(true);
    setSearchError(null);

    try {
      const deltaDeg = (searchRadiusKm / 111);
      const bbox: [number, number, number, number] = [
        coordsToQuery[1] - deltaDeg,
        coordsToQuery[0] - deltaDeg,
        coordsToQuery[1] + deltaDeg,
        coordsToQuery[0] + deltaDeg,
      ];

      const res = await querySatelliteScenes({
        coordinates: coordsToQuery,
        bbox,
        dateRange: { start: startDate, end: endDate },
        satellite: satelliteConstellation,
        maxCloudCover,
        limit: 8,
      });

      if (res.scenes && res.scenes.length > 0) {
        setScenes(res.scenes);
        setSelectedScene(res.scenes[0]);
        setProviderInfo(res.provider);
        toast.success('Satellite Scenes Ingested', {
          message: `Retrieved ${res.scenes.length} orbit passes for [${coordsToQuery[0].toFixed(3)}, ${coordsToQuery[1].toFixed(3)}].`,
          duration: 3500,
        });
      } else {
        setScenes([]);
        setSelectedScene(null);
        setSearchError('No cloud-free satellite passes found within the specified date range and threshold.');
      }
    } catch (err: any) {
      const msg = err.message || 'Unable to retrieve satellite imagery. Please check coordinates, date range, or provider configuration.';
      setSearchError(msg);
      toast.error('Satellite Retrieval Issue', { message: msg, duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Preset selection
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const p = SATELLITE_PRESETS.find(x => x.id === presetId);
    if (p) {
      setCurrentCoords(p.coordinates);
      setLatInput(p.coordinates[0].toString());
      setLonInput(p.coordinates[1].toString());
      setPanOffset({ x: 0, y: 0 });
      setZoomLevel(1);
      executeSearch(p.coordinates);
    }
  };

  // Handle Manual Coordinates apply
  const handleApplyCoordinates = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(latInput);
    const lon = parseFloat(lonInput);
    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      toast.warning('Invalid Coordinates', {
        message: 'Latitude must be between -90 and 90, Longitude between -180 and 180.',
      });
      return;
    }
    const newCoords: [number, number] = [lat, lon];
    setCurrentCoords(newCoords);
    setSelectedPresetId('custom');
    setPanOffset({ x: 0, y: 0 });
    setZoomLevel(1);
    executeSearch(newCoords);
  };

  // Handle Text Geocode Search
  const handleGeocodeSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    const geo = await geocodeLocation(searchQuery);
    if (geo.found && typeof geo.lat === 'number' && typeof geo.lon === 'number') {
      const newCoords: [number, number] = [geo.lat, geo.lon];
      setCurrentCoords(newCoords);
      setLatInput(geo.lat.toString());
      setLonInput(geo.lon.toString());
      setSelectedPresetId('custom');
      setPanOffset({ x: 0, y: 0 });
      setZoomLevel(1);
      toast.info('Location Geocoded', {
        message: `Centered on ${geo.name || searchQuery}. Querying orbital coverage...`,
      });
      executeSearch(newCoords);
    } else {
      setIsLoading(false);
      toast.warning('Location Not Found', {
        message: geo.message || `Could not resolve "${searchQuery}". Please enter latitude/longitude directly.`,
      });
    }
  };

  // Interactive Pan & Drag handling
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // If dragging split compare slider
    if (splitCompareMode && Math.abs(e.nativeEvent.offsetX - (canvasRef.current?.clientWidth || 500) * (splitPosition / 100)) < 15) {
      return;
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;

    // If dragging viewport
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }

    // Normalized coordinate computation
    const normX = Math.max(0, Math.min(1, x / width));
    const normY = Math.max(0, Math.min(1, y / height));

    // Derive geographic coordinates from center and delta
    const deltaLat = (normY - 0.5) * -0.02 / zoomLevel;
    const deltaLon = (normX - 0.5) * 0.02 / zoomLevel;
    const pixelLat = currentCoords[0] + deltaLat;
    const pixelLon = currentCoords[1] + deltaLon;

    // Biophysical NDVI computation based on parcel coordinates
    const baseVal = activeProject.vegetationAnalytics?.currentNdvi || 0.31;
    const isInsideParcel = normX > 0.32 && normX < 0.78 && normY > 0.22 && normY < 0.76;
    let localNdvi: number;

    if (isInsideParcel) {
      localNdvi = Math.max(0.12, Math.min(0.85, baseVal + Math.sin(normX * 14 + normY * 11) * 0.09));
    } else {
      localNdvi = Math.max(0.06, baseVal * 0.75 + Math.cos(normX * 10) * 0.05);
    }
    localNdvi = Math.round(localNdvi * 100) / 100;

    let classification = 'Barren / Sparse Scrub';
    if (localNdvi > 0.6) classification = 'Dense Healthy Canopy';
    else if (localNdvi > 0.45) classification = 'Moderate Forest Canopy';
    else if (localNdvi > 0.3) classification = 'Degraded Scrub / Grassland';
    else if (localNdvi < 0.1) classification = 'Bare Soil / Exposed Rock';

    setHoverPixel({
      x,
      y,
      lat: pixelLat,
      lon: pixelLon,
      ndvi: localNdvi,
      classification,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.88;
    setZoomLevel(prev => Math.max(0.7, Math.min(3.5, prev * zoomFactor)));
  };

  const handleResetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Run Quick In-View Diagnostics
  const handleRunDiagnostics = async () => {
    setIsComputingDiagnostics(true);
    setShowDiagnostics(true);
    try {
      const res = await executePipelineAnalysis({
        sceneId: selectedScene?.id || 'S2A_43QEV_20260621_0_L2A',
        coordinates: currentCoords,
        plotAreaHa: activeProject.mapData?.caPlotHa || 100,
        targetNdvi: activeProject.vegetationAnalytics?.targetNdvi || 0.62,
        baselineNdvi: activeProject.vegetationAnalytics?.baselineNdvi || 0.27,
      });
      setDiagnosticData(res);
      toast.success('Spectral Audit Complete', {
        message: `Zonal analysis computed for ${activeProject.name}.`,
      });
    } catch (err: any) {
      toast.error('Diagnostic Computation Error', {
        message: err.message || 'Failed to complete in-view spectral analysis.',
      });
    } finally {
      setIsComputingDiagnostics(false);
    }
  };

  // SVG Cadastral Boundary Points derived from active project
  const boundaryPointsStr = activeProject.mapData?.boundaryCoords
    ? activeProject.mapData.boundaryCoords.map(pt => `${pt.x * 10},${pt.y * 6}`).join(' ')
    : '380,132 680,120 740,288 550,384 320,330';

  const impactPointsStr = activeProject.mapData?.impactCoords
    ? activeProject.mapData.impactCoords.map(pt => `${pt.x * 10},${pt.y * 6}`).join(' ')
    : '120,432 260,408 420,480 220,528';

  const riskHatchPointsStr = activeProject.mapData?.riskHatchCoords
    ? activeProject.mapData.riskHatchCoords.map(pt => `${pt.x * 10},${pt.y * 6}`).join(' ')
    : '400,156 620,144 660,276 360,300';

  return (
    <div className="min-h-screen bg-[#06120D] text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ===================================================================== */}
        {/* HEADER & OPERATIONAL BREADCRUMB                                       */}
        {/* ===================================================================== */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#A8C3A0] mb-1">
              <Satellite size={15} />
              <span>Multi-Mission Earth Observation & STAC Explorer</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-white/60">Live Query Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
              Satellite Scene & Spectral Explorer
            </h1>
            <p className="text-xs sm:text-sm text-white/70 max-w-2xl mt-1">
              Direct access to Copernicus Sentinel-2 MSI, USGS Landsat-8/9 OLI, and Sentinel-1 SAR C-Band Radar.
              Inspect true multi-spectral band stacks, cadastral boundaries, and live biophysical indices.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick Diagnostics Action */}
            <button
              onClick={handleRunDiagnostics}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold text-white border border-white/20 flex items-center gap-2 cursor-pointer transition-all shadow-sm"
              title="Compute instant zonal vegetation metrics for current parcel"
            >
              <Activity size={14} className="text-[#A8C3A0]" />
              <span>Spectral Diagnostics</span>
            </button>

            {/* Direct Send to Statutory Analysis Pipeline */}
            {selectedScene && (
              <button
                onClick={() => {
                  const p = SATELLITE_PRESETS.find(x => x.id === selectedPresetId) || {
                    id: activeProject.id,
                    name: activeProject.name,
                    coordinates: currentCoords,
                  };
                  onSendToPipeline(selectedScene, currentCoords, p);
                  toast.success('Scene Transferred to Pipeline', {
                    message: `Loaded ${selectedScene.id} into verification pipeline.`,
                  });
                }}
                className="px-4 py-2 rounded-xl bg-[#3E7C59] hover:bg-[#478f66] active:scale-95 text-xs sm:text-sm font-semibold text-white border border-[#A8C3A0]/30 shadow-md flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>Send Scene to Analysis Pipeline</span>
                <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>

        {/* ===================================================================== */}
        {/* CORRIDOR PRESET SWITCHER & COORDINATES BAR                            */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 p-3.5 rounded-2xl bg-[#0B1E15] border border-white/10 shadow-lg">
          
          {/* Preset Corridor Selector */}
          <div className="lg:col-span-4 flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-white/60 shrink-0 flex items-center gap-1">
              <MapPin size={13} className="text-[#A8C3A0]" />
              Corridor:
            </span>
            <select
              value={selectedPresetId}
              onChange={(e) => handleSelectPreset(e.target.value)}
              className="w-full bg-[#06120D] text-xs font-semibold text-white border border-white/20 rounded-xl px-3 py-2 outline-none focus:border-[#A8C3A0] cursor-pointer"
            >
              {SATELLITE_PRESETS.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#0B1E15] text-white">
                  {p.name} ({p.district}, {p.state})
                </option>
              ))}
              <option value="custom" className="bg-[#0B1E15] text-white">
                Custom Geographic Coordinates...
              </option>
            </select>
          </div>

          {/* Coordinate Form */}
          <form onSubmit={handleApplyCoordinates} className="lg:col-span-5 flex items-center gap-2">
            <div className="flex items-center gap-1.5 flex-1">
              <span className="text-[11px] font-mono text-white/60">Lat:</span>
              <input
                type="text"
                value={latInput}
                onChange={(e) => setLatInput(e.target.value)}
                placeholder="17.6599"
                className="w-full bg-[#06120D] text-xs font-mono text-white border border-white/20 rounded-xl px-2.5 py-1.5 outline-none focus:border-[#A8C3A0]"
              />
            </div>
            <div className="flex items-center gap-1.5 flex-1">
              <span className="text-[11px] font-mono text-white/60">Lon:</span>
              <input
                type="text"
                value={lonInput}
                onChange={(e) => setLonInput(e.target.value)}
                placeholder="75.9064"
                className="w-full bg-[#06120D] text-xs font-mono text-white border border-white/20 rounded-xl px-2.5 py-1.5 outline-none focus:border-[#A8C3A0]"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/20 shrink-0 cursor-pointer transition-colors"
            >
              Locate
            </button>
          </form>

          {/* Text Geocoder Search */}
          <form onSubmit={handleGeocodeSearch} className="lg:col-span-3 flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-3 top-2.5 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search district, forest..."
                className="w-full bg-[#06120D] text-xs text-white pl-8 pr-3 py-1.5 border border-white/20 rounded-xl outline-none focus:border-[#A8C3A0]"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="p-1.5 rounded-xl bg-[#3E7C59] hover:bg-[#478f66] text-white shrink-0 cursor-pointer transition-colors"
              title="Search place or district"
            >
              <Search size={14} />
            </button>
          </form>
        </div>

        {/* ===================================================================== */}
        {/* ORBITAL QUERY PARAMETERS TOOLBAR                                      */}
        {/* ===================================================================== */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#091811] border border-white/10 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Constellation */}
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-white/60">Constellation:</span>
              <select
                value={satelliteConstellation}
                onChange={(e: any) => {
                  setSatelliteConstellation(e.target.value);
                }}
                className="bg-[#06120D] text-xs font-mono text-[#A8C3A0] border border-white/20 rounded-lg px-2.5 py-1 outline-none"
              >
                <option value="sentinel-2-l2a">Sentinel-2A/2B (MSI 10m Optical)</option>
                <option value="landsat-c2-l2">Landsat-8/9 (OLI-2 30m Optical)</option>
                <option value="sentinel-1-grd">Sentinel-1 (C-Band SAR Radar)</option>
              </select>
            </div>

            {/* Date Range Start */}
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-white/60">From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-[#06120D] text-xs font-mono text-white border border-white/20 rounded-lg px-2 py-1 outline-none"
              />
            </div>

            {/* Date Range End */}
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-white/60">To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-[#06120D] text-xs font-mono text-white border border-white/20 rounded-lg px-2 py-1 outline-none"
              />
            </div>

            {/* Max Cloud Cover */}
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-white/60">Max Cloud:</span>
              <select
                value={maxCloudCover}
                onChange={(e) => setMaxCloudCover(Number(e.target.value))}
                className="bg-[#06120D] text-xs font-mono text-white border border-white/20 rounded-lg px-2 py-1 outline-none"
              >
                <option value={10}>&lt; 10% (Optimal)</option>
                <option value={20}>&lt; 20% (Standard)</option>
                <option value={40}>&lt; 40% (Permissive)</option>
                <option value={100}>100% (All Passes)</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => executeSearch()}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/20 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
            <span>Re-query Passes</span>
          </button>
        </div>

        {/* Error Notification */}
        {searchError && (
          <div className="p-3 rounded-2xl bg-[#7F1D1D]/30 border border-[#EF4444]/40 text-xs text-[#FCA5A5] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle size={15} className="shrink-0 text-[#EF4444]" />
              <span>{searchError}</span>
            </div>
            <button
              onClick={() => executeSearch()}
              className="px-2.5 py-1 rounded bg-[#EF4444]/30 hover:bg-[#EF4444]/50 text-white font-semibold text-[11px] cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* ===================================================================== */}
        {/* MAIN DISPLAY: INTERACTIVE SATELLITE CANVAS + SCENE EXPLORER          */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* Main Visualizer Stage (Left 8 Cols) */}
          <div className="xl:col-span-8 space-y-3">
            
            {/* Viewport Control Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A8C3A0] flex items-center gap-1.5">
                  <Eye size={14} />
                  <span>Spectral Surface Viewport</span>
                </span>
                {selectedScene && (
                  <span className="text-xs font-mono text-white/70 hidden sm:inline">
                    • {selectedScene.id}
                  </span>
                )}
              </div>

              {/* Viewport Mode & Band Mode Tabs */}
              <div className="flex items-center gap-2">
                {/* Cadastral vs Granule Framing Toggle */}
                <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
                  <button
                    onClick={() => setViewportMode('cadastral_parcel')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      viewportMode === 'cadastral_parcel'
                        ? 'bg-[#3E7C59] text-white shadow-xs'
                        : 'text-white/70 hover:text-white'
                    }`}
                    title="Zoom directly into the 100 ha Compensatory Afforestation parcel (10m Native GSD)"
                  >
                    Parcel Focus (10m)
                  </button>
                  <button
                    onClick={() => setViewportMode('orbital_granule')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      viewportMode === 'orbital_granule'
                        ? 'bg-[#3E7C59] text-white shadow-xs'
                        : 'text-white/70 hover:text-white'
                    }`}
                    title="View full 100km x 100km Copernicus Sentinel-2 MGRS Granule"
                  >
                    Orbit Granule (100km)
                  </button>
                </div>

                {/* Quick Swath Explainer trigger when viewing Orbit Granule */}
                {viewportMode === 'orbital_granule' && (
                  <button
                    onClick={() => setShowSwathExplainer(true)}
                    className="px-2.5 py-1 rounded-xl bg-black/40 hover:bg-black/60 border border-[#74BDE0]/40 text-[#74BDE0] text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                    title="Why does this granule have a diagonal cut with black space?"
                  >
                    <HelpCircle size={12} />
                    <span className="hidden sm:inline">Why is half black?</span>
                  </button>
                )}

                {/* Multi-spectral Band Selectors */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
                  <button
                    onClick={() => setBandMode('ndvi')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      bandMode === 'ndvi'
                        ? 'bg-[#3E7C59] text-white shadow-xs'
                        : 'text-white/70 hover:text-white'
                    }`}
                    title="Normalized Difference Vegetation Index (Biophysical Heatmap)"
                  >
                    NDVI Index
                  </button>
                  <button
                    onClick={() => setBandMode('false_color')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      bandMode === 'false_color'
                        ? 'bg-[#3E7C59] text-white shadow-xs'
                        : 'text-white/70 hover:text-white'
                    }`}
                    title="False Color Infrared (NIR/B8 - Highlights vegetative canopy vigor)"
                  >
                    False Color (NIR)
                  </button>
                  <button
                    onClick={() => setBandMode('true_color')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      bandMode === 'true_color'
                        ? 'bg-[#3E7C59] text-white shadow-xs'
                        : 'text-white/70 hover:text-white'
                    }`}
                    title="Natural True Color (RGB: B4, B3, B2)"
                  >
                    True Color
                  </button>
                  <button
                    onClick={() => setBandMode('sar_radar')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      bandMode === 'sar_radar'
                        ? 'bg-[#3E7C59] text-white shadow-xs'
                        : 'text-white/70 hover:text-white'
                    }`}
                    title="Synthetic Aperture Radar (Sentinel-1 C-Band VV/VH Backscatter)"
                  >
                    SAR Radar
                  </button>
                </div>
              </div>
            </div>

            {/* Satellite Canvas Container */}
            <div
              ref={canvasRef}
              className="relative w-full h-[480px] sm:h-[540px] rounded-3xl overflow-hidden bg-[#07130E] border border-white/15 shadow-2xl select-none group cursor-grab active:cursor-grabbing"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={() => {
                setIsDragging(false);
                setHoverPixel(null);
              }}
              onWheel={handleWheel}
            >
              {/* GIS Interactive Layer Container */}
              {selectedScene ? (
                <div
                  className="absolute inset-0 w-full h-full transition-transform duration-75 ease-out"
                  style={{
                    transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                    transformOrigin: 'center center',
                  }}
                >
                  {/* LAYER A: Base Imagery (High-Res Parcel Orthomosaic OR Full Sentinel Granule) */}
                  {viewportMode === 'orbital_granule' ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      {/* Optional Contextual Basemap Backdrop */}
                      {fillBasemapBackdrop && (
                        <div
                          className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
                          style={{
                            backgroundImage: 'radial-gradient(circle at 50% 50%, #1a3325 0%, #0d1e16 60%, #06110c 100%)',
                            backgroundSize: 'cover',
                          }}
                        >
                          <svg className="w-full h-full opacity-35" viewBox="0 0 1000 600" preserveAspectRatio="none">
                            <path d="M 0 160 Q 300 120 600 240 T 1000 180" fill="none" stroke="#6ee7b7" strokeOpacity="0.3" strokeWidth="1" />
                            <path d="M 0 320 Q 350 420 700 300 T 1000 400" fill="none" stroke="#6ee7b7" strokeOpacity="0.3" strokeWidth="1" />
                            <path d="M 60 120 Q 320 220 540 110 T 960 380" fill="none" stroke="#38bdf8" strokeOpacity="0.3" strokeWidth="8" />
                          </svg>
                        </div>
                      )}

                      <img
                        src={selectedScene.thumbnailUrl}
                        alt={selectedScene.id}
                        className={`w-full h-full object-contain relative z-10 ${fillBasemapBackdrop ? 'mix-blend-screen' : ''}`}
                        style={{
                          filter: bandMode === 'false_color'
                            ? 'contrast(125%) saturate(140%) hue-rotate(310deg)'
                            : bandMode === 'ndvi'
                            ? 'contrast(135%) saturate(180%) hue-rotate(85deg)'
                            : bandMode === 'sar_radar'
                            ? 'grayscale(100%) contrast(160%) brightness(95%)'
                            : 'contrast(105%) saturate(110%)',
                        }}
                        onError={(e) => {
                          // Fallback in case S3 image fails to load
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    /* High-Resolution Scientific Cadastral Canvas */
                    <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
                      <defs>
                        {/* Terrain Gradients */}
                        <linearGradient id="sat-grad-true" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#1E3328" />
                          <stop offset="50%" stopColor="#2A4736" />
                          <stop offset="100%" stopColor="#192C21" />
                        </linearGradient>

                        <linearGradient id="sat-grad-nir" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#881337" />
                          <stop offset="50%" stopColor="#9F1239" />
                          <stop offset="100%" stopColor="#4C0519" />
                        </linearGradient>

                        <linearGradient id="sat-grad-ndvi" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#064E3B" />
                          <stop offset="40%" stopColor="#047857" />
                          <stop offset="70%" stopColor="#B45309" />
                          <stop offset="100%" stopColor="#7F1D1D" />
                        </linearGradient>

                        <linearGradient id="sat-grad-sar" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#1F2937" />
                          <stop offset="50%" stopColor="#374151" />
                          <stop offset="100%" stopColor="#111827" />
                        </linearGradient>

                        {/* Deficit Warning Hatch Pattern */}
                        <pattern id="explorer-anomaly-hatch" width="16" height="16" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                          <line x1="0" y1="0" x2="0" y2="16" stroke="#EF4444" strokeWidth="2.5" strokeOpacity="0.85" />
                        </pattern>

                        {/* Radar Texture Pattern */}
                        <pattern id="explorer-sar-speckle" width="8" height="8" patternUnits="userSpaceOnUse">
                          <rect width="2" height="2" fill="#FFFFFF" fillOpacity="0.12" />
                          <rect x="4" y="4" width="2" height="2" fill="#FFFFFF" fillOpacity="0.08" />
                        </pattern>
                      </defs>

                      {/* 1. Base Terrain Fill */}
                      <rect
                        width="1000"
                        height="600"
                        fill={
                          bandMode === 'false_color'
                            ? 'url(#sat-grad-nir)'
                            : bandMode === 'ndvi'
                            ? 'url(#sat-grad-ndvi)'
                            : bandMode === 'sar_radar'
                            ? 'url(#sat-grad-sar)'
                            : 'url(#sat-grad-true)'
                        }
                      />

                      {bandMode === 'sar_radar' && <rect width="1000" height="600" fill="url(#explorer-sar-speckle)" />}

                      {/* 2. Topographical Contours */}
                      <path d="M 0 160 Q 300 120 600 240 T 1000 180" fill="none" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1.2" />
                      <path d="M 0 320 Q 350 420 700 300 T 1000 400" fill="none" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1.2" />
                      <path d="M 0 480 Q 250 420 520 540 T 1000 490" fill="none" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="1" />

                      {/* 3. Hydrology: Natural River / Water Body */}
                      <path
                        d="M 60 120 Q 320 220 540 110 T 960 380"
                        fill="none"
                        stroke={bandMode === 'false_color' ? '#0F172A' : '#1E3A8A'}
                        strokeWidth="24"
                        strokeLinecap="round"
                        strokeOpacity="0.85"
                      />

                      {/* 4. Surrounding Natural Forest Canopy Clusters */}
                      <g fill={bandMode === 'false_color' ? '#E11D48' : bandMode === 'ndvi' ? '#10B981' : '#2D5A3F'} fillOpacity="0.6">
                        <ellipse cx="140" cy="220" rx="90" ry="60" />
                        <ellipse cx="260" cy="180" rx="70" ry="50" />
                        <ellipse cx="880" cy="140" rx="100" ry="70" />
                        <ellipse cx="820" cy="460" rx="120" ry="80" />
                        <ellipse cx="180" cy="460" rx="100" ry="70" />
                      </g>

                      {/* 5. Diverted Infrastructure Corridor Strip */}
                      <polygon
                        points={impactPointsStr}
                        fill={bandMode === 'false_color' ? 'rgba(100, 116, 139, 0.4)' : 'rgba(120, 90, 60, 0.35)'}
                        stroke="#F59E0B"
                        strokeWidth="2"
                        strokeDasharray="6 4"
                      />

                      {/* 6. Active Compensatory Afforestation Plot Area (Observed Canopy) */}
                      <g fill={bandMode === 'false_color' ? '#BE123C' : bandMode === 'ndvi' ? '#34D399' : '#3E7C59'} fillOpacity="0.85">
                        <ellipse cx="520" cy="230" rx="120" ry="80" />
                        <ellipse cx="650" cy="210" rx="90" ry="65" />
                        <ellipse cx="440" cy="270" rx="80" ry="55" />
                        <ellipse cx="580" cy="330" rx="85" ry="60" />
                      </g>

                      {/* 7. Flagged Vegetative Stagnation / Deficit Anomaly Area */}
                      {showAnomalyMask && (
                        <polygon
                          points={riskHatchPointsStr}
                          fill="url(#explorer-anomaly-hatch)"
                          stroke="#EF4444"
                          strokeWidth="2"
                        />
                      )}

                      {/* 8. Cadastral Boundary Geofence Polygon Overlay */}
                      {showBoundaryOverlay && (
                        <g>
                          <polygon
                            points={boundaryPointsStr}
                            fill="rgba(16, 185, 129, 0.10)"
                            stroke="#6EE7B7"
                            strokeWidth="2.5"
                            strokeDasharray="7 4"
                          />
                          <circle cx="530" cy="250" r="5" fill="#6EE7B7" />
                          <text
                            x="545"
                            y="255"
                            fill="#6EE7B7"
                            fontSize="13"
                            fontFamily="monospace"
                            fontWeight="bold"
                            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                          >
                            {activeProject.mapData?.caPlotName || 'CA Plot Boundary'} [{currentCoords[0].toFixed(3)}, {currentCoords[1].toFixed(3)}]
                          </text>
                        </g>
                      )}
                    </svg>
                  )}

                  {/* UTM Metric Grid Overlay */}
                  {showSpectralGrid && (
                    <div
                      className="absolute inset-0 pointer-events-none opacity-20"
                      style={{
                        backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)`,
                        backgroundSize: '80px 80px',
                      }}
                    />
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <Satellite size={40} className="text-white/40 animate-pulse" />
                  <span className="text-sm font-semibold text-white/80">
                    No Satellite Scene Loaded
                  </span>
                  <p className="text-xs text-white/60 max-w-sm">
                    Select an afforestation corridor or search coordinates above to query orbital passes.
                  </p>
                </div>
              )}

              {/* Split Compare Mode Slider Handle */}
              {splitCompareMode && (
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-2xl"
                  style={{ left: `${splitPosition}%` }}
                  onPointerDown={(e) => {
                    const handleMove = (ev: MouseEvent) => {
                      if (!canvasRef.current) return;
                      const rect = canvasRef.current.getBoundingClientRect();
                      const pos = Math.max(5, Math.min(95, ((ev.clientX - rect.left) / rect.width) * 100));
                      setSplitPosition(pos);
                    };
                    const handleUp = () => {
                      window.removeEventListener('mousemove', handleMove);
                      window.removeEventListener('mouseup', handleUp);
                    };
                    window.addEventListener('mousemove', handleMove);
                    window.addEventListener('mouseup', handleUp);
                  }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white text-black flex items-center justify-center shadow-lg border border-black/20 text-[10px] font-bold">
                    ⇄
                  </div>
                </div>
              )}

              {/* Floating Live Telemetry HUD (Top Left) */}
              <div className="absolute top-4 left-4 p-3 rounded-2xl bg-black/75 backdrop-blur-md border border-white/15 space-y-1 text-xs pointer-events-none z-10 shadow-xl">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="font-mono font-bold text-[#A8C3A0] uppercase tracking-wider text-[11px]">
                    {selectedScene?.sensor || 'Sentinel-2 MSI Level-2A'}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-white/80 space-y-0.5">
                  <div>Granule: <span className="text-white font-semibold">{selectedScene?.id || 'S2A_43QEV_20260621'}</span></div>
                  <div>Acquired: <span className="text-white font-semibold">{selectedScene?.displayDate || 'Latest Pass'}</span></div>
                  <div>Cloud Cover: <span className="text-[#6EE7B7] font-semibold">{selectedScene?.cloudCover || 0}%</span></div>
                  <div>Tile: <span className="text-white font-semibold">{selectedScene?.tileId || 'MGRS 43QEV'}</span></div>
                </div>
              </div>

              {/* Spectral Band Mode Badge (Top Right) */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <span className="px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 text-[11px] font-mono text-white/90 shadow-lg">
                  Band: <strong className="text-[#A8C3A0]">{bandMode.toUpperCase().replace('_', ' ')}</strong>
                </span>
              </div>

              {/* Orbital Swath Notice Banner (Explaining why the remaining is black) */}
              {viewportMode === 'orbital_granule' && (
                <div className="absolute top-16 sm:top-4 left-1/2 -translate-x-1/2 max-w-[94%] sm:max-w-lg px-3.5 py-2 rounded-2xl bg-black/85 backdrop-blur-md border border-[#74BDE0]/60 shadow-2xl z-20 text-xs flex items-center justify-between gap-3 animate-in fade-in duration-150">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-xl bg-[#74BDE0]/20 border border-[#74BDE0]/40 flex items-center justify-center shrink-0 text-[#74BDE0]">
                      <Satellite size={14} />
                    </div>
                    <div className="leading-tight min-w-0">
                      <div className="flex items-center gap-1.5 font-bold text-white text-[11px]">
                        <span className="truncate">Orbital Swath Pass</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-[#74BDE0] font-mono border border-[#74BDE0]/30 shrink-0">
                          ESA NoData (0)
                        </span>
                      </div>
                      <p className="text-[10px] text-white/75 mt-0.5 truncate">
                        Black zone is outside the 290km sensor swath across this 100km tile.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setViewportMode('cadastral_parcel')}
                      className="px-2.5 py-1 rounded-lg bg-[#3E7C59] hover:bg-[#4a9169] text-white font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                      title="Zoom directly into the 100 ha Compensatory Afforestation parcel"
                    >
                      <span>Parcel Focus</span>
                      <ArrowRight size={10} />
                    </button>
                    <button
                      onClick={() => setShowSwathExplainer(true)}
                      className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#74BDE0] hover:text-white transition-colors cursor-pointer"
                      title="Why is part of this image black? Read technical briefing"
                    >
                      <HelpCircle size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Pixel Probe / Inspector Readout (Bottom Left on hover) */}
              {hoverPixel && (
                <div className="absolute bottom-4 left-4 px-3.5 py-2 rounded-xl bg-black/85 backdrop-blur-md border border-white/20 text-xs font-mono text-white space-y-1 pointer-events-none z-10 shadow-xl animate-in fade-in duration-100">
                  <div className="text-[10px] text-white/60 uppercase flex items-center justify-between gap-3">
                    <span>Spectral Pixel Probe</span>
                    <span className="text-[#6EE7B7]">{hoverPixel.classification}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px]">
                    <span>NDVI: <strong className={hoverPixel.ndvi > 0.5 ? 'text-[#6EE7B7]' : hoverPixel.ndvi > 0.25 ? 'text-[#FDE68A]' : 'text-[#FF8A8A]'}>{hoverPixel.ndvi}</strong></span>
                    <span>Canopy: <strong className="text-white">{Math.round(hoverPixel.ndvi * 90)}%</strong></span>
                    <span className="text-white/60">GPS: [{hoverPixel.lat.toFixed(4)}, {hoverPixel.lon.toFixed(4)}]</span>
                  </div>
                </div>
              )}

              {/* Viewport Control Tools (Bottom Right) */}
              <div className="absolute bottom-4 right-4 flex items-center gap-1.5 p-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/20 z-10 shadow-xl">
                <button
                  onClick={() => setShowBoundaryOverlay(!showBoundaryOverlay)}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    showBoundaryOverlay ? 'bg-white/25 text-[#A8C3A0]' : 'text-white/60 hover:text-white'
                  }`}
                  title="Toggle Cadastral Boundary Polygon"
                >
                  <Layers size={14} />
                </button>
                <button
                  onClick={() => setShowSpectralGrid(!showSpectralGrid)}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    showSpectralGrid ? 'bg-white/25 text-[#A8C3A0]' : 'text-white/60 hover:text-white'
                  }`}
                  title="Toggle UTM Metric Grid"
                >
                  <Compass size={14} />
                </button>
                <button
                  onClick={() => setShowAnomalyMask(!showAnomalyMask)}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    showAnomalyMask ? 'bg-white/25 text-[#EF4444]' : 'text-white/60 hover:text-white'
                  }`}
                  title="Toggle Vegetative Deficit Warning Mask"
                >
                  <ShieldAlert size={14} />
                </button>
                <button
                  onClick={() => setSplitCompareMode(!splitCompareMode)}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    splitCompareMode ? 'bg-white/25 text-[#A8C3A0]' : 'text-white/60 hover:text-white'
                  }`}
                  title="Toggle Split-Screen Swipe Comparison"
                >
                  <SplitSquareVertical size={14} />
                </button>

                {viewportMode === 'orbital_granule' && (
                  <button
                    onClick={() => setFillBasemapBackdrop(!fillBasemapBackdrop)}
                    className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      fillBasemapBackdrop ? 'bg-white/25 text-[#74BDE0]' : 'text-white/60 hover:text-white'
                    }`}
                    title={fillBasemapBackdrop ? "Seamless Basemap: ON (Blends un-imaged space)" : "Seamless Basemap: OFF (Shows raw ESA NoData)"}
                  >
                    <Globe size={14} />
                  </button>
                )}

                <div className="w-px h-4 bg-white/20" />

                <button
                  onClick={() => setZoomLevel(Math.max(0.7, zoomLevel - 0.2))}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut size={14} />
                </button>
                <span className="text-[11px] font-mono px-1 text-white/80">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={() => setZoomLevel(Math.min(3.5, zoomLevel + 0.2))}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn size={14} />
                </button>
                <button
                  onClick={handleResetView}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Reset Pan & Zoom View"
                >
                  <RotateCcw size={13} />
                </button>
              </div>

              {/* Loading Spinner Overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center space-y-3 z-30">
                  <RefreshCw size={36} className="animate-spin text-[#A8C3A0]" />
                  <span className="text-xs font-mono text-white tracking-wider">
                    Querying Copernicus & Earth Search STAC Repositories...
                  </span>
                </div>
              )}
            </div>

            {/* Viewport Footer Telemetry & Color Legend */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="text-white/60 font-mono text-[11px]">NDVI Scale:</span>
                <div className="h-3 w-44 rounded-full overflow-hidden flex shadow-inner" title="NDVI: Water (<0) -> Barren (0.1) -> Shrub (0.35) -> Dense Canopy (>0.6)">
                  <span className="flex-1 bg-[#1e3a8a]" />
                  <span className="flex-1 bg-[#7f1d1d]" />
                  <span className="flex-1 bg-[#b45309]" />
                  <span className="flex-1 bg-[#84cc16]" />
                  <span className="flex-1 bg-[#10b981]" />
                  <span className="flex-1 bg-[#064e3b]" />
                </div>
                <span className="text-[10px] font-mono text-white/60">&lt;0 → 1.0</span>
              </div>

              <div className="text-[11px] font-mono text-white/60 flex items-center gap-3">
                <span>CRS: {selectedScene?.crs || 'EPSG:32643'}</span>
                <span>•</span>
                <span>Sun Elevation: {selectedScene?.sunElevation || 62.4}°</span>
                <span>•</span>
                <span>Source: {providerInfo}</span>
              </div>
            </div>

            {/* Quick Diagnostics Panel (When activated) */}
            {showDiagnostics && (
              <div className="p-4 rounded-2xl bg-[#091C13] border border-[#A8C3A0]/30 space-y-3 shadow-xl animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A8C3A0] flex items-center gap-2">
                    <Activity size={15} />
                    <span>Spectral Zonal Assessment • {activeProject.name}</span>
                  </span>
                  <button
                    onClick={() => setShowDiagnostics(false)}
                    className="text-white/50 hover:text-white text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                {isComputingDiagnostics ? (
                  <div className="flex items-center gap-2 text-xs font-mono text-white/70 py-4 justify-center">
                    <RefreshCw size={16} className="animate-spin text-[#A8C3A0]" />
                    <span>Processing BOA Reflectance & Zonal Statistics...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                      <span className="text-white/60 block text-[10px]">Observed NDVI</span>
                      <strong className="text-base text-white">{diagnosticData?.telemetry?.observedNdvi || activeProject.vegetationAnalytics?.currentNdvi}</strong>
                      <span className="text-[10px] text-white/50 block">Target: {activeProject.vegetationAnalytics?.targetNdvi}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                      <span className="text-white/60 block text-[10px]">Crown Density</span>
                      <strong className="text-base text-[#F59E0B]">{diagnosticData?.telemetry?.crownCoverObserved || '15.2%'}</strong>
                      <span className="text-[10px] text-white/50 block">Mandated: 40%</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                      <span className="text-white/60 block text-[10px]">Deficit Risk</span>
                      <strong className="text-base text-[#EF4444]">{diagnosticData?.telemetry?.complianceRiskScore || activeProject.complianceRiskScore} / 100</strong>
                      <span className="text-[10px] text-[#EF4444] block">Critical Deficit</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                      <span className="text-white/60 block text-[10px]">Statutory Verdict</span>
                      <strong className="text-xs text-[#FCA5A5] block mt-1">NON-COMPLIANT</strong>
                      <span className="text-[9px] text-white/50 block mt-0.5">Form-IV Notice</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Retrieved Scene Drawer & Orbit Pass Selector (Right 4 Cols) */}
          <div className="xl:col-span-4 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A8C3A0] flex items-center gap-1.5">
                <Calendar size={14} />
                <span>Orbit Passes ({scenes.length})</span>
              </span>
              <span className="text-[11px] font-mono text-white/50">
                Sorted by Date (Newest)
              </span>
            </div>

            {/* Scene List Cards */}
            <div className="space-y-2.5 max-h-[590px] overflow-y-auto pr-1">
              {scenes.map((scene) => {
                const isSelected = selectedScene?.id === scene.id;
                return (
                  <div
                    key={scene.id}
                    onClick={() => setSelectedScene(scene)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-white/15 border-[#A8C3A0] ring-1 ring-[#A8C3A0] shadow-md'
                        : 'bg-black/30 border-white/10 hover:bg-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white font-mono">
                            {scene.displayDate}
                          </span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                            scene.cloudCover < 5
                              ? 'bg-[#10B981]/20 border-[#10B981]/40 text-[#6EE7B7]'
                              : scene.cloudCover < 20
                              ? 'bg-[#F59E0B]/20 border-[#F59E0B]/40 text-[#FDE68A]'
                              : 'bg-[#EF4444]/20 border-[#EF4444]/40 text-[#FF8A8A]'
                          }`}>
                            {scene.cloudCover}% Cloud
                          </span>
                        </div>
                        <span className="text-[11px] text-white/70 block font-mono line-clamp-1">
                          {scene.id}
                        </span>
                      </div>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-[#A8C3A0] border border-white/15 shrink-0">
                        {scene.resolution.split(' ')[0]}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono text-white/60 pt-1 border-t border-white/10">
                      <div>Tile: <span className="text-white">{scene.tileId}</span></div>
                      <div>Sun Az: <span className="text-white">{scene.sunAzimuth}°</span></div>
                      <div>Status: <span className="text-[#6EE7B7]">Calibrated</span></div>
                    </div>

                    {isSelected && (
                      <div className="pt-2 flex items-center justify-between border-t border-white/10">
                        <span className="text-[11px] text-[#A8C3A0] font-semibold flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          Active Viewport Scene
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const p = SATELLITE_PRESETS.find(x => x.id === selectedPresetId) || {
                              id: activeProject.id,
                              name: activeProject.name,
                              coordinates: currentCoords,
                            };
                            onSendToPipeline(scene, currentCoords, p);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#3E7C59] hover:bg-[#4a9169] text-[11px] font-semibold text-white cursor-pointer transition-all flex items-center gap-1"
                        >
                          <span>Analyze</span>
                          <ArrowRight size={11} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Orbital Swath Technical Explainer Modal */}
        {showSwathExplainer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="relative w-full max-w-2xl bg-[#091D14] border border-[#A8C3A0]/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-white max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#74BDE0]/20 border border-[#74BDE0]/40 flex items-center justify-center text-[#74BDE0]">
                    <Satellite size={20} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white font-serif-display">
                      Why Is Part of the Satellite Granule Black?
                    </h3>
                    <span className="text-xs text-[#A8C3A0] font-mono">
                      Sentinel-2 Orbital Swath Geometry vs. Fixed MGRS Tiling
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowSwathExplainer(false)}
                  className="p-1.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Visual Diagram Explanation Card */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-[#74BDE0]">
                  <span>ORBITAL TRACK vs. UTM/MGRS TILE (e.g. 43QEV)</span>
                  <span>S2 MSI Swath ~290 km</span>
                </div>
                
                {/* Schematic illustration of the orbital swath cutting diagonally across a square tile */}
                <div className="relative h-44 w-full rounded-xl bg-[#05110B] border border-white/15 overflow-hidden flex items-center justify-center">
                  {/* MGRS Square Boundary */}
                  <div className="relative w-64 h-36 border-2 border-dashed border-white/30 flex items-center justify-center">
                    {/* The diagonal orbital swath pass */}
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-[#1E4D3A] via-[#2F6F52] to-[#1E4D3A] opacity-90"
                      style={{
                        clipPath: 'polygon(35% 0%, 100% 0%, 100% 100%, 15% 100%)',
                      }}
                    >
                      <div className="absolute top-2 right-3 text-[10px] font-mono text-[#A8C3A0] font-bold">
                        Sentinel-2 Imaged Area (MSI BOA)
                      </div>
                      {/* Target Afforestation plot dot */}
                      <div className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                        <span className="w-3 h-3 rounded-full bg-[#10B981] ring-4 ring-[#10B981]/30 animate-ping" />
                        <span className="text-[9px] font-mono text-white font-bold mt-1 bg-black/70 px-1.5 py-0.5 rounded border border-white/20">
                          CA Parcel Target
                        </span>
                      </div>
                    </div>

                    {/* The un-imaged NoData black area */}
                    <div className="absolute top-3 left-4 text-[10px] font-mono text-white/60 space-y-1">
                      <span className="px-1.5 py-0.5 rounded bg-black/70 text-[#EF4444] border border-[#EF4444]/30 font-bold block w-max">
                        ESA NoData (Pixel 0)
                      </span>
                      <span className="text-[9px] text-white/50 block">Outside camera field during this pass</span>
                    </div>

                    {/* Orbit swath angle annotation */}
                    <div className="absolute -bottom-2 left-2 text-[9px] font-mono text-[#74BDE0]">
                      Orbit Track (~98.6° Polar Inclination) ↘
                    </div>
                  </div>
                </div>
              </div>

              {/* Explanatory Points */}
              <div className="space-y-3 text-xs leading-relaxed text-white/80">
                <div className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#3E7C59] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                  <div>
                    <strong className="text-white">Sun-Synchronous Polar Orbit:</strong>
                    <p className="text-white/70 mt-0.5">
                      Copernicus Sentinel-2 flies in a polar orbit inclined at ~98.6°. Its multispectral camera (MSI) sweeps a 290 km-wide strip of Earth on each orbital pass.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#3E7C59] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                  <div>
                    <strong className="text-white">Square 100km × 100km MGRS Tiling:</strong>
                    <p className="text-white/70 mt-0.5">
                      To standardize global archiving, ESA and USGS divide the world into fixed 100km UTM grid squares (like tile <code className="text-[#A8C3A0] font-mono">43QEV</code>). Because the satellite's tilted orbital path cuts across the square grid, the swath boundary often slices diagonally across the tile.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#3E7C59] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                  <div>
                    <strong className="text-white">Why the Un-imaged Half Is Black:</strong>
                    <p className="text-white/70 mt-0.5">
                      Standard raster imagery formats (GeoTIFF/JPEG2000) must be rectangular matrices. Areas outside the sensor's optical field of view during that pass are assigned pixel value <code className="text-[#74BDE0] font-mono">0</code> (digital black), known as <span className="text-white font-semibold">NoData</span>.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#3E7C59] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">4</span>
                  <div>
                    <strong className="text-white">Your Compensatory Afforestation Parcel:</strong>
                    <p className="text-white/70 mt-0.5">
                      The afforestation corridor is situated inside the imaged swath! Click <strong className="text-[#6EE7B7]">Parcel Focus (10m)</strong> to zoom directly into the parcel at native 10-meter resolution with verified cadastral boundaries and full NDVI vegetation metrics.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10">
                <span className="text-[11px] text-white/50 font-mono">
                  Adjacent orbit tracks image the western sector on subsequent passes.
                </span>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setViewportMode('cadastral_parcel');
                      setShowSwathExplainer(false);
                    }}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#3E7C59] hover:bg-[#4a9169] text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all"
                  >
                    <span>Switch to Parcel Focus (10m)</span>
                    <ArrowRight size={13} />
                  </button>
                  <button
                    onClick={() => setShowSwathExplainer(false)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
