import React from 'react';
import { Project, Language } from '../types';
import { translations } from '../translations';
import { X, FileText, CheckCircle2, ShieldCheck, ExternalLink, Printer } from 'lucide-react';

interface SourcePdfModalProps {
  project: Project;
  lang: Language;
  onClose: () => void;
}

export const SourcePdfModal: React.FC<SourcePdfModalProps> = ({
  project,
  lang,
  onClose,
}) => {
  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex justify-center items-center p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#0d261b] rounded-2xl shadow-2xl border border-white/20 overflow-hidden text-white"
        role="dialog"
        aria-modal="true"
        aria-labelledby="source-pdf-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 text-[#FDBA74] flex items-center justify-center">
              <FileText size={18} />
            </div>
            <div>
              <h3 id="source-pdf-title" className="text-base font-bold text-white font-serif-display">
                Original Clearance Condition Excerpt
              </h3>
              <p className="text-xs text-white/70">
                {project.clearanceFileRef} • {project.promise.sourcePdfPage}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close document excerpt"
          >
            <X size={18} />
          </button>
        </div>

        {/* Facsimile Document Page Preview */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto subtle-scrollbar">
          {/* Official Letterhead Simulation */}
          <div className="border border-[#D5D0C3] bg-[#FAF8F3] p-6 rounded-xl shadow-md space-y-4 font-serif-display text-[#243238]">
            <div className="text-center space-y-1 border-b border-[#E3DFD5] pb-4">
              <div className="text-[11px] uppercase tracking-widest text-[#6B7280] font-sans font-semibold">
                Ministry of Environment, Forest and Climate Change (MoEFCC)
              </div>
              <div className="text-xs text-[#243238] font-sans">
                Government of India • Forest Conservation Division
              </div>
              <div className="text-[11px] text-[#6B7280] font-mono font-sans pt-1">
                F.No. {project.clearanceFileRef.replace('.pdf', '')} • Dated: {project.clearanceDate}
              </div>
            </div>

            <div className="font-sans text-xs space-y-3 text-[#243238]">
              <p className="font-semibold">
                To: The User Agency / Project Proponent, {project.proponent}
              </p>
              <p className="italic text-[#6B7280]">
                Subject: Diversion of forest land and statutory approval under Section 2 of the Forest (Conservation) Act, 1980 for {project.name}.
              </p>

              <div className="py-2">
                <p>Sir / Madam,</p>
                <p className="leading-relaxed mt-1">
                  I am directed to convey the Central Government approval subject to the strict adherence of the following Specific and General Conditions:
                </p>
              </div>

              {/* Highlighted Mandate Clause */}
              <div className="p-4 rounded-xl bg-[#FAF1D6] border-2 border-[#E9A23B] space-y-2 text-[#243238] font-sans">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#8A5700] uppercase tracking-wider">
                    {project.promise.sourcePdfPage}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/80 text-[#8A5700] font-semibold">
                    Statutory Obligation
                  </span>
                </div>
                <p className="text-sm font-bold text-[#12372A] leading-relaxed">
                  “{project.promise.specificCondition}”
                </p>
                <div className="text-[11px] text-[#6D4C41] font-medium pt-1">
                  Required Target: {project.promise.requiredArea} | Mandated Deadline: {project.promise.deadline}
                </div>
              </div>

              <p className="text-[11px] text-[#6B7280] leading-relaxed">
                Failure to comply with the above condition within the stipulated timeline shall render the user agency liable for penal action under relevant provisions of the law, including stoppage of non-forest activity in the diverted zone.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-black/40 border-t border-white/10 flex items-center justify-between">
          <span className="text-[11px] text-[#A8C3A0] font-mono">
            SHA256: e8b7...41a2 • Verified Digital Transcript
          </span>
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
