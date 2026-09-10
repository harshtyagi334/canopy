import React, { useState } from 'react';
import { Project, Language } from '../types';
import { Satellite, Radio, FileText, CheckCircle2, RefreshCw, Terminal, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface DataIngestViewProps {
  project: Project;
  lang: Language;
}

export const DataIngestView: React.FC<DataIngestViewProps> = ({ project, lang }) => {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncStreams = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success('EO Telemetry Synced', {
        message: `Successfully pulled latest Copernicus Sentinel-2 L2A BOA tile for ${project.name}. 0 new cloud anomalies detected.`,
        duration: 4000,
      });
    }, 1200);
  };
  const telemetryStreams = [
    {
      sensor: 'Copernicus Sentinel-2B MSI',
      granule: project.technicalEvidence.sentinelSceneId,
      orbit: 'Relative Orbit R005 • Tile T43QDA',
      resolution: '10m / 20m Multi-spectral',
      calib: 'L2A Bottom-of-Atmosphere (BOA) Sen2Cor v2.10',
      status: 'Active Ingest',
      timestamp: '2026-04-08 05:36:41 UTC',
      cloudScore: '0.04% cloud cover',
    },
    {
      sensor: 'Copernicus Sentinel-1A SAR',
      granule: 'S1A_IW_GRDH_1SDV_20260406T004218_053120_066FF2_5BC3',
      orbit: 'Interferometric Wide (IW) • Ascending Pass',
      resolution: '10m Dual-Polarization (VH / VV)',
      calib: 'Radiometric Terrain Flattened Gamma-0 (SNAP 10.0)',
      status: 'Active Ingest',
      timestamp: '2026-04-06 00:42:18 UTC',
      cloudScore: 'All-weather radar penetrative',
    },
    {
      sensor: 'MoEFCC Statutory PDF Pipeline',
      granule: project.clearanceFileRef,
      orbit: 'Parivesh 2.0 Central Portal Sync',
      resolution: 'Vectorized OCR + Clause Parser v3.2',
      calib: 'SHA-256 Digitally Signed Forensic Seal',
      status: 'Verified Ingest',
      timestamp: '2026-03-22 11:15:00 IST',
      cloudScore: '100% OCR Confidence',
    },
    {
      sensor: 'State Revenue Cadastral KML',
      granule: `SURVEY_PLOT_${project.mapData.surveyNumbers.replace(/\s+/g, '_')}.kml`,
      orbit: 'Survey of India EPSG:4326',
      resolution: 'Sub-meter cadastral vertex boundaries',
      calib: 'Orthorectified against SRTM DEM 30m',
      status: 'Polygon Locked',
      timestamp: '2026-02-14 09:30:22 IST',
      cloudScore: 'Boundary Integrity Pass',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-[#A8C3A0] mb-2">
            <Layers size={14} className="text-[#A8C3A0]" />
            <span>Multi-Sensor Earth Observation Ingest</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif-display">
            Copernicus & Cadastral Data Streams
          </h2>
          <p className="text-xs sm:text-sm text-white/70">
            Real-time optical, synthetic aperture radar, cadastral GIS, and legal document telemetry ingested for parcel verification.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
            <span className="text-xs font-mono text-[#6EE7B7] font-semibold">Feed: Active Sync</span>
          </div>

          <button
            onClick={handleSyncStreams}
            disabled={isSyncing}
            className="px-3.5 py-1.5 rounded-xl bg-[#3E7C59] hover:bg-[#4a9169] active:scale-95 text-xs font-semibold text-white border border-[#A8C3A0]/30 shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            <RefreshCw size={13} className={isSyncing ? 'animate-spin text-[#A8C3A0]' : 'text-white'} />
            <span>{isSyncing ? 'Fetching Satellite Passes...' : 'Poll New Passes'}</span>
          </button>
        </div>
      </div>

      {/* Stream Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {telemetryStreams.map((item, idx) => (
          <div
            key={idx}
            className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-5 shadow-md space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-base font-serif-display flex items-center gap-2">
                {item.sensor.includes('Sentinel-2') ? (
                  <Satellite size={16} className="text-[#6EE7B7]" />
                ) : item.sensor.includes('Sentinel-1') ? (
                  <Radio size={16} className="text-[#60A5FA]" />
                ) : item.sensor.includes('PDF') ? (
                  <FileText size={16} className="text-[#FDBA74]" />
                ) : (
                  <Layers size={16} className="text-[#A8C3A0]" />
                )}
                <span>{item.sensor}</span>
              </span>
              <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#10B981]/20 text-[#6EE7B7] border border-[#10B981]/30">
                {item.status}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/30 border border-white/10 font-mono text-xs space-y-1">
              <span className="text-[10px] text-white/60 block uppercase">Product Identifier:</span>
              <span className="text-[#A8C3A0] block truncate font-semibold">{item.granule}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-white/60 block text-[10px] uppercase font-semibold">Orbit / Pass</span>
                <span className="text-white font-medium">{item.orbit}</span>
              </div>
              <div>
                <span className="text-white/60 block text-[10px] uppercase font-semibold">Resolution</span>
                <span className="text-white font-medium">{item.resolution}</span>
              </div>
              <div>
                <span className="text-white/60 block text-[10px] uppercase font-semibold">Quality Index</span>
                <span className="text-[#6EE7B7] font-medium">{item.cloudScore}</span>
              </div>
              <div>
                <span className="text-white/60 block text-[10px] uppercase font-semibold">Acquisition Timestamp</span>
                <span className="text-white font-mono text-[11px]">{item.timestamp}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 text-[11px] text-white/60">
              Calibration: <span className="text-white/80">{item.calib}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Raw JSON Stream Log Snippet */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Terminal size={14} className="text-[#A8C3A0]" />
            <span>Latest Sensor Normalization Log (STDERR / STDOUT)</span>
          </div>
          <span className="text-[10px] font-mono text-white/60">Execution: 42ms</span>
        </div>

        <pre className="p-4 rounded-xl bg-black/50 border border-white/10 font-mono text-[11px] text-[#A8C3A0] overflow-x-auto leading-relaxed">
{`[2026-04-08T05:36:42Z] INFO: Sen2Cor BOA reflectance atmospheric calibration completed for B04, B08, B11.
[2026-04-08T05:36:43Z] INFO: Raster clipping against KML survey polygon (vertices: 5, area: ${project.mapData.caPlotHa} ha).
[2026-04-08T05:36:44Z] INFO: Spatial pixel mean NDVI computed: ${project.proof.currentNdvi.toFixed(3)} (std_dev: 0.042).
[2026-04-08T05:36:45Z] INFO: Multi-temporal consensus algorithm validated zero shadow/water false positives.`}
        </pre>
      </div>
    </div>
  );
};
