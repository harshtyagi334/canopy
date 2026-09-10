import React, { useState, useRef } from 'react';
import { Project, TimelineMilestone, Language } from '../types';
import { translations } from '../translations';
import {
  Satellite,
  Layers,
  Calendar,
  Cloud,
  Eye,
  EyeOff,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Compass,
  MapPin,
  Sparkles,
  Sliders,
  ChevronRight,
  ShieldAlert,
  Info,
  Download,
  Share2,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type SatelliteBandMode = 'true_color' | 'false_color' | 'ndvi' | 'sar_radar';

interface SatelliteViewerProps {
  project: Project;
  lang?: Language;
  onOpenFullscreen?: () => void;
  compact?: boolean;
  initialBand?: SatelliteBandMode;
  showTimelineSelector?: boolean;
}

export const SatelliteViewer: React.FC<SatelliteViewerProps> = ({
  project,
  lang = 'en',
  onOpenFullscreen,
  compact = false,
  initialBand = 'false_color',
  showTimelineSelector = true,
}) => {
  const [bandMode, setBandMode] = useState<SatelliteBandMode>(initialBand);
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState<number>(
    project.timeline.length > 0 ? project.timeline.length - 1 : 0
  );
  const [showBoundaries, setShowBoundaries] = useState<boolean>(true);
  const [showAnomalyMask, setShowAnomalyMask] = useState<boolean>(true);
  const [splitMode, setSplitMode] = useState<boolean>(false);
  const [splitPosition, setSplitPosition] = useState<number>(50); // percentage 0-100
  const [zoom, setZoom] = useState<number>(1);
  const [hoverPixel, setHoverPixel] = useState<{ x: number; y: number; ndvi: number } | null>(null);

  const [isPointerDragging, setIsPointerDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentMilestone = project.timeline[selectedMilestoneIndex] || project.timeline[0];
  const baselineMilestone = project.timeline[0] || currentMilestone;

  // Handle split slider drag & pointer moves
  const updateSplitFromClientX = (clientX: number) => {
    if (!containerRef.current || !splitMode) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pos = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSplitPosition(pos);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (splitMode) {
      setIsPointerDragging(true);
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      updateSplitFromClientX(e.clientX);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;

    if (isPointerDragging && splitMode) {
      updateSplitFromClientX(e.clientX);
    }

    // Simulated pixel NDVI based on location and project data
    const normX = Math.max(0, Math.min(1, x / width));
    const normY = Math.max(0, Math.min(1, y / height));
    const baseVal = currentMilestone.ndviValue;
    const isInsidePlot = normX > 0.35 && normX < 0.8 && normY > 0.2 && normY < 0.75;
    const localNdvi = isInsidePlot
      ? Math.max(0.1, Math.min(0.95, baseVal + Math.sin(normX * 10) * 0.08 + Math.cos(normY * 10) * 0.06))
      : Math.max(0.08, baseVal * 0.7 + Math.sin(normX * 12) * 0.05);

    setHoverPixel({ x: Math.round(normX * 100), y: Math.round(normY * 100), ndvi: Number(localNdvi.toFixed(2)) });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isPointerDragging) {
      setIsPointerDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {
        // Safe fallback
      }
    }
  };

  // Helper to render SVG satellite layer content
  const renderSatelliteSvg = (milestone: TimelineMilestone, mode: SatelliteBandMode, idPrefix: string) => {
    const ndvi = milestone.ndviValue;
    const isHighRecovery = ndvi > 0.5;

    // Color definitions based on sensor band mode
    let bgColor1 = '#1c3629';
    let bgColor2 = '#0c1d15';
    let vegColor = '#43895a';
    let vegOpacity = 0.8;
    let waterColor = '#247BA0';
    let soilColor = '#8c6d48';

    if (mode === 'false_color') {
      // NIR (Bands 8-4-3): Vegetation reflects NIR strongly, glowing crimson/ruby red
      bgColor1 = '#5c2230';
      bgColor2 = '#1a0d14';
      vegColor = '#d63447';
      vegOpacity = 0.88;
      waterColor = '#102A43';
      soilColor = '#7a7672';
    } else if (mode === 'ndvi') {
      // NDVI Heatmap: Low NDVI = Brown/Yellow/Red, High = Vibrant Emerald
      bgColor1 = isHighRecovery ? '#124e2c' : '#4d3a1a';
      bgColor2 = '#08170e';
      vegColor = isHighRecovery ? '#10B981' : '#F59E0B';
      vegOpacity = 0.92;
      waterColor = '#3B82F6';
      soilColor = '#8B4513';
    } else if (mode === 'sar_radar') {
      // SAR C-band radar backscatter (grayscale + moisture dielectric gradient)
      bgColor1 = '#333b3d';
      bgColor2 = '#181b1c';
      vegColor = '#a0afb7';
      vegOpacity = 0.75;
      waterColor = '#0b0c0d';
      soilColor = '#576064';
    } else {
      // Natural RGB True Color
      bgColor1 = '#304a37';
      bgColor2 = '#14251b';
      vegColor = '#3c6e47';
      vegOpacity = 0.75;
      waterColor = '#247BA0';
      soilColor = '#a88960';
    }

    return (
      <svg
        className="w-full h-full object-cover transition-transform duration-300"
        style={{ transform: `scale(${zoom})` }}
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id={`${idPrefix}-sat-grad`} cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor={bgColor1} />
            <stop offset="100%" stopColor={bgColor2} />
          </radialGradient>

          {/* Geological / soil noise texture */}
          <pattern id={`${idPrefix}-soil-noise`} width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill="transparent" />
            <circle cx="3" cy="4" r="1.2" fill="#ffffff" fillOpacity="0.04" />
            <circle cx="14" cy="12" r="1.5" fill="#ffffff" fillOpacity="0.03" />
            <circle cx="8" cy="17" r="1" fill="#000000" fillOpacity="0.1" />
          </pattern>

          {/* Radar Speckle Pattern for SAR mode */}
          <pattern id={`${idPrefix}-sar-speckle`} width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="2" height="2" fill="#ffffff" fillOpacity="0.12" />
            <rect x="4" y="4" width="2" height="2" fill="#ffffff" fillOpacity="0.08" />
          </pattern>

          {/* Red Anomaly Hatch */}
          <pattern id={`${idPrefix}-anomaly-hatch`} width="16" height="16" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="16" stroke="#FF4D4D" strokeWidth="2.5" strokeOpacity="0.85" />
          </pattern>
        </defs>

        {/* 1. Base Terrain Background */}
        <rect width="1000" height="600" fill={`url(#${idPrefix}-sat-grad)`} />
        <rect width="1000" height="600" fill={`url(#${idPrefix}-soil-noise)`} />
        {mode === 'sar_radar' && <rect width="1000" height="600" fill={`url(#${idPrefix}-sar-speckle)`} />}

        {/* 2. Topographical elevation contour lines */}
        <path d="M 0 160 Q 300 120 600 240 T 1000 180" fill="none" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="1.2" />
        <path d="M 0 320 Q 350 420 700 300 T 1000 400" fill="none" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="1.2" />
        <path d="M 0 480 Q 250 420 520 540 T 1000 490" fill="none" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1" />

        {/* 3. Hydrology: Natural River / Water Reservoir */}
        <path
          d="M 60 120 Q 320 220 540 110 T 960 380"
          fill="none"
          stroke={waterColor}
          strokeWidth="24"
          strokeLinecap="round"
          strokeOpacity={mode === 'sar_radar' ? '0.95' : '0.85'}
        />
        <path
          d="M 720 180 Q 800 290 880 500"
          fill="none"
          stroke={waterColor}
          strokeWidth="12"
          strokeLinecap="round"
          strokeOpacity="0.75"
        />

        {/* 4. Natural Scrub / Surrounding Vegetative Canopy */}
        <g fill={vegColor} fillOpacity={vegOpacity * 0.6}>
          <ellipse cx="140" cy="220" rx="90" ry="60" />
          <ellipse cx="260" cy="180" rx="70" ry="50" />
          <ellipse cx="880" cy="140" rx="100" ry="70" />
          <ellipse cx="820" cy="460" rx="120" ry="80" />
          <ellipse cx="180" cy="460" rx="100" ry="70" />
        </g>

        {/* 5. Diverted Impact / Mining / Infrastructure Cut Zone */}
        <polygon
          points="120,380 340,320 400,500 180,540"
          fill={mode === 'false_color' ? 'rgba(120, 110, 105, 0.4)' : 'rgba(140, 95, 70, 0.35)'}
          stroke="#D4A373"
          strokeWidth="2.5"
          strokeDasharray="6 4"
        />

        {/* 6. Active Compensatory Afforestation Plot Area (Core Focus) */}
        {/* Vegetative Growth Inside the Mandated Plot */}
        <g fill={vegColor} fillOpacity={vegOpacity}>
          {/* Main cluster scaled by NDVI */}
          <ellipse cx="580" cy="240" rx={150 * (ndvi / 0.55)} ry={105 * (ndvi / 0.55)} />
          <ellipse cx="700" cy="220" rx={110 * (ndvi / 0.55)} ry={80 * (ndvi / 0.55)} />
          <ellipse cx="490" cy="290" rx={90 * (ndvi / 0.55)} ry={65 * (ndvi / 0.55)} />
          <ellipse cx="640" cy="360" rx={100 * (ndvi / 0.55)} ry={75 * (ndvi / 0.55)} />

          {/* High survival patches if NDVI >= 0.5 */}
          {ndvi >= 0.45 && (
            <>
              <circle cx="530" cy="210" r="45" fill={mode === 'ndvi' ? '#34D399' : vegColor} />
              <circle cx="620" cy="270" r="50" fill={mode === 'ndvi' ? '#34D399' : vegColor} />
              <circle cx="730" cy="260" r="40" fill={mode === 'ndvi' ? '#34D399' : vegColor} />
            </>
          )}
        </g>

        {/* 7. Red Anomaly Mask (If flagged and enabled) */}
        {showAnomalyMask && (project.status === 'field_verification_priority' || project.status === 'evidence_discrepancy') && (
          <polygon
            points="460,160 740,140 780,300 450,280"
            fill={`url(#${idPrefix}-anomaly-hatch)`}
            stroke="#FF4D4D"
            strokeWidth="2.5"
          />
        )}

        {/* 8. Cadastral Boundary Overlays */}
        {showBoundaries && (
          <>
            {/* Diverted Zone Boundary */}
            <polygon
              points="120,380 340,320 400,500 180,540"
              fill="none"
              stroke="#FDBA74"
              strokeWidth="2"
            />
            <text x="190" y="440" fill="#FDBA74" fontSize="13" fontWeight="bold" fontFamily="monospace">
              Diverted Corridor ({project.mapData.impactAreaHa} ha)
            </text>

            {/* Mandated CA Boundary Polygon */}
            <polygon
              points="420,120 800,95 860,380 630,460 390,330"
              fill="rgba(16, 185, 129, 0.08)"
              stroke="#A8C3A0"
              strokeWidth="3.5"
            />
            <polygon
              points="420,120 800,95 860,380 630,460 390,330"
              fill="none"
              stroke="#6EE7B7"
              strokeWidth="1.5"
              strokeDasharray="8 4"
            />

            {/* Boundary Pillars (BP-01, BP-02...) */}
            {[
              { x: 420, y: 120, id: 'BP-01' },
              { x: 800, y: 95, id: 'BP-02' },
              { x: 860, y: 380, id: 'BP-03' },
              { x: 630, y: 460, id: 'BP-04' },
              { x: 390, y: 330, id: 'BP-05' },
            ].map((p) => (
              <g key={p.id}>
                <circle cx={p.x} cy={p.y} r="6" fill="#FFFFFF" stroke="#12372A" strokeWidth="2.5" />
                <circle cx={p.x} cy={p.y} r="2" fill="#3E7C59" />
                <text x={p.x + 8} y={p.y - 8} fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  {p.id}
                </text>
              </g>
            ))}

            {/* Plot Centroid Tag */}
            <rect x="520" y="280" width="220" height="42" rx="8" fill="#0c1d15" fillOpacity="0.88" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <text x="532" y="298" fill="#FFFFFF" fontSize="12" fontWeight="bold">
              {project.mapData.caPlotName}
            </text>
            <text x="532" y="313" fill="#A8C3A0" fontSize="10.5" fontFamily="monospace">
              Area: {project.mapData.caPlotHa} ha • Cadastral Survey
            </text>
          </>
        )}
      </svg>
    );
  };

  return (
    <div className={`space-y-4 ${compact ? '' : 'w-full'}`}>
      {/* Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/30 p-3 sm:p-4 rounded-2xl border border-white/15">
        {/* Left: Sensor Band Switcher */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-white/70 mr-1 flex items-center gap-1.5">
            <Satellite size={14} className="text-[#A8C3A0]" />
            <span className="hidden sm:inline">Spectral Band:</span>
          </span>

          <button
            onClick={() => setBandMode('true_color')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              bandMode === 'true_color'
                ? 'bg-[#3E7C59] text-white shadow-xs border border-[#A8C3A0]/40'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-transparent'
            }`}
          >
            <span>Natural RGB</span>
          </button>

          <button
            onClick={() => setBandMode('false_color')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              bandMode === 'false_color'
                ? 'bg-[#E5484D]/30 text-[#FFA8A8] shadow-xs border border-[#FF8A8A]/50'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-transparent'
            }`}
          >
            <span>NIR False-Color</span>
          </button>

          <button
            onClick={() => setBandMode('ndvi')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              bandMode === 'ndvi'
                ? 'bg-[#10B981]/30 text-[#6EE7B7] shadow-xs border border-[#10B981]/50'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-transparent'
            }`}
          >
            <span>NDVI Biomass</span>
          </button>

          <button
            onClick={() => setBandMode('sar_radar')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              bandMode === 'sar_radar'
                ? 'bg-[#247BA0]/40 text-[#74BDE0] shadow-xs border border-[#74BDE0]/50'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-transparent'
            }`}
          >
            <span>SAR Radar</span>
          </button>
        </div>

        {/* Right: Layer Toggles & View Tools */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Split Mode Toggle */}
          <button
            onClick={() => setSplitMode(!splitMode)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 cursor-pointer ${
              splitMode
                ? 'bg-[#E0B494]/30 text-[#E0B494] border-[#E0B494]/50'
                : 'bg-white/5 text-white/70 hover:bg-white/10 border-white/15'
            }`}
            title="Compare Baseline vs Current observation side-by-side"
          >
            <Sliders size={13} />
            <span className="hidden md:inline">Split Compare</span>
          </button>

          {/* Cadastral Boundary Toggle */}
          <button
            onClick={() => setShowBoundaries(!showBoundaries)}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 cursor-pointer ${
              showBoundaries
                ? 'bg-[#3E7C59]/30 text-[#A8C3A0] border-[#A8C3A0]/40'
                : 'bg-white/5 text-white/60 hover:bg-white/10 border-white/15'
            }`}
            title="Toggle Mandated Cadastral Boundaries"
          >
            <Layers size={13} />
            <span className="hidden lg:inline">Cadastral</span>
          </button>

          {/* Anomaly Mask Toggle */}
          <button
            onClick={() => setShowAnomalyMask(!showAnomalyMask)}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 cursor-pointer ${
              showAnomalyMask
                ? 'bg-[#FF4D4D]/20 text-[#FFA8A8] border-[#FF4D4D]/40'
                : 'bg-white/5 text-white/60 hover:bg-white/10 border-white/15'
            }`}
            title="Toggle Anomaly Deficit Mask"
          >
            {showAnomalyMask ? <Eye size={13} /> : <EyeOff size={13} />}
            <span className="hidden lg:inline">Deficit Mask</span>
          </button>

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center border border-white/15 rounded-xl bg-black/20 overflow-hidden">
            <button
              onClick={() => setZoom(Math.min(zoom + 0.2, 1.8))}
              className="p-1.5 hover:bg-white/10 text-white cursor-pointer"
              aria-label="Zoom in"
            >
              <ZoomIn size={13} />
            </button>
            <span className="text-[10px] font-mono px-1.5 text-white/80 tabular-nums">
              {(zoom * 100).toFixed(0)}%
            </span>
            <button
              onClick={() => setZoom(Math.max(zoom - 0.2, 0.8))}
              className="p-1.5 hover:bg-white/10 text-white cursor-pointer"
              aria-label="Zoom out"
            >
              <ZoomOut size={13} />
            </button>
          </div>

          {/* Fullscreen Modal trigger */}
          {onOpenFullscreen && (
            <button
              onClick={onOpenFullscreen}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
              title="Expand Satellite Fullscreen Observatory"
              aria-label="Fullscreen view"
            >
              <Maximize2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Main Satellite Viewport Stage */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={`relative w-full h-[320px] sm:h-[420px] md:h-[480px] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 bg-[#0a1e16] shadow-2xl select-none group ${
          splitMode ? 'touch-none cursor-ew-resize' : ''
        }`}
      >
        {/* If Split Mode is OFF: Standard Single Satellite Layer */}
        {!splitMode ? (
          <div className="w-full h-full">
            {renderSatelliteSvg(currentMilestone, bandMode, `primary-${project.id}`)}
          </div>
        ) : (
          /* Split View Slider Mode: Baseline (Left) vs Current (Right) */
          <div className="relative w-full h-full overflow-hidden">
            {/* Right Layer (Current Acquisition) */}
            <div className="absolute inset-0 w-full h-full">
              {renderSatelliteSvg(currentMilestone, bandMode, `split-right-${project.id}`)}
            </div>

            {/* Left Layer (Baseline Acquisition) Clipped */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${splitPosition}%` }}
            >
              <div className="w-full h-full" style={{ width: containerRef.current?.clientWidth || 800 }}>
                {renderSatelliteSvg(baselineMilestone, 'true_color', `split-left-${project.id}`)}
              </div>
            </div>

            {/* Draggable Divider Handle */}
            <div
              className="absolute inset-y-0 z-20 cursor-ew-resize flex items-center justify-center pointer-events-auto"
              style={{ left: `${splitPosition}%` }}
            >
              <div className="w-1 h-full bg-white shadow-2xl relative">
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#12372A] border-2 border-white shadow-xl flex items-center justify-center text-white">
                  <Sliders size={14} className="rotate-90 text-[#A8C3A0]" />
                </div>
              </div>
            </div>

            {/* Split Labels */}
            <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md text-xs font-mono text-white border border-white/20">
              <span>Baseline: {baselineMilestone.date}</span>
            </div>
            <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md text-xs font-mono text-[#A8C3A0] border border-white/20">
              <span>Observation: {currentMilestone.date}</span>
            </div>
          </div>
        )}

        {/* Floating Top Badges (Sensor Info & Acquisition Scene) */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-2 pointer-events-none">
          <div className="px-3 py-1 rounded-xl bg-black/75 backdrop-blur-md text-xs font-mono text-white flex items-center gap-2 border border-white/15 shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="font-semibold">{currentMilestone.sensor}</span>
            <span className="text-white/50">•</span>
            <span className="text-[#A8C3A0]">{currentMilestone.metadata.resolution}</span>
          </div>

          <div className="hidden sm:flex px-3 py-1 rounded-xl bg-black/75 backdrop-blur-md text-xs font-mono text-white/80 items-center gap-1.5 border border-white/15 shadow-md">
            <Cloud size={13} className="text-[#60A5FA]" />
            <span>{currentMilestone.cloudCover}</span>
          </div>

          <div className="px-2.5 py-1 rounded-xl bg-black/75 backdrop-blur-md text-[11px] font-mono text-white/90 uppercase font-semibold border border-white/15 shadow-md">
            {bandMode === 'true_color' && 'RGB True Color'}
            {bandMode === 'false_color' && 'NIR NIR-Red-Green (B08, B04, B03)'}
            {bandMode === 'ndvi' && 'NDVI Spectral Heatmap'}
            {bandMode === 'sar_radar' && 'C-SAR Dual Polarization (VH/VV)'}
          </div>
        </div>

        {/* Floating Top Right: Compass Orientation */}
        <div className="absolute top-3.5 right-3.5 bg-black/70 backdrop-blur-md rounded-2xl p-2.5 border border-white/20 shadow-lg flex flex-col items-center gap-0.5 select-none pointer-events-none">
          <Compass size={20} className="text-[#A8C3A0]" />
          <span className="text-[10px] font-bold text-white tracking-widest font-mono">N</span>
        </div>

        {/* Floating Bottom Right: Live Pixel Spectral Probe */}
        {hoverPixel && (
          <div className="absolute bottom-4 right-4 bg-black/85 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 shadow-2xl text-xs font-mono text-white space-y-1 select-none pointer-events-none max-w-xs">
            <div className="flex items-center justify-between text-[10px] text-[#A8C3A0] uppercase font-bold border-b border-white/10 pb-1">
              <span>Pixel Telemetry Probe</span>
              <span>10m GSD</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
              <div>
                <span className="text-white/60">Estimated NDVI:</span>{' '}
                <span className="font-bold text-[#6EE7B7]">{hoverPixel.ndvi}</span>
              </div>
              <div>
                <span className="text-white/60">Canopy Cover:</span>{' '}
                <span className="font-semibold text-white">{Math.round(hoverPixel.ndvi * 60)}%</span>
              </div>
              <div>
                <span className="text-white/60">Sun Zenith:</span>{' '}
                <span className="text-white">{currentMilestone.metadata.solarZenith}</span>
              </div>
              <div>
                <span className="text-white/60">Radar VH/VV:</span>{' '}
                <span className="text-[#74BDE0]">-14.2 dB</span>
              </div>
            </div>
            <div className="text-[10px] text-white/50 truncate pt-0.5">
              Scene: {currentMilestone.metadata.sceneId}
            </div>
          </div>
        )}

        {/* Floating Bottom Left: Scale Bar & Coordinates */}
        <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md rounded-xl px-3.5 py-2 border border-white/15 shadow-md flex items-center gap-3 select-none text-xs font-mono text-white pointer-events-none">
          <div className="flex items-center gap-1.5 text-[#A8C3A0]">
            <MapPin size={13} />
            <span>{project.mapData.coordinatesDisplay}</span>
          </div>
          <span className="text-white/30">|</span>
          <div className="flex items-center gap-2">
            <span>0</span>
            <div className="w-16 h-1 bg-[#A8C3A0] relative flex items-center justify-between">
              <span className="w-0.5 h-2.5 bg-white" />
              <span className="w-0.5 h-2.5 bg-white" />
            </div>
            <span>500 m</span>
          </div>
        </div>

        {/* NDVI Color Scale Legend (Visible in NDVI Mode) */}
        {bandMode === 'ndvi' && (
          <div className="absolute top-16 left-3.5 bg-black/85 backdrop-blur-md rounded-xl p-3 border border-white/15 shadow-xl text-xs space-y-1.5 pointer-events-none">
            <span className="text-[10px] font-mono uppercase text-white/70 font-semibold block">
              NDVI Biomass Index (0.0 → 1.0)
            </span>
            <div className="w-36 h-2.5 rounded-full bg-gradient-to-r from-[#8B4513] via-[#F59E0B] to-[#10B981] border border-white/20" />
            <div className="flex justify-between text-[9px] font-mono text-white/60">
              <span>0.0 Barren</span>
              <span>0.4 Scrub</span>
              <span>0.8+ Forest</span>
            </div>
          </div>
        )}
      </div>

      {/* Historical Orbital Milestone Timeline Scrubber */}
      {showTimelineSelector && project.timeline.length > 1 && (
        <div className="bg-black/30 p-4 rounded-2xl border border-white/15 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[#A8C3A0]" />
              <span className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                Copernicus Multi-Year Satellite Pass Catalog
              </span>
            </div>
            <span className="text-xs text-white/60 font-mono">
              Select date to inspect orbital acquisition:
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5">
            {project.timeline.map((m, idx) => {
              const isSelected = selectedMilestoneIndex === idx;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMilestoneIndex(idx)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1 ${
                    isSelected
                      ? 'bg-[#3E7C59]/40 border-[#A8C3A0] shadow-md ring-1 ring-[#A8C3A0]/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/80'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold text-white">{m.date}</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md ${
                        m.ndviValue >= project.promise.targetNdvi
                          ? 'bg-[#10B981]/20 text-[#6EE7B7]'
                          : 'bg-[#E5484D]/20 text-[#FF8A8A]'
                      }`}
                    >
                      NDVI {m.ndviValue.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-[10px] text-white/70 line-clamp-1">
                    {m.milestoneLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
