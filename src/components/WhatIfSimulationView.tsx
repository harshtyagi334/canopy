import React, { useState } from 'react';
import { Project, Language } from '../types';
import { translations } from '../translations';
import { Sliders, Sparkles, TrendingUp, CheckCircle, RefreshCw, AlertCircle, Droplet, Trees, Calendar } from 'lucide-react';

interface WhatIfSimulationViewProps {
  project: Project;
  lang: Language;
}

export const WhatIfSimulationView: React.FC<WhatIfSimulationViewProps> = ({ project, lang }) => {
  const [additionalSaplings, setAdditionalSaplings] = useState<number>(15000);
  const [irrigationLevel, setIrrigationLevel] = useState<'low' | 'moderate' | 'drip'>('drip');
  const [soilTreatment, setSoilTreatment] = useState<boolean>(true);
  const [monsoonScenario, setMonsoonScenario] = useState<'normal' | 'deficit'>('normal');

  // Dynamic simulation calculations
  const baselineNdvi = project.proof.currentNdvi;
  const targetNdvi = project.promise.targetNdvi;

  const saplingBonus = (additionalSaplings / 40000) * 0.18;
  const irrigationBonus = irrigationLevel === 'drip' ? 0.12 : irrigationLevel === 'moderate' ? 0.06 : 0.02;
  const soilBonus = soilTreatment ? 0.05 : 0;
  const climatePenalty = monsoonScenario === 'deficit' ? -0.06 : 0;

  const projectedNdvi = Math.min(0.85, baselineNdvi + saplingBonus + irrigationBonus + soilBonus + climatePenalty);
  const isCompliant = projectedNdvi >= targetNdvi;
  const complianceProbability = Math.min(99, Math.max(15, Math.round((projectedNdvi / targetNdvi) * 88)));
  const estimatedMonths = Math.max(6, Math.round(24 - (projectedNdvi - baselineNdvi) * 40));
  const estimatedCostLakhs = Math.round((additionalSaplings * 85 + (irrigationLevel === 'drip' ? 450000 : 150000)) / 100000);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-[#A8C3A0] mb-2">
            <Sliders size={14} className="text-[#A8C3A0]" />
            <span>Remediation & Intervention Scenario Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif-display">
            Interactive What-If Afforestation Simulator
          </h2>
          <p className="text-xs sm:text-sm text-white/70">
            Simulate remedial ecological investments to forecast time-to-compliance, expected canopy density, and probability of statutory clearance.
          </p>
        </div>

        <button
          onClick={() => {
            setAdditionalSaplings(15000);
            setIrrigationLevel('drip');
            setSoilTreatment(true);
            setMonsoonScenario('normal');
          }}
          className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw size={13} />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (7 cols) */}
        <div className="lg:col-span-7 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white font-serif-display border-b border-white/10 pb-3 flex items-center gap-2">
            <Trees size={16} className="text-[#A8C3A0]" />
            <span>Remediation Parameters</span>
          </h3>

          {/* Slider: Additional Saplings */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-white">Compensatory Sapling Replanting Volume</label>
              <span className="font-mono text-[#A8C3A0] font-bold text-sm">
                +{additionalSaplings.toLocaleString()} saplings
              </span>
            </div>
            <input
              type="range"
              min="2000"
              max="40000"
              step="1000"
              value={additionalSaplings}
              onChange={(e) => setAdditionalSaplings(Number(e.target.value))}
              className="w-full accent-[#10B981] h-2 bg-black/40 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-white/60 font-mono">
              <span>2,000 (Minimal)</span>
              <span>20,000 (Recommended)</span>
              <span>40,000 (Full Canopy)</span>
            </div>
          </div>

          {/* Radio Group: Irrigation */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Droplet size={14} className="text-[#60A5FA]" />
              <span>Irrigation & Soil Moisture Infrastructure</span>
            </label>
            <div className="grid grid-cols-3 gap-3 text-xs">
              {[
                { id: 'low', label: 'Rainfed Only', desc: 'Natural precipitation' },
                { id: 'moderate', label: 'Water Tanker', desc: 'Bi-weekly manual watering' },
                { id: 'drip', label: 'Solar Micro-Drip', desc: 'Automated root hydration' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setIrrigationLevel(opt.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    irrigationLevel === opt.id
                      ? 'bg-[#10B981]/20 border-[#10B981] text-white'
                      : 'bg-black/25 border-white/10 text-white/70 hover:bg-black/40'
                  }`}
                >
                  <span className="font-bold block text-sm">{opt.label}</span>
                  <span className="text-[10px] opacity-70 block mt-1">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Toggle: Soil conditioning */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-black/25 border border-white/10">
            <div>
              <span className="text-xs font-semibold text-white block">Organic Bio-Char Soil Conditioning</span>
              <span className="text-[11px] text-white/60">Increases nutrient retention and sapling survival rate by 22%</span>
            </div>
            <button
              onClick={() => setSoilTreatment(!soilTreatment)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                soilTreatment ? 'bg-[#10B981]' : 'bg-white/20'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  soilTreatment ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Climate Scenario */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white">Projected Monsoon Scenario</label>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <button
                onClick={() => setMonsoonScenario('normal')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  monsoonScenario === 'normal'
                    ? 'bg-[#10B981]/20 border-[#10B981] text-white'
                    : 'bg-black/25 border-white/10 text-white/70'
                }`}
              >
                <span className="font-bold block">Normal Monsoon (100% Avg)</span>
                <span className="text-[10px] opacity-70 block">Standard historical precipitation</span>
              </button>
              <button
                onClick={() => setMonsoonScenario('deficit')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  monsoonScenario === 'deficit'
                    ? 'bg-[#E5484D]/20 border-[#E5484D] text-white'
                    : 'bg-black/25 border-white/10 text-white/70'
                }`}
              >
                <span className="font-bold block">Deficit Season (-20% Rain)</span>
                <span className="text-[10px] opacity-70 block">Extended dry spell simulation</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Column (5 cols) */}
        <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-6 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <h3 className="text-base font-bold text-white font-serif-display border-b border-white/10 pb-3 flex items-center justify-between">
              <span>Forecasted Outcome</span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold font-mono ${
                  isCompliant
                    ? 'bg-[#10B981]/20 text-[#6EE7B7] border border-[#10B981]/30'
                    : 'bg-[#E5484D]/20 text-[#FF8A8A] border border-[#E5484D]/30'
                }`}
              >
                {isCompliant ? 'Compliant Target Met' : 'Remediation Deficit'}
              </span>
            </h3>

            {/* Projected NDVI vs Baseline */}
            <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/70">Projected Peak Canopy NDVI:</span>
                <span className="text-xl font-bold font-mono text-white">
                  {projectedNdvi.toFixed(2)}
                </span>
              </div>
              <div className="space-y-1">
                <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCompliant ? 'bg-[#10B981]' : 'bg-[#F59E0B]'
                    }`}
                    style={{ width: `${Math.min(100, (projectedNdvi / 0.85) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-white/60 font-mono">
                  <span>Baseline: {baselineNdvi.toFixed(2)}</span>
                  <span>Target: {targetNdvi.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Metrics Trio */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-black/25 border border-white/10">
                <span className="text-white/60 block text-[10px] uppercase font-semibold">Audit Approval Prob.</span>
                <span className="text-2xl font-bold font-mono text-[#6EE7B7] block mt-1">
                  {complianceProbability}%
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-black/25 border border-white/10">
                <span className="text-white/60 block text-[10px] uppercase font-semibold">Time to Clearance</span>
                <span className="text-2xl font-bold font-mono text-white block mt-1">
                  ~{estimatedMonths} mo
                </span>
              </div>
            </div>

            {/* Estimated Budget */}
            <div className="p-3.5 rounded-xl bg-black/25 border border-white/10 flex items-center justify-between text-xs">
              <span className="text-white/70">Est. Proponent Remediation Cost:</span>
              <span className="text-base font-bold font-mono text-white">
                ₹ {estimatedCostLakhs} Lakhs
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 space-y-1">
            <span className="font-semibold text-white block">MoEFCC Compliance Advisory:</span>
            <p className="leading-relaxed text-[11px]">
              Deploying {additionalSaplings.toLocaleString()} nursery saplings alongside {irrigationLevel === 'drip' ? 'micro-drip lines' : 'standard irrigation'} achieves statutory canopy standards within {estimatedMonths} months, satisfying Forest Conservation Act Section 2.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
