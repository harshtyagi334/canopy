import React, { useState, useRef, useEffect } from 'react';
import { Project, TimelineMilestone, Language } from '../types';
import { translations } from '../translations';
import {
  Layers,
  Compass,
  ZoomIn,
  ZoomOut,
  Maximize2,
  MapPin,
  Eye,
  EyeOff,
  Sliders,
  Play,
  Pause,
  ArrowLeftRight,
  Sparkles,
  Satellite,
  Calendar,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Info,
  RotateCcw
} from 'lucide-react';
import { motion } from 'motion/react';

export type ComparisonBandMode = 'false_color' | 'true_color' | 'ndvi' | 'sar_radar';
export type GisViewMode = 'slider_compare' | 'side_by_side' | 'cadastral_gis';
export type SliderTransitionType = 'split_curtain' | 'opacity_crossfade';

interface ComplianceMapProps {
  project: Project;
  lang: Language;
}

export const ComplianceMap: React.FC<ComplianceMapProps> = ({ project, lang }) => {
  const t = translations[lang];

  // View & Mode State
  const [gisMode, setGisMode] = useState<GisViewMode>('slider_compare');
  const [sliderType, setSliderType] = useState<SliderTransitionType>('split_curtain');
  const [bandMode, setBandMode] = useState<ComparisonBandMode>('false_color');
  
  // Historical Milestones Selected for Comparison
  const milestones = project.timeline && project.timeline.length > 0
    ? project.timeline
    : [
        {
          id: 'm-baseline',
          date: '2021-02-15',
          milestoneLabel: 'Baseline Pre-Afforestation',
          imageThumbnail: '',
          satelliteLayer: 'true_color' as const,
          sensor: 'Sentinel-2A MSI',
          cloudCover: '1.2%',
          observation: 'Barren degraded land prior to afforestation activities.',
          status: 'insufficient_evidence' as const,
          ndviValue: project.proof.baselineNdvi || 0.22,
          ndviDelta: '+0.00',
          canopyDensity: '12%',
          metadata: {
            resolution: '10m Multi-spectral',
            solarZenith: '38.4°',
            bandsUsed: 'B04, B03, B02',
            acquisitionDate: '2021-02-15',
            sceneId: 'S2A_MSIL2A_20210215T052821_N0214_R105_T43QFC'
          }
        },
        {
          id: 'm-current',
          date: '2024-03-20',
          milestoneLabel: 'Current Verification Pass',
          imageThumbnail: '',
          satelliteLayer: 'false_color' as const,
          sensor: 'Sentinel-2B MSI',
          cloudCover: '0.4%',
          observation: 'Follow-up compliance verification pass.',
          status: project.status,
          ndviValue: project.proof.currentNdvi || 0.58,
          ndviDelta: `+${((project.proof.currentNdvi || 0.58) - (project.proof.baselineNdvi || 0.22)).toFixed(2)}`,
          canopyDensity: '46%',
          metadata: {
            resolution: '10m Multi-spectral',
            solarZenith: '32.1°',
            bandsUsed: 'B08, B04, B03',
            acquisitionDate: '2024-03-20',
            sceneId: 'S2B_MSIL2A_20240320T053649_N0510_R105_T43QFC'
          }
        }
      ];

  const [imageAIndex, setImageAIndex] = useState<number>(0);
  const [imageBIndex, setImageBIndex] = useState<number>(milestones.length - 1);

  // Slider controls
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isPlayingAutoSweep, setIsPlayingAutoSweep] = useState<boolean>(false);

  // Layer Toggles
  const [showCadastralBoundaries, setShowCadastralBoundaries] = useState<boolean>(true);
  const [showDemarcationPillars, setShowDemarcationPillars] = useState<boolean>(true);
  const [showAnomalyMask, setShowAnomalyMask] = useState<boolean>(true);
  const [showWaterHydrology, setShowWaterHydrology] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoverPixel, setHoverPixel] = useState<{ x: number; y: number; ndviA: number; ndviB: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const sweepDirectionRef = useRef<number>(1); // 1 = forward, -1 = reverse

  const milestoneA = milestones[imageAIndex] || milestones[0];
  const milestoneB = milestones[imageBIndex] || milestones[milestones.length - 1];

  // Auto-sweep animation loop
  useEffect(() => {
    if (!isPlayingAutoSweep) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const animateSweep = () => {
      setSliderPosition((prev) => {
        let next = prev + sweepDirectionRef.current * 0.4;
        if (next >= 95) {
          next = 95;
          sweepDirectionRef.current = -1;
        } else if (next <= 5) {
          next = 5;
          sweepDirectionRef.current = 1;
        }
        return next;
      });
      animationFrameRef.current = requestAnimationFrame(animateSweep);
    };

    animationFrameRef.current = requestAnimationFrame(animateSweep);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlayingAutoSweep]);

  // Handle Dragging
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updateSliderFromPointer(e.clientX);
    if (isPlayingAutoSweep) setIsPlayingAutoSweep(false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      updateSliderFromPointer(e.clientX);
    }

    // Update pixel inspection coordinates
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
      const normX = x / rect.width;
      const normY = y / rect.height;

      const isInsidePlot = normX > 0.38 && normX < 0.82 && normY > 0.18 && normY < 0.72;
      const ndviA = isInsidePlot
        ? Math.max(0.1, Math.min(0.95, milestoneA.ndviValue + Math.sin(normX * 8) * 0.05 + Math.cos(normY * 8) * 0.04))
        : Math.max(0.08, milestoneA.ndviValue * 0.6 + Math.sin(normX * 10) * 0.04);
      const ndviB = isInsidePlot
        ? Math.max(0.1, Math.min(0.95, milestoneB.ndviValue + Math.sin(normX * 8) * 0.07 + Math.cos(normY * 8) * 0.05))
        : Math.max(0.08, milestoneB.ndviValue * 0.7 + Math.sin(normX * 10) * 0.05);

      setHoverPixel({
        x: Math.round(normX * 100),
        y: Math.round(normY * 100),
        ndviA: Number(ndviA.toFixed(2)),
        ndviB: Number(ndviB.toFixed(2))
      });
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const updateSliderFromPointer = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pos = Math.max(2, Math.min(98, (x / rect.width) * 100));
    setSliderPosition(pos);
  };

  const handleSwapMilestones = () => {
    const temp = imageAIndex;
    setImageAIndex(imageBIndex);
    setImageBIndex(temp);
  };

  // Delta calculations
  const ndviDiff = Number((milestoneB.ndviValue - milestoneA.ndviValue).toFixed(2));
  const isPositiveGrowth = ndviDiff >= 0;
  const growthPercent = milestoneA.ndviValue > 0
    ? Math.round(((milestoneB.ndviValue - milestoneA.ndviValue) / milestoneA.ndviValue) * 100)
    : 0;
  const estimatedHectaresGained = Math.max(
    0,
    Number(((project.mapData?.caPlotHa || 45) * Math.max(0, ndviDiff) * 1.2).toFixed(1))
  );

  // Helper to render high-fidelity multi-spectral vector imagery
  const renderSatelliteSvg = (
    milestone: TimelineMilestone,
    mode: ComparisonBandMode,
    idSuffix: string
  ) => {
    const ndvi = milestone.ndviValue;
    const isAfforested = ndvi > 0.45;

    // Palette per spectral band
    let bgColor1 = '#1c3629';
    let bgColor2 = '#0c1d15';
    let vegColor = '#43895a';
    let vegOpacity = 0.8;
    let waterColor = '#247BA0';
    let soilColor = '#8c6d48';

    if (mode === 'false_color') {
      // NIR (B08-B04-B03): Vigorous Chlorophyll glows crimson / ruby
      bgColor1 = '#521d2a';
      bgColor2 = '#160910';
      vegColor = '#dc2626';
      vegOpacity = 0.9;
      waterColor = '#0f2942';
      soilColor = '#736b63';
    } else if (mode === 'ndvi') {
      // Heatmap: Low = brown/amber, high = emerald
      bgColor1 = isAfforested ? '#0f4627' : '#4d3a1a';
      bgColor2 = '#08170e';
      vegColor = isAfforested ? '#10B981' : '#F59E0B';
      vegOpacity = 0.95;
      waterColor = '#3B82F6';
      soilColor = '#8B4513';
    } else if (mode === 'sar_radar') {
      // SAR C-band microwave backscatter
      bgColor1 = '#374151';
      bgColor2 = '#111827';
      vegColor = '#9CA3AF';
      vegOpacity = 0.8;
      waterColor = '#030712';
      soilColor = '#4B5563';
    } else {
      // Natural True Color (RGB)
      bgColor1 = '#283e30';
      bgColor2 = '#0f1f16';
      vegColor = '#3b724a';
      vegOpacity = 0.78;
      waterColor = '#247BA0';
      soilColor = '#9c7a52';
    }

    return (
      <svg
        className="w-full h-full transition-transform duration-200 select-none pointer-events-none"
        style={{ transform: `scale(${zoomLevel})` }}
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id={`sat-bg-${idSuffix}`} cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor={bgColor1} />
            <stop offset="100%" stopColor={bgColor2} />
          </radialGradient>

          {/* Soil / Grain Texture */}
          <pattern id={`soil-pat-${idSuffix}`} width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1" fill="#FFFFFF" fillOpacity="0.04" />
            <circle cx="12" cy="11" r="1.2" fill="#FFFFFF" fillOpacity="0.03" />
            <circle cx="7" cy="15" r="0.8" fill="#000000" fillOpacity="0.12" />
          </pattern>

          {/* SAR Speckle */}
          <pattern id={`sar-speckle-${idSuffix}`} width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="1.5" height="1.5" fill="#FFFFFF" fillOpacity="0.14" />
            <rect x="3" y="3" width="1.5" height="1.5" fill="#FFFFFF" fillOpacity="0.09" />
          </pattern>

          {/* Deficit Red Hatch */}
          <pattern id={`risk-hatch-${idSuffix}`} width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="12" stroke="#FF6B6B" strokeWidth="2" strokeOpacity="0.85" />
          </pattern>
        </defs>

        {/* 1. Base Terrain Surface */}
        <rect width="1000" height="600" fill={`url(#sat-bg-${idSuffix})`} />
        <rect width="1000" height="600" fill={`url(#soil-pat-${idSuffix})`} />
        {mode === 'sar_radar' && <rect width="1000" height="600" fill={`url(#sar-speckle-${idSuffix})`} />}

        {/* 2. Topographic Contours */}
        <path d="M 0 140 Q 320 100 620 220 T 1000 160" fill="none" stroke="#FFFFFF" strokeOpacity="0.08" strokeWidth="1" />
        <path d="M 0 310 Q 360 410 720 290 T 1000 380" fill="none" stroke="#FFFFFF" strokeOpacity="0.08" strokeWidth="1" />
        <path d="M 0 470 Q 240 400 540 530 T 1000 480" fill="none" stroke="#FFFFFF" strokeOpacity="0.06" strokeWidth="1" />

        {/* 3. Hydrology Streams & Drainage */}
        {showWaterHydrology && (
          <>
            <path
              d="M 50 140 Q 300 220 520 120 T 950 360"
              fill="none"
              stroke={waterColor}
              strokeWidth="22"
              strokeLinecap="round"
              strokeOpacity={mode === 'sar_radar' ? '0.95' : '0.85'}
            />
            <path
              d="M 700 180 Q 770 280 860 490"
              fill="none"
              stroke={waterColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeOpacity="0.75"
            />
          </>
        )}

        {/* 4. Natural Surrounding Forest Matrix */}
        <g fill={vegColor} fillOpacity={vegOpacity * 0.55}>
          <ellipse cx="150" cy="210" rx="85" ry="55" />
          <ellipse cx="270" cy="170" rx="65" ry="45" />
          <ellipse cx="890" cy="130" rx="95" ry="65" />
          <ellipse cx="830" cy="450" rx="115" ry="75" />
          <ellipse cx="190" cy="450" rx="95" ry="65" />
        </g>

        {/* 5. Diverted Infrastructure / Clear-cut Zone */}
        <polygon
          points="130,370 330,320 390,490 170,530"
          fill={mode === 'false_color' ? 'rgba(110, 100, 95, 0.4)' : 'rgba(140, 95, 70, 0.35)'}
          stroke="#D4A373"
          strokeWidth="2.5"
          strokeDasharray="6 4"
        />

        {/* 6. Compensatory Afforestation Plot Vegetative Canopy */}
        <g fill={vegColor} fillOpacity={vegOpacity}>
          {/* Main Afforestation Growth Clustered According to Milestone NDVI */}
          <ellipse
            cx="580"
            cy="240"
            rx={Math.max(20, 155 * (ndvi / 0.55))}
            ry={Math.max(15, 110 * (ndvi / 0.55))}
          />
          <ellipse
            cx="700"
            cy="215"
            rx={Math.max(15, 115 * (ndvi / 0.55))}
            ry={Math.max(12, 85 * (ndvi / 0.55))}
          />
          <ellipse
            cx="480"
            cy="285"
            rx={Math.max(15, 95 * (ndvi / 0.55))}
            ry={Math.max(10, 70 * (ndvi / 0.55))}
          />
          <ellipse
            cx="635"
            cy="355"
            rx={Math.max(15, 105 * (ndvi / 0.55))}
            ry={Math.max(10, 80 * (ndvi / 0.55))}
          />

          {/* High Density Chlorophyll Cores for High NDVI */}
          {ndvi >= 0.48 && (
            <>
              <circle cx="540" cy="210" r="48" fill={mode === 'ndvi' ? '#34D399' : vegColor} />
              <circle cx="630" cy="265" r="54" fill={mode === 'ndvi' ? '#34D399' : vegColor} />
              <circle cx="735" cy="255" r="44" fill={mode === 'ndvi' ? '#34D399' : vegColor} />
            </>
          )}

          {/* Dense Sapling Stems for mature passes */}
          {ndvi >= 0.60 && (
            <>
              <circle cx="500" cy="250" r="35" fill={mode === 'ndvi' ? '#10B981' : '#ef4444'} />
              <circle cx="670" cy="310" r="42" fill={mode === 'ndvi' ? '#10B981' : '#ef4444'} />
            </>
          )}
        </g>

        {/* 7. Anomaly Discrepancy Hatching */}
        {showAnomalyMask && (project.status === 'field_verification_priority' || project.status === 'evidence_discrepancy') && (
          <polygon
            points="460,150 730,135 770,290 440,270"
            fill={`url(#risk-hatch-${idSuffix})`}
            stroke="#FF6B6B"
            strokeWidth="2"
          />
        )}

        {/* 8. Cadastral Boundary Overlays */}
        {showCadastralBoundaries && (
          <>
            {/* Diverted Corridor Boundary */}
            <polygon
              points="130,370 330,320 390,490 170,530"
              fill="none"
              stroke="#FDBA74"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <text x="180" y="430" fill="#FDBA74" fontSize="12" fontWeight="bold" fontFamily="monospace">
              Diverted Area ({project.mapData?.impactAreaHa || 28} ha)
            </text>

            {/* Mandated CA Boundary Polygon */}
            <polygon
              points="420,120 790,95 850,370 630,450 390,325"
              fill="rgba(16, 185, 129, 0.08)"
              stroke="#A8C3A0"
              strokeWidth="3.5"
            />
            <polygon
              points="420,120 790,95 850,370 630,450 390,325"
              fill="none"
              stroke="#6EE7B7"
              strokeWidth="1.5"
              strokeDasharray="8 4"
            />

            {/* Demarcation Boundary Pillars */}
            {showDemarcationPillars &&
              [
                { x: 420, y: 120, id: 'BP-01' },
                { x: 790, y: 95, id: 'BP-02' },
                { x: 850, y: 370, id: 'BP-03' },
                { x: 630, y: 450, id: 'BP-04' },
                { x: 390, y: 325, id: 'BP-05' },
              ].map((p) => (
                <g key={p.id}>
                  <circle cx={p.x} cy={p.y} r="5.5" fill="#FFFFFF" stroke="#12372A" strokeWidth="2.5" />
                  <circle cx={p.x} cy={p.y} r="2" fill="#3E7C59" />
                  <text x={p.x + 8} y={p.y - 7} fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    {p.id}
                  </text>
                </g>
              ))}

            {/* Plot Centroid Tag */}
            <rect x="510" y="275" width="220" height="42" rx="8" fill="#0c1d15" fillOpacity="0.88" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <text x="522" y="293" fill="#FFFFFF" fontSize="12" fontWeight="bold">
              {project.mapData?.caPlotName || 'Compensatory Plot'}
            </text>
            <text x="522" y="308" fill="#A8C3A0" fontSize="10.5" fontFamily="monospace">
              Area: {project.mapData?.caPlotHa || 45} ha • Mandate
            </text>
          </>
        )}
      </svg>
    );
  };

  return (
    <section className="space-y-4 select-none">
      {/* GIS Header & View Mode Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-[#12372A]/80 p-4 sm:p-5 rounded-3xl border border-white/15 backdrop-blur-md shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Satellite size={20} className="text-[#A8C3A0]" />
            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif-display">
              {t.mapTitle}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#3E7C59]/40 text-[#6EE7B7] text-[11px] font-mono font-semibold border border-[#A8C3A0]/40">
              Copernicus 10m Multi-Temporal
            </span>
          </div>
          <p className="text-xs sm:text-sm text-white/70">
            Compare multi-year satellite passes, trace vegetation index trajectories, and verify cadastral boundaries against MoEFCC clearances.
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-white/15 self-start lg:self-auto">
          <button
            onClick={() => setGisMode('slider_compare')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              gisMode === 'slider_compare'
                ? 'bg-[#3E7C59] text-white shadow-md border border-[#A8C3A0]/40'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders size={13} />
            <span>Time Slider Comparison</span>
          </button>

          <button
            onClick={() => setGisMode('side_by_side')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              gisMode === 'side_by_side'
                ? 'bg-[#3E7C59] text-white shadow-md border border-[#A8C3A0]/40'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <ArrowLeftRight size={13} />
            <span>Dual Matrix</span>
          </button>

          <button
            onClick={() => setGisMode('cadastral_gis')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              gisMode === 'cadastral_gis'
                ? 'bg-[#3E7C59] text-white shadow-md border border-[#A8C3A0]/40'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers size={13} />
            <span>Cadastral GIS</span>
          </button>
        </div>
      </div>

      {/* Control Console: Historical Pass Pickers + Spectral Bands + Slider Controls */}
      <div className="bg-black/30 p-4 rounded-2xl border border-white/15 space-y-4">
        {/* Row 1: Dual Historical Date Pickers & Swap Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-3.5">
          <div className="flex flex-wrap items-center gap-3">
            {/* Image A (Past/Baseline) Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase font-bold text-white/60">Image A (Past):</span>
              <select
                id="historical-image-a-select"
                value={imageAIndex}
                onChange={(e) => setImageAIndex(Number(e.target.value))}
                className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/20 text-xs font-mono text-white focus:outline-none focus:border-[#A8C3A0] cursor-pointer"
              >
                {milestones.map((m, idx) => (
                  <option key={`a-${m.id}`} value={idx} className="bg-[#12372A] text-white">
                    {m.date} — {m.milestoneLabel} (NDVI {m.ndviValue.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <button
              id="swap-historical-images-btn"
              onClick={handleSwapMilestones}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer active:scale-95"
              title="Swap historical pass order (Image A ⇄ Image B)"
            >
              <ArrowLeftRight size={14} className="text-[#A8C3A0]" />
            </button>

            {/* Image B (Recent/Verification) Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase font-bold text-[#A8C3A0]">Image B (Observation):</span>
              <select
                id="historical-image-b-select"
                value={imageBIndex}
                onChange={(e) => setImageBIndex(Number(e.target.value))}
                className="px-3 py-1.5 rounded-xl bg-black/60 border border-[#A8C3A0]/50 text-xs font-mono text-[#6EE7B7] font-semibold focus:outline-none focus:border-[#A8C3A0] cursor-pointer"
              >
                {milestones.map((m, idx) => (
                  <option key={`b-${m.id}`} value={idx} className="bg-[#12372A] text-white">
                    {m.date} — {m.milestoneLabel} (NDVI {m.ndviValue.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto">
            <span className="text-[10px] font-mono text-white/50 uppercase mr-1">Presets:</span>
            <button
              onClick={() => {
                setImageAIndex(0);
                setImageBIndex(milestones.length - 1);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[11px] text-white/80 font-mono border border-white/10 transition-colors cursor-pointer"
            >
              Baseline vs Latest
            </button>
            {milestones.length > 2 && (
              <button
                onClick={() => {
                  setImageAIndex(1);
                  setImageBIndex(milestones.length - 1);
                }}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[11px] text-white/80 font-mono border border-white/10 transition-colors cursor-pointer"
              >
                Year 1 vs Current
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Band Presets, Layer Overlays, and Slider Modes */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Spectral Bands */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-white/70 mr-1 flex items-center gap-1">
              <Sparkles size={13} className="text-[#A8C3A0]" />
              <span>Band:</span>
            </span>

            <button
              onClick={() => setBandMode('false_color')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                bandMode === 'false_color'
                  ? 'bg-[#E5484D]/30 text-[#FFA8A8] border border-[#FF8A8A]/50 shadow-xs'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-transparent'
              }`}
              title="NIR False-Color (B8-B4-B3): Dense chlorophyll glows in vibrant ruby red"
            >
              <span>NIR False-Color</span>
            </button>

            <button
              onClick={() => setBandMode('ndvi')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                bandMode === 'ndvi'
                  ? 'bg-[#10B981]/30 text-[#6EE7B7] border border-[#10B981]/50 shadow-xs'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-transparent'
              }`}
              title="NDVI Normalized Difference Vegetation Index Heatmap"
            >
              <span>NDVI Heatmap</span>
            </button>

            <button
              onClick={() => setBandMode('true_color')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                bandMode === 'true_color'
                  ? 'bg-[#3E7C59] text-white border border-[#A8C3A0]/40 shadow-xs'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-transparent'
              }`}
              title="Natural RGB True Color Visual Spectrum"
            >
              <span>Natural RGB</span>
            </button>

            <button
              onClick={() => setBandMode('sar_radar')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                bandMode === 'sar_radar'
                  ? 'bg-[#247BA0]/40 text-[#74BDE0] border border-[#74BDE0]/50 shadow-xs'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-transparent'
              }`}
              title="Sentinel-1 SAR C-Band Synthetic Aperture Radar"
            >
              <span>SAR Radar</span>
            </button>
          </div>

          {/* Overlays & Zoom */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Cadastral Boundary Toggle */}
            <button
              onClick={() => setShowCadastralBoundaries(!showCadastralBoundaries)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                showCadastralBoundaries
                  ? 'bg-[#3E7C59]/30 text-[#A8C3A0] border-[#A8C3A0]/40'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 border-white/15'
              }`}
              title="Toggle Mandated KML Cadastral Boundary"
            >
              <Layers size={13} />
              <span className="hidden sm:inline">Cadastral</span>
            </button>

            {/* Anomaly Mask Toggle */}
            <button
              onClick={() => setShowAnomalyMask(!showAnomalyMask)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                showAnomalyMask
                  ? 'bg-[#FF4D4D]/20 text-[#FFA8A8] border-[#FF4D4D]/40'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 border-white/15'
              }`}
              title="Toggle Vegetation Deficit Anomaly Mask"
            >
              {showAnomalyMask ? <Eye size={13} /> : <EyeOff size={13} />}
              <span className="hidden sm:inline">Deficit Mask</span>
            </button>

            {/* Zoom Controls */}
            <div className="flex items-center border border-white/15 rounded-xl bg-black/30 overflow-hidden">
              <button
                onClick={() => setZoomLevel(Math.min(zoomLevel + 0.2, 1.8))}
                className="p-1.5 hover:bg-white/10 text-white cursor-pointer"
                title="Zoom in"
              >
                <ZoomIn size={13} />
              </button>
              <span className="text-[10px] font-mono px-2 text-white/80 tabular-nums font-semibold">
                {(zoomLevel * 100).toFixed(0)}%
              </span>
              <button
                onClick={() => setZoomLevel(Math.max(zoomLevel - 0.2, 0.8))}
                className="p-1.5 hover:bg-white/10 text-white cursor-pointer"
                title="Zoom out"
              >
                <ZoomOut size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Row 3: Primary Dedicated Range Slider & Sweep Controls (When in Slider Compare Mode) */}
        {gisMode === 'slider_compare' && (
          <div className="bg-black/50 p-3 sm:p-4 rounded-xl border border-white/15 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sliders size={15} className="text-[#A8C3A0]" />
                <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  Historical Transition Slider Control
                </span>
                <span className="text-xs font-mono text-[#6EE7B7] bg-[#12372A] px-2 py-0.5 rounded-md border border-[#A8C3A0]/30 font-semibold tabular-nums">
                  {sliderPosition.toFixed(0)}% ({sliderPosition < 50 ? milestoneA.date : milestoneB.date})
                </span>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                {/* Transition Type Toggle */}
                <div className="flex items-center bg-white/10 p-0.5 rounded-lg text-[11px] font-mono">
                  <button
                    onClick={() => setSliderType('split_curtain')}
                    className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                      sliderType === 'split_curtain' ? 'bg-[#3E7C59] text-white font-semibold' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    Curtain Split
                  </button>
                  <button
                    onClick={() => setSliderType('opacity_crossfade')}
                    className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                      sliderType === 'opacity_crossfade' ? 'bg-[#3E7C59] text-white font-semibold' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    Crossfade
                  </button>
                </div>

                {/* Auto Sweep Play / Pause */}
                <button
                  id="auto-sweep-satellite-btn"
                  onClick={() => setIsPlayingAutoSweep(!isPlayingAutoSweep)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isPlayingAutoSweep
                      ? 'bg-[#E5484D] text-white animate-pulse'
                      : 'bg-[#3E7C59] hover:bg-[#4a9169] text-white'
                  }`}
                  title="Auto-play back and forth sweep between historical images"
                >
                  {isPlayingAutoSweep ? <Pause size={12} /> : <Play size={12} />}
                  <span>{isPlayingAutoSweep ? 'Pause Sweep' : 'Auto Sweep'}</span>
                </button>

                {/* Reset to 50% */}
                <button
                  onClick={() => setSliderPosition(50)}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 transition-colors cursor-pointer"
                  title="Reset split position to 50%"
                >
                  <RotateCcw size={13} />
                </button>
              </div>
            </div>

            {/* Range Scrubber Input */}
            <div className="space-y-1">
              <div className="relative flex items-center">
                <input
                  id="historical-vegetation-slider-input"
                  type="range"
                  min="0"
                  max="100"
                  step="0.5"
                  value={sliderPosition}
                  onChange={(e) => {
                    setSliderPosition(Number(e.target.value));
                    if (isPlayingAutoSweep) setIsPlayingAutoSweep(false);
                  }}
                  className="w-full h-2.5 bg-black/80 rounded-lg appearance-none cursor-pointer accent-[#10B981] border border-white/20"
                />
              </div>

              {/* Slider Endpoints Annotation */}
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-white/70 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-white/40" />
                  <span>100% Past ({milestoneA.date} • NDVI {milestoneA.ndviValue.toFixed(2)})</span>
                </span>
                <span className="text-white/40 text-[10px]">◀ Drag or hover on stage to scrub ▶</span>
                <span className="text-[#6EE7B7] flex items-center gap-1 font-semibold">
                  <span>100% Recent ({milestoneB.date} • NDVI {milestoneB.ndviValue.toFixed(2)})</span>
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Map / Satellite Stage Viewport */}
      <div
        ref={containerRef}
        onPointerDown={gisMode === 'slider_compare' ? handlePointerDown : undefined}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`relative w-full h-[380px] sm:h-[480px] rounded-3xl overflow-hidden border border-white/15 bg-[#0a1e16] shadow-2xl select-none group ${
          isDragging ? 'cursor-ew-resize' : 'cursor-crosshair'
        }`}
      >
        {/* MODE 1: Interactive Historical Time Slider */}
        {gisMode === 'slider_compare' && (
          <>
            {sliderType === 'split_curtain' ? (
              /* SPLIT CURTAIN SWIPE MODE */
              <div className="relative w-full h-full overflow-hidden">
                {/* Right Layer: Image B (Current / Later Pass) */}
                <div className="absolute inset-0 w-full h-full">
                  {renderSatelliteSvg(milestoneB, bandMode, `slider-right-${project.id}`)}
                </div>

                {/* Left Layer: Image A (Baseline / Earlier Pass) Clipped */}
                <div
                  className="absolute inset-y-0 left-0 overflow-hidden"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <div
                    className="w-full h-full"
                    style={{ width: containerRef.current?.clientWidth || 900 }}
                  >
                    {renderSatelliteSvg(milestoneA, bandMode, `slider-left-${project.id}`)}
                  </div>
                </div>

                {/* Draggable Divider Handle Line */}
                <div
                  className="absolute inset-y-0 z-30 pointer-events-none flex items-center justify-center"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="w-0.5 h-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] relative">
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#12372A] border-2 border-white shadow-2xl flex items-center justify-center text-white cursor-ew-resize hover:scale-110 active:scale-95 transition-transform pointer-events-auto">
                      <Sliders size={15} className="rotate-90 text-[#A8C3A0]" />
                    </div>
                  </div>
                </div>

                {/* Split Context Badges */}
                <div className="absolute top-3.5 left-3.5 z-20 px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md text-xs font-mono text-white border border-white/20 shadow-lg pointer-events-none">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-white/60" />
                    <span className="font-bold">Image A (Past):</span>
                    <span className="text-[#FDBA74]">{milestoneA.date}</span>
                    <span className="text-white/40">•</span>
                    <span className="text-white/80">NDVI {milestoneA.ndviValue.toFixed(2)}</span>
                  </div>
                </div>

                <div className="absolute top-3.5 right-14 z-20 px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md text-xs font-mono text-[#6EE7B7] border border-[#A8C3A0]/40 shadow-lg pointer-events-none">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span className="font-bold text-white">Image B (Recent):</span>
                    <span>{milestoneB.date}</span>
                    <span className="text-white/40">•</span>
                    <span className="font-bold">NDVI {milestoneB.ndviValue.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ) : (
              /* OPACITY CROSSFADE MODE */
              <div className="relative w-full h-full overflow-hidden">
                {/* Base: Image A */}
                <div className="absolute inset-0 w-full h-full">
                  {renderSatelliteSvg(milestoneA, bandMode, `fade-a-${project.id}`)}
                </div>

                {/* Overlay: Image B with Opacity */}
                <div
                  className="absolute inset-0 w-full h-full transition-opacity duration-100"
                  style={{ opacity: sliderPosition / 100 }}
                >
                  {renderSatelliteSvg(milestoneB, bandMode, `fade-b-${project.id}`)}
                </div>

                {/* Crossfade Badge */}
                <div className="absolute top-3.5 left-3.5 z-20 px-3.5 py-2 rounded-xl bg-black/85 backdrop-blur-md text-xs font-mono text-white border border-white/20 shadow-lg pointer-events-none">
                  <span>Crossfade Blend: </span>
                  <span className="font-bold text-[#FDBA74]">{milestoneA.date} ({(100 - sliderPosition).toFixed(0)}%)</span>
                  <span className="text-white/50"> ➔ </span>
                  <span className="font-bold text-[#6EE7B7]">{milestoneB.date} ({sliderPosition.toFixed(0)}%)</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* MODE 2: Side-by-Side Dual Matrix */}
        {gisMode === 'side_by_side' && (
          <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full divide-y md:divide-y-0 md:divide-x divide-white/20">
            {/* Left Box: Image A */}
            <div className="relative w-full h-full overflow-hidden">
              {renderSatelliteSvg(milestoneA, bandMode, `sbs-a-${project.id}`)}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md text-[11px] font-mono text-white border border-white/20">
                <span className="font-bold text-white">Past:</span> {milestoneA.date} • NDVI {milestoneA.ndviValue.toFixed(2)}
              </div>
            </div>

            {/* Right Box: Image B */}
            <div className="relative w-full h-full overflow-hidden">
              {renderSatelliteSvg(milestoneB, bandMode, `sbs-b-${project.id}`)}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md text-[11px] font-mono text-[#6EE7B7] border border-[#A8C3A0]/40">
                <span className="font-bold text-white">Recent:</span> {milestoneB.date} • NDVI {milestoneB.ndviValue.toFixed(2)}
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: Cadastral GIS Vector Analysis */}
        {gisMode === 'cadastral_gis' && (
          <div className="w-full h-full">
            {renderSatelliteSvg(milestoneB, 'true_color', `cadastral-view-${project.id}`)}
          </div>
        )}

        {/* Floating Top Right: Compass Orientation */}
        <div className="absolute top-3.5 right-3.5 bg-black/75 backdrop-blur-md rounded-2xl p-2.5 border border-white/20 shadow-lg flex flex-col items-center gap-0.5 select-none pointer-events-none z-20">
          <Compass size={18} className="text-[#A8C3A0]" />
          <span className="text-[9px] font-bold text-white tracking-widest font-mono">N</span>
        </div>

        {/* Floating Bottom Right: Live Pixel Spectral Probe on Cursor Move */}
        {hoverPixel && (
          <div className="absolute bottom-3.5 right-3.5 bg-black/90 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-2xl text-xs font-mono text-white space-y-1 select-none pointer-events-none max-w-xs z-20 hidden sm:block">
            <div className="flex items-center justify-between text-[10px] text-[#A8C3A0] uppercase font-bold border-b border-white/10 pb-1">
              <span>Pixel Telemetry Probe</span>
              <span>10m GSD</span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
              <div>
                <span className="text-white/60">Image A NDVI:</span>{' '}
                <span className="font-bold text-[#FDBA74]">{hoverPixel.ndviA}</span>
              </div>
              <div>
                <span className="text-white/60">Image B NDVI:</span>{' '}
                <span className="font-bold text-[#6EE7B7]">{hoverPixel.ndviB}</span>
              </div>
              <div className="col-span-2">
                <span className="text-white/60">Local Delta Δ:</span>{' '}
                <span className={`font-bold ${hoverPixel.ndviB >= hoverPixel.ndviA ? 'text-[#6EE7B7]' : 'text-[#FF8A8A]'}`}>
                  {(hoverPixel.ndviB - hoverPixel.ndviA) >= 0 ? '+' : ''}
                  {(hoverPixel.ndviB - hoverPixel.ndviA).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Floating Bottom Left: Scale Bar & Coordinates */}
        <div className="absolute bottom-3.5 left-3.5 bg-black/80 backdrop-blur-md rounded-xl px-3 py-1.5 border border-white/15 shadow-md flex items-center gap-2.5 select-none text-xs font-mono text-white pointer-events-none z-20">
          <div className="flex items-center gap-1.5 text-[#A8C3A0]">
            <MapPin size={12} />
            <span className="hidden sm:inline">{project.mapData?.coordinatesDisplay || '21°44\'N, 84°12\'E'}</span>
          </div>
          <span className="text-white/30 hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span>0</span>
            <div className="w-14 h-1 bg-[#A8C3A0] relative flex items-center justify-between">
              <span className="w-0.5 h-2.5 bg-white" />
              <span className="w-0.5 h-2.5 bg-white" />
            </div>
            <span>500m</span>
          </div>
        </div>
      </div>

      {/* Multi-Temporal Change Intelligence Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-[#12372A]/90 p-4 rounded-2xl border border-white/15 shadow-lg text-white">
        {/* Metric 1: NDVI Delta */}
        <div className="p-3 rounded-xl bg-black/30 border border-white/10 space-y-1">
          <span className="text-[10px] font-mono uppercase text-white/60 font-semibold block">
            Net Vegetation Change (Δ NDVI)
          </span>
          <div className="flex items-center gap-2">
            {isPositiveGrowth ? (
              <TrendingUp size={20} className="text-[#6EE7B7]" />
            ) : (
              <TrendingDown size={20} className="text-[#FF8A8A]" />
            )}
            <span className={`text-xl font-bold font-mono tabular-nums ${isPositiveGrowth ? 'text-[#6EE7B7]' : 'text-[#FF8A8A]'}`}>
              {isPositiveGrowth ? '+' : ''}{ndviDiff}
            </span>
            <span className="text-xs font-mono text-white/70">
              ({growthPercent >= 0 ? `+${growthPercent}%` : `${growthPercent}%`})
            </span>
          </div>
          <span className="text-[11px] text-white/60 block">
            From {milestoneA.ndviValue.toFixed(2)} ({milestoneA.date}) to {milestoneB.ndviValue.toFixed(2)} ({milestoneB.date})
          </span>
        </div>

        {/* Metric 2: Estimated Crown Cover Area */}
        <div className="p-3 rounded-xl bg-black/30 border border-white/10 space-y-1">
          <span className="text-[10px] font-mono uppercase text-white/60 font-semibold block">
            Canopy Expansion Trajectory
          </span>
          <div className="text-xl font-bold font-mono text-white tabular-nums">
            {isPositiveGrowth ? `+${estimatedHectaresGained} ha` : '0 ha gain'}
          </div>
          <span className="text-[11px] text-white/70 block">
            Mandated Total: <span className="font-semibold text-[#A8C3A0]">{project.mapData?.caPlotHa || 45} ha</span>
          </span>
        </div>

        {/* Metric 3: Target Compliance Threshold */}
        <div className="p-3 rounded-xl bg-black/30 border border-white/10 space-y-1">
          <span className="text-[10px] font-mono uppercase text-white/60 font-semibold block">
            Mandated Target NDVI
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold font-mono text-white tabular-nums">
              {project.promise?.targetNdvi || 0.55}
            </span>
            {milestoneB.ndviValue >= (project.promise?.targetNdvi || 0.55) ? (
              <span className="px-2 py-0.5 rounded-md bg-[#10B981]/20 text-[#6EE7B7] text-[10px] font-mono font-semibold">
                Target Met
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-[#E5484D]/20 text-[#FF8A8A] text-[10px] font-mono font-semibold">
                Below Target
              </span>
            )}
          </div>
          <span className="text-[11px] text-white/60 block">
            Statutory threshold for legal clearance sign-off
          </span>
        </div>

        {/* Metric 4: Cadastral Survey Reference */}
        <div className="p-3 rounded-xl bg-black/30 border border-white/10 space-y-1">
          <span className="text-[10px] font-mono uppercase text-white/60 font-semibold block">
            Survey & Cadastral Reference
          </span>
          <div className="text-xs font-mono text-white font-semibold truncate" title={project.mapData?.surveyNumbers}>
            {project.mapData?.surveyNumbers || 'Khasra 104/1, 104/2'}
          </div>
          <span className="text-[11px] text-[#A8C3A0] block font-mono truncate">
            {project.clearanceFileRef}
          </span>
        </div>
      </div>

      {/* Accessible Map & Layer Legend */}
      <div className="p-4 bg-black/25 border border-white/15 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-xs border-2 border-[#A8C3A0] bg-[#3E7C59]/40" />
            <span className="font-semibold text-white">Compensatory Afforestation Boundary ({project.mapData?.caPlotHa || 45} ha)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-xs border-2 border-dashed border-[#D4A373] bg-[#D4A373]/20" />
            <span className="text-[#FDBA74]">Diverted Impact Zone ({project.mapData?.impactAreaHa || 28} ha)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-[#247BA0]" />
            <span className="text-[#60A5FA]">Drainage Hydrology</span>
          </div>

          {showAnomalyMask && (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-xs border border-[#FF6B6B] bg-[repeating-linear-gradient(45deg,#ff6b6b,#ff6b6b_2px,transparent_2px,transparent_6px)]" />
              <span className="text-[#FF8A8A] font-semibold">Vegetation Deficit Anomaly</span>
            </div>
          )}
        </div>

        <div className="text-[11px] font-mono text-white/80 bg-white/10 px-3 py-1 rounded-lg border border-white/15">
          Copernicus Sentinel-2 • 10m Ground Resolution
        </div>
      </div>
    </section>
  );
};
