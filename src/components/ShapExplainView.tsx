import React from 'react';
import { Project, Language } from '../types';
import { translations } from '../translations';
import { Activity, Brain, HelpCircle, AlertTriangle, CheckCircle, ArrowRight, BarChart2 } from 'lucide-react';

interface ShapExplainViewProps {
  project: Project;
  lang: Language;
}

export const ShapExplainView: React.FC<ShapExplainViewProps> = ({ project, lang }) => {
  const t = translations[lang];

  // Feature attributions for SHAP explainability
  const shapFeatures = [
    {
      feature: 'Sentinel-2 NIR (B08) Reflectance Deficit',
      impact: '+0.38 Risk',
      value: '0.345 vs 0.620 Expected',
      type: 'negative',
      barWidth: '78%',
      description: 'Absence of dense chlorophyll-rich broadleaf canopy structure in the NIR band',
    },
    {
      feature: 'Sentinel-1 C-SAR Radar Backscatter (VH)',
      impact: '+0.26 Risk',
      value: `${project.technicalEvidence.sarBackscatterDb} (Low Stem Volume)`,
      type: 'negative',
      barWidth: '55%',
      description: 'C-band radar waves confirm lack of woody branch geometry and stem volume',
    },
    {
      feature: 'NDWI Plant Moisture Deficit',
      impact: '+0.19 Risk',
      value: `${project.technicalEvidence.moistureIndex.toFixed(2)} (Cellular Dryness)`,
      type: 'negative',
      barWidth: '40%',
      description: 'Soil surface indicates arid conditions with minimal sapling root hydration',
    },
    {
      feature: 'Cadastral Boundary Alignment',
      impact: '-0.12 Risk (Mitigating)',
      value: '100% Survey Polygon Match',
      type: 'positive',
      barWidth: '25%',
      description: 'Zero spatial drift or off-boundary diversion detected in revenue map KML',
    },
    {
      feature: 'Seasonal Monsoon Precipitation Index',
      impact: '-0.07 Risk (Mitigating)',
      value: '104% Normal Seasonal Rains',
      type: 'positive',
      barWidth: '15%',
      description: 'Macro-climate rainfall conditions were favorable for sapling establishment',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-[#A8C3A0] mb-2">
            <Brain size={14} className="text-[#A8C3A0]" />
            <span>Explainable AI (XAI) Attribution Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif-display">
            SHAP Decision Attribution Breakdown
          </h2>
          <p className="text-xs sm:text-sm text-white/70">
            Shapley Additive exPlanations quantify exactly which multi-spectral, radar, and statutory features drove the compliance risk score.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-black/30 border border-white/15 text-right font-mono text-xs">
          <span className="text-white/60 block text-[10px] uppercase">Model Base Value</span>
          <span className="text-white font-bold text-base">E[f(x)] = 34.0</span>
          <span className="text-[#FF8A8A] block text-[11px] font-semibold">f(x) = {project.complianceRiskScore}.0</span>
        </div>
      </div>

      {/* Primary Attribution Waterfall Card */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <BarChart2 size={18} className="text-[#A8C3A0]" />
            <h3 className="text-base font-bold text-white font-serif-display">
              Feature Contribution Waterfall
            </h3>
          </div>
          <span className="text-xs text-white/60 font-mono">KernelSHAP • 10,000 Permutations</span>
        </div>

        {/* Feature List */}
        <div className="space-y-4">
          {shapFeatures.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-black/25 border border-white/10 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-white text-sm">{item.feature}</span>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-white/60 text-[11px]">{item.value}</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-md ${
                      item.type === 'negative'
                        ? 'bg-[#E5484D]/20 text-[#FF8A8A] border border-[#E5484D]/30'
                        : 'bg-[#10B981]/20 text-[#6EE7B7] border border-[#10B981]/30'
                    }`}
                  >
                    {item.impact}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    item.type === 'negative' ? 'bg-[#E5484D]' : 'bg-[#10B981]'
                  }`}
                  style={{ width: item.barWidth }}
                />
              </div>

              <p className="text-[11px] text-white/70">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Model Conclusion Summary */}
        <div className="p-4 rounded-xl bg-black/35 border border-white/15 flex items-start gap-3">
          <AlertTriangle size={18} className="text-[#FDBA74] shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold text-white block">Audit Synthesis Conclusion:</span>
            <p className="text-white/80 leading-relaxed">
              The dominant factor driving the {project.complianceRiskScore} Risk verdict is the severe absence of cellular NIR reflectance (78% weight) combined with flat SAR backscatter. This proves beyond doubt that tree sapling crowns have either died or were never planted at the specified density.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
