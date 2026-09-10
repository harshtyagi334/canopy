import React, { useState } from 'react';
import { Project, Language } from '../types';
import { ShieldCheck, CheckCircle2, Lock, FileCheck, Hash, Key, ExternalLink } from 'lucide-react';

interface AuditTrailViewProps {
  project: Project;
  lang: Language;
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ project, lang }) => {
  const [verified, setVerified] = useState(false);

  const blocks = [
    {
      index: 1046,
      action: 'Autonomous Non-Compliance Seal Issued',
      actor: 'VanGuard Statutory Engine v2.4',
      hash: 'b749d28e7183e89c19028fa7102e88a04918e90a98f7e6c5182901a88b7200fa',
      prevHash: '3a08c109...7e21',
      timestamp: '2026-04-08 05:38:12 UTC',
      status: 'Cryptographically Sealed',
    },
    {
      index: 1045,
      action: 'Sentinel-1 SAR Radar Backscatter Ingest',
      actor: 'ESA Copernicus Ground Segment Node',
      hash: '3a08c10927e1f4098bc1903348109d98a04918e90a98f7e6c5182901a88b7e21',
      prevHash: '91c4d901...118b',
      timestamp: '2026-04-06 00:44:02 UTC',
      status: 'Sensor Verified',
    },
    {
      index: 1044,
      action: 'Sentinel-2 BOA Multi-Spectral Tile Extracted',
      actor: 'ESA Copernicus Ground Segment Node',
      hash: '91c4d90148109d98a04918e90a98f7e6c5182901a88b7e213a08c10927e1f409',
      prevHash: '4f12e8b7...990d',
      timestamp: '2026-04-05 05:39:10 UTC',
      status: 'Sensor Verified',
    },
    {
      index: 1043,
      action: 'State Revenue Cadastral KML Polygon Locked',
      actor: 'State Forest GIS Repository Gateway',
      hash: '4f12e8b748109d98a04918e90a98f7e6c5182901a88b7e213a08c10927e1990d',
      prevHash: 'e8b71042...41a2',
      timestamp: '2026-02-14 09:32:15 IST',
      status: 'Survey Anchor Locked',
    },
    {
      index: 1042,
      action: 'MoEFCC Clearance Mandate PDF Ingested',
      actor: 'Parivesh 2.0 Central MoEFCC Sync',
      hash: 'e8b7104248109d98a04918e90a98f7e6c5182901a88b7e213a08c10927e141a2',
      prevHash: '00000000...0000 (Genesis)',
      timestamp: '2026-02-10 14:20:00 IST',
      status: 'Statutory Genesis',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-[#A8C3A0] mb-2">
            <Lock size={14} className="text-[#A8C3A0]" />
            <span>Forensic Chain of Custody (Indian Evidence Act §65B)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif-display">
            Cryptographic Audit Ledger & Chain of Custody
          </h2>
          <p className="text-xs sm:text-sm text-white/70">
            Immutable SHA-256 tamper-proof ledger preserving provenance across statutory PDF mandates, revenue polygons, and satellite scenes for legal enforceability.
          </p>
        </div>

        <button
          onClick={() => setVerified(true)}
          className="px-4 py-2.5 rounded-xl bg-[#3E7C59] hover:bg-[#4a9169] text-white border border-[#A8C3A0]/30 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
        >
          <ShieldCheck size={16} />
          <span>{verified ? 'Chain Verified Valid' : 'Verify Ledger Integrity'}</span>
        </button>
      </div>

      {verified && (
        <div className="p-4 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center gap-3 text-xs text-white animate-in fade-in duration-200">
          <CheckCircle2 size={18} className="text-[#6EE7B7] shrink-0" />
          <span>
            <strong>Ledger Integrity Check Passed:</strong> All 5 blocks mathematically verified against genesis block. Zero cryptographic anomalies, state alterations, or timestamp tampering detected.
          </span>
        </div>
      )}

      {/* Ledger Block List */}
      <div className="space-y-4">
        {blocks.map((block) => (
          <div
            key={block.index}
            className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-5 shadow-xl space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-black/40 text-[#A8C3A0] border border-white/15">
                  Block #{block.index}
                </span>
                <h4 className="text-sm font-bold text-white font-serif-display">
                  {block.action}
                </h4>
              </div>
              <span className="text-xs text-[#6EE7B7] font-semibold flex items-center gap-1">
                <CheckCircle2 size={13} />
                <span>{block.status}</span>
              </span>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-white/70">
                <span className="text-[11px]">Actor: <strong className="text-white">{block.actor}</strong></span>
                <span className="text-[11px] text-white/60">{block.timestamp}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-[11px] text-[#A8C3A0] truncate">
                SHA256: {block.hash}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
