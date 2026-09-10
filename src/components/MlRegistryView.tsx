import React from 'react';
import { Project, Language } from '../types';
import { Cpu, CheckCircle2, ShieldCheck, GitBranch, Database, Award, Activity, Sparkles } from 'lucide-react';

interface MlRegistryViewProps {
  project: Project;
  lang: Language;
}

export const MlRegistryView: React.FC<MlRegistryViewProps> = ({ project, lang }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-[#A8C3A0] mb-2">
            <Cpu size={14} className="text-[#A8C3A0]" />
            <span>Production ML Model Registry & Provenance</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif-display">
            VanGuard Environmental Neural Architecture
          </h2>
          <p className="text-xs sm:text-sm text-white/70">
            Validated machine learning models running active inference on European Space Agency multi-spectral and SAR radar passes.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#10B981]/20 border border-[#10B981]/30 text-xs font-mono text-[#6EE7B7] font-semibold">
          <CheckCircle2 size={14} />
          <span>Model Status: Production Active</span>
        </div>
      </div>

      {/* Model Card Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Model Spec Card (2 cols) */}
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-6 shadow-xl space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-mono text-[#A8C3A0] block">MODEL ARTIFACT ID</span>
              <h3 className="text-xl font-bold text-white font-serif-display">
                VanGuard-CanopyResNet-v2.4.1
              </h3>
              <p className="text-xs text-white/70 mt-1">
                Multi-spectral 12-Band Spectral Convolution + ExtraTrees Ensemble Regressor
              </p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-black/30 border border-white/15 text-white">
              v2.4.1-prod
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-black/25 border border-white/10">
              <span className="text-white/60 block text-[10px] uppercase font-semibold">F1-Score</span>
              <span className="text-xl font-bold font-mono text-[#6EE7B7] block mt-1">94.2%</span>
            </div>
            <div className="p-3 rounded-xl bg-black/25 border border-white/10">
              <span className="text-white/60 block text-[10px] uppercase font-semibold">Precision</span>
              <span className="text-xl font-bold font-mono text-white block mt-1">94.8%</span>
            </div>
            <div className="p-3 rounded-xl bg-black/25 border border-white/10">
              <span className="text-white/60 block text-[10px] uppercase font-semibold">Inference Speed</span>
              <span className="text-xl font-bold font-mono text-white block mt-1">180 ms</span>
            </div>
            <div className="p-3 rounded-xl bg-black/25 border border-white/10">
              <span className="text-white/60 block text-[10px] uppercase font-semibold">Concept Drift</span>
              <span className="text-xl font-bold font-mono text-[#6EE7B7] block mt-1">0.02 (Stable)</span>
            </div>
          </div>

          {/* Training Data Specs */}
          <div className="space-y-2 text-xs">
            <span className="font-semibold text-white block">Training Dataset & Ground Truth Validation:</span>
            <div className="p-4 rounded-xl bg-black/25 border border-white/10 space-y-1.5 text-white/80 leading-relaxed">
              <p>
                Trained on <strong>1,420 ground-truthed compensatory afforestation plots</strong> spanning 14 Indian states, cross-verified with Forest Survey of India (FSI) 2021-2025 ground inspections and drone LiDAR point clouds.
              </p>
              <div className="flex flex-wrap gap-2 pt-2 text-[11px] font-mono text-[#A8C3A0]">
                <span>• Western Ghats Tropical</span>
                <span>• Deccan Dry Deciduous</span>
                <span>• Central Indian Teak-Sal</span>
                <span>• Eastern Ghats Mixed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Model Provenance & Audit Card (1 col) */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-6 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white font-serif-display border-b border-white/10 pb-3 flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#A8C3A0]" />
              <span>Safety & Compliance Audit</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-black/25 border border-white/10 space-y-1">
                <span className="text-white/60 block text-[10px] uppercase font-semibold">Fairness & Bias Audit</span>
                <span className="text-[#6EE7B7] font-semibold flex items-center gap-1">
                  <CheckCircle2 size={13} /> Zero geographic regional bias detected
                </span>
              </div>

              <div className="p-3 rounded-xl bg-black/25 border border-white/10 space-y-1">
                <span className="text-white/60 block text-[10px] uppercase font-semibold">Deterministic Seed</span>
                <span className="text-white font-mono text-[11px]">Seed: 0x93FA821B (Reproducible)</span>
              </div>

              <div className="p-3 rounded-xl bg-black/25 border border-white/10 space-y-1">
                <span className="text-white/60 block text-[10px] uppercase font-semibold">Container Runtime</span>
                <span className="text-white font-mono text-[11px]">ONNX Runtime v1.17 • TensorRT</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/35 border border-white/15 text-[11px] text-white/70">
            Model weights hashed with SHA-256 for cryptographic integrity prior to deployment.
          </div>
        </div>
      </div>
    </div>
  );
};
