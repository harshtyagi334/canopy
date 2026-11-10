import React, { useState } from 'react';
import { Project, Language } from '../types';
import { Terminal, Copy, Check, Code2, Globe, Shield, ArrowUpRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface ApiDocsViewProps {
  project: Project;
  lang: Language;
}

export const ApiDocsView: React.FC<ApiDocsViewProps> = ({ project, lang }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'curl' | 'python' | 'json'>('curl');
  const [copied, setCopied] = useState(false);

  const curlSnippet = `curl -X GET "https://api.geoaudit-ai.gov.in/v1/parcels/${project.id}/telemetry" \\
  -H "Authorization: Bearer YOUR_PARIVESH_API_TOKEN" \\
  -H "Accept: application/json"`;

  const pythonSnippet = `import requests

url = "https://api.geoaudit-ai.gov.in/v1/parcels/${project.id}/telemetry"
headers = {
    "Authorization": "Bearer YOUR_PARIVESH_API_TOKEN",
    "Accept": "application/json"
}

response = requests.get(url, headers=headers)
data = response.json()
print(f"Parcel Status: {data['verdict']['status']}")
print(f"Observed NDVI: {data['proof']['current_ndvi']}")`;

  const jsonSnippet = `{
  "parcel_id": "${project.id}",
  "name": "${project.name}",
  "state": "${project.state}",
  "cadastral": {
    "survey_numbers": "${project.mapData.surveyNumbers}",
    "mandated_ha": ${project.mapData.caPlotHa}
  },
  "verdict": {
    "status": "${project.status}",
    "risk_score": ${project.complianceRiskScore},
    "confidence": ${project.evidenceConfidenceScore}
  },
  "proof": {
    "current_ndvi": ${project.proof.currentNdvi},
    "target_ndvi": ${project.promise.targetNdvi},
    "sar_backscatter_db": "${project.technicalEvidence.sarBackscatterDb}"
  }
}`;

  const currentCode = activeTab === 'curl' ? curlSnippet : activeTab === 'python' ? pythonSnippet : jsonSnippet;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-[#A8C3A0] mb-2">
            <Code2 size={14} className="text-[#A8C3A0]" />
            <span>Developer & Inter-Agency Integration API</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif-display">
            Restful Environmental Telemetry API
          </h2>
          <p className="text-xs sm:text-sm text-white/70">
            Automate statutory CAMPA reporting, ingest satellite evidence into State Forest GIS systems, or query parcel verification status programmatically.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-white/80 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
          <Globe size={14} className="text-[#A8C3A0]" />
          <span>Endpoint: api.vanguard-ai.gov.in</span>
        </div>
      </div>

      {/* Code Snippet Box */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 overflow-hidden shadow-xl">
        {/* Tab Headers */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-black/30">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('curl')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'curl' ? 'bg-[#3E7C59] text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              cURL
            </button>
            <button
              onClick={() => setActiveTab('python')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'python' ? 'bg-[#3E7C59] text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              Python 3
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'json' ? 'bg-[#3E7C59] text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              JSON Response
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white font-mono px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            {copied ? <Check size={13} className="text-[#6EE7B7]" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Code body */}
        <pre className="p-6 bg-black/60 font-mono text-xs text-[#A8C3A0] overflow-x-auto leading-relaxed">
          <code>{currentCode}</code>
        </pre>
      </div>

      {/* Available Endpoints Table */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white font-serif-display">
          Available Rest Endpoints
        </h3>
        <div className="space-y-3">
          {[
            {
              method: 'GET',
              path: '/v1/parcels/{id}/telemetry',
              desc: 'Fetches instantaneous NDVI, NDWI, SAR radar backscatter, and consensus risk score.',
            },
            {
              method: 'POST',
              path: '/v1/parcels/verify-mandate',
              desc: 'Submits a new Clearance PDF and Cadastral KML for autonomous pipeline execution.',
            },
            {
              method: 'GET',
              path: '/v1/parcels/{id}/evidence-bundle.pdf',
              desc: 'Generates a digitally sealed court-admissible PDF audit report.',
            },
          ].map((ep, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-black/25 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold px-2 py-0.5 rounded-md bg-[#10B981]/20 text-[#6EE7B7] border border-[#10B981]/30">
                  {ep.method}
                </span>
                <span className="font-mono font-semibold text-white">{ep.path}</span>
              </div>
              <span className="text-white/70">{ep.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
