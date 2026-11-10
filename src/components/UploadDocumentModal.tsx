import React, { useState } from 'react';
import { Project, Language } from '../types';
import { translations } from '../translations';
import { useToast } from '../context/ToastContext';
import { X, Upload, FileText, CheckCircle2, ArrowRight, Sparkles, Loader2, AlertCircle } from 'lucide-react';

interface UploadDocumentModalProps {
  lang: Language;
  onClose: () => void;
  onProjectLoaded: (project: Project) => void;
  availableProjects: Project[];
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  lang,
  onClose,
  onProjectLoaded,
  availableProjects,
}) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStage, setProgressStage] = useState<string>('');
  const t = translations[lang];

  const handleSimulateAnalysis = (proj: Project) => {
    setIsProcessing(true);
    setProgressStage('Extracting afforestation conditions from PDF...');

    setTimeout(() => {
      setProgressStage('Identifying cadastral survey coordinates & KML boundary...');
    }, 900);

    setTimeout(() => {
      setProgressStage('Retrieving Copernicus Sentinel-2 & Sentinel-1 time-series passes...');
    }, 1800);

    setTimeout(() => {
      setProgressStage('Computing NDVI trajectories & synthesizing Promise vs Proof...');
    }, 2700);

    setTimeout(() => {
      setIsProcessing(false);
      onProjectLoaded(proj);
      onClose();
      toast.success('Document Ingestion Complete', {
        message: `Successfully parsed statutory mandate for "${proj.name}". Mandated sapling quota: ${proj.promise.saplingCount} across ${proj.promise.requiredArea}.`,
        duration: 5000,
      });
    }, 3400);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleSimulateAnalysis(availableProjects[0]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleSimulateAnalysis(availableProjects[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex justify-center items-center p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-[#0d261b] rounded-2xl shadow-2xl border border-white/20 overflow-hidden text-white"
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-modal-title"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 id="upload-modal-title" className="text-xl font-bold text-white font-serif-display">
              {t.uploadModalTitle}
            </h3>
            <p className="text-xs text-white/70">
              {t.uploadModalSubtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close upload dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {isProcessing ? (
            <div className="py-12 px-4 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#6EE7B7]">
                <Loader2 size={28} className="animate-spin" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white font-serif-display">
                  Autonomous Clearance Parsing
                </h4>
                <p className="text-xs sm:text-sm text-[#A8C3A0] font-medium animate-pulse">
                  {progressStage}
                </p>
              </div>
              <div className="max-w-xs mx-auto bg-black/30 p-2.5 rounded-lg border border-white/10 text-[11px] text-white/60">
                Correlating against European Space Agency (ESA) Sentinel-2 optical bands and CAMPA records.
              </div>
            </div>
          ) : (
            <>
              {/* Drag & Drop File Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                  isDragging
                    ? 'border-[#10B981] bg-[#10B981]/15 scale-[0.99]'
                    : 'border-white/20 bg-black/25 hover:border-[#A8C3A0]'
                }`}
              >
                <input
                  type="file"
                  id="pdf-file-upload-input"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label htmlFor="pdf-file-upload-input" className="cursor-pointer block space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#A8C3A0] shadow-md">
                    <Upload size={22} className="text-[#A8C3A0]" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-white">
                      {t.dropzoneText}
                    </div>
                    <div className="text-xs text-white/60">
                      {t.dropzoneSubtext}
                    </div>
                  </div>
                  <span className="inline-block text-xs font-semibold px-4 py-1.5 rounded-lg bg-[#3E7C59] hover:bg-[#4a9169] text-white border border-[#A8C3A0]/30 shadow-md">
                    Select PDF File
                  </span>
                </label>
              </div>

              {/* Sample Pre-loaded PDF Clearance Letters */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white/70 uppercase tracking-wider">
                  <Sparkles size={13} className="text-[#A8C3A0]" />
                  <span>Or test with pre-validated official Indian clearance letters:</span>
                </div>

                <div className="space-y-2">
                  {availableProjects.map((proj) => (
                    <button
                      key={proj.id}
                      onClick={() => handleSimulateAnalysis(proj)}
                      className="w-full text-left p-3.5 rounded-xl bg-black/30 border border-white/10 hover:border-[#A8C3A0] hover:bg-black/50 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-[#FDBA74]">
                          <FileText size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-[#A8C3A0] transition-colors">
                            {proj.name}
                          </div>
                          <div className="text-[11px] text-white/60">
                            {proj.clearanceFileRef} • {proj.state}
                          </div>
                        </div>
                      </div>
                      <ArrowRight size={15} className="text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-black/40 border-t border-white/10 text-[11px] text-white/70 flex items-center gap-2">
          <CheckCircle2 size={14} className="text-[#6EE7B7] shrink-0" />
          <span>Strict confidential processing. No proprietary agency documents stored without cryptographic consent.</span>
        </div>
      </div>
    </div>
  );
};
