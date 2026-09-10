import React, { useState } from 'react';
import { Project, Language } from '../types';
import { translations } from '../translations';
import { TrendingUp, Info, HelpCircle } from 'lucide-react';

interface NdviTrendChartProps {
  project: Project;
  lang: Language;
}

export const NdviTrendChart: React.FC<NdviTrendChartProps> = ({ project, lang }) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const t = translations[lang];

  const data = project.chartData;
  const paddingLeft = 60;
  const paddingRight = 40;
  const paddingTop = 40;
  const paddingBottom = 50;
  const width = 800;
  const height = 320;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  // NDVI scale is from 0.0 to 1.0 (or min 0.1 to max 0.8)
  const minY = 0.1;
  const maxY = 0.8;

  const getX = (index: number) => {
    return paddingLeft + (index / (data.length - 1)) * chartW;
  };

  const getY = (val: number) => {
    const clamped = Math.max(minY, Math.min(maxY, val));
    return paddingTop + chartH - ((clamped - minY) / (maxY - minY)) * chartH;
  };

  // Build SVG path for Actual NDVI (soft green line)
  const actualPath = data.reduce((acc, d, i) => {
    const x = getX(i);
    const y = getY(d.actualNdvi);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Build SVG path for Target / Mandated trajectory (dashed gray-green line)
  const targetPath = data.reduce((acc, d, i) => {
    const x = getX(i);
    const y = getY(d.expectedNdvi);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Area fill under actual path
  const areaFill = `${actualPath} L ${getX(data.length - 1)} ${paddingTop + chartH} L ${getX(0)} ${paddingTop + chartH} Z`;

  // Determine indices for phases
  const plantingStartIndex = data.findIndex(d => d.phase === 'Planting');
  const monitoringStartIndex = data.findIndex(d => d.phase === 'Monitoring');

  const xPhaseBaselineEnd = plantingStartIndex !== -1 ? getX(plantingStartIndex) : paddingLeft;
  const xPhasePlantingEnd = monitoringStartIndex !== -1 ? getX(monitoringStartIndex) : width - paddingRight;

  return (
    <section className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif-display">
              {t.ndviChartTitle}
            </h2>
            <div className="relative group cursor-pointer" tabIndex={0} aria-label="NDVI Term Explanation">
              <HelpCircle size={15} className="text-white/60 hover:text-white" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 rounded-xl bg-[#0a1e16] border border-white/20 text-white text-[11px] leading-relaxed shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity z-30">
                <span className="font-bold block mb-1 text-[#A8C3A0]">Normalized Difference Vegetation Index (NDVI):</span>
                Standard satellite index (0.0 to 1.0) quantifying healthy green biomass from Sentinel-2 near-infrared reflectance.
              </div>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-white/70">
            {t.ndviChartSubtitle}
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 bg-[#10B981] rounded-full" />
            <span className="font-semibold text-white">Observed Satellite NDVI</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 border-b-2 border-dashed border-[#A8C3A0]" />
            <span className="text-white/70">Target Trajectory</span>
          </div>
        </div>
      </div>

      {/* Responsive Chart Container */}
      <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-4 sm:p-6 shadow-xl overflow-hidden">
        <div className="relative w-full aspect-16/9 sm:aspect-21/9 max-h-[360px]">
          <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="actualNdviGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Shaded Background Bands */}
            <rect
              x={paddingLeft}
              y={paddingTop}
              width={xPhaseBaselineEnd - paddingLeft}
              height={chartH}
              fill="rgba(255,255,255,0.03)"
            />
            <text
              x={paddingLeft + 12}
              y={paddingTop + 20}
              fill="rgba(255,255,255,0.5)"
              fontSize="11"
              fontWeight="bold"
              letterSpacing="0.05em"
            >
              BASELINE PERIOD
            </text>

            {/* Planting Band */}
            {plantingStartIndex !== -1 && (
              <>
                <rect
                  x={xPhaseBaselineEnd}
                  y={paddingTop}
                  width={xPhasePlantingEnd - xPhaseBaselineEnd}
                  height={chartH}
                  fill="rgba(255,255,255,0.05)"
                />
                <text
                  x={xPhaseBaselineEnd + 12}
                  y={paddingTop + 20}
                  fill="#FDBA74"
                  fontSize="11"
                  fontWeight="bold"
                  letterSpacing="0.05em"
                >
                  PLANTING PERIOD
                </text>
              </>
            )}

            {/* Monitoring Band */}
            {monitoringStartIndex !== -1 && (
              <>
                <rect
                  x={xPhasePlantingEnd}
                  y={paddingTop}
                  width={width - paddingRight - xPhasePlantingEnd}
                  height={chartH}
                  fill="rgba(62, 124, 89, 0.2)"
                />
                <text
                  x={xPhasePlantingEnd + 12}
                  y={paddingTop + 20}
                  fill="#A8C3A0"
                  fontSize="11"
                  fontWeight="bold"
                  letterSpacing="0.05em"
                >
                  MONITORING PERIOD
                </text>
              </>
            )}

            {/* Horizontal Grid lines */}
            {[0.2, 0.4, 0.6, 0.8].map((val) => {
              const y = getY(val);
              return (
                <g key={val}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="1"
                    strokeDasharray="2 4"
                  />
                  <text
                    x={paddingLeft - 10}
                    y={y + 4}
                    textAnchor="end"
                    fill="rgba(255,255,255,0.6)"
                    fontSize="11"
                    fontFamily="monospace"
                  >
                    {val.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* Mandated Target reference line */}
            <line
              x1={paddingLeft}
              y1={getY(project.promise.targetNdvi)}
              x2={width - paddingRight}
              y2={getY(project.promise.targetNdvi)}
              stroke="#A8C3A0"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              strokeOpacity="0.7"
            />
            <text
              x={width - paddingRight - 8}
              y={getY(project.promise.targetNdvi) - 6}
              textAnchor="end"
              fill="#A8C3A0"
              fontSize="10"
              fontWeight="bold"
              fontFamily="monospace"
            >
              Clearance Target: {project.promise.targetNdvi} NDVI
            </text>

            {/* Shaded Area fill under observed curve */}
            <path d={areaFill} fill="url(#actualNdviGrad)" />

            {/* Expected target curve line (dashed) */}
            <path
              d={targetPath}
              fill="none"
              stroke="#A8C3A0"
              strokeWidth="2"
              strokeDasharray="5 4"
            />

            {/* Actual Observed trend line */}
            <path
              d={actualPath}
              fill="none"
              stroke="#10B981"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Key Milestone Annotations */}
            {data.map((d, i) => {
              if (!d.milestoneAnnotation) return null;
              const x = getX(i);

              return (
                <g key={`annotation-${i}`}>
                  <line
                    x1={x}
                    y1={paddingTop + 24}
                    x2={x}
                    y2={paddingTop + chartH}
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <g transform={`translate(${x}, ${paddingTop + 36})`}>
                    <rect
                      x="-65"
                      y="-16"
                      width="130"
                      height="22"
                      rx="6"
                      fill="#0a1e16"
                      stroke="rgba(255,255,255,0.2)"
                    />
                    <text
                      x="0"
                      y="-1"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="9.5"
                      fontWeight="bold"
                    >
                      {d.milestoneAnnotation}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Data Points */}
            {data.map((d, i) => {
              const x = getX(i);
              const y = getY(d.actualNdvi);
              const isHovered = hoveredPoint === i;

              return (
                <g
                  key={`point-${i}`}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(i)}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 7 : 4.5}
                    fill="#10B981"
                    stroke="#FFFFFF"
                    strokeWidth={isHovered ? 3 : 2}
                  />

                  {/* X Axis Date Label */}
                  <text
                    x={x}
                    y={height - paddingBottom + 20}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.7)"
                    fontSize="11"
                    fontWeight={d.milestoneAnnotation ? 'bold' : 'normal'}
                  >
                    {d.dateLabel}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Interactive Hover Tooltip */}
          {hoveredPoint !== null && (
            <div
              className="absolute pointer-events-none bg-[#0a1e16]/95 backdrop-blur-md text-white px-3.5 py-2.5 rounded-xl shadow-2xl border border-white/20 text-xs space-y-1 z-20 transition-all"
              style={{
                left: `${(getX(hoveredPoint) / width) * 100}%`,
                top: `${(getY(data[hoveredPoint].actualNdvi) / height) * 100}%`,
                transform: 'translate(-50%, -130%)',
              }}
            >
              <div className="font-bold text-[#A8C3A0] flex items-center justify-between gap-4 font-mono text-[11px]">
                <span>{data[hoveredPoint].dateLabel}</span>
                <span className="text-[10px] text-white/70 uppercase">{data[hoveredPoint].phase}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-white/80">Observed:</span>
                <span className="font-mono font-bold text-white tabular-nums">{data[hoveredPoint].actualNdvi.toFixed(2)} NDVI</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-white/80">Mandated Target:</span>
                <span className="font-mono text-[#A8C3A0] tabular-nums">{data[hoveredPoint].expectedNdvi.toFixed(2)} NDVI</span>
              </div>
              {data[hoveredPoint].milestoneAnnotation && (
                <div className="text-[10px] text-[#A8C3A0] pt-1 border-t border-white/10 font-medium">
                  • {data[hoveredPoint].milestoneAnnotation}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Concise Footer Callout */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-white/70">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              (project.proof.currentNdvi - project.promise.targetNdvi) < 0 ? 'bg-[#E5484D]' : 'bg-[#10B981]'
            }`} />
            <span>
              Trajectory variance: <strong className={`font-mono ${
                (project.proof.currentNdvi - project.promise.targetNdvi) < 0 ? 'text-[#FF8A8A]' : 'text-[#6EE7B7]'
              }`}>
                {((project.proof.currentNdvi - project.promise.targetNdvi)).toFixed(2)} NDVI
              </strong> from clearance threshold.
            </span>
          </div>
          <span className="font-mono text-[11px] text-white/60">
            Sensor: Sentinel-2 MSI L2A (10m Multi-spectral)
          </span>
        </div>
      </div>
    </section>
  );
};
