import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { X, ShieldCheck, Satellite, CheckCircle2, Trees, Sparkles, Scale } from 'lucide-react';

interface AboutModalProps {
  lang: Language;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ lang, onClose }) => {
  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex justify-center items-center p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#0d261b] rounded-2xl shadow-2xl border border-white/20 overflow-hidden text-white"
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-title"
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1b4e3c] to-[#0e2c21] border border-white/20 flex items-center justify-center text-white">
              <Satellite size={18} className="text-[#A8C3A0]" />
            </div>
            <div>
              <h3 id="about-title" className="text-xl font-bold text-white font-serif-display">
                Canopy: Where Did the Compensatory Forest Go?
              </h3>
              <p className="text-xs text-[#A8C3A0]">
                Tracing every cleared forest to its promised replacement and verifying, from orbit, whether the promise was kept.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close about dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6 text-white/90">
          <div className="space-y-2">
            <h4 className="text-base font-bold text-white font-serif-display">
              Our Core Problem & Mission
            </h4>
            <p className="text-sm leading-relaxed text-white/80">
              When forests are cleared in India for infrastructure, mining, and industrial development, the Forest (Conservation) Act mandates compensatory afforestation (CA) on equivalent non-forest or degraded land. Millions of rupees are deposited into CAMPA funds. Yet, until now, there has been no automated, continuous system verifying whether these promised replacement forests actually grow. <strong className="text-white">Canopy</strong> links every clearance approval order directly to its designated compensatory polygon and continuously audits vegetation health from orbit.
            </p>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-black/25 border border-white/10 space-y-1.5">
              <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center text-[#6EE7B7]">
                <Satellite size={16} />
              </div>
              <div className="font-bold text-white">Orbital Verification</div>
              <p className="text-white/70 leading-snug">
                Every hectare is cross-referenced with 5-day Sentinel-2 multi-spectral passes and cloud-penetrating Sentinel-1 SAR.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/25 border border-white/10 space-y-1.5">
              <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center text-[#60A5FA]">
                <Scale size={16} />
              </div>
              <div className="font-bold text-white">Objective Audit</div>
              <p className="text-white/70 leading-snug">
                Dispassionate anomaly detection comparing statutory clearance conditions with actual biophysical recovery.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/25 border border-white/10 space-y-1.5">
              <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center text-[#A8C3A0]">
                <Trees size={16} />
              </div>
              <div className="font-bold text-white">Accountability & Governance</div>
              <p className="text-white/70 leading-snug">
                Empowers state forest divisions, CAG auditors, and citizens with transparent, verifiable evidence trails.
              </p>
            </div>
          </div>

          {/* Technology Stack Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#A8C3A0]" />
              <h4 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
                Technology Stack & Earth Observation Architecture
              </h4>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="font-mono text-[11px] font-bold text-[#74BDE0]">Satellite Constellations</span>
                <p className="text-white/80 leading-relaxed">
                  <strong>Copernicus Sentinel-2 (MSI)</strong> 10m visible & NIR bands; <strong>Landsat 8/9 (OLI/TIRS)</strong> thermal & multi-decadal archival baselines; <strong>Sentinel-1 C-SAR</strong> for cloud-independent canopy structure & moisture backscatter.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="font-mono text-[11px] font-bold text-[#74BDE0]">Geospatial Compute Engine</span>
                <p className="text-white/80 leading-relaxed">
                  <strong>Google Earth Engine (GEE)</strong> API for planetary-scale raster computation, temporal median compositing, automated cloud masking (QA60 & s2cloudless), and multi-year time-series trend reduction.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="font-mono text-[11px] font-bold text-[#74BDE0]">Vegetation & Spectral Indices</span>
                <p className="text-white/80 leading-relaxed">
                  <strong>NDVI</strong> (Normalized Difference Vegetation Index) for canopy greenness; <strong>EVI</strong> (Enhanced Vegetation Index) for atmospheric decoupling and high-biomass saturation avoidance; <strong>NDWI</strong> for moisture tracking.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="font-mono text-[11px] font-bold text-[#74BDE0]">AI Compliance & Anomaly Models</span>
                <p className="text-white/80 leading-relaxed">
                  <strong>Random Forest Classifier</strong> trained on regional land-use benchmarks combined with <strong>LSTM Time-Series Anomaly Detection</strong> to flag non-compliant sites, growth flatlines, and boundary encroachments with confidence scores.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-xs text-white space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-[#6EE7B7]">
              <CheckCircle2 size={14} />
              <span>National Scale Monitoring Vision</span>
            </div>
            <p className="leading-relaxed text-white/80">
              Canopy is engineered to scale across all 28 states and union territories, tracking every clearance granted under the MoEFCC Parivesh portal and ensuring CAMPA funds result in living, thriving biodiverse forests rather than empty promises.
            </p>
          </div>
        </div>

        <div className="p-4 bg-black/40 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#3E7C59] hover:bg-[#4a9169] text-white text-xs font-semibold transition-colors cursor-pointer border border-[#A8C3A0]/30 shadow-md"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
